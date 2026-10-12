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

    <!-- ===== VEHICLE (both types) ===== -->
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

    <!-- ===== FLEET ONLY: optional driver ===== -->
    <div class="field" id="f-assigned_driver_phone" hidden>
      <label class="field__label" for="assigned_driver_phone">Assign driver (optional)</label>
      <input class="input" id="assigned_driver_phone" type="tel" inputmode="tel" autocomplete="off" placeholder="Driver's phone number">
      <p class="field__error" hidden></p>
    </div>

    <div class="install__footer">
      <button class="btn btn-primary" type="submit">
        Next
        <span data-icon="arrowRight"></span>
      </button>
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
  const $ = function (id) { return document.getElementById(id); };

  $("subLine").textContent = (isFleet ? "Fleet vehicle" : "Individual driver") + " · " + state.device_code;
  $("individualBlock").hidden = isFleet;
  $("fleetBlock").hidden = !isFleet;
  $("f-assigned_driver_phone").hidden = !isFleet;

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

  /* ---------- Refill saved values (coming back from Step 4) ---------- */
  $("vehicle_plate").value = state.vehicle_plate;
  $("vehicle_type").value = state.vehicle_type;

  if (isFleet) {
    $("fleet_id").value = state.fleet_id;
    $("new_fleet_name").value = state.new_fleet_name;
    $("new_fleet_contact").value = state.new_fleet_contact;
    $("new_fleet_phone").value = state.new_fleet_phone;
    $("assigned_driver_phone").value = state.assigned_driver_phone;
    toggleNewFleet();
  } else if (!state.fleet_id && !state.new_fleet_name) {
    // only refill if the saved name belongs to an individual, not a fleet
    $("client_phone").value = state.client_phone;
    $("client_name").value = state.client_name;
  }

  /* ---------- Errors ---------- */
  let firstBad = null;

  function fail(name, message) {
    const wrap = $("f-" + name);
    wrap.classList.add("field--error");
    const msg = wrap.querySelector(".field__error");
    msg.textContent = message;
    msg.hidden = false;
    if (!firstBad) firstBad = wrap.querySelector("input, select");
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

  /* ---------- Submit ---------- */
  $("step3Form").addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const plate = $("vehicle_plate").value.trim().toUpperCase();
    const vehicleType = $("vehicle_type").value;

    let patch;

    if (!isFleet) {
      /* ----- Individual ----- */
      const phone = $("client_phone").value.replace(/[\s-]/g, "");
      const name = $("client_name").value.trim();

      const phoneMsg = Validate.phone(phone);
      if (phoneMsg) fail("client_phone", phoneMsg);

      const nameMsg = Validate.required(name, "Driver's name");
      if (nameMsg) fail("client_name", nameMsg);

      patch = {
        client_phone: phone,
        client_name: name,
        fleet_id: "",
        new_fleet_name: "",
        new_fleet_contact: "",
        new_fleet_phone: "",
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

      const driver = $("assigned_driver_phone").value.replace(/[\s-]/g, "");
      if (driver) {
        const dMsg = Validate.phone(driver);
        if (dMsg) fail("assigned_driver_phone", dMsg);
      }

      patch = {
        client_name: clientName,
        client_phone: clientPhone,
        fleet_id: fleetId,
        new_fleet_name: newName,
        new_fleet_contact: newContact,
        new_fleet_phone: newPhone,
        assigned_driver_phone: driver
      };
    }

    /* ----- Vehicle (both) ----- */
    const plateMsg = Validate.plate(plate);
    if (plateMsg) fail("vehicle_plate", plateMsg);

    if (!vehicleType) fail("vehicle_type", "Select a vehicle type");

    if (firstBad) {
      firstBad.focus();
      return;
    }

    patch.vehicle_plate = plate;
    patch.vehicle_type = vehicleType;
    patch.step = 4;

    Store.set(patch);
    Router.go("#/install/4");
  });
})();
</script>