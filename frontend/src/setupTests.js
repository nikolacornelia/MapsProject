import L from "leaflet";
//import * as ShowRoute from "./sites/maps/ShowRoute";

require('jest-localstorage-mock');

// mock sessionStorage to pretend to be logged in
sessionStorage.setItem("user", JSON.stringify({username: 'xyz'}));

window.alert = jest.fn();

// mock leaflet map layers
L.layerGroup = jest.fn(() => {
    return {
        addTo: jest.fn(),
        addLayer: jest.fn(),
        clearLayers: jest.fn()
    };
});
L.polyline = jest.fn(()=>{ return { addTo: jest.fn() }})