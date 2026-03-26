// ══════════════════════════════════════════════════
//  Preloader — Dark Tourism
// ══════════════════════════════════════════════════

document.body.classList.add("loading");

// ── Static noise on canvas ──
const noiseCanvas = document.getElementById("noise-canvas");
const ctx = noiseCanvas.getContext("2d");

function resizeNoise() {
  // Low resolution for grainy effect + performance
  noiseCanvas.width = window.innerWidth / 4;
  noiseCanvas.height = window.innerHeight / 4;
}
resizeNoise();

let noiseRunning = true;

function drawNoise() {
  if (!noiseRunning) return;
  const w = noiseCanvas.width;
  const h = noiseCanvas.height;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const v = Math.random() * 255;
    data[i] = v;
    data[i + 1] = v;
    data[i + 2] = v;
    data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  requestAnimationFrame(drawNoise);
}

drawNoise();

// ── Percentage counter ──
const percentEl = document.getElementById("preloader-percent");
let current = 0;
const target = 100;
const duration = 2500; // ms total
const stepTime = duration / target;

const counter = setInterval(() => {
  current++;
  percentEl.textContent = current + "%";

  if (current >= target) {
    clearInterval(counter);

    // Small pause at 100% then dismiss
    setTimeout(() => {
      const preloader = document.getElementById("preloader");
      preloader.classList.add("done");
      noiseRunning = false;

      // Remove from DOM after transition
      preloader.addEventListener("transitionend", () => {
        preloader.remove();
        document.body.classList.remove("loading");
      }, { once: true });
    }, 400);
  }
}, stepTime);
