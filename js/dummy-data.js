/* ==========================================================
   PulsePal Configurator — dummy-data.js
   Fake data until the backend exists. Loaded once from index.html.
   Plain globals (no modules) so every page script can read them.
   ========================================================== */

/* ---------- Date helper: dates relative to "now" so
   the Today / This Week filters always have data ---------- */
function daysAgo(days, hour, minute) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/* ---------- STAFF ----------
   Dummy login: any password works for now (real auth comes later).
   Only @pulsepal.com emails are allowed. */
const STAFF_LIST = [
  {
    id: 1,
    name: "Fred Mwangi",
    first_name: "Fred",
    email: "fred@pulsepal.com",
    role: "admin",
    staff_code: "Admin-001",
    installs_before_today: 46   // UNUSED after the counts fix: totals now come from installation dates
  },
  {
    id: 2,
    name: "Adow",
    first_name: "Adow",
    email: "adow@pulsepal.com",
    role: "admin",
    staff_code: "Admin-002",
    installs_before_today: 31   // UNUSED after the counts fix
  }
];

const ALLOWED_EMAIL_DOMAIN = "@pulsepal.com";

/* ---------- NEXT DEVICE CODE (backend will assign this later) ---------- */
let NEXT_DEVICE_CODE = "PULSE-0006";

/* ---------- DROPDOWN OPTIONS ---------- */
const HARDWARE_TYPES = [
  { value: "teltonika_fmb125", label: "Teltonika FMB125" },
  { value: "pulse_v1", label: "Pulse V1" },
  { value: "pulse_v2", label: "Pulse V2" }
];

const VEHICLE_TYPES = [
  { value: "car", label: "Car" },
  { value: "suv", label: "SUV" },
  { value: "pickup", label: "Pickup" },
  { value: "van", label: "Van" },
  { value: "matatu", label: "Matatu" },
  { value: "bus", label: "Bus" },
  { value: "lorry", label: "Lorry" },
  { value: "truck", label: "Truck" },
  { value: "other", label: "Other" }
];

/* ---------- SPEEDOMETER MAX ----------
   The gauge in the Driver PWA scales to the LAST NUMBER PRINTED on the
   car's dash, not the car's real top speed. The installer confirms it. */

/* Used when there is no suggestion (no signal, no match, lookup failed,
   or a digital dash). Any type not listed here (e.g. "other") gets 180. */
const TYPE_DEFAULTS = {
  car: 180,
  suv: 180,
  pickup: 180,
  van: 180,
  matatu: 120,
  bus: 120,
  lorry: 120,
  truck: 120
};

const SPEEDO_FALLBACK_DEFAULT = 180;

function typeDefaultSpeedo(vehicleType) {
  return TYPE_DEFAULTS[vehicleType] || SPEEDO_FALLBACK_DEFAULT;
}

/* Where a speedometer_max value came from. Matches the database column
   vehicles.speedometer_max_source: 'installer' | 'ai_lookup' | 'default'. */
const SPEEDO_SOURCE_LABELS = {
  ai_lookup: "Looked up from make and model",
  installer: "Set by installer",
  default: "Type default"
};

/* Stand-in for the backend's vehicle_models cache.
   One row per model; the lookup picks the row whose year is closest.
   NOTE: these numbers are PLACEHOLDERS for testing, not checked against
   real dashes. The real lookup endpoint replaces this table. */
const VEHICLE_MODELS = [
  { make: "Toyota",     model: "Axio",       year: 2012, speedometer_max: 180 },
  { make: "Toyota",     model: "Premio",     year: 2012, speedometer_max: 180 },
  { make: "Toyota",     model: "Fielder",    year: 2013, speedometer_max: 180 },
  { make: "Toyota",     model: "Land Cruiser", year: 2012, speedometer_max: 220 },
  { make: "Toyota",     model: "Hilux",      year: 2014, speedometer_max: 180 },
  { make: "Toyota",     model: "Probox",     year: 2012, speedometer_max: 180 },
  { make: "Nissan",     model: "Note",       year: 2014, speedometer_max: 180 },
  { make: "Nissan",     model: "X-Trail",    year: 2014, speedometer_max: 200 },
  { make: "Subaru",     model: "Forester",   year: 2012, speedometer_max: 180 },
  { make: "Subaru",     model: "Impreza",    year: 2012, speedometer_max: 180 },
  { make: "Isuzu",      model: "NQR",        year: 2014, speedometer_max: 120 },
  { make: "Isuzu",      model: "FRR",        year: 2014, speedometer_max: 120 },
  { make: "Mitsubishi", model: "Canter",     year: 2014, speedometer_max: 120 },
  { make: "Mercedes",   model: "Actros",     year: 2014, speedometer_max: 140 }
];

