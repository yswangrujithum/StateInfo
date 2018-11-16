// Set up the chart area

var svgWidth = parseInt(d3.select('#scatter').style('width'));
var svgHeight = svgWidth - svgWidth / 3.9;
var margin = 20;
var label = 110;
var padBottom = 40;
var padLeft = 40;

// Create the SVG wrapper

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr('class', 'chart');

// Create the label for X and Y Axes

var xTextArea = d3.select('.xTextArea');
var yTextArea = d3.select('.yTextArea');
var textX = margin + padLeft;
var textY = (svgHeight + label) / 2 - label;
svg.append('g').attr('class', 'xTextArea');
svg.append('g').attr('class', 'yTextArea')
// create the function that will transform the text in the X-axes area.

function xAxesText(){
    xTextArea.attr('transform', 'translate(' + ((svgWidth - label)/2 + label) 
    + ', '+ (svgHeight - margin - padBottom) + ')');
}
xAxesText();

function yAxesText(){
    yTextArea.attr('transform', 'translate(' + textX + ', ' + textY 
    + ')rotate(-90)');
}
yAxesText();

// Append the X-Axis label
// Poverty (%)
xTextArea.append('text')
    .attr('y', -25)
    .attr('data-name', 'poverty')
    .attr('data-axis', 'x')
    .attr('class', 'aText active x')
    .text('In Poverty (%)');

// append the Y-Axis label

// healthcare
yTextArea.append('text')
    .attr('y', 22)
    .attr('data-name', 'health')
    .attr('data-axis', 'y')
    .attr('class', 'aText active y')
    .text('Lacks Healthcare (%)');

// create circle property
var circleRadius;
function getCircle(){
    if(width <= 530){
        circleRadius = 5;
    }
    else{
        circleRadius = 10;
    }
}
// Import data from data.csv
d3.csv('data/data.csv').then(function(data) {
    figure(data);
});

function figure(importData){
    // default location 
    var dfX = 'poverty';
    var dfY = 'noHealthInsurance';
    // empty variable
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    // Tooltip
    var tooltip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([40, -60])
        .html(function(data){
            console.log(data)
            var xKey;
            var state = '<div>' + data.state + '</div>';
            var yKey = '<div>' + dfY + ': ' + data[dfY] + '%</div>';
            if (dfX === 'poverty'){
                xKey = '<div>' + dfX + ': ' + data[dfX] + '%</div>';
            }
            else {
                xKey = '<div>' + dfX + ': ' + parseFloat(data[dfX]).toLocaleString('en') + '</div>';
            }
            return state + xKey + yKey;
        });
    svg.call(tooltip);

    // Append Axes to the chart (Add Styling)
    function xChange(){
        xMin = d3.min(importData, function(data){
            return parseFloat(data[dfX]) * 0.90;
        });

        xMax = d3.max(importData, function(data){
            return parseFloat(data[dfX]) * 1.10;
        });
    }

    function yChange(){
        yMin = d3.min(importData, function(data){
            return parseFloat(data[dfY]) * 0.90;
        });

        yMax = d3.max(importData, function(data){
            return parseFloat(data[dfY]) * 1.10;
        });
    }

    xChange();
    yChange();

    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([margin + label, svgWidth - margin]);
    var yLinearScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([svgHeight - margin - label, margin]);
    
    // Create Axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Determine X and Y ticks
    function tickCount(){
        if (svgWidth <= 500){
            bottomAxis.ticks(5);
            leftAxis.ticks(5);
        }
        else {
            bottomAxis.ticks(10);
            leftAxis.ticks(10);
        }
    }
    tickCount();

    svg.append('g')
        .call(bottomAxis)
        .attr('class', 'bottomAxis')
        .attr('trasform', 'translate(0,' + (svgHeight - margin - label) + ')');
        
    svg.append('g')
        .call(leftAxis)
        .attr('class', 'leftAxis')
        .attr('transform', 'translate(' + (margin + label) + ', 0)');

    // combining circles and labels
    var circleMain = svg.selectAll('g circleMain').data(importData).enter();

    circleMain.append('circle')
        .attr('cx', function(data){
            return xLinearScale(data[dfX]);
        })
        .attr('cy', function(data){
            return yLinearScale(data[dfY]);
        })
        .attr('r', circleRadius)
        .attr('class', function(data){
            return 'stateCircle '+ data.abbr;
        })
        .on('mouseover', function(data){
            tooltip.show(data, this);
            d3.select(this).style('stroke', '#323232')
        })
        .on('mouseout', function(data){
            tooltip.hide(data);
            d3.select(this).style('stroke', '#e3e3e3');
        });

    circleMain.append('text')
        .text(function(data){
            return data.abbr;
        })
        .attr('dx', function(data){
            return xLinearScale(data[dfX]);
        })
        .attr("dy", function(d) {
            return yLinearScale(d[dfY]) + circleRadius / 2.5;
          })
        .attr('font-size', circleRadius)
        .attr('class', 'stateText')
        .on('mouseover', function(data){
            tooltip.show(data);
            d3.select('.'+ data.abbr).style('stroke', '#323232');
        })
        .on('mouseout', function(data){
            tooltip.hide(data);
            d3.select('.'+ data.abbr).style('stroke', '#e3e3e3');
        });
}
