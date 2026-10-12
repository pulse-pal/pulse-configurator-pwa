<section class="troubleshoot">

  <p class="text-muted">What is going wrong?</p>

  <div class="area-grid" id="areaGrid">
    <button class="area-btn" type="button" data-area="4g" aria-pressed="false">
      <i data-icon="signal"></i>
      <span>4G network</span>
    </button>
    <button class="area-btn" type="button" data-area="obd" aria-pressed="false">
      <i data-icon="plug"></i>
      <span>OBD</span>
    </button>
    <button class="area-btn" type="button" data-area="gps" aria-pressed="false">
      <i data-icon="pin"></i>
      <span>GPS</span>
    </button>
    <button class="area-btn" type="button" data-area="server" aria-pressed="false">
      <i data-icon="server"></i>
      <span>Server</span>
    </button>
  </div>

  <div id="fixArea"></div>

</section>

<script>
(function () {
  const $ = function (id) { return document.getElementById(id); };
  const buttons = document.querySelectorAll(".area-btn");

  function select(area) {
    buttons.forEach(function (btn) {
      const on = btn.getAttribute("data-area") === area;
      btn.classList.toggle("selected", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    const guide = FIX_GUIDE[area];
    if (!guide) {
      $("fixArea").innerHTML = "";
      return;
    }

    $("fixArea").innerHTML =
      '<div class="card">' +
        "<h2>" + esc(guide.title) + "</h2>" +
        '<ol class="fix-steps">' +
          guide.steps.map(function (step) { return "<li>" + esc(step) + "</li>"; }).join("") +
        "</ol>" +
      "</div>" +
      '<div class="install__footer">' +
        '<button class="btn btn-outline" id="checkBtn" type="button">' +
          Icons.get("cpu") + "Check a device" +
        "</button>" +
      "</div>";

    $("checkBtn").addEventListener("click", function () {
      Router.go("#/device-check");
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      select(btn.getAttribute("data-area"));
    });
  });

  // Arrived from a failed check: preselect that area
  const preset = window.RouteParams && window.RouteParams.area;
  if (preset && FIX_GUIDE[preset]) select(preset);
})();
</script>