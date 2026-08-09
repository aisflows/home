(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const motionItems = [...document.querySelectorAll("[data-motion]")];
  const hero = document.querySelector(".hero");
  const topbar = document.querySelector(".topbar");
  const menuToggle = document.querySelector("[data-mobile-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  const syncTopbar = () => {
    topbar?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  syncTopbar();
  window.addEventListener("scroll", syncTopbar, { passive: true });

  const closeMobileMenu = (restoreFocus = false) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
    document.body.classList.remove("nav-open");
    if (restoreFocus) menuToggle.focus();
  };

  const openMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.hidden = false;
    document.body.classList.add("nav-open");
  };

  menuToggle?.addEventListener("click", () => {
    if (menuToggle.getAttribute("aria-expanded") === "true") {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenu?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a, button")) {
      closeMobileMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!mobileMenu || !menuToggle || mobileMenu.hidden) return;
    const target = event.target;
    if (target instanceof Node && !mobileMenu.contains(target) && !menuToggle.contains(target)) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu && !mobileMenu.hidden) closeMobileMenu(true);
  });

  if (reducedMotion.matches) {
    root.classList.add("motion-reduced");
    motionItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  root.classList.add("motion-active");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
    motionItems.forEach((item) => observer.observe(item));
  } else {
    motionItems.forEach((item) => item.classList.add("is-visible"));
  }

  window.setTimeout(
    () => motionItems.forEach((item) => item.classList.add("is-visible")),
    1400,
  );

  let heroFrame = 0;
  const scheduleHero = (callback) => {
    window.cancelAnimationFrame(heroFrame);
    heroFrame = window.requestAnimationFrame(callback);
  };

  hero?.addEventListener("pointermove", (event) => {
    if (!finePointer.matches) return;
    const bounds = hero.getBoundingClientRect();
    const x = (((event.clientX - bounds.left) / bounds.width) - 0.5) * 8;
    const y = (((event.clientY - bounds.top) / bounds.height) - 0.5) * 8;
    scheduleHero(() => {
      hero.style.setProperty("--signal-shift-x", `${x.toFixed(2)}px`);
      hero.style.setProperty("--signal-shift-y", `${y.toFixed(2)}px`);
    });
  });

  hero?.addEventListener("pointerleave", () => {
    hero.style.removeProperty("--signal-shift-x");
    hero.style.removeProperty("--signal-shift-y");
  });
})();
