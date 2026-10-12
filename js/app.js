/* ==========================================================
   PulsePal Configurator — app.js
   Shared helpers used by every page. Loaded AFTER dummy-data.js
   and router.js (it starts the router at the bottom).
   Globals: Auth, Store, Installs, Fmt, Validate, Icons, Toast, esc
   ========================================================== */

/* ---------- Escape text before putting it in innerHTML ---------- */
function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* ==========================================================
   ICONS — stroke-based SVG, 24x24 grid.
   Use in a fragment:  <i data-icon="check"></i>
   Icons.render() swaps every [data-icon] for its SVG.
   ========================================================== */
const Icons = (function () {
  const PATHS = {
    home:      '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    list:      '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
    tools:     '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    settings:  '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>',
    arrowRight:'<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
    check:     '<path d="M20 6L9 17l-5-5"/>',
    x:         '<path d="M18 6L6 18M6 6l12 12"/>',
    loader:    '<path d="M21 12a9 9 0 1 1-6.2-8.6"/>',
    plus:      '<path d="M12 5v14M5 12h14"/>',
    search:    '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    car:       '<path d="M5 17h14M3 13l2-6a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 6v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-4 0H9a2 2 0 0 1-4 0H4a1 1 0 0 1-1-1z"/><circle cx="7" cy="17" r="0.5"/><circle cx="17" cy="17" r="0.5"/>',
    truck:     '<path d="M1 6h13v11H1z"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    locate:    '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3"/>',
    plug:      '<path d="M9 2v6M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/>',
    key:       '<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2L21 2M16 7l3 3M14 9l2 2"/>',
    timer:     '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
    pin:       '<path d="M12 22s8-7 8-13a8 8 0 0 0-16 0c0 6 8 13 8 13z"/><circle cx="12" cy="9" r="3"/>',
    camera:    '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    message:   '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    alert:     '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    user:      '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    logout:    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/>',
    signal:    '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 20V4"/>',
    cpu:       '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4"/>',
    server:    '<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
    sun:       '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon:      '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'
  };

  function get(name) {
    const inner = PATHS[name];
    if (!inner) return "";
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' + inner + "</svg>";
  }

  function render(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (node) {
      if (node.dataset.rendered === "1") return;
      node.innerHTML = get(node.getAttribute("data-icon"));
      node.dataset.rendered = "1";
      node.style.display = "inline-flex";
    });
  }

  return { get: get, render: render };
})();

/* ==========================================================
   AUTH — dummy login. Only @pulsepal.com emails are staff.
   Any password works until the real backend exists.
   ========================================================== */
const Auth = (function () {
  const KEY = "pp_staff_id";

  function readId() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function current() {
    const id = readId();
    if (!id) return null;
    return STAFF_LIST.find(function (s) { return String(s.id) === String(id); }) || null;
  }

  function isLoggedIn() {
    return current() !== null;
  }

  function login(email, password) {
    const clean = String(email || "").trim().toLowerCase();

    if (!clean || !password) {
      return { ok: false, error: "Enter your email and password." };
    }
    if (!clean.endsWith(ALLOWED_EMAIL_DOMAIN)) {
      return { ok: false, error: "Staff access only" };
    }
    const staff = STAFF_LIST.find(function (s) { return s.email === clean; });
    if (!staff) {
      return { ok: false, error: "Staff account not found." };
    }
    try { localStorage.setItem(KEY, String(staff.id)); } catch (e) { /* ignore */ }
    return { ok: true, staff: staff };
  }

  function logout() {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    Store.reset();
  }

  // "Fred (Admin-001)" — always visible so a shared phone is obvious
  function updateBadge() {
    const badge = document.getElementById("staffBadge");
    if (!badge) return;
    const staff = current();
    badge.textContent = staff ? staff.first_name + " (" + staff.staff_code + ")" : "";
    badge.hidden = !staff;
  }

  return { current: current, isLoggedIn: isLoggedIn, login: login, logout: logout, updateBadge: updateBadge };
})();

