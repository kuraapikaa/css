/* NarcosBahis footer eklentileri:
   - Lisans doğrulama bandı ve VALID görseli
   - Vizyon / misyon double banner
   - Sosyal medya ve güncel adres paneli
   - 18+ rozet hedefi */
(function () {
  "use strict";

  var VERIFY_URL = "https://verification.anjouangamblingboard.org/s/140e70a801efff238b59b01782ba34d909755fd6e27deb06c4959b328d6e9698e01f00b62578604eca16f199ebb446cb";
  var TELEGRAM_URL = "https://t.me/narcosresmi";
  var CURRENT_URL = "https://narcosgir.com";
  var WEBSITE_URL = "https://narcosbahis.com/";
  var SCRIPT_BASE_URL = (function () {
    var currentScript = document.currentScript || document.querySelector('script[src*="narcos-license-footer.js"]');
    var sourceUrl = currentScript && currentScript.src ? currentScript.src : "";
    if (!sourceUrl) {
      var themeLink = document.querySelector('link[href*="narcos-premium-gold-glass.css"]');
      sourceUrl = themeLink && themeLink.href ? themeLink.href : "";
    }
    return sourceUrl
      ? sourceUrl.slice(0, sourceUrl.lastIndexOf("/") + 1)
      : "https://cdn.jsdelivr.net/gh/Dvppels-dev/narcos-premium-theme@main/";
  })();

  function assetUrl(fileName) {
    return SCRIPT_BASE_URL + fileName;
  }

  var CHAT_ICON_URL = assetUrl("narcos-chat-icon.png");
  var TELEPHONE_ICON_URL = assetUrl("narcos-telephone-icon.png");
  var TELEGRAM_ICON_URL = assetUrl("narcos-telegram-icon.png");
  var WEB_ICON_URL = assetUrl("narcos-web-icon.png");
  var LICENSE_BADGE_URL = assetUrl("narcos-license-badge.png");

  function makeText(tag, className, text) {
    var element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
  }

  function makeExternalLink(href, className, text, ariaLabel) {
    var link = document.createElement("a");
    link.href = href;
    link.className = className || "";
    link.target = "_blank";
    link.rel = "noopener noreferrer external";
    link.textContent = text;
    if (ariaLabel) link.setAttribute("aria-label", ariaLabel);
    return link;
  }

  function makeSocialCard(options) {
    var link = makeExternalLink(options.href, "ng-social-card", "", options.ariaLabel);

    var icon = document.createElement("span");
    icon.className = "ng-social-icon";
    icon.setAttribute("aria-hidden", "true");

    if (options.image) {
      var image = document.createElement("img");
      image.className = "ng-social-image";
      image.src = options.image;
      image.alt = "";
      image.width = 24;
      image.height = 24;
      image.loading = "lazy";
      image.decoding = "async";
      image.setAttribute("fetchpriority", "low");
      icon.appendChild(image);
    } else {
      icon.textContent = options.icon || "";
    }

    var copy = document.createElement("span");
    copy.className = "ng-social-copy";
    copy.appendChild(makeText("span", "ng-social-label", options.label));
    copy.appendChild(makeText("span", "ng-social-value", options.value));

    var arrow = makeText("span", "ng-social-arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");

    link.appendChild(icon);
    link.appendChild(copy);
    link.appendChild(arrow);
    return link;
  }

  function installSocialPanel(target, licenseBanner) {
    var panel = document.getElementById("narcos-social-panel");

    if (!panel) {
      panel = document.createElement("section");
      panel.id = "narcos-social-panel";
      panel.setAttribute("aria-label", "Sosyal medya hesaplarımız");
    }

    if (panel.getAttribute("data-ng-version") !== "2") {
      panel.textContent = "";
      panel.setAttribute("data-ng-version", "2");

      var heading = document.createElement("div");
      heading.className = "ng-social-heading";
      heading.appendChild(makeText("span", "ng-social-kicker", "NARCOSBAHİS RESMİ KANALLARI"));
      heading.appendChild(makeText("span", "ng-social-title", "Sosyal medya hesaplarımız"));

      panel.appendChild(heading);
      panel.appendChild(makeSocialCard({
        href: TELEGRAM_URL,
        ariaLabel: "Telegram'da narcosresmi hesabını aç",
        image: TELEGRAM_ICON_URL,
        label: "Telegram",
        value: "@narcosresmi"
      }));
      panel.appendChild(makeSocialCard({
        href: CURRENT_URL,
        ariaLabel: "NarcosBahis güncel adresini aç",
        image: WEB_ICON_URL,
        label: "Her zaman güncel",
        value: "narcosgir.com"
      }));
    }

    if (panel.parentElement !== target || panel.nextElementSibling !== licenseBanner) {
      target.insertBefore(panel, licenseBanner || null);
    }

    return panel;
  }

  function makeValueCard(title, paragraphs) {
    var card = document.createElement("article");
    card.className = "ng-value-card";
    card.appendChild(makeText("h3", "", title));

    for (var i = 0; i < paragraphs.length; i += 1) {
      card.appendChild(makeText("p", "", paragraphs[i]));
    }

    return card;
  }

  function installValuesPanel(target, socialPanel) {
    var panel = document.getElementById("narcos-values-panel");

    if (!panel) {
      panel = document.createElement("section");
      panel.id = "narcos-values-panel";
      panel.setAttribute("aria-label", "NarcosBahis vizyon ve misyonu");

      panel.appendChild(makeValueCard("VİZYONUMUZ", [
        "NarcosBahis olarak vizyonumuz; yenilikçi teknoloji, güçlü altyapı ve şeffaf hizmet anlayışıyla çevrim içi oyun ve spor bahisleri sektöründe güvenin ve kalitenin simgesi olmaktır.",
        "Hızlı ödeme sistemleri, adil oyun politikası ve güçlü kullanıcı deneyimiyle global ölçekte tercih edilen, güvenli ve sürdürülebilir büyüyen lider bir marka olmayı hedefliyoruz."
      ]));

      panel.appendChild(makeValueCard("MİSYONUMUZ", [
        "NarcosBahis'in misyonu; üyelerine 7/24 kesintisiz hizmet sunmak, yüksek oranlar ve avantajlı kampanyalar sağlamak, hızlı ve güvenilir ödeme altyapısıyla memnuniyeti en üst seviyeye çıkarmaktır.",
        "Şeffaflık, adalet ve güçlü teknolojik altyapı ile güvenli, hızlı ve sorunsuz bir oyun deneyimi sunmayı hedefler."
      ]));
    }

    if (panel.parentElement !== target || panel.nextElementSibling !== socialPanel) {
      target.insertBefore(panel, socialPanel || null);
    }

    return panel;
  }

  function buildLicenseBanner(banner) {
    banner.textContent = "";
    banner.setAttribute("data-ng-version", "3");

    var panel = document.createElement("div");
    panel.className = "ng-license-panel";

    var badgeLink = makeExternalLink(
      VERIFY_URL,
      "ng-license-badge-link",
      "",
      "Geçerli lisansı doğrula"
    );
    var badge = document.createElement("img");
    badge.className = "ng-license-badge";
    badge.src = LICENSE_BADGE_URL;
    badge.alt = "Geçerli lisans - doğrulamak için tıklayın";
    badge.width = 82;
    badge.height = 82;
    badge.loading = "lazy";
    badge.decoding = "async";
    badge.setAttribute("fetchpriority", "low");
    badgeLink.appendChild(badge);

    var copy = document.createElement("div");
    copy.className = "ng-license-copy";
    copy.appendChild(makeText("span", "ng-license-eyebrow", "DÜZENLEMELER VE İŞORTAKLARI"));

    var legal = document.createElement("p");
    legal.className = "ng-license-title";
    legal.appendChild(makeExternalLink(WEBSITE_URL, "", "narcosbahis.com", "NarcosBahis ana sayfasını aç"));
    legal.appendChild(document.createTextNode(
      ", Anjouan Birliği'nin Mutsamudu bölgesinde kayıtlı NarcosBahis Entertainment Limited tarafından işletilmektedir. Platform, Anjouan Eyaleti Offshore Finance Authority tarafından Computer Gaming Licensing Act 007 of 2005 kapsamında düzenlenen ALSI-202607948-FI5 numaralı geçerli internet oyun lisansı ile faaliyet göstermektedir."
    ));
    copy.appendChild(legal);

    var action = makeExternalLink(
      VERIFY_URL,
      "ng-license-action",
      "Lisans durumunu doğrula",
      "Lisans durumunu yeni sekmede doğrula"
    );

    panel.appendChild(badgeLink);
    panel.appendChild(copy);
    panel.appendChild(action);
    banner.appendChild(panel);
  }

  function installLicenseBanner(target) {
    var banner = document.getElementById("narcos-license-banner");

    if (!banner) {
      banner = document.createElement("section");
      banner.id = "narcos-license-banner";
      banner.setAttribute("aria-label", "Lisans doğrulama bilgisi");
    }

    if (banner.getAttribute("data-ng-version") !== "3") buildLicenseBanner(banner);
    if (banner.parentElement !== target) target.appendChild(banner);
    return banner;
  }

  function markAgeBadge(footer) {
    var existing = document.getElementById("narcos-age-badge");
    if (existing && footer.contains(existing)) return existing;

    var nodes = footer.querySelectorAll("div, span");
    for (var i = 0; i < nodes.length; i += 1) {
      if (nodes[i].textContent.trim() === "18+" && nodes[i].children.length === 0) {
        nodes[i].id = "narcos-age-badge";
        return nodes[i];
      }
    }
    return null;
  }

  function updateExistingTelegramLink(footer) {
    var image = footer.querySelector('a img[alt="Telegram"]');
    var link = image && image.closest("a");
    if (link && link.href !== TELEGRAM_URL) link.href = TELEGRAM_URL;
  }

  function installHeaderLicenseBadge() {
    var headerLeft = document.querySelector('[aria-label="site-header"] [data-mj="header-left"]');
    var logo = headerLeft && headerLeft.querySelector('[data-mj="logo"]');
    if (!headerLeft || !logo) return false;

    var badgeLink = document.getElementById("narcos-header-license");
    if (!badgeLink) {
      badgeLink = makeExternalLink(
        VERIFY_URL,
        "ng-header-license",
        "",
        "Anjouan Gaming lisansını doğrula"
      );
      badgeLink.id = "narcos-header-license";

      var badge = document.createElement("img");
      badge.className = "ng-header-license-image";
      badge.src = LICENSE_BADGE_URL;
      badge.alt = "Anjouan Gaming lisans rozeti";
      badge.width = 42;
      badge.height = 42;
      badge.loading = "eager";
      badge.decoding = "async";
      badge.setAttribute("fetchpriority", "low");
      badgeLink.appendChild(badge);
    }

    if (badgeLink.parentElement !== headerLeft) headerLeft.appendChild(badgeLink);
    return true;
  }

  function localizeProviderSheet() {
    var search = document.querySelector('[data-mj="game-catalog-provider-bottom-sheet-search"]');
    if (!search) return false;
    if (search.getAttribute("data-ng-localized") === "1") return true;

    search.placeholder = "Sağlayıcı ara";
    search.setAttribute("aria-label", "Sağlayıcı ara");
    search.setAttribute("data-ng-localized", "1");
    return true;
  }

  function installContactButton(target) {
    var button = document.getElementById("narcos-contact-button");
    if (!button) {
      button = document.createElement("a");
      button.id = "narcos-contact-button";
      button.className = "ng-contact-button";
      button.href = "mailto:destek@narcosbahis.com";
      button.setAttribute("aria-label", "NarcosBahis destek e-posta adresine ulaşın");
    }

    if (button.getAttribute("data-ng-version") !== "1") {
      button.textContent = "";
      var icon = document.createElement("span");
      icon.className = "ng-contact-icon";
      var image = document.createElement("img");
      image.className = "ng-contact-image";
      image.src = CHAT_ICON_URL;
      image.alt = "";
      image.width = 22;
      image.height = 22;
      image.loading = "lazy";
      image.decoding = "async";
      image.setAttribute("fetchpriority", "low");
      image.setAttribute("aria-hidden", "true");
      icon.appendChild(image);
      button.appendChild(icon);
      button.appendChild(makeText("span", "ng-contact-copy", "BİZE ULAŞIN: destek@narcosbahis.com"));
      button.setAttribute("data-ng-version", "1");
    }

    if (button.parentElement !== target) target.appendChild(button);
    return button;
  }

  function installMobileCallButton() {
    var header = document.querySelector('[aria-label="site-header"]');
    if (!header) return false;
    var target = header.querySelector('[data-mj="header-right"]') || header;

    var button = document.getElementById("narcos-call-button");
    if (!button) {
      button = document.createElement("button");
      button.id = "narcos-call-button";
      button.className = "ng-call-button";
      button.type = "button";
      button.setAttribute("aria-label", "Beni ara - canlı desteği aç");

      var icon = document.createElement("img");
      icon.className = "ng-call-icon";
      icon.src = TELEPHONE_ICON_URL;
      icon.alt = "";
      icon.width = 24;
      icon.height = 24;
      icon.decoding = "async";
      icon.setAttribute("fetchpriority", "low");
      icon.setAttribute("aria-hidden", "true");
      button.appendChild(icon);
      button.appendChild(makeText("span", "ng-call-label", "Beni Ara"));

      button.addEventListener("click", function () {
        var supportButton = document.querySelector(
          'button[aria-label="Sohbeti aç"], button[aria-label*="Sohbet"], button[aria-label*="sohbet"]'
        );
        if (supportButton) {
          supportButton.click();
          return;
        }
        window.open(TELEGRAM_URL, "_blank", "noopener,noreferrer");
      });
    }

    var loginButton = target.querySelector('[data-mj="login-button"]');
    var loginWrap = loginButton && loginButton.parentElement;
    if (loginWrap && loginWrap.parentElement === target) {
      if (button.parentElement !== target || button.nextElementSibling !== loginWrap) {
        target.insertBefore(button, loginWrap);
      }
    } else if (button.parentElement !== target) {
      target.appendChild(button);
    }
    return true;
  }

  function installHeaderTelegramButton() {
    var header = document.querySelector('[aria-label="site-header"]');
    if (!header) return false;
    var target = header.querySelector('[data-mj="header-right"]') || header;

    var button = document.getElementById("narcos-telegram-button");
    if (!button) {
      button = makeExternalLink(
        TELEGRAM_URL,
        "ng-telegram-button",
        "",
        "NarcosBahis resmi Telegram kanalını aç"
      );
      button.id = "narcos-telegram-button";

      var icon = document.createElement("span");
      icon.className = "ng-telegram-icon";
      icon.setAttribute("aria-hidden", "true");
      button.appendChild(icon);
    }

    var callButton = document.getElementById("narcos-call-button");
    var loginButton = target.querySelector('[data-mj="login-button"]');
    var loginWrap = loginButton && loginButton.parentElement;

    if (callButton && callButton.parentElement === target) {
      if (button.parentElement !== target || button.nextElementSibling !== callButton) {
        target.insertBefore(button, callButton);
      }
    } else if (loginWrap && loginWrap.parentElement === target) {
      target.insertBefore(button, loginWrap);
    } else if (button.parentElement !== target) {
      target.appendChild(button);
    }
    return true;
  }

  function installHeaderGiftButton() {
    var button = document.querySelector('[data-mj="header-special-button"]');
    if (!button) return false;

    button.classList.add("ng-gift-button");
    button.setAttribute("aria-label", "Hediye ve bonuslar");

    var icon = button.querySelector(".ng-gift-icon");
    if (!icon) {
      icon = document.createElement("span");
      icon.className = "ng-gift-icon";
      icon.setAttribute("aria-hidden", "true");
      button.appendChild(icon);
    }

    return true;
  }

  function markCurrentRoute() {
    var path = (window.location.pathname || "").toLowerCase().replace(/\/+$/, "");
    var isHome = path === "" || path === "/" || path === "/tr";
    var needsSafeInfoHeader = isHome ||
      /^\/tr\/casino(?:\/|$)/.test(path) ||
      /^\/tr\/(?:live-casino|livecasino|canli-casino)(?:\/|$)/.test(path) ||
      /^\/tr\/promotions(?:\/|$)/.test(path);
    document.documentElement.classList.toggle("ng-home-route", isHome);
    document.documentElement.classList.toggle("ng-info-safe-route", needsSafeInfoHeader);
  }

  function installTrustHubWidget() {
    var path = (window.location.pathname || "").toLowerCase().replace(/\/+$/, "");
    var isHome = path === "" || path === "/" || path === "/tr";
    var widget = document.getElementById("narcos-game-hub");

    if (!isHome) {
      if (widget) widget.remove();
      return false;
    }

    var main = document.querySelector('main[data-mj="page-content"]');
    if (!main) return false;

    var providers = main.querySelector('[data-mj="widget-top-providers"]');
    var pages = main.querySelector('[data-mj="widget-pages"]');
    if (providers && providers.parentElement !== main) providers = null;
    if (pages && pages.parentElement !== main) pages = null;

    if (!widget) {
      widget = document.createElement("section");
      widget.id = "narcos-game-hub";
      widget.className = "ng-trust-hub";
      widget.setAttribute("aria-labelledby", "narcos-trust-hub-title");

      var head = document.createElement("div");
      head.className = "ng-trust-head";
      head.appendChild(makeText("span", "ng-trust-eyebrow", "NARCOS PREMIUM"));

      var title = makeText("h2", "ng-trust-title", "GÜVENİN VE DENEYİMİN ADRESİ");
      title.id = "narcos-trust-hub-title";
      head.appendChild(title);
      head.appendChild(makeText(
        "p",
        "ng-trust-lead",
        "Güçlü topluluk, köklü deneyim ve her an yanınızda destek."
      ));
      widget.appendChild(head);

      var items = [
        { icon: "members", value: "120.000+", label: "AKTİF ÜYE" },
        { icon: "experience", value: "10 YILI AŞKIN", label: "DENEYİM" },
        { icon: "support", value: "7/24", label: "CANLI DESTEK" },
        { icon: "verified", value: "RESMİ", label: "DOĞRULANMIŞ LİSANS", href: VERIFY_URL }
      ];

      var grid = document.createElement("div");
      grid.className = "ng-trust-grid";
      grid.setAttribute("aria-label", "NarcosBahis güven ve deneyim bilgileri");

      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var card = document.createElement(item.href ? "a" : "article");
        card.className = "ng-trust-card";

        if (item.href) {
          card.href = item.href;
          card.target = "_blank";
          card.rel = "noopener noreferrer";
          card.setAttribute("aria-label", item.value + " " + item.label + " doğrulamasını aç");
        }

        var iconWrap = document.createElement("span");
        iconWrap.className = "ng-trust-icon-wrap";
        var icon = document.createElement("span");
        icon.className = "ng-trust-icon ng-trust-icon-" + item.icon;
        icon.setAttribute("aria-hidden", "true");
        iconWrap.appendChild(icon);
        card.appendChild(iconWrap);

        var copy = document.createElement("span");
        copy.className = "ng-trust-copy";
        copy.appendChild(makeText("strong", "ng-trust-value", item.value));
        copy.appendChild(makeText("span", "ng-trust-label", item.label));
        card.appendChild(copy);

        if (item.href) {
          var arrow = makeText("span", "ng-trust-arrow", "↗");
          arrow.setAttribute("aria-hidden", "true");
          card.appendChild(arrow);
        }
        grid.appendChild(card);
      }

      widget.appendChild(grid);
      widget.appendChild(makeText(
        "p",
        "ng-trust-note",
        "18+ • Sorumlu oyun • Bütçe ve zaman limitlerinizi belirleyin."
      ));
    }

    if (providers) {
      if (widget.parentElement !== main || widget.nextElementSibling !== providers) {
        main.insertBefore(widget, providers);
      }
    } else if (pages) {
      if (widget.previousElementSibling !== pages) pages.insertAdjacentElement("afterend", widget);
    } else if (widget.parentElement !== main) {
      main.appendChild(widget);
    }

    return true;
  }

  function shouldShowJackpotWidget() {
    var path = (window.location.pathname || "").toLowerCase().replace(/\/+$/, "");
    return /^\/tr\/casino(?:\/|$)/.test(path);
  }

  function makeJackpotCard(symbol, label, value, tone) {
    var card = document.createElement("article");
    card.className = "ng-jackpot-card ng-jackpot-card-" + tone;

    var icon = makeText("span", "ng-jackpot-suit", symbol);
    icon.setAttribute("aria-hidden", "true");
    card.appendChild(icon);
    card.appendChild(makeText("span", "ng-jackpot-label", label));
    card.appendChild(makeText("strong", "ng-jackpot-value", value));
    return card;
  }

  function installJackpotWidget() {
    var widget = document.getElementById("narcos-egt-jackpot");
    if (!shouldShowJackpotWidget()) {
      if (widget) widget.remove();
      return false;
    }

    var main = document.querySelector("main");
    if (!main) return false;

    if (!widget) {
      widget = document.createElement("section");
      widget.id = "narcos-egt-jackpot";
      widget.setAttribute("aria-label", "EGT jackpot değerleri");

      var heading = document.createElement("div");
      heading.className = "ng-jackpot-heading";
      heading.appendChild(makeText("span", "ng-jackpot-kicker", "PREMIUM JACKPOT"));
      heading.appendChild(makeText("strong", "ng-jackpot-title", "EGT JACKPOT"));

      var grid = document.createElement("div");
      grid.className = "ng-jackpot-grid";
      grid.appendChild(makeJackpotCard("♠", "SPADE", "118,868", "dark"));
      grid.appendChild(makeJackpotCard("♥", "HEART", "53,868", "red"));
      grid.appendChild(makeJackpotCard("♦", "DIAMOND", "1,597.72", "red"));
      grid.appendChild(makeJackpotCard("♣", "CLUB", "314.69", "dark"));

      widget.appendChild(heading);
      widget.appendChild(grid);
    }

    if (widget.parentElement !== main || main.firstElementChild !== widget) {
      main.insertBefore(widget, main.firstChild);
    }
    return true;
  }

  function getCampaignRoute() {
    var path = (window.location.pathname || "").toLowerCase().replace(/\/+$/, "");
    var slug = path.slice(path.lastIndexOf("/") + 1).replace(/\.(html?|php)$/, "");
    if (["vip", "vip-basvuru", "vip-basvurusu"].indexOf(slug) >= 0) return "vip";
    if (["beni-ara", "beniara", "call", "contact"].indexOf(slug) >= 0) return "call";
    if (["milyonerler", "millionaires", "millionaire"].indexOf(slug) >= 0) return "millionaires";
    return "";
  }

  function bindCampaignActions(page) {
    var chatButton = page.querySelector('[data-ng-action="open-chat"]');
    if (!chatButton || chatButton.getAttribute("data-ng-bound") === "1") return;
    chatButton.setAttribute("data-ng-bound", "1");
    chatButton.addEventListener("click", function (event) {
      if (event && event.preventDefault) event.preventDefault();
      var supportButton = document.querySelector(
        'button[aria-label="Sohbeti aç"], button[aria-label*="Sohbet"], button[aria-label*="sohbet"]'
      );
      if (supportButton) supportButton.click();
      else window.location.href = "mailto:destek@narcosbahis.com";
    });
  }

  function installCampaignPage() {
    var route = getCampaignRoute();
    if (!route) return false;

    var main = document.querySelector("main");
    if (!main) return false;

    var page = document.getElementById("narcos-campaign-page");
    if (!page) {
      page = document.createElement("section");
      page.id = "narcos-campaign-page";
      page.className = "ng-campaign-page";
      page.setAttribute("data-ng-route", route);
      main.textContent = "";
      main.classList.add("ng-campaign-main");
      main.appendChild(page);
    }

    if (page.getAttribute("data-ng-rendered") === route) {
      bindCampaignActions(page);
      return true;
    }

    var content = {
      vip: {
        eyebrow: "NARCOSBAHİS VIP CLUB",
        title: "VIP BAŞVURU",
        lead: "Size özel ayrıcalıklar, hızlı destek ve premium promosyon deneyimi için VIP ekibimize katılın.",
        cta: "VIP BAŞVURUSU GÖNDER",
        body: '<div class="ng-campaign-grid"><article><span class="ng-campaign-icon">◆</span><h2>Kişisel VIP deneyimi</h2><p>Öncelikli destek, özel kampanyalar ve hesabınıza uygun avantajlar tek bir premium kanalda.</p></article><article><span class="ng-campaign-icon">✦</span><h2>Hızlı değerlendirme</h2><p>Başvurunuz VIP ekibimiz tarafından incelenir; geri dönüş için iletişim kanalınızı kullanırız.</p></article></div><form class="ng-campaign-form" action="mailto:destek@narcosbahis.com" method="post" enctype="text/plain"><label>Ad soyad<input name="ad_soyad" autocomplete="name" required></label><label>Kullanıcı adı<input name="kullanici_adi" required></label><label>Telegram kullanıcı adı<input name="telegram" placeholder="@kullanici"></label><label>Mesajınız<textarea name="mesaj" rows="4" placeholder="VIP ekibine iletmek istediğiniz not"></textarea></label><button class="ng-campaign-button" type="submit">VIP BAŞVURUSU GÖNDER</button></form>'
      },
      call: {
        eyebrow: "7/24 NARCOSBAHİS DESTEK",
        title: "BENİ ARA",
        lead: "Hesabınızla ilgili hızlı destek için canlı ekibimize ulaşın. Size en uygun kanaldan yardımcı olalım.",
        cta: "CANLI DESTEĞİ AÇ",
        body: '<div class="ng-campaign-grid"><article><span class="ng-campaign-icon">◉</span><h2>Canlı destek</h2><p>Mesajlaşarak anında destek alın ve sorularınızı güvenli biçimde iletin.</p><button class="ng-campaign-button" data-ng-action="open-chat" type="button">CANLI DESTEĞİ AÇ</button></article><article><span class="ng-campaign-icon">✉</span><h2>E-posta desteği</h2><p>Detaylı talepleriniz için destek@narcosbahis.com adresine yazabilirsiniz.</p><a class="ng-campaign-button ng-campaign-button-secondary" href="mailto:destek@narcosbahis.com">E-POSTA GÖNDER</a></article></div><div class="ng-campaign-note"><strong>Güvenli iletişim</strong><span>Şifrenizi ve tek kullanımlık doğrulama kodlarınızı hiçbir destek kanalında paylaşmayın.</span></div>'
      },
      millionaires: {
        eyebrow: "NARCOSBAHİS PREMIUM CLUB",
        title: "MİLYONERLER KULÜBÜ",
        lead: "Premium üyelik deneyimini; özel iletişim, seçkin kampanyalar ve güvenli hesap yönetimiyle keşfedin.",
        cta: "PREMİUM DESTEĞE ULAŞ",
        body: '<div class="ng-campaign-stats"><div><strong>7/24</strong><span>Öncelikli destek</span></div><div><strong>VIP</strong><span>Kişisel ilgi</span></div><div><strong>GOLD</strong><span>Özel fırsatlar</span></div></div><div class="ng-campaign-grid"><article><span class="ng-campaign-icon">♛</span><h2>Seçkin ayrıcalıklar</h2><p>Premium üyeler için düzenlenen kampanya ve iletişim fırsatlarını tek panelde takip edin.</p></article><article><span class="ng-campaign-icon">◈</span><h2>Şeffaf ve güvenli</h2><p>Hesap hareketlerinizi kontrol altında tutun; destek ekibimiz ihtiyaç duyduğunuzda yanınızda olsun.</p></article><article><span class="ng-campaign-icon">↗</span><h2>Size özel yönlendirme</h2><p>İhtiyacınıza uygun bilgi için VIP ekibimizle iletişime geçin.</p></article></div><a class="ng-campaign-button" data-ng-action="open-chat" href="#">PREMİUM DESTEĞE ULAŞ</a>'
      }
    }[route];

    page.innerHTML = '<div class="ng-campaign-hero"><span class="ng-campaign-eyebrow">' + content.eyebrow + '</span><h1>' + content.title + '</h1><p>' + content.lead + '</p><span class="ng-campaign-line"></span></div>' + content.body;
    page.setAttribute("data-ng-rendered", route);
    document.title = content.title + " | NarcosBahis";
    bindCampaignActions(page);
    return true;
  }

  function installCampaignLinks() {
    var footer = document.querySelector('[data-mj="footer-content"]');
    if (!footer || document.getElementById("narcos-campaign-links")) return false;
    var nav = document.createElement("nav");
    nav.id = "narcos-campaign-links";
    nav.className = "ng-campaign-links";
    nav.setAttribute("aria-label", "Premium sayfalar");
    nav.innerHTML = '<a href="/tr/vip-basvuru">VIP Başvuru</a><a href="/tr/beni-ara">Beni Ara</a><a href="/tr/milyonerler">Milyonerler</a>';
    footer.appendChild(nav);
    return true;
  }

  function removeCampaignLinks() {
    var nav = document.getElementById("narcos-campaign-links");
    if (nav && nav.hidden && nav.getAttribute("data-ng-removed") === "1") return true;

    if (!nav) {
      nav = document.createElement("span");
      nav.id = "narcos-campaign-links";
      nav.className = "ng-campaign-links";
      nav.setAttribute("aria-hidden", "true");
      var footer = document.querySelector('[data-mj="footer-content"]') || document.querySelector("footer") || document.body;
      if (footer) footer.appendChild(nav);
    }
    nav.textContent = "";
    nav.hidden = true;
    nav.style.display = "none";
    nav.setAttribute("data-ng-removed", "1");
    return true;
  }

  function markMobileSidebar() {
    var nav = document.querySelector('[data-mj="mobile-nav-list"]');
    if (!nav) return false;
    if (nav.classList.contains("ng-sidebar-nav") && nav.closest(".ng-sidebar-root")) return true;

    nav.classList.add("ng-sidebar-nav");
    if (nav.parentElement) nav.parentElement.classList.add("ng-sidebar-scroll");

    var node = nav.parentElement;
    var drawer = null;
    var fixedRoot = null;
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    while (node && node !== document.body) {
      var rect = node.getBoundingClientRect();
      var style = window.getComputedStyle(node);

      if (rect.width >= 280 && rect.width < viewportWidth && rect.height > 500) {
        drawer = node;
      }

      if (style.position === "fixed") {
        fixedRoot = node;
        break;
      }
      node = node.parentElement;
    }

    if (drawer) drawer.classList.add("ng-sidebar-drawer");
    if (fixedRoot) fixedRoot.classList.add("ng-sidebar-root");
    return true;
  }

  function markLeagueWidget() {
    var widgets = document.querySelectorAll('[data-mj="widget-collection-slider"]:not(.ng-leagues-widget)');
    for (var i = 0; i < widgets.length; i++) {
      var headings = widgets[i].querySelectorAll("p");
      for (var j = 0; j < headings.length; j++) {
        if ((headings[j].textContent || "").trim().toLowerCase() === "ligler") {
          widgets[i].classList.add("ng-leagues-widget");
          break;
        }
      }
    }
    return true;
  }

  function installFooterNavigationColumns() {
    var footerTop = document.querySelector('[data-mj="footer-top"]');
    var sourceNav = footerTop && footerTop.querySelector('[data-mj="footer-nav"]');
    if (!footerTop || !sourceNav) return false;

    sourceNav.hidden = true;
    sourceNav.setAttribute("aria-hidden", "true");
    sourceNav.style.setProperty("display", "none", "important");

    var columns = footerTop.querySelector("#narcos-footer-columns");
    if (!columns) {
      columns = document.createElement("div");
      columns.id = "narcos-footer-columns";
      footerTop.appendChild(columns);
    }

    if (columns.getAttribute("data-ng-version") === "1") return true;

    var links = sourceNav.querySelectorAll("a");
    var groups = [
      { title: "HAKKIMIZDA", hrefs: ["/tr/ha", "/tr/sorumlu"] },
      { title: "YÖNETMELİK", hrefs: ["/tr/genel", "/tr/gizlilik", "/tr/sorular", "/tr/kyc"] },
      { title: "YARDIM", hrefs: ["/tr/iptal", "/tr/finansal", "/tr/karaparaaklama", "/tr/adalet"] },
      { title: "MOBİL UYGULAMA", hrefs: [] }
    ];

    columns.textContent = "";
    for (var i = 0; i < groups.length; i++) {
      var group = groups[i];
      var column = document.createElement("section");
      column.className = "ng-footer-column";
      column.appendChild(makeText("h3", "ng-footer-column-title", group.title));

      for (var j = 0; j < links.length; j++) {
        var href = links[j].getAttribute("href") || "";
        if (group.hrefs.indexOf(href) >= 0) {
          var clone = links[j].cloneNode(true);
          clone.className = "ng-footer-column-link";
          column.appendChild(clone);
        }
      }

      if (!group.hrefs.length) {
        column.appendChild(makeText("span", "ng-footer-column-note", "Yakında"));
      }
      columns.appendChild(column);
    }

    columns.setAttribute("data-ng-version", "1");
    return true;
  }

  /* ---------- Bos sayfalara gomulen uygulamalar (Taco'daki sistemin portu) ----
     Altyapidan bos/placeholder gelen sayfalarin icerigi gizlenip yerine iframe
     konuyor (stil CSS'te, [data-ng-embed-host] + .ng-page-embed). page-content
     SPA rota degisiminde AYNI DOM dugumu kaldigi icin eslesme yoksa host
     isareti MUTLAKA silinir. Kimlik: /api/v1/me ayni origin'den oturum
     cerezi ile player.userName dondurur; embed'ler ?username= ile acilir.
     Sondaj bitmeden embed ACILMAZ (sonradan src degistirmek reload demek). */

  var NG_PROBE_URL = "/api/v1/me";
  var NG_PROBE_TIMEOUT = 4000;
  var NG_PROBE_MIN_ARA = 30000;

  var ngOyuncuAdi = null;
  var ngSondajBitti = false;
  var ngSondajCalisiyor = false;
  var ngSonSondaj = 0;

  function ngSondajla(bitince) {
    if (ngSondajCalisiyor) return;
    ngSondajCalisiyor = true;
    ngSonSondaj = Date.now();

    var kapandi = false;
    function bitir() {
      if (kapandi) return;
      kapandi = true;
      ngSondajCalisiyor = false;
      ngSondajBitti = true;
      if (bitince) bitince();
    }

    setTimeout(bitir, NG_PROBE_TIMEOUT);

    fetch(NG_PROBE_URL, { credentials: "include" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (me) {
        var ad = me && me.player && me.player.userName;
        if (ad) ngOyuncuAdi = ad;
      })
      .catch(function () { /* sessiz */ })
      .then(bitir);
  }

  function ngEmbedHazir() {
    if (!ngSondajBitti) {
      ngSondajla(scheduleCriticalEnhancements);
      return false;
    }
    if (!ngOyuncuAdi && Date.now() - ngSonSondaj > NG_PROBE_MIN_ARA) {
      ngSondajla(scheduleCriticalEnhancements);
      return false;
    }
    return true;
  }

  function ngEmbedUrl(src) {
    if (!ngOyuncuAdi) return src;
    return src + (src.indexOf("?") === -1 ? "?" : "&") +
           "username=" + encodeURIComponent(ngOyuncuAdi);
  }

  var NG_PAGE_EMBEDS = [
    { path: "/tr/bonusrequest", src: "https://narcoslynon.up.railway.app/bonus",       baslik: "Bonus Talep" },
    { path: "/tr/tacowheel",    src: "https://narcoslynon.up.railway.app/",            baslik: "Narcos Cark" },
    { path: "/tr/narcosskor",   src: "https://narcoslynon.up.railway.app/skor-tahmin", baslik: "Narcos Skor" },
    { path: "/tr/aranmatalep",  src: "https://narcosara.up.railway.app/",              baslik: "Aranma Talep" }
  ];

  function installPageEmbeds() {
    var existing = document.querySelector("[data-ng-page-embed]");
    var path = window.location.pathname.replace(/\/+$/, "");

    var cfg = null;
    for (var i = 0; i < NG_PAGE_EMBEDS.length; i++) {
      if (NG_PAGE_EMBEDS[i].path === path) { cfg = NG_PAGE_EMBEDS[i]; break; }
    }

    if (!cfg) {
      if (existing) existing.remove();
      var host = document.querySelector("[data-ng-embed-host]");
      if (host) host.removeAttribute("data-ng-embed-host");
      return;
    }

    if (existing && existing.getAttribute("data-ng-page-embed") !== path) {
      existing.remove();
      existing = null;
    }

    var content = document.querySelector('[data-mj="page-content"]');
    if (!content) return;

    if (!content.hasAttribute("data-ng-embed-host")) {
      content.setAttribute("data-ng-embed-host", "");
    }

    if (existing) return;
    if (!ngEmbedHazir()) return;

    var wrap = document.createElement("div");
    wrap.className = "ng-page-embed";
    wrap.setAttribute("data-ng-page-embed", path);

    var frame = document.createElement("iframe");
    frame.src = ngEmbedUrl(cfg.src);
    frame.title = cfg.baslik;
    frame.width = "100%";
    frame.frameBorder = "0";
    frame.scrolling = "no";
    frame.allow = "autoplay";
    frame.setAttribute("loading", "eager");

    wrap.appendChild(frame);
    content.appendChild(wrap);
  }

  /* Hesap panelindeki "Bonus Talep Et" modalina gomme (t=bonus_offers).
     Secici YAPISAL: modalin son cocugu sag panel, onun son cocugu icerik
     kutusu. Baska sekmeye gecilince isaret temizlenir (React ayni dugumu
     yeniden kullaniyor). */

  var NG_MODAL_EMBED = {
    tab: "bonus_offers",
    src: "https://narcoslynon.up.railway.app/bonus",
    baslik: "Bonus Talep"
  };

  function installModalEmbed() {
    var existing = document.querySelector("[data-ng-modal-embed]");
    var onTab = window.location.search.indexOf("t=" + NG_MODAL_EMBED.tab) !== -1;

    if (!onTab) {
      if (existing) existing.remove();
      var stale = document.querySelector("[data-ng-modal-embed-host]");
      if (stale) stale.removeAttribute("data-ng-modal-embed-host");
      return;
    }

    var modal = document.querySelector(".modal");
    if (!modal) return;

    /* Masaustu: modal >=2 cocuk (sol menu + sag panel); host = sag panelin son
       cocugu. MOBIL: modal TEK cocuk (kabuk = baslik seridi + govde); host =
       kabugun son cocugu (govde). */
    var host = null;
    if (modal.children.length >= 2) {
      var right = modal.children[modal.children.length - 1];
      if (right && right.children.length >= 2) {
        host = right.children[right.children.length - 1];
      }
    } else if (modal.children.length === 1) {
      var shell = modal.children[0];
      if (shell && shell.children.length >= 2) {
        host = shell.children[shell.children.length - 1];
      }
    }
    if (!host) return;

    if (!host.hasAttribute("data-ng-modal-embed-host")) {
      host.setAttribute("data-ng-modal-embed-host", "");
    }

    if (existing) return;
    if (!ngEmbedHazir()) return;

    var wrap = document.createElement("div");
    wrap.className = "ng-modal-embed";
    wrap.setAttribute("data-ng-modal-embed", NG_MODAL_EMBED.tab);

    var frame = document.createElement("iframe");
    frame.src = ngEmbedUrl(NG_MODAL_EMBED.src);
    frame.title = NG_MODAL_EMBED.baslik;
    frame.frameBorder = "0";
    frame.allow = "autoplay";
    frame.setAttribute("loading", "eager");

    wrap.appendChild(frame);
    host.appendChild(wrap);
  }

  function installFooterEnhancements() {
    var footerContent = document.querySelector('[data-mj="footer-content"]');
    var footer = document.querySelector("footer");
    var target = footerContent || footer;
    if (!target || !footer) return false;

    var licenseBanner = installLicenseBanner(target);
    var socialPanel = installSocialPanel(target, licenseBanner);
    installValuesPanel(target, socialPanel);
    installContactButton(target);
    markAgeBadge(footer);
    updateExistingTelegramLink(footer);
    return true;
  }

  function installCriticalEnhancements() {
    markCurrentRoute();
    installHeaderLicenseBadge();
    installMobileCallButton();
    installHeaderTelegramButton();
    installHeaderGiftButton();
    installCampaignPage();
    installPageEmbeds();
    installModalEmbed();
  }

  function installDeferredEnhancements() {
    installTrustHubWidget();
    installJackpotWidget();
    markMobileSidebar();
    markLeagueWidget();
    installFooterNavigationColumns();
    localizeProviderSheet();
    removeCampaignLinks();
    installFooterEnhancements();
  }

  var observer = null;
  var criticalScheduled = false;
  var deferredScheduled = false;

  function runCriticalEnhancements() {
    criticalScheduled = false;
    installCriticalEnhancements();
    if (observer) observer.takeRecords();
  }

  function scheduleCriticalEnhancements() {
    if (criticalScheduled) return;
    criticalScheduled = true;
    if ("requestAnimationFrame" in window) {
      window.requestAnimationFrame(runCriticalEnhancements);
    } else {
      window.setTimeout(runCriticalEnhancements, 24);
    }
  }

  function runDeferredEnhancements() {
    deferredScheduled = false;
    installDeferredEnhancements();
    if (observer) observer.takeRecords();
  }

  function scheduleDeferredEnhancements(timeout) {
    if (deferredScheduled) return;
    deferredScheduled = true;

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(runDeferredEnhancements, { timeout: timeout || 1200 });
    } else {
      window.setTimeout(runDeferredEnhancements, 320);
    }
  }

  function scheduleEffectsReady() {
    var activate = function () {
      document.documentElement.classList.add("ng-effects-ready");
    };
    var queue = function () {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(activate, { timeout: 1600 });
      } else {
        window.setTimeout(activate, 650);
      }
    };

    if (document.readyState === "complete") queue();
    else window.addEventListener("load", queue, { once: true });
  }

  var criticalSelector = [
    '[data-mj="header"]',
    '[aria-label="site-header"]',
    '[data-mj="header-left"]',
    '[data-mj="header-right"]',
    '[data-mj="header-special-button"]',
    /* gomulu sayfalar + bonus modal: icerik/modal mount olunca embed kur */
    '[data-mj="page-content"]',
    '.modal'
  ].join(",");

  var deferredSelector = [
    '[data-mj="mobile-nav-list"]',
    '[data-mj="widget-top-providers"]',
    '[data-mj="widget-pages"]',
    '[data-mj="widget-collection-slider"]',
    '[data-mj="game-catalog-module"]',
    '[data-mj="game-catalog-provider-bottom-sheet-search"]',
    '[data-mj="footer-top"]',
    '[data-mj="footer-nav"]',
    '[data-mj="footer-content"]',
    'footer'
  ].join(",");

  function matchesEnhancementSelector(node, selector) {
    if (!node || node.nodeType !== 1) return false;
    if (node.closest && node.closest('[id^="narcos-"]')) return false;
    return node.matches(selector) || !!node.querySelector(selector);
  }

  function isCriticalNode(node) {
    if (matchesEnhancementSelector(node, criticalSelector)) return true;
    return !!(
      node &&
      node.nodeType === 1 &&
      getCampaignRoute() &&
      (node.matches("main") || node.querySelector("main"))
    );
  }

  var lastKnownPath = window.location.pathname || "/";

  function handleRouteChange() {
    var currentPath = window.location.pathname || "/";
    if (currentPath === lastKnownPath) return;
    lastKnownPath = currentPath;
    scheduleCriticalEnhancements();
    scheduleDeferredEnhancements(900);
  }

  function installRouteChangeListeners() {
    var eventName = "narcos:routechange";
    var methods = ["pushState", "replaceState"];

    for (var i = 0; i < methods.length; i += 1) {
      var methodName = methods[i];
      var original = window.history[methodName];
      if (typeof original !== "function" || original.__narcosWrapped) continue;

      var wrapped = (function (historyMethod) {
        return function () {
          var result = historyMethod.apply(this, arguments);
          window.dispatchEvent(new Event(eventName));
          return result;
        };
      })(original);
      wrapped.__narcosWrapped = true;

      try {
        window.history[methodName] = wrapped;
      } catch (error) {
        /* Read-only History implementations still work through popstate/click. */
      }
    }

    window.addEventListener(eventName, handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("hashchange", handleRouteChange);
    document.addEventListener("click", function (event) {
      var target = event.target;
      var link = target && target.closest ? target.closest("a[href]") : null;
      if (!link || link.origin !== window.location.origin) return;
      window.setTimeout(handleRouteChange, 0);
    }, true);
  }

  installRouteChangeListeners();
  installCriticalEnhancements();
  scheduleDeferredEnhancements(1400);
  scheduleEffectsReady();

  observer = new MutationObserver(function (records) {
    var criticalRelevant = false;
    var deferredRelevant = false;

    for (var i = 0; i < records.length && (!criticalRelevant || !deferredRelevant); i += 1) {
      var record = records[i];
      if (!criticalRelevant && isCriticalNode(record.target)) criticalRelevant = true;
      if (!deferredRelevant && matchesEnhancementSelector(record.target, deferredSelector)) deferredRelevant = true;

      for (var j = 0; j < record.addedNodes.length; j += 1) {
        var addedNode = record.addedNodes[j];
        if (!criticalRelevant && isCriticalNode(addedNode)) criticalRelevant = true;
        if (!deferredRelevant && matchesEnhancementSelector(addedNode, deferredSelector)) deferredRelevant = true;
        if (criticalRelevant && deferredRelevant) break;
      }
    }

    if (criticalRelevant || deferredRelevant) scheduleCriticalEnhancements();
    if (deferredRelevant) scheduleDeferredEnhancements(900);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();