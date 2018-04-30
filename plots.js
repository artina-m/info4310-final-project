/* plot orbits. className is passed on as argument*/
let plot_orbits = function (className) {
    spaceSVG = d3
        .select("." + String(className))
        .append("svg")
        .attr("class", "spaceSVG")
        .attr("id", "space")
        .attr("width", 800)
        .attr("height", 600)
        .style("background-color", "black")
        .attr("height", "100%")
        .style("background-color", colorTheme);

    satelliteGroup = spaceSVG.append("g");

    let ringcolor = "#3F3F3F";

    let randomCountries = spaceSVG
        .append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 50)
        .attr("fill", "black")
        .attr("stroke", "lightgrey");

    let orbit1 = spaceSVG
        .append("circle")
        .attr("class", "LEO")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 100)
        .attr("fill", "none")
        .attr("stroke", ringcolor)

    let orbit2 = spaceSVG
        .append("circle")
        .attr("class", "MEO")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 200)
        .attr("fill", "none")
        .attr("stroke", ringcolor)

    let orbit3 = spaceSVG
        .append("circle")
        .attr("class", "GEO")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", 250)
        .attr("fill", "none")
        .attr("stroke", ringcolor)
}



/* plot satellites. can be further simplified by implementing helper filter functions */
let plot_satellites = function (d) {
    // Plot satellites as points in respective orbit level ID = satellite name
    
    // Satellite Info
    let satName = d.satName;
    let satCountry = d.country;
    let satUsers = d.users;
    let satOrbit = d.orbitClass;
    let satPurpose = d.purpose;
    let satMass = d.launchMass;
    let satLife = d.expectedLifetime;
    let color = "white"
    let satSpeed = 1500;    // transition speed
    let r = satMass || 1.5; // radius of circle
    
    // Calculations
    let angle = Math.random() * (2 * Math.PI) // Angle == Country ?
    let rscale = d3.scaleLinear()
                    .domain([0,6651])
                    .range([1.5,15])
    r = rscale(r)

    // Location of satellite: Radius on circle depends on orbit level
    if (satOrbit == "LEO") {
        radius = 100 + (Math.random() * 80);
    } else if (satOrbit == "MEO") {
        radius = 200 + (Math.random() * 30)

    } else if (satOrbit == "GEO") {
        radius = 250 + (Math.random() * 40)
    }
    
    // Plot satellites
    var dot = satelliteGroup
            .append("circle")
            .attr("class", "satPoint")
            .attr("id", d.satName)
            .attr("cx", 0 + centerX)
            .attr("cy", 0 + centerY)
            .attr("r", r)
            .attr("fill", color)
            .style("opacity", 0)
            .on("mouseover", function(d) {
                d3.selectAll(".satPoint").attr("fill", color)                
                d3.selectAll(".satInfo").remove() // Clear previous info
                
                dot.attr("fill", "#E59866").attr("r", r + 3)

                spaceSVG.append("text")
                    .text(satName + ",  " + satCountry)
                    .attr("class", "satInfo")
                    .attr("fill", "#E59866")
                    .attr("x", 50)
                    .attr("y", 650)
                
                spaceSVG.append("text")
                    .text(satUsers + "  Satellite")
                    .attr("class", "satInfo")
                    .attr("fill", "white")
                    .attr("x", 50)
                    .attr("y", 670)
                    .style("font-size", 12)
    
                spaceSVG.append("text")
                    .text("Purpose:  " + satPurpose)
                    .attr("class", "satInfo")
                    .attr("fill", "white")
                    .attr("x", 50)
                    .attr("y", 690)
                    .style("font-size", 12)
                
                spaceSVG.append("text")
                    .text("Orbit Class: " + satOrbit + " Expected Lifetime:  " + satLife)
                    .attr("class", "satInfo")
                    .attr("fill", "white")
                    .attr("x", 50)
                    .attr("y", 710)
                    .style("font-size", 12)
                })
    
            .on("mouseout", 
                function(d) {
                    dot
                    .attr("r", r)
                    
        });
    
    dot
        .transition()
            .duration(satSpeed)
            .attr("cx", radius * Math.cos(angle) + centerX)
            .attr("cy", radius * Math.sin(angle) + centerY)
            .style("opacity", 1);
    
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
            return radius * Math.cos(angle) + centerX
        })
        .attr("cy", function (d, i) {
            radius = radiusData[i];
            angle = angleData[i];
            return radius * Math.sin(angle) + centerY
        })

    spaceSVG
        .selectAll("line")
        .remove()
    for (i in useCase) {
        spaceSVG
            .append("line")
            .attr("x1", 30 * Math.cos(useCase[i].s) + centerX)
            .attr("x2", 350 * Math.cos(useCase[i].s) + centerX)
            .attr("y1", 30 * Math.sin(useCase[i].s) + centerY)
            .attr("y2", 350 * Math.sin(useCase[i].s) + centerY)
            .attr("stroke", "lightgrey")
            .style("opacity", 0.2)
    }

}

