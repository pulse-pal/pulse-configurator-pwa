/* ==========================================================
   PulsePal Configurator — router.js
   Hash router: #/home, #/install/1, #/installation?id=5 ...
   - Pages are .frag files (NOT .html: Live Server injects a reload
     <script> into every .html response, even fetch() ones)
   - innerHTML does not run <script> tags, so executePageScripts()
     recreates them after every navigation
   - Every fragment wraps its script in an IIFE (it re-runs on each visit)
   Needs these elements in index.html:
     #app  #view  #topbar  #backBtn  #pageTitle  .bottom-nav [data-nav]
   Needs a global Auth object (app.js) with isLoggedIn()
   ========================================================== */

const Router = (function () {
  /* ---------- ROUTE TABLE ----------
     file    : fragment to load
     title   : top bar title
     nav     : which bottom-nav tab is highlighted (null = none)
     noNav   : hide bottom nav (login only — every other page keeps it)
     bare    : hide the top bar (login, home — they draw their own header)
     noBadge : hide the staff badge in the top bar (Settings shows it in the profile card)
     back    : hash to go to when the back arrow is tapped (null = no arrow)
     public  : reachable without login */
  const ROUTES = {
    "/login":            { file: "pages/login.frag",            title: "Staff Login",        noNav: true, bare: true, back: null, public: true },
    "/home":             { file: "pages/home.frag",             title: "Home",               nav: "home", bare: true, back: null },

    "/install/1":        { file: "pages/install-step1.frag",    title: "Register Device",    nav: "home", back: "#/home" },
    "/install/2":        { file: "pages/install-step2.frag",    title: "Who Is It For?",     nav: "home", back: "#/install/1" },
    "/install/3":        { file: "pages/install-step3.frag",    title: "Client Details",     nav: "home", back: "#/install/2" },
    "/install/4":        { file: "pages/install-step4.frag",    title: "Install Device",     nav: "home", back: "#/install/3" },
    "/install/5":        { file: "pages/install-step5.frag",    title: "Test Connection",    nav: "home", back: "#/install/4" },
    "/install/complete": { file: "pages/install-complete.frag", title: "Installed",          nav: "home", back: null },

    "/installations":    { file: "pages/my-installations.frag", title: "My Installations",   nav: "installations", back: null },
    "/installation":     { file: "pages/installation-detail.frag", title: "Installation",    nav: "installations", back: "#/installations" },

    "/tools":            { file: "pages/tools.frag",            title: "Tools",              nav: "tools",         back: null },
    "/device-check":     { file: "pages/device-check.frag",     title: "Check a Device",     nav: "tools",         back: "#/tools" },
    "/troubleshoot":     { file: "pages/troubleshoot.frag",     title: "Fix a Problem",      nav: "tools",         back: "#/tools" },

    "/settings":         { file: "pages/settings.frag",         title: "Settings",           nav: "settings",      noBadge: true, back: null }
  };

  const DEFAULT_ROUTE = "/home";
  const LOGIN_ROUTE = "/login";

  let current = null;        // { path, params }
  let leaveHooks = [];       // cleanup functions of the page being left
  let navToken = 0;          // guards against fast double navigation

  /* ---------- Helpers ---------- */

  function el(id) {
    return document.getElementById(id);
  }

  // "#/installation?id=5" -> { path: "/installation", params: { id: "5" } }
  function parseHash(hash) {
    let raw = (hash || "").replace(/^#/, "");
    if (!raw) raw = DEFAULT_ROUTE;
    const parts = raw.split("?");
    const path = parts[0] || DEFAULT_ROUTE;
    const params = {};
    if (parts[1]) {
      new URLSearchParams(parts[1]).forEach(function (value, key) {
        params[key] = value;
      });
    }
    return { path: path, params: params };
  }

  function loggedIn() {
    return typeof Auth !== "undefined" && Auth.isLoggedIn();
  }

  /* innerHTML never runs <script>. Recreate each one so it executes. */
  function executePageScripts(container) {
    const scripts = container.querySelectorAll("script");
    scripts.forEach(function (oldScript) {
      const fresh = document.createElement("script");
      for (let i = 0; i < oldScript.attributes.length; i++) {
        const attr = oldScript.attributes[i];
        fresh.setAttribute(attr.name, attr.value);
      }
      fresh.text = oldScript.textContent;
      oldScript.parentNode.replaceChild(fresh, oldScript);
    });
  }

  function runLeaveHooks() {
    const hooks = leaveHooks;
    leaveHooks = [];
    hooks.forEach(function (fn) {
      try { fn(); } catch (e) { console.error("leave hook failed", e); }
    });
  }

  /* ---------- Chrome (top bar, back arrow, bottom nav) ---------- */

  function applyChrome(route) {
    const app = el("app");
    const topbar = el("topbar");
    const backBtn = el("backBtn");
    const title = el("pageTitle");

    if (title) title.textContent = route.title;
    document.title = route.title + " · PulsePal Configurator";

    if (topbar) topbar.hidden = !!route.bare;

    if (backBtn) {
      backBtn.hidden = !route.back;
    }

    if (app) {
      app.classList.toggle("no-nav", !!route.noNav);
      app.classList.toggle("no-badge", !!route.noBadge);
    }

    document.querySelectorAll("[data-nav]").forEach(function (item) {
      item.classList.toggle("active", item.getAttribute("data-nav") === route.nav);
    });
  }

  /* ---------- Rendering ---------- */

  function showError(view, path) {
    view.innerHTML =
      '<div class="card text-center">' +
      '<h2>Could not load this page</h2>' +
      '<p class="text-muted">Check your signal and try again.</p>' +
      '<button class="btn btn-primary" id="routerRetry">Retry</button>' +
      "</div>";
    const retry = document.getElementById("routerRetry");
    if (retry) {
      retry.addEventListener("click", function () {
        render();
      });
    }
  }

  async function render() {
    const token = ++navToken;
    const parsed = parseHash(location.hash);
    let path = parsed.path;

    // Unknown route -> home
    if (!ROUTES[path]) path = DEFAULT_ROUTE;
    const route = ROUTES[path];

    // Auth guard
    if (!route.public && !loggedIn()) {
      location.replace("#" + LOGIN_ROUTE);
      return;
    }
    // Already logged in and opening login -> home
    if (path === LOGIN_ROUTE && loggedIn()) {
      location.replace("#" + DEFAULT_ROUTE);
      return;
    }

    runLeaveHooks();
    current = { path: path, params: parsed.params };

    // Pages read their query params from here
    window.RouteParams = parsed.params;

    applyChrome(route);

    const view = el("view");
    if (!view) return;

    let html;
    try {
      const response = await fetch(route.file);
      if (!response.ok) throw new Error("HTTP " + response.status);
      html = await response.text();
    } catch (err) {
      if (token === navToken) showError(view, path);
      return;
    }

    // A newer navigation started while we were fetching — drop this one
    if (token !== navToken) return;

    view.innerHTML = html;
    view.classList.remove("page-enter");
    void view.offsetWidth; // restart the enter animation
    view.classList.add("page-enter");

    executePageScripts(view);
    window.scrollTo(0, 0);

    document.dispatchEvent(new CustomEvent("route:change", { detail: current }));
  }

  /* ---------- Public API ---------- */

  function go(hash) {
    if (!hash.startsWith("#")) hash = "#" + hash;
    if (location.hash === hash) {
      render();           // same hash: re-render instead of doing nothing
    } else {
      location.hash = hash;
    }
  }

  function replace(hash) {
    if (!hash.startsWith("#")) hash = "#" + hash;
    location.replace(hash);
  }

  // Pages call this to clean up timers/listeners when the user leaves
  function onLeave(fn) {
    leaveHooks.push(fn);
  }

  function currentRoute() {
    return current;
  }

  function start() {
    window.addEventListener("hashchange", render);

    const backBtn = el("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
        const route = current && ROUTES[current.path];
        if (route && route.back) go(route.back);
      });
    }

    render();
  }

  return {
    start: start,
    go: go,
    replace: replace,
    onLeave: onLeave,
    current: currentRoute,
    routes: ROUTES
  };
})();