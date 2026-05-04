// ── Comparison: User votes vs. public averages ──
// Depends on vote.js globals: places, xScale, voteWidth, axisY, circleRadius

// ── Dimensions (reuse vote dimensions) ──
const compMargin = { top: 80, right: 60, bottom: 60, left: 60 };
const compWidth = voteWidth;
const compHeight = places.length * 85 + compMargin.top + compMargin.bottom;
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
  .range([0, places.length * 85])
  .padding(0.4);

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
  const COLLISION_PX = 130;  // when user/public are closer than this, switch to lateral layout
  const CIRCLE_R = 8;
  const LATERAL_DX = 32;     // gap between circle edge and lateral text (added on top of CIRCLE_R)

  function layoutFor(d) {
    const userScore = d.placed ? xScale.invert(d.x) : 3;
    const avgScore = publicAverages[d.name];
    const userX = compXScale(userScore);
    const avgX = compXScale(avgScore);
    const close = Math.abs(userX - avgX) < COLLISION_PX;

    if (close) {
      // Lateral: each text sits on the OUTSIDE of its own circle, both at row centre.
      // We anchor the text at the circle's centre and apply an explicit dx so it
      // never overlaps the circle.
      const userIsLeft = userX <= avgX;
      return {
        userScore, avgScore, userX, avgX,
        userTextX: userX,
        userDx:    userIsLeft ? -(CIRCLE_R + LATERAL_DX) : (CIRCLE_R + LATERAL_DX),
        userAnchor: userIsLeft ? "end" : "start",
        userY: bandMid,
        userDy: "0.35em",
        publicTextX: avgX,
        publicDx:    userIsLeft ? (CIRCLE_R + LATERAL_DX) : -(CIRCLE_R + LATERAL_DX),
        publicAnchor: userIsLeft ? "start" : "end",
        publicY: bandMid,
        publicDy: "0.35em"
      };
    }
    // Stacked: user above, public below, both centred
    return {
      userScore, avgScore, userX, avgX,
      userTextX: userX, userDx: 0, userAnchor: "middle", userY: bandMid - 18, userDy: "0",
      publicTextX: avgX, publicDx: 0, publicAnchor: "middle", publicY: bandMid + 26, publicDy: "0"
    };
  }

  // Step 1: user circles fade in at their voted positions
  userCircles
    .attr("cx", d => layoutFor(d).userX)
    .transition()
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr("opacity", 1);

  // User score text — final anchor / position set immediately, only opacity animates
  userScoreTexts
    .attr("x", d => layoutFor(d).userTextX)
    .attr("y", d => layoutFor(d).userY)
    .attr("dx", d => layoutFor(d).userDx)
    .attr("dy", d => layoutFor(d).userDy)
    .attr("text-anchor", d => layoutFor(d).userAnchor)
    .text(d => {
      const userScore = d.placed ? +xScale.invert(d.x).toFixed(1) : "–";
      return `You: ${userScore}`;
    })
    .transition()
    .duration(600)
    .ease(d3.easeCubicOut)
    .attr("opacity", 1);

  // Step 2: public circles slide from user position to public average
  publicCircles
    .attr("cx", d => layoutFor(d).userX)
    .transition()
    .delay(800)
    .duration(400)
    .attr("opacity", 1)
    .transition()
    .duration(1200)
    .ease(d3.easeCubicInOut)
    .attr("cx", d => layoutFor(d).avgX);

  publicScoreTexts
    .attr("x", d => layoutFor(d).userX)
    .attr("y", d => layoutFor(d).publicY)
    .attr("dx", d => layoutFor(d).publicDx)
    .attr("dy", d => layoutFor(d).publicDy)
    .attr("text-anchor", d => layoutFor(d).publicAnchor)
    .text(d => `Public: ${publicAverages[d.name]}`)
    .transition()
    .delay(800)
    .duration(400)
    .attr("opacity", 1)
    .transition()
    .duration(1200)
    .ease(d3.easeCubicInOut)
    .attr("x", d => layoutFor(d).publicTextX);

  // Step 3: connecting line between user and public
  rows.each(function (d) {
    const layout = layoutFor(d);
    d3.select(this).append("line")
      .attr("class", "comp-connector")
      .attr("x1", layout.userX)
      .attr("x2", layout.userX)
      .attr("y1", bandMid)
      .attr("y2", bandMid)
      .transition()
      .delay(1200)
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("x2", layout.avgX);
  });
}
