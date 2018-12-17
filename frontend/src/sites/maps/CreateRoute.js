// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/
import L from 'leaflet';
import 'leaflet-easybutton';
import 'leaflet-control-geocoder';
import axios from "axios";
import { modelNames } from 'mongoose';

var dLat;
var dLng;
var dLatH;
var dLngH;
var aPoints = [];
var aMarker = [];
var aPoly = [];
var aHighlight = []; // Boolean
var map;
var yellowWaypoint;
var cities;
var popup;
var iDistance = 0;
var bHighlight = false;

// HTML Template to create new Highlights
var template = 
'<header>' +
'<h3>Create Highlight</h3>' +
'</header>' +
'<form id="popup-form">' +
'<p>' +
'<label for="sPName">Name:</label>' +
'</br>' +
'<input id="sPName" placeholder="Enter highlight name" class="popup-input" type="text" required/>' +
'<p>' +
'<label for="sPDescription">Description:</label>' +
'</br>' +
'<textarea id="sPDescription" placeholder="Enter highlight description" class="popup-textarea" type="text" required></textarea>' +
'<p>' +
'<button id="button-submit" type="submit">Save</button>' +
'<p>' +
'</form>';

// Button to create highlights (color switching)
var stateChangingButton = L.easyButton({
    states: [{
      stateName: 'ButtonOff',      
      icon:      'fa-star',               
      title:     'Add a highlight',
      onClick: function(btn, map) {
        bHighlight = true;
        btn.button.style.backgroundColor = 'grey';
        btn.state('ButtonOn');                               
      }
    }, {
      stateName: 'ButtonOn',
      icon:      'fa-star',
      title:     'Add a highlight',
      onClick: function(btn, map) {
        map.closePopup();
        bHighlight = false;
        btn.state('ButtonOff');
        btn.button.style.backgroundColor = 'white';
      }
    }]
  });

// inital Map Load
export function onInit() {
    map = L.map('map', {
        center: [20.0, 5.0],
        minZoom: 2
    });
    yellowWaypoint = L.icon({
        iconUrl: './static/media/pin48Waypoint.png',
        iconSize: [29, 24],
        iconAnchor: [15, 23]
    });

    cities = L.layerGroup();
    popup = L.popup();
    map.on('load', onMapLoad);
    map.on('click', onMapClick);
    map.on('moveend', onMapLoad);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
    }).addTo(map);

    //Search Bar
    L.Control.geocoder({
        defaultMarkGeocode: false
      }).on('markgeocode', function(e) {
        map.flyTo(e.geocode.center,16);
      }).addTo(map);

    //Delete Button
    L.easyButton('fa-times', function () {
        deleteFunction();
    }, "Delete last point").addTo(map);

    stateChangingButton.addTo(map);
    map.setView([49.47745177227496,8.422132675113554],16); // fake 
    // map.locate({setView: true, maxZoom: 16}).on('locationerror', function (e) {
    //     map.setView([49.47745177227496,8.422132675113554],16);
    //     console.log("Location Acces denied"); 
    // });
}

//Save Click Coordinates in variable and decide between Highlight and normal Point
function onMapClick(e) {
    if (!bHighlight){
        aHighlight.push(0);
        aPoints.push(e.latlng);
        aMarker[aMarker.length] = new L.marker(aPoints[aPoints.length - 1], {icon: yellowWaypoint}).on('click', connectPoint).addTo(map);
        aPoly[aPoly.length] = L.polyline(aPoints, {
            color: 'blue',
            weight: 3,
            dashArray: '20,15',
            smoothFactor: 1
        }).addTo(map);
        if (aPoints.length > 1) {
            iDistance = iDistance + getDistance(aPoints[aPoints.length - 1], aPoints[aPoints.length - 2]);
            console.log(iDistance);
        }
    }
    else if (bHighlight){
            popup
            .setLatLng(e.latlng)
            .setContent(template)
            .openOn(map);
        //Save Click Coordinates in variable;
        dLatH = e.latlng.lat;
        dLngH = e.latlng.lng;
        document.getElementById ("button-submit").addEventListener ("click", function(){ newPoint(); }, false);

    }
}

// save new Highlight
function newPoint(){
    let oPoint = {};
    oPoint.name = document.getElementById("sPName").value;
    oPoint.description = document.getElementById("sPDescription").value;
    if (oPoint.name==='' || oPoint.description==='') {
        return;
    }
    oPoint.latitude = dLatH;
    oPoint.longitude = dLngH;
    var jsonPoint = JSON.stringify(oPoint);
    axios.post('/savePoint', {
        data: {point: jsonPoint}
    }).then(function (response) {
        console.log("success");
        displayPoints(response.data);
    }).catch(function (err) {
        console.log(err);
    });
    L.marker([dLatH, dLngH]).bindPopup(oPoint.name+"</br>"+oPoint.description).on('mouseover', function(){
        this.openPopup();
    }).addTo(map);
    connectHighlight({lat:dLatH, lng:dLngH});
    bHighlight = false;
    map.closePopup();
    stateChangingButton.state('ButtonOff');
    stateChangingButton.button.style.backgroundColor = 'white';
    
  }

