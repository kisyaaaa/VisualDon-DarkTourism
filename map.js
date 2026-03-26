// ── Dark Tourism locations data ──
const locations = [
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
  },
  {
    name: "Pompeii",
    coords: [14.4858, 40.7509],
    color: "#e67e22",
    description:
      "In 79 AD, Mount Vesuvius erupted and buried the Roman city of Pompeii under metres of volcanic ash. Rediscovered in the 18th century, the site offers an extraordinarily preserved snapshot of daily life in antiquity — complete with plaster casts of the victims' final moments."
  }
];

// ── Map setup ──
const mapSvg = d3.select("#map");
const mapContainer = document.getElementById("map-container");
const infoPanel = document.getElementById("info-panel");
const infoTitle = document.getElementById("info-title");
const infoText = document.getElementById("info-text");
const backBtn = document.getElementById("back-btn");

const width = mapContainer.clientWidth;
const height = mapContainer.clientHeight || window.innerHeight * 0.8;

mapSvg.attr("viewBox", `0 0 ${width} ${height}`);

const projection = d3.geoNaturalEarth1()
  .scale(width / 5.5)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

// Group that will be transformed for zoom
const g = mapSvg.append("g");

// Ocean background (click to reset)
g.append("rect")
  .attr("class", "ocean")
  .attr("width", width * 3)
  .attr("height", height * 3)
  .attr("x", -width)
  .attr("y", -height)
  .on("click", resetZoom);

// ── Load world data and draw ──
const worldUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

d3.json(worldUrl).then(world => {
  const countries = topojson.feature(world, world.objects.countries);

  // Draw countries
  g.selectAll(".country")
    .data(countries.features)
    .join("path")
    .attr("class", "country")
    .attr("d", path)
    .on("click", resetZoom);

  // Draw markers
  const markers = g.selectAll(".marker")
    .data(locations)
    .join("circle")
    .attr("class", "marker")
    .attr("cx", d => projection(d.coords)[0])
    .attr("cy", d => projection(d.coords)[1])
    .attr("r", 5)
    .attr("fill", d => d.color)
    .attr("stroke", d => d.color)
    .attr("stroke-width", 1.5)
    .on("click", (event, d) => {
      event.stopPropagation();
      zoomToLocation(d);
    });

  // Draw labels
  g.selectAll(".marker-label")
    .data(locations)
    .join("text")
    .attr("class", "marker-label")
    .attr("x", d => projection(d.coords)[0])
    .attr("y", d => projection(d.coords)[1] - 12)
    .text(d => d.name);
});

// ── Zoom to location ──
function zoomToLocation(d) {
  const [x, y] = projection(d.coords);
  const scale = 6;
  const tx = width / 2 - x * scale;
  const ty = height / 2 - y * scale;

  // Hide info panel immediately during transition
  hideInfoPanel();

  g.transition()
    .duration(1200)
    .ease(d3.easeCubicInOut)
    .attr("transform", `translate(${tx},${ty}) scale(${scale})`)
    .on("end", () => {
      showInfoPanel(d);
    });

  backBtn.classList.remove("hidden");
}

// ── Reset zoom ──
function resetZoom() {
  hideInfoPanel();

  g.transition()
    .duration(1000)
    .ease(d3.easeCubicInOut)
    .attr("transform", "translate(0,0) scale(1)");

  backBtn.classList.add("hidden");
}

backBtn.addEventListener("click", resetZoom);

// ── Info panel controls ──
function showInfoPanel(d) {
  infoTitle.textContent = d.name;
  infoText.textContent = d.description;
  infoPanel.classList.remove("hidden");
}

function hideInfoPanel() {
  infoPanel.classList.add("hidden");
}
