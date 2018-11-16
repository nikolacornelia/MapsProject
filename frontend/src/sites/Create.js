import React, {Component} from 'react';
import {
    Container, Header, Button, Divider, Grid, Image, Sidebar, Visibility,
    Responsive, Segment, Menu, Icon, Input, Checkbox, Accordion, Form, Radio
} from 'semantic-ui-react'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import * as createRoute from './maps/createRoute';

class Create extends Component {

    /**
     * Represents the Create component for creating routes.
     * @constructor
     * @param {Object} props - Properties passed to this component.
     */
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: -1,
            showMoreFeatures: false,

            lat: 51.505,
            lng: -0.09,
            zoom: 13,
        }
    }

    // Accordion Logik
    handleClick = (e, {index}) => {
        this.setState({showMoreFeatures: !this.state.showMoreFeatures});
    };

    /**
     * Handles the radio button change.
     * @param {Object} e - Event parameter that is passed with the change
     * @param {String} value - Value of the changed control
     */
    handleChange = (e, {value}) => {
        this.setState({value});
    };

    /**
     * Injects the map functionality after the React component has rendered.
     */
    componentDidMount = () => {
        createRoute.onInit();
    };

    /**
     * Function that is being called when the component is rendered.
     */
    render() {
        const {value} = this.state;
        const position = [this.state.lat, this.state.lng];

        // Seitenaufbau
        return (
            <Sidebar.Pushable data-testid='siteCreate'>
                {/* Sidebar = Right Column */}
                <Sidebar as={Segment} animation='push' direction='right' visible width='very wide'>
                    <Form size='large'>
                        <Header as='h2'>
                            Create new route
                            <Header.Subheader>Enter route information</Header.Subheader>
                        </Header>

                        <Form.Input fluid label='Title' placeholder='Title of the route' required/>
                        <Form.Input fluid label='Description' placeholder='Description of the route'
                                    required/>

                        <Form.Input type='file' fluid label='Image' placeholder='Upload image file'
                                    iconPosition='left'
                                    icon={<Icon name='add' link inverted color='black'/>}/>

                        <Header as='h4'>Difficulty</Header>
                        <Form.Group>
                            <Form.Radio
                                label='easy'
                                value='easy'
                                checked={this.state.value === 'easy'}
                                onChange={this.handleChange}
                            />
                            <Form.Radio
                                label='moderate'
                                value='moderate'
                                checked={this.state.value === 'moderate'}
                                onChange={this.handleChange}
                            />
                            <Form.Radio
                                label='difficult'
                                value='difficult'
                                checked={this.state.value === 'difficult'}
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Header size='small'>Features</Header>
                        <Form.Group widths='equal'>
                            <Form.Checkbox label='Kid-Friendly'/>
                            <Form.Checkbox label='Dogs Allowed'/>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Checkbox label='Forest'/>
                            <Form.Checkbox label='Lake'/>
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Checkbox label='River'/>
                            <Form.Checkbox label='Wineyard'/>
                        </Form.Group>

                        <Form.Button type='submit' color='blue'>Save</Form.Button>
                    </Form>

                </Sidebar>

                {/* Sidebar.Pusher = Left Column */}
                <Sidebar.Pusher style={{height: '100%'}}>
                    {/* <Map center={position} zoom={this.state.zoom} style={{height: "100%"}}>
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={position}>
                            <Popup>
                                A pretty CSS3 popup. <br/> Easily customizable
                            </Popup>
                        </Marker>
                    </Map>
                    */}
                    <div id='map' style={{height: "100%"}} />
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}

export default Create;