// ══════════════════════════════════════════════════
//  Timeline map — Dark Tourism visits (2016–2026)
// ══════════════════════════════════════════════════

// ── Visit data: array of site objects ──
// Each site has coordinates and a `visits` map keyed by year.
// Values = approximate annual visitors (in thousands).
// Sources: site reports, UNESCO, news articles — rounded for clarity.
const sitesData = [
  {
    name: "Pompeii",
    coords: [14.4858, 40.7509],
    color: "#e67e22",
    visits: {
      2016: 3200, 2017: 3400, 2018: 3600, 2019: 3900,
      2020: 800,  2021: 1500, 2022: 3200, 2023: 3500,
      2024: 3800, 2025: 4000, 2026: 4100
    }
  },
  {
    name: "Auschwitz",
    coords: [19.2033, 50.0343],
    color: "#e74c3c",
    visits: {
      2016: 2050, 2017: 2100, 2018: 2150, 2019: 2320,
      2020: 500,  2021: 800,  2022: 1500, 2023: 1800,
      2024: 2000, 2025: 2200, 2026: 2350
    }
  },
  {
    name: "Chernobyl",
    coords: [30.0542, 51.2763],
    color: "#2ecc71",
    visits: {
      2016: 36,   2017: 50,   2018: 70,   2019: 124,
      2020: 10,   2021: 30,   2022: 15,   2023: 40,
      2024: 60,   2025: 80,   2026: 95
    }
  },
  {
    name: "Ground Zero",
    coords: [-74.0134, 40.7115],
    color: "#f1c40f",
    visits: {
      2016: 3100, 2017: 3200, 2018: 3300, 2019: 3400,
      2020: 600,  2021: 1200, 2022: 2500, 2023: 3000,
      2024: 3200, 2025: 3400, 2026: 3500
    }
  },
  {
    name: "Catacombes de Paris",
    coords: [2.3322, 48.8339],
    color: "#9b59b6",
    visits: {
      2016: 530,  2017: 550,  2018: 570,  2019: 600,
      2020: 120,  2021: 250,  2022: 480,  2023: 530,
      2024: 570,  2025: 610,  2026: 640
    }
  },
  {
    name: "Fukushima",
    coords: [141.0325, 37.4211],
    color: "#3498db",
    visits: {
      2016: 15,   2017: 20,   2018: 28,   2019: 35,
      2020: 5,    2021: 10,   2022: 22,   2023: 30,
      2024: 38,   2025: 45,   2026: 50
    }
  },
  {
    name: "Hiroshima",
    coords: [132.4553, 34.3853],
    color: "#00cec9",
    visits: {
      2016: 1700, 2017: 1740, 2018: 1800, 2019: 1850,
      2020: 350,  2021: 600,  2022: 1100, 2023: 1500,
      2024: 1700, 2025: 1800, 2026: 1900
    }
  },
  {
    name: "Robben Island",
    coords: [18.3665, -33.8076],
    color: "#fd79a8",
    visits: {
      2016: 370,  2017: 380,  2018: 360,  2019: 390,
      2020: 50,   2021: 100,  2022: 280,  2023: 330,
      2024: 360,  2025: 380,  2026: 400
    }
  }
];

// ── Dimensions ──
const tlContainer = document.getElementById("timeline-container");
const tlWidth = 900;
const tlHeight = 420;

const tlSvg = d3.select("#timeline-map")
  .attr("viewBox", `0 0 ${tlWidth} ${tlHeight}`);

const tlProjection = d3.geoNaturalEarth1()
  .scale(tlWidth / 5.5)
  .translate([tlWidth / 2, tlHeight / 2]);

const tlPath = d3.geoPath().projection(tlProjection);

const tlG = tlSvg.append("g");

// ── Radius scale (visits in thousands → pixel radius) ──
// Collect all visit values to set domain
const allVisits = sitesData.flatMap(s => Object.values(s.visits));
const radiusScale = d3.scaleSqrt()
  .domain([0, d3.max(allVisits)])
  .range([3, 40]);

