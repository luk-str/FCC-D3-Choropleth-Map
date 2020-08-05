// Define SVG Sizes
const w = 1200;
const h = 800;
const margin = { top: 30, right: 50, bottom: 200, left: 120 };

// Add Main SVG
const svg = d3
  .select(".map")
  .append("svg")
  .attr("class", "svg")
  .attr("width", w)
  .attr("height", h);
