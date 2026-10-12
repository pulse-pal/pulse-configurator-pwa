<section class="login">
  <img class="login__logo" src="assets/icons/icon-192.png" alt="PulsePal">

  <h1 class="login__title">PulsePal Configurator</h1>
  <p class="login__sub">Staff sign in</p>

  <form id="loginForm" novalidate>
    <div class="field" id="emailField">
      <label class="field__label" for="loginEmail">Company email <span class="req">*</span></label>
      <input class="input" id="loginEmail" type="email" inputmode="email"
             autocomplete="username" autocapitalize="none" placeholder="name@pulsepal.com">
      <p class="field__error" id="emailError" hidden></p>
    </div>

    <div class="field" id="passwordField">
      <label class="field__label" for="loginPassword">Password <span class="req">*</span></label>
      <input class="input" id="loginPassword" type="password"
             autocomplete="current-password" placeholder="Your password">
      <p class="field__error" id="passwordError" hidden></p>
    </div>

    <button class="btn btn-primary" id="loginBtn" type="submit">Log in</button>
  </form>

  <p class="login__note">PulsePal staff only. Client access is through the Driver app.</p>
</section>

<script>
(function () {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("loginEmail");
  const passwordInput = document.getElementById("loginPassword");
  const emailField = document.getElementById("emailField");
  const passwordField = document.getElementById("passwordField");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  function showError(field, errorNode, message) {
    field.classList.add("field--error");
    errorNode.textContent = message;
    errorNode.hidden = false;
  }

  function clearErrors() {
    [emailField, passwordField].forEach(function (f) { f.classList.remove("field--error"); });
    [emailError, passwordError].forEach(function (e) { e.hidden = true; e.textContent = ""; });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email) {
      showError(emailField, emailError, "Enter your company email");
      emailInput.focus();
      return;
    }
    if (!password) {
      showError(passwordField, passwordError, "Enter your password");
      passwordInput.focus();
      return;
    }

    const result = Auth.login(email, password);

    if (!result.ok) {
      // "Staff access only" for non-company emails, otherwise the specific message
      showError(emailField, emailError, result.error);
      emailInput.focus();
      return;
    }

    Toast.show("Welcome, " + result.staff.first_name, "success");
    Router.replace("#/home");
  });

  // Clear an error as soon as the user edits the field
  emailInput.addEventListener("input", clearErrors);
  passwordInput.addEventListener("input", clearErrors);
})();
</script>