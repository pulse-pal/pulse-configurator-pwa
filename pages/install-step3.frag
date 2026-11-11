<section class="install">

  <div class="progress-dots" aria-label="Step 3 of 5">
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot current"></span>
    <span class="progress-dots__dot"></span>
    <span class="progress-dots__dot"></span>
  </div>

  <h2 class="install__title">Client details</h2>
  <p class="install__sub" id="subLine"></p>

  <form id="step3Form" novalidate>

    <!-- ===== INDIVIDUAL DRIVER ===== -->
    <div id="individualBlock" hidden>
      <div class="field" id="f-client_phone">
        <label class="field__label" for="client_phone">Driver's phone number <span class="req">*</span></label>
        <input class="input" id="client_phone" type="tel" inputmode="tel" autocomplete="off" placeholder="0712345678">
        <p class="field__hint">This is the driver's login for the Driver app.</p>
        <p class="field__error" hidden></p>
      </div>

      <div class="field" id="f-client_name">
        <label class="field__label" for="client_name">Driver's name <span class="req">*</span></label>
        <input class="input" id="client_name" type="text" autocomplete="off" placeholder="e.g. John Mwangi">
        <p class="field__error" hidden></p>
      </div>
    </div>

    <!-- ===== FLEET VEHICLE ===== -->
    <div id="fleetBlock" hidden>
      <div class="field" id="f-fleet_id">
        <label class="field__label" for="fleet_id">Fleet account <span class="req">*</span></label>
        <select class="select" id="fleet_id"></select>
        <p class="field__error" hidden></p>
      </div>

      <div class="new-fleet" id="newFleetBlock" hidden>
        <div class="field" id="f-new_fleet_name">
          <label class="field__label" for="new_fleet_name">Company name <span class="req">*</span></label>
          <input class="input" id="new_fleet_name" type="text" autocomplete="off" placeholder="e.g. Kamau Logistics Ltd">
          <p class="field__error" hidden></p>
        </div>
        <div class="field" id="f-new_fleet_contact">
          <label class="field__label" for="new_fleet_contact">Contact person <span class="req">*</span></label>
          <input class="input" id="new_fleet_contact" type="text" autocomplete="off" placeholder="Full name">
          <p class="field__error" hidden></p>
        </div>
        <div class="field" id="f-new_fleet_phone" style="margin-bottom:0">
          <label class="field__label" for="new_fleet_phone">Contact phone <span class="req">*</span></label>
          <input class="input" id="new_fleet_phone" type="tel" inputmode="tel" autocomplete="off" placeholder="0722345678">
          <p class="field__error" hidden></p>
        </div>
      </div>
    </div>

    <!-- ===== VEHICLE (both types): plate, type, make, model, year ===== -->
    <div class="field" id="f-vehicle_plate">
      <label class="field__label" for="vehicle_plate">Vehicle plate <span class="req">*</span></label>
      <input class="input mono" id="vehicle_plate" type="text" autocapitalize="characters" autocomplete="off" placeholder="KBZ 123A">
      <p class="field__error" hidden></p>
    </div>

    <div class="field" id="f-vehicle_type">
      <label class="field__label" for="vehicle_type">Vehicle type <span class="req">*</span></label>
      <select class="select" id="vehicle_type"></select>
      <p class="field__error" hidden></p>
    </div>

    <div class="field" id="f-vehicle_make">
      <label class="field__label" for="vehicle_make">Make <span class="req">*</span></label>
      <input class="input" id="vehicle_make" type="text" autocomplete="off" placeholder="e.g. Toyota">
      <p class="field__error" hidden></p>
    </div>

    <div class="field" id="f-vehicle_model">
      <label class="field__label" for="vehicle_model">Model <span class="req">*</span></label>
      <input class="input" id="vehicle_model" type="text" autocomplete="off" placeholder="e.g. Axio">
      <p class="field__error" hidden></p>
    </div>

    <div class="field" id="f-vehicle_year">
      <label class="field__label" for="vehicle_year">Year <span class="req">*</span></label>
      <input class="input" id="vehicle_year" type="text" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="e.g. 2018">
      <p class="field__error" hidden></p>
    </div>

    <!-- ===== SPEEDOMETER MAX ===== -->
    <div class="field" id="f-speedometer_max">
      <p class="field__label">Speedometer max <span class="req">*</span></p>

      <div class="speedo__msg" id="speedoIdle">
        Pick the vehicle type, then fill in make, model and year to get a suggestion.
      </div>

      <div class="speedo__msg" id="speedoLoading" hidden>
        <span class="speedo__spin" id="speedoSpin"></span>
        Looking up this vehicle...
      </div>

      <div class="speedo__panel" id="speedoPanel" hidden>
        <p class="speedo__label">Suggested. Check the last number on the dash.</p>
        <p class="speedo__note" id="speedoNote" hidden></p>

        <div class="speedo__chips" id="speedoChips" role="radiogroup" aria-label="Speedometer max"></div>

        <div class="speedo__other" id="otherWrap" hidden>
          <input class="input" id="speedo_other" type="text" inputmode="numeric" maxlength="3" autocomplete="off" placeholder="60 to 400" aria-label="Speedometer max, other value">
        </div>

        <p class="speedo__note speedo__change" id="speedoChange" hidden></p>

        <button class="btn btn-outline speedo__confirm" id="confirmBtn" type="button"></button>
      </div>

      <p class="field__error" hidden></p>
    </div>

    <!-- ===== FLEET ONLY: optional driver ===== -->
    <div class="assign-driver" id="f-assign_driver" hidden>
      <p class="field__label">Assign driver (optional)</p>
      <div class="field" id="f-driver_name">
        <label class="field__label" for="driver_name">Driver's name</label>
        <input class="input" id="driver_name" type="text" autocomplete="off" placeholder="e.g. Joseph Otieno">
        <p class="field__error" hidden></p>
      </div>
      <div class="field" id="f-driver_phone" style="margin-bottom:0">
        <label class="field__label" for="driver_phone">Driver's phone number</label>
        <input class="input" id="driver_phone" type="tel" inputmode="tel" autocomplete="off" placeholder="0712345678">
        <p class="field__hint">A fleet driver logs in with this phone number. No device code needed.</p>
        <p class="field__error" hidden></p>
      </div>
    </div>

    <div class="install__footer">
      <button class="btn btn-primary" id="nextBtn" type="submit" disabled>
        Next
        <span data-icon="arrowRight"></span>
      </button>
      <p class="field__hint speedo__next-hint" id="nextHint">Confirm the speedometer max to continue.</p>
    </div>
  </form>

