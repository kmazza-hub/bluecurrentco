// Mobile nav toggle + close on link click + footer year
(() => {
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (!navToggle || !mobileNav) return;

  const setOpen = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    mobileNav.hidden = !open;
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setOpen(!isOpen);
  });

  // Close menu when clicking a mobile link
  mobileNav.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.matches("a")) setOpen(false);
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();