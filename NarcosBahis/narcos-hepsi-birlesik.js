/*! narcos-hepsi-birlesik.js — NarcosBahis tek dosya tema + panel calisma zamani
 *
 * NEDEN TEK DOSYA:
 *   Onceki kurulum backoffice'e satir ici bir yukleyici koyup CDN'den iki ayri
 *   script cekiyordu. Uc sorunu vardi:
 *     1) `s.defer = true` DINAMIK eklenen klasik script'te yok sayilir; boyle
 *        eklenen script varsayilan olarak async'tir. Iki dosyanin calisma
 *        sirasi garanti degildi (sira isteniyorsa `s.async = false` gerekir).
 *     2) Tarayicinin preload tarayicisi yukleyici calisana kadar bu URL'leri
 *        goremiyor; iki dosyanin indirilmesi bir tur geciktiriliyordu.
 *     3) Yinelenme korumasi (`script[src*="dosya"]`) yalnizca DOSYA ADINA
 *        bakiyordu, surume degil: sayfada eski surum asiliysa yenisi hic
 *        yuklenmiyordu.
 *   Dosyalar tek URL'de birlestirilince ucu de ortadan kalkiyor ve backoffice
 *   alanina tek bir <script src> yetiyor.
 *
 * ICERIK (sirayla):
 *   1) Tema calisma zamani v2   — narcos-footer-birlesik.js @ 74820c7
 *      (taban: narcos-license-footer.js @ 2721b32, + spor rota duzeltmesi)
 *   2) Panel gomme (iframe)     — narcos-panel-gomme.js @ 74820c7
 *   3) Zepcom kimlik aktarimi   — bu surumde geri getirildi (asagida)
 *
 * VARLIKLAR: ikonlar/arka planlar bu dosyanin yaninda durmali. Yol
 * `document.currentScript.src` uzerinden cozulur, yani dosyayi hangi CDN
 * yolundan sunarsan varliklar da o yoldan cekilir.
 */

/* NarcosBahis production premium theme runtime v2.
   Keeps the current public DOM contract while avoiding destructive SPA patches. */
