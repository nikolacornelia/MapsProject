import React, {Component} from 'react';
import {
    Container, Header, Button, Divider, Grid, Image, Sidebar, Visibility, Message,
    Responsive, Segment, Menu, Icon, Input, Checkbox, Accordion, Form, Radio, Dropdown
} from 'semantic-ui-react'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import * as createRoute from './maps/createRoute';
import {mockFeatures} from "../mockData";

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
            routeCreated: false,

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

    onSubmitRoute = (e) => {
        // todo: get current leaflet route information

        // todo: submit routine
        this.setState({routeCreated: true});
    };

    /**
     * Injects the leaflet map functionality after the React component has rendered.
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
                    {this.state.routeCreated &&
                    <Message success header='The route has successfully been created!'/>}
                    <Form size='large' onSubmit={this.onSubmitRoute}>
                        <Header as='h2'>
                            Create new route
                            <Header.Subheader>Enter route information</Header.Subheader>
                        </Header>

                        <Form.Input fluid label='Title' placeholder='Title of the route' required/>
                        <Form.TextArea fluid label='Description' placeholder='Description of the route'/>

                        <Form.Input type='file' fluid label='Image' placeholder='Upload image file'
                                    iconPosition='left'
                                    icon={<Icon name='add' link inverted color='black'/>}/>

                        <Form.Group inline>
                            <label>Difficulty</label>

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
                        {/*<Form.Group widths='equal'>
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
                        </Form.Group>*/}
                        <Form.Dropdown name='features' label='Features' placeholder='Route features'
                                       fluid multiple search selection options={mockFeatures}/>

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
                    <div id='map' style={{height: "100%"}}/>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}

export default Create;