let myMap = L.map("map", {
    center: [ 45.52, -122.67],
    zoom: 7
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(url).then(function(response) {
  
    console.log(response);

    // Create a new marker cluster group.
    let markers = L.layerGroup();



    let features = response.features;
  
    let earthquakes = [];
    let popup = {};
  
    for (let i = 0; i < features.length; i++) {
      let location = features[i].geometry;
      let info=features[i]
      if (location) {

        // console.log(location);

        let radius = features[i].properties.mag * 10000;

        // let color = colorScale();

        let popupContent = `<h3>Mag ${features[i].properties.mag}</h3><p>Depth: ${location.coordinates[2]} km</p>`;

        earthquakes.push([location.coordinates[1], location.coordinates[0]]);

         markers.addLayer(L.circle([location.coordinates[1], location.coordinates[0]], {
                radius: radius,
                color: Color(location.coordinates[2]), 
                fillOpacity: 0.7
            }).bindPopup(popupContent));



      }
  
    }


    // Add our marker cluster layer to the map.
    myMap.addLayer(markers);


     // Add a legend to the map.
     let legend = L.control({ position: 'bottomright' });
     legend.onAdd = function (map) {
         let div = L.DomUtil.create('div', 'info legend');
         let grades = [0, 10, 30, 50, 70, 90];
         let labels = [];
 
         for (let i = 0; i < grades.length; i++) {
             div.innerHTML +=
                 '<i style="background:' + Color(grades[i] + 1) + '"></i> ' +
                 grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
         }
 
         return div;
     };
 
     legend.addTo(myMap);
   
  });
  


  function Color(depth) {
    switch(true) {
      case depth > 90:
        return "blue";
      case depth > 70:
        return "orange";
      case depth > 50:
        return "red";
      case depth > 30:
        return "black";
      case depth > 10:
        return "green";
      default:
        return "yellow";
    }
  }
