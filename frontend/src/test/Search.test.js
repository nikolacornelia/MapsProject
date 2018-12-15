import React from 'react';
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Search from '../sites/Search';
import {mockData, mockRatings, mockHighlights} from "../mockData";

describe("Testing Search component", () => {
    const {getByText, getByTestId, getByPlaceholderText} = render(<Search/>);
    var mock = new MockAdapter(axios);

    test("Try to search for routes", async () => {
        // mock route data
        mock.onGet('/getRoutes').reply(200, mockData);
        mock.onGet('/getRatings').reply(200, mockRatings);
        mock.onGet('/getLocalPoints').reply(200, mockHighlights);
        mock.onAny().reply(200);

        const search = getByPlaceholderText("Enter area, city or landmark");
        expect(map).toBeDefined();

        const searchButton = getByPlaceholderText("searchButton");
        expect(searchButton).toBeDefined();

        const difficultyEasy = getByTestId("difficultyEasy");
        expect(difficultyEasy).toBeDefined();

        // change difficulty to easy
        fireEvent.click(difficultyEasy);

        // search any routes
        fireEvent.click(searchButton);

        // wait for the search result list
        const resultList = await waitForElement(() => getByTestId('searchResultList'));
        expect(resultList).toBeDefined();
    });

    test("Navigate to the first route", async () => {
        const firstResult = getByTestId('searchResult0');
        expect(firstResult).toBeDefined();

        // click on the first result
        fireEvent.click(firstResult);

        const detailForm = await waitForElement(() => getByTestId('detailForm'));
        expect(detailForm).toBeDefined();
    });

    test("Add a review", async () => {
        const btnAddReview = getByTestId('btnAddReview');
        fireEvent.click(btnAddReview);

        // collect review input fields
        const commentText = await waitForElement(() => getByPlaceholderText('Enter your review'));
        expect(commentText).toBeDefined();
        const imageFile = getByPlaceholderText("Upload image file");
        expect(imageFile).toBeDefined();
        const rating = getByTestId('newReviewRating');
        expect(rating).toBeDefined();

        // fill review input fields
        fireEvent.change(commentText, {target: {value: 'Some review text'}});
        fireEvent.change(imageFile, {target: {files: [{type: 'abc', size: 10}]}});
        fireEvent.change(rating, {target:{rating: 3}});

        // Expecting that the image is of incorrect type
        expect(window.alert).toHaveBeenCalledTimes(1);

        // submit review
        fireEvent.click(getByText("Submit"));
    });

    test("Favorise the route", () => {
        const favoriseButton = getByTestId("toggleFavorite");
        expect(favoriseButton).toBeDefined();

        // click that favorise button
        fireEvent.click(favoriseButton);
    })

});