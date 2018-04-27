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

<<<<<<< HEAD
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
=======

>>>>>>> ef49740314423a34c99efae49472e3267bb2faf3
