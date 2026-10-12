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
    installs_before_today: 46   // older installs not in the list below
  },
  {
    id: 2,
    name: "Adow",
    first_name: "Adow",
    email: "adow@pulsepal.com",
    role: "admin",
    staff_code: "Admin-002",
    installs_before_today: 31
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
  { value: "other", label: "Other" }
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
   status: "complete" or "issue". */
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
    vehicle_model: "Corolla Axio",
    vehicle_year: 2018,
    vehicle_type: "car",
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