// connect Markers -> triggered by a event 
function connectPoint(e) {
    aHighlight.push(0);
    aPoints.push(e.latlng);
    aMarker[aMarker.length] = null;
    aPoly[aPoly.length] = L.polyline(aPoints, {
        color: 'blue',
        weight: 3,
        dashArray: '20,15',
        smoothFactor: 1
    }).addTo(map);
    if (aPoints.length > 1) {
        iDistance = iDistance + getDistance(aPoints[aPoints.length - 1], aPoints[aPoints.length - 2]);
        console.log(iDistance);

    }
}

//connect Hihglights -> triggered manually 
function connectHighlight(koordinaten) {
    aHighlight.push(1);
    aPoints.push(koordinaten);
    aMarker[aMarker.length] = null;
    aPoly[aPoly.length] = L.polyline(aPoints, {
        color: 'blue',
        weight: 3,
        dashArray: '20,15',
        smoothFactor: 1
    }).addTo(map);
    if (aPoints.length > 1) {
        iDistance = iDistance + getDistance(aPoints[aPoints.length - 1], aPoints[aPoints.length - 2]);
        console.log(iDistance);

    }
}

//deletes the lasat point/highlight and poly
function deleteFunction() {
    if (aPoints.length > 1) {
        iDistance = iDistance - getDistance(aPoints[aPoints.length - 1], aPoints[aPoints.length - 2]);
        if(aPoly[aPoly.length - 1])
            map.removeLayer(aPoly[aPoly.length - 1]);
        aPoly.splice(aPoly.length - 1, 1);
    }
    if (aHighlight[aHighlight.length - 1] == 0) {
        if (aMarker[aMarker.length - 1] != null){
            map.removeLayer(aMarker[aMarker.length - 1]);
        }
    }
    if (aMarker.length>0){
        aMarker.splice(aMarker.length - 1, 1);
        aPoints.splice(aPoints.length - 1, 1);
        aHighlight.splice(aHighlight.length - 1);
    }
}

// load Highlights from DB
async function onMapLoad(e) {
    await getPointsOfInterest();
}
function getPointsOfInterest() {
    //only get points that are in the bounds of the map
    axios.get('/getLocalPoints').then(function (response) {
        console.log("success");
        displayPoints(response.data);
    }).catch(function (err) {
        console.log(err);
    });
}

// display Highlights from DB on map
function displayPoints(arrayPoints) {
    for (let i in arrayPoints) {
        let mark = L.marker([
            parseFloat(arrayPoints[i].latitude),
            parseFloat(arrayPoints[i].longitude)], {title: arrayPoints[i].name}
        );
        mark.bindPopup(arrayPoints[i].name +"</br>"+arrayPoints[i].description);
        cities.addLayer(mark);
    }
    cities.addTo(map);
    cities.eachLayer(function(layer) {
        layer.on('click', function(){
            connectHighlight(this.getLatLng());
        });
    });
    cities.eachLayer(function(layer) {
        layer.on('mouseover', function(){
            layer.openPopup();
        });
    });
}
// return distance in meters
function getDistance(origin, destination) {
    // choose the right array type
    if (origin.lat == null){
        var lon1 = toRadian(origin[0]),
        lat1 = toRadian(origin[1]);
        if (destination.lat == null){
            var lon2 = toRadian(destination[0]),
                lat2 = toRadian(destination[1]);
        }else{
            var lon2 = toRadian(destination.lat),
                lat2 = toRadian(destination.lng);
        }
    }else{
        var lon1 = toRadian(origin.lat),
            lat1 = toRadian(origin.lng);
            if (destination.lat == null){
                var lon2 = toRadian(destination[0]),
                    lat2 = toRadian(destination[1]);
            }else{
                var lon2 = toRadian(destination.lat),
                    lat2 = toRadian(destination.lng);
            }
    }
    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;
    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    var distance = (c * EARTH_RADIUS) ;
    distance = Math.round(distance*10)/10;
    return distance;
}
function toRadian(degree) {
    return degree*Math.PI/180;
}

//Points and Highlights for frontend
export function getRouteMapData() {
    let oRoute = {};
    oRoute.points = aPoints;
    oRoute.highlights = aHighlight;
    oRoute.distance = iDistance;
    return oRoute;
}

//reset array after route was created successfully
export function resetArrays() {
    for (var i=0, len = aPoly.length; i < len; i++){
        map.removeLayer(aPoly[i]);
    }
    for (var i=0, len = aMarker.length; i < len; i++){
        if (aMarker[i] != undefined){
            map.removeLayer(aMarker[i]);
        }
    }
    aPoints = [];
    aMarker = [];
    aPoly = [];
    aHighlight = []; // Boolean
    iDistance = 0;
}