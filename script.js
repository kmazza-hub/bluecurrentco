(() => {
  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Today's date for legal pages
  const todayEls = document.querySelectorAll(".js-today");
  if (todayEls.length) {
    const d = new Date();
    const formatted = d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    todayEls.forEach((el) => (el.textContent = formatted));
  }

  // Mobile nav toggle
  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (toggle && mobileNav) {
    const closeNav = () => {
      mobileNav.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };

    const openNav = () => {
      mobileNav.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });

    // Close on link click
    mobileNav.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.matches("a")) closeNav();
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

const form = document.querySel(() => {
  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Today's date for legal pages
  const todayEls = document.querySelectorAll(".js-today");
  if (todayEls.length) {
    const d = new Date();
    const formatted = d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    todayEls.forEach((el) => (el.textContent = formatted));
  }

  // Mobile nav toggle
  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (toggle && mobileNav) {
    const closeNav = () => {
      mobileNav.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };

    const openNav = () => {
      mobileNav.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });

    // Close on link click
    mobileNav.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.matches("a")) closeNav();
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // ===== Contact form: if phone is provided, SMS consent must be checked =====
  const form = document.querySelector('form[name="contact"]');
  if (form) {
    const phone = form.querySelector('input[name="phone"]');
    const consent = form.querySelector('input[name="sms_consent"]');

    form.addEventListener("submit", (e) => {
      const phoneValue = phone?.value?.trim();
      const consentChecked = !!consent?.checked;

      if (phoneValue && !consentChecked) {
        e.preventDefault();
        alert("Please check the SMS consent box if you include your phone number.");
        consent?.focus();
      }
    });
  }
})();ctor('form[name="contact"]');
if (form) {
  const phone = form.querySelector('input[name="phone"]');
  const consent = form.querySelector('input[name="sms_consent"]');
  form.addEventListener('submit', (e) => {
    if (phone?.value?.trim() && !consent?.checked) {
      e.preventDefault();
      alert("Please check the SMS consent box if you include your phone number.");
      consent?.focus();
    }
  });
}
})();