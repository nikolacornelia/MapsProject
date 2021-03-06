import React, { Component } from 'react';
import {
    Container,
    Header,
    Button,
    Divider,
    Grid,
    Image,
    Sidebar,
    Visibility,
    Responsive,
    Segment,
    Menu,
    Icon,
    Input,
    Checkbox,
    Accordion,
    Form,
    Radio,
    Message
} from 'semantic-ui-react'
import axios from 'axios';
import validator from 'validator';

class LogIn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            page: 'login',
            formErrors: [],
            registerSuccess: false,
        }
    }

    onChangeInput = (e) => {
        if (this.state.hasError) {
            this.setState({ hasError: false });
        }
        this.setState({ [e.target.name]: e.target.value });
    };

    navigateInternally = (e, page) => {
        e.preventDefault();
        this.setState({ page: page, formErrors: [] });
    };

    onSubmitLogin = () => {
        axios.get('/login', {
            params: {
                user: this.state.user,
                password: this.state.password
            }
        }).then((response) => {
            // success routine
            sessionStorage.setItem("user", JSON.stringify(response.data));
            let referrTo;
            if (this.props.location.state) {
                referrTo = this.props.location.state.from;
                this.props.location.state.updateLoginStatus();
            } else {
                referrTo = { pathname: "/" };
                this.props.updateLoginStatus();
            }
            this.props.history.push(referrTo);
        }).catch((error) => {
            // error routine (http response status 4xx)
            this.setState({ hasError: true });
        });
    };

    onSubmitRegister = () => {
        if (!this.validateRegisterForm())
            return;

        // send register request
        axios.post('/register/', {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }).then((response) => {
            // successfully registered
            this.setState({ registerSuccess: true });
        }).catch((error) => {
            // error routine (http response status 4xx)
            this.setState({ hasError: true });
        });
    };

    validateRegisterForm = () => {
        let formErrors = [];
        if (!validator.isEmail(this.state.email))
            formErrors.push({ field: 'email', text: 'Please enter a valid email.' });
        if (this.state.password.length < 6)
            formErrors.push({ field: 'password', text: 'Your password is too short.' });
        if (!this.state.password || this.state.password !== this.state.password_repeat)
            formErrors.push({ field: 'password', text: 'Your passwords do not match.' });

        this.setState({ formErrors: formErrors });
        return formErrors.length === 0;
    };

    render() {
        return (
            <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    {this.state.page === 'login' && <div>
                        <Header as='h2' color='blue' textAlign='center'>
                            Login to your account
                        </Header>
                        {this.state.hasError &&
                            <Message attached error header='Invalid login data!'
                                content='Please check your email or password.' />
                        }
                        {this.props.location && this.props.location.state &&
                            <Message attached warning header='You must login to access this page!'
                                content='Please login first. You will then be redirected.' />
                        }
                        <Form size='large' onSubmit={this.onSubmitLogin} className='attached fluid segment' data-testid='formLogin'>

                            <Form.Input fluid icon='user' name='user' iconPosition='left'
                                placeholder='Email address or user name' onChange={this.onChangeInput}
                                required />
                            <Form.Input fluid icon='lock' name='password' iconPosition='left'
                                placeholder='Password' onChange={this.onChangeInput}
                                type='password' required />
                            <Form.Field>
                                <a href='#' onClick={(e) => this.navigateInternally(e, 'forgotPassword')}>Forgot your
                                    password?</a>
                            </Form.Field>
                            <Button color='blue' fluid size='large' data-testid='formLoginButton'>
                                Login
                            </Button>
                        </Form>
                        <Message attached='bottom'>
                            Don't have an account? <a href='#' onClick={(e) => this.navigateInternally(e, 'register')} data-testid='signUp'>Sign
                            Up</a>
                        </Message>
                    </div>}

                    {this.state.page === 'register' && <div>
                        <Header as='h2' color='blue' textAlign='center'>
                            Register a new account
                        </Header>
                        {this.state.registerSuccess &&
                            <Message attached success header='Your account was successfully registered.' data-testid='msgRegisterSuccess'>
                                You can now <a href='#' onClick={(e) => this.navigateInternally(e, 'login')}>login here</a>.
                        </Message>
                        }
                        {this.state.formErrors.length > 0 &&
                            <Message attached error>
                                <Message.Header content='Your form has errors. You must correct them first!' />
                                <Message.List>
                                    {this.state.formErrors.map((error) => <Message.Item content={error.text} />)}
                                </Message.List>
                            </Message>
                        }
                        {this.state.hasError &&
                            <Message attached error header='Your account was not created!'
                                content='This user already exists.' />
                        }
                        <Form size='large' onSubmit={this.onSubmitRegister} className='attached fluid segment' data-testid='formRegister'>

                            <Form.Input fluid icon='mail' name='email' iconPosition='left'
                                error={this.state.formErrors.find((error) => error.field === 'email')}
                                placeholder='E-Mail address' onChange={this.onChangeInput} required />
                            <Form.Input fluid icon='user' name='username' iconPosition='left'
                                placeholder='User name' onChange={this.onChangeInput} required />
                            <Form.Input fluid icon='lock' name='password' iconPosition='left'
                                placeholder='Password' onChange={this.onChangeInput}
                                error={this.state.formErrors.find((error) => error.field === 'password')}
                                type='password' required />
                            <Form.Input fluid icon='lock' name='password_repeat' iconPosition='left'
                                placeholder='Repeat Password' onChange={this.onChangeInput}
                                error={this.state.formErrors.find((error) => error.field === 'password')}
                                type='password' required />

                            <Button color='blue' fluid size='large'>
                                Register
                            </Button>
                        </Form>
                        <Message attached='bottom'>
                            Already have an account? <a href='#' onClick={(e) => this.navigateInternally(e, 'login')}>Login
                            here</a>
                        </Message>
                    </div>}

                    {this.state.page === 'forgotPassword' && <div>
                        Is this ever going to be implemented?
                    </div>}
                </Grid.Column>
            </Grid>
        )
    }

}

export default LogIn;