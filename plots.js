/* plot orbits. className is passed on as argument*/
let plot_orbits = function (className) {
    spaceSVG = d3
        .select("." + String(className))
        .append("svg")
        .attr("class", "spaceSVG")
        .attr("id", "space")
        .attr("width", 800)
        .attr("height", "100%")
        .style("z-index", 5)
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

                // Mark selected satellite
                d3.select(this).attr("fill", "#3498DB").attr("r", 10)

                satTextBox(dat,"#3498DB")
                })

            .on("mouseout", function(d){
                $("#selectedSat").html("");
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



let filterByType2 = function(selectType) {

    spaceSVG.selectAll("line").remove();
    spaceSVG.select(".nodes").remove();

   let subCat = useCase[0];
   let groupCat = useCase[1];
   let typeData = groupCat[selectType]

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
                // Mark selected satellite
                d3.select(this).attr("fill", "white").attr("r", 10)

                // Add supporting text box - edit x poisition in index.html alignX
                let user = d.users;
                let  color = "white"
                if (user.includes(selectType)) {color = typeColor}
                satTextBox(d, color)
        })
        .on("mouseout", function(d){
            $("#selectedSat").html("");
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
         
         spaceSVG.append("text")
             .text(typeData)
             .attr("x", alignX).attr("y", 50)
             .attr("class","factText")
             .style("font-size", 24).attr("fill", "white")
         
          spaceSVG.append("text")
            .text(selectType + " Satellites")
            .attr("x", alignX).attr("y", 70)
            .attr("class","factText")
            .style("font-size", 16).attr("fill", typeColor)
          
          spaceSVG.append("line")
        .attr("x1", alignX).attr("x2", alignX +200)
        .attr("y1", 90).attr("y2", 90)
              .attr("class", "factText")
              .attr("stroke", "lightgrey").attr("stroke-width", 0.5)

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


// line parser for retrieving world map coordinates
function parseCoords(line) {
  return {
    name: String(line.name),
    lat: +line.latitude,
    lng: +line.longitude
  }
}


/* data have already been grouped on the country level */
let force_layout = function(data) {
  // clear the paints
  spaceSVG.select(".world").remove();
  spaceSVG.select(".nodes").remove();
  spaceSVG.selectAll("g").selectAll("circle").remove();
  spaceSVG.selectAll("line").remove();
  spaceSVG.selectAll(".factText").remove();
  spaceSVG.selectAll(".LEO").remove();
  spaceSVG.selectAll(".MEO").remove();
  spaceSVG.selectAll(".GEO").remove();

  // prepare for force layout ready data
  let filtered_data = []
  data.forEach(function(d) {
    filtered_data.push({
      country: d.key,
      count: d.values.length
    })
  })
  
  
  
  // mercator projection
  let projection = d3.geoMercator()
    .scale(centerX / Math.PI)
    .translate([centerX, centerY]);

  // add on country level data
  d3.csv("country_coordinates.csv", parseCoords, function(d) {
      countryCoords = d;

      // join country coordinates with satellites volume data on country name
      countryCoords.forEach(function(row) {
        let result = filtered_data.filter(function(entry) {
          return entry.country === row.name;
        });
        row.value = (result[0] !== undefined) ? result[0] : null;
      })

      // extract only the coordinates, name, and value
      let nodes = []
      countryCoords.forEach(function(d) {
        if (d.value !== null) {
          let point = projection([d.lat, d.lng])
          nodes.push({
            x: point[0], y: point[1],
            x0: point[0], y0: point[1],
            count: d.value.count,
            name: d.value.country
          })
        }
      })

      // set up the simulation
      let simulation = d3.forceSimulation()
        .velocityDecay(0.6)
        .force("x", d3.forceX().strength(0.002))
        .force("y", d3.forceY().strength(0.002))
        .force("center_force", d3.forceCenter(centerX, centerY))
        .force("collide", collide)
        .nodes(nodes)
        .on("tick", tickActions);

      // // add forces
      // simulation
      //   .velocityDecay(0.6)
      //   .force("x", d3.forceX().strength(0.002))
      //   .force("y", d3.forceY().strength(0.002))
      //   .force("collide", d3.forceCollide(6).iterations(10))
      //   .force("center_force", d3.forceCenter(centerX, centerY))


      let radius = d3.scaleLog().range([0, 8])

      // draw circles for the nodes
      let node = spaceSVG.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes)
                .enter()
                .append("circle")
                .attr("r", function(d) { return radius(d.count); })
                .attr("fill", "blue")
                .attr("opacity", 0.7);

      // tick event
      function tickActions() {
        // update circle positions to reflect node updates on each tick
        node.attr("cx", function(d) { return d.x - radius(d.count); })
          .attr("cy", function(d) { return d.y - radius(d.count); })
      }

      let padding = 3;
      function collide() {
        for (var k = 0, iterations = 4, strength = 0.5; k < iterations; ++k) {
          for (var i = 0, n = nodes.length; i < n; ++i) {
            for (var a = nodes[i], j = i + 1; j < n; ++j) {
              var b = nodes[j],
                  x = a.x + a.vx - b.x - b.vx,
                  y = a.y + a.vy - b.y - b.vy,
                  lx = Math.abs(x),
                  ly = Math.abs(y),
                  r = a.r + b.r + padding;
              if (lx < r && ly < r) {
                if (lx > ly) {
                  lx = (lx - r) * (x < 0 ? -strength : strength);
                  a.vx -= lx, b.vx += lx;
                } else {
                  ly = (ly - r) * (y < 0 ? -strength : strength);
                  a.vy -= ly, b.vy += ly;
                }
              }
            }
          }
        }
      }
  })



}
