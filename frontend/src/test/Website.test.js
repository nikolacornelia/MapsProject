import React from 'react'
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library'

import Website from '../Website';

describe("Website navigation", () => {
    const { getByText, getByTestId } = render(<Website />);

    test("home component is start screen", () => {
        const siteHome = getByTestId('siteHome');
        expect(siteHome).toBeDefined();
    });

    test("find login menu", () => {
        const login = getByText("LogIn");

        expect(login).toBeDefined();
    });

    test("navigate to search", () => {
        const home = getByText("Search");

        fireEvent.click(home);

        const siteSearch = getByTestId('siteSearch');
        expect(siteSearch).toBeDefined();
    });
/*
    test("navigate to create does not work beecause not logged in", () => {
        const create = getByText("Create");

        fireEvent.click(create);

        const siteSearch = getByTestId('siteCreate');
        expect(siteSearch).toBeDefined();
    });*/

    test("navigate to faq", () => {
        const faq = getByText("FAQ");

        faq.click();

        const faqAccordion = getByTestId('faqAccordion');
        expect(faqAccordion).toBeDefined();
    });
});