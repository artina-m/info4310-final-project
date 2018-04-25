/* plot orbits. className is passed on as argument*/
let plot_orbits = function (className) {
    // This function plots the spaceSVG and orbit levels

    spaceSVG = d3
        .select("." + String(className))
        .append("svg")
        .attr("class", "spaceSVG")
        .attr("id", "space")
        .attr("width", 700)
        .attr("height", 600)
        .style("background-color", "black")
        .attr("height", "100%")
        .style("background-color", colorTheme);

    satelliteGroup = spaceSVG.append("g");

    let ringcolor = "#3F3F3F";
    let centerPoint = 350;

    let randomCountries = spaceSVG
        .append("circle")
        .attr("cx", centerPoint)
        .attr("cy", centerPoint)
        .attr("r", 50)
        .attr("fill", "black")
        .attr("stroke", "lightgrey");

    let orbit1 = spaceSVG
        .append("circle")
        .attr("class", "LEO")
        .attr("cx", centerPoint)
        .attr("cy", centerPoint)
        .attr("r", 100)
        .attr("fill", "none")
        .attr("stroke", ringcolor)

    let orbit2 = spaceSVG
        .append("circle")
        .attr("class", "MEO")
        .attr("cx", centerPoint)
        .attr("cy", centerPoint)
        .attr("r", 200)
        .attr("fill", "none")
        .attr("stroke", ringcolor)

    let orbit3 = spaceSVG
        .append("circle")
        .attr("class", "GEO")
        .attr("cx", centerPoint)
        .attr("cy", centerPoint)
        .attr("r", 250)
        .attr("fill", "none")
        .attr("stroke", ringcolor)
}

/* plot satellites. can be further simplified by implementing helper filter functions */
let plot_satellites = function (d) {
    // Plot satellites as points in respective orbit level ID = satellite name
    let r = 1.2; // Radius of satelllities
    let centerPoint = 350; // Animation starting point
    let color = "white"
    let angle = Math.random() * (2 * Math.PI) // Angle == Country ?
    let satSpeed = 1000;

    // Radial position by Orbit type + noise for scatter
    if (d.orbitClass == "LEO") {
        radius = 100 + (Math.random() * 80);
        var dot = satelliteGroup
            .append("circle")
            .attr("class", "satPoint")
            .attr("id", d.satName)
            .attr("cx", 0 + centerPoint)
            .attr("cy", 0 + centerPoint)
            .attr("r", r)
            .attr("fill", color)
            .style("opacity", 0);

        dot
            .transition()
            .duration(satSpeed)
            .attr("cx", radius * Math.cos(angle) + centerPoint)
            .attr("cy", radius * Math.sin(angle) + centerPoint)
            .style("opacity", 1);

    } else if (d.orbitClass == "MEO") {
        radius = 200 + (Math.random() * 20)
        dot = satelliteGroup
            .append("circle")
            .attr("class", "satPoint")
            .attr("id", d.satName)
            .attr("cx", 0 + centerPoint)
            .attr("cy", 0 + centerPoint)
            .attr("r", r)
            .attr("fill", color)
            .style("opacity", 0);

        dot
            .transition()
            .duration(satSpeed)
            .attr("cx", radius * Math.cos(angle) + centerPoint)
            .attr("cy", radius * Math.sin(angle) + centerPoint)
            .style("opacity", 1);

    } else if (d.orbitClass == "GEO") {
        radius = 250 + (Math.random() * 30)
        dot = satelliteGroup
            .append("circle")
            .attr("class", "satPoint")
            .attr("id", d.satName)
            .attr("cx", 0 + centerPoint)
            .attr("cy", 0 + centerPoint)
            .attr("r", r)
            .attr("fill", color)
            .style("opacity", 0);

        dot
            .transition()
            .duration(satSpeed)
            .attr("cx", radius * Math.cos(angle) + centerPoint)
            .attr("cy", radius * Math.sin(angle) + centerPoint)
            .style("opacity", 1);
    }

}

/* plot force-based cartogram */
let plot_cartogram = function (className) {}

let filterByType = function () {
    let angleData = [];
    let radiusData = [];
    let allSats = satelliteGroup
        .selectAll("circle")
        .data(satData)

    // Update the colors based on use case Commericial: Green Governemnt: Blue
    // Military: Red Civil: White
    allSats
        .transition()
        .duration(2000)
        .attr("fill", function (d) {
            let color = "white"
            if (d.users.indexOf("Civil") > -1) {
                color = "white"
            } else if (d.users.indexOf("Military") > -1) {
                color = "red"
            } else if (d.users.indexOf("Commercial") > -1) {
                color = "#76D7C4"
            } else if (d.users.indexOf("Government") > -1) {
                color = "blue"
            }
            return color
        })
        .attr("cx", function (d) {
            let centerPoint = 350;
            angle = 2 * Math.PI
            if (d.users.indexOf("Civil") > -1) {
                angle = Math.random() * (1 * Math.PI / 8)
            } else if (d.users.indexOf("Military") > -1) {
                angle = Math.random() * (3.50 * Math.PI / 8 - 1 * Math.PI / 8) + 1 * Math.PI / 8
            } else if (d.users.indexOf("Commercial") > -1) {
                angle = Math.random() * (13.50 * Math.PI / 8 - 3.50 * Math.PI / 8) + 3.5 * Math.PI / 8
            } else if (d.users.indexOf("Government") > -1) {
                angle = Math.random() * (16 * Math.PI / 8 - 13.5 * Math.PI / 8) + 13.5 * Math.PI / 8
            }

            if (d.orbitClass == "GEO") {
                radius = 250 + (Math.random() * 30)
            } else if (d.orbitClass == "MEO") {
                radius = 200 + (Math.random() * 20)
            } else if (d.orbitClass == "LEO") {
                radius = 100 + (Math.random() * 80)
            }

            angleData.push(angle);
            radiusData.push(radius);
            return radius * Math.cos(angle) + centerPoint
        })
        .attr("cy", function (d, i) {
            let centerPoint = 350;
            radius = radiusData[i];
            angle = angleData[i];
            return radius * Math.sin(angle) + centerPoint

        })

}

let plot_use = function (className) {
    useSvg = d3
        .select("." + String(className))
        .append("svg")
        .attr("class", "useSVG")
        .attr("id", "space")
        .attr("width", 400)
        .attr("height", 400)
        .style("background-color", "black")
        .style("background-color", colorTheme);
}