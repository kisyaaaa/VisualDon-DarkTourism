// ══════════════════════════════════════════════════════
//  Scroll Pinning — full-site sticky pages
// ══════════════════════════════════════════════════════

// ── Global scroll progress bar ──
const progressFill = document.getElementById('scroll-progress-fill');
let progressTicking = false;

function updateScrollProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
  progressFill.style.width = pct + '%';
  progressTicking = false;
}

window.addEventListener('scroll', () => {
  if (!progressTicking) {
    requestAnimationFrame(updateScrollProgress);
    progressTicking = true;
  }
}, { passive: true });

window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

// ── Inject background images from data-bg attributes ──
const bgStyleSheet = document.createElement('style');
const bgRules = [];

document.querySelectorAll('.intro-step[data-bg]').forEach((section, i) => {
  section.setAttribute('data-step-index', i);
  bgRules.push(
    `.intro-step[data-step-index="${i}"]::before { background-image: url(${section.dataset.bg}); }`
  );
});

bgStyleSheet.textContent = bgRules.join('\n');
document.head.appendChild(bgStyleSheet);

// ── Add a small progress bar to each intro pinned section ──
document.querySelectorAll('.pin-spacer--intro .intro-step').forEach(section => {
  const bar = document.createElement('div');
  bar.className = 'pin-progress';
  bar.innerHTML = '<div class="pin-progress-fill"></div>';
  section.appendChild(bar);
});

// ── Inject dynamic CSS for ::before opacity ──
const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
  .intro-step.bg-active::before {
    opacity: 1;
    transition: opacity 0.8s ease;
  }
`;
document.head.appendChild(dynamicStyle);

// ══════════════════════════════════════════════════════
//  Scroll progress engine
// ══════════════════════════════════════════════════════
//
// Every .pin-spacer gets a progress value (0→1).
// - Intro spacers (600vh): drive background + 3 image reveals
// - Hero spacer (250vh): simple hold then release
// - Page spacers (300vh): hold the interactive section in place
//
// Intro progress zones (spread over 600vh for a long, slow feel):
//
//   0.00 – 0.08  →  PAUSE: background fades in, text appears
//   0.08 – 0.28  →  Image 1 fades in
//   0.28 – 0.48  →  Image 2 fades in
//   0.48 – 0.68  →  Image 3 fades in
//   0.68 – 0.88  →  PAUSE: everything visible, breathing room
//   0.88 – 1.00  →  Section releases (sticky ends naturally)

const allSpacers = document.querySelectorAll('.pin-spacer');

function getProgress(spacer) {
  const rect = spacer.getBoundingClientRect();
  const totalTravel = spacer.offsetHeight - window.innerHeight;
  if (totalTravel <= 0) return 0;
  return Math.max(0, Math.min(1, -rect.top / totalTravel));
}

function onScroll() {
  allSpacers.forEach(spacer => {
    const progress = getProgress(spacer);

    // Intro sections: full image reveal sequence
    const introSection = spacer.querySelector('.intro-step:not(.last-step)');
    if (introSection && spacer.classList.contains('pin-spacer--intro')) {
      updateIntroSection(introSection, progress);
      return;
    }

    // Last step / transition: just fade text
    const lastStep = spacer.querySelector('.last-step');
    if (lastStep) {
      const content = lastStep.querySelector('.step-content');
      if (progress > 0.05) {
        content.classList.add('visible');
      } else {
        content.classList.remove('visible');
      }
      return;
    }

    // Hero: handled by CSS only (already visible)
  });
}

function updateIntroSection(section, progress) {
  const content = section.querySelector('.step-content');
  const images = section.querySelectorAll('.reveal-img');
  const progressFill = section.querySelector('.pin-progress-fill');

  // ── Background: fade in 0.00 → 0.08 ──
  if (progress > 0.01) {
    section.classList.add('bg-active');
  } else {
    section.classList.remove('bg-active');
  }

  // ── Text: appears early ──
  if (progress > 0.02) {
    content.classList.add('visible');
  } else {
    content.classList.remove('visible');
  }

  // ── Image reveals: staggered across 0.08–0.68 ──
  const imgZones = [
    { start: 0.08, end: 0.28 },
    { start: 0.28, end: 0.48 },
    { start: 0.48, end: 0.68 }
  ];

  images.forEach((img, i) => {
    if (i >= imgZones.length) return;
    const zone = imgZones[i];
    const imgProgress = clamp((progress - zone.start) / (zone.end - zone.start), 0, 1);
    const eased = easeOutCubic(imgProgress);

    img.style.opacity = eased;
    img.style.transform = `scale(${1.05 - 0.05 * eased})`;
  });

  // ── Progress bar ──
  if (progressFill) {
    progressFill.style.width = (progress * 100) + '%';
  }
}

// ── Utilities ──
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// ── Bind scroll listener (passive for performance) ──
window.addEventListener('scroll', onScroll, { passive: true });

// Run once on load
onScroll();
