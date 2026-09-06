/*!
 * narcos-atif.js — TAKIP LINKI ATIFI (Narcos paneli: panel.narcosbahis.vip)
 *
 * Ne yapar:
 *   1. Adresteki `btag` (ve varsa `clickid`, `sub1..sub5`) parametresini
 *      yakalar; 90 gun localStorage + cerezde saklar. SPA gezinmesi ve
 *      sayfa yenilemesi parametreyi kaybettirmez.
 *   2. `?btag=` ile dogrudan gelen ziyareti panele TIKLAMA olarak bildirir
 *      (clickId'yi kendisi uretir; /t/… uzerinden gelenlerde clickid zaten
 *      var, tekrar bildirmez).
 *   3. Kayit formunda promosyon/btag alani varsa ve bossa btag ile doldurur
 *      (Lynon'un kendi BTag atifi da calissin).
 *   4. UYELIGI tespit eder ve panele bildirir:
 *        a) kayit ucuna giden fetch/XHR 2xx donunce (URL: register/signup…)
 *        b) /api/v1/me cevabinda son 15 dk icinde acilmis hesap gorunce
 *      Kullanici adi once yanit govdesinden, yoksa /api/v1/me'den alinir.
 *      Ayni kullanici bir kez bildirilir.
 *
 * Panelle iletisim `navigator.sendBeacon` (yedek: fetch no-cors, text/plain):
 * preflight yok, CORS gerekmez, yanit okunmaz. Bu betik baska bir affiliate
 * betigine (attrib.js) dokunmaz; kendi anahtarlarini kullanir (ng_atif*).
 *
 * Canli kumar sitesi: her sey try/catch icinde, hata sayfayi bozmaz.
 */
