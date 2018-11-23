// See post: http://asmaloney.com/2014/01/code/creating-an-interactive-map-with-leaflet-and-openstreetmap/
import L from 'leaflet';
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
    aMarker[aMarker.length] = L.marker(aPoints[aPoints.length - 1], {icon: yellowWaypoint}).addTo(map);
    aPoly[aPoly.length] = L.polyline(aPoints, {color: 'red'}).addTo(map);
}

function connectPoint(koordinaten) {
    aHighlight.push(1);
    aPoints.push(koordinaten);
    aMarker[aMarker.length] = null;
    aPoly[aPoly.length] = L.polyline(aPoints, {color: 'red'}).addTo(map);
}


function deleteFunction() {
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
    objHighlight = JSON.parse(localStorage.getItem('myStorage'));

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
    /*$.ajax({
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
    });*/
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

    cities.eachLayer(function (layer) {
        layer.on('click', function () {
            connectPoint(this.getLatLng());
        });
    });

    cities.eachLayer(function (layer) {
        layer.on('mouseover', function () {
            layer.openPopup();
        });
    });
}

function newEntry() {
    console.log('createRoute new Entry');
    let oRoute = {};
    oRoute.name = document.getElementById("sName").value;
    oRoute.description = document.getElementById("sDescription").value;
    oRoute.points = aPoints;
    //oRoute.marker = aMarker;
    //oRoute.poly = aPoly;
    oRoute.highlights = aHighlight;
    let jsonRoute = JSON.stringify(oRoute);

}

//Points and Highlights for frontend
export function getRouteMapData() {
    let oRoute = {};
    oRoute.points = aPoints;
    oRoute.highlights = aHighlight;
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