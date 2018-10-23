// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/
var dLat;
var dLng;
var aPoints = [];
var aMarker = new Array();
var aPoly = new Array();

var map = L.map( 'map', {
  center: [20.0, 5.0],
  minZoom: 2,
  zoom: 2
});

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



//var myURL = jQuery( 'script[src$="createRoute.js"]' ).attr( 'src' ).replace( 'createRoute.js', '' );

//var fs = require(' fs'); //Importing filesystem package
//var data = fs.readFileSync('highlights.json');
//var highlights = JSON.parse(data);

function onMapClick(e) {
  //Save Click Coordinates in variable;
  aPoints.push(e.latlng);
  aMarker[aMarker.length] = L.marker(aPoints[aPoints.length - 1]).addTo(map);
  aPoly[aPoly.length] = L.polyline(aPoints, {color: 'red'}).addTo(map);
}
map.on('click', onMapClick);

function deleteFunction(){
  map.removeLayer(aMarker[aMarker.length -1 ]);
  map.removeLayer(aPoly[aPoly.length - 1]);
  aMarker.splice(aMarker.length - 1,1);
  aPoints.splice(aPoints.length - 1,1);
  aPoly.splice(aPoly.length -1,1);
}
function submitFunction(){
  var sName = document.getElementById("name").value;
  var sDescription = document.getElementById("beschreibung").value;

  

  var objHighlight = {"Name": sName, "Beschreibung": sDescription, "Latitude": dLat, "Longitude": dLng};
  localStorage.setItem('myStorage', JSON.stringify(objHighlight));
  var objHighlight = JSON.parse(localStorage.getItem('myStorage'));

  //data.writeFile('highlights.json', newHighlight, finished);

}

var popup = L.popup();


