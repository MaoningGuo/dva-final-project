import React from "react";
import * as d3 from "d3"

import alphabets from "./alphabet.csv"
import final_data from "./final_data.csv"

function createMultilineChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    title, // given d in data, returns the title text
    marginTop = 20, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 30, // the bottom margin, in pixels
    marginLeft = 40, // the left margin, in pixels
    width = 1200, // the outer width of the chart, in pixels
    height = 900, // the outer height of the chart, in pixels
    xDomain, // an array of (ordinal) x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // y-scale type
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    color = "currentColor", // bar fill color
    nodeRef
} = {}) {
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
       // Compute default domains, and unique the x-domain.
       if (xDomain === undefined) xDomain = X;
       if (yDomain === undefined) yDomain = [d3.min(Y), d3.max(Y)];
       xDomain = new d3.InternSet(xDomain);
       console.log("xDomain")
       console.log(xDomain)
       //console.log(X);
       //console.log(Y);
       //console.log(yRange);
       console.log("yDomain is");
       console.log(yDomain);
       const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
       const yScale = yType(yDomain, yRange);
       const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
       const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
       if (title === undefined) {
        const formatValue = yScale.tickFormat(100, yFormat);
        title = i => `${X[i]}\n${formatValue(Y[i])}`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }
    var svg = d3.select(nodeRef.current);
    svg.selectAll("*").remove(); 
    svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel));


    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d[0]); } )
        .attr("cy", function (d) { return yScale(d[1]); } )
        .attr("r", 2)
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", "#CC0000");

    return svg.node;
}



const MultilineChart = () => {
    const svgRef = React.useRef(null);
    const properties = {
        x: d => d.dt,
        y: d => d.Temperature,
        yFormat: ",",
        yLabel: "↑ Temperature",
        height: 500,
        color: "steelblue",
        nodeRef: svgRef
    }
    d3.csv(final_data).then((data) => {
        // console.log(data)
        data=data.filter(d=>(d.City=='Dresden' & d.Country=='Germany'))
        data=data.map(o => { return {dt: o.dt, Temperature: o.Temperature} })
        
        //data=data.map(o => { return {dt: o.letter, Temperature: o.frequency} })
        //console.log(data)
        createMultilineChart(data.splice(0,24), properties);
    })

    return (
            <svg ref={svgRef} width="1200" height="900"/>
    );

    // return <div>
    //     {this.state.node}
    // </div>
}
export default Multilinechart;