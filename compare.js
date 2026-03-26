// ── Comparison: User votes vs. public averages ──
// Depends on vote.js globals: places, xScale, voteWidth, axisY, circleRadius

// ── Dimensions (reuse vote dimensions) ──
const compMargin = { top: 80, right: 60, bottom: 60, left: 60 };
const compWidth = voteWidth;
const compHeight = places.length * 52 + compMargin.top + compMargin.bottom;
const compAxisY = 50;

const compSvg = d3.select("#compare-svg")
  .attr("viewBox", `0 0 ${compWidth + compMargin.left + compMargin.right} ${compHeight}`);

const compG = compSvg.append("g")
  .attr("transform", `translate(${compMargin.left},${compMargin.top})`);

// ── Shared horizontal scale (same 1–5 as vote) ──
const compXScale = d3.scaleLinear()
  .domain([1, 5])
  .range([0, compWidth])
  .clamp(true);

// ── Y scale: one row per place ──
const compYScale = d3.scaleBand()
  .domain(places.map(d => d.name))
  .range([0, places.length * 52])
  .padding(0.35);

// ── Draw horizontal axis at top ──
compG.append("line")
  .attr("class", "axis-line")
  .attr("x1", 0)
  .attr("x2", compWidth)
  .attr("y1", -20)
  .attr("y2", -20);

const compTicks = [1, 2, 3, 4, 5];

compG.selectAll(".comp-tick-line")
  .data(compTicks)
  .join("line")
  .attr("class", "tick-line")
  .attr("x1", d => compXScale(d))
  .attr("x2", d => compXScale(d))
  .attr("y1", -28)
  .attr("y2", -12);

compG.selectAll(".comp-tick-label")
  .data(compTicks)
  .join("text")
  .attr("class", "tick-label")
  .attr("x", d => compXScale(d))
  .attr("y", -35)
  .text(d => d);

compG.append("text")
  .attr("class", "axis-label-left")
  .attr("x", 0)
  .attr("y", -50)
  .text("Not dark");

compG.append("text")
  .attr("class", "axis-label-right")
  .attr("x", compWidth)
  .attr("y", -50)
  .text("Dark");

// ── Draw row backgrounds and place names ──
const rows = compG.selectAll(".comp-row")
  .data(places)
  .join("g")
  .attr("class", "comp-row")
  .attr("transform", d => `translate(0,${compYScale(d.name)})`);

// Subtle row separator lines
rows.append("line")
  .attr("class", "comp-row-line")
  .attr("x1", 0)
  .attr("x2", compWidth)
  .attr("y1", compYScale.bandwidth())
  .attr("y2", compYScale.bandwidth());

// Place name labels on the left
rows.append("text")
  .attr("class", "comp-place-name")
  .attr("x", -10)
  .attr("y", compYScale.bandwidth() / 2)
  .attr("dy", "0.35em")
  .text(d => d.name);

// ── User vote circles (start at x=0, hidden) ──
const userCircles = rows.append("circle")
  .attr("class", "comp-user-circle")
  .attr("cx", 0)
  .attr("cy", compYScale.bandwidth() / 2)
  .attr("r", 8)
  .attr("fill", d => d.color)
  .attr("stroke", d => d.color)
  .attr("stroke-width", 2)
  .attr("opacity", 0);

// User score text
const userScoreTexts = rows.append("text")
  .attr("class", "comp-score-label comp-user-score")
  .attr("y", compYScale.bandwidth() / 2 - 14)
  .attr("opacity", 0);

// ── Public average circles (start at same position, hidden) ──
const publicCircles = rows.append("circle")
  .attr("class", "comp-public-circle")
  .attr("cx", 0)
  .attr("cy", compYScale.bandwidth() / 2)
  .attr("r", 8)
  .attr("fill", "none")
  .attr("stroke", "#fff")
  .attr("stroke-width", 2)
  .attr("stroke-dasharray", "3,2")
  .attr("opacity", 0);

// Public score text
const publicScoreTexts = rows.append("text")
  .attr("class", "comp-score-label comp-public-score")
  .attr("y", compYScale.bandwidth() / 2 + 22)
  .attr("opacity", 0);

// ── Load CSV and compute averages ──
let publicAverages = {};

d3.csv("Data/reponses_forms.csv").then(raw => {
  // Clean: keep only rows where all place columns have valid numbers
  const placeKeys = places.map(d => d.csvKey);

  const cleaned = raw.filter(row => {
    return placeKeys.every(key => {
      const val = row[key];
      return val !== "" && val !== undefined && !isNaN(+val);
    });
  });

  console.log(`CSV: ${raw.length} rows loaded, ${cleaned.length} valid after cleaning`);

  // Compute average per place
  places.forEach(place => {
    const values = cleaned.map(row => +row[place.csvKey]);
    const avg = d3.mean(values);
    publicAverages[place.name] = +avg.toFixed(2);
  });

  console.log("Public averages:", publicAverages);

  // ── IntersectionObserver: animate when section scrolls into view ──
  const compareSection = document.getElementById("compare-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && userHasSubmitted) {
          animateComparison();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(compareSection);
});

// ── Animation sequence ──
function animateComparison() {
  const bandMid = compYScale.bandwidth() / 2;

  // Step 1: Show user circles at their voted positions
  userCircles
    .attr("cx", d => {
      const userScore = d.placed ? xScale.invert(d.x) : 3;
      return compXScale(userScore);
    })
    .transition()
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr("opacity", 1);

  userScoreTexts
    .attr("x", d => {
      const userScore = d.placed ? xScale.invert(d.x) : 3;
      return compXScale(userScore);
    })
    .text(d => {
      const userScore = d.placed ? +xScale.invert(d.x).toFixed(1) : "–";
      return `You: ${userScore}`;
    })
    .transition()
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr("opacity", 1);

  // Step 2: After a delay, animate public circles to their average positions
  publicCircles
    .attr("cx", d => {
      const userScore = d.placed ? xScale.invert(d.x) : 3;
      return compXScale(userScore);
    })
    .transition()
    .delay(800)
    .duration(400)
    .attr("opacity", 1)
    .transition()
    .duration(1200)
    .ease(d3.easeCubicInOut)
    .attr("cx", d => compXScale(publicAverages[d.name]));

  publicScoreTexts
    .attr("x", d => {
      const userScore = d.placed ? xScale.invert(d.x) : 3;
      return compXScale(userScore);
    })
    .text(d => `Public: ${publicAverages[d.name]}`)
    .transition()
    .delay(800)
    .duration(400)
    .attr("opacity", 1)
    .transition()
    .duration(1200)
    .ease(d3.easeCubicInOut)
    .attr("x", d => compXScale(publicAverages[d.name]));

  // Step 3: Draw connecting lines between user and public positions
  rows.each(function (d) {
    const userScore = d.placed ? xScale.invert(d.x) : 3;
    const avgScore = publicAverages[d.name];
    const x1 = compXScale(userScore);
    const x2 = compXScale(avgScore);

    d3.select(this).append("line")
      .attr("class", "comp-connector")
      .attr("x1", x1)
      .attr("x2", x1)
      .attr("y1", bandMid)
      .attr("y2", bandMid)
      .transition()
      .delay(1200)
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("x2", x2);
  });
}
