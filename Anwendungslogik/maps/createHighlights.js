// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/
var lat;
var lng;
var map = L.map( 'map', {
  center: [20.0, 5.0],
  minZoom: 2,
  zoom: 2
})




L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ['a', 'b', 'c']
}).addTo( map )

var HELSINKI = [60.1708, 24.9375];
map.setView(HELSINKI, 15);

map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
.on('locationfound', function(e){})
.on('locationerror', function(e){
    console.log(e);
    alert("Location access denied.");
});

var myURL = jQuery( 'script[src$="createHighlights.js"]' ).attr( 'src' ).replace( 'createHighlights.js', '' )

//var fs = require(' fs'); //Importing filesystem package
//var data = fs.readFileSync('highlights.json');
//var highlights = JSON.parse(data);

function onMapClick(e) {
  popup
      .setLatLng(e.latlng)
      .setContent("Du hast die Map hier geklickt " + e.latlng.toString())
      .openOn(map);


  //Save Click Coordinates in variable;
  lat = e.latlng.lat;
  lng = e.latlng.lng;

}

map.on('click', onMapClick);

function submitFunction(){
  var name = document.getElementById("name").value;
  var beschreibung = document.getElementById("beschreibung").value;
  var kategorie = document.getElementById("kategorie").value;
  

  var objHighlight = {"Name": name, "Beschreibung": beschreibung, "Kategorie": kategorie, "Latitude": lat, "Longitude": lng};
  localStorage.setItem('myStorage', JSON.stringify(objHighlight));
  var objHighlight = JSON.parse(localStorage.getItem('myStorage'));

  //data.writeFile('highlights.json', newHighlight, finished);

}

var popup = L.popup();


