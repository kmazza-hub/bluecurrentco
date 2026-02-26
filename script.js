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
})();