import React from 'react';
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MyRoutes from '../sites/user/MyRoutes';
import {mockMyRoutes, mockMyLikedRoutes} from "../mockData";

describe("Testing MyRoutes component", () => {
    // mock route data
    var mock = new MockAdapter(axios);
    mock.onGet('/getMyRoutes').reply(200, mockMyRoutes);
    mock.onGet('/getMyLikedRoutes').reply(200, mockMyLikedRoutes);
    mock.onAny().reply(200);

    const {getByText, getByTestId, getByPlaceholderText} = render(<MyRoutes/>);

    test("Delete my created route", async () => {
        const deleteButton = await waitForElement(() => getByText("Delete"));
        expect(deleteButton).toBeDefined();
        fireEvent.click(deleteButton);
    });

    test("Change tab to Routes I liked", () => {
        const tab = getByText("Routes I liked");
        expect(tab).toBeDefined();
        fireEvent.click(tab);
    });

    test("Delete my liked route", async () => {
        const deleteButton = await waitForElement(() => getByText("Delete"));
        expect(deleteButton).toBeDefined();
        fireEvent.click(deleteButton);
    });

});