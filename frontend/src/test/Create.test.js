import React from 'react';
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Create from '../sites/Create';


describe("Testing Create component", () => {
    const { getByText, getByTestId, getByPlaceholderText } = render(<Create />);
    var mock = new MockAdapter(axios);

    test("Find create form", () => {
        const formCreate = getByTestId("formCreate");
        expect(formCreate).toBeDefined();
    });

    test("Try to create a route", () => {
        const map = getByTestId("map");
        expect(map).toBeDefined();
        const formCreate = getByTestId("formCreate");
        expect(formCreate).toBeDefined();
        const inputName = getByPlaceholderText("Name of the route");
        expect(inputName).toBeDefined();
        const inputDescription = getByPlaceholderText("Description of the route");
        expect(inputDescription).toBeDefined();
        const radioEasy = getByTestId('radioEasy');
        expect(radioEasy).toBeDefined();

/*
containerPoint: Object { x: 442.2293720809549, y: 181.95213236004795 }
​
latlng: Object { lat: 49.477341326635326, lng: 8.421282921668825 }
​
layerPoint: Object { x: 442.2293720809549, y: 331.9521323600479 }
​
originalEvent: click { target: div#map.leaflet-container.leaflet-touch.leaflet-retina.leaflet-fade-anim.leaflet-grab.leaflet-touch-drag.leaflet-touch-zoom
, clientX: 442, clientY: 261, … }
​
sourceTarget: Object { _leaflet_id: 5, _containerId: 6, _fadeAnimated: true, … }
​
target: Object { _leaflet_id: 5, _containerId: 6, _fadeAnimated: true, … }
​
type: "click"
 */

        // fill out form
        fireEvent.change(inputName, { target: { value: 'Route 1' } });
        fireEvent.change(inputDescription, { target: { value: 'Route Description example' } });
        fireEvent.click(radioEasy);

        fireEvent.click(map, {
            containerPoint: { x: 442, y: 181},
            latlng: {lat: 1, lng: 2},
            layerPoint: {x: 1, y: 1}
        });

        // mock save requests
        mock.onPost('/saveRoute').reply(200);

        // submit form
        fireEvent.submit(formCreate);


        const errorMessage = getByText("Invalid route, please check your route consists of at least 2 points.");
        expect(errorMessage).toBeDefined();
    });



});