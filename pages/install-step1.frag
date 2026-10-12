<section class="install">

  <div class="progress-dots" aria-label="Step 1 of 5">
    <span class="progress-dots__dot current"></span>
    <span class="progress-dots__dot"></span>
    <span class="progress-dots__dot"></span>
    <span class="progress-dots__dot"></span>
    <span class="progress-dots__dot"></span>
  </div>

  <!-- Next device code (auto-assigned) -->
  <div class="card card--accent next-code">
    <p class="card__label">This device will be assigned</p>
    <span class="next-code__code mono" id="nextCode">PULSE-0000</span>
    <p class="text-muted text-sm" style="margin:0">Auto-assigned by system</p>
  </div>

  <form id="step1Form" novalidate>

    <div class="field" id="imeiField">
      <label class="field__label" for="imei">IMEI number <span class="req">*</span></label>
      <input class="input mono" id="imei" type="text" inputmode="numeric"
             maxlength="17" autocomplete="off" placeholder="15 digits">
      <p class="field__hint">Printed on the device label.</p>
      <p class="field__error" id="imeiError" hidden></p>
    </div>

    <div class="field" id="simField">
      <label class="field__label" for="simNumber">SIM phone number <span class="req">*</span></label>
      <input class="input" id="simNumber" type="tel" inputmode="tel"
             autocomplete="off" placeholder="0712345678">
      <p class="field__error" id="simError" hidden></p>
    </div>

    <div class="field" id="iccidField">
      <label class="field__label" for="simIccid">SIM ICCID (optional)</label>
      <input class="input mono" id="simIccid" type="text" inputmode="numeric"
             maxlength="22" autocomplete="off" placeholder="19 to 20 digits">
      <p class="field__error" id="iccidError" hidden></p>
    </div>

    <div class="field">
      <label class="field__label" for="hardwareType">Hardware type</label>
      <select class="select" id="hardwareType"></select>
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

  const imeiInput = document.getElementById("imei");
  const simInput = document.getElementById("simNumber");
  const iccidInput = document.getElementById("simIccid");
  const hardwareSelect = document.getElementById("hardwareType");

  // Next code comes from the install state (set when the install started)
  document.getElementById("nextCode").textContent = state.device_code;

  // Hardware dropdown
  hardwareSelect.innerHTML = HARDWARE_TYPES.map(function (h) {
    return '<option value="' + esc(h.value) + '">' + esc(h.label) + "</option>";
  }).join("");

  // Refill when coming back from Step 2
  imeiInput.value = state.imei;
  simInput.value = state.sim_number;
  iccidInput.value = state.sim_iccid;
  hardwareSelect.value = state.hardware_type;

  /* ---------- Field error helpers ---------- */
  const fields = [
    { field: document.getElementById("imeiField"),  error: document.getElementById("imeiError") },
    { field: document.getElementById("simField"),   error: document.getElementById("simError") },
    { field: document.getElementById("iccidField"), error: document.getElementById("iccidError") }
  ];

  function showError(index, message) {
    fields[index].field.classList.add("field--error");
    fields[index].error.textContent = message;
    fields[index].error.hidden = false;
  }

  function clearErrors() {
    fields.forEach(function (f) {
      f.field.classList.remove("field--error");
      f.error.hidden = true;
      f.error.textContent = "";
    });
  }

  [imeiInput, simInput, iccidInput].forEach(function (input) {
    input.addEventListener("input", clearErrors);
  });

  /* ---------- Submit ---------- */
  document.getElementById("step1Form").addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const imei = imeiInput.value.replace(/\s/g, "");
    const sim = simInput.value.replace(/[\s-]/g, "");
    const iccid = iccidInput.value.replace(/\s/g, "");

    let firstBad = null;

    const imeiMsg = Validate.imei(imei);
    if (imeiMsg) { showError(0, imeiMsg); firstBad = firstBad || imeiInput; }

    const simMsg = Validate.phone(sim);
    if (simMsg) { showError(1, simMsg); firstBad = firstBad || simInput; }

    // ICCID is optional, but if typed it must look right
    if (iccid && !/^\d{18,20}$/.test(iccid)) {
      showError(2, "ICCID is 18 to 20 digits");
      firstBad = firstBad || iccidInput;
    }

    if (firstBad) {
      firstBad.focus();
      return;
    }

    Store.set({
      imei: imei,
      sim_number: sim,
      sim_iccid: iccid,
      hardware_type: hardwareSelect.value,
      step: 2
    });

    Router.go("#/install/2");
  });
})();
</script>