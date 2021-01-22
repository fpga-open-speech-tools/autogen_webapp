import * as React from 'react';
import * as d3 from 'd3';

export const Heatmap = (props) =>{
  d3.selectAll("svg > *").remove()
    var margin = {top: 80, right: 25, bottom: 30, left: 40},
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;
    
    const svg = d3.select("#draw-svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var groups = props.data.map((dataPoint)=>{
    return dataPoint.group;
  });
  var vars = props.data.map((dataPoint)=>{
    return dataPoint.variable;
  })
  
  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(groups)
    .padding(0.00);
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()
  

  var y = d3.scaleLinear()
  .domain([0,60])
  .range([ 0, height ]);
  svg.append("g")
  .call(d3.axisLeft(y));

  // Build color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateBuPu)
    .domain([0,100])
  
  // add the squares
  let cumulative_heights = {};
  groups.forEach((group)=>{
    cumulative_heights[group] = 0;
  });
  svg.selectAll()
    .data(props.data, function(d) {return d.group+':'+d.variable;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { 
        cumulative_heights[d.group] = d.height*height/10+cumulative_heights[d.group]; 
        return cumulative_heights[d.group]-d.height*height/10; 
      })
      .attr("rx", 0)
      .attr("ry", 0)
      .attr("width", x.bandwidth() )
      .attr("height", function(d){ return d.height*height/10})
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
  // Add title to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -50)
          .attr("text-anchor", "left")
          .style("font-size", "22px")
          .text("Random :)");
  
  // Add subtitle to graph
  svg.append("text")
          .attr("x", 0)
          .attr("y", -20)
          .attr("text-anchor", "left")
          .style("font-size", "14px")
          .style("fill", "grey")
          .style("max-width", 400)
          .text("Random number generator for 100 Element Square Heatmap");

  return(        
    <div
      id="draw-me"
      className="draw-me"
    >
      <svg id="draw-svg">

      </svg>
    </div>
  );
}