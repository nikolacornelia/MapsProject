import React from 'react'
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library'

import Website from '../Website';
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("Website navigation", () => {
    var mock = new MockAdapter(axios);
    sessionStorage.clear();
    const {getByText, getByTestId, getByPlaceholderText} = render(<Website/>);
    test("home component is start screen", () => {
        const siteHome = getByTestId('siteHome');
        expect(siteHome).toBeDefined();
    });

    test("navigate to search", () => {
        const home = getByText("Search");

        fireEvent.click(home);

        const siteSearch = getByTestId('siteSearch');
        expect(siteSearch).toBeDefined();
    });

    test("navigate to faq", () => {
        const faq = getByText("FAQ");

        faq.click();

        const faqAccordion = getByTestId('faqAccordion');
        expect(faqAccordion).toBeDefined();
    });

    test("navigate to create", () => {
        const create = getByText("Create");
        create.click();
    });

    test("Login from website component", async () => {
        const formLogin = await waitForElement(() => getByTestId("formLogin"));
        expect(formLogin).toBeDefined();
        const inputUser = getByPlaceholderText("Email address or user name");
        expect(inputUser).toBeDefined();
        const inputPassword = getByPlaceholderText("Password");
        expect(inputPassword).toBeDefined();

        // fill in the login fields
        fireEvent.change(inputUser, {target: {value: 'MyUsername'}});
        fireEvent.change(inputPassword, {target: {value: 'MyPassword'}});

        // mock the login request
        mock.onAny('/login').reply(200);

        // submit the login form
        fireEvent.submit(formLogin);

        expect(sessionStorage.getItem("user")).toBeDefined();
    });
    test("Simulate a not logged in anymore state", () => {
        mock.onGet("/logout").replyOnce(401);
        axios.get("/logout");
    })
});