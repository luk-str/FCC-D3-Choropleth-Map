// Define SVG Sizes
const w = 1000;
const h = 700;
const margin = { top: 30, right: 50, bottom: 200, left: 120 };

// Add Main SVG
const svg = d3
  .select(".map")
  .append("svg")
  .attr("class", "svg")
  .attr("width", w)
  .attr("height", h);

fetch(
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
)
  .then((response) => response.json())
  .then(function (data) {
    // Define Geographical Data Set
    const geoData = data;

    fetch(
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
    )
      .then((response) => response.json())
      .then(function (data) {
        // Define Education Data Set
        const eduData = data;

        // Convert Topojson Data to Geojson Data
        const countiesData = topojson.feature(geoData, geoData.objects.counties)
          .features;
        const statesData = topojson.feature(geoData, geoData.objects.states)
          .features;

        // Add Map Container to SVG
        const map = svg.append("g").attr("transform", "translate(50, 50)");

        // Method to Find Corresponding Edu Data Base on County Id
        const findEduData = (d) => {
          return eduData.find((i) => {
            return i.fips === d.id;
          });
        };

        // Method to Find Education Percentage
        const findEduPercentage = (d) => {
          return findEduData(d).bachelorsOrHigher;
        };

        // Add Counties to Map
        const counties = map
          .selectAll("path")
          .data(countiesData)
          .enter()
          .append("path")
          .attr("class", "county")
          .attr("data-education", (d) => findEduPercentage(d))
          .attr("data-fips", (d) => d.id)
          .attr("d", d3.geoPath())
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.3)
          .attr("fill", (d) => {
            return `rgba(0, 100, 255, ${0 + findEduPercentage(d) * 0.012})`;
          });

        // Add States Outlines to Map
        map
          .append("g")
          .selectAll("path")
          .data(statesData)
          .enter()
          .append("path")
          .attr("d", d3.geoPath())
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);

        // Define Tooltips
        const tooltip = d3
          .select(".map")
          .append("g")
          .attr("class", "tooltip")
          .attr("id", "tooltip")
          .style("opacity", 0);

        // Add Tooltips on Mouseover
        counties
          .on("mouseover", function (d) {
            const eduData = findEduData(d);
            tooltip
              .style("opacity", 1)
              .attr("data-education", (i) =>
                findEduPercentage(d)
              ).html(`${eduData.area_name}, ${eduData.state}
              <br>
              ${eduData.bachelorsOrHigher}%`);
          })
          .on("mousemove", function (d) {
            tooltip
              .style("left", +d3.mouse(this)[0] + "px")
              .style("top", +d3.mouse(this)[1] + 60 + "px");
          })
          .on("mouseout", (d) => {
            tooltip.style("opacity", 0);
          });

        // Add Legend
        const legend = map
          .append("g")
          .attr("class", "legend")
          .attr("id", "legend")
          .attr("transform", `translate(550, 0)`);

        // Define Legend Colors
        const legendColors = [];
        for (let i = 0; i < 1; i += 0.05) {
          legendColors.push(`rgba(0, 100, 255, ${i})`);
        }

        const legendWidth = 300;

        // Define Legend Scale
        const legendScale = d3
          .scaleLinear()
          .domain([0, 100])
          .range([0, legendWidth]);

        // Add Legend Bars
        legend
          .selectAll("rect")
          .data(legendColors)
          .enter()
          .append("rect")
          .attr("width", legendWidth / legendColors.length)
          .attr("height", 30)
          .attr("x", (d, i) => (i * legendWidth) / legendColors.length)
          .attr("fill", (d) => d);

        // Add Legend Scale
        legend
          .append("g")
          .call(d3.axisTop(legendScale).tickFormat((d) => d + "%"));
      });
  });
