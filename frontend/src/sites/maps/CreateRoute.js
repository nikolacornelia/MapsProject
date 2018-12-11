// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/
import L from 'leaflet';
import 'leaflet-easybutton';
import axios from "axios";

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

var template = 
'<header>' +
'<h3>Erstelle dein Highlight</h3>' +
'</header>' +
'<form id="popup-form">' +
'<p>' +
'<label for="sPName">Name:</label>' +
'</br>' +
'<input id="sPName" class="popup-input" type="text" />' +
'<p>' +
'<label for="sPDescription">Beschreibung:</label>' +
'</br>' +
'<textarea id="sPDescription" class="popup-textarea" type="text"></textarea>' +
'<p>' +
'<button id="button-submit" type="button">Save</button>' +
'<p>' +
'</form>';

var stateChangingButton = L.easyButton({
    states: [{
      stateName: 'ButtonOff',      
      icon:      'fa-star',               
      title:     'Turn Button On', 
      onClick: function(btn, map) {
        bHighlight = true;
        btn.button.style.backgroundColor = 'grey';
        btn.state('ButtonOn');                               
      }
    }, {
      stateName: 'ButtonOn',
      icon:      'fa-star',
      title:     'Turn Button Off',
      onClick: function(btn, map) {
        map.closePopup();
        bHighlight = false;
        btn.state('ButtonOff');
        btn.button.style.backgroundColor = 'white';
      }
    }]
  });

export function onInit() {
    map = L.map('map', {
        center: [20.0, 5.0],
        minZoom: 2,
        zoom: 2
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

    L.easyButton('fa-times', function () {
        deleteFunction();
    }, "Delete last point").addTo(map);

    stateChangingButton.addTo(map);

    //map.setView([49.47748, 8.42216], 15);

    map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
        .on('locationfound', function (e) {
        })
        .on('locationerror', function (e) {
            console.log(e);
            alert("Location access denied.");
        });

    map.on('click', onMapClick);

}

function onMapClick(e) {
    //Save Click Coordinates in variable;
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
function newPoint(){
    let oPoint = {};
    oPoint.name = document.getElementById("sPName").value;
    oPoint.description = document.getElementById("sPDescription").value;
    oPoint.latitude = dLatH;
    oPoint.longitude = dLngH;
    var jsonPoint = JSON.stringify(oPoint);
    axios.post('http://localhost:3001/savePoint', {
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

function connectHighlight(koordinaten) {
    aHighlight.push(1);
    console.log(koordinaten);
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

function deleteFunction() {
    if (aPoints.length > 1) {
        iDistance = iDistance - getDistance(aPoints[aPoints.length - 1], aPoints[aPoints.length - 2]);
        map.removeLayer(aPoly[aPoly.length - 1]);
        aPoly.splice(aPoly.length - 1, 1);
        console.log(iDistance);
    }
    if (aHighlight[aHighlight.length - 1] == 0) {
        map.removeLayer(aMarker[aMarker.length - 1]);
    }
    if (aMarker.length>0){
        aMarker.splice(aMarker.length - 1, 1);
        aPoints.splice(aPoints.length - 1, 1);
        aHighlight.splice(aHighlight.length - 1);
    }


}

async function onMapLoad(e) {
    await getPointsOfInterest();
}

function getPointsOfInterest() {
    //only get points that are in the bounds of the map
    axios.get('http://localhost:3001/getLocalPoints').then(function (response) {
        console.log("success");
        displayPoints(response.data);
    }).catch(function (err) {
        console.log(err);
    });
}

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
            console.log(this.getLatLng);
            connectHighlight(this.getLatLng());
        });
    });

    cities.eachLayer(function(layer) {
        layer.on('mouseover', function(){
            layer.openPopup();
        });
    });
}

//die funktion funktioniert noch nicht
function getDistance(origin, destination) {
    // return distance in meters
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
    console.log(oRoute);

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
}

function getRoutes() {
    axios.get('http://localhost:3001/getRoutes')
        .then((response) => {
            console.log(response);
        }).catch((error) => {
        console.log(error);
    });
}
 /** Nikola tried
export function getLocationFromIP() {
    axios.get('http://gd.geobytes.com/GetCityDetails',  {
        // mode: 'no-cors',

        /**headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        proxyHeaders: false,
        credentials: false})
        .then((response) => {
            console.log(response);
            return response.geobytescity;
        }).catch((error) => {
            console.log(error);
            return null;
    })

} **/