/* Delay that imitates a network call, so the form's "looking up" state
   can be seen and tested. Remove with the real endpoint. */
const SPEEDO_LOOKUP_DELAY_MS = 500;

function speedoKey(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

/* THE ONE FUNCTION THE FORM CALLS. It never rejects.
   Resolves to one of:
     { ok: true,  speedometer_max: 180, source: "ai_lookup" }
     { ok: false, reason: "no_match" | "offline" | "error" }
   When the real endpoint exists, replace the body of this function only.
   Keep the arguments and the result shape and the form needs no change. */
async function lookupSpeedoMax(make, model, year) {
  await new Promise(function (resolve) {
    setTimeout(resolve, SPEEDO_LOOKUP_DELAY_MS);
  });

  try {
    // Stand-in for "no signal". A real fetch() failing lands in the catch below.
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      return { ok: false, reason: "offline" };
    }

    const makeKey = speedoKey(make);
    const modelKey = speedoKey(model);
    if (!makeKey || !modelKey) return { ok: false, reason: "no_match" };

    const rows = VEHICLE_MODELS.filter(function (row) {
      return speedoKey(row.make) === makeKey && speedoKey(row.model) === modelKey;
    });
    if (!rows.length) return { ok: false, reason: "no_match" };

    const wanted = Number(year);
    let best = rows[0];
    if (wanted) {
      rows.forEach(function (row) {
        if (Math.abs(row.year - wanted) < Math.abs(best.year - wanted)) best = row;
      });
    }

    return { ok: true, speedometer_max: best.speedometer_max, source: "ai_lookup" };
  } catch (err) {
    return { ok: false, reason: "error" };
  }
}

/* ---------- SPEC CORRECTIONS (dummy log) ----------
   Step 3 appends an entry here when an installer changes the suggested
   speedometer max. A correction applies to THAT vehicle only. It never
   edits VEHICLE_MODELS. The backend will review this log later. */
const SPEC_CORRECTIONS = [
  {
    vehicle_plate: "KCB 555E",
    old_value: 180,
    old_source: "ai_lookup",
    new_value: 200,
    staff_code: "Admin-001",
    at: daysAgo(2, 15, 5)
  }
];

/* ---------- FLEET ACCOUNTS ---------- */
const FLEET_ACCOUNTS = [
  {
    id: 1,
    name: "ABC Trucking Ltd",
    contact: "James Kamau",
    phone: "0722345678",
    vehicles: 3
  },
  {
    id: 2,
    name: "XYZ Matatus",
    contact: "Sarah Otieno",
    phone: "0733456789",
    vehicles: 5
  }
];

/* ---------- INSTALLATIONS ----------
   test_results: result of the 4 checks at install time, read per record.
   status: "complete" or "issue".
   speedometer_max_source: "ai_lookup" | "installer" | "default". */
