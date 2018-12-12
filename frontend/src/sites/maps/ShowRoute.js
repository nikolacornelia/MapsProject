import L from 'leaflet';
import axios from 'axios';

var map;
var yellowWaypoint;
var aLayers = L.layerGroup();
var sColor;

/**
 *  This function is being called when showRoute is initialized
 */
export function onInit(){
    map = L.map( 'map', {
        center: [20.0, 5.0],
        minZoom: 2
    });
    //map.on('load', onMapLoad);

    yellowWaypoint = L.icon({
        iconUrl: 'static/media/pin48Waypoint.png',
        iconSize:     [29, 24],
        iconAnchor:   [15, 23]
    });

    L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
    }).addTo( map );

    map.setView([49.47745177227496,8.422132675113554],16); //fake 
    // map.locate({setView: true, maxZoom: 16}).on('locationerror', function (e) {
    //     console.log("Location Acces denied");
    //     map.setView([49.47745177227496,8.422132675113554],16); 
    // });

    getPointsOfInterest();
}
export function displayRoutes(data){
    console.log(data);
    aLayers.clearLayers();
    map.flyTo(data[0].points[0],16);
    sColor = 'blue';
    for (var i = 0, len = data.length; i < len; i++) {
        console.log(data[i].points);
        displayRoute(data[i].points,data[i].highlights);
      }
}

export function displayOneRoute(data){
    sColor = 'green';
    aLayers.clearLayers();
    map.flyTo(data.points[0],16);
    displayRoute(data.points,data.highlights);
}
function displayRoute (aPoint, aHighlight){
    for (var i=0, len = aHighlight.length; i < len; i++){
       if (!aHighlight[i]) {
            aLayers.addLayer(new L.marker([aPoint[i].lat,aPoint[i].lng],{icon: yellowWaypoint}));
       }
       if (i > 0){
        console.log(aPoint[i].lat);
        console.log(aPoint[i-1].lat);
        aLayers.addLayer(L.polyline([[aPoint[i].lat,aPoint[i].lng], [aPoint[i-1].lat,aPoint[i-1].lng]],{color: sColor, weight: 3, dashArray: '20,15',smoothFactor: 1}));
       }
    }
    aLayers.addTo(map);
}

function getPointsOfInterest() {
    //only get points that are in the bounds of the map
    axios.get('http://localhost:3001/getLocalPoints').then(function (response) {
        console.log("success");
        displayPoints(response.data);
        console.log(response.data);
    }).catch(function (err) {
        console.log(err);
    });
}

function displayPoints(arrayPoints) {
    var cities = L.layerGroup();
    for (let i in arrayPoints) {
        let mark = L.marker([
            parseFloat(arrayPoints[i].latitude),
            parseFloat(arrayPoints[i].longitude)], {title: arrayPoints[i].name}
        );
        mark.bindPopup(arrayPoints[i].name +"</br>"+arrayPoints[i].description);//Hier würden wir gerne den Namen darstellen
        cities.addLayer(mark);
    }
    cities.addTo(map);

    cities.eachLayer(function(layer) {
        layer.on('mouseover', function(){
            layer.openPopup();
        });
    });
}

