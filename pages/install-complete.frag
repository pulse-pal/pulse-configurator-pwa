<section class="complete">

  <div class="success-mark" id="mark"></div>
  <h1 class="complete__title" id="title">Installed</h1>

  <div class="card">
    <div class="kv"><span class="kv__key">Device code</span><span class="kv__value mono" id="sumCode"></span></div>
    <div class="kv"><span class="kv__key">Vehicle</span><span class="kv__value" id="sumVehicle"></span></div>
    <div class="kv"><span class="kv__key">Client</span><span class="kv__value" id="sumClient"></span></div>
    <div class="kv"><span class="kv__key">Type</span><span class="kv__value" id="sumType"></span></div>
    <div class="kv"><span class="kv__key">Installed by</span><span class="kv__value" id="sumBy"></span></div>
    <div class="kv"><span class="kv__key">Time</span><span class="kv__value" id="sumTime"></span></div>
  </div>

  <div class="sms-note">
    <i data-icon="message"></i>
    <span id="smsText"></span>
  </div>

  <!-- Optional: photo + notes -->
  <div class="card" style="text-align:left">
    <p class="card__label">Optional</p>

    <input type="file" id="photoInput" accept="image/*" capture="environment" hidden>
    <button class="btn btn-outline" id="photoBtn" type="button">
      <i data-icon="camera"></i>
      Take photo
    </button>
    <img class="detail__photo" id="photoPreview" alt="Installation photo" hidden style="margin-top:12px">

    <div class="field" style="margin:16px 0 12px">
      <label class="field__label" for="notes">Notes</label>
      <textarea class="textarea" id="notes" placeholder="Anything worth remembering about this install"></textarea>
    </div>
    <button class="btn btn-outline" id="saveNotesBtn" type="button">Save notes</button>
  </div>

  <div class="install__footer">
    <div class="stack-sm">
      <button class="btn btn-primary" id="homeBtn" type="button">
        <i data-icon="home"></i>
        Back to Home
      </button>
      <button class="btn btn-outline" id="recordBtn" type="button">
        <i data-icon="list"></i>
        View record
      </button>
    </div>
    <p class="return-timer" id="returnTimer"></p>
  </div>

</section>

<script>
(function () {
  const state = Store.get();
  const record = state.saved_record_id ? Installs.byId(state.saved_record_id) : null;

  // Nothing was just installed (e.g. page refreshed after leaving): go Home.
  if (!record) {
    Router.replace("#/home");
    return;
  }

  const $ = function (id) { return document.getElementById(id); };

  /* ---------- Header + summary ---------- */
  $("mark").innerHTML = Icons.get("check");
  $("title").textContent = record.device_code + " installed";

  const vehicleBits = [record.vehicle_plate];
  const typeLabel = Fmt.vehicleTypeLabel(record.vehicle_type);
  if (typeLabel) vehicleBits.push(typeLabel);

  $("sumCode").textContent = record.device_code;
  $("sumVehicle").textContent = vehicleBits.join(" · ");
  $("sumClient").textContent = record.client_name;
  $("sumType").textContent = Fmt.clientTypeLabel(record.client_type);
  $("sumBy").textContent = (record.installed_by.split(" ")[0]) + " (" + record.installed_by_code + ")";
  $("sumTime").textContent = Fmt.friendly(record.installed_at);
  $("smsText").textContent = "Welcome SMS sent to " + record.client_name;

  $("notes").value = record.notes || "";
  if (record.photo) {
    $("photoPreview").src = record.photo;
    $("photoPreview").hidden = false;
  }

  /* ---------- Auto return to Home (10 seconds) ---------- */
  const TOTAL_MS = 10000;
  const startedAt = Date.now();
  let timer = null;
  let paused = false;

  function updateTimer() {
    if (paused) return;
    const left = Math.max(0, Math.ceil((TOTAL_MS - (Date.now() - startedAt)) / 1000));
    $("returnTimer").textContent = "Returning to home in " + left + " seconds...";
    if (left === 0) {
      stopTimer();
      Router.go("#/home");
    }
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Adding a photo or note cancels the auto return so staff aren't cut off
  function pauseAutoReturn() {
    if (paused) return;
    paused = true;
    stopTimer();
    $("returnTimer").textContent = "Auto return paused while you add details.";
  }

  updateTimer();
  timer = setInterval(updateTimer, 250);

  // Leaving the page (any way): stop the timer and start the next install clean
  Router.onLeave(function () {
    stopTimer();
    Store.reset();
  });

  /* ---------- Notes ---------- */
  $("notes").addEventListener("focus", pauseAutoReturn);
  $("notes").addEventListener("input", pauseAutoReturn);

  $("saveNotesBtn").addEventListener("click", function () {
    pauseAutoReturn();
    record.notes = $("notes").value.trim();
    Toast.show("Notes saved", "success");
  });

  /* ---------- Photo (shrunk before keeping, phone photos are huge) ---------- */
  $("photoBtn").addEventListener("click", function () {
    pauseAutoReturn();
    $("photoInput").click();
  });

  $("photoInput").addEventListener("change", function () {
    const file = $("photoInput").files && $("photoInput").files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        const MAX = 1280;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        record.photo = dataUrl;
        $("photoPreview").src = dataUrl;
        $("photoPreview").hidden = false;
        Toast.show("Photo added", "success");
      };
      img.onerror = function () { Toast.show("Could not read that photo", "error"); };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  /* ---------- Buttons ---------- */
  $("homeBtn").addEventListener("click", function () {
    Router.go("#/home");
  });

  $("recordBtn").addEventListener("click", function () {
    Router.go("#/installation?id=" + record.id);
  });
})();
</script>