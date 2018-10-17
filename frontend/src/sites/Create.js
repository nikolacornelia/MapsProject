import React, {Component} from 'react';
import logo from '../logo.svg';
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
    Radio
} from 'semantic-ui-react'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

class Create extends Component {

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

    // RadioButton Logik
    handleChange = (e, value) => {
        this.setState(value);
    };

    //wofuer ist die konstante 'value'?
    render() {
        const {value} = this.state;
        const position = [this.state.lat, this.state.lng];

        // Seitenaufbau
        return (
            <Container fluid>
                <Grid columns='two'>
                    <Grid.Row>
                        <Grid.Column width={11} style={{padding: 0}}>

                            <Map center={position} zoom={this.state.zoom} style={{height: "100%"}}>
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
                        </Grid.Column>

                        <Grid.Column width={5} style={{padding: "5em 3em"}}>
                            <Form size='large'>
                                <Header as='h2'>
                                    Create new route
                                    <Header.Subheader>Enter route information</Header.Subheader>
                                </Header>

                                <Form.Input fluid label='Title' placeholder='Title of the route' required/>
                                <Form.Input fluid label='Description' placeholder='Description of the route'
                                            required/>

                                <Form.Input fluid label='Image' placeholder='Upload image file'
                                            iconPosition='left'
                                            icon={<Icon name='add' link inverted color='black'/>}/>

                                <Header as='h4'>Difficulty</Header>
                                <Form.Group inline>
                                    <Form.Radio
                                        label='easy'
                                        name='radioGroup'
                                        value='easy'
                                        checked={this.state.value === 'easy'}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Radio
                                        label='moderate'
                                        name='radioGroup'
                                        value='moderate'
                                        checked={this.state.value === 'moderate'}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Radio
                                        label='difficult'
                                        name='radioGroup'
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
                                <Accordion>
                                    <Accordion.Title active={this.state.showMoreFeatures} index={0}
                                                     onClick={this.handleClick}>
                                        <Icon name='dropdown'/>
                                        More
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.showMoreFeatures}>
                                        <p>
                                            More features as you click. This will also be in a grid I assume
                                        </p>
                                    </Accordion.Content>
                                </Accordion>
                                <p>
                                </p>

                                <Button color='blue'>Save</Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>

        )
    }
}

export default Create;