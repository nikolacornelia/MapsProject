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


class FAQ extends Component {
    render() {

        return (
            <Container fluid>
                <Grid columns='three'>
                    <Segment.Group>
                        <Segment>Q1</Segment>
                        <Segment>Q2</Segment>
                        <Segment>Q3</Segment>

                    </Segment.Group>
                </Grid>
            </Container>
        )
    }
}

export default FAQ;