let plot_use = function (className, data) {
    let stack = d3.stack();

    let margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 60
    };
    let width = 400 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    let svg = d3
        .select("." + String(className))
        .append("svg")
        .attr("class", "useSVG")
        .attr("id", "space")
        .attr("width", 520)
        .attr("height", 400)
        .style("background-color", "white");

    let g = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let keys = data
        .columns
        .slice(1);

    let x = d3
        .scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.25)
        .align(1.0)
        .domain(data.map(function (d) {
            return d.Country;
        }));

    let y = d3
        .scaleLinear()
        .rangeRound([height, 0])
        .domain([0, 1.0])
        .nice();

    let z = d3
        .scaleOrdinal()
        .range(["#5cbae6", "#b6d957", "#fac364", "#d998cb"])
        .domain(keys);

    g
        .append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter()
        .append("g")
        .attr("fill", function (d) {
            return z(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x(d.data.Country);
        })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("height", function (d) {
            return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth());

    g
        .append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g
        .append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s").tickFormat(d3.format(".0%")));

    svg
        .append("text")
        .attr("x", -200)
        .attr("y", 20)
        .text("Percentage of Country's Satellites")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .style("font-family", "Roboto")
        .style("fill", "#424949")
        .style("font-size", 12);
    
    let legendBox = svg.append("rect")
    .attr("x", 401)
    .attr("y", 20)
    .attr("width", 110)
    .attr("height", 160)
    .style("stroke", "#424949")
    .style("fill", "none")
    .style("stroke-width", 1);
    
    let legendText = svg.append("text")
    .attr("x", 456)
    .attr("y", 40)
    .text("Use Case")
    .attr("text-anchor", "middle")
    .style("font-family", "Roboto")
    .style("font-size", 14);

    let legend = svg
        .append("g")
        .attr("font-family", "Roboto")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter()
        .append("g")
        .attr("transform", function (d, i) {
            return "translate(180," + i * 30 + ")";
        });

    legend
        .append("rect")
        .attr("x", width - 19)
        .attr("y", 60)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend
        .append("text")
        .attr("x", width - 24)
        .attr("y", 69.5)
        .attr("dy", "0.32em")
        .style("font-size", 12)
        .text(function (d) {
            return d;
        });

}







// !! to do create a function that does this for arbitrary categories and
// filters
let useCaseProportion = function (data) {
    let useCase = [];
    let counts = {};
    let total = data.length;

    // Get counts
    data.forEach(function (d) { useCase.push(d.users) })

    for (var i = 0; i < useCase.length; i++) {
        var num = useCase[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }  
    
    // Get percentage
    let start = 0;
    for (i in counts) {
        frac = counts[i] / total
        piPercent = (2 * Math.PI) * frac;
        end = start + piPercent;
        counts[i] = { s: start, e: end }
        start = end;
    }
    console.log(counts)
    return counts;
}
