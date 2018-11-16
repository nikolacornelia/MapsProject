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
        /*
        // see documentation: https://github.com/axios/axios#request-config
        axios.post('/user/login', {
            user: this.state.user,
            password: this.state.password
        }).then((response) => {
            // success routine (see below)

        }).error((error) => {
            // error routine
            this.setState({hasError: true});
        });
        */
        sessionStorage.setItem("loggedIn", "userObjectFromBackend");
        //console.log(this.state.user);
        //console.log(this.state.password);
        var referrTo;
        if(this.props.location.state){
            referrTo = this.props.location.state.from;
            this.props.location.state.updateLoginStatus();
        } else {
            referrTo = { pathname: "/" };
            this.props.updateLoginStatus();
        }
        this.props.history.push(referrTo);
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
                    <Form size='large' onSubmit={this.onSubmitForm}>
                        <Segment stacked>
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
                        </Segment>
                    </Form>
                    <Form.Field>
                        Don't have an account? <a href='#'>Sign Up</a>
                    </Form.Field>

                </Grid.Column>
            </Grid>
        )
    }

}

export default LogIn;