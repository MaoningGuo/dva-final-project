import React from "react";
import * as d3 from "d3"
import final_data from "./final_data.csv"

function createMultilineChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => parseFloat(d), // given d in data, returns the (quantitative) y-value
    title, // given d in data, returns the title text
    marginTop = 20, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 30, // the bottom margin, in pixels
    marginLeft = 40, // the left margin, in pixels
    width = 900, // the outer width of the chart, in pixels
    height = 900, // the outer height of the chart, in pixels
    xDomain, // an array of (ordinal) x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // y-scale type
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    nodeRef
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y_1 = d3.map(data, y);
    var Y=Y_1.map(d=>parseFloat(d))
    // Compute default domains, and unique the x-domain.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [d3.min(Y)-1, d3.max(Y)+1];
    xDomain = new d3.InternSet(xDomain);
    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0)
    .tickFormat((interval,i) => {return i%6 !== 0 ? " ": interval;})
    const yAxis = d3.axisLeft(yScale).ticks(6)

    // Compute titles.
    if (title === undefined) {
        const formatValue = yScale.tickFormat(100, yFormat);
        title = i => `${X[i]}\n${formatValue(Y[i])}`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }
    var svg = d3.select(nodeRef.current);
    svg.selectAll("*").remove(); // Clear svg content before adding new elements  
    var tooltip=d3.select("#tooltip")
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 15)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel))
            .style("font-size","15")

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);
//temp
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.dt); } )
        .attr("cy", function (d) { return yScale(d.Temperature); } )
        .attr("r", 4)
        .style("fill", "#ae2012")        
        .on("mouseover", function(d) {		
            d3.select(this).attr("r", 12);    
            tooltip.style("visibility","visible")
            tooltip.html("<li>Date: "+d.target.__data__.dt+ "</li><li>"  + "Temperature: </li><li>"+d.target.__data__.Temperature+" \u00B0C</li>")	
            })					
        .on("mouseout", function(d) {	
            d3.select(this).attr("r", 4); 	
            tooltip.style("visibility","hidden")	
        });

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ae2012")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { 
              return xScale(d.dt) })
          .y(function(d) { 
              return yScale(d.Temperature) })
        .curve(d3.curveNatural)
          )

//pred1
svg.append('g')
.selectAll("dot")
.data(data)
.enter()
.append("circle")
.attr("cx", function (d) { return xScale(d.dt); } )
.attr("cy", function (d) { return yScale(d.p1); } )
.attr("r", 4)
.style("fill", "#219ebc")
.on("mouseover", function(d) {	
    d3.select(this).attr("r", 12);  	  
    tooltip.style("visibility","visible")
    tooltip.html("<li>Date: "+d.target.__data__.dt+ "</li><li>"  + "SARIMAX Prediction: </li><li>"+d.target.__data__.p1+" \u00B0C</li>")	
    })					
.on("mouseout", function(d) {	
    d3.select(this).attr("r", 4);  	
    tooltip.style("visibility","hidden")	
});

