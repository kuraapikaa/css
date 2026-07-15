/* ===== TacoBahis — custom.js =====
 *
 * NE YAPAR:
 *   1) Footer'ın en altına lisans bloğunu ekler.
 *   2) Header'da megafon butonunun soluna aranma talebi butonu ekler.
 *
 * NEDEN JS: Site bir React SPA. Elemanlar bir kez eklenirse, rota
 * değişiminde React header/footer'ı yeniden çizince kaybolur. Buradaki
 * MutationObserver bunu izler ve silinen elemanları geri koyar.
 *
 * Biçimlendirme custom.css'ten gelir — bu dosya sadece HTML'i basar.
 */

(function () {
  'use strict';

  /* ---------- Ayarlar ---------- */

  var SEAL_URL = 'https://i.ibb.co/nNhnhW7n/g-rsel-2026-07-15-043554819.png';

  var VERIFY_URL =
    'https://verification.anjouangamblingboard.org/s/' +
    '93cdb2db440d85925f2939b5e3efe0acde1d6f2384d71ece13f3a940b3256e7fb4069a53385faa5b3cbb398224274d23';

  var CALL_URL = 'https://tacoara.com';

  /* ---------- 1) Footer lisans bloğu ---------- */

  var LICENSE_TEXT =
    '<b>tacobahis.com</b>, <b>TacoBahis Entertainment Limited</b> tarafından işletilmektedir. ' +
    'Kayıtlı adres: Hamchako, Mutsamudu, Autonomous Island of Anjouan, Union of Comoros. ' +
    'Bu platform, 2005 tarihli Computer Gaming Licensing Act 007 uyarınca Anjouan Eyaleti ' +
    'Offshore Finance Authority tarafından verilen <b>ALSI-202605014-FI1</b> numaralı lisans ' +
    'ile faaliyet göstermektedir. Tüm lisanslı faaliyetler Anjouan Licensing Services Inc. denetimindedir. ';

  var SHIELD_SVG =
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';

  function buildLicense() {
    var box = document.createElement('div');
    box.setAttribute('data-mj', 'footer-license');
    box.innerHTML =
      '<a class="tb-seal" href="' + VERIFY_URL + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + SEAL_URL + '" alt="Anjouan Gambling Board — Geçerli Lisans">' +
      '</a>' +
      '<div class="tb-body">' +
        '<span class="tb-pill">' + SHIELD_SVG + 'Lisanslı Operatör</span>' +
        '<p class="tb-text">' + LICENSE_TEXT +
          '<a href="' + VERIFY_URL + '" target="_blank" rel="noopener noreferrer">Lisansı doğrula →</a>' +
        '</p>' +
      '</div>';
    return box;
  }

  function mountLicense() {
    // DİKKAT: footer-content DEĞİL. Orası display:flex/row — blok yan sütun
    // olarak sıkışır. Bir üst seviye olan "footer" display:block, doğru yer.
    var footer = document.querySelector('[data-mj="footer"]');
    if (!footer) return;

    var existing = footer.querySelector(':scope > [data-mj="footer-license"]');

    // Zaten yerindeyse dokunma — yoksa observer sonsuz döngüye girer.
    if (existing && existing === footer.lastElementChild) return;
    if (existing) existing.remove();

    footer.appendChild(buildLicense());
  }

  /* ---------- 2) Header aranma butonu ---------- */

  var PHONE_SVG =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.28-.28.68-.36 1.03-.25 ' +
    '1.12.37 2.33.57 3.56.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 ' +
    '0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>' +
    '</svg>';

  function mountCallButton() {
    if (document.querySelector('[data-mj="header-call-button"]')) return;

    var special = document.querySelector('[data-mj="header-special-button"]');
    if (!special) return;

    var megaWrap = special.parentElement;
    if (!megaWrap || !megaWrap.parentElement) return;

    // Sarmalayıcı, megafonunkiyle aynı sınıfı alır ki header'ın flex
    // düzeninde aynı boşluk/hizayı paylaşsınlar.
    var wrap = document.createElement('div');
    wrap.className = megaWrap.className;
    wrap.innerHTML =
      '<a data-mj="header-call-button" href="' + CALL_URL + '" ' +
      'target="_blank" rel="noopener noreferrer" aria-label="Aranma talebi">' +
      PHONE_SVG + '</a>';

    megaWrap.parentElement.insertBefore(wrap, megaWrap);
  }

  /* ---------- Bağlama ---------- */

  function mountAll() {
    mountLicense();
    mountCallButton();
  }

  function start() {
    mountAll();
    // React header/footer'ı yeniden çizdiğinde elemanları geri koy.
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
