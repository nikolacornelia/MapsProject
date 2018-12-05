// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/
import L from 'leaflet';
import 'leaflet-easybutton';
import axios from "axios";

var dLat;
var dLng;
var aPoints = [];
var aMarker = [];
var aPoly = [];
var aHighlight = []; // Boolean
var map;
var yellowWaypoint;
var cities;
var popup;
var iDistance = 0;

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

    L.easyButton('fa-star', function () {
        //;
    }, "New Point of Interest").addTo(map);



    map.setView([49.47748, 8.42216], 15);

    map.locate({setView: true, watch: true}) /* This will return map so you can do chaining */
        .on('locationfound', function (e) {
        })
        .on('locationerror', function (e) {
            console.log(e);
            alert("Location access denied.");
        });

    map.on('click', onMapClick);

}


//var myURL = jQuery( 'script[src$="createRoute.js"]' ).attr( 'src' ).replace( 'createRoute.js', '' );

//var fs = require(' fs'); //Importing filesystem package
//var data = fs.readFileSync('highlights.json');
//var highlights = JSON.parse(data);


function onMapClick(e) {
    //Save Click Coordinates in variable;
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
        console.log(iDistance);
    }
    if (aHighlight[aHighlight.length - 1] == 0) {
        map.removeLayer(aMarker[aMarker.length - 1]);
    }
    map.removeLayer(aPoly[aPoly.length - 1]);
    aMarker.splice(aMarker.length - 1, 1);
    aPoints.splice(aPoints.length - 1, 1);
    aPoly.splice(aPoly.length - 1, 1);
    aHighlight.splice(aHighlight.length - 1);

}

function submitFunction() {
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
    var oBorder = {};
    oBorder.dMaxLong = map.getBounds().getEast();
    oBorder.dMinLong = map.getBounds().getWest();
    oBorder.dMaxLat = map.getBounds().getNorth();
    oBorder.dMinLat = map.getBounds().getSouth();
    axios.get('http://localhost:3001/getLocalPoints', {
        params: {border: oBorder}
    }).then(function (response) {
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
        mark.bindPopup("Test");//Hier würden wir gerne den Namen darstellen
        cities.addLayer(mark);
        console.log(arrayPoints[i]);
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

//die funktion funktioniert noch nicht
function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin.lng),
        lat1 = toRadian(origin.lat),
        lon2 = toRadian(destination.lng),
        lat2 = toRadian(destination.lat);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return (Math.round(c * EARTH_RADIUS * 10) / 10);
    
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
    var aPoints = [];
    var aMarker = [];
    var aPoly = [];
    var aHighlight = []; // Boolean
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