(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const motionItems = [...document.querySelectorAll("[data-motion]")];
  const hero = document.querySelector(".hero");
  const proofPanel = document.querySelector(".proof-panel");
  const proofVisual = proofPanel?.querySelector(".proof-visual");

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
  let proofFrame = 0;
  const scheduleHero = (callback) => {
    window.cancelAnimationFrame(heroFrame);
    heroFrame = window.requestAnimationFrame(callback);
  };
  const scheduleProof = (callback) => {
    window.cancelAnimationFrame(proofFrame);
    proofFrame = window.requestAnimationFrame(callback);
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

  proofPanel?.addEventListener("pointermove", (event) => {
    if (!finePointer.matches) return;
    const bounds = proofPanel.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    scheduleProof(() => {
      proofPanel.style.setProperty("--proof-rotate-x", `${(-y * 3).toFixed(2)}deg`);
      proofPanel.style.setProperty("--proof-rotate-y", `${(x * 3).toFixed(2)}deg`);
      proofVisual?.style.setProperty("--proof-image-x", `${(x * 12).toFixed(2)}px`);
      proofVisual?.style.setProperty("--proof-image-y", `${(y * 12).toFixed(2)}px`);
    });
  });

  proofPanel?.addEventListener("pointerleave", () => {
    proofPanel.style.removeProperty("--proof-rotate-x");
    proofPanel.style.removeProperty("--proof-rotate-y");
    proofVisual?.style.removeProperty("--proof-image-x");
    proofVisual?.style.removeProperty("--proof-image-y");
  });
})();
