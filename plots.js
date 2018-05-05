/* plot orbits. className is passed on as argument*/
let plot_orbits = function (className) {
    spaceSVG = d3
        .select("." + String(className))
        .append("svg")
        .attr("class", "spaceSVG")
        .attr("id", "space")
        .attr("width", 1200)
        .attr("height", 580)
        .style("background-color", "black")
        .attr("height", "100%")
        .style("background-color", colorTheme);

    satelliteGroup = spaceSVG.append("g")
        .attr("class", "allSats");

    let ringcolor = "#3F3F3F";

    let orbit1 = spaceSVG
        .append("circle")
        .attr("class", "LEO")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", leo)
        .attr("fill", "none")
        .attr("stroke", ringcolor)

    let orbit2 = spaceSVG
        .append("circle")
        .attr("class", "MEO")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", meo)
        .attr("fill", "none")
        .attr("stroke", ringcolor)

    let orbit3 = spaceSVG
        .append("circle")
        .attr("class", "GEO")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", geo)
        .attr("fill", "none")
        .attr("stroke", ringcolor)
    }


/* plot satellites. can be further simplified by implementing helper filter functions */
let plot_satellites = function (d) {
    // Satellite Info
    let satName = d.satName;
    let satCountry = d.country;
    let satUsers = d.users;
    let satOrbit = d.orbitClass;
    let satPurpose = d.purpose;
    let satMass = d.launchMass;
    let satLife = d.expectedLifetime;
    let launchDate = String(d.launchDate).substring(0,16);
    let color = "white"
    let satSpeed = 1500;    // transition speed
    let r = satMass || 50; // radius of circle

    // Calculations
    // Generate random angle between 0 and 2Pi
    let angle = Math.random() * (2 * Math.PI)
    // Scale size of satellite according to launch mass
    r = rscale(r)

    // Plot satellites by orbit level
    if (satOrbit == "LEO") {
        radius = leo + (Math.random() * 120);
    } else if (satOrbit == "MEO") {
        radius = meo + (Math.random() * 30)

    } else if (satOrbit == "GEO") {
        radius = geo + (Math.random() * 60)
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
                // Reset Info

                dat = {satName: satName, country: satCountry, users: satUsers, orbitClass: satOrbit, purpose: satPurpose, launchMass: satMass, expectedLifetime: satLife, launchDate: launchDate}
                d3.selectAll(".satInfo").remove()

                // Mark selected satellite
                d3.select(this).attr("fill", "#3498DB").attr("r", 10)

                satTextBox(spaceSVG,dat,"#3498DB", 120)
                })

            .on("mouseout", function(d){
                d3.select(this).attr("fill", "white").attr("r", r)
                })

    // Transition satellites from the center to their random position in orbit
    dot
        .transition()
        .duration(satSpeed)
        .attr("cx", radius * Math.cos(angle) + centerX)
        .attr("cy", radius * Math.sin(angle) + centerY)
        .style("opacity", 1);
}