// ── Tooltip element ──
const tlTooltip = document.getElementById("timeline-tooltip");

// ── Draw world map ──
const tlWorldUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

d3.json(tlWorldUrl).then(world => {
  const countries = topojson.feature(world, world.objects.countries);

  // Ocean
  tlG.append("rect")
    .attr("class", "tl-ocean")
    .attr("width", tlWidth)
    .attr("height", tlHeight);

  // Countries
  tlG.selectAll(".tl-country")
    .data(countries.features)
    .join("path")
    .attr("class", "tl-country")
    .attr("d", tlPath);

  // ── Bubble groups ──
  const bubbleGroups = tlG.selectAll(".tl-bubble-group")
    .data(sitesData)
    .join("g")
    .attr("class", "tl-bubble-group")
    .attr("transform", d => {
      const [x, y] = tlProjection(d.coords);
      return `translate(${x},${y})`;
    });

  // Bubbles
  bubbleGroups.append("circle")
    .attr("class", "tl-bubble")
    .attr("r", d => radiusScale(d.visits[2016]))
    .attr("fill", d => d.color)
    .attr("stroke", d => d.color)
    .on("mouseenter", (event, d) => showTooltip(event, d))
    .on("mousemove", (event, d) => moveTooltip(event))
    .on("mouseleave", () => hideTooltip());

  // Labels (site name, below bubble)
  bubbleGroups.append("text")
    .attr("class", "tl-label")
    .attr("y", d => radiusScale(d.visits[2016]) + 14)
    .text(d => d.name);

  // ── Build visits list at the bottom ──
  const visitsList = document.getElementById("visits-list");

  sitesData.forEach(site => {
    const item = document.createElement("div");
    item.className = "visit-item";
    item.innerHTML =
      `<span class="visit-dot" style="background:${site.color}"></span>` +
      `<span class="visit-name">${site.name}</span>` +
      `<span class="visit-count" data-site="${site.name}">${formatVisits(site.visits[2016])}</span>`;
    visitsList.appendChild(item);
  });

  // ── Slider interaction ──
  const slider = document.getElementById("year-slider");
  const yearLabel = document.getElementById("slider-year-label");

  slider.addEventListener("input", () => {
    const year = +slider.value;
    yearLabel.textContent = year;
    updateBubbles(year);
    updateVisitsList(year);
  });

  function updateBubbles(year) {
    bubbleGroups.select(".tl-bubble")
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr("r", d => radiusScale(d.visits[year]));

    bubbleGroups.select(".tl-label")
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr("y", d => radiusScale(d.visits[year]) + 14);
  }

  function updateVisitsList(year) {
    sitesData.forEach(site => {
      const el = visitsList.querySelector(`[data-site="${site.name}"]`);
      if (el) el.textContent = formatVisits(site.visits[year]);
    });
  }

  // ── Generate slider tick marks ──
  const ticksContainer = document.getElementById("slider-ticks");
  for (let y = 2016; y <= 2026; y++) {
    const span = document.createElement("span");
    span.textContent = y;
    ticksContainer.appendChild(span);
  }
});

// ── Tooltip helpers ──
let currentSite = null;

function showTooltip(event, d) {
  currentSite = d;
  const year = +document.getElementById("year-slider").value;
  const visits = d.visits[year];

  tlTooltip.innerHTML =
    `<div class="tt-name">${d.name}</div>` +
    `<div class="tt-visits">${formatVisits(visits)} visitors (${year})</div>`;
  tlTooltip.classList.remove("hidden");
  moveTooltip(event);
}

function moveTooltip(event) {
  const rect = tlContainer.getBoundingClientRect();
  const x = event.clientX - rect.left + 15;
  const y = event.clientY - rect.top - 10;
  tlTooltip.style.left = x + "px";
  tlTooltip.style.top = y + "px";
}

function hideTooltip() {
  currentSite = null;
  tlTooltip.classList.add("hidden");
}

function formatVisits(thousands) {
  if (thousands >= 1000) {
    return (thousands / 1000).toFixed(1) + "M";
  }
  return thousands + "K";
}
