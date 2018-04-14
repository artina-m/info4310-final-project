/* plot orbits. className is passed on as argument*/
let plot_orbits = function(className) {
    spaceSVG = d3.select("."+String(className))
      .append("svg")
      .attr("class", "spaceSVG")
      .attr("width", 600)
      .attr("height", 600)
      .style("background-color", "black")
      .attr("height", "100%")
      .style("background-color", colorTheme);

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
                .attr("stroke", "grey")

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

/* plot satellites. can be further simplified by implementing helper filter functions */
let plot_satellites = function(d) {
    // Randomly scatter the satellities into different orbit classes

    let color = "white" // initialize category color to be white

    if (d.users.indexOf("Civil") > -1) { color =  "yellow"}
    else if (d.users.indexOf("Military") > -1) { color =  "red"}
    else if (d.users.indexOf("Commercial") > -1) { color =  "blue"}
    else if (d.users.indexOf("Government") > -1) { color =  "white"}


    // USA first quad 0 and pi / 2
    if (d.country == "USA") {
        angle = Math.random()  * (Math.PI)
        color = "white"
    }
    else {
        angle = Math.random() * (2*Math.PI - Math.PI) + Math.PI
    }


    // Radial position by Orbit type
    // Add noise for scatter


    if (d.orbitClass == "LEO"){
        radius = 100 + (Math.random() * 20)

        spaceSVG.append("circle")
            .attr("cx", radius * Math.cos(angle) + centerPoint)
            .attr("cy", radius * Math.sin(angle) + centerPoint)
            .attr("r", 1)
            .attr("fill", color)
    }

    else if (d.orbitClass == "MEO"){
        radius = 150 + (Math.random() * 20)

        spaceSVG.append("circle")
            .attr("cx", radius * Math.cos(angle) + centerPoint)
            .attr("cy", radius * Math.sin(angle) + centerPoint)
            .attr("r", 1)
            .attr("fill", color)
    }
     else if (d.orbitClass == "GEO"){
        radius = 250 + (Math.random() * 20)

        spaceSVG.append("circle")
            .attr("cx", radius * Math.cos(angle) + centerPoint)
            .attr("cy", radius * Math.sin(angle) + centerPoint)
            .attr("r", 1)
            .attr("fill", color)
    }

}

/* plot force-based cartogram */
let plot_cartogram = function(className) {
  
}