const INSTALLATIONS = [
  {
    id: 5,
    device_code: "PULSE-0005",
    imei: "352093081452803",
    sim_number: "0745678901",
    sim_iccid: "",
    hardware_type: "teltonika_fmb125",
    client_name: "Grace Wanjiru",
    client_phone: "0745678901",
    client_type: "individual",
    vehicle_plate: "KDD 789C",
    vehicle_make: "Mazda",
    vehicle_model: "Demio",
    vehicle_year: 2016,
    vehicle_type: "car",
    speedometer_max: 180,
    speedometer_max_source: "default",
    fleet_name: null,
    status: "issue",
    issue: "OBD not reading — vehicle needs engine running",
    installed_by: "Adow",
    installed_by_code: "Admin-002",
    installed_at: daysAgo(0, 8, 40),
    location: "Kilimani, Nairobi",
    notes: "Retry once engine is fully running.",
    photo: null,
    test_results: [
      { key: "4g", label: "4G Network", pass: true, detail: "Safaricom • Signal: Good" },
      { key: "gps", label: "GPS Signal", pass: true, detail: "Kilimani, Nairobi" },
      { key: "obd", label: "OBD Connection", pass: false, detail: "No data from vehicle ECU" },
      { key: "server", label: "Server Connection", pass: true, detail: "Latency: 61ms" }
    ]
  },
  {
    id: 4,
    device_code: "PULSE-0004",
    imei: "352093081452802",
    sim_number: "0756789012",
    sim_iccid: "",
    hardware_type: "teltonika_fmb125",
    client_name: "XYZ Matatus",
    client_phone: "0733456789",
    client_type: "fleet",
    vehicle_plate: "KCX 321D",
    vehicle_make: "Toyota",
    vehicle_model: "HiAce",
    vehicle_year: 2017,
    vehicle_type: "matatu",
    speedometer_max: 120,
    speedometer_max_source: "default",
    fleet_name: "XYZ Matatus",
    status: "complete",
    installed_by: "Fred Mwangi",
    installed_by_code: "Admin-001",
    installed_at: daysAgo(0, 10, 30),
    location: "Githurai, Nairobi",
    notes: "",
    photo: null,
    test_results: [
      { key: "4g", label: "4G Network", pass: true, detail: "Safaricom • Signal: Strong" },
      { key: "gps", label: "GPS Signal", pass: true, detail: "Githurai, Nairobi" },
      { key: "obd", label: "OBD Connection", pass: true, detail: "Speed: 0 • RPM: 790 • Temp: 68°C" },
      { key: "server", label: "Server Connection", pass: true, detail: "Latency: 52ms" }
    ]
  },
  {
    id: 3,
    device_code: "PULSE-0003",
    imei: "352093081452801",
    sim_number: "0767890123",
    sim_iccid: "",
    hardware_type: "teltonika_fmb125",
    client_name: "Peter Odhiambo",
    client_phone: "0767890123",
    client_type: "individual",
    vehicle_plate: "KCB 555E",
    vehicle_make: "Subaru",
    vehicle_model: "Forester",
    vehicle_year: 2015,
    vehicle_type: "suv",
    speedometer_max: 200,        // installer changed 180 -> 200 (see SPEC_CORRECTIONS)
    speedometer_max_source: "installer",
    fleet_name: null,
    status: "complete",
    installed_by: "Fred Mwangi",
    installed_by_code: "Admin-001",
    installed_at: daysAgo(2, 15, 10),
    location: "Thika Town",
    notes: "Client asked about SMS alerts.",
    photo: null,
    test_results: [
      { key: "4g", label: "4G Network", pass: true, detail: "Safaricom • Signal: Strong" },
      { key: "gps", label: "GPS Signal", pass: true, detail: "Thika Town" },
      { key: "obd", label: "OBD Connection", pass: true, detail: "Speed: 0 • RPM: 820 • Temp: 74°C" },
      { key: "server", label: "Server Connection", pass: true, detail: "Latency: 48ms" }
    ]
  },
  {
    id: 2,
    device_code: "PULSE-0002",
    imei: "352093081452800",
    sim_number: "0712345679",
    sim_iccid: "",
    hardware_type: "teltonika_fmb125",
    client_name: "ABC Trucking Ltd",
    client_phone: "0722345678",
    client_type: "fleet",
    vehicle_plate: "KCA 456B",
    vehicle_make: "Isuzu",
    vehicle_model: "NQR",
    vehicle_year: 2019,
    vehicle_type: "lorry",
    speedometer_max: 120,
    speedometer_max_source: "ai_lookup",
    fleet_name: "ABC Trucking Ltd",
    status: "complete",
    installed_by: "Adow",
    installed_by_code: "Admin-002",
    installed_at: daysAgo(5, 9, 15),
    location: "Industrial Area, Nairobi",
    notes: "",
    photo: null,
    test_results: [
      { key: "4g", label: "4G Network", pass: true, detail: "Safaricom • Signal: Strong" },
      { key: "gps", label: "GPS Signal", pass: true, detail: "Industrial Area, Nairobi" },
      { key: "obd", label: "OBD Connection", pass: true, detail: "Speed: 0 • RPM: 700 • Temp: 80°C" },
      { key: "server", label: "Server Connection", pass: true, detail: "Latency: 45ms" }
    ]
  },
  {
    id: 1,
    device_code: "PULSE-0001",
    imei: "352093081452799",
    sim_number: "0712345678",
    sim_iccid: "",
    hardware_type: "teltonika_fmb125",
    client_name: "John Mwangi",
    client_phone: "0712345678",
    client_type: "individual",
    vehicle_plate: "KBZ 123A",
    vehicle_make: "Toyota",
    vehicle_model: "Axio",
    vehicle_year: 2018,
    vehicle_type: "car",
    speedometer_max: 180,
    speedometer_max_source: "ai_lookup",
    fleet_name: null,
    status: "complete",
    installed_by: "Fred Mwangi",
    installed_by_code: "Admin-001",
    installed_at: daysAgo(12, 10, 30),
    location: "Westlands, Nairobi",
    notes: "OBD port slightly loose. Secured with tape.",
    photo: null,
    test_results: [
      { key: "4g", label: "4G Network", pass: true, detail: "Safaricom • Signal: Strong" },
      { key: "gps", label: "GPS Signal", pass: true, detail: "Westlands, Nairobi" },
      { key: "obd", label: "OBD Connection", pass: true, detail: "Speed: 0 • RPM: 850 • Temp: 72°C" },
      { key: "server", label: "Server Connection", pass: true, detail: "Latency: 45ms" }
    ]
  }
];