/* ==========================================================
   STORE — install flow state, saved on every step in
   sessionStorage so the Back button never loses typed data.
   ========================================================== */
const Store = (function () {
  const KEY = "install_state";

  function fresh() {
    return {
      step: 1,
      device_code: NEXT_DEVICE_CODE,
      imei: "",
      sim_number: "",
      sim_iccid: "",
      hardware_type: "teltonika_fmb125",
      client_type: "",          // "individual" | "fleet"
      client_name: "",
      client_phone: "",
      fleet_id: "",             // existing fleet id, or "new"
      new_fleet_name: "",
      new_fleet_contact: "",
      new_fleet_phone: "",
      vehicle_plate: "",
      vehicle_type: "",
      assigned_driver_phone: "",
      test_results: [],
      notes: "",
      saved_record_id: null
    };
  }

  function get() {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) return Object.assign(fresh(), JSON.parse(raw));
    } catch (e) { /* fall through */ }
    return fresh();
  }

  function write(state) {
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    return state;
  }

  function set(patch) {
    return write(Object.assign(get(), patch));
  }

  function reset() {
    try { sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    return fresh();
  }

  return { get: get, set: set, reset: reset };
})();

/* ==========================================================
   FORMATTING
   ========================================================== */
const Fmt = (function () {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function date(iso) {
    const d = new Date(iso);
    return pad(d.getDate()) + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  }

  function time(iso) {
    const d = new Date(iso);
    let h = d.getHours();
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return pad(h) + ":" + pad(d.getMinutes()) + " " + suffix;
  }

  function dateTime(iso) {
    return date(iso) + " at " + time(iso);
  }

  // "Today at 10:30 AM" for today, full date otherwise
  function friendly(iso) {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return "Today at " + time(iso);
    return dateTime(iso);
  }

  function clientTypeLabel(type) {
    return type === "fleet" ? "Fleet Vehicle" : "Individual Driver";
  }

  function vehicleTypeLabel(value) {
    const found = VEHICLE_TYPES.find(function (v) { return v.value === value; });
    return found ? found.label : value;
  }

  function hardwareLabel(value) {
    const found = HARDWARE_TYPES.find(function (h) { return h.value === value; });
    return found ? found.label : value;
  }

  return {
    date: date, time: time, dateTime: dateTime, friendly: friendly,
    clientTypeLabel: clientTypeLabel, vehicleTypeLabel: vehicleTypeLabel, hardwareLabel: hardwareLabel
  };
})();

/* ==========================================================
   VALIDATION — each returns "" when OK, else the error message
   ========================================================== */
const Validate = {
  required: function (value, label) {
    return String(value || "").trim() ? "" : (label || "This field") + " is required";
  },
  // Kenyan mobile: 07xx xxx xxx, 01xx xxx xxx or +2547...
  phone: function (value) {
    const clean = String(value || "").replace(/[\s-]/g, "");
    if (!clean) return "Phone number is required";
    return /^(0|\+254)[17]\d{8}$/.test(clean) ? "" : "Enter a valid Kenyan number, e.g. 0712345678";
  },
  imei: function (value) {
    const clean = String(value || "").replace(/\s/g, "");
    if (!clean) return "IMEI is required";
    return /^\d{15}$/.test(clean) ? "" : "IMEI must be 15 digits";
  },
  plate: function (value) {
    const clean = String(value || "").trim();
    if (!clean) return "Vehicle plate is required";
    return /^[A-Za-z0-9 ]{5,10}$/.test(clean) ? "" : "Enter a valid plate, e.g. KBZ 123A";
  }
};

/* ==========================================================
   INSTALLS — helpers over INSTALLATIONS (in memory for now)
   ========================================================== */
