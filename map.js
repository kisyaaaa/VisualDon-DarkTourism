// ══════════════════════════════════════════════════
//  Map scrollytelling — MapLibre GL + Dark Matter vector
//  Scroll-driven flyTo between dark tourism sites
// ══════════════════════════════════════════════════

// ── Extract src from raw iframe HTML or plain URL ──
function parseSrc(iframeHTML) {
  if (!iframeHTML) return "";
  const trimmed = iframeHTML.trim();
  if (!trimmed.includes("<")) return trimmed;
  try {
    const doc = new DOMParser().parseFromString(trimmed, "text/html");
    const iframe = doc.querySelector("iframe");
    if (iframe && iframe.src) return iframe.src;
    if (iframe) return iframe.getAttribute("src") || "";
  } catch (e) { /* fall through */ }
  const match = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  return match ? match[1].replace(/&amp;/g, "&") : "";
}

// ── Chapter configs (real lon/lat for flyTo) ──
const chapters = {
  "chapter-intro": {
    center: [15, 30], zoom: 1.2, pitch: 0, bearing: 0,
    duration: 1500, isOverview: true
  },
  "chapter-pompeii": {
    center: [14.492867, 40.749394], zoom: 6, pitch: 50, bearing: 30,
    duration: 10000, color: "#e67e22",
    iframeHTML: "https://maps.google.com/maps?layer=c&cbll=40.749394,14.492867&cbp=12,0,,0,0&output=svembed"
  },
  "chapter-groundzero": {
    center: [-74.013218, 40.711565], zoom: 6, pitch: 50, bearing: -20,
    duration: 10000, color: "#f1c40f",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774534483037!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGR1czIwSWc.!2m2!1d40.711564693124!2d-74.01321818868252!3f69.08902574789433!4f0!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-fukushima": {
    center: [141.034977, 37.475085], zoom: 6, pitch: 50, bearing: 15,
    duration: 10000, color: "#3498db",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774534704709!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzQtNHpaMmdF!2m2!1d37.47508455749013!2d141.034977425979!3f180!4f0!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-auschwitz": {
    center: [19.175795, 50.033334], zoom: 6, pitch: 50, bearing: -15,
    duration: 10000, color: "#e74c3c",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774533586615!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0UzY1RGeUFF!2m2!1d50.0333342715358!2d19.17579492789294!3f277.3361516878903!4f-5.66167044986048!5f0.9080980043266855" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-syria": {
    center: [36.710772, 34.743585], zoom: 6, pitch: 50, bearing: 10,
    duration: 10000, color: "#fd79a8",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774535021482!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQy10cjZrSlE.!2m2!1d34.74358526247496!2d36.71077160699666!3f320.75333477296635!4f4.1519859230736245!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-sarajevo": {
    center: [18.408751, 43.849402], zoom: 6, pitch: 50, bearing: -25,
    duration: 10000, color: "#1abc9c",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774534366995!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ001cFBEOUFF!2m2!1d43.84940241517754!2d18.40875058784754!3f248.96229299227994!4f0!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-chernobyl": {
    center: [30.099098, 51.389372], zoom: 6, pitch: 50, bearing: 20,
    duration: 10000, color: "#2ecc71",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774526285283!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJREstUGE2andF!2m2!1d51.38937151272082!2d30.09909818242697!3f233.5052974780426!4f7.7657774633585035!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-capucins": {
    center: [13.3388, 38.1147], zoom: 6, pitch: 50, bearing: -10,
    duration: 10000, color: "#e84393",
    iframeHTML: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d13.3388!3d38.1147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1319ef3c1862d7b9%3A0x2d1ef6100fa01c08!2sCatacombs%20of%20the%20Capuchins!5e1!3m2!1sen!2s!4v1700000000000"
  },
  "chapter-catacombes": {
    center: [2.332424, 48.833881], zoom: 6, pitch: 50, bearing: 35,
    duration: 10000, color: "#9b59b6",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774527793092!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHFpS2ZnT0E.!2m2!1d48.83388060343406!2d2.332424123902579!3f150.8931606114196!4f-7.463843123773032!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-outro": {
    center: [15, 30], zoom: 1.2, pitch: 0, bearing: 0,
    duration: 2000, isOverview: true
  }
};

// ── Marker data ──
const markerLocations = [
  { name: "Pompeii",              coords: [14.492867, 40.749394],   color: "#e67e22" },
  { name: "Ground Zero",         coords: [-74.013218, 40.711565],  color: "#f1c40f" },
  { name: "Fukushima",            coords: [141.034977, 37.475085],  color: "#3498db" },
  { name: "Auschwitz",            coords: [19.175795, 50.033334],   color: "#e74c3c" },
  { name: "Syria",                coords: [36.710772, 34.743585],   color: "#fd79a8" },
  { name: "Human Safari",         coords: [18.408751, 43.849402],   color: "#1abc9c" },
  { name: "Chernobyl",            coords: [30.099098, 51.389372],   color: "#2ecc71" },
  { name: "Capucins",             coords: [13.3388, 38.1147],       color: "#e84393" },
  { name: "Catacombes de Paris",  coords: [2.332424, 48.833881],    color: "#9b59b6" }
];

// ══════════════════════════════════════════════════
//  MapLibre GL map — Dark Matter vector basemap
// ══════════════════════════════════════════════════
const storyMap = new maplibregl.Map({
  container: "map",
  style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  center: chapters["chapter-intro"].center,
  zoom: chapters["chapter-intro"].zoom,
  pitch: 0,
  bearing: 0,
  attributionControl: false,
  interactive: false
});

// ── Set globe projection + atmosphere once style is ready ──
storyMap.on("style.load", () => {
  storyMap.setProjection({ type: "globe" });

  storyMap.setSky({
    "sky-color": "#0a0a0a",
    "horizon-color": "#111",
    "fog-color": "#0a0a0a",
    "fog-ground-blend": 0.8,
    "horizon-fog-blend": 0.5,
    "sky-horizon-blend": 0.5
  });
});

// ── Add GeoJSON markers once map loads ──
storyMap.on("load", () => {
  // Build GeoJSON from marker data
  const markersGeoJSON = {
    type: "FeatureCollection",
    features: markerLocations.map(loc => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: loc.coords },
      properties: { name: loc.name, color: loc.color }
    }))
  };

  storyMap.addSource("story-markers", { type: "geojson", data: markersGeoJSON });

  // Glow layer (larger, blurred)
  storyMap.addLayer({
    id: "markers-glow",
    type: "circle",
    source: "story-markers",
    paint: {
      "circle-radius": 14,
      "circle-color": ["get", "color"],
      "circle-opacity": 0.2,
      "circle-blur": 1
    }
  });

  // Main dot
  storyMap.addLayer({
    id: "markers-dot",
    type: "circle",
    source: "story-markers",
    paint: {
      "circle-radius": 6,
      "circle-color": ["get", "color"],
      "circle-opacity": 0.95,
      "circle-stroke-width": 1.5,
      "circle-stroke-color": "#fff"
    }
  });

  // Name labels
  storyMap.addLayer({
    id: "markers-labels",
    type: "symbol",
    source: "story-markers",
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Semibold"],
      "text-size": 11,
      "text-offset": [0, 1.8],
      "text-anchor": "top",
      "text-allow-overlap": true
    },
    paint: {
      "text-color": "#ddd",
      "text-halo-color": "#000",
      "text-halo-width": 1.5
    }
  });
});