(function () {
  "use strict";
  var GLOBAL_KEY = "__narcosPremiumThemeRuntime", VERSION = "2.4.1";
  var previous = window[GLOBAL_KEY];
  if (previous && previous.version === VERSION && previous.refresh) {
    previous.refresh();
    return;
  }
  if (previous && previous.destroy) previous.destroy();
  var VERIFY_URL = "https://verification.anjouangamblingboard.org/s/140e70a801efff238b59b01782ba34d909755fd6e27deb06c4959b328d6e9698e01f00b62578604eca16f199ebb446cb";
  var TELEGRAM_URL = "https://t.me/narcosresmi", CURRENT_URL = "https://narcosgir.com";
  var WEBSITE_URL = "https://narcosbahis.com/", SUPPORT_EMAIL = "destek@narcosbahis.com", REVISION = "v9";
  var CASINO_LOBBY_PATH = "/tr/casino/all", LIVE_CASINO_LOBBY_PATH = "/tr/livecasino/all";
  var CALL_REQUEST_PATH = "/tr/aranmatalep";
  /**
   * Varlik (ikon/gorsel) kok yolu.
   *
   * Onceki surumde iki hata vardi:
   *   - Yedek secici `script[src*="narcos-license-footer"]` arıyordu; dosya adi
   *     `narcos-footer-birlesik.js` olarak degistiginde bu secici ARTIK HICBIR
   *     ZAMAN eslesmiyordu. Ayni sey stil yedegi icin de gecerliydi
   *     (`narcos-premium-gold-glass.css` -> `narcos-tema-birlesik.css`).
   *   - Son care olarak `@main` sabitlenmisti. Iki sorun: (a) main dali FARKLI
   *     bir tema soy agaci (v1) tasiyor, yani varliklar canlidaki surumle
   *     eslesmeyebilir; (b) `@main` degisken bir ref, jsDelivr uzun sure
   *     onbellekliyor.
   *
   * Simdi: adlar guncel, yedekler dosyanin gercek adlarini ariyor ve son care
   * gorece yol (`./`) — yani script'i nereden sunuyorsan varliklar da oradan
   * gelir, yanlis depoya dusmez.
   */
  function getBaseUrl() {
    var script = document.currentScript ||
      document.querySelector('script[src*="narcos-hepsi-birlesik"]') ||
      document.querySelector('script[src*="narcos-footer-birlesik"]');
    var source = script && script.src;
    if (!source) {
      var stylesheet = document.querySelector('link[href*="narcos-tema-birlesik.css"]');
      source = stylesheet && stylesheet.href;
    }
    try {
      return new URL(".", source || window.location.href).href;
    } catch (error) {
      return "./";
    }
  }
  var BASE_URL = getBaseUrl();
  var ASSETS = {
    chat: BASE_URL + "narcos-chat-icon.png", telephone: BASE_URL + "narcos-telephone-icon.png",
    telegram: BASE_URL + "narcos-telegram-icon.png", web: BASE_URL + "narcos-web-icon.png",
    license: BASE_URL + "narcos-license-badge.png"
  };
  var runtime = {
    version: VERSION,
    observer: null, frameObserver: null, headerObserver: null, textObserver: null,
    resizeObserver: null,
    observedShellNodes: [], observedFrameNodes: [], observedGameResizeNodes: [],
    observedHeaderNode: null, observedTextRoots: [],
    frameStates: typeof WeakMap === "function" ? new WeakMap() : null,
    listeners: [], history: [], path: "", route: null,
    gameActive: false, gameReturnUrl: "", gameLobbyPath: CASINO_LOBBY_PATH,
    pendingGameReturnUrl: "", pendingGameReturnAt: 0,
    pendingGamePath: "", lastSafeUrl: "", gameMissingSince: 0, gameMissingTimer: 0,
    activeGameFrame: null, activeGameHosts: [],
    campaignMain: null, campaignTitle: "", generatedTitle: "",
    criticalFrame: 0, deferredHandle: 0, deferredKind: "", pendingGameTimer: 0,
    effectsHandle: 0, effectsKind: "",
    criticalDirty: Object.create(null), deferredDirty: Object.create(null)
  };
  window[GLOBAL_KEY] = runtime;
  function query(selector, root) { return (root || document).querySelector(selector); }
  function create(tag, className, textValue) {
    var element = document.createElement(tag);
    if (className) element.className = className; if (textValue !== undefined) element.textContent = textValue;
    return element;
  }
  function makeImage(src, className, alt, width, height, lazy) {
    var image = create("img", className);
    image.alt = alt || ""; image.width = width; image.height = height;
    image.decoding = "async";
    if (lazy) image.loading = "lazy";
    if (lazy) image.setAttribute("fetchpriority", "low");
    image.src = src;
    return image;
  }
  function externalLink(href, className, textValue, ariaLabel) {
    var link = create("a", className, textValue);
    link.href = href; link.target = "_blank";
    link.rel = "noopener noreferrer external"; if (ariaLabel) link.setAttribute("aria-label", ariaLabel);
    return link;
  }
  function place(parent, node, before) {
    before = before || null;
    if (node === before) return node;
    if (node.parentElement !== parent || node.nextSibling !== before) parent.insertBefore(node, before);
    return node;
  }
  function mount(id, tag, parent, before, render) {
    var node = document.getElementById(id);
    if (!node) node = create(tag);
    node.id = id;
    if (node.getAttribute("data-ng-revision") !== REVISION) {
      node.textContent = ""; render(node);
      node.setAttribute("data-ng-revision", REVISION);
    }
    return place(parent, node, before);
  }
  function directChild(node, parent) {
    while (node && node.parentElement && node.parentElement !== parent) node = node.parentElement;
    return node && node.parentElement === parent ? node : null;
  }
  function cleanPath() {
    return (window.location.pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
  }
  function isGameRoutePath(path) {
    return /^\/tr\/(?:game|play|launch)(?:\/|$)/.test(path) ||
      /^\/tr\/(?:casino|live-casino|livecasino|canli-casino)\/[^/]+\/[^/]+(?:\/|$)/.test(path);
  }
  function classifyRoute(path) {
    var home = path === "/" || path === "/tr", casino = path === "/tr/casino" || path === "/tr/casino/all";
    var liveCasino = /^\/tr\/(?:live-casino|livecasino|canli-casino)(?:\/|$)/.test(path), promotion = /^\/tr\/promotions(?:\/|$)/.test(path);
    var sports = /^\/tr\/(?:sport|sports|sportsbook)(?:\/|$)/.test(path);
    return {
      path: path, home: home, casino: casino, liveCasino: liveCasino, promotion: promotion, sports: sports,
      infoSafe: home || /^\/tr\/casino(?:\/|$)/.test(path) || liveCasino || promotion,
      campaign: campaignRoute(path)
    };
  }
  function observeShellNode(node) {
    if (!node || !runtime.resizeObserver || runtime.observedShellNodes.indexOf(node) !== -1) return;
    runtime.observedShellNodes.push(node);
    runtime.resizeObserver.observe(node);
  }
  function pruneShellNodes() {
    for (var i = runtime.observedShellNodes.length - 1; i >= 0; i -= 1) {
      if (runtime.observedShellNodes[i].isConnected) continue;
      if (runtime.resizeObserver) runtime.resizeObserver.unobserve(runtime.observedShellNodes[i]);
      runtime.observedShellNodes.splice(i, 1);
    }
  }
  var FRAME_ATTRIBUTE_OPTIONS = {
    attributes: true,
    attributeFilter: ["src", "srcdoc", "hidden", "aria-hidden", "class", "style"]
  };
  function pruneFrameNodes() {
    if (!runtime.frameObserver) return;
    var connected = runtime.observedFrameNodes.filter(function (node) {
      return node && node.nodeType === 1 && node.ownerDocument === document && node.isConnected;
    });
    if (connected.length === runtime.observedFrameNodes.length) return;
    runtime.frameObserver.disconnect();
    runtime.observedFrameNodes = connected;
    connected.forEach(function (node) {
      runtime.frameObserver.observe(node, FRAME_ATTRIBUTE_OPTIONS);
    });
  }
  function pushUniqueNode(nodes, node) {
    if (node && node.nodeType === 1 && node.ownerDocument === document &&
        nodes.indexOf(node) === -1) {
      nodes.push(node);
    }
  }
  function syncFrameObservers(frames, main) {
    var attributeNodes = [];
    Array.prototype.forEach.call(frames, function (frame) {
      pushUniqueNode(attributeNodes, frame);
      var node = frame.parentElement;
      while (node) {
        pushUniqueNode(attributeNodes, node);
        if (runtime.frameStates && !runtime.frameStates.has(node)) {
          runtime.frameStates.set(node, { expanded: false });
        }
        if (node === main) break;
        node = node.parentElement;
      }
    });
    var sameAttributeNodes = attributeNodes.length === runtime.observedFrameNodes.length;
    if (sameAttributeNodes) {
      for (var index = 0; index < attributeNodes.length; index += 1) {
        if (attributeNodes[index] !== runtime.observedFrameNodes[index]) {
          sameAttributeNodes = false;
          break;
        }
      }
    }
    if (!sameAttributeNodes && runtime.frameObserver) {
      runtime.frameObserver.disconnect();
      runtime.observedFrameNodes = attributeNodes;
      attributeNodes.forEach(function (node) {
        runtime.frameObserver.observe(node, FRAME_ATTRIBUTE_OPTIONS);
      });
    }
    var resizeNodes = Array.prototype.filter.call(frames, function (frame, index) {
      return frame && frame.ownerDocument === document &&
        Array.prototype.indexOf.call(frames, frame) === index;
    });
    if (runtime.resizeObserver) {
      runtime.observedGameResizeNodes.forEach(function (node) {
        if (resizeNodes.indexOf(node) === -1) runtime.resizeObserver.unobserve(node);
      });
      resizeNodes.forEach(function (node) {
        if (runtime.observedGameResizeNodes.indexOf(node) === -1) {
          runtime.resizeObserver.observe(node);
        }
      });
    }
    runtime.observedGameResizeNodes = resizeNodes;
  }
  function observeHeaderState(node) {
    if (!node || node.nodeType !== 1 || node.ownerDocument !== document ||
        !runtime.headerObserver || runtime.observedHeaderNode === node) return;
    runtime.headerObserver.disconnect();
    runtime.observedHeaderNode = node;
    runtime.headerObserver.observe(node, {
      attributes: true,
      subtree: true,
      attributeFilter: ["hidden", "aria-hidden", "class", "style"]
    });
  }
  var TEXT_OBSERVER_OPTIONS = { characterData: true, subtree: true };
  function pruneTextRoots() {
    if (!runtime.textObserver) return;
    var route = runtime.route || classifyRoute(cleanPath());
    var roots = runtime.observedTextRoots.filter(function (node) {
      if (!node || node.nodeType !== 1 || node.ownerDocument !== document || !node.isConnected) {
        return false;
      }
      if (node.matches('[data-mj="widget-collection-slider"]')) {
        return route.home && node.getAttribute("data-ng-league-inspected") !== "1";
      }
      return true;
    });
    if (roots.length === runtime.observedTextRoots.length) return;
    runtime.textObserver.disconnect();
    runtime.observedTextRoots = roots;
    roots.forEach(function (node) {
      runtime.textObserver.observe(node, TEXT_OBSERVER_OPTIONS);
    });
  }
  function observeTextRoot(node) {
    if (!node || node.nodeType !== 1 || node.ownerDocument !== document ||
        !runtime.textObserver || runtime.observedTextRoots.indexOf(node) !== -1) return;
    runtime.observedTextRoots.push(node);
    runtime.textObserver.observe(node, TEXT_OBSERVER_OPTIONS);
  }
  function activeHeader() {
    var headers = document.querySelectorAll('[data-mj="header"]');
    var fallback = headers.length ? headers[headers.length - 1] : null;
    for (var i = headers.length - 1; i >= 0; i -= 1) {
      var style = window.getComputedStyle(headers[i]);
      var rect = headers[i].getBoundingClientRect();
      if (style.display !== "none" && style.visibility !== "hidden" && rect.width > 0) return headers[i];
    }
    return fallback;
  }
  function activePageMain() {
    var mains = document.querySelectorAll('main[data-mj="page-content"]');
    for (var i = mains.length - 1; i >= 0; i -= 1) {
      var style = window.getComputedStyle(mains[i]);
      var rect = mains[i].getBoundingClientRect();
      if (mains[i].isConnected && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0) {
        return mains[i];
      }
    }
    return mains.length ? mains[mains.length - 1] : null;
  }
  function safeReturnUrl(candidate) {
    if (!candidate) return "";
    try {
      var url = new URL(candidate, window.location.origin);
      var path = url.pathname.toLowerCase();
      if (url.origin !== window.location.origin) return "";
      if (/\/(?:game|play|launch)(?:\/|$)/.test(path)) return "";
      return url.href;
    } catch (error) {
      return "";
    }
  }
  function inferGameLobbyPath(sourceNode) {
    var path = cleanPath();
    if (/^\/tr\/(?:live-casino|livecasino|canli-casino)(?:\/|$)/.test(path)) {
      return LIVE_CASINO_LOBBY_PATH;
    }
    var node = sourceNode, parts = [], depth = 0;
    while (node && node.nodeType === 1 && depth < 7) {
      if (node.tagName === "MAIN") break;
      ["href", "data-mj", "data-testid", "id", "class", "aria-label"].forEach(function (name) {
        var value = node.getAttribute && node.getAttribute(name);
        if (value) parts.push(value);
      });
      if (depth === 0 && node.textContent) parts.push(node.textContent.slice(0, 180));
      node = node.parentElement;
      depth += 1;
    }
    return /(?:live[-_\s]?casino|canli[-_\s]?casino|canlı\s*casino)/i.test(parts.join(" ")) ?
      LIVE_CASINO_LOBBY_PATH : CASINO_LOBBY_PATH;
  }
  function gameLobbyUrl() {
    return new URL(runtime.gameLobbyPath || CASINO_LOBBY_PATH, window.location.origin).href;
  }
  function rememberSafePage(candidate) {
    var safe = safeReturnUrl(candidate);
    if (safe) runtime.lastSafeUrl = safe;
    return safe;
  }
  function clearPendingGameReturn() {
    runtime.pendingGameReturnUrl = "";
    runtime.pendingGameReturnAt = 0;
    runtime.pendingGamePath = "";
    if (runtime.pendingGameTimer) {
      window.clearTimeout(runtime.pendingGameTimer);
      runtime.pendingGameTimer = 0;
    }
  }
  function armGameReturn(sourceNode) {
    runtime.gameLobbyPath = inferGameLobbyPath(sourceNode);
    runtime.gameReturnUrl = gameLobbyUrl();
    runtime.pendingGameReturnUrl = runtime.gameReturnUrl;
    runtime.pendingGameReturnAt = Date.now();
    runtime.pendingGamePath = cleanPath();
    renderGameReturn(true);
    queueCritical(["shell"]);
    if (runtime.pendingGameTimer) window.clearTimeout(runtime.pendingGameTimer);
    runtime.pendingGameTimer = window.setTimeout(function () {
      runtime.pendingGameTimer = 0;
      if (runtime.gameActive || freshPendingGameReturn()) return;
      document.documentElement.classList.remove("ng-game-return-ready");
      renderGameReturn(false);
    }, 31000);
  }
  function freshPendingGameReturn() {
    if (!runtime.pendingGameReturnUrl || !runtime.pendingGameReturnAt ||
        Date.now() - runtime.pendingGameReturnAt > 30000) {
      clearPendingGameReturn();
      return "";
    }
    return safeReturnUrl(runtime.pendingGameReturnUrl);
  }
  function clearGameMissingWatch() {
    runtime.gameMissingSince = 0;
    if (runtime.gameMissingTimer) {
      window.clearTimeout(runtime.gameMissingTimer);
      runtime.gameMissingTimer = 0;
    }
  }
  function endGameSession() {
    clearPendingGameReturn();
    clearGameMissingWatch();
    runtime.gameActive = false;
    markActiveGameFrame(null, null);
    document.documentElement.classList.remove("ng-game-embed", "ng-game-return-ready");
  }
  function isFrameTreeVisible(frame, main) {
    var node = frame;
    while (node && node.nodeType === 1) {
      if (node.hidden || node.getAttribute("aria-hidden") === "true") return false;
      var style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || style.visibility === "collapse") {
        return false;
      }
      if (parseFloat(style.opacity) === 0 || style.contentVisibility === "hidden") {
        return false;
      }
      var state = runtime.frameStates && runtime.frameStates.get(node);
      var inlineCollapsed = node.style &&
        (node.style.height === "0px" || node.style.maxHeight === "0px" || node.style.opacity === "0");
      var rect = node.getBoundingClientRect();
      var geometryCollapsed = rect.width === 0 || rect.height === 0;
      if (inlineCollapsed || geometryCollapsed) {
        if (state && state.expanded) return false;
      } else if (state) {
        state.expanded = true;
      }
      if (node === main) break;
      node = node.parentElement;
    }
    return true;
  }
  function markActiveGameFrame(frame, main) {
    var nextHosts = [];
    var nextNode = frame && frame.parentElement;
    while (nextNode) {
      if (nextNode === main) break;
      nextHosts.push(nextNode);
      nextNode = nextNode.parentElement;
    }
    var unchanged = runtime.activeGameFrame === (frame || null) &&
      runtime.activeGameHosts.length === nextHosts.length;
    if (unchanged) {
      for (var index = 0; index < nextHosts.length; index += 1) {
        if (runtime.activeGameHosts[index] !== nextHosts[index]) {
          unchanged = false;
          break;
        }
      }
    }
    if (unchanged && frame &&
        frame.getAttribute("data-ng-active-game-frame") !== "true") {
      unchanged = false;
    }
    if (unchanged) {
      for (var markerIndex = 0; markerIndex < nextHosts.length; markerIndex += 1) {
        if (nextHosts[markerIndex].getAttribute("data-ng-active-game-host") !== "true") {
          unchanged = false;
          break;
        }
      }
    }
    if (unchanged) return;
    if (runtime.activeGameFrame && runtime.activeGameFrame !== frame) {
      runtime.activeGameFrame.removeAttribute("data-ng-active-game-frame");
    }
    runtime.activeGameHosts.forEach(function (host) {
      if (host && host.removeAttribute) host.removeAttribute("data-ng-active-game-host");
    });
    runtime.activeGameHosts = [];
    runtime.activeGameFrame = frame || null;
    if (!frame) return;
    frame.setAttribute("data-ng-active-game-frame", "true");
    nextHosts.forEach(function (host) {
      host.setAttribute("data-ng-active-game-host", "true");
      runtime.activeGameHosts.push(host);
    });
  }
  function renderInfoStrip(header) {
    header = header || activeHeader();
    if (!header) {
      document.documentElement.classList.remove("ng-theme-info-mounted");
      return false;
    }
    var host = (window.location.hostname || "narcosbahis.com").replace(/^www\./i, "");
    observeShellNode(header);
    mount("narcos-info-strip", "aside", header, header.firstElementChild, function (strip) {
      strip.className = "ng-info-strip";
      strip.setAttribute("aria-label", "Güncel giriş adresi");
      var content = create("div", "ng-info-strip-content");
      content.appendChild(externalLink(CURRENT_URL, "ng-info-source", "narcosgir.com", "NarcosBahis güncel giriş sayfasını aç"));
      content.appendChild(create("span", "ng-info-long", "\u00a0adresinden her zaman güncel adresimize ulaşabilirsiniz."));
      content.appendChild(create("span", "ng-info-separator", "\u00a0•\u00a0"));
      content.appendChild(create("span", "ng-info-current-label", "Güncel giriş:\u00a0"));
      content.appendChild(create("strong", "ng-info-current", host));
      strip.appendChild(content);
    });
    document.documentElement.classList.add("ng-theme-info-mounted");
    return true;
  }
  function gameSemanticHost(frame) {
    return frame && frame.closest ? frame.closest(
      '[data-mj="game-player"],[data-mj="game-frame"],[data-mj="game-launcher"],' +
      '[data-mj="game-container"],[data-mj*="game-iframe"],[data-testid*="game-player"],' +
      '[data-testid*="game-frame"],[class*="game-player"],[class*="game-frame"],' +
      '[id*="game-player"],[id*="game-frame"]'
    ) : null;
  }
  function isPotentialGameFrame(frame) {
    if (!frame || frame.id === "phoenix365ifraim") return false;
    if (frame.closest && frame.closest("#sportsbook-wrapper")) return false;
    // Panel gömmesi (narcos-panel-gomme.js) oyun DEĞİLDİR.
    //
    // Panel iframe'i içerik alanındaki tek iframe olduğu için, önceki bir casino
    // oturumundan "pending game return" kalmışsa contextualGameRoute true oluyor
    // ve bu kare oyun sanılıp ng-game-embed tam ekran moduna sokuluyordu.
    // Kullanıcıya "iframe yerine tam ekran açıyor" olarak yansıyan davranış buydu.
    if (frame.hasAttribute && frame.hasAttribute("data-ng-panel")) return false;
    if (frame.closest && frame.closest("#narcos-panel-frame")) return false;
    var source = (frame.getAttribute("src") || "").trim();
    if (/(?:captcha|recaptcha|hcaptcha|turnstile|youtube|vimeo|verification|live-chat)/i.test(source)) return false;
    return true;
  }
  function isEligibleGameFrame(frame, main) {
    return isFrameTreeVisible(frame, main);
  }
  function isContextualGameFrame(frame) {
    var source = (frame.getAttribute("src") || "").trim();
    var sourceDoc = (frame.getAttribute("srcdoc") || "").trim();
    var routePath = runtime.route ? runtime.route.path : cleanPath();
    var explicitGameContext = isGameRoutePath(routePath);
    var pendingContext = !!freshPendingGameReturn();
    if (!explicitGameContext && !pendingContext) return false;
    if ((source && !/^about:blank(?:#|$)/i.test(source)) || sourceDoc) return true;
    return explicitGameContext || pendingContext;
  }
  function syncEmbeddedGameState(main) {
    main = main || activePageMain();
    var frames = main ? main.querySelectorAll("iframe") : [];
    var frame = null, loneCandidate = null, candidateCount = 0;
    var observedCandidates = [];
    var routePath = runtime.route ? runtime.route.path : cleanPath();
    var contextualGameRoute = isGameRoutePath(routePath) || !!freshPendingGameReturn();
    for (var i = 0; i < frames.length; i += 1) {
      if (!isPotentialGameFrame(frames[i])) continue;
      var semanticHost = gameSemanticHost(frames[i]);
      if (!semanticHost && !contextualGameRoute) continue;
      observedCandidates.push(frames[i]);
      if (runtime.frameStates && !runtime.frameStates.has(frames[i])) {
        runtime.frameStates.set(frames[i], { expanded: false });
      }
      if (!isEligibleGameFrame(frames[i], main)) continue;
      candidateCount += 1;
      if (candidateCount === 1) loneCandidate = frames[i];
      if (semanticHost) {
        frame = frames[i];
        break;
      }
    }
    if (!frame && candidateCount === 1 && isContextualGameFrame(loneCandidate)) frame = loneCandidate;
    syncFrameObservers(observedCandidates, main);
    var active = !!frame;
    if (active) {
      clearGameMissingWatch();
    }
    if (active && !runtime.gameActive) {
      if (!freshPendingGameReturn()) runtime.gameLobbyPath = inferGameLobbyPath(frame);
      runtime.gameReturnUrl = gameLobbyUrl();
      clearPendingGameReturn();
    }
    if (active) {
      runtime.gameActive = true;
      markActiveGameFrame(frame, main);
      document.documentElement.classList.add("ng-game-embed");
      return true;
    }
    if (runtime.gameActive) {
      if (!runtime.gameMissingSince) {
        runtime.gameMissingSince = Date.now();
        runtime.gameMissingTimer = window.setTimeout(function () {
          runtime.gameMissingTimer = 0;
          if (window[GLOBAL_KEY] === runtime) queueCritical(["shell"]);
        }, 480);
      }
      if (Date.now() - runtime.gameMissingSince < 420) return true;
      endGameSession();
      return false;
    }
    markActiveGameFrame(null, null);
    document.documentElement.classList.remove("ng-game-embed");
    return !!freshPendingGameReturn();
  }
  function renderGameReturn(active, shell) {
    document.documentElement.classList.toggle("ng-game-return-ready", !!active);
    var existing = document.getElementById("narcos-game-return");
    if (!active) {
      if (existing) existing.remove();
      return false;
    }
    shell = shell || activeHeader();
    var header = shell && query('[aria-label="site-header"]', shell);
    if (!header) header = query('[aria-label="site-header"]');
    if (!header) return false;
    var button = mount("narcos-game-return", "a", header, null, function (button) {
      button.className = "ng-game-return";
      button.setAttribute("aria-label", "Oyun lobisine geri dön");
      button.setAttribute("data-ng-action", "game-return");
      var icon = create("span", "ng-game-return-icon", "←");
      icon.setAttribute("aria-hidden", "true");
      button.appendChild(icon);
      button.appendChild(create("span", "ng-game-return-label", "Lobiye Dön"));
    });
    button.href = gameLobbyUrl();
    return true;
  }
  function normalizeBottomNav() {
    var navs = document.querySelectorAll('[data-mj="bottom-nav"]');
    Array.prototype.forEach.call(navs, function (nav) {
      Array.prototype.forEach.call(
        nav.querySelectorAll('[data-mj="bottom-nav-item"] p'),
        function (label) {
          if (label.textContent.trim().toLocaleLowerCase("tr-TR") === "promosyonlar") {
            label.textContent = "Promosyon";
          }
        }
      );
    });
    return navs.length > 0;
  }
  function renderShell() {
    pruneShellNodes();
    pruneFrameNodes();
    pruneTextRoots();
    var header = activeHeader();
    var main = activePageMain();
    normalizeBottomNav();
    renderInfoStrip(header);
    renderGameReturn(syncEmbeddedGameState(main), header);
    return true;
  }
  function listen(target, type, handler, options) {
    target.addEventListener(type, handler, options); runtime.listeners.push([target, type, handler, options]);
  }
  function findChatButton() { return query('button[aria-label="Sohbeti aç"],button[aria-label*="Sohbet"],button[aria-label*="sohbet"]'); }
  function isRejectedProfileRoot(root, right) {
    if (!root || root.parentElement !== right || root.id && root.id.indexOf("narcos-") === 0) return true;
    if (root.matches('[data-mj="login-button"],[data-mj="register-button"],[data-mj="header-special-button"],[role="combobox"]')) return true;
    if (query('[data-mj="login-button"],[data-mj="register-button"],[data-mj="header-special-button"],[role="combobox"]', root)) return true;
    var signal = [
      root.getAttribute("data-mj"), root.getAttribute("data-testid"), root.getAttribute("aria-label"),
      root.getAttribute("title"), root.id, root.className, root.textContent
    ].join(" ").toLowerCase();
    return /(?:türkçe|turkce|language|locale|flag|giriş|giris|kayıt|kayit|login|register|balance|wallet|deposit|withdraw|cashier|bakiye|cüzdan|yatır|çekim)/.test(signal);
  }
  function findAuthenticatedProfileRoot(header, right) {
    var selector = [
      '[data-mj*="profile" i]', '[data-mj*="account" i]',
      '[data-testid*="profile" i]', '[data-testid*="account" i]',
      '[aria-label*="profil" i]', '[aria-label*="hesab" i]', '[aria-label*="profile" i]',
      '[aria-label*="account" i]', '[title*="profil" i]', '[title*="hesab" i]',
      '[title*="profile" i]', '[title*="account" i]'
    ].join(",");
    var candidates = right.querySelectorAll(selector);
    for (var i = 0; i < candidates.length; i += 1) {
      var root = directChild(candidates[i], right);
      if (!isRejectedProfileRoot(root, right)) return root;
    }
    var authControls = header.querySelectorAll('[data-mj="login-button"],[data-mj="register-button"]');
    for (var authIndex = 0; authIndex < authControls.length; authIndex += 1) {
      var authStyle = window.getComputedStyle(authControls[authIndex]);
      var authRect = authControls[authIndex].getBoundingClientRect();
      if (authStyle.display !== "none" && authStyle.visibility !== "hidden" && authRect.width > 0 && authRect.height > 0) {
        return null;
      }
    }
    var children = right.children;
    for (var j = children.length - 1; j >= 0; j -= 1) {
      var child = children[j];
      if (isRejectedProfileRoot(child, right)) continue;
      var profileSignal = [
        child.getAttribute("data-mj"), child.getAttribute("data-testid"), child.getAttribute("aria-label"),
        child.getAttribute("title"), child.id, child.className
      ].join(" ").toLowerCase();
      var menu = child.matches('[aria-haspopup="menu"]') || query('[aria-haspopup="menu"]', child);
      var avatar = query('img[alt*="profil" i],img[alt*="profile" i],img[alt*="avatar" i],[class*="avatar" i]', child);
      var buttonLike = child.matches('button,a,[role="button"]') || query('button,a,[role="button"]', child);
      var compactText = (child.innerText || "").replace(/\s+/g, "").trim();
      var visualIcon = query('svg,img,[style*="mask"],[style*="background-image"],[class*="icon" i]', child);
      var childRect = child.getBoundingClientRect();
      var compactSquare = childRect.width >= 24 && childRect.width <= 68 &&
        childRect.height >= 24 && childRect.height <= 68 && Math.abs(childRect.width - childRect.height) <= 16;
      var iconOnly = buttonLike && compactText.length === 0 && (visualIcon || compactSquare);
      if (avatar || (menu && /(?:profil|profile|account|hesab|user|avatar)/.test(profileSignal)) || iconOnly) return child;
    }
    return null;
  }
  function renderHeader() {
    var shell = activeHeader();
    var header = shell && query('[aria-label="site-header"]', shell);
    if (!header) header = query('[aria-label="site-header"]');
    if (!header) return false;
    var left = query('[data-mj="header-left"]', header);
    var right = query('[data-mj="header-right"]', header) || header;
    Array.prototype.forEach.call(document.querySelectorAll(".ng-auth-profile-control"), function (node) {
      node.classList.remove("ng-auth-profile-control");
    });
    var profileRoot = findAuthenticatedProfileRoot(header, right);
    if (profileRoot) profileRoot.classList.add("ng-auth-profile-control");
    if (left) {
      var logo = query('[data-mj="logo"]', left);
      if (logo) {
        var logoRoot = directChild(logo, left) || logo;
        mount("narcos-header-license", "a", left, logoRoot.nextSibling, function (link) {
          link.className = "ng-header-license";
          link.href = VERIFY_URL;
          link.target = "_blank";
          link.rel = "noopener noreferrer external";
          link.setAttribute("aria-label", "Anjouan Gaming lisansını doğrula");
          link.appendChild(makeImage(ASSETS.license, "ng-header-license-image", "Anjouan Gaming lisans rozeti", 42, 42, false));
        });
      }
    }
    var gift = query('[data-mj="header-special-button"]', header);
    if (gift) {
      gift.classList.add("ng-gift-button");
      gift.setAttribute("aria-label", "Hediye ve bonuslar");
      Array.prototype.forEach.call(gift.childNodes, function (node) {
        if (node.nodeType === 3 && node.textContent) node.textContent = "";
      });
      if (!query(".ng-gift-icon", gift)) {
        var giftIcon = create("span", "ng-gift-icon");
        giftIcon.setAttribute("aria-hidden", "true");
        gift.appendChild(giftIcon);
      }
    }
    var login = query('[data-mj="login-button"]', right);
    var loginRoot = directChild(login, right);
    // Aranma talep ikonu kaldirildi: header'da iki ayri giris vardi — burada
    // uretilen telefon ikonu ve CMS menusundeki "Aranma Talep" ogesi. Ikisi de
    // ayni yere gidiyordu; menudeki etiketli oldugu icin daha anlasilir.
    //
    // Onceden olusturulmus dugum kalmasin (tarayicida eski surum onbellekte
    // olabilir ya da kullanici gezinirken DOM'da kalmis olabilir).
    var eskiCall = document.getElementById("narcos-call-button");
    if (eskiCall) eskiCall.remove();
    // Telegram butonu konumunu telefon ikonundan aliyordu; artik login'e gore
    // yerlesiyor.
    var telegram = mount("narcos-telegram-button", "a", right, loginRoot, function (button) {
      button.className = "ng-telegram-button";
      button.href = TELEGRAM_URL;
      button.target = "_blank";
      button.rel = "noopener noreferrer external";
      button.setAttribute("aria-label", "NarcosBahis resmi Telegram kanalını aç");
      var icon = create("span", "ng-telegram-icon");
      icon.setAttribute("aria-hidden", "true");
      button.appendChild(icon);
    });
    var giftRoot = directChild(gift, right);
    if (giftRoot && giftRoot !== loginRoot && giftRoot !== telegram) {
      place(right, giftRoot, telegram);
    }
    observeHeaderState(header);
    observeTextRoot(header);
    if (runtime.headerObserver) runtime.headerObserver.takeRecords();
    renderGameReturn(runtime.gameActive || !!freshPendingGameReturn(), shell);
    return true;
  }
  function socialCard(options) {
    var link = externalLink(options.href, "ng-social-card", "", options.ariaLabel);
    var icon = create("span", "ng-social-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.appendChild(makeImage(options.image, "ng-social-image", "", 24, 24, true));
    var copy = create("span", "ng-social-copy");
    copy.appendChild(create("span", "ng-social-label", options.label));
    copy.appendChild(create("span", "ng-social-value", options.value));
    var arrow = create("span", "ng-social-arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    link.appendChild(icon);
    link.appendChild(copy);
    link.appendChild(arrow);
    return link;
  }
  function valueCard(title, paragraphs) {
    var card = create("article", "ng-value-card");
    card.appendChild(create("h3", "", title));
    paragraphs.forEach(function (paragraph) {
      card.appendChild(create("p", "", paragraph));
    });
    return card;
  }
  function renderLicense(node) {
    node.setAttribute("aria-label", "Lisans doğrulama bilgisi");
    var panel = create("div", "ng-license-panel");
    var badgeLink = externalLink(VERIFY_URL, "ng-license-badge-link", "", "Geçerli lisansı doğrula");
    badgeLink.appendChild(makeImage(ASSETS.license, "ng-license-badge", "Geçerli lisans - doğrulamak için tıklayın", 82, 82, true));
    var copy = create("div", "ng-license-copy");
    copy.appendChild(create("span", "ng-license-eyebrow", "DÜZENLEMELER VE İŞORTAKLARI"));
    var legal = create("p", "ng-license-title");
    legal.appendChild(externalLink(WEBSITE_URL, "", "narcosbahis.com", "NarcosBahis ana sayfasını aç"));
    legal.appendChild(document.createTextNode(
      ", Anjouan Birliği'nin Mutsamudu bölgesinde kayıtlı NarcosBahis Entertainment Limited tarafından işletilmektedir. Platform, Anjouan Eyaleti Offshore Finance Authority tarafından Computer Gaming Licensing Act 007 of 2005 kapsamında düzenlenen ALSI-202607948-FI5 numaralı geçerli internet oyun lisansı ile faaliyet göstermektedir."
    ));
    copy.appendChild(legal);
    panel.appendChild(badgeLink);
    panel.appendChild(copy);
    panel.appendChild(externalLink(VERIFY_URL, "ng-license-action", "Lisans durumunu doğrula", "Lisans durumunu yeni sekmede doğrula"));
    node.appendChild(panel);
  }
  function renderSocial(node) {
    node.setAttribute("aria-label", "Sosyal medya hesaplarımız");
    var heading = create("div", "ng-social-heading");
    heading.appendChild(create("span", "ng-social-kicker", "NARCOSBAHİS RESMİ KANALLARI"));
    heading.appendChild(create("span", "ng-social-title", "Sosyal medya hesaplarımız"));
    node.appendChild(heading);
    node.appendChild(socialCard({
      href: TELEGRAM_URL,
      ariaLabel: "Telegram'da narcosresmi hesabını aç",
      image: ASSETS.telegram,
      label: "Telegram",
      value: "@narcosresmi"
    }));
    node.appendChild(socialCard({
      href: CURRENT_URL,
      ariaLabel: "NarcosBahis güncel adresini aç",
      image: ASSETS.web,
      label: "Her zaman güncel",
      value: "narcosgir.com"
    }));
  }
  function renderValues(node) {
    node.setAttribute("aria-label", "NarcosBahis vizyon ve misyonu");
    node.appendChild(valueCard("VİZYONUMUZ", [
      "NarcosBahis olarak vizyonumuz; yenilikçi teknoloji, güçlü altyapı ve şeffaf hizmet anlayışıyla çevrim içi oyun ve spor bahisleri sektöründe güvenin ve kalitenin simgesi olmaktır.",
      "Hızlı ödeme sistemleri, adil oyun politikası ve güçlü kullanıcı deneyimiyle global ölçekte tercih edilen, güvenli ve sürdürülebilir büyüyen lider bir marka olmayı hedefliyoruz."
    ]));
    node.appendChild(valueCard("MİSYONUMUZ", [
      "NarcosBahis'in misyonu; üyelerine 7/24 kesintisiz hizmet sunmak, yüksek oranlar ve avantajlı kampanyalar sağlamak, hızlı ve güvenilir ödeme altyapısıyla memnuniyeti en üst seviyeye çıkarmaktır.",
      "Şeffaflık, adalet ve güçlü teknolojik altyapı ile güvenli, hızlı ve sorunsuz bir oyun deneyimi sunmayı hedefler."
    ]));
  }
  function renderContact(node) {
    node.className = "ng-contact-button";
    node.href = "mailto:" + SUPPORT_EMAIL;
    node.setAttribute("aria-label", "NarcosBahis destek e-posta adresine ulaşın");
    var icon = create("span", "ng-contact-icon");
    var image = makeImage(ASSETS.chat, "ng-contact-image", "", 22, 22, true);
    image.setAttribute("aria-hidden", "true");
    icon.appendChild(image);
    node.appendChild(icon);
    node.appendChild(create("span", "ng-contact-copy", "BİZE ULAŞIN: " + SUPPORT_EMAIL));
  }
  function markAgeBadge(footer) {
    var current = document.getElementById("narcos-age-badge");
    if (current && footer.contains(current)) return;
    var nodes = footer.querySelectorAll("div,span");
    for (var i = 0; i < nodes.length; i += 1) {
      if (!nodes[i].children.length && nodes[i].textContent.trim() === "18+") {
        nodes[i].id = "narcos-age-badge";
        return;
      }
    }
  }
  function normalizeHref(href) {
    try {
      return new URL(href, window.location.href).pathname.toLowerCase().replace(/\/+$/, "") || "/";
    } catch (error) {
      return String(href || "").split(/[?#]/)[0].toLowerCase().replace(/\/+$/, "");
    }
  }
  function renderFooterColumns() {
    var footerTop = query('[data-mj="footer-top"]');
    var source = footerTop && query('[data-mj="footer-nav"]', footerTop);
    if (!footerTop || !source) return false;
    var links = Array.prototype.slice.call(source.querySelectorAll("a"));
    var groups = [
      { title: "HAKKIMIZDA", hrefs: ["/tr/ha", "/tr/sorumlu"] },
      { title: "YÖNETMELİK", hrefs: ["/tr/genel", "/tr/gizlilik", "/tr/sorular", "/tr/kyc"] },
      { title: "YARDIM", hrefs: ["/tr/iptal", "/tr/finansal", "/tr/karaparaaklama", "/tr/adalet"] },
      { title: "MOBİL UYGULAMA", hrefs: [] }
    ];
    var matched = links.filter(function (link) {
      var path = normalizeHref(link.getAttribute("href"));
      return groups.some(function (group) { return group.hrefs.indexOf(path) >= 0; });
    });
    var oldColumns = query("#narcos-footer-columns", footerTop);
    if (!matched.length) {
      if (oldColumns) oldColumns.remove();
      source.hidden = false;
      source.removeAttribute("aria-hidden");
      source.style.removeProperty("display");
      return false;
    }
    var signature = links.map(function (link) {
      return normalizeHref(link.getAttribute("href")) + ":" + link.textContent.trim();
    }).join("|");
    var columns = oldColumns || create("div");
    columns.id = "narcos-footer-columns";
    if (columns.__ngSourceSignature !== signature) {
      columns.textContent = "";
      groups.forEach(function (group) {
        var column = create("section", "ng-footer-column");
        column.appendChild(create("h3", "ng-footer-column-title", group.title));
        links.forEach(function (link) {
          if (group.hrefs.indexOf(normalizeHref(link.getAttribute("href"))) < 0) return;
          var clone = link.cloneNode(true);
          clone.className = "ng-footer-column-link";
          column.appendChild(clone);
        });
        if (!group.hrefs.length) column.appendChild(create("span", "ng-footer-column-note", "Yakında"));
        columns.appendChild(column);
      });
      columns.__ngSourceSignature = signature;
    }
    if (columns.parentElement !== footerTop) footerTop.appendChild(columns);
    source.hidden = true;
    source.setAttribute("aria-hidden", "true");
    source.style.setProperty("display", "none", "important");
    return true;
  }
  function renderFooter() {
    var footer = query("footer");
    var target = query('[data-mj="footer-content"]') || footer;
    if (!footer || !target) return false;
    observeTextRoot(footer);
    var contact = mount("narcos-contact-button", "a", target, null, renderContact);
    var license = mount("narcos-license-banner", "section", target, contact, renderLicense);
    var social = mount("narcos-social-panel", "section", target, license, renderSocial);
    mount("narcos-values-panel", "section", target, social, renderValues);
    markAgeBadge(footer);
    var telegramImage = query('a img[alt="Telegram"]', footer);
    var telegramLink = telegramImage && telegramImage.closest("a");
    if (telegramLink) telegramLink.href = TELEGRAM_URL;
    var oldCampaignLinks = document.getElementById("narcos-campaign-links");
    if (oldCampaignLinks) oldCampaignLinks.remove();
    renderFooterColumns();
    return true;
  }
  function renderTrustHub() {
    var route = runtime.route || classifyRoute(cleanPath());
    var existing = document.getElementById("narcos-game-hub");
    if (!route.home) {
      if (existing) existing.remove();
      return false;
    }
    var main = query('main[data-mj="page-content"]');
    if (!main) return false;
    var providers = query('[data-mj="widget-top-providers"]', main);
    var pages = query('[data-mj="widget-pages"]', main);
    if (providers && providers.parentElement !== main) providers = null;
    if (pages && pages.parentElement !== main) pages = null;
    var before = providers || (pages && pages.nextSibling);
    var widget = mount("narcos-game-hub", "section", main, before, function (node) {
      node.className = "ng-trust-hub";
      node.setAttribute("aria-labelledby", "narcos-trust-hub-title");
      var head = create("div", "ng-trust-head");
      head.appendChild(create("span", "ng-trust-eyebrow", "NARCOS PREMIUM"));
      var title = create("h2", "ng-trust-title", "GÜVENİN VE DENEYİMİN ADRESİ");
      title.id = "narcos-trust-hub-title";
      head.appendChild(title);
      head.appendChild(create("p", "ng-trust-lead", "Güçlü topluluk, köklü deneyim ve her an yanınızda destek."));
      node.appendChild(head);
      var grid = create("div", "ng-trust-grid");
      grid.setAttribute("aria-label", "NarcosBahis güven ve deneyim bilgileri");
      [
        { icon: "members", value: "120.000+", label: "AKTİF ÜYE" },
        { icon: "experience", value: "10 YILI AŞKIN", label: "DENEYİM" },
        { icon: "support", value: "7/24", label: "CANLI DESTEK" },
        { icon: "verified", value: "RESMİ", label: "DOĞRULANMIŞ LİSANS", href: VERIFY_URL }
      ].forEach(function (item) {
        var card = item.href ? externalLink(item.href, "ng-trust-card", "", item.value + " " + item.label + " doğrulamasını aç") : create("article", "ng-trust-card");
        var iconWrap = create("span", "ng-trust-icon-wrap");
        var icon = create("span", "ng-trust-icon ng-trust-icon-" + item.icon);
        icon.setAttribute("aria-hidden", "true");
        iconWrap.appendChild(icon);
        var copy = create("span", "ng-trust-copy");
        copy.appendChild(create("strong", "ng-trust-value", item.value));
        copy.appendChild(create("span", "ng-trust-label", item.label));
        card.appendChild(iconWrap);
        card.appendChild(copy);
        if (item.href) {
          var arrow = create("span", "ng-trust-arrow", "↗");
          arrow.setAttribute("aria-hidden", "true");
          card.appendChild(arrow);
        }
        grid.appendChild(card);
      });
      node.appendChild(grid);
      node.appendChild(create("p", "ng-trust-note", "18+ • Sorumlu oyun • Bütçe ve zaman limitlerinizi belirleyin."));
    });
    if (!providers && pages && widget.previousElementSibling !== pages) pages.insertAdjacentElement("afterend", widget);
    return true;
  }
  function jackpotCard(symbol, label, value, tone) {
    var card = create("article", "ng-jackpot-card ng-jackpot-card-" + tone);
    var suit = create("span", "ng-jackpot-suit", symbol);
    suit.setAttribute("aria-hidden", "true");
    card.appendChild(suit);
    card.appendChild(create("span", "ng-jackpot-label", label));
    card.appendChild(create("strong", "ng-jackpot-value", value));
    return card;
  }
  function renderJackpot() {
    var route = runtime.route || classifyRoute(cleanPath());
    var existing = document.getElementById("narcos-egt-jackpot");
    if (!route.casino) {
      if (existing) existing.remove();
      return false;
    }
    var main = query("main");
    if (!main) return false;
    var widget = mount("narcos-egt-jackpot", "section", main, main.firstChild, function (node) {
      node.setAttribute("aria-label", "EGT jackpot değerleri");
      var heading = create("div", "ng-jackpot-heading");
      heading.appendChild(create("span", "ng-jackpot-kicker", "PREMIUM JACKPOT"));
      heading.appendChild(create("strong", "ng-jackpot-title", "EGT JACKPOT"));
      var grid = create("div", "ng-jackpot-grid");
      grid.appendChild(jackpotCard("♠", "SPADE", "118,868", "dark"));
      grid.appendChild(jackpotCard("♥", "HEART", "53,868", "red"));
      grid.appendChild(jackpotCard("♦", "DIAMOND", "1,597.72", "red"));
      grid.appendChild(jackpotCard("♣", "CLUB", "314.69", "dark"));
      node.appendChild(heading);
      node.appendChild(grid);
    });
    if (main.firstElementChild !== widget) main.insertBefore(widget, main.firstChild);
    return true;
  }
  var CAMPAIGNS = {
    vip: {
      eyebrow: "NARCOSBAHİS VIP CLUB",
      title: "VIP BAŞVURU",
      lead: "Size özel ayrıcalıklar, hızlı destek ve premium promosyon deneyimi için VIP ekibimize katılın.",
      body: '<div class="ng-campaign-grid"><article><span class="ng-campaign-icon">◆</span><h2>Kişisel VIP deneyimi</h2><p>Öncelikli destek, özel kampanyalar ve hesabınıza uygun avantajlar tek bir premium kanalda.</p></article><article><span class="ng-campaign-icon">✦</span><h2>Hızlı değerlendirme</h2><p>Başvurunuz VIP ekibimiz tarafından incelenir; geri dönüş için iletişim kanalınızı kullanırız.</p></article></div><form class="ng-campaign-form" action="mailto:destek@narcosbahis.com" method="post" enctype="text/plain"><label>Ad soyad<input name="ad_soyad" autocomplete="name" required></label><label>Kullanıcı adı<input name="kullanici_adi" required></label><label>Telegram kullanıcı adı<input name="telegram" placeholder="@kullanici"></label><label>Mesajınız<textarea name="mesaj" rows="4" placeholder="VIP ekibine iletmek istediğiniz not"></textarea></label><button class="ng-campaign-button" type="submit">VIP BAŞVURUSU GÖNDER</button></form>'
    },
    call: {
      eyebrow: "7/24 NARCOSBAHİS DESTEK",
      title: "BENİ ARA",
      lead: "Hesabınızla ilgili hızlı destek için canlı ekibimize ulaşın. Size en uygun kanaldan yardımcı olalım.",
      body: '<div class="ng-campaign-grid"><article><span class="ng-campaign-icon">◉</span><h2>Canlı destek</h2><p>Mesajlaşarak anında destek alın ve sorularınızı güvenli biçimde iletin.</p><button class="ng-campaign-button" data-ng-action="chat-or-email" type="button">CANLI DESTEĞİ AÇ</button></article><article><span class="ng-campaign-icon">✉</span><h2>E-posta desteği</h2><p>Detaylı talepleriniz için destek@narcosbahis.com adresine yazabilirsiniz.</p><a class="ng-campaign-button ng-campaign-button-secondary" href="mailto:destek@narcosbahis.com">E-POSTA GÖNDER</a></article></div><div class="ng-campaign-note"><strong>Güvenli iletişim</strong><span>Şifrenizi ve tek kullanımlık doğrulama kodlarınızı hiçbir destek kanalında paylaşmayın.</span></div>'
    },
    millionaires: {
      eyebrow: "NARCOSBAHİS PREMIUM CLUB",
      title: "MİLYONERLER KULÜBÜ",
      lead: "Premium üyelik deneyimini; özel iletişim, seçkin kampanyalar ve güvenli hesap yönetimiyle keşfedin.",
      body: '<div class="ng-campaign-stats"><div><strong>7/24</strong><span>Öncelikli destek</span></div><div><strong>VIP</strong><span>Kişisel ilgi</span></div><div><strong>GOLD</strong><span>Özel fırsatlar</span></div></div><div class="ng-campaign-grid"><article><span class="ng-campaign-icon">♛</span><h2>Seçkin ayrıcalıklar</h2><p>Premium üyeler için düzenlenen kampanya ve iletişim fırsatlarını tek panelde takip edin.</p></article><article><span class="ng-campaign-icon">◈</span><h2>Şeffaf ve güvenli</h2><p>Hesap hareketlerinizi kontrol altında tutun; destek ekibimiz ihtiyaç duyduğunuzda yanınızda olsun.</p></article><article><span class="ng-campaign-icon">↗</span><h2>Size özel yönlendirme</h2><p>İhtiyacınıza uygun bilgi için VIP ekibimizle iletişime geçin.</p></article></div><a class="ng-campaign-button" data-ng-action="chat-or-email" href="#">PREMİUM DESTEĞE ULAŞ</a>'
    }
  };
  function campaignRoute(path) {
    var routePath = path.replace(/\.(html?|php)$/, "");
    if (routePath === "/tr/vip-basvuru") return "vip";
    if (routePath === "/tr/beni-ara") return "call";
    if (routePath === "/tr/milyonerler") return "millionaires";
    return "";
  }
  function restoreCampaignHost() {
    var main = runtime.campaignMain;
    if (main) {
      Array.prototype.forEach.call(main.children, function (child) {
        if (child.__ngCampaignWasHidden === undefined) return;
        child.hidden = child.__ngCampaignWasHidden;
        delete child.__ngCampaignWasHidden;
      });
      main.classList.remove("ng-campaign-main");
    }
    var page = document.getElementById("narcos-campaign-page");
    if (page) page.remove();
    if (runtime.generatedTitle && document.title === runtime.generatedTitle && runtime.campaignTitle) {
      document.title = runtime.campaignTitle;
    }
    runtime.campaignMain = null;
    runtime.campaignTitle = "";
    runtime.generatedTitle = "";
  }
  function renderCampaign() {
    var route = runtime.route || classifyRoute(cleanPath());
    var content = CAMPAIGNS[route.campaign];
    if (!content) {
      restoreCampaignHost();
      return false;
    }
    var main = query("main");
    if (!main) return false;
    if (runtime.campaignMain && runtime.campaignMain !== main) restoreCampaignHost();
    if (!runtime.campaignMain) runtime.campaignTitle = document.title;
    runtime.campaignMain = main;
    var page = document.getElementById("narcos-campaign-page") || create("section");
    page.id = "narcos-campaign-page";
    page.className = "ng-campaign-page";
    if (page.getAttribute("data-ng-rendered") !== route.campaign) {
      page.innerHTML = '<div class="ng-campaign-hero"><span class="ng-campaign-eyebrow">' +
        content.eyebrow + '</span><h1>' + content.title + '</h1><p>' + content.lead +
        '</p><span class="ng-campaign-line"></span></div>' + content.body;
      page.setAttribute("data-ng-rendered", route.campaign);
      page.setAttribute("data-ng-route", route.campaign);
    }
    if (page.parentElement !== main) main.appendChild(page);
    Array.prototype.forEach.call(main.children, function (child) {
      if (child === page) return;
      if (child.__ngCampaignWasHidden === undefined) child.__ngCampaignWasHidden = child.hidden;
      child.hidden = true;
    });
    main.classList.add("ng-campaign-main");
    runtime.generatedTitle = content.title + " | NarcosBahis";
    document.title = runtime.generatedTitle;
    return true;
  }
  function localizeProviderSheet() {
    var search = query('[data-mj="game-catalog-provider-bottom-sheet-search"]');
    if (!search) return false;
    search.placeholder = "Sağlayıcı ara";
    search.setAttribute("aria-label", "Sağlayıcı ara");
    search.setAttribute("data-ng-localized", "1");
    return true;
  }
  function markMobileSidebar() {
    var nav = query('[data-mj="mobile-nav-list"]');
    if (!nav) return false;
    nav.classList.add("ng-sidebar-nav");
    if (nav.parentElement) nav.parentElement.classList.add("ng-sidebar-scroll");
    var node = nav.parentElement;
    var drawer = null;
    var fixedRoot = null;
    var viewport = window.innerWidth || document.documentElement.clientWidth;
    while (node && node !== document.body) {
      var rect = node.getBoundingClientRect();
      var style = window.getComputedStyle(node);
      if (rect.width >= 280 && rect.width < viewport && rect.height > 500) drawer = node;
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
    var route = runtime.route || classifyRoute(cleanPath());
    if (!route.home) return false;
    var widgets = document.querySelectorAll(
      '[data-mj="widget-collection-slider"]:not([data-ng-league-inspected])'
    );
    Array.prototype.forEach.call(widgets, function (widget) {
      observeTextRoot(widget);
      var headings = widget.querySelectorAll("p");
      if (!headings.length) return;
      var hasHydratedHeading = false;
      for (var headingIndex = 0; headingIndex < headings.length; headingIndex += 1) {
        if (headings[headingIndex].textContent.trim()) {
          hasHydratedHeading = true;
          break;
        }
      }
      if (!hasHydratedHeading) return;
      for (var i = 0; i < headings.length; i += 1) {
        if (headings[i].textContent.trim().toLowerCase() === "ligler") {
          widget.setAttribute("data-ng-league-inspected", "1");
          widget.classList.add("ng-leagues-widget");
          break;
        }
      }
    });
    pruneTextRoots();
    return true;
  }
  function applyRouteClasses() {
    document.documentElement.classList.toggle("ng-home-route", runtime.route.home);
    document.documentElement.classList.toggle("ng-info-safe-route", runtime.route.infoSafe);
    document.documentElement.classList.toggle("ng-sports-route", runtime.route.sports);
  }
  var JOBS = {
    shell: renderShell, header: renderHeader, campaign: renderCampaign, trust: renderTrustHub,
    jackpot: renderJackpot, sidebar: markMobileSidebar,
    leagues: markLeagueWidget, footer: renderFooter
  };
  function flushJobs(bucket) {
    Object.keys(bucket).forEach(function (name) {
      delete bucket[name];
      if (JOBS[name]) JOBS[name]();
    });
  }
  function routeDeferredJobs(includeShellExtras) {
    var route = runtime.route || classifyRoute(cleanPath());
    var names = [];
    if (route.home || document.getElementById("narcos-game-hub")) names.push("trust");
    if (route.casino || document.getElementById("narcos-egt-jackpot")) names.push("jackpot");
    if (route.home) names.push("leagues");
    if (includeShellExtras) names.push("sidebar", "footer");
    return names;
  }
  function queueCritical(names) {
    if (!names.length) return;
    names.forEach(function (name) { runtime.criticalDirty[name] = true; });
    if (runtime.criticalFrame) return;
    var run = function () {
      runtime.criticalFrame = 0; flushJobs(runtime.criticalDirty);
      if (runtime.observer) runtime.observer.takeRecords();
    };
    runtime.criticalFrame = window.requestAnimationFrame ? window.requestAnimationFrame(run) : window.setTimeout(run, 24);
  }
  function queueDeferred(names, timeout) {
    if (!names.length) return;
    names.forEach(function (name) { runtime.deferredDirty[name] = true; });
    if (runtime.deferredHandle) return;
    var run = function () {
      runtime.deferredHandle = 0; runtime.deferredKind = "";
      flushJobs(runtime.deferredDirty);
      if (runtime.observer) runtime.observer.takeRecords();
    };
    if (window.requestIdleCallback) {
      runtime.deferredKind = "idle";
      runtime.deferredHandle = window.requestIdleCallback(run, { timeout: timeout || 900 });
    } else {
      runtime.deferredKind = "timeout";
      runtime.deferredHandle = window.setTimeout(run, 260);
    }
  }
  function handleRouteChange(force) {
    var path = cleanPath();
    if (!force && path === runtime.path) return;
    if (!runtime.gameActive && runtime.pendingGameReturnUrl &&
        path !== runtime.pendingGamePath && !isGameRoutePath(path)) {
      clearPendingGameReturn();
      renderGameReturn(false);
    }
    runtime.path = path; runtime.route = classifyRoute(path);
    applyRouteClasses();
    queueCritical(["shell", "campaign"]);
    queueDeferred(routeDeferredJobs(false), 700);
  }
  function isOwnNode(node) {
    if (!node || node.nodeType !== 1) return false;
    return (node.id && node.id.indexOf("narcos-") === 0) ||
      !!(node.closest && node.closest('[id^="narcos-"]'));
  }
  var STRUCTURAL_MUTATION_SELECTOR = [
    '[data-mj="header"]', '[data-mj="announcement"]', '[aria-label="site-header"]',
    '[data-mj="header-left"]', '[data-mj="header-right"]', '[data-mj="header-special-button"]',
    'main[data-mj="page-content"]', '[data-mj="page-content"]', "iframe", '[data-mj="bottom-nav"]',
    '[data-mj="game-catalog-provider-bottom-sheet-search"]', '[data-mj="mobile-nav-list"]',
    '[data-mj="widget-collection-slider"]', '[data-mj="widget-top-providers"]', '[data-mj="widget-pages"]',
    '[data-mj="footer-top"]', '[data-mj="footer-nav"]', '[data-mj="footer-content"]', "footer"
  ].join(",");
  var CATALOG_NOISE_SELECTOR = [
    '[data-mj="game-catalog-list"]', '[data-mj="game-catalog-card"]',
    '[data-mj="widget-game-card"]', '[data-mj="game-card"]',
    '[data-mj*="game-card"]', '[data-testid*="game-card"]', '[class*="game-card"]'
  ].join(",");
  function routeContentJobs(critical, deferred) {
    var route = runtime.route || classifyRoute(cleanPath());
    if (route.campaign) critical.campaign = true;
    if (route.home) deferred.trust = true;
    if (route.casino) deferred.jackpot = true;
  }
  function isCatalogNoiseMutation(target, node) {
    var element = node && node.nodeType === 1 ? node : target;
    if (!element || element.nodeType !== 1) return false;
    if (element.matches("iframe")) return false;
    if (element.matches(CATALOG_NOISE_SELECTOR)) {
      if (!element.isConnected && element.querySelector && element.querySelector("iframe")) return false;
      return true;
    }
    var catalogRoot = (element.closest && element.closest(CATALOG_NOISE_SELECTOR)) ||
      (target && target.closest && target.closest(CATALOG_NOISE_SELECTOR));
    if (!catalogRoot) return false;
    if (element.querySelector && element.querySelector("iframe")) return false;
    return true;
  }
  function classifyStructuralElement(element, critical, deferred) {
    if (element.matches(
      '[data-mj="header"],[data-mj="announcement"],main[data-mj="page-content"],' +
      '[data-mj="page-content"],iframe,[data-mj="bottom-nav"]'
    )) {
      critical.shell = true;
    }
    if (element.matches(
      '[aria-label="site-header"],[data-mj="header-left"],[data-mj="header-right"],' +
      '[data-mj="header-special-button"]'
    )) {
      critical.header = true;
    }
    if (element.matches(
      'main[data-mj="page-content"],[data-mj="page-content"],' +
      '[data-mj="widget-top-providers"],[data-mj="widget-pages"]'
    )) {
      routeContentJobs(critical, deferred);
    }
    if (element.matches('[data-mj="game-catalog-provider-bottom-sheet-search"]')) {
      localizeProviderSheet();
    }
    if (element.matches('[data-mj="mobile-nav-list"]')) deferred.sidebar = true;
    if (element.matches('[data-mj="widget-collection-slider"]') &&
        runtime.route && runtime.route.home) {
      deferred.leagues = true;
    }
    if (element.matches(
      '[data-mj="footer-top"],[data-mj="footer-nav"],[data-mj="footer-content"],footer'
    )) {
      deferred.footer = true;
    }
  }
  function inspectMutationTree(node, target, critical, deferred) {
    if (!node || node.nodeType !== 1 || isOwnNode(node) ||
        isCatalogNoiseMutation(target, node)) {
      return false;
    }
    if (node.matches(STRUCTURAL_MUTATION_SELECTOR)) {
      classifyStructuralElement(node, critical, deferred);
    }
    var descendants = node.querySelectorAll(STRUCTURAL_MUTATION_SELECTOR);
    Array.prototype.forEach.call(descendants, function (element) {
      classifyStructuralElement(element, critical, deferred);
    });
    return true;
  }
  function observeMutations(records) {
    var critical = Object.create(null), deferred = Object.create(null);
    records.forEach(function (record) {
      var target = record.target && record.target.nodeType === 1 ?
        record.target : record.target && record.target.parentElement;
      var hasElementChange = false, hasTextChange = record.type === "characterData";
      Array.prototype.forEach.call(record.addedNodes, function (node) {
        if (node && node.nodeType === 3) hasTextChange = true;
        if (inspectMutationTree(node, target, critical, deferred)) hasElementChange = true;
      });
      Array.prototype.forEach.call(record.removedNodes, function (node) {
        if (node && node.nodeType === 3) hasTextChange = true;
        if (inspectMutationTree(node, target, critical, deferred)) hasElementChange = true;
      });
      if (!target) return;
      if (hasTextChange) {
        if (target.closest(
          '[aria-label="site-header"],[data-mj="header"],[data-mj="header-left"],' +
          '[data-mj="header-right"]'
        )) {
          critical.header = true;
        }
        if (runtime.route && runtime.route.home &&
            target.closest('[data-mj="widget-collection-slider"]')) {
          deferred.leagues = true;
        }
        if (target.closest(
          '[data-mj="footer-top"],[data-mj="footer-nav"],[data-mj="footer-content"],footer'
        )) {
          deferred.footer = true;
        }
      }
      if (!hasElementChange) return;
      if (target.closest(
        '[aria-label="site-header"],[data-mj="header-left"],[data-mj="header-right"]'
      )) {
        critical.header = true;
      }
      if (target.closest('[data-mj="bottom-nav"]')) critical.shell = true;
      if (target.closest("main,[data-mj='page-content']")) routeContentJobs(critical, deferred);
      if (runtime.route && runtime.route.home &&
          target.closest('[data-mj="widget-collection-slider"]')) {
        deferred.leagues = true;
      }
      if (target.closest(
        '[data-mj="footer-top"],[data-mj="footer-nav"],[data-mj="footer-content"],footer'
      )) {
        deferred.footer = true;
      }
    });
    var criticalNames = Object.keys(critical), deferredNames = Object.keys(deferred);
    if (criticalNames.length) queueCritical(criticalNames);
    if (deferredNames.length) queueDeferred(deferredNames, 700);
  }
  function observeTextMutations(records) {
    var critical = Object.create(null), deferred = Object.create(null);
    records.forEach(function (record) {
      var target = record.target && record.target.parentElement;
      if (!target) return;
      if (target.closest(
        '[aria-label="site-header"],[data-mj="header-left"],[data-mj="header-right"]'
      )) {
        critical.header = true;
      }
      if (runtime.route && runtime.route.home &&
          target.closest('[data-mj="widget-collection-slider"]')) {
        deferred.leagues = true;
      }
      if (target.closest(
        '[data-mj="footer-top"],[data-mj="footer-nav"],[data-mj="footer-content"],footer'
      )) {
        deferred.footer = true;
      }
    });
    var criticalNames = Object.keys(critical), deferredNames = Object.keys(deferred);
    if (criticalNames.length) queueCritical(criticalNames);
    if (deferredNames.length) queueDeferred(deferredNames, 700);
  }
  function onDocumentClick(event) {
    var target = event.target;
    var gameCard = target && target.closest ? target.closest(
      '[data-mj="game-catalog-card"],[data-mj="widget-game-card"],[data-mj="game-card"],' +
      '[data-mj*="game-card"],[data-testid*="game-card"],[class*="game-card"]'
    ) : null;
    if (gameCard && !runtime.gameActive) {
      armGameReturn(gameCard);
    }
    var action = target && target.closest ? target.closest("[data-ng-action]") : null;
    if (action) {
      event.preventDefault();
      if (action.getAttribute("data-ng-action") === "game-return") {
        event.stopPropagation();
        var returnUrl = gameLobbyUrl();
        endGameSession();
        renderGameReturn(false);
        window.location.assign(returnUrl);
        return;
      }
      if (action.getAttribute("data-ng-action") === "call-request") {
        event.stopPropagation();
        window.location.assign(new URL(CALL_REQUEST_PATH, window.location.origin).href);
        return;
      }
      var chat = findChatButton();
      if (chat) chat.click();
      else window.location.href = "mailto:" + SUPPORT_EMAIL;
      return;
    }
    var link = target && target.closest ? target.closest("a[href]") : null;
    if (link && link.origin === window.location.origin) {
      if (!runtime.gameActive) rememberSafePage(window.location.href);
      window.setTimeout(handleRouteChange, 0);
    }
  }
  function patchHistory() {
    ["pushState", "replaceState"].forEach(function (name) {
      var original = window.history[name];
      if (typeof original !== "function") return;
      var wrapped = function () {
        if (!runtime.gameActive) rememberSafePage(window.location.href);
        var result = original.apply(this, arguments);
        handleRouteChange(false);
        return result;
      };
      try {
        window.history[name] = wrapped;
        runtime.history.push([name, original, wrapped]);
      } catch (error) {
        /* popstate and delegated same-origin clicks remain available. */
      }
    });
  }
  function scheduleEffectsReady() {
    var activate = function () {
      runtime.effectsHandle = 0; runtime.effectsKind = "";
      document.documentElement.classList.add("ng-effects-ready");
    };
    var schedule = function () {
      if (window.requestIdleCallback) {
        runtime.effectsKind = "idle";
        runtime.effectsHandle = window.requestIdleCallback(activate, { timeout: 1600 });
      } else {
        runtime.effectsKind = "timeout";
        runtime.effectsHandle = window.setTimeout(activate, 650);
      }
    };
    if (document.readyState === "complete") schedule();
    else listen(window, "load", schedule, { once: true });
  }
  function refresh() {
    runtime.path = cleanPath(); runtime.route = classifyRoute(runtime.path);
    if (!runtime.gameActive) rememberSafePage(window.location.href);
    applyRouteClasses();
    renderShell();
    renderHeader();
    localizeProviderSheet();
    renderCampaign();
    queueDeferred(routeDeferredJobs(true), 1100);
  }
  function destroy() {
    if (runtime.observer) runtime.observer.disconnect();
    if (runtime.frameObserver) runtime.frameObserver.disconnect();
    if (runtime.headerObserver) runtime.headerObserver.disconnect();
    if (runtime.textObserver) runtime.textObserver.disconnect();
    if (runtime.resizeObserver) runtime.resizeObserver.disconnect();
    runtime.listeners.forEach(function (entry) { entry[0].removeEventListener(entry[1], entry[2], entry[3]); });
    runtime.history.forEach(function (entry) {
      if (window.history[entry[0]] === entry[2]) window.history[entry[0]] = entry[1];
    });
    if (runtime.criticalFrame) {
      if (window.cancelAnimationFrame) window.cancelAnimationFrame(runtime.criticalFrame);
      else window.clearTimeout(runtime.criticalFrame);
    }
    if (runtime.deferredHandle && runtime.deferredKind === "idle" && window.cancelIdleCallback) window.cancelIdleCallback(runtime.deferredHandle);
    else if (runtime.deferredHandle) window.clearTimeout(runtime.deferredHandle);
    if (runtime.effectsHandle && runtime.effectsKind === "idle" && window.cancelIdleCallback) window.cancelIdleCallback(runtime.effectsHandle);
    else if (runtime.effectsHandle) window.clearTimeout(runtime.effectsHandle);
    if (runtime.pendingGameTimer) window.clearTimeout(runtime.pendingGameTimer);
    if (runtime.gameMissingTimer) window.clearTimeout(runtime.gameMissingTimer);
    restoreCampaignHost();
    markActiveGameFrame(null, null);
    document.documentElement.classList.remove("ng-game-embed", "ng-game-return-ready", "ng-theme-info-mounted");
    var gameReturn = document.getElementById("narcos-game-return");
    if (gameReturn) gameReturn.remove();
    Array.prototype.forEach.call(document.querySelectorAll(".ng-auth-profile-control"), function (node) {
      node.classList.remove("ng-auth-profile-control");
    });
    var infoStrip = document.getElementById("narcos-info-strip");
    if (infoStrip) infoStrip.remove();
    if (window[GLOBAL_KEY] === runtime) delete window[GLOBAL_KEY];
  }
  runtime.refresh = refresh;
  runtime.destroy = destroy;
  patchHistory();
  listen(window, "popstate", function () { handleRouteChange(false); });
  listen(window, "hashchange", function () { handleRouteChange(false); });
  listen(document, "click", onDocumentClick, true);
  runtime.frameObserver = new MutationObserver(function (records) {
    if (!records.length || window[GLOBAL_KEY] !== runtime) return;
    queueCritical(["shell"]);
  });
  runtime.headerObserver = new MutationObserver(function (records) {
    if (!records.length || window[GLOBAL_KEY] !== runtime) return;
    queueCritical(["header"]);
  });
  runtime.textObserver = new MutationObserver(observeTextMutations);
  if (window.ResizeObserver) {
    runtime.resizeObserver = new ResizeObserver(function () {
      if (window[GLOBAL_KEY] === runtime) queueCritical(["shell"]);
    });
  }
  refresh();
  scheduleEffectsReady();
  runtime.observer = new MutationObserver(observeMutations);
  runtime.observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();

/* ================= SPOR ROTA DUZELTMESI ================= */
/*!
 * narcos-spor-rota-duzeltme.js
 *
 * Yukarıdaki tema çalışma zamanının rota deseni yalnızca /tr/ önekini ve
 * İngilizce "sport" yazımını tanıyor:
 *
 *   /^\/tr\/(?:sport|sports|sportsbook)(?:\/|$)/
 *
 * Gerçek spor sayfası /tr/spor/demo (Türkçe yazım) olduğu için
 * ng-sports-route sınıfı hiç uygulanmıyor ve temanın spor kuralları
 * devre dışı kalıyor.
 *
 * Bu dosya vendor JS'i DEĞİŞTİRMEZ; sınıfı doğru desenle yeniden uygular.
 * footer.js rota değişiminde sınıfı geri alabildiği için attribute
 * gözlemcisiyle korunur.
 *
 * YÜKLEME SIRASI: tema çalışma zamanından SONRA — bu dosyada zaten öyle,
 * blok yukarıdaki IIFE'nin ardından geliyor.
 * CSS eşi MUTLAKA birlikte yüklenmeli (narcos-tema-birlesik.css'in içinde) —
 * tek başına bu blok spor alanını tamamen gizler (derinlik-3 zinciri).
 */
(function () {
  "use strict";

  var DESEN = /^\/[a-z]{2}\/(?:spor|sport|sports|sportsbook|canli-bahis|canlibahis)(?:\/|$)/;
  var SINIF = "ng-sports-route";
  var kok = document.documentElement;
  var uyguluyor = false;

  function sporMu() {
    var yol = (location.pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
    return DESEN.test(yol);
  }

  function uygula() {
    if (uyguluyor) return;              // gözlemci geri beslemesini engelle
    var olmali = sporMu();
    if (kok.classList.contains(SINIF) === olmali) return;
    uyguluyor = true;
    kok.classList.toggle(SINIF, olmali);
    // mikro-görevden sonra bırak ki kendi mutasyonumuzu yakalamayalım
    Promise.resolve().then(function () { uyguluyor = false; });
  }

  // 1) İlk çalıştırma
  uygula();

  // 2) SPA rota değişimleri (pushState/replaceState/popstate)
  ["pushState", "replaceState"].forEach(function (ad) {
    var orj = history[ad];
    if (typeof orj !== "function") return;
    history[ad] = function () {
      var r = orj.apply(this, arguments);
      setTimeout(uygula, 0);
      return r;
    };
  });
  window.addEventListener("popstate", function () { setTimeout(uygula, 0); });
  window.addEventListener("hashchange", function () { setTimeout(uygula, 0); });

  // 3) footer.js sınıfı geri alırsa yeniden uygula
  if (typeof MutationObserver === "function") {
    new MutationObserver(uygula).observe(kok, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }
})();

/* ================= PANEL GOMME (IFRAME) ================= */
/*
 * BURADAN KALDIRILDI — tek yetkili uygulama: narcos-panel-gomme.js
 *
 * Bu dosya panel gomme IIFE'sinin TAM bir kopyasini tasiyordu: ayni
 * KAP_ID ("narcos-panel-frame"), ayni hedefBul/goster akisi, ama ESKI bir
 * HARITA (/narcosturnuva yok) ve modal gomme / yukseklik hesabi olmadan.
 *
 * Iki script ayni DOM dugumu icin yarisiyordu; hangisi sonra kosarsa o
 * kazaniyordu. Gozlenen sonuclar:
 *   - header ikonlari iframe yerine siteye yonlendiriyordu
 *     (eski HARITA yolu tanimayinca hedefBul() null donuyor, goster()
 *      kabi soküyor ve CMS'in kendi gezinmesi devrede kaliyordu)
 *   - sayfa yenilendiginde panel iframe degil dogrudan site olarak aciliyordu
 *     (yenilemede kopya once kosup kabi temizliyordu)
 *
 * Gomme mantigi degistirilecekse narcos-panel-gomme.js duzenlenmeli;
 * buraya geri kopyalanmamali.
 */

/* ================= PANEL GOMME (IFRAME) ================= */
/*!
 * narcos-panel-gomme.js
 *
 * CMS kategori sayfalarında paneli iframe olarak gömer (yönlendirme YAPMAZ).
 * Lynon'da sayfa başına HTML alanı olmadığı için eşleştirme merkezîdir.
 *
 * ÖN KOŞUL: panelin CSP'sinde frame-ancestors bu alan adını içermeli,
 * aksi halde tarayıcı iframe'i boş gösterir.
 */
(function () {
  "use strict";

  // CMS'teki gameCatalog "identifier" değerleri. Aynı sayfanın menülere göre
  // farklı identifier'ı olabiliyor: header'da "narcoscark" (Patron Çark),
  // burger menüde "tacowheel" (Narcos Çark) — ikisi de gerçek sayfa (HTTP 200).
  // Biri eksik kalırsa o menüden gelen kullanıcı boş sayfa görüyor.
  var HARITA = {
    "/bonusrequest": "https://panel.narcosbahis.vip/#/bonus-talep",
    "/narcoscark":   "https://panel.narcosbahis.vip/#/cark",
    "/tacowheel":    "https://panel.narcosbahis.vip/#/cark",
    "/aranmatalep":  "https://panel.narcosbahis.vip/#/beni-ara",
    "/narcosskor":   "https://panel.narcosbahis.vip/#/skor-tahmin",
    // Turnuva CMS sayfasi yeni; panelde gunluk turnuva acilis ekrani.
    "/narcosturnuva": "https://panel.narcosbahis.vip/#/turnuva/gunluk"
  };
  var KAP_ID = "narcos-panel-frame";
  var PANEL_ORIGIN = "https://panel.narcosbahis.vip";

  /**
   * Giriş yapmış oyuncunun kullanıcı adı.
   *
   * Kaynak: sitenin kendi /api/v1/me ucu. Aynı origin'de çalıştığımız için
   * oturum çerezi otomatik gider; anonimken 401 döner ve null kalırız.
   * Panel iframe'i farklı origin'de olduğu için değeri postMessage ile iletiriz.
   */
  var kullaniciAdi = null;
  var sonDeneme = 0;
  var istekUcuyor = false;

  // /api/v1/me gövdesinin tam şekli belgelenmemiş ve sürümle değişebiliyor.
  // Sabit bir alan adına bel bağlamak yerine yanıtı gezip kullanıcı adı
  // anlamına gelen ilk makul alanı buluruz. E-posta/ID gibi alanları
  // kullanmayız; onlar Lynon'daki "login" ile eşleşmez.
  var AD_ALANLARI = /^(username|userName|user_name|login|userLogin|nickname|nickName|memberName|accountName)$/;

  function kullaniciAdiCoz(veri) {
    var bulunan = null;
    var derinlik = 0;

    (function gez(o) {
      if (bulunan || o == null || derinlik > 6) return;
      if (Array.isArray(o)) {
        derinlik++;
        for (var i = 0; i < o.length && !bulunan; i++) gez(o[i]);
        derinlik--;
        return;
      }
      if (typeof o !== "object") return;
      for (var k in o) {
        if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
        var v = o[k];
        if (AD_ALANLARI.test(k) && typeof v === "string" && v.trim()) {
          bulunan = v.trim();
          return;
        }
        if (v && typeof v === "object") {
          derinlik++;
          gez(v);
          derinlik--;
          if (bulunan) return;
        }
      }
    })(veri);

    return bulunan;
  }

  /**
   * Kullanıcı adını getirir. Başarılı sonuç kalıcı olarak saklanır; başarısızsa
   * (anonim -> 401) yeniden denenebilir, çünkü oyuncu sayfayı yenilemeden
   * giriş modalinden giriş yapabiliyor. Ardışık istekleri 5 sn'ye kısarız.
   */
  function kullaniciyiGetir() {
    if (kullaniciAdi) return Promise.resolve(kullaniciAdi);
    if (typeof fetch !== "function") return Promise.resolve(null);
    var simdi = new Date().getTime();
    if (istekUcuyor || simdi - sonDeneme < 5000) return Promise.resolve(null);
    sonDeneme = simdi;
    istekUcuyor = true;
    return fetch("/api/v1/me", {
      credentials: "same-origin",
      headers: { Accept: "application/json" }
    })
      .then(function (y) { return y.ok ? y.json() : null; })
      .then(function (veri) { kullaniciAdi = kullaniciAdiCoz(veri); return kullaniciAdi; })
      .catch(function () { return null; })
      .then(function (r) { istekUcuyor = false; return r; });
  }

  /* ---------- Zepcom canli destege kullanici adi iletme ----------
   *
   * Zepcom widget'i (zepcom.app/widget.js) window.ZepCom.identify({name, userId,
   * email}) API'sini aciyor — ZEPCOM TARAFINDA KOD GEREKMEZ. Boylece canli
   * destege dusen mesaj isimsiz gelmiyor, temsilci oyuncuyu kim oldugunu
   * sormadan goruyor.
   *
   * NEDEN BURADA: kimlik kaynagi zaten bu dosyada — kullaniciyiGetir()
   * /api/v1/me'yi ayni origin'de, oturum cerezi ile cagirip kullanici adini
   * cozuyor. Ayri bir sondaj acmiyoruz; ayni degeri paylasiyoruz.
   *
   * Sayisal ID yok, bu yuzden userId'ye de kullanici adini veriyoruz.
   * E-posta BILEREK gonderilmiyor.
   *
   * Bekleme dongusu iki bilinmeyeni birden kapsiyor: widget script'i geç
   * yuklenebilir, oyuncu da sayfayi yenilemeden giris modalinden giris
   * yapabilir. kullaniciyiGetir() kendi icinde 5 sn'ye kisik oldugu icin
   * yarim saniyelik tik guvenli. 120 tik = 60 sn sonra vazgeciyoruz.
   */
  var zepcomGonderildi = null;

  function zepcomTanit() {
    if (!kullaniciAdi || zepcomGonderildi === kullaniciAdi) return;
    if (!window.ZepCom || typeof window.ZepCom.identify !== "function") return;
    window.ZepCom.identify({ name: kullaniciAdi, userId: kullaniciAdi });
    zepcomGonderildi = kullaniciAdi;
  }

  function zepcomBaslat() {
    var tik = 0;
    (function bekle() {
      if (!kullaniciAdi) kullaniciyiGetir();
      zepcomTanit();
      if (zepcomGonderildi || tik++ > 120) return;
      setTimeout(bekle, 500);
    })();
  }

  /** Panele kimliği bildir. Panel hazır olmadan gelen mesajları kaçırmamak için
   *  panel kendi tarafından "narcos-panel-hazir" gönderdiğinde de tekrarlanır. */
  function kimligiYolla(ifr) {
    if (!ifr || !ifr.contentWindow || !kullaniciAdi) return;
    try {
      ifr.contentWindow.postMessage(
        { tur: "narcos-kullanici", kullaniciAdi: kullaniciAdi },
        PANEL_ORIGIN
      );
    } catch (e) { /* iframe henüz yüklenmemiş olabilir */ }
  }

  /**
   * Hesap panelindeki sekmeler: modali KAPATMIYORUZ, icine gomuyoruz.
   *
   * Onceki surum sorgu parametrelerini dusurup modali kapatiyordu. Iki sorunu
   * vardi: (1) oyuncu profilden cikmis oluyordu, (2) modal yolun kendisiyle
   * aciliyorsa (sorgu yokken) hic devreye girmiyordu — kullanicinin
   * /tr/bonusrequest ekran goruntusundeki durum buydu.
   *
   * TacoBahis custom.js'teki calisan yaklasim ornek alindi: modal acik kalir,
   * sitenin kendi icerigi CSS ile gizlenir, yerine panel iframe'i konur.
   */
  var MODAL_SEKMELERI = ["bonus_offers", "instant_cashback"];
  var MODAL_HEDEF = "https://panel.narcosbahis.vip/#/bonus-talep";
  var MODAL_KAP = "narcos-modal-frame";

  /**
   * Modal govdesini YAPISAL olarak bulur.
   *
   * Hash'li sinif adina (app-ltr-*) veya "Bonus Talep Et" metnine
   * baglanmiyoruz: sinif her derlemede, metin dil degisiminde degisir.
   *
   * Masaustu: modal >=2 cocuk (sol menu + sag panel); govde = sag panelin
   * son cocugu (ilki baslik seridi).
   * Mobil: modal TEK cocuk (kabuk); govde = kabugun son cocugu.
   */
  function modalGovdesiBul() {
    var modal = document.querySelector(".modal");
    if (!modal) return null;

    if (modal.children.length >= 2) {
      var sag = modal.children[modal.children.length - 1];
      if (sag && sag.children.length >= 2) return sag.children[sag.children.length - 1];
      return null;
    }
    if (modal.children.length === 1) {
      var kabuk = modal.children[0];
      if (kabuk && kabuk.children.length >= 2) return kabuk.children[kabuk.children.length - 1];
    }
    return null;
  }

  function modalSekmesi() {
    var t = (new URLSearchParams(location.search).get("t") || "").toLowerCase();
    return MODAL_SEKMELERI.indexOf(t) !== -1 ? t : null;
  }

  /**
   * Modal icine paneli gomer.
   *
   * TEMIZLIK SART: baska sekmeye gecilince React AYNI govde dugumunu yeniden
   * kullaniyor. Isaret kaldirilmazsa o sekmenin kendi icerigi de gizli kalir.
   */
  function modalGomme() {
    var mevcut = document.querySelector("[data-ng-modal-embed]");
    var sekme = modalSekmesi();

    if (!sekme) {
      if (mevcut) mevcut.remove();
      var eski = document.querySelector("[data-ng-modal-host]");
      if (eski) eski.removeAttribute("data-ng-modal-host");
      return;
    }

    var govde = modalGovdesiBul();
    if (!govde) return;

    if (!govde.hasAttribute("data-ng-modal-host")) {
      govde.setAttribute("data-ng-modal-host", "");
    }
    if (mevcut) {
      kimligiYolla(mevcut.querySelector("iframe"));
      return;
    }

    var kap = document.createElement("div");
    kap.className = "ng-modal-embed";
    kap.id = MODAL_KAP;
    kap.setAttribute("data-ng-modal-embed", sekme);

    var ifr = document.createElement("iframe");
    ifr.src = MODAL_HEDEF;
    ifr.title = "Narcos Panel";
    ifr.setAttribute("allow", "clipboard-write");
    // Footer script'inin oyun karesi tespitine yakalanmamak icin.
    ifr.setAttribute("data-ng-panel", "1");
    ifr.setAttribute("loading", "eager");

    kap.appendChild(ifr);
    govde.appendChild(kap);

    ifr.addEventListener("load", function () { kimligiYolla(ifr); });
    kullaniciyiGetir().then(function () { kimligiYolla(ifr); });
  }

  function hedefBul() {
    var yol = (location.pathname || "/").toLowerCase().replace(/\/+$/, "");
    var dilsiz = yol.replace(/^\/[a-z]{2}(?=\/)/, "");
    return HARITA[dilsiz] || HARITA[yol] || null;
  }

  /**
   * Panel sayfalarını CSS'e bildirir: html.ng-panel-route + html.ng-panel-<sayfa>.
   * Mevcut ng-*-route kuralına uyar. Gömme sayfasına özel düzen (ör. bonus
   * talepte bilgi şeridini gizlemek) böylece yalnızca CSS ile yapılabilir.
   */
  function rotaSinifi(hedef) {
    var kok = document.documentElement;
    var eski = (kok.className || "").split(/\s+/).filter(function (s) {
      return s && s.indexOf("ng-panel-") !== 0;
    });
    if (hedef) {
      var slug = (hedef.split("#/")[1] || "").replace(/[^a-z0-9-]/gi, "");
      eski.push("ng-panel-route");
      if (slug) eski.push("ng-panel-" + slug);
    }
    kok.className = eski.join(" ");
  }

  /**
   * Yalnızca dejenere durum koruması: header beklenmedik biçimde uzunsa
   * (100dvh - üst) sıfıra/negatife düşüp kabı yok edebilir.
   *
   * Bilerek düşük tutuldu. Yüksek bir taban (ör. 520) kısa masaüstü
   * pencerelerinde kabı ekrandan uzun yapıp dış kaydırmayı geri getiriyordu —
   * 800x450'de ölçüldü: taban 520 iken belge 520 > ekran 450, yani yine iki
   * kaydırma alanı. 320 ile gerçek cihazların tamamında tam oturuyor.
   */
  var TABAN_YUKSEKLIK = 320;

  /**
   * Kabı, başladığı noktadan ekran sonuna kadar uzatır — masaüstünde de mobilde de.
   *
   * Önceden masaüstü sabit `min(760px,82vh)` kullanıyordu, mobil ise ekranı
   * dolduruyordu; iki platform farklı davranıyordu. Sabit yükseklik sayfayı iki
   * kaydırma alanına bölüyor (dışta site, içte iframe) ve panelin alt kısmı dar
   * bir kutuda sıkışıyordu. Aynı hesap her genişlikte uygulanınca davranış tek
   * tipleşiyor: dış sayfada kaydıracak yer kalmıyor, tek kaydırma alanı iframe.
   *
   * Yükseklik kabın KENDİ üst konumundan ölçülür; header/gezinme yüksekliği
   * platforma veya giriş durumuna göre değişse de doğru kalır, seçici
   * hardcode edilmez.
   *
   * 100dvh kullanılır: mobil tarayıcının adres çubuğu gizlenip açılırken 100vh
   * fazla ölçüp sayfanın altını taşırıyordu. Masaüstünde dvh == vh.
   */
  /**
   * Ekranın altına sabitlenmiş çubuğun (mobil gezinme barı) yüksekliği.
   *
   * Bu çubuk `position: fixed` olduğu için sayfa akışında yer kaplamaz: kap
   * ekranın sonuna kadar uzatıldığında çubuk iframe'in ÜZERİNE biniyor ve
   * panelin alt kısmı — ör. bonus talep modalinin butonları — görünmez oluyordu.
   * "Mobilde kesik çıkıyor" şikayeti buydu.
   *
   * Yükseklik gibi bu da çalışma anında ölçülür: seçici hardcode etmiyoruz,
   * çünkü çubuk yalnızca mobilde ve yalnızca bazı sayfalarda render ediliyor.
   */
  // panelYuksekligi() goster() içinden, yani her DOM mutasyon karesinde
  // çağrılıyor. Tüm ağacı gezip getComputedStyle okumak orada pahalı olur;
  // sonucu kısa süre önbellekliyoruz. Ölçüyü geçersiz kılan olaylar (resize,
  // orientationchange) önbelleği sıfırlar.
  var altCubukOnbellek = { deger: 0, zaman: 0 };
  var ALT_CUBUK_TAZE_MS = 1000;

  function altCubukOnbelleginiSifirla() { altCubukOnbellek.zaman = 0; }

  function altCubukYuksekligi() {
    var simdi = new Date().getTime();
    if (simdi - altCubukOnbellek.zaman < ALT_CUBUK_TAZE_MS) return altCubukOnbellek.deger;

    var enFazla = 0;
    var ekranH = window.innerHeight;
    var dugumler = document.body ? document.body.querySelectorAll("*") : [];
    for (var i = 0; i < dugumler.length; i++) {
      var el = dugumler[i];
      if (el.id === KAP_ID || el.closest("#" + KAP_ID)) continue;
      var cs = window.getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      var r = el.getBoundingClientRect();
      // Ekranın dibine yapışık, yeterince geniş ve gerçek yüksekliği olan.
      if (r.height < 24 || r.height > ekranH * 0.4) continue;
      if (r.width < window.innerWidth * 0.6) continue;
      if (r.bottom < ekranH - 4 || r.top > ekranH) continue;
      if (r.height > enFazla) enFazla = r.height;
    }
    altCubukOnbellek.deger = Math.round(enFazla);
    altCubukOnbellek.zaman = simdi;
    return altCubukOnbellek.deger;
  }

  function panelYuksekligi(kap) {
    if (!kap) return;
    var ust = Math.max(0, Math.round(kap.getBoundingClientRect().top));
    var alt = altCubukYuksekligi();
    kap.style.minHeight = TABAN_YUKSEKLIK + "px";
    kap.style.height =
      "max(" + TABAN_YUKSEKLIK + "px, calc(100dvh - " + (ust + alt) + "px))";
  }

  /* ---------- Mobil kisayol seridi ----------
   *
   * Mobilde header tek satir: solda logo, sagda butonlar. Panel sayfalarina
   * (bonus, cark, skor, turnuva, aranma) gitmek icin burger menuyu acmak
   * gerekiyordu. Header'in altina ikinci bir satir ekliyoruz.
   *
   * Rotalar HARITA ile ayni kaynaktan beslenmiyor cunku burada SIRA ve
   * ETIKET de var; ama yollar birebir HARITA anahtarlariyla eslesiyor, yani
   * bir rota eklenirse iki yerde de gorunmeli.
   */
  var KISAYOL_ID = "narcos-mobil-kisayol";
  /**
   * Kisayollar.
   *
   * Her ogenin kendi rengi var: bes ikon ayni altin tonundayken hangisinin
   * ne oldugu ancak yazisi okunarak anlasiliyordu. Renk, ikonu taniyan
   * kullanicinin yaziyi okumadan secmesini sagliyor.
   *
   * Renkler CSS degiskeni olarak veriliyor (--ng-kisayol-renk); aktif/hover
   * durumlarini CSS yonetiyor.
   */
  var KISAYOLLAR = [
    { yol: "/aranmatalep",   etiket: "Aranma",  renk: "#5fd6a7",
      ikon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" },
    { yol: "/bonusrequest",  etiket: "Bonus",   renk: "#e7c574",
      ikon: "M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" },
    { yol: "/narcosskor",    etiket: "Skor",    renk: "#6ab7ff",
      ikon: "M12 13V2l8 4-8 4M20.55 10.23A9 9 0 1 1 8 4.94M8 10a5 5 0 1 0 8.9 2.02" },
    // Cark ikonu degistirildi: onceki cizim bir tekerlek degil, ortasi
    // delik bir daireye benziyordu. Bu sekil dilimli bir carki gosteriyor —
    // dis cember + merkezden cikan alti dilim cizgisi + gobek.
    { yol: "/narcoscark",    etiket: "Çark",    renk: "#f0883e",
      ikon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 2v10M12 12l8.66-5M12 12l8.66 5M12 12v10M12 12L3.34 17M12 12L3.34 7M12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" },
    { yol: "/narcosturnuva", etiket: "Turnuva", renk: "#d9a3ff",
      ikon: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z" }
  ];

  function kisayolSeridi() {
    if (document.getElementById(KISAYOL_ID)) return;

    /**
     * Serit HEADER'IN DOGRUDAN COCUGU olmali.
     *
     * Onceden custom-header'in yanina (kardes olarak) ekleniyordu. O dugumun
     * ebeveyni SABIT yukseklikte (60px) bir satir; serit oradan tasip
     * header'in kutusunun disina cikiyordu. Header 93px'te bitiyor, serit
     * 149'a uzaniyordu — sayfa icerigi 93'ten basladigi icin serit onu tam
     * 56px ortuyordu. Bildirilen "sayfalarin ustune geliyor" buydu.
     *
     * Header `flex-direction: column`; dogrudan cocuk olarak eklenince
     * dorduncu satir oluyor ve header yuksekligi (92 -> 150) onu KAPSIYOR.
     * Icerik de bu yeni yuksekligin altindan basliyor.
     */
    var header = document.querySelector('[data-mj="header"]')
              || document.querySelector('[data-mj="custom-header"]');
    if (!header) return;

    var yol = (location.pathname || "/").toLowerCase().replace(/\/+$/, "");
    var dilsiz = yol.replace(/^\/[a-z]{2}(?=\/)/, "");

    var nav = document.createElement("nav");
    nav.id = KISAYOL_ID;
    nav.setAttribute("data-ng-mobil-kisayol", "");
    nav.setAttribute("aria-label", "Hızlı erişim");

    var html = "";
    for (var i = 0; i < KISAYOLLAR.length; i++) {
      var k = KISAYOLLAR[i];
      var aktif = dilsiz === k.yol ? ' data-ng-aktif=""' : "";
      html +=
        '<a href="/tr' + k.yol + '"' + aktif + ' style="--ng-kisayol-renk:' + k.renk + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
          'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + k.ikon + '"/></svg>' +
          '<span>' + k.etiket + '</span>' +
        '</a>';
    }
    nav.innerHTML = html;
    header.appendChild(nav);
  }

  function icerikAlani() {
    return document.querySelector('main[data-mj="page-content"]') ||
           document.querySelector("main") ||
           document.getElementById("root");
  }

  /**
   * İçerik alanındaki iframe dışı tüm çocukları gizler.
   *
   * React'in yönettiği düğümleri SİLMEYİZ. innerHTML="" kullanılırsa React kendi
   * çocuklarını bulamayıp "removeChild: node is not a child" ile çöküyor.
   *
   * Bu fonksiyon idempotent ve TEKRAR ÇAĞRILABİLİR olmak zorunda: CMS oyun
   * kataloğu bileşenlerini asenkron render ediyor. Kategori listesi boş dönen
   * sayfalarda (/tr/narcosskor -> gameCategoriesSite = []) "No categories" boş
   * durumu iframe yerleştirildikten SONRA ekleniyordu; yalnızca ilk yerleştirmede
   * gizleseydik o düğüm görünür kalırdı. Hata tam olarak buydu.
   */
  function kardesleriGizle(yer) {
    if (!yer) return;
    for (var i = 0; i < yer.children.length; i++) {
      var c = yer.children[i];
      if (c.id === KAP_ID) continue;
      if (!c.hasAttribute("data-ng-gizli")) {
        c.setAttribute("data-ng-gizli", c.style.display || "");
      }
      // Sonradan tekrar görünür yapılmış olabilir; her turda yeniden uygula.
      if (c.style.display !== "none") c.style.display = "none";
    }
  }

  /**
   * Mobil alt navbar'da tek aktif oge birakir.
   *
   * CMS "Ana Sayfa"yi href="/" ile isaretliyor ve aktiflik testini onek
   * eslesmesiyle yapiyor; "/" her yolun oneki oldugu icin Ana Sayfa hicbir
   * zaman sonmuyor. Sonuc: /para-yatir'dayken hem Ana Sayfa hem Para Yatir
   * aktif gorunuyordu.
   *
   * Cozum: en UZUN eslesen href kazanir (en ozgul rota), digerlerinden aktif
   * isaretleri alinir. Hicbiri eslesmezse Ana Sayfa'ya dokunmayiz — kok
   * sayfada onun aktif kalmasi dogru davranis.
   */
  var AKTIF_ISARETLERI = ["active", "is-active"];

  function tekAktifNav() {
    var alt = document.querySelector('[data-mj="bottom-nav"]');
    if (!alt) return;
    var ogeler = alt.querySelectorAll('[data-mj="bottom-nav-item"]');
    if (ogeler.length < 2) return;

    // Kardes kodla ayni normalizasyon: kucuk harf + sondaki egik cizgi yok.
    // Dil oneki (/tr) SOYULMAZ; href'ler de onu tasidigi icin karsilastirma
    // tutarli kalir ve en-uzun-eslesme mantigi oneki kendiliginden asar.
    var yol = (location.pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
    var kazanan = null;
    var enUzun = -1;

    for (var i = 0; i < ogeler.length; i++) {
      var oge = ogeler[i];
      var baglanti = oge.tagName === "A" ? oge : oge.querySelector("a");
      var href = baglanti && baglanti.getAttribute("href");
      if (!href || href.charAt(0) !== "/") continue;
      var hedefYol = href.split("?")[0].split("#")[0].toLowerCase().replace(/\/+$/, "") || "/";
      var eslesir = hedefYol === "/" ? yol === "/" : (yol === hedefYol || yol.indexOf(hedefYol + "/") === 0);
      if (eslesir && hedefYol.length > enUzun) { enUzun = hedefYol.length; kazanan = oge; }
    }

    // Hicbir oge eslesmedi: CMS'in kararina karisma.
    if (!kazanan) return;

    for (var j = 0; j < ogeler.length; j++) {
      var o = ogeler[j];
      if (o === kazanan) continue;
      for (var k = 0; k < AKTIF_ISARETLERI.length; k++) o.classList.remove(AKTIF_ISARETLERI[k]);
      if (o.getAttribute("aria-current") === "page") o.removeAttribute("aria-current");
      if (o.getAttribute("aria-selected") === "true") o.setAttribute("aria-selected", "false");
      if (o.getAttribute("data-active") === "true") o.setAttribute("data-active", "false");
    }
  }

  function goster() {
    modalGomme();                       // hesap modali acikken icine gom
    kisayolSeridi();                    // mobil ikinci header satiri
    tekAktifNav();                      // alt navbar'da cift aktif durumu engelle
    var hedef = hedefBul();
    var mevcut = document.getElementById(KAP_ID);
    rotaSinifi(hedef);                  // CSS'in sayfayı tanıması için

    if (!hedef) {                       // eşleşmeyen sayfada kalıntı bırakma
      if (mevcut) {
        var ust = mevcut.parentElement;
        mevcut.remove();
        if (ust) {                      // gizlediğimiz içeriği geri aç
          var gizli = ust.querySelectorAll("[data-ng-gizli]");
          for (var j = 0; j < gizli.length; j++) {
            gizli[j].style.display = gizli[j].getAttribute("data-ng-gizli") || "";
            gizli[j].removeAttribute("data-ng-gizli");
          }
        }
      }
      return;
    }
    if (mevcut) {                       // zaten var; hedef değiştiyse güncelle
      var f = mevcut.querySelector("iframe");
      if (f && f.src !== hedef) f.src = hedef;
      // Kap yerindeyken CMS yeni düğüm eklemiş olabilir ("No categories").
      kardesleriGizle(mevcut.parentElement);
      panelYuksekligi(mevcut);
      return;
    }

    var yer = icerikAlani();
    if (!yer) return;                   // henüz render olmadı, gözlemci tekrar dener

    kardesleriGizle(yer);

    var kap = document.createElement("div");
    kap.id = KAP_ID;
    // Yükseklik panelYuksekligi() ile hemen altta ayarlanır; burada sabit bir
    // değer bırakmıyoruz ki ilk karede yanlış boyda görünüp zıplamasın.
    kap.style.cssText =
      "width:100%;overflow:hidden;" +
      "border-radius:16px;background:#09090b;margin:0 auto;";

    var ifr = document.createElement("iframe");
    ifr.src = hedef;
    ifr.setAttribute("loading", "lazy");
    ifr.setAttribute("title", "Narcos Panel");
    ifr.setAttribute("allow", "clipboard-write");
    // Footer script'inin oyun karesi tespitine yakalanmamak için işaret:
    // aksi halde ng-game-embed tam ekran moduna sokuluyordu.
    ifr.setAttribute("data-ng-panel", "1");
    ifr.style.cssText =
      "display:block;width:100%;height:100%;min-height:inherit;border:0;";
    kap.appendChild(ifr);

    yer.appendChild(kap);
    panelYuksekligi(kap);

    // Panel yüklendiğinde kimliği bildir; kullanıcı bilgisi geç gelirse de tekrar.
    ifr.addEventListener("load", function () { kimligiYolla(ifr); });
    kullaniciyiGetir().then(function () { kimligiYolla(ifr); });
  }

  // Ekran döndürme, adres çubuğunun gizlenmesi ve masaüstü/mobil sınırının
  // aşılması yüksekliği geçersiz kılar; yeniden ölç.
  window.addEventListener("resize", function () {
    altCubukOnbelleginiSifirla();
    panelYuksekligi(document.getElementById(KAP_ID));
  });
  window.addEventListener("orientationchange", function () {
    setTimeout(function () {
      altCubukOnbelleginiSifirla();
      panelYuksekligi(document.getElementById(KAP_ID));
    }, 150);
  });

  // Panel "hazırım" derse kimliği (yeniden) gönder. Böylece iframe'in yüklenme
  // anı ile /api/v1/me yanıtının sırası önemsizleşir.
  window.addEventListener("message", function (olay) {
    if (olay.origin !== PANEL_ORIGIN) return;          // yalnızca panelimiz
    if (!olay.data || olay.data.tur !== "narcos-panel-hazir") return;
    var kap = document.getElementById(KAP_ID);
    var ifr = kap && kap.querySelector("iframe");
    kullaniciyiGetir().then(function () { kimligiYolla(ifr); });
  });

  function planla() { setTimeout(goster, 0); }

  planla();

  // Canli destek kimligi panel sayfalarindan BAGIMSIZ: her rotada calisir.
  zepcomBaslat();

  ["pushState", "replaceState"].forEach(function (ad) {
    var orj = history[ad];
    if (typeof orj !== "function") return;
    history[ad] = function () { var r = orj.apply(this, arguments); planla(); return r; };
  });
  window.addEventListener("popstate", planla);

  // SPA içeriği geç render ederse kabı yeniden yerleştir. Kap zaten duruyorsa
  // da çalışmalı: CMS sonradan düğüm eklediğinde ("No categories") onları
  // gizleyen tek nokta burası. hedefBul() null iken de çağırırız; goster()
  // o durumda eşleşmeyen sayfadaki kalıntıyı temizler.
  if (typeof MutationObserver === "function" && document.body) {
    var bekliyor = false;
    var gozlemci = new MutationObserver(function () {
      if (bekliyor) return;
      // Kendi DOM değişikliğimiz gözlemciyi tekrar tetikliyor; sonsuz döngüyü
      // ve her mutasyonda tam tarama maliyetini önlemek için tek kareye topla.
      bekliyor = true;
      requestAnimationFrame(function () {
        bekliyor = false;
        goster();
      });
    });
    gozlemci.observe(document.body, { childList: true, subtree: true });
  }

  // Adres değişimini doğrudan izle.
  //
  // pushState sarmalaması tek başına YETMİYOR: bu script defer ile yükleniyor,
  // yani SPA paketi (zone.js) history metodlarını bizden önce yamalıyor ve
  // router kendi referansını tutabiliyor. Header ve mobil menü öğeleri <a>
  // linki de değil (yalnızca giriş/kayıt bağlantıları <a>), dolayısıyla tıklama
  // yakalanamıyordu — "aranma talep ikonu iframe açmıyor" sorunu buydu.
  //
  // 400 ms'lik yol karşılaştırması çerçeveden bağımsız çalışır ve maliyeti
  // ihmal edilebilir (tek string karşılaştırması).
  // Yol VE sorgu birlikte izlenir: modal açılışları yolu değiştirmeden yalnızca
  // sorguyu değiştiriyor (?m=account&t=bonus_offers), bu da yakalanmalı.
  var sonAdres = location.pathname + location.search;
  setInterval(function () {
    if (location.pathname + location.search !== sonAdres) {
      sonAdres = location.pathname + location.search;
      planla();
      return;
    }
    // Oyuncu sayfayı yenilemeden giriş modalinden giriş yapabiliyor. Kimliği
    // henüz alamadıysak eşleşen sayfada denemeye devam et (istek 5 sn'ye kısık).
    if (kullaniciAdi || !hedefBul()) return;
    var kap = document.getElementById(KAP_ID);
    var ifr = kap && kap.querySelector("iframe");
    if (ifr) kullaniciyiGetir().then(function () { kimligiYolla(ifr); });
  }, 400);
})();

/* ================= BAYI ATIF (btag) YUKLEYICISI ================= */
/*!
 * Affiliate panelinin attrib.js'ini yukler. BASKA HICBIR SEY YAPMAZ.
 *
 * ATIF MANTIGI BU DOSYADA DEGIL — kasitli:
 *   btag/_lp yakalama, 90 gunluk localStorage + cerez saklama, promosyon
 *   kodu alanini doldurma, kayit tespiti (fetch/XHR kancasi + form submit +
 *   JSON taramasi) ve panele talep gonderme; hepsi attrib.js'in icinde.
 *   attrib.js panelden servis ediliyor ve panel deploy'uyla aninda
 *   guncelleniyor. Ayni mantigin bir kopyasi burada dursaydi panelde
 *   guncellendiginde iki farkli davranis olusur ve atif SESSIZCE bozulurdu;
 *   ustelik iki kanca ust uste binip cift talep gonderirdi.
 *   Davranis degisecekse panel tarafinda degisir, burada degil.
 *
 * Tema IIFE'lerinin DISINDA: onlarin kendi 'use strict' baglami ve erken
 * return'leri var, yukleyici onlara bagli olmamali.
 */
(function () {
  // Panel adresi marka basina degisir.
  var PANEL_ADRESI = "https://narcos-affiliate-production.up.railway.app";

  try {
    var src = PANEL_ADRESI.replace(/\/+$/, "") + "/attrib.js";

    // Cift yukleme korumasi. Host'a degil DOSYA ADINA bakiyoruz: betik
    // Lynon header alanina elle de eklenmis olabilir ve o kopya baska bir
    // panel adresini gosteriyor olabilir. Iki kopya yuklenirse fetch/XHR
    // kancasi ust uste biner ve panele cift atif talebi gider.
    if (document.querySelector('script[src*="attrib.js"]')) return;

    var s = document.createElement("script");
    s.src = src;
    s.async = true;                 // temayi ve sayfayi bloklamasin
    (document.head || document.documentElement).appendChild(s);
  } catch (e) {
    // Canli kumar sitesi: yukleyicinin hatasi sayfayi bozmamali.
  }
})();
