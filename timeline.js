// ══════════════════════════════════════════════════
//  Timeline — D3 + Natural Earth projection (2016–2026)
// ══════════════════════════════════════════════════

// ── Visit data (visitors in thousands) ──
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
    coords: [141.034977, 37.475085],
    color: "#3498db",
    visits: {
      2016: 15,   2017: 20,   2018: 28,   2019: 35,
      2020: 5,    2021: 10,   2022: 22,   2023: 30,
      2024: 38,   2025: 45,   2026: 50
    }
  },
  {
    name: "Syria",
    coords: [36.710772, 34.743585],
    color: "#fd79a8",
    visits: {
      2016: 2,    2017: 3,    2018: 5,    2019: 8,
      2020: 1,    2021: 2,    2022: 6,    2023: 10,
      2024: 14,   2025: 18,   2026: 22
    }
  },
  {
    name: "Human Safari",
    coords: [18.408751, 43.849402],
    color: "#1abc9c",
    visits: {
      2016: 60,   2017: 75,   2018: 90,   2019: 110,
      2020: 15,   2021: 35,   2022: 70,   2023: 95,
      2024: 115,  2025: 130,  2026: 140
    }
  },
  {
    name: "Capucins",
    coords: [13.3388, 38.1147],
    color: "#e84393",
    visits: {
      2016: 130,  2017: 140,  2018: 150,  2019: 160,
      2020: 30,   2021: 60,   2022: 120,  2023: 145,
      2024: 160,  2025: 175,  2026: 185
    }
  }
];

const maxVisitors = Math.max(
  ...sitesData.flatMap(s => Object.values(s.visits))
);

function formatVisits(thousands) {
  if (thousands >= 1000) return (thousands / 1000).toFixed(1) + "M";
  return thousands + "K";
}

// ── DOM refs ──
const tlMapEl = document.getElementById("timeline-map");
const tlContainer = document.getElementById("timeline-container");
const tlTooltip = document.getElementById("timeline-tooltip");

const width = tlMapEl.clientWidth;
const height = tlMapEl.clientHeight;

// ── SVG setup ──
const svg = d3.select("#timeline-map")
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet");


// ── Projection — Natural Earth ──
const projection = d3.geoNaturalEarth1()
  .scale(width / 5.8)
  .translate([width / 2, height / 2]);

const pathGen = d3.geoPath(projection);

// Layers — map (graticule + land) is inside zoomGroup and gets transformed;
// sitesGroup sits outside so bubbles/labels stay the same visual size,
// but we reposition them manually to follow the zoom transform.
const zoomGroup      = svg.append("g").attr("class", "zoom-group");
const graticuleGroup = zoomGroup.append("g").attr("class", "graticule");
const landGroup      = zoomGroup.append("g").attr("class", "land");
const sitesGroup     = svg.append("g").attr("class", "sites");
const columnsGroup   = svg.append("g").attr("class", "columns-overlay");

// ── Zoom state ──
let currentTransform = d3.zoomIdentity;
let currentZoomed = null;
let zoomSession = 0;
const ZOOM_SCALE = 6;

const pX = d => currentTransform.applyX(d.x);
const pY = d => currentTransform.applyY(d.y);

const zoomBehavior = d3.zoom()
  .scaleExtent([1, 12])
  .on("zoom", (event) => {
    currentTransform = event.transform;
    zoomGroup.attr("transform", event.transform);
    // Reposition all site elements to follow the map
    sitesGroup.selectAll("circle").attr("cx", pX).attr("cy", pY);
    sitesGroup.selectAll("text.site-label").attr("x", pX).attr("y", pY);
  });

// Apply zoom behavior but disable all default interactive handlers
// (we only want programmatic zoom triggered by clicking a site)
svg.call(zoomBehavior)
  .on("wheel.zoom", null)
  .on("mousedown.zoom", null)
  .on("dblclick.zoom", null)
  .on("touchstart.zoom", null)
  .on("touchmove.zoom", null)
  .on("touchend.zoom", null);

// Click on empty area (ocean, graticule, land) → reset zoom
svg.on("click", () => {
  if (!currentZoomed) return;
  currentZoomed = null;
  zoomSession++;
  hideColumns();
  svg.transition().duration(900).call(zoomBehavior.transform, d3.zoomIdentity);
});

function handleClick(event, d) {
  event.stopPropagation();
  if (currentZoomed === d.name) {
    currentZoomed = null;
    zoomSession++;
    hideColumns();
    svg.transition().duration(900).call(zoomBehavior.transform, d3.zoomIdentity);
    return;
  }
  hideColumns();
  currentZoomed = d.name;
  zoomSession++;
  const mySession = zoomSession;
  svg.transition().duration(900).call(
    zoomBehavior.transform,
    d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(ZOOM_SCALE)
      .translate(-d.x, -d.y)
  );
  setTimeout(() => {
    if (mySession === zoomSession && currentZoomed === d.name) showColumns(d);
  }, 900);
}

