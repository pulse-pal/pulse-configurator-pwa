/* ==========================================================
   PulsePal Configurator — theme.js
   Manual Auto / Light / Dark switch.
   - "auto"  -> no data-theme attribute, CSS follows the phone
   - "light" -> data-theme="light"
   - "dark"  -> data-theme="dark"
   Choice is saved in localStorage (wrapped in try/catch because
   storage can be blocked or empty).
   ========================================================== */

const Theme = (function () {
  const STORAGE_KEY = "pp_theme";
  const MODES = ["auto", "light", "dark"];

  // Colors for the browser/status bar (match --bg in main.css)
  const BAR_COLORS = { light: "#FFFFFF", dark: "#14161B" };

  function read() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return MODES.includes(saved) ? saved : "auto";
    } catch (e) {
      return "auto";
    }
  }

  function write(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      /* storage blocked — theme still applies for this session */
    }
  }

  function phoneIsDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // Which theme is actually showing right now
  function effective(mode) {
    if (mode === "light" || mode === "dark") return mode;
    return phoneIsDark() ? "dark" : "light";
  }

  function updateBarColor(mode) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = BAR_COLORS[effective(mode)];
  }

  function apply(mode) {
    const root = document.documentElement;
    if (mode === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", mode);
    }
    updateBarColor(mode);
  }

  /* ---------- Public API ---------- */

  function get() {
    return read();
  }

  function set(mode) {
    if (!MODES.includes(mode)) mode = "auto";
    write(mode);
    apply(mode);
  }

  function init() {
    apply(read());

    // If set to Auto and the phone switches theme, keep the bar color in sync
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = function () {
        if (read() === "auto") updateBarColor("auto");
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  return { get: get, set: set, init: init };
})();

// Apply immediately (script is loaded in <head>, before the body paints)
Theme.init();