
function stackedBarChart(data, colors, absolute = true ) {
  // Enter data (this could have been imported)

    // Add a total value for each name
    var dataTotal = data.map(d => {
      const counts = d3.entries(d.counts);
      const total = d3.sum(counts, c => c.value);
      return { name: d.name, counts, total };
    });

    dataTotal.sort( (a,b) => {
      if (a.total < b.total){
        return 1
      } else if (b.total < a.total ){
        return -1
      } else {
        return 0
      }
    });
    console.log(dataTotal)

    // create a Y scale for the data (heigth of bars)
    const scaleY = d3
    .scaleLinear()
    .range([0, 500])
    .domain([0, d3.max(dataTotal, d => d.total)]);

    // Select the figure element
    const stack = d3.select('.stack');
    stack.html("");

    // Add a div for each name
    const group = stack
    .selectAll('.group')
    .data(dataTotal)
    .enter()
    .append('div')
    .attr('class', 'group');

    // hover tooltip
    var tooltip = d3.select("body")
    	.append("div")
    	.style("position", "absolute")
    	.style("z-index", "10")
    	.style("visibility", "hidden")
    	.text("a simple tooltip")
      .attr("class", "bartooltip");


    // Add a block for each social media type
    const block = group
    .selectAll('.block')
    .data(d => d.counts.map(x => {return {total: d.total, key: x.key, value: x.value}}))
    .enter()
    .append('div')
    .attr('class', 'block')
    // And scale the height of the box based on the value
    .style('height', d => absolute ? `${scaleY(d.value)}px` : ((d.value/d.total * 500) + "px"))
    // Scale the color based on the social media type
    .style('background-color', d => colors[d.key])
    .on("mouseover", function(d){
      var percentage = (d.value / d.total * 100).toFixed(2);
      tooltip.text(percentage + "% | " + d.value);
      return tooltip.style("visibility", "visible");

    })
  	.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
  	.on("mouseout", function(){return tooltip.style("visibility", "hidden");});



    // Add a name label
    const label = group
    .append("svg")
    .style("height", '300px')
    .style("left", '143px')
    .style("position", "relative")
    .append('text')
    .text(d => d.name)
    .attr("x", 20)
    .attr("y", 20)
    .style("text-anchor", "start")
    .attr("transform", "rotate(45)");


    // Add a total count label
    const count = group
    .append('text')
    .text(d => (d.total))
    .attr('class', 'count');
}