let filterByType = function () {

    // Update fact text
   spaceSVG.select(".world").transition().attr("xlink:href", "worldMap.png")
   spaceSVG.selectAll(".factText").remove();
   spaceSVG.select(".nodes").remove();

    let angleData = [];
    let radiusData = [];
    let mColor = "#E74C3C";
    let cvColor = "#F9E79F";
    let gColor = "#3498DB";
    let comColor ="#76D7C4";

    let allSats = satelliteGroup
        .selectAll("circle")
        .data(satData)

    // Update position & color of each satellite
    allSats
        .transition()
        .duration(2000)
        .style("opacity", 1)
        .attr("fill", function (d) {
            // Update color according to user
            // Civil: White, Military: Red, Commercial: Green, Government: Blue
            let  color = "white"
            let user = d.users;

            if (user.startsWith("Civ")) { color = cvColor }
            else if (user.startsWith("M")) { color = mColor }
            else if (user.startsWith("Comm")) { color = comColor }
            else if (user.startsWith("Gov")) { color = gColor }

            return color
        })
        .attr("cx", function (d) {
            // Update location in space - useCaseProportion() (helper) called in index.html for calculation
            if (d.orbitClass == "GEO") {
                radius = geo + (Math.random() * 60)
            } else if (d.orbitClass == "MEO") {
                radius = meo + (Math.random() * 30)
            } else if (d.orbitClass == "LEO") {
                radius = leo + (Math.random() * 120)
            }

            angle = Math.random() * (useCase[d.users].e - useCase[d.users].s) + useCase[d.users].s
            angleData.push(angle);
            radiusData.push(radius);

            return radius * Math.cos(angle) + centerX
        })
        .attr("cy", function (d, i) {
            radius = radiusData[i];
            angle = angleData[i];
            return radius * Math.sin(angle) + centerY
        })

    d3.selectAll(".satPoint")
        .on("mouseover", function(d) {
                // Reset Info
                d3.selectAll(".satInfo").remove()
                // Mark selected satellite
                d3.select(this).attr("fill", "white").attr("r", 10)

                // Add supporting text box - edit x poisition in index.html alignX
                let user = d.users;
                let  color = "white"
                if (user.startsWith("Civ")) { color = cvColor }
                else if (user.startsWith("M")) { color = mColor }
                else if (user.startsWith("Comm")) { color = comColor }
                else if (user.startsWith("Gov")) { color = gColor }

                satTextBox(spaceSVG,d, color, 300)
        })
        .on("mouseout", function(d){
            d3.select(this)
                    .attr("r", rscale((d.launchMass || 50 )))
                    .attr("fill", function(){
                        let user = d.users;
                        let  color = "white"
                        if (user.startsWith("Civ")) { color = cvColor }
                        else if (user.startsWith("M")) { color = mColor }
                        else if (user.startsWith("Comm")) { color = comColor }
                        else if (user.startsWith("Gov")) { color = gColor }
                        return color;
                    })
    });


    // Lines seperating sections
    let lines = [0, 2, 7,11]
    for (i in lines) {
        let key = Object.keys(useCase)[i]
        spaceSVG
            .append("line")
            .attr("x1", 40 * Math.cos(useCase[key].s) + centerX)
            .attr("x2", 380 * Math.cos(useCase[key].s) + centerX)
            .attr("y1", 40 * Math.sin(useCase[key].s) + centerY)
            .attr("y2", 380 * Math.sin(useCase[key].s) + centerY)
            .attr("stroke", "lightgrey")
            .style("opacity", 1)
            .style("stroke-width", 1)
        }

    lines = [1, 3, 4, 5, 6, 8, 9, 10, 13, 14, 15]
    for (i in lines) {
        let key = Object.keys(useCase)[i]
        spaceSVG
            .append("line")
            .attr("x1", 40 * Math.cos(useCase[key].s) + centerX)
            .attr("x2", 380 * Math.cos(useCase[key].s) + centerX)
            .attr("y1", 40 * Math.sin(useCase[key].s) + centerY)
            .attr("y2", 380 * Math.sin(useCase[key].s) + centerY)
            .attr("stroke", "grey")
            .style("opacity", 1)
            .style("stroke-width", 0.5)
        }
    };