/* ---------- INSTALL TEST DEFINITIONS (Step 5 + Device check) ----------
   delay = ms before that check resolves while animating.
   fix = shown when that check fails. */
const TEST_STEPS = [
  {
    key: "4g",
    label: "4G Network Connected",
    delay: 1500,
    pass_detail: "Safaricom • Signal: Strong",
    fix: "Remove device, check SIM is inserted, replug, wait 2 minutes."
  },
  {
    key: "gps",
    label: "GPS Signal Locked",
    delay: 2500,
    pass_detail: "Westlands, Nairobi",
    fix: "Move to an open area away from buildings. Wait 5 minutes — first lock is slow."
  },
  {
    key: "obd",
    label: "OBD Connected",
    delay: 3500,
    pass_detail: "Speed: 0 • RPM: 850 • Temp: 72°C",
    fix: "Remove and replug firmly. Check for bent pins. Some vehicles need the engine fully running, not just ignition."
  },
  {
    key: "server",
    label: "Server Connected",
    delay: 4500,
    pass_detail: "Latency: 45ms • Data flowing",
    fix: "Check the SIM has data. Wait 2 minutes and retry. If it still fails, report the device code to the team."
  }
];

/* ---------- FIX GUIDE (Fix a problem page) ---------- */
const FIX_GUIDE = {
  "4g": {
    title: "4G offline",
    steps: [
      "Remove the device from the OBD port.",
      "Check the SIM card is inserted fully and facing the right way.",
      "Replug the device firmly.",
      "Turn ignition on and wait 2 minutes."
    ]
  },
  "obd": {
    title: "OBD not reading",
    steps: [
      "Remove and replug the device firmly.",
      "Check the OBD port for bent pins.",
      "Some vehicles need the engine fully running, not just ignition.",
      "If still nothing, try another vehicle to rule out a faulty device."
    ]
  },
  "gps": {
    title: "GPS not locking",
    steps: [
      "Move the vehicle to an open area away from buildings.",
      "Wait 5 minutes — the first lock is slow.",
      "Make sure nothing metallic is covering the device."
    ]
  },
  "server": {
    title: "Server not reached",
    steps: [
      "Check the SIM has an active data bundle.",
      "Wait 2 minutes and re-run the check.",
      "If it still fails, note the device code and tell the team."
    ]
  }
};