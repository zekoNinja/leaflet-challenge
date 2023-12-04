// Defining my map layer and default coordinates 
let myMap = L.map("map", {
    center: [ 45.52, -122.67],
    zoom: 7
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Initializing the url
  let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  // using D3 to Jsonfiy the data from the url 

  d3.json(url).then(function(response) {
  
    console.log(response);

    // Create a new marker cluster group.
    let markers = L.layerGroup();

    // Defining features from the maps
    let features = response.features;

    // Defining a list to store all the earthquake data if needed
  
    let earthquakes = [];
    let popup = {};

    // For loop to read the json data from the maps
    for (let i = 0; i < features.length; i++) {
      let location = features[i].geometry;
      let info=features[i];

      if (location) {

        // console.log(location);

        // Defining the radius for the makers 
        let radius = features[i].properties.mag * 10000;

        // Writing the code block for adding earthquake data to the pop-up
        let popupContent = `<h3>Mag ${features[i].properties.mag}</h3><p>Depth: ${location.coordinates[2]} km</p>  <p>  Location: ${features[i].properties.place}  </p>`;

        // Pushing lon and lat to the earthquake 
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


     // Adding a legend to the map.
     let legend = L.control({ position: 'bottomright' });
     legend.onAdd = function (map) {
         let div = L.DomUtil.create('div', 'info legend');
         let grades_c = [0, 10, 30, 50, 70, 90];
         let labels = [];
 
         for (let i = 0; i < grades_c.length; i++) {
             div.innerHTML +=
                 '<i style="background:' + Color(grades_c[i] + 1) + '"></i> ' +
                 grades_c[i] + (grades_c[i + 1] ? '&ndash;' + grades_c[i + 1] + '<br>' : '+');
         }
 
         return div;
     };
 
     legend.addTo(myMap);
   
  });
  

  // Legend Function to assign colors based on depth of the EarthQuake 
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
