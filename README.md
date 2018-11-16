# Poverty Rate and HealthCare
In this project, we were graphing the data using D3.js to see the relationship between the rate pf poverty and the healthcare system in different state. 
## Getting Started
### Required program
* D3.js
### Available Resources
* data.csv
* index.html
* app.js
## Project Breakdown
#### Set up the work bench in the html
Need to set up the width, height and the padding in which the SVG will be locating. 

```var svg = d3.select("#scatter")```

#### Set up the X and Y axis 
set up the location of the axes and create a function where it takes the label from the text

```svg.append("g").attr("class", "xText");```

```var xText = d3.select(".xText");```
#### Retrive data from the data source
use the d3.csv function to retrieve the data

```d3.csv("assets/data/data.csv").then(function(data)```

#### Set up the ticks 
Create the function where it creates the tick location and return only certain amount if the width of the screen is less than 500. 

```if (svgWidth <= 500) {```

#### Set up the radius of the circles
Create the variable, circleRadius and create the function in which creates the property of the circle. 
Assigning two sizes from the circle radius, if the screen is less than 530, return only 5 otherwise, will return 10

```if (svgWidth <= 530) {circleRadius = 5;}```

#### Use tooltip to indicate the information about the circle
Use the build-in function from D3, tip() 

```var tooltip = d3.tip()```

#### Manipulate the data and incorporate into the SVG 

```  var circleMain = svg.selectAll("g circleMain").data(importData).enter();```

Also include the tooltip function onto the circleMain variable to execute onto the SVG. 

### Author 
Yanin Swangrujithum 


