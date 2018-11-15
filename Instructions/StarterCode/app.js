// Set up the chart area

var svgWidth = 960;
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 50
}; 

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the SVG wrapper

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select(".chartGroup")
    .append('div')
    .attr("class", "tooltip")
    .style("opacity", 0);

// Import data from data.csv
d3.csv('data.csv', function(error, povertyData){
    if (error) throw error;

    // Format data
    povertyData.forEach(function(data){
        data.poverty =+ data.poverty;
        data.healthcare =+ data.healthcare;
    });

    // Create Scales
    var xLinearScale = d3.scaleLinear()
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
        .range([height, 0]);

    // Create Axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart (Add Styling)
        // X-Axis
    var xMin = d3.min(povertyData, function(data){
        return +data.poverty * 0.95;
    });
    var xMax = d3.max(povertyData, function(data){
        return +data.poverty * 1.05;
    });
        // Y-Axis
    var yMin = d3.min(povertyData, function(data){
        return +data.healthcare * 0.98;
    });
    var yMax = d3.max(povertyData, function(data){
        return +data.healthcare * 1.02;
    });

        //X-Axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

        // Y-Axis
    chartGroup.append('g')
        .attr('stroke', 'blue')
        .call(leftAxis);
    
    // Tooltip
    var tooltip = d3.tip()
        .attr('class', 'tooltip')
        .offset([80, -60])
        .html(function(data){
            var state = data.state;
            var p =+ data.poverty;
            var h =+ data.healthcare;
            return (state + '<br> Poverty Rate: '+ p+ '% <br> Healthcare: '+ h + '%');
        });
    chartGroup.call(tooltip);

    // Circle
    chartGroup.selectAll('circle')
        .data(povertyData)
        .enter()
        .append('circle')
        .attr('circleX', function(data, index){
            return xLinearScale(data.poverty)
        })
        .attr('circleY', function(data, index){
            return yLinearScale(data.healthcare)
        })
        .attr('radius', '10')
        .attr('fill', 'lightblue')
        .on('mouseover', function(data){
            tooltip.show(data);
        })
        .on('mouseout', function(data, index){
            tooltip.hide(data);
        });
    
        // Appending a label to each data point
        // 
    // Add Axes name and property
        //X-Axis
    chartGroup.append('text')
        .attr("y", -19)
        .attr("data-name", "poverty")
        .attr("data-axis", "x")
        .attr("class","aText active x")
        .text("In Poverty (%)");
        //Y-Axis
    chartGroup.append('text')
        .attr("y", 22)
        .attr("data-name", "healthcare")
        .attr("data-axis", "y")
        .attr("class", "aText inactive y")
        .text("Lacks Healthcare (%)");
});


// Set up the scatter plot generator
// Add Axes name 
// BONUS: dynamic scatter plot 
