/* ===== TacoBahis — custom.js =====
 *
 * NE YAPAR:
 *   1) Footer'a lisans bloğu (en alt)
 *   2) Footer'a iletişim kartları (lisansın hemen üstü)
 *   3) Header'a lisans rozeti (logonun sağı)
 *   4) Header'a Telegram + aranma talebi butonları
 *   5) Footer 18+ rozetini etiketler (CSS tutamağı için)
 *   6) Ana sayfada kategori kartlarının altına güven/hizmet paneli
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

  // Header + footer rozeti: yazısız kalkan, beyaz hilal/yıldızlar, onay tiki.
  // Yazılı sürümden ayrı olması şart — o, 34px'te okunaksız bir lekeye dönüşüyordu.
  var HEADER_SEAL_URL = 'https://i.ibb.co/YKVjFR8/anjouan-shield-check-256.png';

  var VERIFY_URL =
    'https://verification.anjouangamblingboard.org/s/' +
    '93cdb2db440d85925f2939b5e3efe0acde1d6f2384d71ece13f3a940b3256e7fb4069a53385faa5b3cbb398224274d23';

  var CALL_URL = 'https://tacoara.com';
  var TELEGRAM_URL = 'https://t.me/tacoresmi';
  var MIRROR_URL = 'https://tacogir.com';
  var TRUST_LOGO_URL =
    'https://tacobahis551.com/api/cmsgateway/api/v1.0/AssetsSite/' +
    'eec59f1e-d34c-4401-848a-ef80e22e3b9c';

  var CONTACTS = [
    { key: 'reklam', baslik: 'Reklam ve Affiliate', mail: 'reklam@tacobahis.com' },
    { key: 'destek', baslik: 'Destek ve Yardım',    mail: 'destek@tacobahis.com' },
    { key: 'talep',  baslik: 'İstek ve Öneriler',   mail: 'talep@tacobahis.com'  }
  ];

  // Vizyon / misyon metinleri — düzenlemek isterseniz burası.
  var ABOUT = [
    {
      baslik: 'Vizyonumuz',
      paragraflar: [
        'TacoBahis olarak vizyonumuz; yenilikçi teknoloji, güçlü altyapı ve şeffaf hizmet anlayışıyla çevrim içi oyun ve spor bahisleri sektöründe güvenin ve kalitenin simgesi olmaktır.',
        'Hızlı ödeme sistemleri, adil oyun politikası ve güçlü kullanıcı deneyimiyle global ölçekte tercih edilen, güvenli ve sürdürülebilir büyüyen lider bir marka olmayı hedefliyoruz.'
      ]
    },
    {
      baslik: 'Misyonumuz',
      paragraflar: [
        'TacoBahis’in misyonu; üyelerine 7/24 kesintisiz hizmet sunmak, yüksek oranlar ve avantajlı kampanyalar sağlamak, hızlı ve güvenilir ödeme altyapısıyla memnuniyeti en üst seviyeye çıkarmaktır.',
        'Şeffaflık, adalet ve güçlü teknolojik altyapı ile güvenli, hızlı ve sorunsuz bir oyun deneyimi sunmayı hedefler.'
      ]
    }
  ];

  // Resmi kanallar
  var CHANNELS = [
    { ikon: 'telegram', href: TELEGRAM_URL, etiket: 'Telegram', deger: '@tacoresmi' },
    { rozet: 'WWW',     href: MIRROR_URL,   etiket: 'Her zaman güncel', deger: 'tacogir.com' }
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
      '<path d="M5 12h14M13 6l6 6-6 6"/></svg>',

    disari:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M7 17 17 7M9 7h8v8"/></svg>',

    trustPayment:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="2.5" y="5" width="19" height="14" rx="3"/>' +
      '<path d="M2.5 9h19M6.5 14.5h4"/></svg>',

    trustOdds:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="m3 17 5.2-5.2 3.7 3.7L21 6.4"/>' +
      '<path d="M15.5 6.4H21v5.5"/></svg>',

    trustSupport:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M4 13v-2a8 8 0 0 1 16 0v2"/>' +
      '<path d="M6.5 17H5a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h1.5v5Zm11 0H19a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1.5v5Z"/>' +
      '<path d="M17.5 17c-.7 2-2.4 3-5 3H11"/></svg>',

    trustVerified:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="m12 2 2.4 2 3.1-.1.7 3 2.5 1.8-1.2 2.9 1.2 2.9-2.5 1.8-.7 3-3.1-.1-2.4 2-2.4-2-3.1.1-.7-3-2.5-1.8 1.2-2.9-1.2-2.9 2.5-1.8.7-3 3.1.1L12 2Z"/>' +
      '<path d="m8.2 11.7 2.4 2.4 5.2-5.2"/></svg>'
  };

  /* ---------- 1) Footer lisans bloğu ---------- */

  var LICENSE_TEXT =
    '<b>tacobahis.com</b>, Anjouan Birliği’nin Mutsamudu bölgesinde kayıtlı ' +
    '<b>TacoBahis Entertainment Limited</b> tarafından işletilmektedir. Platform, Anjouan ' +
    'Eyaleti Offshore Finance Authority tarafından Computer Gaming Licensing Act 007 of 2005 ' +
    'kapsamında düzenlenen <b>ALSI-202605014-FI1</b> numaralı geçerli internet oyun lisansı ' +
    'ile faaliyet göstermektedir.';

  function buildLicense() {
    var box = document.createElement('div');
    box.setAttribute('data-mj', 'footer-license');
    box.innerHTML =
      '<span class="tb-lic-kicker">Düzenlemeler ve İş Ortakları</span>' +
      '<a class="tb-seal" href="' + VERIFY_URL + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + SEAL_URL + '" alt="Anjouan Gambling Board — Geçerli Lisans">' +
        '<span class="tb-seal-hint">Doğrulamak için tıklayın</span>' +
      '</a>' +
      '<p class="tb-text">' + LICENSE_TEXT + '</p>' +
      '<a class="tb-lic-btn" href="' + VERIFY_URL + '" target="_blank" rel="noopener noreferrer">' +
        'Lisans durumunu doğrula' + SVG.ok +
      '</a>';
    return box;
  }

  /* ---------- 3) Vizyon / misyon kartları ---------- */

  function buildAbout() {
    var box = document.createElement('div');
    box.setAttribute('data-mj', 'footer-about');

    var html =
      '<div class="tb-about-brand">' +
        '<img src="' + TRUST_LOGO_URL + '" alt="TacoBahis" loading="lazy" decoding="async">' +
      '</div>';
    for (var i = 0; i < ABOUT.length; i++) {
      var a = ABOUT[i];
      var p = '';
      for (var j = 0; j < a.paragraflar.length; j++) {
        p += '<p>' + a.paragraflar[j] + '</p>';
      }
      if (i > 0) html += '<span class="tb-about-rule" aria-hidden="true"></span>';
      html +=
        '<div class="tb-about">' +
          '<h3>' + a.baslik + '</h3>' +
          p +
        '</div>';
    }
    box.innerHTML = html;
    return box;
  }

  /* ---------- 3b) Resmi kanallar ---------- */

  function buildChannels() {
    var box = document.createElement('div');
    box.setAttribute('data-mj', 'footer-channels');

    var kartlar = '';
    for (var i = 0; i < CHANNELS.length; i++) {
      var c = CHANNELS[i];
      var icoInner = c.ikon ? SVG[c.ikon] : c.rozet;
      kartlar +=
        '<a class="tb-ch" href="' + c.href + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="tb-ch-ico' + (c.ikon ? ' tb-ch-ico--svg' : '') + '">' + icoInner + '</span>' +
          '<span class="tb-ch-txt">' +
            '<span class="tb-ch-label">' + c.etiket + '</span>' +
            '<span class="tb-ch-value">' + c.deger + '</span>' +
          '</span>' +
          '<span class="tb-ch-ok">' + SVG.disari + '</span>' +
        '</a>';
    }

    box.innerHTML =
      '<div class="tb-ch-head">' +
        '<span class="tb-ch-kicker">TacoBahis Resmi Kanalları</span>' +
        '<strong class="tb-ch-title">Sosyal medya hesaplarımız</strong>' +
      '</div>' +
      '<div class="tb-ch-list">' + kartlar + '</div>';
    return box;
  }

  /* ---------- 3c) Footer iletişim kartları ---------- */

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
      if (!basarili) return;          // yalancı başarı göstermiyoruz
      btn.innerHTML = SVG.onay;
      btn.classList.add('ok');
      setTimeout(function () {
        btn.innerHTML = eski;
        btn.classList.remove('ok');
      }, 1600);
    }

    // navigator.clipboard yalnızca güvenli bağlamda ve gerçek kullanıcı
    // etkileşiminde çalışır; başarısızsa eski textarea yöntemine düşüyoruz.
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

  function syncCopyrightYear(footer) {
    var bottom = footer.querySelector('[data-mj="footer-bottom"]');
    if (!bottom) return;

    var text = (bottom.textContent || '').replace(/\s+/g, ' ').trim();
    if (text.indexOf('TacoBahis') === -1 ||
        text.indexOf('Tüm hakları saklıdır') === -1) return;

    var walker = document.createTreeWalker(bottom, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      node.nodeValue = node.nodeValue.replace(/\b20\d{2}\b/g, '2023');
    }
  }

  /* ---------- Footer bloklarını bağla ---------- */

  function mountFooter() {
    // Bloklar footer'a doğrudan eklenir; görsel sıralama custom.css'teki
    // order kurallarıyla yapılır (bkz. "Footer dizilimi" kuralı).
    var footer = document.querySelector('[data-mj="footer"]');
    if (!footer) return;
    syncCopyrightYear(footer);

    var bra = footer.querySelector(':scope > [data-mj="footer-brand"]');
    var abo = footer.querySelector(':scope > [data-mj="footer-about"]');
    var chn = footer.querySelector(':scope > [data-mj="footer-channels"]');
    var con = footer.querySelector(':scope > [data-mj="footer-contact"]');
    var lic = footer.querySelector(':scope > [data-mj="footer-license"]');
    var cta = footer.querySelector(':scope > [data-mj="footer-cta"]');
    var aboLogo = abo && abo.querySelector('.tb-about-brand img');

    // Önceki sürümden kalmış gizli CTA varsa temizle.
    if (cta) cta.remove();

    // Hepsi yerindeyse dokunma — yoksa observer sonsuz döngüye girer.
    if (bra && abo && aboLogo && chn && con && lic) return;

    if (bra) bra.remove();
    if (abo) abo.remove();
    if (chn) chn.remove();
    if (con) con.remove();
    if (lic) lic.remove();
    var brand = buildFooterBrand();
    if (brand) footer.appendChild(brand);
    footer.appendChild(buildAbout());
    footer.appendChild(buildChannels());
    footer.appendChild(buildContact());
    footer.appendChild(buildLicense());
  }

  /* ---------- 4) Footer marka satırı: rozet + logo yan yana ----------

     Logo React'in elemanı ve rozetle aynı satıra almak için onu taşımak
     gerekirdi — React footer'ı yeniden çizerken kırılabilirdi. Onun yerine
     orijinal footer-logo gizlenip (custom.css) burada bir kopyası basılıyor.
     src ve href runtime'da orijinalden okunuyor; CMS'te logo değişirse
     kopya da kendiliğinden takip eder. */

  function buildFooterBrand() {
    var orj = document.querySelector('[data-mj="footer-logo"]');
    var img = orj && orj.querySelector('img');
    if (!img) return null;

    var box = document.createElement('div');
    box.setAttribute('data-mj', 'footer-brand');
    box.innerHTML =
      '<a class="tb-brand-seal" href="' + VERIFY_URL + '" target="_blank" ' +
      'rel="noopener noreferrer" aria-label="Lisans doğrulama">' +
        '<img src="' + HEADER_SEAL_URL + '" alt="Anjouan Gambling Board — Geçerli Lisans">' +
      '</a>' +
      '<a class="tb-brand-logo" href="' + (orj.getAttribute('href') || '/') + '">' +
        '<img src="' + img.getAttribute('src') + '" alt="TacoBahis">' +
      '</a>';
    return box;
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

    var call = document.querySelector('[data-mj="header-call-button"]');
    if (call && call.parentElement) {
      call.parentElement.setAttribute('data-tb-header-wrap', 'call');
    }

    var telegram = document.querySelector('[data-mj="header-telegram-button"]');
    if (telegram && telegram.parentElement) {
      telegram.parentElement.setAttribute('data-tb-header-wrap', 'telegram');
    }

    // Sırayla: Telegram → Aranma → Promosyon(megafon)
    // Sarmalayıcı sınıfı runtime'da megafondan kopyalanır; sabit yazsaydık
    // site yeni derleme yapıp hash'li sınıfı değiştirdiğinde boşluk bozulurdu.
    if (!call) {
      var cw = document.createElement('div');
      cw.className = megaWrap.className;
      cw.setAttribute('data-tb-header-wrap', 'call');
      cw.appendChild(buildIconButton('header-call-button', CALL_URL, 'Aranma talebi', SVG.phone));
      megaWrap.parentElement.insertBefore(cw, megaWrap);
      call = cw.querySelector('[data-mj="header-call-button"]');
    }

    if (!telegram) {
      var callWrap = call ? call.parentElement : megaWrap;
      var tw = document.createElement('div');
      tw.className = megaWrap.className;
      tw.setAttribute('data-tb-header-wrap', 'telegram');
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
  var buttonSizeSignature = '';

  function syncButtonSize() {
    var ref = document.querySelector('[data-mj="header-special-button"]');
    if (!ref) return;

    var cs = getComputedStyle(ref);
    if (cs.width === 'auto' || cs.width === '0px') return;

    var icon = ref.querySelector('img, svg');
    var root = document.documentElement;
    var iconWidth = icon ? getComputedStyle(icon).width : '24px';
    var signature = [cs.width, cs.borderTopLeftRadius, cs.paddingTop, iconWidth].join('|');

    // Aynı değerleri tekrar yazmak gereksiz style invalidation üretmesin.
    if (signature === buttonSizeSignature) return;
    buttonSizeSignature = signature;

    root.style.setProperty('--tb-btn-size', cs.width);
    root.style.setProperty('--tb-btn-radius', cs.borderTopLeftRadius);
    root.style.setProperty('--tb-btn-pad', cs.paddingTop);
    root.style.setProperty('--tb-btn-icon', iconWidth);
  }

  var observedButton = null;
  var buttonResizeObserver = null;

  function observeButtonSize() {
    var ref = document.querySelector('[data-mj="header-special-button"]');
    if (!ref) return;

    syncButtonSize();
    if (ref === observedButton || typeof ResizeObserver === 'undefined') return;

    if (buttonResizeObserver) buttonResizeObserver.disconnect();
    observedButton = ref;
    buttonResizeObserver = new ResizeObserver(syncButtonSize);
    buttonResizeObserver.observe(ref);
  }

  /* ---------- Mobil duyuru metnini etiketle ---------- */

  var observedAnnouncement = null;

  function mountAnnouncement() {
    var root = document.querySelector('[data-mj="announcement"]');

    if (!root) {
      observedAnnouncement = null;
      return;
    }
    if (root === observedAnnouncement &&
        root.querySelector('[data-tb-announcement-text]')) return;

    var old = root.querySelector('[data-tb-announcement-text]');
    if (old) old.removeAttribute('data-tb-announcement-text');

    // Altyapı mesajı sürüme göre p, span veya div olarak basabiliyor.
    // Kapatma düğmesini içermeyen en uzun metin düğümü mesajın kendisidir.
    var candidates = root.querySelectorAll('p, span, div');
    var message = null;
    var messageLength = 0;

    for (var i = 0; i < candidates.length; i++) {
      var candidate = candidates[i];
      if (candidate.closest('button, [role="button"]')) continue;
      if (candidate.querySelector('button, [role="button"]')) continue;

      var text = (candidate.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.length <= messageLength) continue;

      message = candidate;
      messageLength = text.length;
    }

    if (!message) return;
    message.setAttribute('data-tb-announcement-text', '');
    observedAnnouncement = root;
  }

  /* ---------- Boş sayfalara gömülen uygulamalar ----------

     Altyapıdan boş/placeholder gelen sayfaların kendi içeriği gizlenip
     yerine iframe konuyor. Hangi sayfaya ne gömüleceği PAGE_EMBEDS'te.

     Sayfaların yerleşik içeriği duruma göre değişiyor (ör. /tr/sportest
     oturum açıkken "There are no active Tournaments yet.", kapalıyken
     "Error Occurred" — bazen çıplak metin düğümü; /tr/testspor'da ise
     oyun kataloğu modülü). Metni/hash'li sınıfı hedeflemek kırılgan
     olurdu; stabil [data-mj="page-content"] kutusu işaretleniyor,
     gizlemeyi custom.css yapıyor.

     ÖNEMLİ: page-content SPA rota değişiminde AYNI DOM düğümü kalıyor
     (test edildi) — işaret kaldırılmazsa gömülü sayfadan çıkınca diğer
     sayfaların içeriği de gizli kalır. Bu yüzden eşleşme yoksa
     data-tb-embed-host mutlaka siliniyor. */

  var PAGE_EMBEDS = [
    { path: '/tr/sportest', src: 'https://tacolynon.up.railway.app/bonus?user_id={id}', baslik: 'Bonus' },
    { path: '/tr/testspor', src: 'https://tacolynon.up.railway.app/?user_id={id}',      baslik: 'Taco Lynon' }
  ];

  function mountPageEmbeds() {
    var existing = document.querySelector('[data-tb-page-embed]');
    var path = window.location.pathname.replace(/\/+$/, '');

    var cfg = null;
    for (var i = 0; i < PAGE_EMBEDS.length; i++) {
      if (PAGE_EMBEDS[i].path === path) { cfg = PAGE_EMBEDS[i]; break; }
    }

    // Gömülü sayfa değiliz: iframe'i ve host işaretini temizle.
    if (!cfg) {
      if (existing) existing.remove();
      var host = document.querySelector('[data-tb-embed-host]');
      if (host) host.removeAttribute('data-tb-embed-host');
      return;
    }

    // Bir gömülü sayfadan diğerine geçildiyse eski iframe'i tazele.
    if (existing && existing.getAttribute('data-tb-page-embed') !== path) {
      existing.remove();
      existing = null;
    }

    var content = document.querySelector('[data-mj="page-content"]');
    if (!content) return;

    // Zaten işaretliyse dokunma — MutationObserver sonsuz dönmesin.
    if (!content.hasAttribute('data-tb-embed-host')) {
      content.setAttribute('data-tb-embed-host', '');
    }

    if (existing) return;

    var wrap = document.createElement('div');
    wrap.className = 'tb-page-embed';
    wrap.setAttribute('data-tb-page-embed', path);

    var frame = document.createElement('iframe');
    frame.src = cfg.src;
    frame.title = cfg.baslik;
    frame.width = '100%';
    frame.height = '100vh';
    frame.frameBorder = '0';
    frame.scrolling = 'no';
    frame.allow = 'autoplay';
    frame.setAttribute('loading', 'eager');

    wrap.appendChild(frame);
    content.appendChild(wrap);
  }

  /* ---------- Ana sayfa güven ve hizmet paneli ---------- */

  function buildTrustHub() {
    var widget = document.createElement('section');
    widget.id = 'taco-trust-hub';
    widget.className = 'tb-trust-hub';
    widget.setAttribute('data-tb-trust-hub', '');
    widget.setAttribute('aria-labelledby', 'taco-trust-hub-title');
    widget.innerHTML =
      '<div class="tb-trust-head">' +
        '<img class="tb-trust-logo" src="' + TRUST_LOGO_URL + '" alt="TacoBahis" ' +
        'loading="lazy" decoding="async">' +
        '<h2 class="tb-trust-title" id="taco-trust-hub-title">GÜVENİN VE DENEYİMİN ADRESİ</h2>' +
        '<p class="tb-trust-lead">Güçlü altyapı, hızlı işlemler ve 7/24 destek.</p>' +
      '</div>' +
      '<div class="tb-trust-grid" aria-label="TacoBahis güven ve hizmet bilgileri">' +
        '<article class="tb-trust-card">' +
          '<span class="tb-trust-icon-wrap"><span class="tb-trust-icon">' + SVG.trustPayment + '</span></span>' +
          '<span class="tb-trust-copy"><strong class="tb-trust-value">HIZLI</strong>' +
          '<span class="tb-trust-label">GÜVENİLİR ÖDEME</span></span>' +
        '</article>' +
        '<article class="tb-trust-card">' +
          '<span class="tb-trust-icon-wrap"><span class="tb-trust-icon">' + SVG.trustOdds + '</span></span>' +
          '<span class="tb-trust-copy"><strong class="tb-trust-value">YÜKSEK</strong>' +
          '<span class="tb-trust-label">ORANLAR &amp; KAMPANYALAR</span></span>' +
        '</article>' +
        '<article class="tb-trust-card">' +
          '<span class="tb-trust-icon-wrap"><span class="tb-trust-icon">' + SVG.trustSupport + '</span></span>' +
          '<span class="tb-trust-copy"><strong class="tb-trust-value">7/24</strong>' +
          '<span class="tb-trust-label">CANLI DESTEK</span></span>' +
        '</article>' +
        '<a class="tb-trust-card" href="' + VERIFY_URL + '" target="_blank" rel="noopener noreferrer" ' +
        'aria-label="Resmi TacoBahis lisans doğrulamasını aç">' +
          '<span class="tb-trust-icon-wrap"><span class="tb-trust-icon">' + SVG.trustVerified + '</span></span>' +
          '<span class="tb-trust-copy"><strong class="tb-trust-value">RESMİ</strong>' +
          '<span class="tb-trust-label">DOĞRULANMIŞ LİSANS</span></span>' +
          '<span class="tb-trust-arrow" aria-hidden="true">↗</span>' +
        '</a>' +
      '</div>';
    return widget;
  }

  function mountTrustHub() {
    var widget = document.querySelector('[data-tb-trust-hub]');
    var path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    var isHome = path === '' || path === '/' || path === '/tr';

    if (!isHome) {
      if (widget) widget.remove();
      return;
    }

    var main = document.querySelector('main[data-mj="page-content"]');
    if (!main) return;

    var pages = main.querySelector(':scope > [data-mj="widget-pages"]');
    if (!pages) return;
    if (!widget) widget = buildTrustHub();

    // React ana sayfayı yeniden çizdiğinde paneli güncel kategori satırının
    // hemen arkasına geri al; başka bir widget sırasına bağımlı kalma.
    if (widget.parentElement !== main || widget.previousElementSibling !== pages) {
      pages.insertAdjacentElement('afterend', widget);
    }
  }

  /* ---------- Banner animasyonunu görünürken çalıştır ---------- */

  var observedBanner = null;
  var bannerObserver = null;
  var bannerInView = true;

  function applyBannerMotionState() {
    if (!observedBanner) return;
    var state = !document.hidden && bannerInView ? 'running' : 'paused';
    observedBanner.style.setProperty('--tb-banner-play', state);

    // Mobil animasyon link'in dışındaki slider item katmanında çalışır.
    if (observedBanner.parentElement) {
      observedBanner.parentElement.style.setProperty('--tb-banner-play', state);
    }
  }

  function mountBannerMotion() {
    var banner = document.querySelector('[data-mj="widget-banner-link"]');

    if (!banner) {
      if (bannerObserver) bannerObserver.disconnect();
      bannerObserver = null;
      observedBanner = null;
      return;
    }
    if (banner === observedBanner) return;

    if (bannerObserver) bannerObserver.disconnect();
    observedBanner = banner;
    bannerInView = true;
    applyBannerMotionState();

    if (typeof IntersectionObserver === 'undefined') return;
    bannerObserver = new IntersectionObserver(function (entries) {
      if (!entries.length) return;
      bannerInView = entries[0].isIntersecting;
      applyBannerMotionState();
    }, { threshold: 0.01 });
    bannerObserver.observe(banner);
  }

  /* ---------- Bağlama ---------- */

  function mountAll() {
    mountFooter();
    mountHeaderSeal();
    mountHeaderButtons();
    tagAgeBadge();
    observeButtonSize();
    mountAnnouncement();
    mountPageEmbeds();
    mountTrustHub();
    mountBannerMotion();
  }

  var MOUNT_SELECTOR =
    '[data-mj="footer"], [data-mj="logo"], ' +
    '[data-mj="header-special-button"], [data-mj="header-seal"], ' +
    '[data-mj="header-call-button"], [data-mj="header-telegram-button"], ' +
    '[data-mj="announcement"], ' +
    '[data-mj="info-page-content"], ' +
    '[data-mj="widget-pages"], [data-tb-trust-hub], ' +
    '[data-mj="widget-banner-link"]';
  var mountFrame = 0;

  function nodeContainsMountTarget(node) {
    if (!node || (node.nodeType !== 1 && node.nodeType !== 11)) return false;
    if (node.matches && node.matches(MOUNT_SELECTOR)) return true;
    return !!(node.querySelector && node.querySelector(MOUNT_SELECTOR));
  }

  function mutationIsRelevant(mutation) {
    var target = mutation.target;

    // Footer içindeki değişimler marka kopyası ve özel blokları etkileyebilir.
    if (target && target.nodeType === 1 && target.closest &&
        target.closest('[data-mj="footer"]')) return true;

    // Duyuru kabuğu önce, metni daha sonra render edilebildiği için içindeki
    // child değişimleri de yeniden etiketleme gerektirir.
    if (target && target.nodeType === 1 && target.closest &&
        target.closest('[data-mj="announcement"]')) return true;

    if (target && target.nodeType === 1 && target.closest &&
        target.closest('[data-mj="info-page-content"]')) return true;

    var i;
    for (i = 0; i < mutation.addedNodes.length; i++) {
      if (nodeContainsMountTarget(mutation.addedNodes[i])) return true;
    }
    for (i = 0; i < mutation.removedNodes.length; i++) {
      if (nodeContainsMountTarget(mutation.removedNodes[i])) return true;
    }
    return false;
  }

  function scheduleMount(mutations) {
    var relevant = false;
    for (var i = 0; i < mutations.length; i++) {
      if (mutationIsRelevant(mutations[i])) {
        relevant = true;
        break;
      }
    }
    if (!relevant || mountFrame) return;

    mountFrame = requestAnimationFrame(function () {
      mountFrame = 0;
      mountAll();
    });
  }

  function start() {
    mountAll();
    new MutationObserver(scheduleMount).observe(document.body, {
      childList: true,
      subtree: true
    });

    document.addEventListener('visibilitychange', applyBannerMotionState);

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
