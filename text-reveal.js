// ══════════════════════════════════════════════════
//  Text reveal — word-by-word mask animation
//  Uses Intersection Observer (vanilla JS, no GSAP)
// ══════════════════════════════════════════════════

(function () {
  // Titles to animate (skip intro .step-content ones — already handled by main.js)
  const selectors = [
    ".hero-title",
    ".vote-title",
    ".compare-title",
    ".visits-title"
  ];

  // ── Split each title into masked words ──
  const revealElements = [];

  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;

    const text = el.textContent.trim();
    const words = text.split(/\s+/);

    // Clear original text
    el.textContent = "";
    el.classList.add("text-reveal");

    words.forEach((word, i) => {
      // Wrapper acts as the mask (overflow hidden)
      const mask = document.createElement("span");
      mask.className = "word-mask";

      // Inner span slides up
      const inner = document.createElement("span");
      inner.className = "word-inner";
      inner.textContent = word;
      inner.style.transitionDelay = (i * 0.07) + "s";

      mask.appendChild(inner);
      el.appendChild(mask);

      // Add space between words
      if (i < words.length - 1) {
        const space = document.createTextNode("\u00A0");
        el.appendChild(space);
      }
    });

    revealElements.push(el);
  });

  // ── Observe each title ──
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach(el => observer.observe(el));
})();
