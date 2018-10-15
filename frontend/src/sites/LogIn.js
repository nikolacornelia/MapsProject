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
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';


class LogIn extends Component {

    render() {


        return (


            <Grid textAlign='center' style={{height: '100%'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>


                    <Header as='h2' color='blue' textAlign='center'>
                        Login to your account
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address'/>
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                            />
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