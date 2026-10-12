<section class="settings">

  <!-- Profile card -->
  <div class="card profile-card">
    <div class="profile-card__top">
      <span class="avatar-lg" id="avatar"></span>
      <div class="profile-card__text">
        <h2 id="staffName"></h2>
        <p id="staffEmail"></p>
      </div>
    </div>

    <div class="meta-tags">
      <span class="meta-tag"><span class="meta-tag__label">Code</span><span class="mono" id="staffCode"></span></span>
      <span class="meta-tag"><span class="meta-tag__label">Role</span><span id="staffRole"></span></span>
    </div>
  </div>

  <!-- Appearance -->
  <div class="card">
    <p class="card__label">Appearance</p>
    <div class="theme-switch" id="themeBar" role="radiogroup" aria-label="Theme">
      <span class="theme-switch__thumb" id="thumb"></span>
      <button class="theme-switch__btn" type="button" role="radio" data-mode="auto">Auto</button>
      <button class="theme-switch__btn" type="button" role="radio" data-mode="light">Light</button>
      <button class="theme-switch__btn" type="button" role="radio" data-mode="dark">Dark</button>
    </div>
    <p class="field__hint">Auto follows your phone's light or dark setting.</p>
  </div>

  <!-- Log out -->
  <button class="logout-btn" id="logoutBtn" type="button">
    <i data-icon="logout"></i>
    Log out
  </button>

  <p class="settings__version">PulsePal Configurator · v1.0</p>

</section>

<script>
(function () {
  const staff = Auth.current();
  if (!staff) return;

  const $ = function (id) { return document.getElementById(id); };

  /* ---------- Profile ---------- */
  const initials = staff.name.split(" ").map(function (w) { return w.charAt(0); }).slice(0, 2).join("").toUpperCase();
  $("avatar").textContent = initials;
  $("staffName").textContent = staff.name;
  $("staffEmail").textContent = staff.email;
  $("staffCode").textContent = staff.staff_code;
  $("staffRole").textContent = staff.role.charAt(0).toUpperCase() + staff.role.slice(1);

  /* ---------- Theme switch with sliding indicator ---------- */
  const MODES = ["auto", "light", "dark"];
  const buttons = $("themeBar").querySelectorAll(".theme-switch__btn");
  const thumb = $("thumb");

  function mark(mode, animate) {
    const index = Math.max(0, MODES.indexOf(mode));

    if (!animate) thumb.style.transition = "none";
    thumb.style.transform = "translateX(" + (index * 100) + "%)";
    if (!animate) {
      void thumb.offsetWidth;          // apply the position, then re-enable the slide
      thumb.style.transition = "";
    }

    buttons.forEach(function (btn) {
      const on = btn.getAttribute("data-mode") === mode;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-checked", on ? "true" : "false");
    });
  }

  mark(Theme.get(), false);

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const mode = btn.getAttribute("data-mode");
      Theme.set(mode);
      mark(mode, true);
    });
  });

  /* ---------- Log out ---------- */
  $("logoutBtn").addEventListener("click", function () {
    Auth.logout();
    Router.replace("#/login");
  });
})();
</script>