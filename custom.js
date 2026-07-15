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

  // Footer rozeti: kalkan + "VALID" yazısı. 120px'te okunuyor.
  var SEAL_URL = 'https://i.ibb.co/nNhnhW7n/g-rsel-2026-07-15-043554819.png';

  // Header rozeti: yazısız kalkan + onay tiki. Ayrı görsel olması şart —
  // yazılı sürüm 34px'te okunaksız bir lekeye dönüşüyordu.
  var HEADER_SEAL_URL = 'https://i.ibb.co/Q33Y12rq/anjouan-shield-check-128.png';

  var VERIFY_URL =
    'https://verification.anjouangamblingboard.org/s/' +
    '93cdb2db440d85925f2939b5e3efe0acde1d6f2384d71ece13f3a940b3256e7fb4069a53385faa5b3cbb398224274d23';

  var CALL_URL = 'https://tacoara.com';
  var TELEGRAM_URL = 'https://t.me/tacoresmi';
  var MIRROR_URL = 'https://tacogir.com';

  var CONTACTS = [
    { key: 'reklam', baslik: 'Reklam ve Affiliate', mail: 'reklam@tacobahis.com' },
    { key: 'destek', baslik: 'Destek ve Yardım',    mail: 'destek@tacobahis.com' },
    { key: 'talep',  baslik: 'İstek ve Öneriler',   mail: 'talep@tacobahis.com'  }
  ];

  var PROMOS = [
    {
      ikon: 'globe',
      href: MIRROR_URL,
      baslik: 'Güncel Adres',
      metin: 'Her zaman güncel adresimize <b>tacogir.com</b> adresinden ulaşabilirsiniz'
    },
    {
      ikon: 'telegram',
      href: TELEGRAM_URL,
      baslik: 'Telegram Kanalı',
      metin: 'Telegram kanalımıza katılın, <b>sürpriz hediyeler</b> kazanın!'
    }
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
      '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>',

    globe:
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 6h-2.9a15.7 15.7 0 00-1.4-3.6A8 8 0 0118.9 8zM12 ' +
      '4c.8 1.2 1.4 2.5 1.8 4h-3.6c.4-1.5 1-2.8 1.8-4zM4.3 14a8.2 8.2 0 010-4h3.4a16.6 16.6 0 000 4H4.3zm.8 ' +
      '2h2.9c.3 1.3.8 2.5 1.4 3.6A8 8 0 015.1 16zm2.9-8H5.1a8 8 0 014.3-3.6A15.7 15.7 0 008 8zM12 20c-.8-1.2-1.4-2.5-1.8-4h3.6c-.4 ' +
      '1.5-1 2.8-1.8 4zm2.2-6H9.8a14.6 14.6 0 010-4h4.4a14.6 14.6 0 010 4zm.3 5.6c.6-1.1 1.1-2.3 1.4-3.6h2.9a8 8 0 ' +
      '01-4.3 3.6zm1.8-5.6a16.6 16.6 0 000-4h3.4a8.2 8.2 0 010 4h-3.4z"/></svg>',

    ok:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M5 12h14M13 6l6 6-6 6"/></svg>'
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
    // Bloklar footer'a doğrudan eklenir; görsel sıralama custom.css'teki
    // order kurallarıyla yapılır (bkz. "Footer dizilimi" kuralı).
    var footer = document.querySelector('[data-mj="footer"]');
    if (!footer) return;

    var sea = footer.querySelector(':scope > [data-mj="footer-seal"]');
    var pro = footer.querySelector(':scope > [data-mj="footer-promo"]');
    var con = footer.querySelector(':scope > [data-mj="footer-contact"]');
    var lic = footer.querySelector(':scope > [data-mj="footer-license"]');

    // Dördü de yerindeyse dokunma — yoksa observer sonsuz döngüye girer.
    if (sea && pro && con && lic) return;

    if (sea) sea.remove();
    if (pro) pro.remove();
    if (con) con.remove();
    if (lic) lic.remove();

    footer.appendChild(buildFooterSeal());
    footer.appendChild(buildPromo());
    footer.appendChild(buildContact());
    footer.appendChild(buildLicense());
  }

  /* ---------- 3) Footer promo kartları ---------- */

  function buildPromo() {
    var box = document.createElement('div');
    box.setAttribute('data-mj', 'footer-promo');

    var html = '';
    for (var i = 0; i < PROMOS.length; i++) {
      var p = PROMOS[i];
      html +=
        '<a class="tb-promo" href="' + p.href + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="tb-promo-ico">' + SVG[p.ikon] + '</span>' +
          '<span class="tb-promo-txt">' +
            '<span class="tb-promo-t">' + p.baslik + '</span>' +
            '<span class="tb-promo-d">' + p.metin + '</span>' +
          '</span>' +
          '<span class="tb-promo-ok">' + SVG.ok + '</span>' +
        '</a>';
    }
    box.innerHTML = html;
    return box;
  }

  /* ---------- 4) Footer lisans rozeti (logonun üstü) ---------- */

  function buildFooterSeal() {
    var a = document.createElement('a');
    a.setAttribute('data-mj', 'footer-seal');
    a.setAttribute('href', VERIFY_URL);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('aria-label', 'Lisans doğrulama');
    a.innerHTML =
      '<img src="' + HEADER_SEAL_URL + '" alt="Anjouan Gambling Board — Geçerli Lisans">';
    return a;
  }

  /* ---------- 5) Header lisans rozeti ---------- */

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
      '<img src="' + HEADER_SEAL_URL + '" alt="Anjouan Gambling Board — Geçerli Lisans">' +
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

  /* ---------- Buton ölçüsünü megafona eşitle ---------- */

  // Site medya sorgusu KULLANMIYOR: kırılma noktasını JS ile algılayıp
  // megafona farklı bir Emotion sınıfı veriyor (masaüstü app-ltr-t43yhk /
  // mobil app-ltr-yrnpgg → 40px/16px vs 32px/8px). Kopyalanacak bir @media
  // yok ve kırılma noktasını tahmin edip sabitlemek kırılgan olurdu.
  //
  // Bu yüzden ölçüyü çalışma anında megafondan okuyup CSS değişkenlerine
  // yazıyoruz. Site ne yaparsa yapsın butonlarımız takip eder.
  function syncButtonSize() {
    var ref = document.querySelector('[data-mj="header-special-button"]');
    if (!ref) return;

    var cs = getComputedStyle(ref);
    if (cs.width === 'auto' || cs.width === '0px') return;

    var icon = ref.querySelector('img, svg');
    var root = document.documentElement;

    root.style.setProperty('--tb-btn-size', cs.width);
    root.style.setProperty('--tb-btn-radius', cs.borderTopLeftRadius);
    root.style.setProperty('--tb-btn-pad', cs.paddingTop);
    root.style.setProperty('--tb-btn-icon', icon ? getComputedStyle(icon).width : '24px');
  }

  /* ---------- Bağlama ---------- */

  function mountAll() {
    mountFooter();
    mountHeaderSeal();
    mountHeaderButtons();
    tagAgeBadge();
    syncButtonSize();
  }

  function start() {
    mountAll();
    new MutationObserver(mountAll).observe(document.body, {
      childList: true,
      subtree: true
    });

    // Yeniden boyutlandırmada React megafonu değiştirir ama bu her zaman
    // bir mutasyon üretmeyebilir — ölçü senkronunu ayrıca tetikliyoruz.
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(syncButtonSize, 120);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
