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

    // Update bar chart
    $(".chart div").remove()
    $(".chart p").remove()
    $(".chart hr").remove()

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
    spaceSVG.selectAll(".voronoi").remove();


    // Plot mini bar charts on right hand side
    var satTypes = ["Civil", "Commercial", "Government", "Military"]

    // Remove old data
    $(".chart div").remove()
    $(".chart p").remove()
    $(".chart hr").remove()

    data = Object.values(useCase[1])
    var percentVal = data.map(function(element) {
	     return 10*Math.round((element/1738)*1000)/100 ;
    });

    var xBar = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 200]);

    var chart = d3.select(".chart");
    chart.append("hr")
    chart.append("p").text("% of Satellites by Use Case")


    var bar = chart.selectAll("div");
    var barUpdate = bar.data(percentVal);
    var barEnter = barUpdate.enter().append("div");
    barEnter.style("width", function(d,i) { return xBar(d); });
    barEnter.style("border-color", function(d,i){
        if (selectType == "Commercial" && i == 1) {
            console.log("here")
            return "#76D7C4"}
        else if (selectType == "Civil" && i == 0) {return "#F9E79F"}
         else if (selectType == "Government" && i == 2) {return "#3498DB"}

        else if (selectType == "Military" && i == 3) {return "#E74C3C"}
        else {return "grey"}
    });

    barEnter.text(function(d,i) { return  satTypes[i] + " " + percentVal[i] + "%"; });
    chart.append("hr")

    // added voronoi tessllation
    let voronoi = d3.voronoi()
      .x(function(d) {
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
      .y(function(d) {
        radius = radiusData[i];
        angle = angleData[i];
        return radius * Math.sin(angle) + centerY
      })

    let voronoiGroup = spaceSVG.append("g")
      .attr("class", "voronoi");


   let subCat = useCase[0];
   let groupCat = useCase[1];
   let typeData = groupCat[selectType]

    document.getElementById("totalCat").innerHTML = selectType + " Satellites"
    document.getElementById("total").innerHTML = groupCat[selectType]

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

    let keys = data.columns.slice(1);
    console.log(keys)

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

    // let typeColor = "white";
    // if (use_type == "Civil") {typeColor = "#F9E79F"}
    // else if (use_type == "Commercial") {typeColor = "#76D7C4"}
    // else if (use_type == "Government") {typeColor = "#3498DB"}
    // else if (use_type == "Military") {typeColor = "#E74C3C"}

    let z = d3
        .scaleOrdinal()
        .range(["#76D7C4", "#F9E79F", "#E74C3C", "#3498DB"])
        .domain(keys);

    // tooltip being bound to the outer container defined by the className
    // let tooltip = d3.select(className).append("div")
    // .attr("class", "tooltip")
    // .attr("width", 50)
    // .attr("height", 50);

    g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter()
    .append("g")
    .attr("fill", function (d) {
        return z(d.key);
    })
    .style("opacity", 0.95)
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
    .attr("width", x.bandwidth())
    .on("mouseover", function(d) {
      d3.select(this)
      .append("div")
      .attr("class", "tooltip")
      .attr("width", 50)
      .attr("height", 50)
      .html(d.key);

      // tooltip
      //   .style("left", d3.event.pageX - 50 + "px")
      //   .style("top", d3.event.pageY - 70 + "px")
      //   .style("display", "inline-block")
      //   .html((d.key));
      //
      //
      //
      //   let tooltip = d3.select(className).append("div")
      //   .attr("class", "tooltip")
      //   .attr("width", 50)
      //   .attr("height", 50);



    });

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
        .attr("fill", z)
        .style("opacity", 0.95);

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
// let force_layout = function(data) {
//   // clear the paints
//   spaceSVG.select(".world").remove();
//   spaceSVG.select(".nodes").remove();
//   spaceSVG.selectAll("g").selectAll("circle").remove();
//   spaceSVG.selectAll("line").remove();
//   spaceSVG.selectAll(".factText").remove();
//   spaceSVG.selectAll(".LEO").remove();
//   spaceSVG.selectAll(".MEO").remove();
//   spaceSVG.selectAll(".GEO").remove();
//
//   // prepare for force layout ready data
//   let filtered_data = []
//   data.forEach(function(d) {
//     filtered_data.push({
//       country: d.key,
//       count: d.values.length
//     })
//   })
//
//
//
//   // mercator projection
//   let projection = d3.geoMercator()
//     .scale(centerX / Math.PI)
//     .translate([centerX, centerY]);
//
//   // add on country level data
//   d3.csv("country_coordinates.csv", parseCoords, function(d) {
//       countryCoords = d;
//
//       // join country coordinates with satellites volume data on country name
//       countryCoords.forEach(function(row) {
//         let result = filtered_data.filter(function(entry) {
//           return entry.country === row.name;
//         });
//         row.value = (result[0] !== undefined) ? result[0] : null;
//       })
//
//       // extract only the coordinates, name, and value
//       let nodes = []
//       countryCoords.forEach(function(d) {
//         if (d.value !== null) {
//           let point = projection([d.lat, d.lng])
//           nodes.push({
//             x: point[0], y: point[1],
//             x0: point[0], y0: point[1],
//             count: d.value.count,
//             name: d.value.country
//           })
//         }
//       })
//
//       // set up the simulation
//       let simulation = d3.forceSimulation()
//         .velocityDecay(0.6)
//         .force("x", d3.forceX().strength(0.002))
//         .force("y", d3.forceY().strength(0.002))
//         .force("center_force", d3.forceCenter(centerX, centerY))
//         .force("collide", collide)
//         .nodes(nodes)
//         .on("tick", tickActions);
//
//       // // add forces
//       // simulation
//       //   .velocityDecay(0.6)
//       //   .force("x", d3.forceX().strength(0.002))
//       //   .force("y", d3.forceY().strength(0.002))
//       //   .force("collide", d3.forceCollide(6).iterations(10))
//       //   .force("center_force", d3.forceCenter(centerX, centerY))
//
//
//       let radius = d3.scaleLog().range([0, 8])
//
//       // draw circles for the nodes
//       let node = spaceSVG.append("g")
//                 .attr("class", "nodes")
//                 .selectAll("circle")
//                 .data(nodes)
//                 .enter()
//                 .append("circle")
//                 .attr("r", function(d) { return radius(d.count); })
//                 .attr("fill", "blue")
//                 .attr("opacity", 0.7);
//
//       // tick event
//       function tickActions() {
//         // update circle positions to reflect node updates on each tick
//         node.attr("cx", function(d) { return d.x - radius(d.count); })
//           .attr("cy", function(d) { return d.y - radius(d.count); })
//       }
//
//       let padding = 3;
//       function collide() {
//         for (var k = 0, iterations = 4, strength = 0.5; k < iterations; ++k) {
//           for (var i = 0, n = nodes.length; i < n; ++i) {
//             for (var a = nodes[i], j = i + 1; j < n; ++j) {
//               var b = nodes[j],
//                   x = a.x + a.vx - b.x - b.vx,
//                   y = a.y + a.vy - b.y - b.vy,
//                   lx = Math.abs(x),
//                   ly = Math.abs(y),
//                   r = a.r + b.r + padding;
//               if (lx < r && ly < r) {
//                 if (lx > ly) {
//                   lx = (lx - r) * (x < 0 ? -strength : strength);
//                   a.vx -= lx, b.vx += lx;
//                 } else {
//                   ly = (ly - r) * (y < 0 ? -strength : strength);
//                   a.vy -= ly, b.vy += ly;
//                 }
//               }
//             }
//           }
//         }
//       }
//   })
//
//
//
// }

function plot_bubble_chart(data, use_type) {
  // Update bar chart
  $(".chart div").remove()
  $(".chart p").remove()
  $(".chart hr").remove()

  // make color consistent with use type vis
  let typeColor = "white";
  if (use_type == "Civil") {typeColor = "#F9E79F"}
  else if (use_type == "Commercial") {typeColor = "#76D7C4"}
  else if (use_type == "Government") {typeColor = "#3498DB"}
  else if (use_type == "Military") {typeColor = "#E74C3C"}


  let bubble_data = []
  let format = d3.format(",d");

  // filter data by type
  data.filter(function(d) {
    return d.key === String(use_type);
  })[0].values.forEach(function(item) {
    if (item.values.length > 3) {
      bubble_data.push({
        id: item.key,
        value: +item.values.length,
        size: true
      })
    } else {
      bubble_data.push({
        id: item.key,
        value: +item.values.length,
        size: false
      })
    }
  })

  let pack = d3.pack()
    .size([width, height])
    .padding(1.5);

  let root = d3.hierarchy({children: bubble_data})
      .sum(function(d) { return d.value; })
      .each(function(d) {
        if (id = d.data.id) {
          var id, i = id.lastIndexOf(".");
          d.id = id;
          d.package = id.slice(0, i);
          d.class = id.slice(i + 1);
        }
      });

  // let g = spaceSVG.append("svg")
  //   .attr("width", 400)
  //   .attr("height", 400);

  let node = spaceSVG.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  typeColor = "white";
    if (use_type == "Civil") {typeColor = "#F9E79F"}
    else if (use_type == "Commercial") {typeColor = "#76D7C4"}
    else if (use_type == "Government") {typeColor = "#3498DB"}
    else if (use_type == "Military") {typeColor = "#EC7063"}


  node.append("circle")
      .attr("id", function(d) { return d.id; })
      .attr("fill",  "#010305")
      .attr("stroke", typeColor)
      .on("mouseover", function(d) {
        // clear text for new description
        $("#selectedSat").html("");

        var selectedSat = document.getElementById("selectedSat");
        var para = document.createElement("p");
        var node = document.createTextNode(String(d.id));
        para.appendChild(node);

        para.style.color = typeColor;
        para.style.fontSize = 20;
        para.style.fontWeight = 600;
        para.style.lineHeight = 1.2;
        para.style.marginBottom = 10;
        para.style.fontFamily = "Oswald"

        selectedSat.appendChild(para);

        var para = document.createElement("p");
        var node = document.createTextNode(
          String(d.value) + " " +
          String(use_type).toLowerCase() +
          " satellite(s)"
        );

        para.appendChild(node);

        para.style.color = "white";
        para.style.fontSize = 16;
        para.style.fontWeight = 200;
        para.style.lineHeight = 1.2;
        para.style.marginBottom = 4;

        selectedSat.appendChild(para);

        d3.select(this)
        // .attr("fill", typeColor)
        .transition()
            // .attr("r", d.r + 10)
            .style("stroke-width", 5)

      })
      .on("mouseout", function(d){
          $("#selectedSat").html("");
          d3.select(this).attr("fill", "#010305").transition()
          // .attr("r", d.r)
          .style("stroke-width", 1)
      })
      .attr("class", "circleNode")
      .attr("r", 0).transition().duration(1000)
      .attr("r", function(d) { return d.r; });



  // node.append("clipPath")
  //     .attr("id", function(d) { return "clip-" + d.id; })
  //       .append("use")
  //     .attr("xlink:href", function(d) { return "#" + d.id; });

  node.append("text")
    //   .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
    .selectAll("tspan")
    .data(function(d) {
      console.log(d)
      if (d.r > 20) {
        // console.log(d.r)
        return d.class.split(/(?=[A-Z][^A-Z])/g);
      } else {
        return ""
      }

    })
    .enter()
    .append("tspan")
    .attr("x", 0)
    .attr("y", function(d, i, nodes) {
      console.log(nodes)
      if (nodes === undefined) {
        delete d;
      } else {
        return 13 + (i - nodes.length / 2 - 0.5) * 10;
      }
    })
    .text(function(d) {
      // console.log(d)
      return d;
    })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-family", "Roboto");


}
