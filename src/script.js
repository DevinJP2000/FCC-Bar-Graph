
    //Sets the dimensions of the graph.
    let w = 1000;
    let h = 800;
    let padding = 70;

    //The local copy of data stored when data is fetched from the web.
    let dataSet

    
    //Variables used for establishing the axis.
    let xScale
    let heightScale
    let xAxisScale
    let yAxisScale
    let xAxis
    let yAxis

    //Appends the svg element to the graph.
    const svg = d3.select('#graph')
                .append("svg")
                .attr("id", "bar-graph")
                .attr("viewBox", "0 0 1000 800")


    //Fetches the data from the web then draws the graph.
      fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json")
        .then(response => response.json())
        .then(content => {
        dataSet = content.data;
         getScales();
         drawAxis();
         drawChart();
       })

    //Calculates the scales and axis for the graph.
    function getScales() {

        //Calculates the placement of the bars in the bar graph.
        xScale = d3.scaleLinear()
                          .domain([0, dataSet.length - 1])
                          .range([padding, w - padding]);
        
        //Calculates the height of the bars in the graph.
        heightScale = d3.scaleLinear()
                          .domain([0, d3.max(dataSet, (d) => d[1])])
                          .range([0, h - (2 * padding)]);

        //Calculates and defines the y-scale.
        yAxisScale = d3.scaleLinear()
                       .domain([0, d3.max(dataSet, (d) => d[1])])
                       .range([0, (2 * padding) - h]);

        //Converts the date strings into real date values for the x-axis to use.
        let dateArray = dataSet.map((data) =>{
        let dateParts = data[0].split('-')
          return new Date(dateParts[0], dateParts[1], dateParts[2])
        })
        
        //Calculates the x-axis using the minimum value of the data.
        xAxisScale = d3.scaleTime()
                        .domain([d3.min(dateArray), d3.max(dateArray)])
                        .range([padding, w - padding])
    }

//Draws the axis onto the graph.
function drawAxis() {
      //Retrieves the axis definitions from the scales calculated earlier.
      yAxis = d3.axisLeft(yAxisScale);
      xAxis = d3.axisBottom(xAxisScale);

      //Draws the y-axis and places it at the left.
      svg.append("g")
          .attr("id", "y-axis")
          .attr("transform", "translate(" + padding + ", " + (h - padding) + ")")
          .call(yAxis)
      
      //Draws the x-axis and places it at the bottom.
      svg.append("g")
          .attr("id", "x-axis")
          .attr("transform", "translate(0, " + (h - padding) + ")")
          .call(xAxis)

      //Appends a label for the x-axis to know what data its telling.
      svg.append("text")
        .attr("id", "x-axis-label")
        .attr("x", (w / 2) )
        .attr("y", (h - padding / 3) )
        .style("text-anchor", "middle")
        .text("Year");

      //Appends the y-axis label.
      svg.append("text")
        .attr("id", "y-axis-label")
        .attr("x", -h/6 + "px" )
        .attr("y", padding * 1.5 + "px" )
        .style("text-anchor", "middle")
        .text("US GDP (Billions)")
        .style("transform", "rotate(270deg)")

        //This adds the title text. 
        svg.append("text")
            .attr("id", "title")
            .attr("x", w / 2 + "px")
            .attr("y", padding / 1.5 + "px")
            .style("text-anchor", "middle")
            .text("United States GDP")
}

//Draws the chart based off of the data fetched earlier.
function drawChart() {

  //Adds the tooltip element to the graph.
  let tooltip = d3.select("#graph")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")

    //Function called when mouse is over the element. Makes the tooltip visible.
    const mouseover = () => {
      tooltip.style("visibility", "visible")
    }

    //Function called when mouse is not over any element. Makes the tooltip invisible.
    const mouseleave = () => {
      tooltip.style("visibility", "hidden")
    }

    //Function called when mouse is over a specific bar. Changes the text of the tooltip to use the bar's data values.
    const mousemove = (event, d) => {
      
      tooltip.text("In " + d[0] + ", US GDP was " + d[1])
              .style("left", (event.pageX) + "px")
              .style("top", (event.pageY) + "px")
              .attr("data-date", d[0])
              .attr("data-gdp", d[1])
              
    }

    //Adds the singular rectancle elements to the svg graph and changes their size and placement based off the dataSet's values.
    svg.selectAll("rect")
          .data(dataSet)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("data-date", (d) => d[0])
          .attr("data-gdp", (d) => d[1])
          .attr("height", (d, i) => {
            return (heightScale(d[1]));
          })
          .attr("y", (d) => h - (padding) - heightScale(d[1]))
          .attr('width', (w - (2 * padding)) / dataSet.length)
          .attr("x", (d, i) => xScale(i) )
          .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
          .on("mouseover", mouseover)
}

      
      