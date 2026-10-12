<section class="home">

  <!-- Header: greeting left, profile button right -->
  <header class="home-header">
    <div class="home-header__text">
      <h1 class="home__hello" id="homeHello">Hello</h1>
      <p class="home__sub" id="homeSub"></p>
    </div>
    <button class="avatar-btn" id="profileBtn" type="button" aria-label="Open settings"></button>
  </header>

  <button class="btn btn-primary home__install" id="installBtn" type="button">
    <span data-icon="plus"></span>
    Install New Device
  </button>

  <div class="section-head">
    <h2>Recent installations</h2>
    <button class="link-btn" id="viewAllBtn" type="button">View all</button>
  </div>

  <div class="installs__list" id="recentList"></div>
</section>

<script>
(function () {
  const staff = Auth.current();
  if (!staff) return;

  // "Fred Mwangi" -> "FM", "Adow" -> "A"
  const initials = staff.name.split(" ").map(function (w) { return w.charAt(0); }).slice(0, 2).join("").toUpperCase();

  document.getElementById("homeHello").textContent = "Hello " + staff.first_name;
  document.getElementById("homeSub").textContent = staff.staff_code;
  document.getElementById("profileBtn").textContent = initials;

  document.getElementById("profileBtn").addEventListener("click", function () {
    Router.go("#/settings");
  });

  // Start a clean install: wipes any half-finished state, shows the next PULSE-XXXX
  document.getElementById("installBtn").addEventListener("click", function () {
    Store.reset();
    Router.go("#/install/1");
  });

  document.getElementById("viewAllBtn").addEventListener("click", function () {
    Router.go("#/installations");
  });

  /* ---------- Recent installations (last 3 by this staff member) ---------- */
  const list = document.getElementById("recentList");
  const recent = Installs.byStaff(staff).slice(0, 3);

  if (recent.length === 0) {
    list.innerHTML = '<div class="empty">No installations yet. Tap Install New Device to start.</div>';
    return;
  }

  list.innerHTML = recent.map(function (item) {
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
        '<p class="list-item__plate">' + esc(item.vehicle_plate) + "</p>" +
        '<p class="list-item__meta">' + esc(item.client_name) + "</p>" +
        '<p class="list-item__meta">' + esc(Fmt.friendly(item.installed_at)) + "</p>" +
        (isIssue && item.issue ? '<p class="install-issue">' + esc(item.issue) + "</p>" : "") +
      "</button>"
    );
  }).join("");

  list.querySelectorAll(".list-item").forEach(function (node) {
    node.addEventListener("click", function () {
      Router.go("#/installation?id=" + node.getAttribute("data-id"));
    });
  });
})();
</script>