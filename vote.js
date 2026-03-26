// ── Places data (mapped to CSV column names) ──
const places = [
  { name: "Pompeii",                   csvKey: "Pompei",                                  color: "#e67e22" },
  { name: "Chernobyl",                 csvKey: "Tchernobyl",                              color: "#2ecc71" },
  { name: "Auschwitz-Birkenau",        csvKey: "Auschwitz-Birkenau",                      color: "#e74c3c" },
  { name: "Catacombes de Paris",       csvKey: "Catacombes de Paris",                     color: "#9b59b6" },
  { name: "Fukushima",                 csvKey: "Fukushima",                               color: "#3498db" },
  { name: "Ground Zero",              csvKey: "11 Septembre Memorial - Ground Zero",     color: "#f1c40f" },
  { name: "Human Safari Sarajevo",    csvKey: "Human Safari de Sarajevo",                color: "#1abc9c" },
  { name: "Catacombes des Capucins",   csvKey: "Catacombes des Capucins",                 color: "#e84393" },
  { name: "Tourisme de guerre Syrie",  csvKey: "Tourisme de guerre - Syrie",              color: "#fd79a8" }
];

// ── Dimensions ──
const voteMargin = { top: 60, right: 60, bottom: 160, left: 60 };
const voteWidth = 900 - voteMargin.left - voteMargin.right;
const voteHeight = 380 - voteMargin.top - voteMargin.bottom;
const axisY = voteMargin.top + voteHeight / 2;
const circleRadius = 18;

const voteSvg = d3.select("#vote-svg")
  .attr("viewBox", `0 0 ${voteWidth + voteMargin.left + voteMargin.right} ${voteHeight + voteMargin.top + voteMargin.bottom}`);

const voteG = voteSvg.append("g")
  .attr("transform", `translate(${voteMargin.left},0)`);

// ── Scale: pixel position <-> score 1–5 ──
const xScale = d3.scaleLinear()
  .domain([1, 5])
  .range([0, voteWidth])
  .clamp(true);

// ── Draw axis line ──
voteG.append("line")
  .attr("class", "axis-line")
  .attr("x1", 0)
  .attr("x2", voteWidth)
  .attr("y1", axisY)
  .attr("y2", axisY);

// ── Tick marks at 1, 2, 3, 4, 5 ──
const ticks = [1, 2, 3, 4, 5];

voteG.selectAll(".tick-line")
  .data(ticks)
  .join("line")
  .attr("class", "tick-line")
  .attr("x1", d => xScale(d))
  .attr("x2", d => xScale(d))
  .attr("y1", axisY - 8)
  .attr("y2", axisY + 8);

voteG.selectAll(".tick-label")
  .data(ticks)
  .join("text")
  .attr("class", "tick-label")
  .attr("x", d => xScale(d))
  .attr("y", axisY + 28)
  .text(d => d);

// ── Labels at ends ──
voteG.append("text")
  .attr("class", "axis-label-left")
  .attr("x", 0)
  .attr("y", axisY - 25)
  .text("Not dark");

voteG.append("text")
  .attr("class", "axis-label-right")
  .attr("x", voteWidth)
  .attr("y", axisY - 25)
  .text("Dark");

// ── Place circles (start stacked below the axis in two rows) ──
const startY = axisY + 65;
const row2Y = axisY + 115;
const perRow = Math.ceil(places.length / 2);
const spacingRow = voteWidth / (perRow + 1);

places.forEach((d, i) => {
  const row = i < perRow ? 0 : 1;
  const col = row === 0 ? i : i - perRow;
  d.x = spacingRow * (col + 1);
  d.y = row === 0 ? startY : row2Y;
  d.placed = false;
});

// Circle groups
const placeGroups = voteG.selectAll(".place-group")
  .data(places)
  .join("g")
  .attr("class", "place-group")
  .attr("transform", d => `translate(${d.x},${d.y})`);

// Circles
placeGroups.append("circle")
  .attr("class", "place-circle")
  .attr("r", circleRadius)
  .attr("fill", d => d.color)
  .attr("stroke", d => d.color);

// Name labels below circles
placeGroups.append("text")
  .attr("class", "place-label")
  .attr("y", circleRadius + 14)
  .text(d => d.name);

// Score labels inside circles (hidden until placed)
placeGroups.append("text")
  .attr("class", "place-score")
  .attr("dy", "0.35em");

// ── Drag behavior ──
const drag = d3.drag()
  .on("start", function (event, d) {
    d3.select(this).select(".place-circle").classed("dragging", true);
    d3.select(this).raise();
  })
  .on("drag", function (event, d) {
    d.x = Math.max(0, Math.min(voteWidth, event.x));
    d.y = event.y;
    d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
  })
  .on("end", function (event, d) {
    d3.select(this).select(".place-circle").classed("dragging", false);

    d.y = axisY;
    d.x = Math.max(0, Math.min(voteWidth, d.x));
    d.placed = true;

    d3.select(this)
      .transition()
      .duration(300)
      .ease(d3.easeCubicOut)
      .attr("transform", `translate(${d.x},${d.y})`);

    const score = xScale.invert(d.x);
    d3.select(this).select(".place-score")
      .classed("visible", true)
      .text(score.toFixed(1));
  });

placeGroups.call(drag);

// ── Submit button ──
// Flag to track if user has submitted (used by compare.js)
let userHasSubmitted = false;

document.getElementById("submit-btn").addEventListener("click", () => {
  const resultsDiv = document.getElementById("vote-results");

  const results = places.map(d => ({
    name: d.name,
    score: d.placed ? +xScale.invert(d.x).toFixed(1) : null
  }));

  const allPlaced = results.every(r => r.score !== null);

  if (!allPlaced) {
    resultsDiv.innerHTML = `<h4>Please drag all places onto the scale before submitting.</h4>`;
    resultsDiv.classList.remove("hidden");
    return;
  }

  results.sort((a, b) => b.score - a.score);

  const rows = results.map(r =>
    `<div class="result-row">
      <span class="result-name">${r.name}</span>
      <span class="result-score">${r.score} / 5</span>
    </div>`
  ).join("");

  resultsDiv.innerHTML = `<h4>Your votes</h4>${rows}`;
  resultsDiv.classList.remove("hidden");

  console.log("Vote results:", results);

  // Reveal the comparison section
  userHasSubmitted = true;
  document.getElementById("compare-section").classList.remove("hidden");
});
