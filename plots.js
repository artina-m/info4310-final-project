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
    let color = "white"
    let angle = Math.random() * (2 * Math.PI) // Angle == Country ?
    let satSpeed = 1500;
    let r = d.launchMass || 1;

    let rscale = d3.scaleLinear()
        .domain([0,6651])
        .range([1,15])
    r = rscale(r)
    

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
        radius = 200 + (Math.random() * 30)
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
        radius = 250 + (Math.random() * 40)
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
        .style("opacity", 1)
        .attr("fill", function (d) {
            let color = "white"
            if (d.users.indexOf("Civil") > -1) {
                color = "white"
            } else if (d.users.indexOf("Military") > -1) {
                color = "#DD1155"
            } else if (d.users.indexOf("Commercial") > -1) {
                color = "#76D7C4"
            } else if (d.users.indexOf("Government") > -1) {
                color = "#357DED"
            }
            return color
        })
        .attr("cx", function (d) {
            angle = Math.random() * (useCase[d.users].e - useCase[d.users].s) + useCase[d.users].s
                

            if (d.orbitClass == "GEO") {
                radius = 250 + (Math.random() * 40)
            } else if (d.orbitClass == "MEO") {
                radius = 200 + (Math.random() * 30)
            } else if (d.orbitClass == "LEO") {
                radius = 100 + (Math.random() * 80)
            }

            angleData.push(angle);
            radiusData.push(radius);
            return radius * Math.cos(angle) + centerPoint
        })
        .attr("cy", function (d, i) {
            radius = radiusData[i];
            angle = angleData[i];
            return radius * Math.sin(angle) + centerPoint
        })
    
        spaceSVG.selectAll("line").remove()
        for (i in useCase) {
            spaceSVG
                .append("line")
                .attr("x1", 30 * Math.cos(useCase[i].s) + centerPoint)
                .attr("x2", 350 * Math.cos(useCase[i].s) + centerPoint)
                .attr("y1", 30 * Math.sin(useCase[i].s) + centerPoint)
                .attr("y2", 350 * Math.sin(useCase[i].s) + centerPoint)
                .attr("stroke", "#303030")
                .style("stroke-width", 1)
        }
    
}

let plot_use = function (className) {
    useSvg = d3
        .select("." + String(className))
        .append("svg")
        .attr("class", "useSVG")
        .attr("id", "space")
        .attr("width", 400)
        .attr("height", 400)
        .style("background-color", "white");
    
}


// !! to do create a function that does this for arbitrary categories and filters 
let useCaseProportion = function (data){
    let useCase = [];
    let counts = {};
    let total = data.length;
    
    // Get counts
    data.forEach(function(d){
        useCase.push(d.users)
    })
    
    for (var i = 0; i < useCase.length; i++) {
        var num = useCase[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }  
    
    // Get percentage
    let start  = 0;
    for (i in counts){
        frac = counts[i]/total
        piPercent = (2*Math.PI) * frac;
        end = start + piPercent;
        counts[i] = {s: start, e:end}
        start = end;
    }
    console.log(counts)
    return counts;

}