</section>

<script>
(function () {
  const state = Store.get();

  // Opened without choosing a type? Go back to Step 2.
  if (state.client_type !== "individual" && state.client_type !== "fleet") {
    Router.replace("#/install/2");
    return;
  }

  const isFleet = state.client_type === "fleet";
  const staff = Auth.current();
  const $ = function (id) { return document.getElementById(id); };

  const CHIP_VALUES = [160, 180, 200, 220, 240];
  const SPEEDO_MIN = 60;
  const SPEEDO_MAX = 400;
  const LOOKUP_DEBOUNCE_MS = 450;
  const YEAR_MIN = 1980;
  const YEAR_MAX = new Date().getFullYear() + 1;

  $("subLine").textContent = (isFleet ? "Fleet vehicle" : "Individual driver") + " · " + state.device_code;
  $("individualBlock").hidden = isFleet;
  $("fleetBlock").hidden = !isFleet;
  $("f-assign_driver").hidden = !isFleet;

  /* ---------- Dropdowns ---------- */
  $("vehicle_type").innerHTML =
    '<option value="">Select vehicle type</option>' +
    VEHICLE_TYPES.map(function (v) {
      return '<option value="' + esc(v.value) + '">' + esc(v.label) + "</option>";
    }).join("");

  $("fleet_id").innerHTML =
    '<option value="">Select a fleet</option>' +
    FLEET_ACCOUNTS.map(function (f) {
      return '<option value="' + esc(f.id) + '">' + esc(f.name) + "</option>";
    }).join("") +
    '<option value="new">+ Create New Fleet Account</option>';

  function toggleNewFleet() {
    $("newFleetBlock").hidden = $("fleet_id").value !== "new";
  }
  $("fleet_id").addEventListener("change", toggleNewFleet);

  /* ---------- Speedometer max: the form's own state ---------- */
  let suggestion = null;      // { value, source, note }  what the lookup (or the type default) offered
  let pick = null;            // { mode: "chip" | "other" | "digital", value: number }
  let confirmed = false;      // prefill alone is NOT confirmation
  let currentKey = "";        // which type/make/model/year the suggestion belongs to
  let lookupToken = 0;        // drops answers that arrive after the inputs changed
  let debounceTimer = null;

  $("speedoSpin").innerHTML = Icons.get("loader");

  $("speedoChips").innerHTML =
    CHIP_VALUES.map(function (v) {
      return '<button class="speedo-chip" type="button" role="radio" data-kind="chip" data-value="' + v + '">' + v + "</button>";
    }).join("") +
    '<button class="speedo-chip" type="button" role="radio" data-kind="other">Other</button>' +
    '<button class="speedo-chip speedo-chip--wide" type="button" role="radio" data-kind="digital">Digital dash, no printed scale</button>';

  function showSection(which) {
    $("speedoIdle").hidden = which !== "idle";
    $("speedoLoading").hidden = which !== "loading";
    $("speedoPanel").hidden = which !== "panel";
  }

  function modeFor(value) {
    return CHIP_VALUES.indexOf(value) !== -1 ? "chip" : "other";
  }

  function pickValid() {
    return Number.isInteger(pick.value) && pick.value >= SPEEDO_MIN && pick.value <= SPEEDO_MAX;
  }

  function typeLabel() {
    return Fmt.vehicleTypeLabel($("vehicle_type").value).toLowerCase();
  }

  function syncOtherInput() {
    $("speedo_other").value = pick && pick.mode === "other" && Number.isFinite(pick.value) ? String(pick.value) : "";
  }

  function render() {
    if (!suggestion || !pick) return;

    $("speedoChips").querySelectorAll(".speedo-chip").forEach(function (btn) {
      const kind = btn.getAttribute("data-kind");
      let on = false;
      if (kind === "digital") on = pick.mode === "digital";
      else if (kind === "other") on = pick.mode === "other";
      else on = pick.mode === "chip" && Number(btn.getAttribute("data-value")) === pick.value;
      btn.classList.toggle("selected", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });

    $("otherWrap").hidden = pick.mode !== "other";

    $("speedoNote").textContent = suggestion.note || "";
    $("speedoNote").hidden = !suggestion.note;

    let change = "";
    if (pick.mode === "digital") {
      change = "Digital dash: the " + typeLabel() + " default of " + pick.value + " will be saved.";
    } else if (pickValid() && pick.value !== suggestion.value) {
      change = "Different from the suggestion. It will be saved as set by installer.";
    }
    $("speedoChange").textContent = change;
    $("speedoChange").hidden = !change;

    const confirmBtn = $("confirmBtn");
    confirmBtn.classList.toggle("is-confirmed", confirmed);
    confirmBtn.innerHTML = confirmed
      ? Icons.get("check") + "<span>Confirmed " + pick.value + "</span>"
      : "<span>Confirm" + (pickValid() ? " " + pick.value : "") + "</span>";

    $("nextBtn").disabled = !confirmed;
    $("nextHint").hidden = confirmed;
  }

  function buildSuggestion(result, vehicleType) {
    if (result && result.ok) {
      const value = Number(result.speedometer_max);
      if (Number.isInteger(value) && value >= SPEEDO_MIN && value <= SPEEDO_MAX) {
        const source = SPEEDO_SOURCE_LABELS[result.source] ? result.source : "ai_lookup";
        return { value: value, source: source, note: SPEEDO_SOURCE_LABELS[source] + "." };
      }
    }
    const why = result && result.reason === "offline" ? "No signal"
      : result && result.reason === "error" ? "The lookup failed"
      : "No match for this make and model";
    return {
      value: typeDefaultSpeedo(vehicleType),
      source: "default",
      note: why + ", so this is the " + Fmt.vehicleTypeLabel(vehicleType).toLowerCase() + " default."
    };
  }

  /* Type, make, model and a 4-digit year are all needed for a lookup */
  function readVehicleInputs() {
    const type = $("vehicle_type").value;
    const make = $("vehicle_make").value.trim();
    const model = $("vehicle_model").value.trim();
    const yearText = $("vehicle_year").value.trim();
    const year = /^\d{4}$/.test(yearText) ? parseInt(yearText, 10) : 0;
    if (!type || !make || !model || year < YEAR_MIN || year > YEAR_MAX) return null;
    return { type: type, make: make, model: model, year: year };
  }

  function norm(text) {
    return String(text || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  }

  function keyOf(inputs) {
    return [inputs.type, norm(inputs.make), norm(inputs.model), inputs.year].join("|");
  }

  async function runLookup(inputs) {
    const token = ++lookupToken;
    let result;
    try {
      result = await lookupSpeedoMax(inputs.make, inputs.model, inputs.year);
    } catch (err) {
      result = { ok: false, reason: "error" };
    }
    if (token !== lookupToken) return;   // the inputs changed while we waited

    suggestion = buildSuggestion(result, inputs.type);
    pick = { mode: modeFor(suggestion.value), value: suggestion.value };
    confirmed = false;
    showSection("panel");
    syncOtherInput();
    render();
  }

  /* Anything that feeds the lookup changed: drop the old suggestion and confirmation */
  function onVehicleInputsChanged() {
    const inputs = readVehicleInputs();
    const key = inputs ? keyOf(inputs) : "";
    if (key === currentKey) return;

    currentKey = key;
    clearTimeout(debounceTimer);
    lookupToken++;                      // cancels any lookup already in flight
    suggestion = null;
    pick = null;
    confirmed = false;
    $("nextBtn").disabled = true;
    $("nextHint").hidden = false;

    if (!inputs) {
      showSection("idle");
      return;
    }
    showSection("loading");
    debounceTimer = setTimeout(function () { runLookup(inputs); }, LOOKUP_DEBOUNCE_MS);
  }

  ["vehicle_type", "vehicle_make", "vehicle_model", "vehicle_year"].forEach(function (id) {
    $(id).addEventListener("input", onVehicleInputsChanged);
    $(id).addEventListener("change", onVehicleInputsChanged);
  });

  $("vehicle_year").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  /* ----- chips ----- */
  $("speedoChips").addEventListener("click", function (event) {
    const btn = event.target.closest(".speedo-chip");
    if (!btn || !pick) return;
    const kind = btn.getAttribute("data-kind");

    if (kind === "chip") {
      pick = { mode: "chip", value: Number(btn.getAttribute("data-value")) };
    } else if (kind === "digital") {
      pick = { mode: "digital", value: typeDefaultSpeedo($("vehicle_type").value) };
    } else {
      pick = { mode: "other", value: pick.value };
    }

    confirmed = false;
    clearErrors();
    syncOtherInput();
    render();
    if (kind === "other") $("speedo_other").focus();
  });

  $("speedo_other").addEventListener("input", function () {
    const digits = this.value.replace(/\D/g, "");
    this.value = digits;
    pick = { mode: "other", value: digits === "" ? NaN : parseInt(digits, 10) };
    confirmed = false;
    render();
  });

  function confirmPick() {
    if (!pick) return;
    if (!pickValid()) {
      fail("speedometer_max", "Enter a number from " + SPEEDO_MIN + " to " + SPEEDO_MAX, $("speedo_other"));
      return;
    }
    confirmed = true;
    clearErrors();
    render();
  }

  $("confirmBtn").addEventListener("click", confirmPick);

  $("speedo_other").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      confirmPick();
    }
  });

  /* ---------- Refill saved values (coming back from Step 4) ---------- */
  $("vehicle_plate").value = state.vehicle_plate;
  $("vehicle_type").value = state.vehicle_type;
  $("vehicle_make").value = state.vehicle_make || "";
  $("vehicle_model").value = state.vehicle_model || "";
  $("vehicle_year").value = state.vehicle_year ? String(state.vehicle_year) : "";

  if (isFleet) {
    $("fleet_id").value = state.fleet_id;
    $("new_fleet_name").value = state.new_fleet_name;
    $("new_fleet_contact").value = state.new_fleet_contact;
    $("new_fleet_phone").value = state.new_fleet_phone;
    $("driver_name").value = state.driver_name || "";
    $("driver_phone").value = state.driver_phone || state.assigned_driver_phone || "";
    toggleNewFleet();
  } else if (!state.fleet_id && !state.new_fleet_name) {
    // only refill if the saved name belongs to an individual, not a fleet
    $("client_phone").value = state.client_phone;
    $("client_name").value = state.client_name;
  }

  /* Back from Step 4 with a confirmed value: show it as it was, no new lookup */
  (function restoreSpeedo() {
    if (!state.speedo_confirmed || !state.speedometer_max) return;
    const inputs = readVehicleInputs();
    if (!inputs) return;

    const saved = Number(state.speedometer_max);
    suggestion = { value: saved, source: state.speedometer_max_source || "default", note: "" };
    pick = { mode: modeFor(saved), value: saved };
    confirmed = true;
    currentKey = keyOf(inputs);
    showSection("panel");
    syncOtherInput();
    render();
  })();

  /* ---------- Errors ---------- */
  let firstBad = null;

  function fail(name, message, focusEl) {
    const wrap = $("f-" + name);
    wrap.classList.add("field--error");
    const msg = wrap.querySelector(".field__error");
    msg.textContent = message;
    msg.hidden = false;
    if (!firstBad) firstBad = focusEl || wrap.querySelector("input, select");
  }

  function clearErrors() {
    document.querySelectorAll("#step3Form .field--error").forEach(function (n) {
      n.classList.remove("field--error");
    });
    document.querySelectorAll("#step3Form .field__error").forEach(function (n) {
      n.hidden = true;
      n.textContent = "";
    });
    firstBad = null;
  }

  $("step3Form").addEventListener("input", clearErrors);
  $("step3Form").addEventListener("change", clearErrors);

  /* ---------- What gets saved for the speedometer max ----------
     - digital dash            -> the type default, source "default"
     - same as the suggestion  -> keeps the suggestion's source
     - anything else           -> source "installer" (and a correction is logged) */
  function finalSpeedo(vehicleType) {
    if (pick.mode === "digital") {
      return { value: typeDefaultSpeedo(vehicleType), source: "default" };
    }
    if (pick.value === suggestion.value) {
      return { value: pick.value, source: suggestion.source };
    }
    return { value: pick.value, source: "installer" };
  }

  /* A correction applies to THIS vehicle only. It never edits VEHICLE_MODELS. */
  function logCorrection(plate, final) {
    SPEC_CORRECTIONS.push({
      vehicle_plate: plate,
      old_value: suggestion.value,
      old_source: suggestion.source,
      new_value: final.value,
      staff_code: staff ? staff.staff_code : "",
      at: new Date().toISOString()
    });
  }

  /* ---------- Submit ---------- */
  $("step3Form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Let a half-edited field finish its "change" event first, or it would
    // wipe the errors we are about to show when focus moves to the first bad field
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    clearErrors();

    const plate = $("vehicle_plate").value.trim().toUpperCase();
    const vehicleType = $("vehicle_type").value;
    const makeText = $("vehicle_make").value.trim();
    const modelText = $("vehicle_model").value.trim();
    const yearText = $("vehicle_year").value.trim();

    let patch;

    if (!isFleet) {
      /* ----- Individual ----- */
      const phone = $("client_phone").value.replace(/[\s-]/g, "");
      const name = $("client_name").value.trim();

      const phoneMsg = Validate.phone(phone);
      if (phoneMsg) fail("client_phone", phoneMsg);

      const nameMsg = Validate.required(name, "Driver's name");
      if (nameMsg) fail("client_name", nameMsg);

      // The client is the driver: their own account, set up with the device code
      patch = {
        client_phone: phone,
        client_name: name,
        fleet_id: "",
        new_fleet_name: "",
        new_fleet_contact: "",
        new_fleet_phone: "",
        driver_name: "",
        driver_phone: "",
        driver_account_type: "driver",
        assigned_driver_phone: ""
      };
    } else {
      /* ----- Fleet ----- */
      const fleetId = $("fleet_id").value;
      let clientName = "";
      let clientPhone = "";
      let newName = "";
      let newContact = "";
      let newPhone = "";

      if (!fleetId) {
        fail("fleet_id", "Select a fleet or create a new one");
      } else if (fleetId === "new") {
        newName = $("new_fleet_name").value.trim();
        newContact = $("new_fleet_contact").value.trim();
        newPhone = $("new_fleet_phone").value.replace(/[\s-]/g, "");

        const m1 = Validate.required(newName, "Company name");
        if (m1) fail("new_fleet_name", m1);
        const m2 = Validate.required(newContact, "Contact person");
        if (m2) fail("new_fleet_contact", m2);
        const m3 = Validate.phone(newPhone);
        if (m3) fail("new_fleet_phone", m3);

        clientName = newName;
        clientPhone = newPhone;
      } else {
        const fleet = FLEET_ACCOUNTS.find(function (f) { return String(f.id) === String(fleetId); });
        clientName = fleet ? fleet.name : "";
        clientPhone = fleet ? fleet.phone : "";
      }

      patch = {
        client_name: clientName,
        client_phone: clientPhone,
        fleet_id: fleetId,
        new_fleet_name: newName,
        new_fleet_contact: newContact,
        new_fleet_phone: newPhone
      };
    }

    /* ----- Vehicle (both) ----- */
    const plateMsg = Validate.plate(plate);
    if (plateMsg) fail("vehicle_plate", plateMsg);

    if (!vehicleType) fail("vehicle_type", "Select a vehicle type");

    const makeMsg = Validate.required(makeText, "Make");
    if (makeMsg) fail("vehicle_make", makeMsg);

    const modelMsg = Validate.required(modelText, "Model");
    if (modelMsg) fail("vehicle_model", modelMsg);

    const year = /^\d{4}$/.test(yearText) ? parseInt(yearText, 10) : 0;
    if (year < YEAR_MIN || year > YEAR_MAX) {
      fail("vehicle_year", "Enter a 4-digit year, e.g. 2018");
    }

    /* ----- Speedometer max: must be confirmed ----- */
    if (!suggestion || !pick || !confirmed) {
      fail("speedometer_max", "Confirm the speedometer max to continue", $("confirmBtn"));
    }

    /* ----- Fleet only: optional driver. Name and phone go together. ----- */
    let driverName = "";
    let driverPhone = "";
    if (isFleet) {
      driverName = $("driver_name").value.trim();
      driverPhone = $("driver_phone").value.replace(/[\s-]/g, "");
      if (driverName || driverPhone) {
        const d1 = Validate.required(driverName, "Driver's name");
        if (d1) fail("driver_name", d1);
        const d2 = Validate.phone(driverPhone);
        if (d2) fail("driver_phone", d2);
      }
    }

    if (firstBad) {
      firstBad.focus();
      return;
    }

    const make = makeText;
    const model = modelText;
    const final = finalSpeedo(vehicleType);

    if (final.source === "installer") logCorrection(plate, final);

    if (isFleet) {
      // A fleet driver has no device code and no subscribe step: they log in with their phone
      patch.driver_name = driverName;
      patch.driver_phone = driverPhone;
      patch.driver_account_type = driverName ? "fleet_driver" : "";
      patch.assigned_driver_phone = driverPhone;   // kept until Step 5 and Detail read driver_phone
    }

    patch.vehicle_plate = plate;
    patch.vehicle_type = vehicleType;
    patch.vehicle_make = make;
    patch.vehicle_model = model;
    patch.vehicle_year = year;
    patch.speedometer_max = final.value;
    patch.speedometer_max_source = final.source;
    patch.speedo_confirmed = true;
    patch.step = 4;

    Store.set(patch);
    Router.go("#/install/4");
  });

  Router.onLeave(function () {
    clearTimeout(debounceTimer);
    lookupToken++;
  });
})();
</script>