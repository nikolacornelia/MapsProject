import React, {Component} from 'react';
import axios from 'axios';
import {
    Container, Header, Button, Divider, Grid, Image, Sidebar, Visibility, Message,
    Responsive, Segment, Menu, Icon, Input, Checkbox, Accordion, Form, Radio, Dropdown
} from 'semantic-ui-react'
import * as CreateMap from './maps/createRoute';
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
            files: [],

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
     * Handles the change of most of the input fields
     * @param e - Change event
     * @param name - Name of the changing field
     * @param value - Value of the changing field
     */
    handleChange = (e, {name, value}) => {
        this.setState({[name]: value});
    };

    /**
     * Handles the change for file input field
     * @param e - change event
     */
    handleChangeFile = (e) => {
        const {files} = e.target;

        // Check file type and size
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match('image.*')) {
                // Error: file is not an image
                // todo: error routine...
            } else if (files[i].size >= 10 * 1024 * 1024) {
                // Error: file is too large
                // todo: define max. file size & error routine...
            }
        }
        this.setState(files);
    };

    onSubmitRoute = (e) => {
        //get current leaflet route information
        let oRoute = CreateMap.getRouteMapData();

        // create a function that is called after image file is read
        let createRoute = (e) => {
            let image = e && e.target.result; // sends the image as base64

            axios.post('http://localhost:3001/saveRoute', {
                title: this.state.title,
                description: this.state.description,
                difficulty: this.state.difficulty,
                points: oRoute.points,
                highlights: oRoute.highlights,
                image: image
            }).then((response) => {
                this.setState({routeCreated: true});
                //reset created route points
                //todo: at the moment route points only get deleted if you changed e.g. from create to search and then back to create
                CreateMap.resetArrays();

            }).catch((error) => {
                // possible?
            });
        };

        // read file if given
        if (this.state.files.length === 1) {
            let fileReader = new FileReader();
            fileReader.onload = createRoute;
            fileReader.readAsDataURL(this.state.files[0]);
        } else {
            createRoute();
        }
    };

    /**
     * Injects the leaflet map functionality after the React component has rendered.
     */
    componentDidMount = () => {
        CreateMap.onInit();
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

                        <Form.Input fluid label='Title' placeholder='Title of the route' required
                                    name='title' onChange={this.handleChange}/>
                        <Form.TextArea fluid label='Description' placeholder='Description of the route'
                                       name='description' onChange={this.handleChange}/>

                        <Form.Input type='file' fluid label='Image' placeholder='Upload image file'
                                    name='image' iconPosition='left' onChange={this.handleChangeFile}
                                    accept="image/*"
                                    icon={<Icon name='add' link inverted color='black'/>}/>

                        <Form.Group inline>
                            <label>Difficulty</label>

                            <Form.Radio
                                label='easy'
                                value='easy'
                                name='difficulty'
                                checked={this.state.difficulty === 'easy'}
                                onChange={this.handleChange}
                            />
                            <Form.Radio
                                label='moderate'
                                value='moderate'
                                name='difficulty'
                                checked={this.state.difficulty === 'moderate'}
                                onChange={this.handleChange}
                            />
                            <Form.Radio
                                label='difficult'
                                value='difficult'
                                name='difficulty'
                                checked={this.state.difficulty === 'difficult'}
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Dropdown name='features' label='Features' placeholder='Route features'
                                       fluid multiple search selection options={mockFeatures}
                                       onChange={this.handleChange}
                        />

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