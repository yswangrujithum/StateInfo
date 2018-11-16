// Setup the chart Area

var svgWidth = parseInt(d3.select("#scatter").style("width"));
var svgHeight = svgWidth - svgWidth / 3.9;
var margin = 20;
var label = 110;
var padBottom = 40;
var padLeft = 40;

// Create the SVG Wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("class", "chart");

// Creating the circle
var circleRadius;
function getCircle() {
  if (svgWidth <= 530) {
    circleRadius = 5;
  }
  else {
    circleRadius = 10;
  }
}
getCircle();

// Create the X and Y axes labels

// X-Axis
svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

function xAxesText() {
  xText.attr(
    "transform",
    "translate(" +
      ((svgWidth - label) / 2 + label) +
      ", " +
      (svgHeight - margin - padBottom) +
      ")"
  );
}
xAxesText();

// Appending the text to X-axis ofthe SVG
xText.append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

// Y-Axis

var leftTextX = margin + padLeft;
var leftTextY = (svgHeight + label) / 2 - label;

svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

function yAxesText() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yAxesText();

// Appending the text to Y-Axis of the SVG
yText.append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Lacks Healthcare (%)");


// Import Data from data.csv
d3.csv("assets/data/data.csv").then(function(data) {
  figure(data);
});

// create the function
function figure(importData) {
  
  var dataX = "poverty";
  var dataY = "noHealthInsurance";

  // empty variable
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // tooltip function
  var tooltip = d3.tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(data) {
      var xKey;
      
      var state = "<div>" + data.state + "</div>";
  
      var yKey = "<div>" + dataY + ": " + data[dataY] + "%</div>";
     
      if (dataX === "poverty") {
        
        xKey = "<div>" + dataX + ": " + data[dataX] + "%</div>";
      }
      else {
        xKey = "<div>" +
          dataX +
          ": " +
          parseFloat(data[dataX]).toLocaleString("en") +
          "</div>";
      }
      return state + xKey + yKey;
    });
  svg.call(tooltip);

  // Chart styling

  function xChange() {
    xMin = d3.min(importData, function(data) {
      return parseFloat(data[dataX]) * 0.90;
    });

    xMax = d3.max(importData, function(data) {
      return parseFloat(data[dataX]) * 1.10;
    });
  }

  function yChange() {
    yMin = d3.min(importData, function(data) {
      return parseFloat(data[dataY]) * 0.90;
    });

    yMax = d3.max(importData, function(data) {
      return parseFloat(data[dataY]) * 1.10;
    });
  }
  
  xChange();
  yChange();

  // Create Scales

  var xLinearScale = d3.scaleLinear()
    .domain([xMin, xMax])
    .range([margin + label, svgWidth - margin]);
  var yLinearScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([svgHeight - margin - label, margin]);

  
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  
  function tickLocation() {
    if (svgWidth <= 500) {
      bottomAxis.ticks(5);
      leftAxis.ticks(5);
    }
    else {
      bottomAxis.ticks(10);
      leftAxis.ticks(10);
    }
  }
  tickLocation();

  // Append the ticks
  svg
    .append("g")
    .call(bottomAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (svgHeight - margin - label) + ")");
  svg
    .append("g")
    .call(leftAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + label) + ", 0)");

// combining all of the data points
  var circleMain = svg.selectAll("g circleMain").data(importData).enter();

  circleMain
    .append("circle")

    .attr("cx", function(data) {
      return xLinearScale(data[dataX]);
    })
    .attr("cy", function(data) {
      return yLinearScale(data[dataY]);
    })
    .attr("r", circleRadius)
    .attr("class", function(data) {
      return "stateCircle " + data.abbr;
    })
    .on("mouseover", function(data) {
      tooltip.show(data, this);
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(data) {
      tooltip.hide(data);
      d3.select(this).style("stroke", "#e3e3e3");
    });

  circleMain
    .append("text")
    .text(function(data) {
      return data.abbr;
    })
    .attr("dx", function(data) {
      return xLinearScale(data[dataX]);
    })
    .attr("dy", function(data) {
      return yLinearScale(data[dataY]) + circleRadius / 2.5;
    })
    .attr("font-size", circleRadius)
    .attr("class", "stateText")
    .on("mouseover", function(data) {
      tooltip.show(data);
      d3.select("." + data.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(data) {
      tooltip.hide(data);
      d3.select("." + data.abbr).style("stroke", "#e3e3e3");
    });
}