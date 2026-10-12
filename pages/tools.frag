<section class="tools">

  <div class="tools-list">

    <button class="tool-link" id="checkLink" type="button">
      <span class="tool-link__icon"><i data-icon="cpu"></i></span>
      <span>
        <span class="tool-link__title" style="display:block">Check a device</span>
        <span class="tool-link__desc" style="display:block">Enter a device code and run the 4 checks</span>
      </span>
    </button>

    <button class="tool-link" id="fixLink" type="button">
      <span class="tool-link__icon"><i data-icon="tools"></i></span>
      <span>
        <span class="tool-link__title" style="display:block">Fix a problem</span>
        <span class="tool-link__desc" style="display:block">Pick the problem and see the fix steps</span>
      </span>
    </button>

  </div>

</section>

<script>
(function () {
  document.getElementById("checkLink").addEventListener("click", function () {
    Router.go("#/device-check");
  });

  document.getElementById("fixLink").addEventListener("click", function () {
    Router.go("#/troubleshoot");
  });
})();
</script>