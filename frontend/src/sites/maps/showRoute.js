import L from 'leaflet';
import axios from 'axios';

var map;
var yellowWaypoint;

/**
 *  This function is being called when showRoute is initialized
 */
export function onInit(){
    map = L.map( 'map', {
        center: [20.0, 5.0],
        minZoom: 2,
        zoom: 2
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
}

function displayRoute (aPoints, aHighlights){
   var iCounter = 0;
   var aHighlightMarker =[];

  /* while (iCounter < aPoints.length()){
       if (aHighlights[iCounter]==1){
         aHighlightMarker[aHighlightMarker.length] = new L.marker(aPoints[iCounter]).on('click',connectPoint).on('mouseover', function(){
            layer.openPopup();
         });
         aHighlightMarker[aHighlightMarker.length].bindPopup('Test');
         aHighlightMarker[aHighlightMarker.length].addTo(map);
         L.polyline(aPoints, {color: 'blue', weight: 3, dashArray: '20,15',smoothFactor: 1}).addTo(map);
       }else {
            new L.marker(aPoints[iCounter],{icon: yellowWaypoint}).addTo(map);
            L.polyline(aPoints, {color: 'blue', weight: 3, dashArray: '20,15',smoothFactor: 1}).addTo(map);
       }
   }*/
}
