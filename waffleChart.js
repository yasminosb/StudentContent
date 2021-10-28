//##### Waffle Chart #####
//Based on: http://bl.ocks.org/XavierGimenez/8070956

// dataArray: [{text: ... , count: ... , units: ... }]
function WaffleChart(
  dataArray,
  total,
  total_id,
  waffle_id,
  colors,
  sort,
  squareSize
) {
  var width,
    height,
    widthSquares = 10,
    heightSquares = 10,
    //squareSize = 15,
    squareValue = total / (widthSquares * heightSquares),
    gap = 1,
    theData = [];

  // if sort-option is True, sort the dataArray from highest to lowest (only used in faculty-overview)
  if (sort) {
    dataArray = dataArray.sort((a, b) => b.count - a.count);
  }
  //remap data
  dataArray.forEach(function(d, i) {
    let rounded = Math.round(d.count / squareValue);
    //d.units = rounded !== 0 ? rounded : 1;
    d.units = rounded;

    theData = theData.concat(
      Array(d.units + 1)
        .join(1)
        .split("")
        .map(function() {
          return {
            text: d.text,
            squareValue: squareValue,
            units: d.units,
            count: d.count,
            groupIndex: i
          };
        })
    );
  });

  //make sure theData has exactly 100 values
  if (theData.length < 100) {
    while (theData.length < 100) {
      theData = theData.concat(theData[theData.length - 1]);
    }
  } else if (theData.length > 100) {
    theData.length = 100;
  }

  // check last in data
  var last_dataArray = dataArray[dataArray.length - 1];
  if (last_dataArray.units > 0) {
    var last_dataArray_text = last_dataArray.text.toString();
    var last_theData = theData[theData.length - 1];
    var last_theData_text = last_theData.text.toString();
    if (last_theData_text.localeCompare(last_dataArray_text) != 0) {
      last_dataArray.squareValue = last_dataArray.value / squareValue;
      last_dataArray.groupIndex = i;
      theData[theData.length - 1] = last_dataArray;
    }
  }

  width = squareSize * widthSquares + widthSquares * gap; // + 25;
  height = squareSize * heightSquares + heightSquares * gap; // + 25;

  // ugly fix for stub waffles
  if (total != 1) {
    var total_ = d3.select("#" + total_id).text("Total: " + total);
  } else {
    var total_ = d3.select("#" + total_id).text(" - ");
  }

  //remove content before (re)drawing
  var clear = d3
    .select("#" + waffle_id)
    .selectAll("*")
    .remove();

  var waffle = d3
    .select("#" + waffle_id)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .selectAll("div")
    .data(theData)
    .enter()
    .append("rect")
    .attr("class", "wafflerect")
    .attr("width", squareSize)
    .attr("height", squareSize)
    .attr("fill", function(d) {
      return colors[d.text];
      //return color(d.groupIndex);
    })
    .attr("x", function(d, i) {
      row = i % heightSquares;
      return row * squareSize + row * gap;
    })
    .attr("y", function(d, i) {
      //group n squares for column
      col = Math.floor(i / heightSquares);
      return col * squareSize + col * gap;
    })
    .append("title")
    .text(function(d, i) {
      return d.text + " | " + ((d.count / total) * 100).toFixed(2) + "%";
    });
}

function WaffleLegend(dataArray, wafflelegend_id, colors) {
  //remove content before (re)drawing
  d3.select("#" + wafflelegend_id)
    .selectAll("*")
    .remove();

  //add legend with categorical data
  var legend = d3
    .select("#" + wafflelegend_id)
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
      return colors[d.text];
      //return color(i);
    });
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", 13)
    .text(function(d) {
      return d.text;
    });
}

function HorizontalWaffleLegend(dataArray, wafflelegend_id, colors) {
  //remove content before (re)drawing
  d3.select("#" + wafflelegend_id)
    .selectAll("*")
    .remove();

  //add legend with categorical data
  var legend = d3
    .select("#" + wafflelegend_id)
    .append("svg")
    .attr("width", 1000)
    .attr("height", 20)
    .append("g")
    .selectAll("div")
    .data(dataArray)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(" + i * 50 + "," + 0 + ")";
    });
  legend
    .append("rect")
    .attr("class", "wafflerect")
    .attr("width", 15)
    .attr("height", 15)
    .style("fill", function(d, i) {
      return colors[d.text];
      //return color(i);
    });
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", 13)
    .text(function(d) {
      return d.text;
    });
}
