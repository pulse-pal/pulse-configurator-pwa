<section class="detail" id="detail"></section>

<script>
(function () {
  const root = document.getElementById("detail");
  const id = window.RouteParams && window.RouteParams.id;
  const item = id ? Installs.byId(id) : null;

  // Unknown or missing id: back to the list
  if (!item) {
    Router.replace("#/installations");
    return;
  }

  /* ---------- helpers ---------- */
  function row(key, value, mono) {
    if (value === null || value === undefined || value === "") return "";
    return (
      '<div class="kv">' +
        '<span class="kv__key">' + esc(key) + "</span>" +
        '<span class="kv__value' + (mono ? " mono" : "") + '">' + esc(value) + "</span>" +
      "</div>"
    );
  }

  function section(label, rows) {
    return '<div class="card"><p class="card__label">' + esc(label) + "</p>" + rows + "</div>";
  }

  const isIssue = item.status === "issue";
  const badge = isIssue
    ? '<span class="badge badge--warn">' + Icons.get("alert") + "Issue</span>"
    : '<span class="badge badge--ok">' + Icons.get("check") + "Done</span>";

  /* ---------- header ---------- */
  let html =
    '<div class="row row--between">' +
      '<h2 class="mono" style="margin:0">' + esc(item.device_code) + "</h2>" +
      badge +
    "</div>";

  if (isIssue && item.issue) {
    html += '<p class="install-issue" style="margin-top:8px">' + esc(item.issue) + "</p>";
  }

  /* ---------- device ---------- */
  html += section("Device",
    row("Device code", item.device_code, true) +
    row("IMEI", item.imei, true) +
    row("SIM number", item.sim_number) +
    row("SIM ICCID", item.sim_iccid, true) +
    row("Hardware", Fmt.hardwareLabel(item.hardware_type))
  );

  /* ---------- vehicle ---------- */
  const makeModel = [item.vehicle_make, item.vehicle_model, item.vehicle_year]
    .filter(function (part) { return part; })
    .join(" ");

  html += section("Vehicle",
    row("Plate", item.vehicle_plate, true) +
    row("Vehicle", makeModel) +
    row("Type", Fmt.vehicleTypeLabel(item.vehicle_type))
  );

  /* ---------- client ---------- */
  html += section("Client",
    row("Name", item.client_name) +
    row("Phone", item.client_phone) +
    row("Type", Fmt.clientTypeLabel(item.client_type)) +
    row("Fleet", item.fleet_name) +
    row("Assigned driver", item.assigned_driver_phone)
  );

  /* ---------- installation record + test results ---------- */
  const results = item.test_results || [];
  const checks = results.map(function (r) {
    return (
      '<div class="check-line ' + (r.pass ? "check-line--pass" : "check-line--fail") + '">' +
        Icons.get(r.pass ? "check" : "x") +
        "<span>" + esc(r.label) +
          '<span class="text-muted text-sm" style="display:block;font-weight:500">' + esc(r.detail) + "</span>" +
        "</span>" +
      "</div>"
    );
  }).join("");

  html += section("Installation record",
    row("Installed by", item.installed_by + " (" + item.installed_by_code + ")") +
    row("Date and time", Fmt.dateTime(item.installed_at)) +
    row("Location", item.location) +
    (checks ? '<p class="card__label" style="margin-top:16px">Test results</p>' + checks : "")
  );

  /* ---------- photo ---------- */
  if (item.photo) {
    html += '<img class="detail__photo" src="' + item.photo + '" alt="Installation photo">';
  }

  /* ---------- notes ---------- */
  if (item.notes) {
    html += section("Notes", '<p class="detail__notes">' + esc(item.notes) + "</p>");
  }

  /* ---------- action ---------- */
  html +=
    '<button class="btn btn-primary" id="checkBtn" type="button">' +
      Icons.get("tools") + "Check this device" +
    "</button>";

  root.innerHTML = html;

  document.getElementById("checkBtn").addEventListener("click", function () {
    Router.go("#/device-check?code=" + encodeURIComponent(item.device_code));
  });
})();
</script>