function VerticalLegend(dataArray, css_id, colors) {

  //remove content before (re)drawing
  d3.select("#" + css_id)
    .selectAll("*")
    .remove();

  //add legend with categorical data
  var legend = d3
    .select("#" + css_id)
    .append("svg")
    .attr("width", 1000)
    .attr("height", dataArray.length * 20)
    .append("g")
    .selectAll("div")
    .data(dataArray)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });
  legend
    .append("rect")
    .attr("class", "wafflerect")
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", function(d, i) {
      return colors[d];
      //return color(i);
    });
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", 13)
    .text(function(d) {
      return d;
    });
}

function HorizontalLegend(dataArray, css_id, colors) {

  //remove content before (re)drawing
  d3.select("#" + css_id)
    .selectAll("*")
    .remove();

  //add legend with categorical data
  var legend = d3
    .select("#" + css_id)
    .append("svg")
    .attr("width", 1000)
    .attr("height", 20)
    .append("g")
    .selectAll("div")
    .data(dataArray)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(" + i * 50 + ", 0)";
    });
  legend
    .append("rect")
    .attr("class", "wafflerect")
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", function(d, i) {
      return colors[d];
      //return color(i);
    });
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", 13)
    .text(function(d) {
      return d;
    });
}