(function () {
  "use strict";
  if (window.__narcosAtif) return;
  window.__narcosAtif = { surum: "2026-09-06a" };

  var PANEL = "https://panel.narcosbahis.vip";
  var ANAHTAR = "ng_atif";            // localStorage + cerez
  var KAYIT_ANAHTARI = "ng_atif_kayit"; // bildirilen kullanici adi
  var GUN_MS = 24 * 60 * 60 * 1000;
  var SAKLAMA_MS = 90 * GUN_MS;
  var YENI_HESAP_MS = 15 * 60 * 1000;
  var KAYIT_UCU = /regist|sign-?up|signup|create-?account|uye-?ol|kayit/i;
  var ME_UCU = /\/api\/v1\/me(\?|$)/i;
  var AD_ALANLARI = /^(username|userName|user_name|login|userLogin|nickname|nickName|memberName|accountName)$/;
  var ID_ALANLARI = /^(id|userId|user_id|playerId|player_id|clientId|client_id)$/;
  var TARIH_ALANLARI = /regist|creat|kayit|signup/i;

  /* ---------- yardimcilar ---------- */
  function guvenli(fn) { try { return fn(); } catch (e) { return undefined; } }
  function rastgeleId() {
    var c = "abcdefghijklmnopqrstuvwxyz0123456789", s = "";
    var arr = guvenli(function () { return window.crypto && crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(20)) : null; });
    for (var i = 0; i < 20; i++) s += c.charAt(arr ? arr[i] % c.length : Math.floor(Math.random() * c.length));
    return "ng" + s;
  }
  function cerezOku(ad) {
    var m = document.cookie.match(new RegExp("(?:^|; )" + ad + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function cerezYaz(ad, deger, ms) {
    var d = new Date(Date.now() + ms);
    var host = location.hostname.replace(/^www\./, "");
    document.cookie = ad + "=" + encodeURIComponent(deger) + "; expires=" + d.toUTCString() + "; path=/; domain=." + host + "; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    // Alan adi cerezi reddedilirse (localhost vb.) host'suz dene.
    if (!cerezOku(ad)) document.cookie = ad + "=" + encodeURIComponent(deger) + "; expires=" + d.toUTCString() + "; path=/; SameSite=Lax";
  }
  function depoOku() {
    var ham = guvenli(function () { return localStorage.getItem(ANAHTAR); }) || cerezOku(ANAHTAR);
    if (!ham) return null;
    var v = guvenli(function () { return JSON.parse(ham); });
    if (!v || !v.btag || !v.t || Date.now() - v.t > SAKLAMA_MS) return null;
    return v;
  }
  function depoYaz(v) {
    var ham = JSON.stringify(v);
    guvenli(function () { localStorage.setItem(ANAHTAR, ham); });
    guvenli(function () { cerezYaz(ANAHTAR, ham, SAKLAMA_MS); });
  }
  function sorguParametreleri() {
    var out = {};
    function topla(qs) {
      if (!qs) return;
      qs.replace(/^\?/, "").split("&").forEach(function (cift) {
        if (!cift) return;
        var i = cift.indexOf("=");
        var k = decodeURIComponent((i < 0 ? cift : cift.slice(0, i)).replace(/\+/g, " "));
        var v = decodeURIComponent((i < 0 ? "" : cift.slice(i + 1)).replace(/\+/g, " "));
        if (k && !(k in out)) out[k] = v;
      });
    }
    topla(location.search);
    var h = location.hash || "";
    var qi = h.indexOf("?");
    if (qi >= 0) topla(h.slice(qi));
    return out;
  }
  function gonder(yol, veri) {
    var govde = JSON.stringify(veri);
    var url = PANEL + yol;
    var ok = guvenli(function () {
      if (navigator.sendBeacon) return navigator.sendBeacon(url, new Blob([govde], { type: "text/plain" }));
      return false;
    });
    if (!ok) guvenli(function () {
      fetch(url, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain" }, body: govde });
    });
  }
  function temiz(v, n) { return String(v == null ? "" : v).trim().slice(0, n || 64); }
  function altParametreler(q) {
    var alt = {};
    ["sub1", "sub2", "sub3", "sub4", "sub5"].forEach(function (k) { if (q[k]) alt[k] = temiz(q[k], 64); });
    return alt;
  }

  /* ---------- 1-2. btag yakala + inis bildir ---------- */
  var durum = depoOku();
  function parametreleriIsle() {
    var q = sorguParametreleri();
    var btag = temiz(q.btag || q.bTag || q.BTag || q.BTAG, 64);
    if (!btag || !/^[A-Za-z0-9_.-]{1,64}$/.test(btag)) return;
    var clickid = temiz(q.clickid || q.clickId || q.click_id, 64);
    var ayni = durum && durum.btag.toLowerCase() === btag.toLowerCase() && (!clickid || durum.clickId === clickid);
    if (ayni) return;
    var yeni = { btag: btag, clickId: clickid || rastgeleId(), alt: altParametreler(q), t: Date.now(), inis: location.pathname };
    durum = yeni;
    depoYaz(yeni);
    // /t/... yonlendirmesinden geldiyse tiklama panelde zaten kayitli.
    if (!clickid) {
      var veri = { btag: btag, clickid: yeni.clickId, sayfa: location.pathname + location.search };
      for (var k in yeni.alt) veri[k] = yeni.alt[k];
      gonder("/api/affiliate/atif/tiklama", veri);
    }
  }
  guvenli(parametreleriIsle);
  // SPA: hash/rota degisiminde parametre gelebilir.
  window.addEventListener("hashchange", function () { guvenli(parametreleriIsle); });
  guvenli(function () {
    var ps = history.pushState, rs = history.replaceState;
    history.pushState = function () { var r = ps.apply(this, arguments); setTimeout(function () { guvenli(parametreleriIsle); }, 0); return r; };
    history.replaceState = function () { var r = rs.apply(this, arguments); setTimeout(function () { guvenli(parametreleriIsle); }, 0); return r; };
  });

  /* ---------- 3. kayit formunda promosyon/btag alanini doldur ---------- */
  var ALAN_DESENI = /btag|b_tag|promo|affiliate|referr|ref_?code|davet/i;
  function alanlariDoldur() {
    if (!durum) return;
    var girdiler = document.querySelectorAll("input[type=text], input:not([type])");
    for (var i = 0; i < girdiler.length; i++) {
      var g = girdiler[i];
      var kimlik = (g.name || "") + " " + (g.id || "") + " " + (g.placeholder || "") + " " + (g.getAttribute("formcontrolname") || "") + " " + (g.getAttribute("data-mj") || "");
      if (!ALAN_DESENI.test(kimlik) || /password|sifre|email|phone|telefon/i.test(kimlik)) continue;
      if (g.value || g.getAttribute("data-ng-atif")) continue;
      g.setAttribute("data-ng-atif", "1");
      var ayarla = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
      if (ayarla && ayarla.set) ayarla.set.call(g, durum.btag); else g.value = durum.btag;
      g.dispatchEvent(new Event("input", { bubbles: true }));
      g.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }
  guvenli(function () {
    alanlariDoldur();
    if (window.MutationObserver) {
      var bekleyen = null;
      new MutationObserver(function () {
        if (bekleyen) return;
        bekleyen = setTimeout(function () { bekleyen = null; guvenli(alanlariDoldur); }, 300);
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
  });

  /* ---------- 4. uyeligi tespit et ---------- */
  function nesnedeBul(veri, desen, kabul) {
    var bulunan = null, derinlik = 0;
    (function gez(o) {
      if (bulunan || o == null || derinlik > 6) return;
      if (Array.isArray(o)) { derinlik++; for (var i = 0; i < o.length && !bulunan; i++) gez(o[i]); derinlik--; return; }
      if (typeof o !== "object") return;
      for (var k in o) {
        if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
        var v = o[k];
        if (desen.test(k) && kabul(v)) { bulunan = v; return; }
        if (v && typeof v === "object") { derinlik++; gez(v); derinlik--; if (bulunan) return; }
      }
    })(veri);
    return bulunan;
  }
  var metinMi = function (v) { return typeof v === "string" && v.trim(); };
  var kimlikMi = function (v) { return (typeof v === "string" && /^\d{3,}$/.test(v)) || (typeof v === "number" && v > 0); };
  function kullaniciAdi(veri) { var v = nesnedeBul(veri, AD_ALANLARI, metinMi); return v ? String(v).trim() : null; }
  function oyuncuId(veri) { var v = nesnedeBul(veri, ID_ALANLARI, kimlikMi); return v ? String(v) : null; }
  function yeniHesapMi(veri) {
    var t = nesnedeBul(veri, TARIH_ALANLARI, function (v) { return typeof v === "string" && !isNaN(Date.parse(v)); });
    if (!t) return false;
    var fark = Date.now() - Date.parse(t);
    return fark > -5 * 60 * 1000 && fark < YENI_HESAP_MS;
  }

  var bildirimKilidi = false;
  function kayitBildir(ad, id, sinyal) {
    if (!durum || !ad) return;
    var anahtar = ad.toLowerCase();
    var onceki = guvenli(function () { return localStorage.getItem(KAYIT_ANAHTARI); }) || cerezOku(KAYIT_ANAHTARI);
    if (onceki === anahtar) return;
    guvenli(function () { localStorage.setItem(KAYIT_ANAHTARI, anahtar); });
    guvenli(function () { cerezYaz(KAYIT_ANAHTARI, anahtar, SAKLAMA_MS); });
    gonder("/api/affiliate/atif/kayit", {
      btag: durum.btag, clickid: durum.clickId, username: ad, playerId: id || "",
      sinyal: sinyal, sayfa: location.pathname
    });
  }
  function meIleTamamla(sinyal) {
    if (bildirimKilidi) return;
    bildirimKilidi = true;
    var deneme = 0;
    (function dene() {
      fetch("/api/v1/me", { credentials: "same-origin", headers: { Accept: "application/json" } })
        .then(function (y) { return y.ok ? y.json() : null; })
        .then(function (veri) {
          var ad = veri && kullaniciAdi(veri);
          if (ad) { kayitBildir(ad, oyuncuId(veri), sinyal); bildirimKilidi = false; return; }
          if (deneme++ < 6) setTimeout(dene, 1500); else bildirimKilidi = false;
        })
        .catch(function () { if (deneme++ < 6) setTimeout(dene, 1500); else bildirimKilidi = false; });
    })();
  }
  function yanitiIncele(url, durumKodu, govdeMetni, istekGovdesi) {
    if (!durum) return;
    var veri = govdeMetni ? guvenli(function () { return JSON.parse(govdeMetni); }) : null;
    if (KAYIT_UCU.test(url) && durumKodu >= 200 && durumKodu < 300) {
      // Basarisiz kayit da 200 donebilir (hata govdede); acik hata varsa gec.
      if (veri && (veri.error === true || veri.HasError === true || veri.success === false || veri.status === "error")) return;
      var ad = (veri && kullaniciAdi(veri)) || (istekGovdesi && kullaniciAdi(guvenli(function () { return JSON.parse(istekGovdesi); }) || {}));
      if (ad) kayitBildir(ad, oyuncuId(veri), "kayit-ucu"); else meIleTamamla("kayit-ucu");
      return;
    }
    if (ME_UCU.test(url) && veri && yeniHesapMi(veri)) {
      var meAd = kullaniciAdi(veri);
      if (meAd) kayitBildir(meAd, oyuncuId(veri), "me-tarihi");
    }
  }

  // fetch kancasi: istegi DEGISTIRMEZ, yanitin kopyasini okur.
  guvenli(function () {
    if (typeof window.fetch !== "function") return;
    var asil = window.fetch;
    window.fetch = function (girdi, secenek) {
      var url = typeof girdi === "string" ? girdi : (girdi && girdi.url) || "";
      var istekGovdesi = secenek && typeof secenek.body === "string" ? secenek.body : null;
      var p = asil.apply(this, arguments);
      if (durum && (KAYIT_UCU.test(url) || ME_UCU.test(url))) {
        p.then(function (y) {
          guvenli(function () { y.clone().text().then(function (m) { yanitiIncele(url, y.status, m, istekGovdesi); }).catch(function () {}); });
        }).catch(function () {});
      }
      return p;
    };
  });
  // XHR kancasi
  guvenli(function () {
    var ac = XMLHttpRequest.prototype.open, yolla = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (yontem, url) { this.__ngUrl = String(url || ""); return ac.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function (govde) {
      var x = this, url = x.__ngUrl || "";
      if (durum && (KAYIT_UCU.test(url) || ME_UCU.test(url))) {
        x.addEventListener("load", function () {
          guvenli(function () { yanitiIncele(url, x.status, x.responseType === "" || x.responseType === "text" ? x.responseText : "", typeof govde === "string" ? govde : null); });
        });
      }
      return yolla.apply(this, arguments);
    };
  });
  // Kayit formu gonderimi (fetch/XHR yakalanamazsa yedek): basari gorunmese de
  // 4 sn sonra /me'den yeni hesap kontrolu.
  document.addEventListener("submit", function (e) {
    if (!durum) return;
    var f = e.target;
    var kimlik = ((f && f.getAttribute && (f.getAttribute("name") || f.getAttribute("id") || f.getAttribute("action") || f.getAttribute("data-mj"))) || "") + " " + location.pathname;
    if (!KAYIT_UCU.test(kimlik)) return;
    setTimeout(function () {
      fetch("/api/v1/me", { credentials: "same-origin", headers: { Accept: "application/json" } })
        .then(function (y) { return y.ok ? y.json() : null; })
        .then(function (veri) { if (veri && yeniHesapMi(veri)) { var ad = kullaniciAdi(veri); if (ad) kayitBildir(ad, oyuncuId(veri), "form"); } })
        .catch(function () {});
    }, 4000);
  }, true);
})();
