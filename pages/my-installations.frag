<section class="installs">

  <!-- Stats -->
  <div class="stat-row installs__stats" style="grid-template-columns:repeat(3,1fr)">
    <div class="stat"><span class="stat__value" id="statToday">0</span><span class="stat__label">Today</span></div>
    <div class="stat"><span class="stat__value" id="statWeek">0</span><span class="stat__label">This week</span></div>
    <div class="stat"><span class="stat__value" id="statTotal">0</span><span class="stat__label">Total</span></div>
  </div>

  <!-- Filter + search -->
  <div class="installs__tools">
    <div class="segmented" id="filterBar" role="tablist" aria-label="Filter installations">
      <button class="segmented__btn" type="button" data-range="today">Today</button>
      <button class="segmented__btn" type="button" data-range="week">This week</button>
      <button class="segmented__btn active" type="button" data-range="all">All</button>
    </div>

    <div class="search">
      <i data-icon="search"></i>
      <input class="input" id="searchInput" type="search" placeholder="Search code, plate or client" autocomplete="off">
    </div>
  </div>

  <!-- List -->
  <div class="installs__list" id="installList"></div>

</section>

<script>
(function () {
  const staff = Auth.current();
  if (!staff) return;

  const $ = function (id) { return document.getElementById(id); };

  /* ---------- Stats ---------- */
  const stats = Installs.stats(staff);
  $("statToday").textContent = stats.today;
  $("statWeek").textContent = stats.week;
  $("statTotal").textContent = stats.total;

  /* ---------- Filter + search state ---------- */
  let range = "all";
  let query = "";

  const mine = Installs.byStaff(staff);

  function vehicleLine(item) {
    const detail = [item.vehicle_make, item.vehicle_model, item.vehicle_year]
      .filter(function (part) { return part; })
      .join(" ") || Fmt.vehicleTypeLabel(item.vehicle_type);
    return detail ? item.vehicle_plate + " — " + detail : item.vehicle_plate;
  }

  function matches(item) {
    if (!Installs.inRange(item, range)) return false;
    if (!query) return true;
    const haystack = [item.device_code, item.vehicle_plate, item.client_name].join(" ").toLowerCase();
    return haystack.indexOf(query) !== -1;
  }

  function card(item) {
    const isIssue = item.status === "issue";
    const badge = isIssue
      ? '<span class="badge badge--warn">' + Icons.get("alert") + "Issue</span>"
      : '<span class="badge badge--ok">' + Icons.get("check") + "Done</span>";

    return (
      '<button class="list-item" type="button" data-id="' + esc(item.id) + '">' +
        '<div class="list-item__top">' +
          '<span class="list-item__code mono">' + esc(item.device_code) + "</span>" +
          badge +
        "</div>" +
        '<p class="list-item__plate">' + esc(vehicleLine(item)) + "</p>" +
        '<p class="list-item__meta">' + esc(item.client_name) + " (" + esc(Fmt.clientTypeLabel(item.client_type).replace(" Driver", "").replace(" Vehicle", "")) + ")</p>" +
        '<p class="list-item__meta">' + esc(Fmt.friendly(item.installed_at)) + "</p>" +
        (isIssue && item.issue ? '<p class="install-issue">' + esc(item.issue) + "</p>" : "") +
        '<span class="link-btn" style="min-height:36px;margin-top:4px">View details ' + Icons.get("arrowRight") + "</span>" +
      "</button>"
    );
  }

  function render() {
    const list = $("installList");
    const rows = mine.filter(matches);

    if (rows.length === 0) {
      let message = "No installations yet.";
      if (query) message = "No installations match your search.";
      else if (range === "today") message = "No installations today yet.";
      else if (range === "week") message = "No installations this week.";
      list.innerHTML = '<div class="empty">' + esc(message) + "</div>";
      return;
    }

    list.innerHTML = rows.map(card).join("");

    list.querySelectorAll(".list-item").forEach(function (node) {
      node.addEventListener("click", function () {
        Router.go("#/installation?id=" + node.getAttribute("data-id"));
      });
    });
  }

  /* ---------- Events ---------- */
  $("filterBar").addEventListener("click", function (event) {
    const btn = event.target.closest(".segmented__btn");
    if (!btn) return;
    range = btn.getAttribute("data-range");
    $("filterBar").querySelectorAll(".segmented__btn").forEach(function (b) {
      b.classList.toggle("active", b === btn);
    });
    render();
  });

  $("searchInput").addEventListener("input", function () {
    query = $("searchInput").value.trim().toLowerCase();
    render();
  });

  render();
})();
</script>