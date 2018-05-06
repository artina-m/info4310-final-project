/* Transition Functions */

/* Build Overlay */
function overlay () {
    on();
    let world = spaceSVG
        .append("image")
        .attr("xlink:href", "worlmapblue.png")
        .attr("class", "world")
        .attr("y", centerY - 40)
        .attr("x", centerX - 40)
        .attr("width", 80);
    
    document.getElementById("overlay").onclick = start;
    document.getElementById("textBar1").style.marginTop = 800;
    document.getElementById("textBar1").style.opacity = 0;
    document.getElementById("textBar2").style.marginTop = 800;
    document.getElementById("textBar2").style.opacity = 0;
}

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
    $( "#textBar1" ).animate({
    opacity: 1,
    marginTop: "200"
    }, 600, function() {
    // Animation complete.
  });
    
    $( "#textBar2" ).animate({
    opacity: 1,
    marginTop: "0"
    }, 600, function() {
    // Animation complete.
  });
}


/* Launch Satellities*/
let start = function () {
    off();
    spaceSVG.select(".world").remove()
    let world = spaceSVG
        .append("image")
        .attr("xlink:href", "worlmapblue.png")
        .attr("class", "world")
        .attr("y", centerY - 40)
        .attr("x", centerX - 40)
        .attr("width", 80);

    // remove pixels to "restart" plotting
    spaceSVG.selectAll("g").selectAll("circle").remove();
    spaceSVG.selectAll(".factText").remove();
    spaceSVG.selectAll("line").remove();

    // append tooltip texts
    spaceSVG.append("text")
    .text("1738")
    .attr("x", alignX).attr("y", 50)
    .attr("class","factText")
    .style("font-size", 24).attr("fill", "white")

    spaceSVG.append("text")
    .text("Active orbiting satillites")
    .attr("x", alignX).attr("y", 70)
    .attr("class","factText")
    .style("font-size", 16)
    .attr("fill", "white")

    // add separator line between title and dynamic info for tooltips
    spaceSVG.append("line")
    .attr("x1", alignX).attr("x2", alignX +200)
    .attr("y1", 90).attr("y2", 90)
    .attr("class", "factText")
    .attr("stroke", "lightgrey").attr("stroke-width", 0.5)

    // load data
    d3.csv("UCS_Satellite_Database.csv", parseLine, function (error, data) {
      satData = data;
      useCase = useCaseProportion(satData)



      d3.csv("use.csv", function (error, data2) {
        flatData = data2;
        plot_use("useViz", flatData);
      });

      satData.forEach(function (d) {
        setTimeout(function () { plot_satellites(d) }, 100)
      });

      //prepare data for Demers Cartogram
      dataByCountry = d3.nest()
        .key((d) => d.country)
        .entries(satData);

    });

    // Edit visibility of buttons
    document.getElementById("comB").style.visibility = "hidden";
    document.getElementById("civB").style.visibility = "hidden";
    document.getElementById("govB").style.visibility = "hidden";
    document.getElementById("milB").style.visibility = "hidden";
      
  };

/* Transition to user type view */
function callUseCase() {
    document.getElementById("comB").style.visibility = "visible";
    document.getElementById("civB").style.visibility = "visible";
    document.getElementById("govB").style.visibility = "visible";
    document.getElementById("milB").style.visibility = "visible";
    
    filterByType2("Commercial")
}

/* Transition to country view */
function callCountry() {
    force_layout(dataByCountry)
}

/* Transition to bottom infograph */
function callNextSection() {}



let filter_year_and_purpose = function(data, year, purpose) {
  data.filter(function(d) {
    return d.year === Number(year) && d.purpose === String(purpose);
  })
}

let filter_year = function(data, year) {
  data.filter( function(d) {
    return d.year === +year
  })
}

