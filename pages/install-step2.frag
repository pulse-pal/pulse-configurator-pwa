<section class="install">

  <div class="progress-dots" aria-label="Step 2 of 5">
    <span class="progress-dots__dot done"></span>
    <span class="progress-dots__dot current"></span>
    <span class="progress-dots__dot"></span>
    <span class="progress-dots__dot"></span>
    <span class="progress-dots__dot"></span>
  </div>

  <h2 class="install__title">Who is this for?</h2>
  <p class="install__sub">Device <span class="mono text-strong" id="deviceCode"></span></p>

  <div class="stack" role="radiogroup" aria-label="User type">

    <button class="option-card" type="button" data-type="individual" role="radio" aria-checked="false">
      <span class="option-card__icon"><i data-icon="car"></i></span>
      <span>
        <span class="option-card__title" style="display:block">Individual Driver</span>
        <span class="option-card__desc" style="display:block">Personal vehicle owner</span>
        <span class="option-card__desc" style="display:block">Driver monitors their own car</span>
      </span>
    </button>

    <button class="option-card" type="button" data-type="fleet" role="radio" aria-checked="false">
      <span class="option-card__icon"><i data-icon="truck"></i></span>
      <span>
        <span class="option-card__title" style="display:block">Fleet Vehicle</span>
        <span class="option-card__desc" style="display:block">Company or business fleet</span>
        <span class="option-card__desc" style="display:block">Fleet manager monitors this vehicle</span>
      </span>
    </button>

  </div>

  <div class="install__footer">
    <button class="btn btn-primary" id="nextBtn" type="button" disabled>
      Next
      <span data-icon="arrowRight"></span>
    </button>
  </div>

</section>

<script>
(function () {
  const state = Store.get();
  const cards = document.querySelectorAll(".option-card");
  const nextBtn = document.getElementById("nextBtn");

  document.getElementById("deviceCode").textContent = state.device_code;

  function select(type) {
    cards.forEach(function (card) {
      const on = card.getAttribute("data-type") === type;
      card.classList.toggle("selected", on);
      card.setAttribute("aria-checked", on ? "true" : "false");
    });
    nextBtn.disabled = !type;
  }

  // Restore the choice when coming back from Step 3
  select(state.client_type);

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      const type = card.getAttribute("data-type");
      Store.set({ client_type: type });
      select(type);
    });
  });

  nextBtn.addEventListener("click", function () {
    if (nextBtn.disabled) return;
    Store.set({ step: 3 });
    Router.go("#/install/3");
  });
})();
</script>