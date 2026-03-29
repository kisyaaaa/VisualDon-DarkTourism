// ══════════════════════════════════════════════════
//  Timeline — MapLibre GL bubble map (2016–2026)
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

// ── Max visitors (for radius scaling) ──
const maxVisitors = Math.max(
  ...sitesData.flatMap(s => Object.values(s.visits))
);

// ── Build GeoJSON for a given year ──
function buildGeoJSON(year) {
  return {
    type: "FeatureCollection",
    features: sitesData.map(site => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: site.coords
      },
      properties: {
        name: site.name,
        color: site.color,
        visitors: site.visits[year],
        // Radius: sqrt scale, 4px min → 40px max
        radius: 4 + Math.sqrt(site.visits[year] / maxVisitors) * 36
      }
    }))
  };
}

// ── Format visitors for display ──
function formatVisits(thousands) {
  if (thousands >= 1000) return (thousands / 1000).toFixed(1) + "M";
  return thousands + "K";
}

// ── Dark tile style (no labels) ──
const tlStyle = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png"
      ],
      tileSize: 256
    }
  },
  layers: [
    { id: "base", type: "raster", source: "carto-dark", minzoom: 0, maxzoom: 20 }
  ]
};

// ── Create MapLibre map ──
const tlMap = new maplibregl.Map({
  container: "timeline-map",
  style: tlStyle,
  center: [20, 25],
  zoom: 1.5,
  attributionControl: false,
  interactive: false  // no pan/zoom — just a data display
});

// ── Tooltip ──
const tlTooltip = document.getElementById("timeline-tooltip");
const tlContainer = document.getElementById("timeline-container");

// ── On map load: add source + layers ──
tlMap.on("load", () => {
  const initialYear = 2016;

  // GeoJSON source
  tlMap.addSource("tourisme", {
    type: "geojson",
    data: buildGeoJSON(initialYear)
  });

  // Glow layer (larger, blurred circles behind)
  tlMap.addLayer({
    id: "tourisme-glow",
    type: "circle",
    source: "tourisme",
    paint: {
      "circle-radius": ["*", ["get", "radius"], 1.6],
      "circle-color": ["get", "color"],
      "circle-opacity": 0.15,
      "circle-blur": 1
    }
  });

  // Main circle layer
  tlMap.addLayer({
    id: "tourisme-circles",
    type: "circle",
    source: "tourisme",
    paint: {
      "circle-radius": ["get", "radius"],
      "circle-color": ["get", "color"],
      "circle-opacity": 0.8,
      "circle-stroke-width": 1.5,
      "circle-stroke-color": ["get", "color"],
      "circle-stroke-opacity": 1,
      // Smooth transition when data changes
      "circle-radius-transition": { duration: 500, delay: 0 },
      "circle-opacity-transition": { duration: 300, delay: 0 }
    }
  });

  // Label layer
  tlMap.addLayer({
    id: "tourisme-labels",
    type: "symbol",
    source: "tourisme",
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Semibold"],
      "text-size": 11,
      "text-offset": [0, 2.2],
      "text-anchor": "top",
      "text-allow-overlap": true
    },
    paint: {
      "text-color": "#bbb",
      "text-halo-color": "#000",
      "text-halo-width": 1.5
    }
  });

  // ── Hover tooltip ──
  tlMap.on("mousemove", "tourisme-circles", (e) => {
    if (!e.features.length) return;
    const props = e.features[0].properties;
    const year = +document.getElementById("year-slider").value;

    tlTooltip.innerHTML =
      `<div class="tt-name" style="color:${props.color}">${props.name}</div>` +
      `<div class="tt-visits">${formatVisits(props.visitors)} visitors (${year})</div>`;
    tlTooltip.classList.remove("tl-tooltip-hidden");

    const rect = tlContainer.getBoundingClientRect();
    tlTooltip.style.left = (e.originalEvent.clientX - rect.left + 15) + "px";
    tlTooltip.style.top = (e.originalEvent.clientY - rect.top - 10) + "px";

    tlMap.getCanvas().style.cursor = "pointer";
  });

  tlMap.on("mouseleave", "tourisme-circles", () => {
    tlTooltip.classList.add("tl-tooltip-hidden");
    tlMap.getCanvas().style.cursor = "";
  });

  // ── Slider interaction ──
  const slider = document.getElementById("year-slider");
  const yearLabel = document.getElementById("slider-year-label");

  slider.addEventListener("input", () => {
    const year = +slider.value;
    yearLabel.textContent = year;

    // Update GeoJSON → MapLibre animates circle-radius automatically
    tlMap.getSource("tourisme").setData(buildGeoJSON(year));

    // Update visits list
    updateVisitsList(year);
  });

  // ── Build visits list ──
  const visitsList = document.getElementById("visits-list");

  sitesData.forEach(site => {
    const item = document.createElement("div");
    item.className = "visit-item";
    item.innerHTML =
      `<span class="visit-dot" style="background:${site.color}"></span>` +
      `<span class="visit-name">${site.name}</span>` +
      `<span class="visit-count" data-site="${site.name}">${formatVisits(site.visits[initialYear])}</span>`;
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
});
