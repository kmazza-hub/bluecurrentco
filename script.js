(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (toggle && mobileNav) {
    const closeNav = () => {
      mobileNav.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
    };

    const openNav = () => {
      mobileNav.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      document.body.classList.add("nav-open");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });

    mobileNav.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.matches("a")) closeNav();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // header shrink on scroll
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 24) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // reveal on scroll
  const revealItems = document.querySelectorAll(
    ".card, .hero__card, .step, .demo-card, .quote-card, .about-block__copy, .conversation .bubble, .section__head"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
})();