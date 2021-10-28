// Inspired by https://bl.ocks.org/HarryStevens/302d078a089caf5aeb13e480b86fdaeb

interesting = [
  { row: 11, column: 5 },
  { row: 103, column: 23 },
  { row: 38, column: 22 },
  { row: 40, column: 22 },
  { row: 41, column: 22 },
  { row: 107, column: 97 }
];

function CorrelationMatrix() {
  d3.select("body")
    .append("div")
    .attr("class", "tip")
    .style("display", "none");

  var data = [];
  var cols = heatmap_axes;

  d3.tsv("heatmap_data.csv", function(d) {
    return {
      column_x: d.column_x,
      column_y: d.column_y,
      correlation: parseFloat(d.correlation.replace(",", ".")),
      row: +d.row,
      column: +d.column
    };
  }).then(function(grid) {
    var extent = d3.extent(
      grid
        .map(function(d) {
          return d.correlation;
        })
        .filter(function(d) {
          return d !== 1;
        })
    );

    var rows = d3.max(grid, function(d) {
      return d.row;
    });

    var margin = { top: 20, bottom: 1, left: 1, right: 1 };

    //var dim = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);
    var dim = 678.6;

    var width = dim - margin.left - margin.right,
      height = dim - margin.top - margin.bottom;

    // Zoomed-in section
    var svg_zoom = d3
      .select("#zoom")
      .append("svg")
      .attr("width", "225")
      .attr("height", 40 + 2 * margin.top)
      .append("g")
      .attr("transform", "translate(" + 0 + ", " + margin.top + ")");

    svg_zoom
      .append("rect")
      .attr("id", "zoom_rect")
      .attr("width", "40px")
      .attr("height", "40px")
      .style("fill", "#DCDCDC");

    svg_zoom
      .append("text")
      .attr("x", 50)
      .attr("y", margin.top + 15)
      .attr("id", "zoom_value")
      .style("font-size", "40px")
      .text("...");

    // Grid
    // clear whatever was there before
    d3.select("#grid").html("");

    var svg = d3
      .select("#grid")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var padding = 0.1;

    var x = d3
      .scaleBand()
      .range([0, width])
      .paddingInner(padding)
      .domain(d3.range(1, rows + 1));

    var y = d3
      .scaleBand()
      .range([0, height])
      .paddingInner(padding)
      .domain(d3.range(1, rows + 1));

    var c = chroma
      .scale(["tomato", "white", "steelblue"])
      .domain([extent[0], 0, extent[1]]);

    svg
      .selectAll("rect")
      .data(grid, function(d) {
        return d.column_a + d.column_b;
      })
      .enter()
      .append("rect")
      .attr("class", function(d) {
        let className = interesting.filter(
          i => i.row === d.row && i.column === d.column
        ).length
          ? "gridrect interesting"
          : "gridrect";
        return className;
      })
      .attr("x", function(d) {
        return x(d.column);
      })
      .attr("y", function(d) {
        return y(d.row);
      })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function(d) {
        return c(d.correlation);
      })
      .style("opacity", 1e-6)
      .transition()
      .style("opacity", 1);

    svg.selectAll("rect");

    d3.selectAll(".gridrect")
      .on("mouseover", function(d) {
        d3.select(this).classed("selected", true);

        d3.select("#zoom_rect").style("fill", c(d.correlation));
        d3.select("#zoom_value").text(d.correlation.toFixed(2));
        d3.select("#zoom_q1").text(d.column_x.split("_").join(" "));
        d3.select("#zoom_q2").text(d.column_y.split("_").join(" "));
      })
      .on("mouseout", function() {
        d3.selectAll(".gridrect").classed("selected", false);
      });

    // legend scale
    var legend_top = 15;
    var legend_height = 15;

    var legend_svg = d3
      .select("#grid-legend")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", legend_height + legend_top)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + legend_top + ")");

    var defs = legend_svg.append("defs");

    var gradient = defs.append("linearGradient").attr("id", "linear-gradient");

    var stops = [
      { offset: 0, color: "tomato", value: extent[0] },
      { offset: 0.5, color: "white", value: 0 },
      { offset: 1, color: "steelblue", value: extent[1] }
    ];

    gradient
      .selectAll("stop")
      .data(stops)
      .enter()
      .append("stop")
      .attr("offset", function(d) {
        return 100 * d.offset + "%";
      })
      .attr("stop-color", function(d) {
        return d.color;
      });

    legend_svg
      .append("rect")
      .attr("class", "gridrect")
      .attr("width", width)
      .attr("height", legend_height)
      .style("fill", "url(#linear-gradient)");

    legend_svg
      .selectAll("text")
      .data(stops)
      .enter()
      .append("text")
      .attr("x", function(d) {
        return width * d.offset;
      })
      .attr("dy", -3)
      .style("text-anchor", function(d, i) {
        return i == 0 ? "start" : i == 1 ? "middle" : "end";
      })
      .text(function(d, i) {
        return d.value.toFixed(2) + (i == 2 ? ">" : "");
      });
  });
}
