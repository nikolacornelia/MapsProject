import React from 'react';
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import LogIn from '../sites/LogIn';


describe("Testing LogIn component", () => {
    const { getByText, getByTestId, getByPlaceholderText } = render(<LogIn />);
    var mock = new MockAdapter(axios);

    test("Find login form", () => {
        const formCreate = getByTestId("formLogin");
        expect(formCreate).toBeDefined();
    });

    test("Try to login", () => {
        const formLogin = getByTestId("formLogin");
        expect(formLogin).toBeDefined();
        const inputUser = getByPlaceholderText("Email address or user name");
        expect(inputUser).toBeDefined();
        const inputPassword = getByPlaceholderText("Password");
        expect(inputPassword).toBeDefined();

        // fill in the login fields
        fireEvent.change(inputUser, { target: { value: 'MyUsername' } });
        fireEvent.change(inputPassword, { target: { value: 'MyPassword' } });

        // mock the login request
        mock.onAny('/login').reply(200);

        // submit the login form
        fireEvent.submit(formLogin);

        expect(sessionStorage.getItem("user")).toBeDefined();
    });

    test("Navigate to register", () => {
        const linkSignUp = getByTestId("signUp");
        expect(linkSignUp).toBeDefined();

        fireEvent.click(linkSignUp);

        expect(getByTestId('formRegister')).toBeDefined();
    });

    test("Try to register", async () => {
        const formRegister = getByTestId("formRegister");
        expect(formRegister).toBeDefined();
        const inputEmail = getByPlaceholderText("E-Mail address");
        expect(inputEmail).toBeDefined();
        const inputUser = getByPlaceholderText("User name");
        expect(inputUser).toBeDefined();
        const inputPassword = getByPlaceholderText("Password");
        expect(inputPassword).toBeDefined();
        const inputPasswordRepeat = getByPlaceholderText("Repeat Password");
        expect(inputPasswordRepeat).toBeDefined();

        // fill in the register fields
        fireEvent.change(inputEmail, { target: { value: 'test@test.de' } });
        fireEvent.change(inputUser, { target: { value: 'MyUsername' } });
        fireEvent.change(inputPassword, { target: { value: 'MyPassword' } });
        fireEvent.change(inputPasswordRepeat, { target: { value: 'MyPassword' } });


        // mock the register request
        mock.onPost('/register/').reply(200);

        // submit the register form
        fireEvent.submit(formRegister);

        // wait for success message to be displayed
        await waitForElement(() => getByTestId('msgRegisterSuccess'));

        expect(getByTestId('msgRegisterSuccess')).toBeDefined();
    });



});