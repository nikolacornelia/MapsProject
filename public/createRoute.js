// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/
var dLat;
var dLng;
var aPoints = [];
var aMarker = new Array();
var aPoly = new Array();
var aHighlight = new Array(); // Boolean

var map = L.map( 'map', {
  center: [20.0, 5.0],
  minZoom: 2,
  zoom: 2
})
map.on('load', onMapLoad);
map.on('click', onMapClick);
map.on('moveend', onMapLoad);

L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c']
}).addTo( map )

map.setView([49.47748, 8.42216], 15);

map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
.on('locationfound', function(e){})
.on('locationerror', function(e){
    console.log(e);
    alert("Location access denied.");
});

var yellowWaypoint = L.icon({
  iconUrl: 'pin48Waypoint.png',
    iconSize:     [29, 24],
    iconAnchor:   [15, 23]
});


//var myURL = jQuery( 'script[src$="createRoute.js"]' ).attr( 'src' ).replace( 'createRoute.js', '' );

//var fs = require(' fs'); //Importing filesystem package
//var data = fs.readFileSync('highlights.json');
//var highlights = JSON.parse(data);

function onMapClick(e) {
  //Save Click Coordinates in variable;
  aHighlight.push(0);
  aPoints.push(e.latlng);
  aMarker[aMarker.length] = L.marker(aPoints[aPoints.length - 1],{icon: yellowWaypoint}).addTo(map);
  aPoly[aPoly.length] = L.polyline(aPoints, {color: 'red'}).addTo(map);
}
map.on('click', onMapClick);

function connectPoint(koordinaten){
  aHighlight.push(1);
  aPoints.push(koordinaten);
  aMarker[aMarker.length] = null;
  aPoly[aPoly.length] = L.polyline(aPoints, {color: 'red'}).addTo(map);
}


function deleteFunction(){
 if(aHighlight[aHighlight.length-1]==0){
  map.removeLayer(aMarker[aMarker.length -1 ]);
 }
  map.removeLayer(aPoly[aPoly.length - 1]);
  aMarker.splice(aMarker.length - 1,1);
  aPoints.splice(aPoints.length - 1,1);
  aPoly.splice(aPoly.length -1,1);
  aHighlight.splice(aHighlight.length -1);

}
function submitFunction(){
  var sName = document.getElementById("name").value;
  var sDescription = document.getElementById("beschreibung").value;



  var objHighlight = {"Name": sName, "Beschreibung": sDescription, "Latitude": dLat, "Longitude": dLng};
  localStorage.setItem('myStorage', JSON.stringify(objHighlight));
  var objHighlight = JSON.parse(localStorage.getItem('myStorage'));

  //data.writeFile('highlights.json', newHighlight, finished);

}
async function onMapLoad(e) {
  await getLocalPointsOfInterest();
}

function getLocalPointsOfInterest() {
  //only get points that are in the bounds of the map
  oBorder = {}
  oBorder.dMaxLong = map.getBounds().getEast();
  oBorder.dMinLong = map.getBounds().getWest();
  oBorder.dMaxLat = map.getBounds().getNorth();
  oBorder. dMinLat = map.getBounds().getSouth();
  $.ajax({
     type: 'GET',
      url: 'http://localhost:3001/getLocalPoints',
      dataType: "json",
      data: {border: oBorder},
      success: function(data) {
          console.log("success");
          displayPoints(data);
      },
      error: function(err) {
         console.log(err);
      }
  });
}
var cities = L.layerGroup();

function displayPoints(arrayPoints) {
  for (let i in arrayPoints) {
      let mark = L.marker([
          parseFloat(arrayPoints[i].latitude),
          parseFloat(arrayPoints[i].longitude)], {title: arrayPoints[i].name}
        );
      cities.addLayer(mark);
      console.log(arrayPoints[i]);
  }
  cities.addTo(map);

  cities.eachLayer(function(layer) {
    layer.on('click', function(){
      connectPoint(this.getLatLng());
  });
});
}

var popup = L.popup();

//@Nikola please check
function newEntry(){
  let oRoute = {};
    oRoute.name = document.getElementById("sName").value;
    oRoute.description = document.getElementById("sDescription").value;
    oRoute.points = aPoints; // min aPoints & aHighlight muss gespeichert werden, die anderen beiden würden es vereinfachen.
    oRoute.marker = aMarker;
    oRoute.poly = aPoly;
    oRoute.highlight = aHighlight;
    jsonRoute = JSON.stringify(oRoute);
    //console.log(jsonPoint);
    $.ajax({
        type: 'POST',
        data: { route: jsonRoute },
        datatype: 'json',
        url: 'http://localhost:3001/saveRoute',
        success: function(data) {
            console.log('saved document');
        }
    });
}

