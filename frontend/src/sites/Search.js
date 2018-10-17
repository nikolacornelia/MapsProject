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
    Label,
    Input,
    Checkbox,
    Accordion,
    Form,
    Radio
} from 'semantic-ui-react'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import {Slider} from 'react-semantic-ui-range';


class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 13,
            value1: 5,
            value: 0,
            searchText: '',
            searched: false
        }
    }

    // RadioButton Logik
    handleChange = (e, value) => {
        this.setState(value);
    };

    //Range
    handleValueChange(e, {value}) {
        this.setState({
            value: value
        })
    }

    //onSearchChanged
    onSearchChanged = (e, d) => {
        this.setState({searchText: d.value});
    };


    //onSearch
    onSearch = (e, d) => {
        // todo: Suchanfrage ans Backend
        this.setState({searched: true});

    };

    render() {

        const position = [this.state.lat, this.state.lng];
        const settings = {
            start: 5,
            min: 0,
            max: 25,
            step: 1,
        };

        const mockData = [
            {title: 'Wanderweg 1', address: 'Speyer, RLP, Deutschland', rating: 4, image: ''},
            {title: 'Wanderweg 2', address: 'Speyer, RLP, Deutschland', rating: 2, image: ''}
        ];
        var searchResults = [];
        if (this.state.searched){
            mockData.forEach( (result) => {
               searchResults.push(<div>
                   {result.title}
                    <p>{result.address}</p>
               </div>)
            });
        }

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
                                    Find a trail / Search for a route
                                </Header>
                                <Form.Input fluid placeholder='Enter area, city or landmark' onChange={this.onSearchChanged}
                                            action={{ icon: 'search', onClick: this.onSearch}} />
                                <Header as='h4'>
                                    <Icon name='filter'/>
                                    <Header.Content> Filter </Header.Content>
                                </Header>
                                <Header.Subheader as='h5'> Difficulty
                                </Header.Subheader>
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
                                <Header as='h4'> Route length in km: Routes up to {this.state.value1} km </Header>
                                <Slider color='blue' inverted={false}
                                        settings={{
                                            start: this.state.value1,
                                            min: 0,
                                            max: 25,
                                            step: 1,
                                            onChange: (value) => {
                                                this.setState({
                                                    value1: value
                                                })
                                            }
                                        }}/>
                                <Label color='blue'>{this.state.value1}</Label>

                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                {searchResults}
            </Container>


        )
    }


}


export default Search;