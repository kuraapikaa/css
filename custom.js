/* ===== TacoBahis — custom.js =====
 *
 * NE YAPAR:
 *   1) Footer'a lisans bloğu (en alt)
 *   2) Footer'a iletişim kartları (lisansın hemen üstü)
 *   3) Header'a lisans rozeti (logonun sağı)
 *   4) Header'a Telegram + aranma talebi butonları
 *   5) Footer 18+ rozetini etiketler (CSS tutamağı için)
 *
 * NEDEN JS: Site bir React SPA. Elemanlar bir kez eklenirse rota
 * değişiminde React header/footer'ı yeniden çizince kaybolur.
 * MutationObserver bunu izleyip geri koyar.
 *
 * Biçimlendirme custom.css'ten gelir — bu dosya HTML'i basar + kopyalama
 * davranışını bağlar.
 */

(function () {
  'use strict';

  /* ---------- Ayarlar ---------- */

  var SEAL_URL = 'https://i.ibb.co/nNhnhW7n/g-rsel-2026-07-15-043554819.png';

  var VERIFY_URL =
    'https://verification.anjouangamblingboard.org/s/' +
    '93cdb2db440d85925f2939b5e3efe0acde1d6f2384d71ece13f3a940b3256e7fb4069a53385faa5b3cbb398224274d23';

  var CALL_URL = 'https://tacoara.com';
  var TELEGRAM_URL = 'https://t.me/tacoresmi';

  var CONTACTS = [
    { key: 'reklam', baslik: 'Reklam ve Affiliate', mail: 'reklam@tacobahis.com' },
    { key: 'destek', baslik: 'Destek ve Yardım',    mail: 'destek@tacobahis.com' },
    { key: 'talep',  baslik: 'İstek ve Öneriler',   mail: 'talep@tacobahis.com'  }
  ];

  /* ---------- İkonlar ---------- */

  var SVG = {
    shield:
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',

    phone:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.28-.28.68-.36 1.03-.25 ' +
      '1.12.37 2.33.57 3.56.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 ' +
      '0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>' +
      '</svg>',

    telegram:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M21.9 4.3 18.9 19c-.2 1-.8 1.3-1.7.8l-4.6-3.4-2.2 2.1c-.2.2-.5.5-1 .5l.3-4.7 ' +
      '8.6-7.8c.4-.3-.1-.5-.6-.2L6.9 13.1l-4.6-1.4c-1-.3-1-1 .2-1.5l18-6.9c.8-.3 1.5.2 1.4 1z"/>' +
      '</svg>',

    reklam:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M18 11v2h4v-2h-4zm-2.5 7.3 2.4 1.8 1.2-1.6-2.4-1.8-1.2 1.6zM19.1 4.5 17.9 2.9 ' +
      '15.5 4.7l1.2 1.6 2.4-1.8zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.3-.6-2.4-1.5-3.2v6.4c.9-.8 1.5-1.9 1.5-3.2z"/>' +
      '</svg>',

    destek:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 17h-2v-2h2v2zm2.1-7.7-.9.9c-.7.7-1.2 ' +
      '1.3-1.2 2.8h-2v-.5c0-1.1.4-2.1 1.2-2.8l1.2-1.3c.4-.3.6-.8.6-1.4 0-1.1-.9-2-2-2s-2 .9-2 2H8a4 4 0 118 0c0 .9-.4 1.7-.9 2.3z"/>' +
      '</svg>',

    talep:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7 9h10v2H7V9zm6 5H7v-2h6v2zm4-6H7V6h10v2z"/>' +
      '</svg>',

    kopyala:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 ' +
      '2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',

    onay:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>'
  };

  /* ---------- 1) Footer lisans bloğu ---------- */

  var LICENSE_TEXT =
    '<b>tacobahis.com</b>, <b>TacoBahis Entertainment Limited</b> tarafından işletilmektedir. ' +
    'Kayıtlı adres: Hamchako, Mutsamudu, Autonomous Island of Anjouan, Union of Comoros. ' +
    'Bu platform, 2005 tarihli Computer Gaming Licensing Act 007 uyarınca Anjouan Eyaleti ' +
    'Offshore Finance Authority tarafından verilen <b>ALSI-202605014-FI1</b> numaralı lisans ' +
    'ile faaliyet göstermektedir. Tüm lisanslı faaliyetler Anjouan Licensing Services Inc. denetimindedir. ';

  function buildLicense() {
    var box = document.createElement('div');
    box.setAttribute('data-mj', 'footer-license');
    box.innerHTML =
      '<a class="tb-seal" href="' + VERIFY_URL + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + SEAL_URL + '" alt="Anjouan Gambling Board — Geçerli Lisans">' +
      '</a>' +
      '<div class="tb-body">' +
        '<span class="tb-pill">' + SVG.shield + 'Lisanslı Operatör</span>' +
        '<p class="tb-text">' + LICENSE_TEXT +
          '<a href="' + VERIFY_URL + '" target="_blank" rel="noopener noreferrer">Lisansı doğrula →</a>' +
        '</p>' +
      '</div>';
    return box;
  }

  /* ---------- 2) Footer iletişim kartları ---------- */

  function buildContact() {
    var box = document.createElement('div');
    box.setAttribute('data-mj', 'footer-contact');

    var html = '';
    for (var i = 0; i < CONTACTS.length; i++) {
      var c = CONTACTS[i];
      html +=
        '<div class="tb-card">' +
          '<div class="tb-card-head">' + SVG[c.key] + '<span>' + c.baslik + '</span></div>' +
          '<div class="tb-card-body">' +
            '<a class="tb-mail" href="mailto:' + c.mail + '">' + c.mail + '</a>' +
            '<button class="tb-copy" type="button" data-mail="' + c.mail + '" ' +
            'aria-label="' + c.mail + ' adresini kopyala">' + SVG.kopyala + '</button>' +
          '</div>' +
        '</div>';
    }
    box.innerHTML = html;

    var btns = box.querySelectorAll('.tb-copy');
    for (var j = 0; j < btns.length; j++) {
      btns[j].addEventListener('click', onCopy);
    }
    return box;
  }

  function onCopy() {
    var btn = this;
    var mail = btn.getAttribute('data-mail');
    var eski = btn.innerHTML;

    function bildir(basarili) {
      btn.innerHTML = basarili ? SVG.onay : eski;
      if (basarili) btn.classList.add('ok');
      setTimeout(function () {
        btn.innerHTML = eski;
        btn.classList.remove('ok');
      }, 1600);
    }

    // Not: navigator.clipboard yalnızca güvenli bağlamda ve gerçek kullanıcı
    // etkileşiminde çalışır. Başarısız olursa eski textarea yöntemine düşüyoruz;
    // o da olmazsa onay göstermiyoruz — yalancı başarı en kötü seçenek olurdu.
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(mail).then(
        function () { bildir(true); },
        function () { bildir(fallbackCopy(mail)); }
      );
    } else {
      bildir(fallbackCopy(mail));
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function mountFooter() {
    // DİKKAT: footer-content DEĞİL. Orası display:flex/row — bloklar yan
    // sütun olarak sıkışır. Bir üst seviye "footer" display:block, doğru yer.
    var footer = document.querySelector('[data-mj="footer"]');
    if (!footer) return;

    var lic = footer.querySelector(':scope > [data-mj="footer-license"]');
    var con = footer.querySelector(':scope > [data-mj="footer-contact"]');

    // İkisi de doğru sırada yerindeyse dokunma —
    // yoksa observer sonsuz döngüye girer.
    if (con && lic && con.nextElementSibling === lic && lic === footer.lastElementChild) return;

    if (con) con.remove();
    if (lic) lic.remove();

    footer.appendChild(buildContact());
    footer.appendChild(buildLicense());
  }

  /* ---------- 3) Header lisans rozeti ---------- */

  function mountHeaderSeal() {
    if (document.querySelector('[data-mj="header-seal"]')) return;

    var logo = document.querySelector('[data-mj="logo"]');
    if (!logo) return;

    var logoWrap = logo.parentElement;
    if (!logoWrap || !logoWrap.parentElement) return;

    var wrap = document.createElement('div');
    wrap.className = logoWrap.className;
    wrap.innerHTML =
      '<a data-mj="header-seal" href="' + VERIFY_URL + '" target="_blank" ' +
      'rel="noopener noreferrer" aria-label="Lisans doğrulama">' +
      '<img src="' + SEAL_URL + '" alt="Anjouan Gambling Board — Geçerli Lisans">' +
      '</a>';

    // Logodan hemen sonra: logo → rozet → arama
    logoWrap.parentElement.insertBefore(wrap, logoWrap.nextSibling);
  }

  /* ---------- 4) Header butonları ---------- */

  function buildIconButton(name, href, label, svg) {
    var a = document.createElement('a');
    a.setAttribute('data-mj', name);
    a.setAttribute('href', href);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('aria-label', label);
    a.innerHTML = svg;
    return a;
  }

  function mountHeaderButtons() {
    var special = document.querySelector('[data-mj="header-special-button"]');
    if (!special) return;

    var megaWrap = special.parentElement;
    if (!megaWrap || !megaWrap.parentElement) return;

    // Sırayla: Telegram → Aranma → Promosyon(megafon)
    // Sarmalayıcı sınıfı runtime'da megafondan kopyalanır; sabit yazsaydık
    // site yeni derleme yapıp hash'li sınıfı değiştirdiğinde boşluk bozulurdu.
    if (!document.querySelector('[data-mj="header-call-button"]')) {
      var cw = document.createElement('div');
      cw.className = megaWrap.className;
      cw.appendChild(buildIconButton('header-call-button', CALL_URL, 'Aranma talebi', SVG.phone));
      megaWrap.parentElement.insertBefore(cw, megaWrap);
    }

    if (!document.querySelector('[data-mj="header-telegram-button"]')) {
      var call = document.querySelector('[data-mj="header-call-button"]');
      var callWrap = call ? call.parentElement : megaWrap;
      var tw = document.createElement('div');
      tw.className = megaWrap.className;
      tw.appendChild(buildIconButton('header-telegram-button', TELEGRAM_URL, 'Telegram kanalımız', SVG.telegram));
      callWrap.parentElement.insertBefore(tw, callWrap);
    }
  }

  /* ---------- 5) Footer 18+ rozetini etiketle ---------- */

  // Rozetin sitede data-mj'si yok, sadece hash'li bir sınıfı var
  // (app-ltr-...) ve o her derlemede değişebilir. Metninden bulup kendi
  // tutamağımızı takıyoruz; biçimlendirmeyi custom.css yapıyor.
  function tagAgeBadge() {
    var footer = document.querySelector('[data-mj="footer"]');
    if (!footer) return;
    if (footer.querySelector('[data-mj="footer-age-badge"]')) return;

    var divs = footer.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++) {
      if (divs[i].children.length === 0 && divs[i].textContent.trim() === '18+') {
        divs[i].setAttribute('data-mj', 'footer-age-badge');
        return;
      }
    }
  }

  /* ---------- Bağlama ---------- */

  function mountAll() {
    mountFooter();
    mountHeaderSeal();
    mountHeaderButtons();
    tagAgeBadge();
  }

  function start() {
    mountAll();
    new MutationObserver(mountAll).observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
