import React from 'react';
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import MyReviews from '../sites/user/MyReviews';
import {mockMyReviews} from "../mockData";

describe("Testing MyReviews component", () => {
    // mock route data
    var mock = new MockAdapter(axios);
    mock.onGet('/reviewedRoutes').reply(200, mockMyReviews);
    mock.onAny().reply(200);

    const {getByText, getByTestId, getByPlaceholderText} = render(<MyReviews/>);


    test("Change a review", async () => {

        // go in edit mode
        const editButton = await waitForElement(() => getByText("Edit"));
        expect(editButton).toBeDefined();
        fireEvent.click(editButton);

        // cancel edit mode
        const cancelButton = await waitForElement(() => getByText("Cancel"));
        expect(cancelButton).toBeDefined();
        fireEvent.click(cancelButton);

        // go in edit mode again
        const edit2Button = await waitForElement(() => getByText("Edit"));
        expect(edit2Button).toBeDefined();
        fireEvent.click(edit2Button);

        // change the review text
        const comment = await waitForElement(() => getByPlaceholderText("Add a comment..."));
        expect(comment).toBeDefined();
        fireEvent.change(comment, {target: {value: 'other comment'}});

        // change the review rating
        const rating = getByTestId('rating0');
        expect(rating).toBeDefined();
        fireEvent.change(rating, {target: {rating: 1}});

        const saveButton = getByText("Save");
        expect(saveButton).toBeDefined();
        fireEvent.click(saveButton);
    });

    test("Delete a review", async () => {
        const deleteButton = await waitForElement(() => getByText("Delete"));
        expect(deleteButton).toBeDefined();

        // delete the review
        fireEvent.click(deleteButton);
    });

});