let filterByType2 = function(selectType) {

    spaceSVG.selectAll("line").remove();
    spaceSVG.select(".nodes").remove();

   let subCat = useCase[0];
   let groupCat = useCase[1];
   let typeData = groupCat[selectType]
   console.log(groupCat)

    let start = 0;
    let frac = groupCat[selectType]/satData.length;
    let piPercent = (2 * Math.PI) * frac;
    let end = start + piPercent;
     // Update fact text
   spaceSVG.select(".world").transition().attr("xlink:href", "worldMap.png")
   spaceSVG.selectAll(".factText").remove()

    let angleData = [];
    let radiusData = [];

    let typeColor = "white";
    if (selectType == "Civil") {typeColor = "#F9E79F"}
    else if (selectType == "Commercial") {typeColor = "#76D7C4"}
    else if (selectType == "Government") {typeColor = "#3498DB"}
    else if (selectType == "Military") {typeColor = "#E74C3C"}


    let allSats = satelliteGroup
        .selectAll("circle")
        .data(satData)

    // Update position & color of each satellite
    allSats
        .transition()
        .duration(2000)
        .style("opacity", 1)
        .attr("fill", function (d) {
            // Update color according to user
            // Civil: White, Military: Red, Commercial: Green, Government: Blue
            let  color = "white"
            let user = d.users;
            if (user.includes(selectType)) {color = typeColor}
            return color
        })
        .attr("cx", function (d) {
            // Update location in space - useCaseProportion() (helper) called in index.html for calculation
            let user = d.users;
            if (d.orbitClass == "GEO") {
                radius = geo + (Math.random() * 60)
            } else if (d.orbitClass == "MEO") {
                radius = meo + (Math.random() * 30)
            } else if (d.orbitClass == "LEO") {
                radius = leo + (Math.random() * 120)
            }

            if (user.includes(selectType)) {
                angle = (Math.random() * (end - start) + start) + Math.PI
            }
            else {
                angle = (Math.random() * (2*Math.PI - end) + end) + Math.PI
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

    d3.selectAll(".satPoint")
        .on("mouseover", function(d) {
                // Reset Info
                d3.selectAll(".satInfo").remove()
                // Mark selected satellite
                d3.select(this).attr("fill", "white").attr("r", 10)

                // Add supporting text box - edit x poisition in index.html alignX
                let user = d.users;
                let  color = "white"
                if (user.includes(selectType)) {color = typeColor}
                satTextBox(spaceSVG,d, color, 300)
        })
        .on("mouseout", function(d){
            d3.select(this)
                    .attr("r", rscale((d.launchMass || 50 )))
                    .attr("fill", function(){
                        let user = d.users;
                        let  color = "white"
                        if (user.includes(selectType)) {color = typeColor}
                        return color
                    })
    });


        start = start + Math.PI;
        end = end + Math.PI;

        spaceSVG
            .append("line")
            .transition()
            .attr("x1", 40 * Math.cos(start) + centerX)
            .attr("x2", 380 * Math.cos(start) + centerX)
            .attr("y1", 40 * Math.sin(start) + centerY)
            .attr("y2", 380 * Math.sin(start) + centerY)
            .attr("stroke", "grey")
            .style("opacity", 1)
            .style("stroke-width", 1)

        wiper = spaceSVG
            .append("line")
            .attr("x1", 40 * Math.cos(start) + centerX)
            .attr("x2", 380 * Math.cos(start) + centerX)
            .attr("y1", 40 * Math.sin(start) + centerY)
            .attr("y2", 380 * Math.sin(start) + centerY)
            .attr("stroke", "grey")
            .style("opacity", 1)
            .style("stroke-width", 1)

         wiper.transition()
            .duration(2000)
            .attr("x1", 40 * Math.cos(end) + centerX)
            .attr("x2", 380 * Math.cos(end) + centerX)
            .attr("y1", 40 * Math.sin(end) + centerY)
            .attr("y2", 380 * Math.sin(end) + centerY)


    };


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


/* data have already been grouped on the country level */
let force_layout = function(data) {
  spaceSVG.select(".world").remove();
  spaceSVG.select(".nodes").remove();
  spaceSVG.selectAll("g").selectAll("circle").remove();
  spaceSVG.selectAll("line").remove();
  spaceSVG.selectAll(".factText").remove();
  spaceSVG.selectAll(".LEO").remove();
  spaceSVG.selectAll(".MEO").remove();
  spaceSVG.selectAll(".GEO").remove();

  // let width = +spaceSVG.attr("width"),
  // height = +spaceSVG.attr("height");

  // prepare for force layout ready data
  let filtered_data = []
  data.forEach(function(d) {
    filtered_data.push({
      country: d.key,
      count: d.values.length
    })
  })

  // set up the simulation
  let simulation = d3.forceSimulation()
    .nodes(filtered_data);

  // add forces
  simulation
    .velocityDecay(0.6)
    .force("x", d3.forceX().strength(0.002))
    .force("y", d3.forceY().strength(0.002))
    .force("collide", d3.forceCollide(6).iterations(10))
    .force("center_force", d3.forceCenter(centerX, centerY))
    .on("tick", tickActions);

  // draw circles for the nodes
  let node = spaceSVG.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(filtered_data)
            .enter()
            .append("circle")
            .attr("r", function(d) { return d3.scaleLog().range([0, 8])(d.count); })
            .attr("fill", "blue")
            .attr("opacity", 0.7);

  // tick event
  function tickActions() {
    // update circle positions to reflect node updates on each tick
    node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
  }
}
