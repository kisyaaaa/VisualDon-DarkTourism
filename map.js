// ══════════════════════════════════════════════════
//  Map scrollytelling — D3 orthographic globe
//  Intro: spinning globe → zoom in → glide between sites → zoom out
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

// ── Chapter configs ──
const ZOOMED_SCALE_FACTOR = 4;

const chapters = {
  "chapter-intro": {
    center: [-20, -25],
    duration: 1500,
    isGlobe: true
  },
  "chapter-pompeii": {
    center: [-14.492867, -40.749394], duration: 2000,
    color: "#e67e22",
    iframeHTML: "https://maps.google.com/maps?layer=c&cbll=40.749394,14.492867&cbp=12,0,,0,0&output=svembed"
  },
  "chapter-groundzero": {
    center: [74.013218, -40.711565], duration: 2500,
    color: "#f1c40f",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774534483037!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRGR1czIwSWc.!2m2!1d40.711564693124!2d-74.01321818868252!3f69.08902574789433!4f0!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-fukushima": {
    center: [-141.034977, -37.475085], duration: 2500,
    color: "#3498db",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774534704709!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQzQtNHpaMmdF!2m2!1d37.47508455749013!2d141.034977425979!3f180!4f0!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-auschwitz": {
    center: [-19.175795, -50.033334], duration: 2500,
    color: "#e74c3c",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774533586615!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ0UzY1RGeUFF!2m2!1d50.0333342715358!2d19.17579492789294!3f277.3361516878903!4f-5.66167044986048!5f0.9080980043266855" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-syria": {
    center: [-36.710772, -34.743585], duration: 2000,
    color: "#fd79a8",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774535021482!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJQy10cjZrSlE.!2m2!1d34.74358526247496!2d36.71077160699666!3f320.75333477296635!4f4.1519859230736245!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-sarajevo": {
    center: [-18.408751, -43.849402], duration: 2000,
    color: "#1abc9c",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774534366995!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJQ001cFBEOUFF!2m2!1d43.84940241517754!2d18.40875058784754!3f248.96229299227994!4f0!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-chernobyl": {
    center: [-30.099098, -51.389372], duration: 2500,
    color: "#2ecc71",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774526285283!6m8!1m7!1sCAoSF0NJSE0wb2dLRUlDQWdJREstUGE2andF!2m2!1d51.38937151272082!2d30.09909818242697!3f233.5052974780426!4f7.7657774633585035!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-capucins": {
    center: [-13.3388, -38.1147], duration: 2000,
    color: "#e84393",
    iframeHTML: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000!2d13.3388!3d38.1147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1319ef3c1862d7b9%3A0x2d1ef6100fa01c08!2sCatacombs%20of%20the%20Capuchins!5e1!3m2!1sen!2s!4v1700000000000"
  },
  "chapter-catacombes": {
    center: [-2.332424, -48.833881], duration: 2000,
    color: "#9b59b6",
    iframeHTML: `<iframe src="https://www.google.com/maps/embed?pb=!4v1774527793092!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHFpS2ZnT0E.!2m2!1d48.83388060343406!2d2.332424123902579!3f150.8931606114196!4f-7.463843123773032!5f0.7820865974627469" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
  },
  "chapter-outro": {
    center: [-20, -25],
    duration: 2000,
    isGlobe: true
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
//  D3 Orthographic Globe — classic map style + country labels
// ══════════════════════════════════════════════════
const mapDiv = document.getElementById("map");
const mapW = mapDiv.clientWidth || window.innerWidth;
const mapH = mapDiv.clientHeight || window.innerHeight;
const globeRadius = Math.min(mapW, mapH) / 2.2;
const zoomedRadius = globeRadius * ZOOMED_SCALE_FACTOR;

// ── Country names (ISO numeric → name) ──
const countryNames = {
  "004":"Afghanistan","008":"Albania","012":"Algeria","024":"Angola","032":"Argentina",
  "036":"Australia","040":"Austria","050":"Bangladesh","056":"Belgium","076":"Brazil",
  "100":"Bulgaria","104":"Myanmar","116":"Cambodia","120":"Cameroon","124":"Canada",
  "144":"Sri Lanka","152":"Chile","156":"China","170":"Colombia","178":"Congo",
  "180":"DR Congo","188":"Costa Rica","191":"Croatia","192":"Cuba","196":"Cyprus",
  "203":"Czechia","208":"Denmark","218":"Ecuador","818":"Egypt","222":"El Salvador",
  "231":"Ethiopia","246":"Finland","250":"France","276":"Germany","288":"Ghana",
  "300":"Greece","320":"Guatemala","332":"Haiti","340":"Honduras","348":"Hungary",
  "356":"India","360":"Indonesia","364":"Iran","368":"Iraq","372":"Ireland",
  "376":"Israel","380":"Italy","392":"Japan","398":"Kazakhstan","404":"Kenya",
  "410":"South Korea","414":"Kuwait","418":"Laos","422":"Lebanon","434":"Libya",
  "440":"Lithuania","458":"Malaysia","484":"Mexico","496":"Mongolia","504":"Morocco",
  "508":"Mozambique","516":"Namibia","524":"Nepal","528":"Netherlands","554":"New Zealand",
  "558":"Nicaragua","566":"Nigeria","578":"Norway","586":"Pakistan","591":"Panama",
  "600":"Paraguay","604":"Peru","608":"Philippines","616":"Poland","620":"Portugal",
  "642":"Romania","643":"Russia","682":"Saudi Arabia","686":"Senegal","694":"Sierra Leone",
  "703":"Slovakia","704":"Vietnam","706":"Somalia","710":"South Africa",
  "716":"Zimbabwe","724":"Spain","729":"Sudan","752":"Sweden","756":"Switzerland",
  "760":"Syria","762":"Tajikistan","764":"Thailand","788":"Tunisia","792":"Turkey",
  "800":"Uganda","804":"Ukraine","826":"United Kingdom","840":"United States",
  "858":"Uruguay","860":"Uzbekistan","862":"Venezuela"
};

// ── Color palette for countries (classic atlas style) ──
const landColors = [
  "#c9d4a5", "#a8c686", "#d4c990", "#b5d6a7", "#d6c58e",
  "#c2d99e", "#dbd3a2", "#b8cfa0", "#d1c893", "#aed1a4",
  "#c5cfa1", "#d8ce96", "#b3c98f", "#cdd5a8", "#d3c48b"
];

const mapSvg = d3.select("#map")
  .append("svg")
  .attr("width", mapW)
  .attr("height", mapH);

const projection = d3.geoOrthographic()
  .scale(globeRadius)
  .translate([mapW / 2, mapH / 2])
  .rotate(chapters["chapter-intro"].center)
  .clipAngle(90);

const geoPath = d3.geoPath().projection(projection);

// ── SVG Gradients ──
const defs = mapSvg.append("defs");

// Atmosphere (light blue halo)
const atmosGrad = defs.append("radialGradient")
  .attr("id", "atmos-gradient")
  .attr("cx", "50%").attr("cy", "50%").attr("r", "50%");
atmosGrad.append("stop").attr("offset", "80%").attr("stop-color", "#87ceeb").attr("stop-opacity", 0);
atmosGrad.append("stop").attr("offset", "95%").attr("stop-color", "#5dade2").attr("stop-opacity", 0.25);
atmosGrad.append("stop").attr("offset", "100%").attr("stop-color", "#aed6f1").attr("stop-opacity", 0.1);

// Light 3D shading
const shadingGrad = defs.append("radialGradient")
  .attr("id", "globe-shading")
  .attr("cx", "42%").attr("cy", "38%").attr("r", "55%");
shadingGrad.append("stop").attr("offset", "0%").attr("stop-color", "#fff").attr("stop-opacity", 0.12);
shadingGrad.append("stop").attr("offset", "50%").attr("stop-color", "#fff").attr("stop-opacity", 0);
shadingGrad.append("stop").attr("offset", "100%").attr("stop-color", "#000").attr("stop-opacity", 0.2);

// ── Draw layers ──

// Atmosphere
const atmosCircle = mapSvg.append("circle")
  .attr("cx", mapW / 2).attr("cy", mapH / 2)
  .attr("r", globeRadius + 18)
  .attr("fill", "url(#atmos-gradient)");

// Ocean
const oceanCircle = mapSvg.append("circle")
  .attr("cx", mapW / 2).attr("cy", mapH / 2)
  .attr("r", globeRadius)
  .attr("fill", "#5b9bd5");

// Graticule
const graticule = d3.geoGraticule().step([15, 15]);
const graticulePath = mapSvg.append("path")
  .datum(graticule())
  .attr("d", geoPath)
  .attr("fill", "none")
  .attr("stroke", "rgba(255,255,255,0.2)")
  .attr("stroke-width", 0.3);

// Countries
const countriesGroup = mapSvg.append("g");

// Country labels
const labelsGroup = mapSvg.append("g");

// 3D shading
const shadingCircle = mapSvg.append("circle")
  .attr("cx", mapW / 2).attr("cy", mapH / 2)
  .attr("r", globeRadius)
  .attr("fill", "url(#globe-shading)")
  .style("pointer-events", "none");

// Markers
const markersGroup = mapSvg.append("g");

// ── Load world ──
d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json").then(world => {
  const countries = topojson.feature(world, world.objects.countries);

  // Countries with varied natural colors
  countriesGroup.selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("d", geoPath)
    .attr("fill", (d, i) => landColors[i % landColors.length])
    .attr("stroke", "#888")
    .attr("stroke-width", 0.4);

  // Manual centroid overrides for countries with overseas territories
  const centroidFix = {
    "250": [2.5, 46.5],       // France → mainland
    "840": [-98, 39],          // USA → continental
    "643": [90, 62],           // Russia → Siberia center
    "124": [-100, 56],         // Canada
    "528": [5.5, 52.2],        // Netherlands
    "826": [-2, 54],           // United Kingdom
    "208": [10, 56],           // Denmark → mainland
    "578": [12, 65],           // Norway
    "554": [173, -41],         // New Zealand
    "360": [118, -2],          // Indonesia
    "458": [109, 3],           // Malaysia
    "152": [-71, -35],         // Chile
    "032": [-64, -34],         // Argentina
    "076": [-52, -10],         // Brazil
    "156": [104, 35],          // China
    "356": [79, 22],           // India
    "036": [134, -25],         // Australia
    "392": [138, 36],          // Japan
    "818": [30, 27],           // Egypt
    "710": [25, -29],          // South Africa
  };

  // Country name labels
  countries.features.forEach(f => {
    const name = countryNames[f.id];
    if (!name) return;
    const centroid = centroidFix[f.id] || d3.geoCentroid(f);

    labelsGroup.append("text")
      .attr("class", "country-label")
      .attr("data-lng", centroid[0])
      .attr("data-lat", centroid[1])
      .attr("text-anchor", "middle")
      .attr("fill", "#000")
      .attr("font-size", "6.5px")
      .attr("font-weight", "600")
      .attr("letter-spacing", "0.3px")
      .style("text-shadow", "0 0 2px rgba(255,255,255,0.7), 0 0 4px rgba(255,255,255,0.4)")
      .text(name);
  });

  // Site markers
  markerLocations.forEach(loc => {
    const mg = markersGroup.append("g")
      .attr("class", "globe-marker")
      .attr("data-lng", loc.coords[0])
      .attr("data-lat", loc.coords[1]);

    mg.append("circle")
      .attr("r", 8)
      .attr("fill", loc.color)
      .attr("opacity", 0.2);

    mg.append("circle")
      .attr("r", 4)
      .attr("fill", loc.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.95);

    mg.append("text")
      .attr("y", -12)
      .attr("text-anchor", "middle")
      .attr("fill", "#111")
      .attr("font-size", "9px")
      .attr("font-weight", "700")
      .style("text-shadow", "0 0 4px rgba(255,255,255,0.9)")
      .text(loc.name);
  });

  updateGlobe();
  startAutoSpin();
});

// ── Redraw ──
function updateGlobe() {
  const currentScale = projection.scale();
  countriesGroup.selectAll("path").attr("d", geoPath);
  graticulePath.attr("d", geoPath(graticule()));

  oceanCircle.attr("r", currentScale);
  shadingCircle.attr("r", currentScale);
  atmosCircle.attr("r", currentScale + 18);

  // Country labels
  labelsGroup.selectAll(".country-label").each(function () {
    const el = d3.select(this);
    const coords = [+el.attr("data-lng"), +el.attr("data-lat")];
    const projected = projection(coords);
    const r = projection.rotate();
    const visible = d3.geoDistance(coords, [-r[0], -r[1]]) < Math.PI / 2;

    el.attr("x", projected[0])
      .attr("y", projected[1])
      .style("display", visible ? "block" : "none");
  });

  // Site markers
  markersGroup.selectAll(".globe-marker").each(function () {
    const g = d3.select(this);
    const coords = [+g.attr("data-lng"), +g.attr("data-lat")];
    const projected = projection(coords);
    const r = projection.rotate();
    const visible = d3.geoDistance(coords, [-r[0], -r[1]]) < Math.PI / 2;

    g.attr("transform", `translate(${projected[0]},${projected[1]})`)
      .style("display", visible ? "block" : "none");
  });
}

// ── Auto-spin (intro + outro) ──
let spinAnimation = null;

function startAutoSpin() {
  if (spinAnimation) return;
  const speed = 0.15;
  function spin() {
    const r = projection.rotate();
    projection.rotate([r[0] - speed, r[1]]);
    updateGlobe();
    spinAnimation = requestAnimationFrame(spin);
  }
  spinAnimation = requestAnimationFrame(spin);
}

function stopAutoSpin() {
  if (spinAnimation) {
    cancelAnimationFrame(spinAnimation);
    spinAnimation = null;
  }
}

// ── Animate: rotate + scale ──
function animateTo(config) {
  stopAutoSpin();

  const targetRotation = config.center;
  const targetScale = config.isGlobe ? globeRadius : zoomedRadius;
  const currentRotation = projection.rotate();
  const currentScale = projection.scale();

  d3.transition()
    .duration(config.duration)
    .ease(d3.easeCubicInOut)
    .tween("globe", () => {
      const interpRotation = d3.interpolate(currentRotation, targetRotation);
      const interpScale = d3.interpolate(currentScale, targetScale);
      return t => {
        projection.rotate(interpRotation(t));
        projection.scale(interpScale(t));
        updateGlobe();
      };
    })
    .on("end", () => {
      if (config.isGlobe) startAutoSpin();
    });
}

// ══════════════════════════════════════════════════
//  Cinematic choreography (GSAP)
// ══════════════════════════════════════════════════
const svPanel = document.getElementById("streetview-panel");
const svWrapper = svPanel.querySelector(".streetview-wrapper");
const svIframe = document.getElementById("streetview-iframe");
const svClose = document.getElementById("streetview-close");
const APPEAR_BEFORE_END = 1000;
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
//  setActiveChapter
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
  const hasStreetView = !config.isGlobe && config.iframeHTML;
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

  // Animate globe
  animateTo(config);

  // Reveal card + SV
  const delaySec = Math.max(0, (config.duration - APPEAR_BEFORE_END) / 1000);
  const revealTargets = [activeCard];
  if (hasStreetView) revealTargets.push(svPanel, svWrapper);

  gsap.to(revealTargets, {
    autoAlpha: 1,
    duration: FADE_DURATION,
    delay: delaySec,
    ease: "power2.out",
    onStart: () => {
      if (mySession !== session) {
        gsap.killTweensOf(revealTargets);
        gsap.set(revealTargets, { autoAlpha: 0 });
        return;
      }
      if (hasStreetView) {
        svWrapper.style.pointerEvents = "auto";
        svPanel.style.pointerEvents = "auto";
      }
    }
  });
}

// ── IntersectionObserver ──
const chapterElements = document.querySelectorAll(".map-chapter");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActiveChapter(entry.target.id);
    });
  },
  { rootMargin: "-35% 0px -35% 0px", threshold: 0.1 }
);

chapterElements.forEach(ch => observer.observe(ch));
