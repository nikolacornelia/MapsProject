import React from 'react';
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Search from '../sites/Search';
import {mockData, mockRatings, mockHighlights} from "../mockData";

describe("Testing Search component", () => {
    var mock = new MockAdapter(axios);
    // mock route data
    mock.onGet('/getRoutes').reply(200, mockData);
    mock.onGet('/getRatings').reply(200, mockRatings);
    mock.onGet('/getLocalPoints').reply(200, mockHighlights);
    mock.onAny().reply(200);

    const {getByText, getByTestId, getByPlaceholderText} = render(<Search/>);

    test("Try to search for routes", async () => {
        const search = getByPlaceholderText("Enter area, city or landmark");
        expect(search).toBeDefined();

        const searchButton = getByPlaceholderText("searchButton");
        expect(searchButton).toBeDefined();

        const difficultyEasy = getByTestId("difficultyEasy");
        expect(difficultyEasy).toBeDefined();
        const difficultyModerate = getByTestId("difficultyModerate");
        expect(difficultyModerate).toBeDefined();

        // change difficulty to easy
        fireEvent.click(difficultyEasy);
        // add & then remove moderate difficulty
        fireEvent.click(difficultyModerate);
        fireEvent.click(difficultyModerate);

        // search any routes
        fireEvent.click(searchButton);

        // wait for the search result list
        const resultList = await waitForElement(() => getByTestId('searchResultList'));
        expect(resultList).toBeDefined();

        // Change sorting
        const sort3 = getByText("Most recently created");
        fireEvent.click(sort3.parentNode);

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
        fireEvent.change(rating, {target:{rating: 3}});

        // try to upload invalid files
        fireEvent.change(imageFile, {target: {files: [{type: 'abc', size: 10}]}});
        fireEvent.change(imageFile, {target: {files: [{type: 'image/jpeg', size: 1000000000}]}});
        fireEvent.change(imageFile, {target: {files: []}});


        // Expecting that two errors have been thrown
        expect(window.alert).toHaveBeenCalledTimes(2);

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