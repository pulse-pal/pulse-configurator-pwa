<section class="install">

  <div class="progress-dots" aria-label="Step 4 of 5">
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot current"></span>
    <span class="progress-dots__dot"></span>
  </div>

  <!-- Always visible reminder -->
  <div class="reminder">
    <i data-icon="plug"></i>
    <span id="reminderText"></span>
  </div>

  <div class="stack">

    <div class="step-item">
      <span class="step-item__num">1</span>
      <div>
        <h3 class="step-item__title" style="display:flex;align-items:center;gap:8px"><i data-icon="locate"></i> Locate the OBD port</h3>
        <p class="step-item__desc">Under the dashboard, driver side, near the steering column. 16-pin trapezoid connector.</p>
        <button class="link-btn" id="showWhereBtn" type="button">Show me where <i data-icon="arrowRight"></i></button>
      </div>
    </div>

    <div class="step-item">
      <span class="step-item__num">2</span>
      <div>
        <h3 class="step-item__title" style="display:flex;align-items:center;gap:8px"><i data-icon="plug"></i> Plug in the device</h3>
        <p class="step-item__desc" style="margin:0">Press firmly until it clicks. A loose connection means lost data.</p>
      </div>
    </div>

    <div class="step-item">
      <span class="step-item__num">3</span>
      <div>
        <h3 class="step-item__title" style="display:flex;align-items:center;gap:8px"><i data-icon="key"></i> Turn on ignition</h3>
        <p class="step-item__desc" style="margin:0">Key to ON position. The engine doesn't need to start.</p>
      </div>
    </div>

    <div class="step-item">
      <span class="step-item__num">4</span>
      <div>
        <h3 class="step-item__title" style="display:flex;align-items:center;gap:8px"><i data-icon="timer"></i> Wait 60 seconds</h3>
        <p class="step-item__desc" style="margin:0">The device needs time to connect to 4G, GPS and the server.</p>
      </div>
    </div>

  </div>

  <!-- Countdown -->
  <div class="countdown" id="countdown" style="margin-top:16px">
    <div class="countdown__top">
      <span class="text-strong" id="countdownLabel">Waiting for the device</span>
      <span class="countdown__time" id="countdownTime">60s</span>
    </div>
    <div class="countdown__track">
      <div class="countdown__fill" id="countdownFill" style="width:0%"></div>
    </div>
  </div>

  <div class="install__footer">
    <button class="btn btn-primary" id="installedBtn" type="button" disabled>
      Device is installed
      <span data-icon="arrowRight"></span>
    </button>
  </div>

</section>

<script>
(function () {
  const state = Store.get();

  // Came here without finishing Step 3? Send them back.
  if (!state.vehicle_plate || !state.client_type) {
    Router.replace("#/install/3");
    return;
  }

  const $ = function (id) { return document.getElementById(id); };

  $("reminderText").textContent = "Installing " + state.device_code + " on " + state.vehicle_plate;

  /* ---------- OBD diagram popup ---------- */
  const DIAGRAM =
    '<svg viewBox="0 0 320 210" role="img" aria-label="OBD port location under the dashboard on the driver side">' +
      // dashboard
      '<rect x="10" y="10" width="300" height="78" rx="14" style="fill:var(--surface);stroke:var(--border);stroke-width:2"/>' +
      '<text x="160" y="30" text-anchor="middle" font-size="11" style="fill:var(--text-muted)">Dashboard</text>' +
      // steering wheel
      '<circle cx="100" cy="66" r="34" style="fill:none;stroke:var(--text-muted);stroke-width:6"/>' +
      '<circle cx="100" cy="66" r="9" style="fill:var(--text-muted)"/>' +
      '<text x="150" y="70" font-size="12" style="fill:var(--text)">Steering wheel</text>' +
      // under-dash area
      '<rect x="10" y="108" width="300" height="82" rx="12" style="fill:none;stroke:var(--border);stroke-width:2;stroke-dasharray:6 5"/>' +
      '<text x="20" y="126" font-size="11" style="fill:var(--text-muted)">Under the dashboard, driver side</text>' +
      // OBD port (trapezoid)
      '<path d="M82 140 L138 140 L130 166 L90 166 Z" style="fill:#FF7A1A;stroke:#E8650A;stroke-width:2"/>' +
      '<g style="fill:#1A0F05">' +
        '<circle cx="94" cy="149" r="2"/><circle cx="102" cy="149" r="2"/><circle cx="110" cy="149" r="2"/><circle cx="118" cy="149" r="2"/><circle cx="126" cy="149" r="2"/>' +
        '<circle cx="98" cy="158" r="2"/><circle cx="106" cy="158" r="2"/><circle cx="114" cy="158" r="2"/><circle cx="122" cy="158" r="2"/>' +
      '</g>' +
      // label + arrow
      '<path d="M146 153 L184 153" style="stroke:#FF7A1A;stroke-width:2.5;stroke-linecap:round"/>' +
      '<path d="M150 148 L145 153 L150 158" style="fill:none;stroke:#FF7A1A;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round"/>' +
      '<text x="190" y="150" font-size="13" font-weight="700" style="fill:var(--heading)">OBD port</text>' +
      '<text x="190" y="166" font-size="11" style="fill:var(--text-muted)">16-pin connector</text>' +
    '</svg>';

  let modal = null;

  function closeModal() {
    if (modal) {
      modal.remove();
      modal = null;
    }
  }

  function openModal() {
    closeModal();
    modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML =
      '<div class="modal__sheet" role="dialog" aria-label="OBD port location">' +
        '<div class="modal__head">' +
          "<h2>Where is the OBD port?</h2>" +
          '<button class="modal__close" type="button" aria-label="Close">' + Icons.get("x") + "</button>" +
        "</div>" +
        '<div class="obd-diagram">' + DIAGRAM + "</div>" +
        '<p class="text-muted">Look under the dashboard on the driver side, near the steering column. It is a 16-pin trapezoid-shaped socket. Some cars hide it behind a small cover.</p>' +
        '<button class="btn btn-primary" type="button" data-close>Got it</button>' +
      "</div>";
    document.body.appendChild(modal);

    modal.addEventListener("click", function (event) {
      if (event.target === modal || event.target.closest(".modal__close") || event.target.closest("[data-close]")) {
        closeModal();
      }
    });
  }

  $("showWhereBtn").addEventListener("click", openModal);

  /* ---------- 60 second countdown (clock based, survives throttling) ---------- */
  const TOTAL = 60;
  const endAt = Date.now() + TOTAL * 1000;
  let timer = null;

  function update() {
    const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    const done = remaining === 0;

    $("countdownTime").textContent = remaining + "s";
    $("countdownFill").style.width = ((TOTAL - remaining) / TOTAL * 100) + "%";
    $("countdown").classList.toggle("finished", done);
    $("countdownLabel").textContent = done ? "Device should be online" : "Waiting for the device";
    $("installedBtn").disabled = !done;

    if (done && timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  update();
  timer = setInterval(update, 250);

  // Clean up when leaving the page
  Router.onLeave(function () {
    if (timer) clearInterval(timer);
    timer = null;
    closeModal();
  });

  /* ---------- Continue ---------- */
  $("installedBtn").addEventListener("click", function () {
    if ($("installedBtn").disabled) return;
    Store.set({ step: 5 });
    Router.go("#/install/5");
  });
})();
</script>