// ══════════════════════════════════════════════════
//  Cinematic choreography (GSAP)
// ══════════════════════════════════════════════════
const svPanel = document.getElementById("streetview-panel");
const svWrapper = svPanel.querySelector(".streetview-wrapper");
const svIframe = document.getElementById("streetview-iframe");
const svClose = document.getElementById("streetview-close");
const APPEAR_BEFORE_END = 5000;
const FADE_DURATION = 1;

const allCards = document.querySelectorAll(".chapter-card");

gsap.set(allCards, { autoAlpha: 0 });
gsap.set(svWrapper, { autoAlpha: 0 });
gsap.set(svPanel, { autoAlpha: 0 });

const introCard = document.querySelector("#chapter-intro .chapter-card");
if (introCard) gsap.set(introCard, { autoAlpha: 1 });

let activeChapterId = "chapter-intro";
let session = 0;

function killEverything() {
  session++;
  gsap.killTweensOf(allCards);
  gsap.killTweensOf(svWrapper);
  gsap.killTweensOf(svPanel);
  gsap.set(allCards, { autoAlpha: 0 });
  gsap.set(svWrapper, { autoAlpha: 0 });
  gsap.set(svPanel, { autoAlpha: 0 });
  svWrapper.style.pointerEvents = "none";
  svPanel.style.pointerEvents = "none";
}