// ══════════════════════════════════════════════════
//  3D isometric columns (visits per year for zoomed site)
// ══════════════════════════════════════════════════
const ISO_ANGLE = 30 * Math.PI / 180;

function hideColumns() {
  columnsGroup.selectAll(".columns-panel")
    .interrupt()
    .transition().duration(250)
    .style("opacity", 0)
    .remove();
}

function showColumns(site) {
  hideColumns();

  // Columns emerge from the site's actual screen position after zoom
  const cx0 = pX(site);
  const cy0 = pY(site);

  const years = Array.from({ length: 11 }, (_, i) => 2016 + i);
  const maxVisits = Math.max(...years.map(y => site.visits[y]));

  // Horizontal layout: columns spread left-to-right, centered on the site
  const totalWidth = Math.min(width * 0.72, 680);
  const colSpacing = totalWidth / years.length;
  const colW = Math.min(colSpacing * 0.55, 38);
  const depth = colW * 0.5;
  const dx = depth * Math.cos(ISO_ANGLE);
  const dy = depth * Math.sin(ISO_ANGLE);

  const startX = cx0 - totalWidth / 2 + colSpacing / 2;

  // Vertical: rise upward from the site point, bounded by available space
  const maxHeight = Math.max(80, Math.min(cy0 - 70, height * 0.45));

  const baseColor = d3.color(site.color);
  const topColor = baseColor.brighter(0.6).formatHex();
  const sideColor = baseColor.darker(1.2).formatHex();

  const panel = columnsGroup.append("g")
    .attr("class", "columns-panel");

  // Swallow clicks so columns don't reset the zoom
  panel.on("click", (e) => e.stopPropagation());

  // Floating title above
  panel.append("text")
    .attr("x", cx0).attr("y", cy0 - maxHeight - 22)
    .attr("text-anchor", "middle")
    .attr("fill", site.color)
    .attr("stroke", "#000")
    .attr("stroke-width", 3)
    .attr("paint-order", "stroke")
    .style("font-family", "'Open Sans', 'Segoe UI', sans-serif")
    .style("font-size", "13px")
    .style("font-weight", 700)
    .style("letter-spacing", "0.12em")
    .text(`${site.name.toUpperCase()} — VISITS PER YEAR`);

  years.forEach((year, i) => {
    const visits = site.visits[year];
    const fullH = (visits / maxVisits) * maxHeight;
    const cx = startX + i * colSpacing;
    const x1 = cx - colW / 2;
    const x2 = cx + colW / 2;

    const g = panel.append("g")
      .attr("class", "column")
      .attr("data-year", year);

    // Ground shadow at the base (ellipse, under the column)
    g.append("ellipse")
      .attr("class", "col-shadow")
      .attr("cx", cx + dx / 2).attr("cy", cy0 + 2)
      .attr("rx", (colW + dx) / 2)
      .attr("ry", (dy + 4) / 2)
      .attr("fill", "rgba(0, 0, 0, 0.45)")
      .attr("filter", "blur(2px)")
      .style("opacity", 0);

    // Right side face (starts flat at base)
    const right = g.append("polygon")
      .attr("class", "col-right")
      .attr("fill", sideColor)
      .attr("points", `${x2},${cy0} ${x2 + dx},${cy0 - dy} ${x2 + dx},${cy0 - dy} ${x2},${cy0}`);

    // Top face (starts flat at base)
    const top = g.append("polygon")
      .attr("class", "col-top")
      .attr("fill", topColor)
      .attr("points", `${x1},${cy0} ${x2},${cy0} ${x2 + dx},${cy0 - dy} ${x1 + dx},${cy0 - dy}`);

    // Front face (starts at height 0)
    const front = g.append("rect")
      .attr("class", "col-front")
      .attr("fill", site.color)
      .attr("x", x1).attr("y", cy0)
      .attr("width", colW).attr("height", 0);

    // Year label below the column base
    g.append("text")
      .attr("class", "col-year")
      .attr("x", cx).attr("y", cy0 + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#aaa")
      .attr("stroke", "#000")
      .attr("stroke-width", 2.5)
      .attr("paint-order", "stroke")
      .style("font-family", "'Open Sans', 'Segoe UI', sans-serif")
      .style("font-size", "10px")
      .style("font-weight", 600)
      .style("font-variant-numeric", "tabular-nums")
      .style("opacity", 0)
      .text(year);

    // Value label — positioned above the full-grown top
    g.append("text")
      .attr("class", "col-value")
      .attr("x", cx + dx / 2).attr("y", cy0 - 6)
      .attr("text-anchor", "middle")
      .attr("fill", "#ccc")
      .attr("stroke", "#000")
      .attr("stroke-width", 2.5)
      .attr("paint-order", "stroke")
      .style("font-family", "'Open Sans', 'Segoe UI', sans-serif")
      .style("font-size", "9.5px")
      .style("font-weight", 600)
      .style("opacity", 0)
      .text(formatVisits(visits));

    // Staggered grow-up animation
    const delay = 60 + i * 55;
    const dur = 650;
    const ease = d3.easeCubicOut;

    front.transition().delay(delay).duration(dur).ease(ease)
      .attr("y", cy0 - fullH)
      .attr("height", fullH);

    top.transition().delay(delay).duration(dur).ease(ease)
      .attrTween("points", () => {
        const iH = d3.interpolateNumber(0, fullH);
        return (t) => {
          const h = iH(t);
          const ty = cy0 - h;
          return `${x1},${ty} ${x2},${ty} ${x2 + dx},${ty - dy} ${x1 + dx},${ty - dy}`;
        };
      });

    right.transition().delay(delay).duration(dur).ease(ease)
      .attrTween("points", () => {
        const iH = d3.interpolateNumber(0, fullH);
        return (t) => {
          const h = iH(t);
          const ty = cy0 - h;
          return `${x2},${cy0} ${x2 + dx},${cy0 - dy} ${x2 + dx},${ty - dy} ${x2},${ty}`;
        };
      });

    g.select(".col-shadow")
      .transition().delay(delay).duration(dur).style("opacity", 1);

    g.select(".col-year")
      .transition().delay(delay + 200).duration(400).style("opacity", 1);

    g.select(".col-value")
      .transition().delay(delay).duration(dur).ease(ease)
      .attr("y", cy0 - fullH - dy - 6)
      .style("opacity", 1);
  });

  updateActiveYear(+slider.value);
}

function updateActiveYear(year) {
  columnsGroup.selectAll(".columns-panel .column")
    .each(function () {
      const g = d3.select(this);
      const isActive = +g.attr("data-year") === year;
      g.select(".col-front").attr("opacity", isActive ? 1 : 0.45);
      g.select(".col-top").attr("opacity", isActive ? 1 : 0.45);
      g.select(".col-right").attr("opacity", isActive ? 1 : 0.45);
      g.select(".col-year")
        .attr("fill", isActive ? "#fff" : "#666")
        .style("font-weight", isActive ? 700 : 500);
      g.select(".col-value")
        .attr("fill", isActive ? "#fff" : "#777")
        .style("font-size", isActive ? "11px" : "9.5px")
        .style("font-weight", isActive ? 700 : 500);
    });
}

// ── Load world topology ──
d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
  .then(topology => {
    const land = topojson.feature(topology, topology.objects.land);
    const countries = topojson.feature(topology, topology.objects.countries);

    // Fit projection on the northern hemisphere area where all sites are located
    // (from Ground Zero in the west to Fukushima in the east)
    const focusArea = {
      type: "Polygon",
      coordinates: [[
        [-80, 30], [145, 30], [145, 56], [-80, 56], [-80, 30]
      ]]
    };
    projection.fitExtent([[10, 10], [width - 10, height - 200]], focusArea);

    // Graticule (subtle grid)
    const graticule = d3.geoGraticule().step([20, 20]);
    graticuleGroup.append("path")
      .datum(graticule())
      .attr("d", pathGen)
      .attr("fill", "none")
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-width", 0.5);

    // Outline of the sphere (oceans subtle outline)
    graticuleGroup.append("path")
      .datum({ type: "Sphere" })
      .attr("d", pathGen)
      .attr("fill", "none")
      .attr("stroke", "rgba(255, 255, 255, 0.08)")
      .attr("stroke-width", 0.8);

    // Countries
    landGroup.selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("d", pathGen)
      .attr("fill", "#1a1a1a")
      .attr("stroke", "#2a2a2a")
      .attr("stroke-width", 0.4);

    // Draw sites at the correct, fitted positions
    drawSites(+slider.value);
  });

// ── Draw / update site bubbles for a given year ──
function drawSites(year) {
  const data = sitesData.map(site => {
    const [x, y] = projection(site.coords);
    return {
      ...site,
      x, y,
      visitors: site.visits[year],
      radius: 3 + Math.sqrt(site.visits[year] / maxVisitors) * 22
    };
  });

  // Glow (blurred halo behind) — pointer-events none so clicks go through to dot
  sitesGroup.selectAll("circle.glow")
    .data(data, d => d.name)
    .join(
      enter => enter.append("circle")
        .attr("class", "glow")
        .attr("cx", pX).attr("cy", pY)
        .attr("fill", d => d.color)
        .attr("opacity", 0.18)
        .attr("filter", "blur(6px)")
        .attr("r", 0)
        .style("pointer-events", "none")
        .call(sel => sel.transition().duration(500).attr("r", d => d.radius * 1.6)),
      update => update
        .attr("cx", pX).attr("cy", pY)
        .transition().duration(500).attr("r", d => d.radius * 1.6)
    );

  // Main dot — clickable, zooms onto the site
  sitesGroup.selectAll("circle.dot")
    .data(data, d => d.name)
    .join(
      enter => enter.append("circle")
        .attr("class", "dot")
        .attr("cx", pX).attr("cy", pY)
        .attr("fill", d => d.color)
        .attr("fill-opacity", 0.8)
        .attr("stroke", d => d.color)
        .attr("stroke-width", 1.5)
        .attr("r", 0)
        .style("cursor", "pointer")
        .on("mousemove", handleHover)
        .on("mouseleave", handleLeave)
        .on("click", handleClick)
        .call(sel => sel.transition().duration(500).attr("r", d => d.radius)),
      update => update
        .attr("cx", pX).attr("cy", pY)
        .transition().duration(500).attr("r", d => d.radius)
    );

  // Labels
  sitesGroup.selectAll("text.site-label")
    .data(data, d => d.name)
    .join(
      enter => enter.append("text")
        .attr("class", "site-label")
        .attr("x", pX)
        .attr("y", pY)
        .attr("dy", d => d.radius + 13)
        .attr("text-anchor", "middle")
        .attr("fill", "#bbb")
        .attr("stroke", "#000")
        .attr("stroke-width", 3)
        .attr("paint-order", "stroke")
        .style("font-family", "'Open Sans', 'Segoe UI', sans-serif")
        .style("font-size", "11px")
        .style("font-weight", 600)
        .style("pointer-events", "none")
        .text(d => d.name),
      update => update
        .attr("x", pX)
        .attr("y", pY)
        .transition().duration(500).attr("dy", d => d.radius + 13)
    );
}

let hoveredSite = null;

function renderTooltip() {
  if (!hoveredSite) return;
  const year = +slider.value;
  const d = hoveredSite;
  tlTooltip.innerHTML =
    `<div class="tt-name" style="color:${d.color}">${d.name}</div>` +
    `<div class="tt-visits">${formatVisits(d.visits[year])} visitors (${year})</div>`;
  tlTooltip.classList.remove("tl-tooltip-hidden");
}

function handleHover(event, d) {
  hoveredSite = d;
  renderTooltip();
  const rect = tlContainer.getBoundingClientRect();
  tlTooltip.style.left = (event.clientX - rect.left + 15) + "px";
  tlTooltip.style.top = (event.clientY - rect.top - 10) + "px";
}

function handleLeave() {
  hoveredSite = null;
  tlTooltip.classList.add("tl-tooltip-hidden");
}

// ── Slider interaction ──
const slider = document.getElementById("year-slider");
const yearLabel = document.getElementById("slider-year-label");

slider.addEventListener("input", () => {
  const year = +slider.value;
  yearLabel.textContent = year;
  drawSites(year);
  updateVisitsList(year);
  renderTooltip();
  if (currentZoomed) updateActiveYear(year);
});

// ── Visits list (legend under the map) ──
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

function updateVisitsList(year) {
  sitesData.forEach(site => {
    const el = visitsList.querySelector(`[data-site="${site.name}"]`);
    if (el) el.textContent = formatVisits(site.visits[year]);
  });
}

// ── Slider tick marks ──
const ticksContainer = document.getElementById("slider-ticks");
for (let y = 2016; y <= 2026; y++) {
  const span = document.createElement("span");
  span.textContent = y;
  ticksContainer.appendChild(span);
}

// ── Auto-play button ──
const playBtn = document.getElementById("play-btn");
const PLAY_INTERVAL = 1000;
let playTimer = null;

function stopPlay() {
  clearInterval(playTimer);
  playTimer = null;
  playBtn.classList.remove("playing");
  playBtn.setAttribute("aria-label", "Play timeline");
}

function startPlay() {
  if (+slider.value >= +slider.max) slider.value = slider.min;
  playBtn.classList.add("playing");
  playBtn.setAttribute("aria-label", "Pause timeline");
  playTimer = setInterval(() => {
    let next = +slider.value + 1;
    if (next > +slider.max) next = +slider.min;
    slider.value = next;
    slider.dispatchEvent(new Event("input"));
  }, PLAY_INTERVAL);
}

playBtn.addEventListener("click", () => {
  if (playTimer) stopPlay();
  else startPlay();
});

slider.addEventListener("pointerdown", () => {
  if (playTimer) stopPlay();
});

// ── Auto-start when Visits section enters viewport (first time) ──
const visitsSection = document.getElementById("visits-section");
let autoStarted = false;

const visitsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !autoStarted) {
      autoStarted = true;
      startPlay();
      visitsObserver.disconnect();
    }
  });
}, { threshold: 0.35 });

visitsObserver.observe(visitsSection);
