<section class="install">

  <div class="progress-dots" aria-label="Step 5 of 5">
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot current"></span>
  </div>

  <div class="reminder">
    <i data-icon="signal"></i>
    <span id="reminderText"></span>
  </div>

  <div class="stack" id="testList"></div>

  <div id="summary"></div>

  <div class="install__footer">
    <button class="btn btn-primary" id="completeBtn" type="button" disabled>
      Complete installation
      <span data-icon="arrowRight"></span>
    </button>
    <button class="btn btn-primary" id="retryBtn" type="button" hidden>
      Retry all tests
    </button>
  </div>

</section>

<script>
(function () {
  const state = Store.get();

  // Came here without finishing the earlier steps? Send them back.
  if (!state.vehicle_plate || !state.client_type) {
    Router.replace("#/install/3");
    return;
  }

  const $ = function (id) { return document.getElementById(id); };

  $("reminderText").textContent = "Testing " + state.device_code + " on " + state.vehicle_plate;

  const SHORT_LABEL = {
    "4g": "4G Network",
    "gps": "GPS Signal",
    "obd": "OBD Connection",
    "server": "Server Connection"
  };

  const FAIL_DETAIL = {
    "4g": "No network. SIM not connected",
    "gps": "No GPS lock yet",
    "obd": "No data from the vehicle",
    "server": "Server not reachable"
  };

  // Test hook: #/install/5?fail=obd forces that check to fail on the FIRST run only.
  // A retry assumes the fix was applied, so it passes.
  let failKey = (window.RouteParams && window.RouteParams.fail) || "";

  let timers = [];
  let results = [];

  function later(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function clearTimers() {
    timers.forEach(function (t) { clearTimeout(t); });
    timers = [];
  }

  Router.onLeave(clearTimers);

  /* ---------- Build the list ---------- */
  function renderList() {
    $("testList").innerHTML = TEST_STEPS.map(function (step) {
      return (
        '<div class="test-item" id="test-' + esc(step.key) + '">' +
          '<span class="test-item__status">' + Icons.get("loader") + "</span>" +
          "<div>" +
            '<p class="test-item__title">' + esc(step.label) + "</p>" +
            '<p class="test-item__detail">Waiting...</p>' +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function itemFor(step) {
    return $("test-" + step.key);
  }

  function showRunning(step) {
    const item = itemFor(step);
    item.classList.add("visible", "running");
    item.querySelector(".test-item__status").innerHTML = Icons.get("loader");
    item.querySelector(".test-item__detail").textContent = "Checking...";
  }

  function resolveItem(step) {
    const item = itemFor(step);
    const pass = step.key !== failKey;
    const detail = pass ? step.pass_detail : FAIL_DETAIL[step.key];

    item.classList.remove("running");
    item.classList.add(pass ? "pass" : "fail");
    item.querySelector(".test-item__status").innerHTML = Icons.get(pass ? "check" : "x");
    item.querySelector(".test-item__detail").textContent = detail;

    if (!pass) {
      const fix = document.createElement("p");
      fix.className = "test-item__fix";
      fix.textContent = step.fix;
      item.querySelector(".test-item__detail").parentNode.appendChild(fix);
    }

    results.push({
      key: step.key,
      label: SHORT_LABEL[step.key] || step.label,
      pass: pass,
      detail: detail
    });
  }

  /* ---------- Finish ---------- */
  function finish() {
    const failed = results.filter(function (r) { return !r.pass; });
    Store.set({ test_results: results });

    if (failed.length === 0) {
      $("summary").innerHTML =
        '<div class="success-mark">' + Icons.get("check") + "</div>" +
        '<div class="test-banner" style="margin-top:0">All systems go</div>';
      $("completeBtn").disabled = false;
    } else {
      $("summary").innerHTML =
        '<div class="test-banner test-banner--fail">' +
        failed.length + (failed.length === 1 ? " check failed" : " checks failed") +
        "</div>";
      $("completeBtn").hidden = true;
      $("retryBtn").hidden = false;
    }
  }

  /* ---------- Run all tests ---------- */
  function run() {
    clearTimers();
    results = [];
    renderList();
    $("summary").innerHTML = "";
    $("completeBtn").hidden = false;
    $("completeBtn").disabled = true;
    $("retryBtn").hidden = true;

    TEST_STEPS.forEach(function (step, i) {
      // each item appears when the previous one resolves, then resolves at its own delay
      const appearAt = i === 0 ? 60 : TEST_STEPS[i - 1].delay;
      later(function () { showRunning(step); }, appearAt);
      later(function () {
        resolveItem(step);
        if (i === TEST_STEPS.length - 1) finish();
      }, step.delay);
    });
  }

  $("retryBtn").addEventListener("click", function () {
    failKey = "";   // retry assumes the fix was applied
    run();
  });

  /* ---------- Complete: save the installation record ---------- */
  function fleetNameFor(s) {
    if (s.client_type !== "fleet") return null;
    return s.client_name || null;
  }

  $("completeBtn").addEventListener("click", function () {
    if ($("completeBtn").disabled) return;

    const s = Store.get();
    const staff = Auth.current();

    // Guard: going back and forth must never save the same install twice
    if (!s.saved_record_id && staff) {
      // Fleet bookkeeping (dummy data)
      if (s.client_type === "fleet") {
        if (s.fleet_id === "new") {
          FLEET_ACCOUNTS.push({
            id: FLEET_ACCOUNTS.reduce(function (m, f) { return Math.max(m, f.id); }, 0) + 1,
            name: s.new_fleet_name,
            contact: s.new_fleet_contact,
            phone: s.new_fleet_phone,
            vehicles: 1
          });
        } else {
          const fleet = FLEET_ACCOUNTS.find(function (f) { return String(f.id) === String(s.fleet_id); });
          if (fleet) fleet.vehicles += 1;
        }
      }

      const gps = results.find(function (r) { return r.key === "gps"; });

      const record = Installs.add({
        id: Installs.nextId(),
        device_code: s.device_code,
        imei: s.imei,
        sim_number: s.sim_number,
        sim_iccid: s.sim_iccid,
        hardware_type: s.hardware_type,
        client_name: s.client_name,
        client_phone: s.client_phone,
        client_type: s.client_type,
        vehicle_plate: s.vehicle_plate,
        vehicle_make: "",
        vehicle_model: "",
        vehicle_year: null,
        vehicle_type: s.vehicle_type,
        fleet_name: fleetNameFor(s),
        assigned_driver_phone: s.assigned_driver_phone,
        status: "complete",
        issue: null,
        installed_by: staff.name,
        installed_by_code: staff.staff_code,
        installed_at: new Date().toISOString(),
        location: gps ? gps.detail : "",
        notes: "",
        photo: null,
        test_results: results
      });

      Installs.bumpDeviceCode();
      Store.set({ saved_record_id: record.id, test_results: results });
    }

    Store.set({ step: 6 });
    Router.go("#/install/complete");
  });

  run();
})();
</script>