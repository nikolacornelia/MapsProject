import React, {Component} from 'react';
import axios from 'axios';
import {
    Container, Header, Button, Divider, Grid, Image, Sidebar, Visibility, Message,
    Responsive, Segment, Menu, Icon, Input, Checkbox, Accordion, Form, Radio, Dropdown, Dimmer, Loader
} from 'semantic-ui-react'
import * as CreateMap from './maps/CreateRoute';
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
            routeCreated: false,
            files: [],

            hasRouteError: false,
            hasRouteDistanceError: false,
            loading: false
        };
        CreateMap.resetArrays();
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

    /**
     * Function that is called when the user submits a new route
     * @param e - Event triggered by the form submit
     */
    onSubmitRoute = (e) => {
        this.setState({routeCreated: false});

        //get current leaflet route information
        let oRoute = CreateMap.getRouteMapData();

        if (!this.state.difficulty) {
            alert("Please select a difficulty first!");
            return;
        }

        // create a function that is called after image file is read
        let _createRoute = (e) => {
            if (oRoute.points.length === 0 || oRoute.points.length === 1) {
                this.setState({hasRouteError: true});
                return;
            }
            if (oRoute.distance >= 25) {
                this.setState({hasRouteDistanceError: true});
                return;
            }
            if (oRoute.distance === null) {
                //todo: display error message instead of success?
                alert('error because of distance');
                return;
            }

            let image = e && e.target.result; // sends the image as base64
            this.setState({loading: true, hasRouteError: false});

            axios.post('/saveRoute', {
                title: this.state.name,
                description: this.state.description,
                difficulty: this.state.difficulty,
                features: this.state.features,
                points: oRoute.points,
                highlights: oRoute.highlights,
                images: image,
                distance: oRoute.distance,
            }).then((response) => {
                // route created - now reset input fields
                this.setState({
                    hasRouteError: false, loading: false,
                    routeCreated: true, name: '', description: '', features: '', image: '', difficulty: ''
                });

                //reset created route points
                oRoute = CreateMap.resetArrays();
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

        return (
            <Grid stackable columns={2} className='map' data-testid='siteCreate'>
                <Grid.Column width={10} style={{paddingRight: 0, paddingBottom: 0}}>
                    <div id='map' style={{height: "100%"}} data-testid='map'/>
                </Grid.Column>
                <Grid.Column width={6} as={Segment} style={{height: '100%'}}>
                    <div className='sidebar'>

                        {this.state.routeCreated &&
                        <Message success header='The route has successfully been created!'/>}
                        {this.state.hasRouteError &&
                        <Message attached error
                                 header='Invalid route, please check your route consists of at least 2 points.'/>
                        }
                        {this.state.hasRouteDistanceError &&
                        <Message attached error
                                 header='This route is too long, please only create routes up to a distance of 25 km.'/>
                        }
                        <Form size='large' onSubmit={this.onSubmitRoute} data-testid='formCreate'>
                            <Header as='h2'>
                                Create new route
                                <Header.Subheader>Enter route information</Header.Subheader>
                            </Header>

                            <Form.Input fluid label='Name' placeholder='Name of the route' required
                                        value={this.state.name}
                                        name='name' onChange={this.handleChange}/>
                            <Form.TextArea fluid label='Description' placeholder='Description of the route'
                                           value={this.state.description}
                                           name='description' onChange={this.handleChange}/>

                            <Form.Input type='file' fluid label='Image' placeholder='Upload image file'
                                        name='image' iconPosition='left' onChange={this.handleChangeFile}
                                        accept="image/*" value={this.state.image}
                                        icon={<Icon name='add' link inverted color='black'/>}/>


                            <Form.Group inline value={this.state.difficulty}>
                                <label>Difficulty <span style={{color: "#db2828"}}>*</span></label>

                                <Form.Radio
                                    label='easy'
                                    value='easy'
                                    name='difficulty'
                                    checked={this.state.difficulty === 'easy'}
                                    onChange={this.handleChange}
                                    data-testid='radioEasy'
                                />
                                <Form.Radio
                                    label='moderate'
                                    value='moderate'
                                    name='difficulty'
                                    checked={this.state.difficulty === 'moderate'}
                                    onChange={this.handleChange}
                                    data-testid='radioModerate'
                                />
                                <Form.Radio
                                    label='difficult'
                                    value='difficult'
                                    name='difficulty'
                                    checked={this.state.difficulty === 'difficult'}
                                    onChange={this.handleChange}
                                    data-testid='radioDifficult'
                                />
                            </Form.Group>
                            <Form.Dropdown name='features' label='Features' placeholder='Route features'
                                           value={this.state.features}
                                           fluid multiple search selection options={mockFeatures}
                                           onChange={this.handleChange}
                            />

                            <Form.Button type='submit' color='blue'>Save</Form.Button>
                            <Dimmer active={this.state.loading}>
                                <Loader/>
                            </Dimmer>
                        </Form>
                    </div>
                </Grid.Column>

            </Grid>
        )
    }
}

export default Create;