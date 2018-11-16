import React, {Component} from 'react';

import {
    Container,
    Header,
    Comment,
    Button,
    Divider,
    Grid,
    Image,
    Sidebar,
    Segment,
    Menu,
    Icon,
    Label,
    Transition,
    Input,
    Rating,
    Checkbox,
    Accordion,
    Form,
    Radio,
    Dropdown,
    Item,
    Statistic,
    Sticky,
    Modal,
    Popup
} from 'semantic-ui-react'
import {Map, TileLayer, Marker} from 'react-leaflet';
import {Slider} from 'react-semantic-ui-range';
import {mockData} from '../mockData';

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
            showDetail: -1,
            reviewIsOpen: false
        }
    }

    // RadioButton Logik
    handleChange = (e, {name, value}) => {
        this.setState( { [name]: value}) ;
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

    /**
     * Navigates to the detail view of a route (or back)
     * @param {int} id - the id of the route to be displayed (or -1 if back)
     */
    onShowDetail = (id) => {
        this.setState({showDetail: id})
    };

    // Accordion Logik
    handleClick = (e, {index}) => {
        this.setState({showMoreFeatures: !this.state.showMoreFeatures});
    };

    onSubmitReview = () => {
        // routine for send new review
    };

    toggleReviewDialog = () => {
        this.setState({reviewIsOpen: !this.state.reviewIsOpen});
    };

    render() {
        const position = [this.state.lat, this.state.lng];

        var searchResults = [];
        if (this.state.searched) {
            mockData.forEach((result) => {
                searchResults.push(
                    <Item onClick={() => this.onShowDetail(result.id)}>
                        <Item.Image size='small' src={result.image}/>
                        <Item.Content>
                            <Item.Header as='h4'> {result.title} </Item.Header>
                            <Item.Meta>{result.address}</Item.Meta>
                            <Item.Description>
                                <p/>
                                Distance: {result.distance} km
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
            <Sidebar.Pushable data-testid='siteSearch'>
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
                                    <Form.Radio label='easy' value='easy' name='difficulty'
                                                checked={this.state.difficulty === 'easy'}
                                                onChange={this.handleChange}/>
                                    <Form.Radio label='moderate' value='moderate' name='difficulty'
                                                checked={this.state.difficulty === 'moderate'}
                                                onChange={this.handleChange}/>
                                    <Form.Radio label='difficult' value='difficult' name='difficulty'
                                                checked={this.state.difficulty === 'difficult'}
                                                onChange={this.handleChange}/>
                                </Form.Group>
                                <Header as='h4'> Route length in km: Routes up to<Label
                                    color='blue'>{this.state.routeLength}</Label> km </Header>
                                <Slider name='routeLength' color='blue' inverted={false}
                                        settings={{
                                            start: this.state.routeLength,
                                            min: 0, max: 25, step: 1,
                                            onChange: (value) => this.setState({routeLength: value})
                                        }}/>
                                <Accordion>
                                    <Accordion.Title active={this.state.showMoreFeatures} index={0} content='more'
                                                     onClick={this.handleClick}>
                                        <Icon name='dropdown'/>
                                    </Accordion.Title>
                                    <Accordion.Content active={this.state.showMoreFeatures}>
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
                                    </Accordion.Content>
                                </Accordion>
                            </Form>

                            {this.state.searched && <div>
                                {/* */}
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
                            <Grid columns={2}>
                                <Grid.Row>
                                    <Grid.Column width={1}>
                                        <Icon verticalAlignment='bottom' link name='arrow left'
                                              onClick={() => this.onShowDetail(-1)}/>
                                    </Grid.Column>
                                    <Grid.Column width={15}>
                                        <Header as='h2'>
                                            {detailRoute.title}
                                            <Header.Subheader as='h4'>{detailRoute.address}</Header.Subheader>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Segment.Group className='basic'>
                                <Segment basic>
                                    <Image centered fluid src={detailRoute.image}/>
                                </Segment>

                                <Segment.Group className='basic' horizontal textAlign='center'>
                                    <Segment basic>
                                        <Statistic horizontal size='mini' value={detailRoute.distance} label='km'/>
                                    </Segment>
                                    <Segment basic>
                                        <Statistic horizontal size='mini' label={detailRoute.difficulty}/>
                                    </Segment>
                                    <Segment basic>
                                        <Rating basic icon='star' defaultRating={detailRoute.rating} maxRating={5}
                                                disabled size='huge'/>
                                    </Segment>
                                </Segment.Group>

                                <Segment basic textAlign='center'>
                                    {detailRoute.features.map((feature) => <Label>{feature}</Label>)}
                                </Segment>

                                <Comment.Group minimal>

                                    <Header as='h2' dividing>
                                        <Button color='blue' icon='heart' content='Add Review'
                                                onClick={this.toggleReviewDialog} floated="right" compact/>
                                        <Header.Content>Reviews</Header.Content>
                                        <Modal open={this.state.reviewIsOpen} closeOnEscape={false}
                                               closeOnDimmerClick={false} size='small' centered>
                                            <Modal.Header>New Review for {detailRoute.title}</Modal.Header>
                                            <Modal.Content scrolling>
                                                <Form>
                                                    <Header as='h4'>
                                                        Review {detailRoute.title}
                                                    </Header>
                                                    <Form.Field>
                                                        <Comment>
                                                            <Comment.Avatar src='/images/avatar/small/elliot.jpg'/>
                                                            <Comment.Content>
                                                                <Comment.Author as='a'>Max Mustermann</Comment.Author>
                                                                <Comment.Text>
                                                                    <Form.TextArea autoHeight placeholder='Enter your review'/>
                                                                </Comment.Text>
                                                            </Comment.Content>
                                                        </Comment>
                                                    </Form.Field>
                                                    <Form.Input type='file' fluid label='Image'
                                                                placeholder='Upload image file'
                                                                iconPosition='left'
                                                                icon={<Icon name='add' link inverted color='black'/>}/>
                                                    <Rating icon='star' maxRating={5}/>
                                                </Form>
                                            </Modal.Content>
                                            <Modal.Actions>
                                                <Button onClick={this.toggleReviewDialog}>Cancel</Button>
                                                <Button primary onClick={this.onSubmitReview}>Submit</Button>
                                            </Modal.Actions>
                                        </Modal>
                                    </Header>

                                    {detailRoute.comments.map((comment) =>
                                        <Comment>
                                            <Comment.Content>
                                                <Comment.Author as='b'>{comment.author}</Comment.Author>
                                                <Comment.Metadata>
                                                    <span>{comment.datetime}</span>
                                                </Comment.Metadata>
                                                <Comment.Text><p>{comment.text}</p></Comment.Text>
                                                <Comment.Actions>
                                                    <Rating as='a' icon='star' defaultRating={comment.stars}
                                                            maxRating={5} disabled/>
                                                </Comment.Actions>
                                            </Comment.Content>
                                        </Comment>)}
                                </Comment.Group>
                            </Segment.Group>
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

