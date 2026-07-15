/* ===== TacoBahis — custom.js =====
 *
 * NE YAPAR: Footer'ın en altına lisans bloğunu enjekte eder.
 *
 * NEDEN JS: Site bir React SPA. Blok sadece bir kez eklenirse, rota
 * değişiminde React footer'ı yeniden çizince kaybolur. Buradaki
 * MutationObserver bunu izler ve blok silinirse geri koyar.
 *
 * YAPILACAK: Aşağıdaki SEAL_URL'i rozet görselinin gerçek adresiyle değiştir.
 *
 * Biçimlendirme custom.css içindeki 8 numaralı kuraldan gelir —
 * bu dosya sadece HTML'i basar.
 */

(function () {
  'use strict';

  var SEAL_URL = 'SEAL_URL_BURAYA';

  var VERIFY_URL =
    'https://verification.anjouangamblingboard.org/s/' +
    '93cdb2db440d85925f2939b5e3efe0acde1d6f2384d71ece13f3a940b3256e7fb4069a53385faa5b3cbb398224274d23';

  var TEXT =
    '<b>tacobahis.com</b>, <b>TacoBahis Entertainment Limited</b> tarafından işletilmektedir. ' +
    'Kayıtlı adres: Hamchako, Mutsamudu, Autonomous Island of Anjouan, Union of Comoros. ' +
    'Bu platform, 2005 tarihli Computer Gaming Licensing Act 007 uyarınca Anjouan Eyaleti ' +
    'Offshore Finance Authority tarafından verilen <b>ALSI-202605014-FI1</b> numaralı lisans ' +
    'ile faaliyet göstermektedir. Tüm lisanslı faaliyetler Anjouan Licensing Services Inc. denetimindedir. ';

  var SHIELD_SVG =
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';

  function build() {
    var box = document.createElement('div');
    box.setAttribute('data-mj', 'footer-license');
    box.innerHTML =
      '<a class="tb-seal" href="' + VERIFY_URL + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + SEAL_URL + '" alt="Anjouan Gambling Board — Geçerli Lisans">' +
      '</a>' +
      '<div class="tb-body">' +
        '<span class="tb-pill">' + SHIELD_SVG + 'Lisanslı Operatör</span>' +
        '<p class="tb-text">' + TEXT +
          '<a href="' + VERIFY_URL + '" target="_blank" rel="noopener noreferrer">Lisansı doğrula →</a>' +
        '</p>' +
      '</div>';
    return box;
  }

  function mount() {
    // DİKKAT: footer-content DEĞİL. Orası display:flex/row — blok yan sütun
    // olarak sıkışır. Bir üst seviye olan "footer" display:block, doğru yer.
    var footer = document.querySelector('[data-mj="footer"]');
    if (!footer) return;

    var existing = footer.querySelector(':scope > [data-mj="footer-license"]');

    // Zaten yerindeyse dokunma — yoksa observer sonsuz döngüye girer.
    if (existing && existing === footer.lastElementChild) return;
    if (existing) existing.remove();

    footer.appendChild(build());
  }

  function start() {
    mount();
    // React footer'ı yeniden çizdiğinde bloğu geri koy.
    new MutationObserver(mount).observe(document.body, {
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
