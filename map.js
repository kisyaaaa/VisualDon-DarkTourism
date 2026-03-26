// ══════════════════════════════════════════════════
//  Scrollytelling map — Dark Tourism locations
// ══════════════════════════════════════════════════

// ── Locations ordered for maximum travel distance ──
// Pompeii (Italy) → Fukushima (Japan) → Chernobyl (Ukraine) → Catacombes de Paris (France)
const locations = [
  {
    name: "Pompeii",
    coords: [14.4858, 40.7509],
    color: "#e67e22",
    description:
      "In 79 AD, Mount Vesuvius erupted and buried the Roman city of Pompeii under metres of volcanic ash. Rediscovered in the 18th century, the site offers an extraordinarily preserved snapshot of daily life in antiquity — complete with plaster casts of the victims' final moments."
  },
  {
    name: "Fukushima",
    coords: [141.0325, 37.4211],
    color: "#3498db",
    description:
      "On March 11, 2011, a massive earthquake and tsunami triggered a nuclear meltdown at the Fukushima Daiichi power plant. The exclusion zone remains partially closed, but guided tours now take visitors through abandoned towns frozen in time — a stark reminder of nuclear vulnerability."
  },
  {
    name: "Chernobyl",
    coords: [30.0542, 51.2763],
    color: "#2ecc71",
    description:
      "The 1986 Chernobyl disaster was the worst nuclear accident in history. The city of Pripyat was evacuated overnight, leaving behind schools, hospitals, and an amusement park that never opened. Today, the exclusion zone draws hundreds of thousands of visitors each year."
  },
  {
    name: "Catacombes de Paris",
    coords: [2.3322, 48.8339],
    color: "#9b59b6",
    description:
      "Beneath the streets of Paris lie the remains of over six million people, transferred from overflowing cemeteries in the late 18th century. The ossuary stretches for kilometres through former limestone quarries — a subterranean city of the dead at the heart of the City of Light."
  }
];

// ── Map setup ──
const mapSvg = d3.select("#map");
const mapContainer = document.getElementById("map-container");
const mapSpacer = document.querySelector(".pin-spacer--map");
const infoPanel = document.getElementById("info-panel");
const infoTitle = document.getElementById("info-title");
const infoText = document.getElementById("info-text");
const mapHeader = document.getElementById("map-header");

const mapW = 1200;
const mapH = window.innerHeight * 0.75;

mapSvg.attr("viewBox", `0 0 ${mapW} ${mapH}`);

const projection = d3.geoNaturalEarth1()
  .scale(mapW / 5.5)
  .translate([mapW / 2, mapH / 2]);

const path = d3.geoPath().projection(projection);

const g = mapSvg.append("g");

// Ocean background
g.append("rect")
  .attr("class", "ocean")
  .attr("width", mapW * 3)
  .attr("height", mapH * 3)
  .attr("x", -mapW)
  .attr("y", -mapH);

// ── Scroll zones ──
// 5 zones: world overview + 4 locations
// Each zone = ~1/5 of total scroll
const totalSteps = locations.length + 1; // 1 overview + 4 locations
const zoomScale = 5;

// Track current state to avoid re-rendering
let currentStep = -1;

// ── Load world data and draw ──
const worldUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

d3.json(worldUrl).then(world => {
  const countries = topojson.feature(world, world.objects.countries);

  g.selectAll(".country")
    .data(countries.features)
    .join("path")
    .attr("class", "country")
    .attr("d", path);

  // Draw markers
  const markerGroups = g.selectAll(".marker-group")
    .data(locations)
    .join("g")
    .attr("class", "marker-group")
    .attr("transform", d => {
      const [x, y] = projection(d.coords);
      return `translate(${x},${y})`;
    });

  // Pulsing ring
  markerGroups.append("circle")
    .attr("class", "marker-pulse")
    .attr("r", 5)
    .attr("fill", "none")
    .attr("stroke", d => d.color)
    .attr("stroke-width", 1)
    .attr("opacity", 0.4);

  // Marker dot
  markerGroups.append("circle")
    .attr("class", "marker")
    .attr("r", 5)
    .attr("fill", d => d.color)
    .attr("stroke", d => d.color)
    .attr("stroke-width", 1.5);

  // Labels
  markerGroups.append("text")
    .attr("class", "marker-label")
    .attr("y", -14)
    .text(d => d.name);

  // ── Scroll handler ──
  function onMapScroll() {
    const rect = mapSpacer.getBoundingClientRect();
    const totalTravel = mapSpacer.offsetHeight - window.innerHeight;
    if (totalTravel <= 0) return;
    const progress = Math.max(0, Math.min(1, -rect.top / totalTravel));

    // Determine which step we're on
    const stepFloat = progress * totalSteps;
    const step = Math.min(Math.floor(stepFloat), totalSteps - 1);
    const stepProgress = stepFloat - step; // 0→1 within current step

    if (step === currentStep) return;
    currentStep = step;

    if (step === 0) {
      // World overview
      goToWorldView();
    } else {
      // Zoom to location (step 1 = locations[0], etc.)
      const loc = locations[step - 1];
      goToLocation(loc);
    }
  }

  function goToWorldView() {
    g.transition()
      .duration(1200)
      .ease(d3.easeCubicInOut)
      .attr("transform", "translate(0,0) scale(1)");

    mapHeader.style.opacity = "1";
    hideInfoPanel();

    // Reset all markers
    markerGroups.select(".marker")
      .transition().duration(600)
      .attr("r", 5);
    markerGroups.select(".marker-pulse")
      .transition().duration(600)
      .attr("r", 5)
      .attr("opacity", 0.4);
  }

  function goToLocation(loc) {
    const [x, y] = projection(loc.coords);
    const tx = mapW / 2 - x * zoomScale;
    const ty = mapH / 2 - y * zoomScale;

    // Hide header
    mapHeader.style.opacity = "0";

    // Hide info panel during transition
    hideInfoPanel();

    g.transition()
      .duration(1500)
      .ease(d3.easeCubicInOut)
      .attr("transform", `translate(${tx},${ty}) scale(${zoomScale})`)
      .on("end", () => {
        showInfoPanel(loc);
      });

    // Highlight active marker, dim others
    markerGroups.each(function (d) {
      const isActive = d.name === loc.name;
      d3.select(this).select(".marker")
        .transition().duration(800)
        .attr("r", isActive ? 6 : 4);
      d3.select(this).select(".marker-pulse")
        .transition().duration(800)
        .attr("r", isActive ? 12 : 4)
        .attr("opacity", isActive ? 0.6 : 0);
    });
  }

  window.addEventListener("scroll", onMapScroll, { passive: true });
  onMapScroll();
});

// ── Info panel controls ──
function showInfoPanel(d) {
  infoTitle.textContent = d.name;
  infoTitle.style.color = d.color;
  infoText.textContent = d.description;
  infoPanel.classList.remove("hidden");
}

function hideInfoPanel() {
  infoPanel.classList.add("hidden");
}