const Installs = (function () {
  function all() {
    return INSTALLATIONS.slice().sort(function (a, b) {
      return new Date(b.installed_at) - new Date(a.installed_at);
    });
  }

  function byStaff(staff) {
    return all().filter(function (i) { return i.installed_by_code === staff.staff_code; });
  }

  function byId(id) {
    return INSTALLATIONS.find(function (i) { return String(i.id) === String(id); }) || null;
  }

  function byCode(code) {
    const clean = String(code || "").trim().toUpperCase();
    return INSTALLATIONS.find(function (i) { return i.device_code === clean; }) || null;
  }

  function add(record) {
    INSTALLATIONS.push(record);
    return record;
  }

  function nextId() {
    return INSTALLATIONS.reduce(function (max, i) { return Math.max(max, i.id); }, 0) + 1;
  }

  // PULSE-0006 -> PULSE-0007 (the backend assigns this for real later)
  function bumpDeviceCode() {
    const n = parseInt(NEXT_DEVICE_CODE.slice(6), 10) + 1;
    NEXT_DEVICE_CODE = "PULSE-" + String(n).padStart(4, "0");
  }

  function startOfToday() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function stats(staff) {
    const mine = byStaff(staff);
    const today = startOfToday();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    return {
      today: mine.filter(function (i) { return new Date(i.installed_at) >= today; }).length,
      week: mine.filter(function (i) { return new Date(i.installed_at) >= weekAgo; }).length,
      total: staff.installs_before_today + mine.length
    };
  }

  function inRange(record, range) {
    if (range === "all") return true;
    const today = startOfToday();
    if (range === "today") return new Date(record.installed_at) >= today;
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    return new Date(record.installed_at) >= weekAgo;
  }

  return {
    all: all, byStaff: byStaff, byId: byId, byCode: byCode, add: add, nextId: nextId,
    bumpDeviceCode: bumpDeviceCode, stats: stats, inRange: inRange
  };
})();

/* ==========================================================
   TOAST — top of screen, icon circle (not a border stripe)
   Toast.show("Saved", "success")   types: info | success | error
   ========================================================== */
const Toast = (function () {
  const ICON = { info: "alert", success: "check", error: "x" };

  function host() {
    let node = document.getElementById("toastHost");
    if (!node) {
      node = document.createElement("div");
      node.id = "toastHost";
      node.className = "toast-host";
      node.setAttribute("aria-live", "polite");
      document.body.appendChild(node);
    }
    return node;
  }

  function show(message, type, ms) {
    type = type || "info";
    const toast = document.createElement("div");
    toast.className = "toast toast--" + type;
    toast.innerHTML =
      '<span class="toast__icon">' + Icons.get(ICON[type] || "alert") + "</span>" +
      "<span>" + esc(message) + "</span>";
    host().appendChild(toast);

    setTimeout(function () {
      toast.classList.add("leaving");
      setTimeout(function () { toast.remove(); }, 260);
    }, ms || 3200);
  }

  return { show: show };
})();

/* ==========================================================
   OFFLINE BANNER — parking lots have poor signal
   ========================================================== */
(function setupOfflineBanner() {
  function banner() {
    let node = document.getElementById("offlineBanner");
    if (!node) {
      node = document.createElement("div");
      node.id = "offlineBanner";
      node.className = "offline-banner";
      node.textContent = "You're offline — saved pages still work";
      const topbar = document.getElementById("topbar");
      if (topbar && topbar.parentNode) topbar.parentNode.insertBefore(node, topbar.nextSibling);
    }
    return node;
  }

  function update() {
    banner().hidden = navigator.onLine;
  }

  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  document.addEventListener("DOMContentLoaded", update);
})();

/* ==========================================================
   BOOT
   ========================================================== */
document.addEventListener("route:change", function () {
  Auth.updateBadge();
  Icons.render(document);
});

// Service worker (sw.js uses Promise.allSettled so one bad path can't kill the cache)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("sw.js").catch(function (err) {
      console.warn("Service worker not registered:", err);
    });
  });
}

Icons.render(document);   // bottom nav icons
Auth.updateBadge();
Router.start();