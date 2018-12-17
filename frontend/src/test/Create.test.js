import React from 'react';
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Create from '../sites/Create';
import {mockHighlights} from "../mockData";


describe("Testing Create component", () => {
    var mock = new MockAdapter(axios);

    mock.onGet('/getLocalPoints').reply(200, mockHighlights);
    mock.onAny().reply(200);
    const { getByText, getByTestId, getByPlaceholderText, getByTitle } = render(<Create />);

    test("Find create form", () => {
        const formCreate = getByTestId("formCreate");
        expect(formCreate).toBeDefined();
    });

    test("Try to create a route", async () => {
        // mock save requests
        mock.onPost('/saveRoute').reply(200);

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

        // fill out form
        fireEvent.change(inputName, { target: { value: 'Route 1' } });
        fireEvent.change(inputDescription, { target: { value: 'Route Description example' } });
        fireEvent.click(radioEasy.childNodes.item(0));

        // try to upload an incorrect files
        const imageFile = getByPlaceholderText("Upload image file");
        expect(imageFile).toBeDefined();
        fireEvent.change(imageFile, {target: {files: [{type: 'abc', size: 10}]}});
        fireEvent.change(imageFile, {target: {files: [{type: 'image/jpg', size: 1000000000}]}});


        fireEvent.click(map, {
            containerPoint: { x: 442, y: 181},
            latlng: {lat: 1, lng: 2},
            layerPoint: {x: 1, y: 1}
        });

        // submit form
        fireEvent.submit(formCreate);

        const errorMessage = await waitForElement( ()=> getByText("Invalid route, please check your route consists of at least 2 points."));
        expect(errorMessage).toBeDefined();

        fireEvent.click(map, {
            containerPoint: { x: 443, y: 182},
            latlng: {lat: 4, lng: 3},
            layerPoint: {x: 3, y: 3}
        });

        fireEvent.click(map, {
            containerPoint: { x: 443, y: 182},
            latlng: {lat: 2, lng: 2},
            layerPoint: {x: 2, y: 2}
        });
        const deleteLastBtn = getByTitle("Delete last point");
        expect(deleteLastBtn).toBeDefined();
        fireEvent.click(deleteLastBtn);

        // create a highlight
        const addHighlightBtn = getByTitle("Add a highlight");
        fireEvent.click(addHighlightBtn);

        fireEvent.click(map, {
            containerPoint: { x: 443, y: 182},
            latlng: {lat: 2, lng: 2},
            layerPoint: {x: 2, y: 2}
        });



        // describe the highlight
        const highlightName = getByPlaceholderText("Enter highlight name");
        expect(highlightName).toBeDefined();
        fireEvent.change(highlightName, {target:{value: 'Some text'}});
        const highlightDescription = getByPlaceholderText("Enter highlight description");
        expect(highlightDescription).toBeDefined();
        fireEvent.change(highlightDescription, {target: {value: 'Some desc...'}})

        // save the highlight
        const saveHighlight = getByText("Save");
        fireEvent.click(saveHighlight);

        // submit form again
        fireEvent.submit(formCreate);

        const successMessage = await waitForElement(() => getByText("The route has successfully been created!"));
        expect(successMessage).toBeDefined();
    });



});