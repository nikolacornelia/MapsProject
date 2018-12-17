import L from 'leaflet';
import 'leaflet-easybutton';
import 'leaflet-control-geocoder';
//import * as ShowRoute from "./sites/maps/ShowRoute";

require('jest-localstorage-mock');

// mock sessionStorage to pretend to be logged in
sessionStorage.setItem("user", JSON.stringify({username: 'xyz'}));

window.alert = jest.fn();

// mock leaflet map layers
let mockLeaflet = jest.fn(() => {
    return {
        addTo: jest.fn(),
        addLayer: jest.fn(),
        clearLayers: jest.fn(),
        eachLayer: jest.fn(),
        removeLayer: jest.fn()
    };
});

L.layerGroup = mockLeaflet;
L.polyline = jest.fn(()=>{ return { addTo: jest.fn() }});
L.layer = mockLeaflet;