// Calculate use case proportions for main viz
function useCaseProportion(data) {
    let useCase = [];
    var counts = {};
    let piBreak = {}
    let total = data.length;

    // Get counts
    data.forEach(function (d) { useCase.push(d.users) })

    for (var i = 0; i < useCase.length; i++) {
        var num = useCase[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }

    // Group into 4 main categories
    groupedCount = {
        Civil: counts["Civil"] + counts["Civil/Government"] + counts["Government/Civil"] + counts["Military/Civil"],
        Commercial: counts["Commercial"] + counts["Commercial/Government"] + counts["Commercial/Government/Military"] + counts["Commercial/Military"] + counts["Commerical"] + counts["Government/Commercial"] + counts["Military/Commercial"],
        Government: counts["Civil/Government"] + counts["Commercial/Government"] + counts["Commercial/Government/Military"] + counts["Government"] + counts["Government/Civil"] + counts["Government/Commercial"] + counts["Government/Military"] + counts["Military/Government"],
        Military: counts["Commercial/Government/Military"] + counts["Commercial/Military"] + counts["Government/Military"] + counts["Military/Civil"] + counts["Military/Commercial"] + counts["Military/Government"]
    }

    len = 4
    keys = Object.keys(groupedCount)

    // Get percentage
    let start = 0;
    for (i = 0; i < len; i++) {
        k = keys[i];
        frac = groupedCount[k] / total
        piPercent = (2 * Math.PI) * frac;
        end = start + piPercent;
        piBreak[k] = { s: start, e: end }
        start = end;
    }
    return [counts, groupedCount,piBreak];
}

// Top right corner text box
function satTextBox(svg, d, c, lineHeight){
    header = svg.append("text")
        .text(d.satName)
        .attr("class", "satInfo")
        .attr("id", "header")
        .attr("fill", c)
        .attr("x", alignX )
        .attr("y", lineHeight)
        .call(wrap,200)

    var numberOfLines = 15* (document.getElementsByTagName('tspan').length) + lineHeight;

    subtextColor = "grey"

    svg.append("text")
        .text(d.country)
        .attr("class", "satInfo")
        .attr("fill", "white")
        .attr("x", alignX)
        .attr("y", numberOfLines + 10)
        .style("font-size", 14)

    svg.append("text")
        .text(d.users+ "  Satellite")
        .attr("class", "satInfo")
        .attr("fill", subtextColor)
        .attr("x", alignX)
        .attr("y", numberOfLines + 40)
        .style("font-size", 12)

    svg.append("text")
        .text("Purpose:  " + d.purpose)
        .attr("class", "satInfo")
        .attr("fill", subtextColor)
        .attr("x", alignX)
        .attr("y",  numberOfLines + 60)
        .style("font-size", 12)

    svg.append("text")
        .text("Orbit Class: " + d.orbitClass)
        .attr("class", "satInfo")
        .attr("fill", subtextColor)
        .attr("x", alignX)
        .attr("y", numberOfLines + 80)
        .style("font-size", 12)

    svg.append("text")
        .text("Launch Date: " + String(d.launchDate).substring(0,16))
        .attr("class", "satInfo")
        .attr("fill", subtextColor)
        .attr("x", alignX)
        .attr("y", numberOfLines + 100)
        .style("font-size", 12)

    svg.append("text")
        .text("Expected Lifetime: " + d.expectedLifetime)
        .attr("class", "satInfo")
        .attr("fill", subtextColor)
        .attr("x", alignX)
        .attr("y", numberOfLines + 120)
        .style("font-size", 12)    
}


// Wrap SVG text function
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("class", "tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}


/* Code used below to generate flatuse data */

 // data counts by major country and use
//  let satCountNest = d3.nest()
//  .key(function (d) { return d.country; })
//  .key(function (d) { return d.users; })
//  .rollup(function (v) { return v.length; })
//  .entries(satData);

// // four major countries
// let satCountFourCountries = satCountNest.filter(function (d) {
//  return d.key == "China" || d.key == "USA" || d.key == "Russia" || d.key == "India";
// });

// let satCountFourCountriesFlat = []
// satCountFourCountries.forEach(function (country) {
//  country.values.forEach(function (countryVals) {
//    if (countryVals.key == "Military" || countryVals.key == "Commercial" || countryVals.key == "Civil" || countryVals.key == "Government") {
//      satCountFourCountriesFlat.push({
//        country: country.key,
//        use: countryVals.key,
//        count: countryVals.value
//      });
//    }
//  });
// });

// summarize data by country
function nest_by_country_and_use(data) {
  return d3.nest()
    .key((d) => d.users)
    .key((d) => d.country)
    .entries(data);
}
