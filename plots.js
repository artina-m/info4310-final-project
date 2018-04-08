// parameter s is where you pass on the container
let plot_orbits = function(s) {


  // painting the background black or spacegray
  spaceSVG = d3.select("." + String(s))
    .append("svg")
    .attr("width", 600)
    .attr("height", 600)
    .style("background-color", "black");

  let randomCountries = spaceSVG.append("circle")
    .attr("cx", centerPoint)
    .attr("cy", centerPoint)
    .attr("r", 50)
    .attr("fill", "grey");

  let orbit1 = spaceSVG.append("circle")
    .attr("class", "LEO")
    .attr("cx", centerPoint)
    .attr("cy", centerPoint)
    .attr("r", 100)
    .attr("fill", "none")
    .attr("stroke", "grey");

  let orbit2 = spaceSVG.append("circle")
              .attr("class", "MEO")
              .attr("cx", centerPoint)
              .attr("cy", centerPoint)
              .attr("r", 150)
              .attr("fill", "none")
              .attr("stroke", "grey")

  let orbit3 = spaceSVG.append("circle")
              .attr("class", "GEO")
              .attr("cx", centerPoint)
              .attr("cy", centerPoint)
              .attr("r", 250)
              .attr("fill", "none")
              .attr("stroke", "grey")
}
