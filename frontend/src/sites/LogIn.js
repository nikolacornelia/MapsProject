import React, {Component} from 'react';
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


class LogIn extends Component {

    constructor(props){
        super(props);
        this.state = {
            hasError: false
        }
    }

    onChangeInput = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    onSubmitForm = () => {
        //  todo: login routine, such as:

        // see documentation: https://github.com/axios/axios#request-config
        // axios.get (für HTTP GET-Anfragen)

        axios.post('http://localhost:3001/getUser/', {
            user: this.state.user,
            password: this.state.password
        }).then((response) => {
            // success routine (see below)
            sessionStorage.setItem("loggedIn", "userObjectFromBackend");
            var referrTo;
            if(this.props.location.state){
                referrTo = this.props.location.state.from;
                this.props.location.state.updateLoginStatus();
            } else {
                referrTo = { pathname: "/" };
                this.props.updateLoginStatus();
            }
            this.props.history.push(referrTo);
        }).catch((error) => {
            // error routine (http reponsestatus 4xx)
            this.setState({hasError: true});
        });
    };

    render() {
        return (
            <Grid textAlign='center' style={{height: '100%'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='blue' textAlign='center'>
                        Login to your account
                    </Header>
                    {this.state.hasError &&
                        <Message attached error header='Invalid login data!' content='Fehler message bla bla bla ....'/>
                    }
                    {this.props.location.state &&
                        <Message attached warning header='You must login to access this page!' content='Please login first. You will then be redirected.'/>
                    }
                    <Form size='large' onSubmit={this.onSubmitForm} className='attached fluid segment'>

                            <Form.Input fluid icon='user' name='user' iconPosition='left'
                                        placeholder='E-mail address' onChange={this.onChangeInput} required />
                            <Form.Input fluid icon='lock' name='password' iconPosition='left'
                                        placeholder='Password' onChange={this.onChangeInput}
                                        type='password' required />
                            <Form.Field>
                                <a href='#'>Forgot your password?</a>
                            </Form.Field>
                            <Button color='blue' fluid size='large'>
                                Login
                            </Button>
                    </Form>
                    <Message attached='bottom'>
                        Don't have an account? <a href='#'>Sign Up</a>
                    </Message>

                </Grid.Column>
            </Grid>
        )
    }

}

export default LogIn;