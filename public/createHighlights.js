// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/
var dLat;
var dLng;
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
//Locate postion of user
map.locate({setView: true, watch: true})
.on('locationfound', function(e){})
.on('locationerror', function(e){
    console.log(e);
    alert("Location access denied.");
});

var myURL = jQuery( 'script[src$="createHighlights.js"]' ).attr( 'src' ).replace( 'createHighlights.js', '' )
var popup = L.popup();

function onMapClick(e) {
  popup
      .setLatLng(e.latlng)
      .setContent("Du hast die Map hier geklickt " + e.latlng.toString())
      .openOn(map);


  //Save Click Coordinates in variable;
  dLat = e.latlng.lat;
  dLng = e.latlng.lng;

}

function submitFunction(){
  var sName = document.getElementById("name").value;
  var sDescription = document.getElementById("beschreibung").value;
  var sCategory = document.getElementById("kategorie").value;


  var objHighlight = {"Name": sName, "Beschreibung": sDescription, "Kategorie": sCategory, "Latitude": dLat, "Longitude": dLng};
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



function displayPoints(arrayPoints) {
  for (let i in arrayPoints) {
      let mark = L.marker([
          parseFloat(arrayPoints[i].latitude),
          parseFloat(arrayPoints[i].longitude)], {title: arrayPoints[i].name}
        );
      mark.addTo(map);
      console.log(arrayPoints[i]);
  }}






