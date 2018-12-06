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
            routeCreated: false,
            files: [],

            lat: 51.505,
            lng: -0.09,
            zoom: 13,
        };
        this.user = JSON.parse(sessionStorage.getItem("user"));
    }


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
        let files = e.target.files;

        // Check file type and size
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match('image.*')) {
                // Error: file is not an image
                // todo: error routine...
                alert("file is not an image");
            } else if (files[i].size >= 10 * 1024 * 1024) {
                // Error: file is too large
                // todo: define max. file size & error routine...
                alert("file to big");
            }
        }
        this.setState({files: files});
    };

    onSubmitRoute = (e) => {
        //get current leaflet route information
        let oRoute = CreateMap.getRouteMapData();

        // create a function that is called after image file is read

        let _createRoute = (e) => {
            console.log(oRoute.points);
            if (oRoute.points.length === 0) {
                //todo: display error message instead of success?
                alert('Please select points for your route in the map');
                return;
            }
            let image = e && e.target.result; // sends the image as base64
            //image.toString();

            axios.post('http://localhost:3001/saveRoute', {
                title: this.state.name,
                description: this.state.description,
                difficulty: this.state.difficulty,
                features: this.state.features,
                points: oRoute.points,
                highlights: oRoute.highlights,
                images: image,
                distance: oRoute.distance,
                //sobald session im backend existiert, kommt die Zeile weg
                user: this.user._id,
               //todo correct? files: this.state.files
            }).then((response) => {
                console.log(this.user._id);
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
            fileReader.onload = _createRoute;
            fileReader.readAsDataURL(this.state.files[0]);
        } else {
            _createRoute();
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
            <Grid stackable columns={2} className='map' data-testid='siteCreate'>
                <Grid.Column width={10} style={{paddingRight: 0, paddingBottom: 0}}>
                    <div id='map' style={{height: "100%"}}/>
                </Grid.Column>
                <Grid.Column width={6} as={Segment} style={{height: '100%'}}>
                    <div className='sidebar'>
                        {this.state.routeCreated &&
                        <Message success header='The route has successfully been created!'/>}
                        <Form size='large' onSubmit={this.onSubmitRoute}>
                            <Header as='h2'>
                                Create new route
                                <Header.Subheader>Enter route information</Header.Subheader>
                            </Header>

                            <Form.Input fluid label='Name' placeholder='Name of the route' required
                                        name='name' onChange={this.handleChange}/>
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
                    </div>
                </Grid.Column>

            </Grid>
        )
    }
}

export default Create;