svClose.addEventListener("click", () => {
  session++;
  gsap.killTweensOf(svWrapper);
  gsap.killTweensOf(svPanel);
  gsap.to([svPanel, svWrapper], {
    autoAlpha: 0, duration: 0.3, ease: "power2.in",
    onComplete: () => {
      svWrapper.style.pointerEvents = "none";
      svPanel.style.pointerEvents = "none";
      svIframe.removeAttribute("src");
    }
  });
});

function colorChapterHeading(chapterId) {
  document.querySelectorAll(".chapter-card h3").forEach(h => { h.style.color = ""; });
  const conf = chapters[chapterId];
  if (conf && conf.color) {
    const h = document.querySelector(`#${chapterId} .chapter-card h3`);
    if (h) h.style.color = conf.color;
  }
}

// ══════════════════════════════════════════════════
//  setActiveChapter — flyTo + GSAP reveal
// ══════════════════════════════════════════════════
function setActiveChapter(chapterId) {
  if (chapterId === activeChapterId) return;
  const config = chapters[chapterId];
  if (!config) return;

  killEverything();
  const mySession = session;

  document.getElementById(activeChapterId).classList.remove("active");
  document.getElementById(chapterId).classList.add("active");
  colorChapterHeading(chapterId);
  activeChapterId = chapterId;

  const activeCard = document.querySelector(`#${chapterId} .chapter-card`);

  // Prepare Street View
  const hasStreetView = !config.isOverview && config.iframeHTML;
  if (hasStreetView) {
    svPanel.style.borderColor = config.color + "40";
    svPanel.style.boxShadow = `0 0 30px rgba(0,0,0,0.6), 0 0 15px ${config.color}20`;

    const chapterEl = document.getElementById(chapterId);
    const idx = Array.from(chapterEl.parentNode.children).indexOf(chapterEl);
    svPanel.classList.toggle("sv-left", idx % 2 !== 0);

    const rawSrc = parseSrc(config.iframeHTML);
    const sep = rawSrc.includes("?") ? "&" : "?";
    svIframe.removeAttribute("src");
    requestAnimationFrame(() => {
      if (mySession !== session) return;
      svIframe.setAttribute("src", rawSrc + sep + "_t=" + Date.now());
    });
  }

  // Fly the map to the chapter location
  storyMap.flyTo({
    center: config.center,
    zoom: config.zoom,
    pitch: config.pitch || 0,
    bearing: config.bearing || 0,
    duration: config.duration,
    essential: true
  });

  // Reveal card + SV at half the flyTo duration
  const delayMs = Math.max(0, config.duration - APPEAR_BEFORE_END);
  const revealTargets = [activeCard];
  if (hasStreetView) revealTargets.push(svPanel, svWrapper);

  setTimeout(() => {
    if (mySession !== session) return;

    if (hasStreetView) {
      svWrapper.style.pointerEvents = "auto";
      svPanel.style.pointerEvents = "auto";
    }

    gsap.to(revealTargets, {
      autoAlpha: 1,
      duration: FADE_DURATION,
      ease: "power2.out"
    });
  }, delayMs);
}

// ── IntersectionObserver ──
const chapterElements = document.querySelectorAll(".map-chapter");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveChapter(entry.target.id);
    });
  },
  { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
);

chapterElements.forEach(ch => observer.observe(ch));
