<section class="check">

  <form id="checkForm" novalidate>
    <div class="field" id="codeField">
      <label class="field__label" for="code">Device code <span class="req">*</span></label>
      <input class="input mono" id="code" type="text" autocapitalize="characters"
             autocomplete="off" placeholder="PULSE-0001">
      <p class="field__hint">Printed on the device label, e.g. PULSE-0001.</p>
      <p class="field__error" id="codeError" hidden></p>
    </div>

    <button class="btn btn-primary" id="runBtn" type="submit">Run check</button>
  </form>

  <div id="resultArea" hidden style="margin-top:24px">
    <div class="reminder">
      <i data-icon="cpu"></i>
      <span id="deviceLine"></span>
    </div>

    <div class="stack" id="testList"></div>
    <div id="summary"></div>

    <button class="btn btn-outline" id="rerunBtn" type="button" hidden style="margin-top:16px">
      Re-run tests
    </button>
  </div>

</section>

<script>
(function () {
  const $ = function (id) { return document.getElementById(id); };

  const FAIL_DETAIL = {
    "4g": "No network. SIM not connected",
    "gps": "No GPS lock yet",
    "obd": "No data from the vehicle",
    "server": "Server not reachable"
  };

  let timers = [];
  let current = null;   // the install record being checked

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function clearTimers() { timers.forEach(clearTimeout); timers = []; }
  Router.onLeave(clearTimers);

  // "pulse 0001", "0001", "PULSE-0001" -> "PULSE-0001"
  function normalize(raw) {
    const m = String(raw || "").trim().toUpperCase().match(/^(?:PULSE)?[\s-]*(\d{4})$/);
    return m ? "PULSE-" + m[1] : "";
  }

  function showError(message) {
    $("codeField").classList.add("field--error");
    $("codeError").textContent = message;
    $("codeError").hidden = false;
  }

  function clearError() {
    $("codeField").classList.remove("field--error");
    $("codeError").hidden = true;
    $("codeError").textContent = "";
  }

  $("code").addEventListener("input", clearError);

  // Arrived from an installation page: fill the code in
  const preset = window.RouteParams && window.RouteParams.code;
  if (preset) $("code").value = normalize(preset) || preset;

  /* ---------- Run the checks ---------- */
  function renderList() {
    $("testList").innerHTML = TEST_STEPS.map(function (step) {
      return (
        '<div class="test-item" id="test-' + esc(step.key) + '">' +
          '<span class="test-item__status">' + Icons.get("loader") + "</span>" +
          '<div style="flex:1;min-width:0">' +
            '<p class="test-item__title">' + esc(step.label) + "</p>" +
            '<p class="test-item__detail">Waiting...</p>' +
          "</div>" +
        "</div>"
      );
    }).join("");
  }

  function showRunning(step) {
    const item = $("test-" + step.key);
    item.classList.add("visible", "running");
    item.querySelector(".test-item__detail").textContent = "Checking...";
  }

  function resolveItem(step, results) {
    const item = $("test-" + step.key);
    const stored = (current.test_results || []).find(function (r) { return r.key === step.key; });
    const pass = stored ? stored.pass : true;
    const detail = pass
      ? (stored ? stored.detail : step.pass_detail)
      : ((stored && stored.detail) || FAIL_DETAIL[step.key]);

    item.classList.remove("running");
    item.classList.add(pass ? "pass" : "fail");
    item.querySelector(".test-item__status").innerHTML = Icons.get(pass ? "check" : "x");
    item.querySelector(".test-item__detail").textContent = detail;

    if (!pass) {
      const body = item.querySelector(".test-item__detail").parentNode;

      const fix = document.createElement("p");
      fix.className = "test-item__fix";
      fix.textContent = step.fix;
      body.appendChild(fix);

      const link = document.createElement("button");
      link.type = "button";
      link.className = "link-btn";
      link.innerHTML = "Open fix steps " + Icons.get("arrowRight");
      link.addEventListener("click", function () {
        Router.go("#/troubleshoot?area=" + step.key);
      });
      body.appendChild(link);
    }

    results.push({ key: step.key, pass: pass });
  }

  function finish(results) {
    const failed = results.filter(function (r) { return !r.pass; }).length;

    if (failed === 0) {
      $("summary").innerHTML = '<div class="test-banner">Device is online</div>';
    } else {
      $("summary").innerHTML =
        '<div class="test-banner test-banner--fail">' +
        failed + (failed === 1 ? " check failed" : " checks failed") + "</div>";
    }

    $("rerunBtn").hidden = false;
    $("runBtn").disabled = false;
  }

  function run() {
    clearTimers();
    const results = [];

    $("deviceLine").textContent = current.device_code + " · " + current.vehicle_plate;
    $("resultArea").hidden = false;
    $("summary").innerHTML = "";
    $("rerunBtn").hidden = true;
    $("runBtn").disabled = true;
    renderList();

    TEST_STEPS.forEach(function (step, i) {
      const appearAt = i === 0 ? 60 : TEST_STEPS[i - 1].delay;
      later(function () { showRunning(step); }, appearAt);
      later(function () {
        resolveItem(step, results);
        if (i === TEST_STEPS.length - 1) finish(results);
      }, step.delay);
    });
  }

  /* ---------- Form ---------- */
  $("checkForm").addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    const raw = $("code").value;
    if (!raw.trim()) {
      showError("Enter a device code");
      $("code").focus();
      return;
    }

    const code = normalize(raw);
    if (!code) {
      showError("Device codes look like PULSE-0001");
      $("code").focus();
      return;
    }

    const record = Installs.byCode(code);
    if (!record) {
      showError("No device found with that code");
      $("code").focus();
      return;
    }

    $("code").value = code;
    current = record;
    run();
  });

  $("rerunBtn").addEventListener("click", function () {
    if (current) run();
  });
})();
</script>