svg.append("path")
.datum(data)
.attr("fill", "none")
.attr("stroke", "#219ebc")
.attr("stroke-width", 1.5)
.attr("d", d3.line()
  .x(function(d) { 
      return xScale(d.dt) })
  .y(function(d) { 
      return yScale(d.p1) })
  .curve(d3.curveNatural)
  )

  //p2
  svg.append('g')
  .selectAll("dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function (d) { return xScale(d.dt); } )
  .attr("cy", function (d) { return yScale(d.p2); } )
  .attr("r", 4)
  .style("fill", "#023047")
  .on("mouseover", function(d) {		
    d3.select(this).attr("r", 12);    
    tooltip.style("visibility","visible")
    tooltip.html("<li>Date: "+d.target.__data__.dt+ "</li><li>"  + "Historical Simulation Prediction: </li><li>"+d.target.__data__.p2+" \u00B0C</li>")	
    })					
.on("mouseout", function(d) {
    d3.select(this).attr("r", 4);  		
    tooltip.style("visibility","hidden")	
});

svg.append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "#023047")
  .attr("stroke-width", 1.5)
  .attr("d", d3.line()
    .x(function(d) { 
        return xScale(d.dt) })
    .y(function(d) { 
        return yScale(d.p2) })
    .curve(d3.curveNatural)
    )

    //p3_nn
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.dt); } )
        .attr("cy", function (d) { return yScale(d.p3_nn); } )
        .attr("r", 4)
        .style("fill", "#ffb703")
        .on("mouseover", function(d) {	
            d3.select(this).attr("r", 12);  	  
            tooltip.style("visibility","visible")
            tooltip.html("<li>Date: "+d.target.__data__.dt+ "</li><li>"  + "Neural Networks Prediction: </li><li>"+d.target.__data__.p3_nn+" \u00B0C</li>")	
            })					
        .on("mouseout", function(d) {	
            d3.select(this).attr("r", 4);  	
            tooltip.style("visibility","hidden")	
        });

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#ffb703")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { 
              return xScale(d.dt) })
          .y(function(d) { 
              return yScale(d.p3_nn) })
        .curve(d3.curveNatural)
          )
    //p3_svr
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.dt); } )
        .attr("cy", function (d) { return yScale(d.p3_svr); } )
        .attr("r", 4)
        .style("fill", "#76c893")
        .on("mouseover", function(d) {	
            d3.select(this).attr("r", 12);  	  
            tooltip.style("visibility","visible")
            tooltip.html("<li>Date: "+d.target.__data__.dt+ "</li><li>"  + "SVR Prediction: </li><li>"+d.target.__data__.p3_svr+" \u00B0C</li>")	
            })					
        .on("mouseout", function(d) {	
            d3.select(this).attr("r", 4);  	
            tooltip.style("visibility","hidden")	
        });

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#76c893")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function(d) { 
              return xScale(d.dt) })
          .y(function(d) { 
              return yScale(d.p3_svr) })
        .curve(d3.curveNatural)
          )
          svg.append("circle").attr("cx",900).attr("cy",130).attr("r", 6).style("fill", "#ae2012")
          svg.append("circle").attr("cx",900).attr("cy",160).attr("r", 6).style("fill", "#219ebc")
          svg.append("circle").attr("cx",900).attr("cy",190).attr("r", 6).style("fill", "#023047")
          svg.append("circle").attr("cx",900).attr("cy",220).attr("r", 6).style("fill", "#ffb703")
          svg.append("circle").attr("cx",900).attr("cy",250).attr("r", 6).style("fill", "#76c893")

          svg.append("text").attr("x", 920).attr("y", 130).text("Temperature")
          .style("font-size", "15px").attr("alignment-baseline","middle")

          svg.append("text").attr("x", 920).attr("y", 160).text("SARIMAX Prediction")
          .style("font-size", "15px").attr("alignment-baseline","middle")

          svg.append("text").attr("x", 920).attr("y", 190).text("Historic Simulation Prediction")
          .style("font-size", "15px").attr("alignment-baseline","middle")

          svg.append("text").attr("x", 920).attr("y", 220).text("NN Prediction")
          .style("font-size", "15px").attr("alignment-baseline","middle")

          svg.append("text").attr("x", 920).attr("y", 250).text("SVR Prediction")
          .style("font-size", "15px").attr("alignment-baseline","middle")
    return svg.node;
}

const MultilineChart = () => {
    const svgRef = React.useRef(null);
    const properties = {
        x: d => d.dt,
        y: d => d.Temperature,
        yFormat: ",",
        yLabel: "↑ Temperature (\u00B0C)",
        height: 500,
        color: "steelblue",
        nodeRef: svgRef
    }
    
    d3.csv(final_data).then((data) => {
        data=data.map(o => { return {dt: o.dt, 
            City:o.City,
            Country:o.Country,
            Temperature: (Math.round(o.Temperature * 100) / 100).toFixed(2),
            p1:(Math.round(o.Pred_M1_SARIMAX  * 100) / 100).toFixed(2),
            p2:(Math.round(o.Pred_M2_HistoricalSimulation  * 100) / 100).toFixed(2),
            p3_nn:(Math.round(o.Pred_M3_NN * 100) / 100).toFixed(2),
            p3_svr:(Math.round(o.Pred_M3_SVR * 100) / 100).toFixed(2)} })
        // console.log(data)
        var allGroup =  [...new Set(data.map(item => item.City+","+item.Country))];
        allGroup=allGroup.sort()
        console.log(allGroup)
        // add the options to the button
        d3.select("#selectButton")
        .selectAll('myOptions')
     	.data(allGroup)
        .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) 

      var dataFilter=data.filter(d=>(d.City=='Dresden' & d.Country=='Germany'))
    
    createMultilineChart(dataFilter, properties);

      function update(selectedGroup) {
        // Create new data with the selection?
        var dataFilter = data.filter(d=>(d.City==selectedGroup.split(',')[0] & d.Country==selectedGroup.split(',')[1]))

        // Give these new data to update line
        createMultilineChart(dataFilter, properties);
      }
      // When the button is changed, run the updateChart function
      d3.select("#selectButton").on("change", function(d) {
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
          // run the updateChart function with this selected option
          update(selectedOption)
      })
    })
    return (
            <svg ref={svgRef} width="1100" height="900"/>
    );
}

export default MultilineChart;
