import React, {Component} from 'react';

import {
    Container,
    Header,
    Button,
    Divider,
    Grid,
    Image,
    Sidebar,
    Segment,
    Menu,
    Icon,
    Label,
    Input,
    Rating,
    Checkbox,
    Accordion,
    Form,
    Radio,
    Dropdown,
    Item,
    Statistic,
    Sticky
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

            difficulty: 0,
            routeLength: 5,
            searchText: '',
            searched: false,
            showDetail: -1
        }
    }

    // RadioButton Logik
    handleChange = (e, {value}) => {
        this.setState({difficulty: value});
    };

    //Range
    handleValueChange = (e, {value}) => {
        this.setState({value: value});
    };

    //onSearchChanged
    onSearchChanged = (e, d) => {
        this.setState({searchText: d.value});
    };

    //onSearch
    onSearch = (e, d) => {
        // todo: Suchanfrage ans Backend
        this.setState({searched: true});

    };

    onSearchResultClick = (id) => {
        this.setState({showDetail: id})
    };


    render() {
        const position = [this.state.lat, this.state.lng];
        const mockData = [
            {
                id: 1,
                title: 'Wanderweg 1',
                address: 'Speyer, RLP, Deutschland',
                distance: 4,
                difficulty: 'moderate',
                rating: 4,
                image: './static/media/RiceTerraces.JPG',
                features: ['Kid-Friendly', 'Wineyard', 'River']
            },
            {
                id: 2,
                title: 'Wanderweg 2',
                address: 'Speyer, RLP, Deutschland',
                distance: 8,
                difficulty: 'easy',
                rating: 2,
                image: './static/media/RiceTerraces.JPG',
                features: ['Dogs Allowed', 'Wineyard', 'Forest', 'River']
            },
            {
                id: 3,
                title: 'Wanderweg 2',
                address: 'Speyer, RLP, Deutschland',
                distance: 8,
                difficulty: 'easy',
                rating: 2,
                image: './static/media/RiceTerraces.JPG',
                features: ['Dogs Allowed', 'Wineyard', 'Forest', 'River']
            }];
        var searchResults = [];
        if (this.state.searched) {
            mockData.forEach((result) => {
                searchResults.push(
                    <Item onClick={() => this.onSearchResultClick(result.id)}>
                        <Item.Image size='small' src={result.image}/>
                        <Item.Content>
                            <Item.Header as='h4'> {result.title} </Item.Header>
                            <Item.Description>
                                {result.address}
                                <p/>
                                Distance:{result.distance} km
                                <p/>
                                Difficulty: {result.difficulty}
                                <Item.Extra>
                                    <Rating icon='star' defaultRating={result.rating} maxRating={5} disabled/>
                                </Item.Extra>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                )
            });
        }
        var detailRoute = mockData.find((route) => route.id === this.state.showDetail);

        return (
            <Sidebar.Pushable>
                {/* Sidebar = Right Column */}
                <Sidebar as={Segment} animation='push' direction='right' visible width='very wide'>
                    {this.state.showDetail <= -1 ?
                        /* display search form*/
                        <div>
                            <Form size='large'>
                                <Header as='h2'>Find a trail / Search for a route</Header>
                                <Form.Input fluid placeholder='Enter area, city or landmark'
                                            onChange={this.onSearchChanged}
                                            action={{icon: 'search', onClick: this.onSearch}}/>
                                <Header as='h4'>
                                    <Icon name='filter'/>
                                    <Header.Content> Filter </Header.Content>
                                </Header>
                                <Header.Subheader as='h5'> Difficulty</Header.Subheader>
                                <Form.Group>
                                    <Form.Radio
                                        label='easy' value='easy'
                                        checked={this.state.difficulty === 'easy'}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Radio
                                        label='moderate' value='moderate'
                                        checked={this.state.difficulty === 'moderate'}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Radio
                                        label='difficult' value='difficult'
                                        checked={this.state.difficulty === 'difficult'}
                                        onChange={this.handleChange}
                                    />
                                </Form.Group>
                                <Header as='h4'> Route length in km: Routes up to<Label
                                    color='blue'>{this.state.routeLength}</Label> km </Header>
                                <Slider color='blue' inverted={false}
                                        settings={{
                                            start: this.state.routeLength,
                                            min: 0, max: 25, step: 1,
                                            onChange: (value) => this.setState({routeLength: value})
                                        }}/>
                            </Form>

                            {this.state.searched && <div>
                                <Grid columns='equal'>
                                    <Grid.Column textAlign='left'>
                                        <Icon name='list'/> {mockData.length} results
                                    </Grid.Column>
                                    <Grid.Column textAlign='right'>
                                        <Dropdown text='Sort By' direction='left'>
                                            <Dropdown.Menu>
                                                <Dropdown.Item text='Relevance'/>
                                                <Dropdown.Item text='Most popular'/>
                                                <Dropdown.Item text='Most recently updated'/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Grid.Column>
                                </Grid>

                                <Item.Group divided link>
                                    {searchResults}
                                </Item.Group>
                            </div>}
                        </div>
                        : /*else display detail form*/
                        <Form size='large'>
                            <Header as='h2'>
                                {detailRoute.title}
                                <Header.Subheader as='h4'>{detailRoute.address}</Header.Subheader>
                            </Header>
                            <Image size='large' src={detailRoute.image}/>
                            <Statistic horizontal size='small' value={detailRoute.distance} label='km'/>
                            <Statistic horizontal size='small' label={detailRoute.difficulty}/>
                            {detailRoute.features.map((feature) => <Label>{feature}</Label>)}
                            <Rating icon='star' defaultRating={detailRoute.rating} maxRating={5} disabled/>
                            <p>
                                <Icon.Group size='large'>
                                    <Icon link name='camera'/>
                                    <Icon link corner name='add'/>
                                </Icon.Group>
                                Add photo
                            </p>
                        </Form>
                    }
                </Sidebar>

                {/* Sidebar.Pusher = Left Column */}
                <Sidebar.Pusher style={{height: '100%'}}>
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
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    };


}

export default Search;

