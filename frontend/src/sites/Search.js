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
import {mockData, mockFeatures} from '../mockData';
import axios from "axios";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 51.505,
            lng: -0.09,
            zoom: 13,

            difficulty: [],
            routeLength: 5,
            searchText: '',

            searched: false,
            showDetail: -1,
            reviewIsOpen: false,
            isFavorised: false
        }
    }

    // RadioButton Logik
    handleChangeDifficulty = (e, {name, value, checked}) => {
        let difficulty = this.state.difficulty;
        if(checked){
            difficulty.push(value);
        } else {
            difficulty.splice(difficulty.indexOf(value), 1);
        }
        this.setState({difficulty: difficulty});
    };

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value});
    };

    /**
     * Sends a search request after a slight delay (while typing in the search field)
     */
    onSearch = () => {

        if (!this.state.searchText)
            return;

        // todo: add sortby to request
        axios.get('http://localhost:3001/getRoutes', {
            search: this.state.searchText,
            difficulty: this.state.difficulty, // array
            routeLength: this.state.routeLength,

        }).then((response) => {
            this.setState({
                searched: true,
                routes: response.data
            });
        });

    };

    /**
     * Navigates to the detail view of a route (or back)
     * @param {int} id - the id of the route to be displayed (or -1 if back)
     */
    onShowDetail = (id) => {
        let isFavorised = id >= 0 ? mockData[id].isFavorised : false;

        // navigate internally
        this.setState({
            showDetail: id,
            isFavorised: isFavorised
        });
    };

    onSubmitReview = () => {
        // todo: routine for send new review
    };

    toggleReviewDialog = () => {
        this.setState({reviewIsOpen: !this.state.reviewIsOpen});
    };
    toggleFavorite = () => {
        // todo: send request to toggle favorite

        // toggle on UI
        let isFavorised = !this.state.isFavorised;
        this.setState({isFavorised: isFavorised});
    };

    render() {
        const position = [this.state.lat, this.state.lng];

        var searchResults = [];
        if (this.state.searched) {
            this.state.routes.forEach((route) => {
                searchResults.push(
                    <Item onClick={() => this.onShowDetail(route.id)}>
                        <Item.Image size='small' rounded src={route.image}/>
                        <Item.Content>
                            <Item.Header as='h4'> {route.title} </Item.Header>
                            <Item.Meta>{route.address}</Item.Meta>
                            <Item.Description>
                                <p/>
                                Distance: {route.distance} km
                                <p/>
                                Difficulty: {route.difficulty}
                                <Item.Extra>
                                    <Rating icon='star' defaultRating={route.rating} maxRating={5} disabled/>
                                </Item.Extra>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                )
            });
        }
        var detailRoute;
        if (this.state.showDetail >= 0)
            this.state.routes.find((route) => route.id === this.state.showDetail);

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
                                            onChange={this.handleChange}
                                            action={{icon: 'search', onClick: this.onSearch}}/>
                                <Header as='h4' dividing icon='filter' content='Filter'/>
                                <Form.Group inline>
                                    <label>Difficulty</label>
                                    <Form.Checkbox label='easy' value='easy' name='difficulty'
                                                onChange={this.handleChangeDifficulty}/>
                                    <Form.Checkbox label='moderate' value='moderate' name='difficulty'
                                                onChange={this.handleChangeDifficulty}/>
                                    <Form.Checkbox label='difficult' value='difficult' name='difficulty'
                                                onChange={this.handleChangeDifficulty}/>
                                </Form.Group>
                                <Form.Field>
                                    <label>
                                        Route length in km: Routes up to <Label
                                        color='blue'>{this.state.routeLength}</Label> km
                                    </label>
                                    <Slider name='routeLength' color='blue' inverted={false}
                                            settings={{
                                                start: this.state.routeLength,
                                                min: 0, max: 25, step: 1,
                                                onChange: (value) => this.setState({routeLength: value})
                                            }}/>
                                </Form.Field>

                                <Form.Dropdown name='features' label='Features' placeholder='Route features'
                                               multiple search selection options={mockFeatures}
                                               style={{fontSize: '0.85em'}} onChange={this.handleChange}/>
                            </Form>

                            {this.state.searched && <div>
                                {/* */}

                                <Divider/>
                                <Grid columns='equal'>
                                    <Grid.Column textAlign='left'>
                                        <Icon name='list'/> {mockData.length} results
                                    </Grid.Column>
                                    <Grid.Column textAlign='right'>
                                        <Dropdown icon='sort' text='Sort By' direction='left'>
                                            <Dropdown.Menu>
                                                <Dropdown.Header icon='sort' content='Sort by'/>
                                                <Dropdown.Divider/>
                                                <Dropdown.Item active text='Relevance'/>
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

                            <Header as='h2' style={{width: "100%"}}>
                                <Icon link name='arrow left' style={{verticalAlign: 'top', fontSize: '1em'}}
                                      onClick={() => this.onShowDetail(-1)}/>
                                <Header.Content style={{width: "100%"}}>
                                    {detailRoute.title}
                                    <span style={{float: 'right'}}>
                                        <Popup
                                            trigger={<Icon name={this.state.isFavorised ? 'heart' : 'heart outline'}
                                                           link color='red' onClick={this.toggleFavorite}/>}
                                            content={this.state.isFavorised
                                                ? 'Remove this route from your favorites.'
                                                : 'Add this route to your favorites.'}
                                            size='tiny' position='bottom right'/>
                                    </span>
                                    <Header.Subheader as='h4'>{detailRoute.address}</Header.Subheader>
                                </Header.Content>
                            </Header>

                            <Segment.Group className='basic'>
                                <Segment basic>
                                    <Image centered fluid rounded src={detailRoute.image}/>
                                </Segment>

                                <Segment.Group className='basic' horizontal textAlign='center'>
                                    <Segment basic>
                                        <Statistic horizontal size='mini' label='km'>
                                            <Statistic.Value>
                                                <Icon name='map'/> {detailRoute.distance} km
                                            </Statistic.Value>
                                        </Statistic>
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
                                <Segment basic>
                                    {detailRoute.description}
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
                                                    <Comment.Group>
                                                        <Comment>
                                                            <Comment.Avatar src='./static/media/avatar-1.png'/>
                                                            <Comment.Content>
                                                                <Comment.Author as='a'>Max Mustermann</Comment.Author>
                                                                <Comment.Text>

                                                                    <Form.Field><Rating icon='star' size='huge'
                                                                                        maxRating={5}/></Form.Field>
                                                                    <Form.TextArea autoHeight
                                                                                   name='commentText'
                                                                                   placeholder='Enter your review'/>
                                                                    <Form.Input type='file' fluid label='Image'
                                                                                placeholder='Upload image file'
                                                                                iconPosition='left'
                                                                                icon={<Icon name='add' link inverted
                                                                                            color='black'/>}/>
                                                                </Comment.Text>
                                                            </Comment.Content>
                                                        </Comment>
                                                    </Comment.Group>
                                                </Form>
                                            </Modal.Content>
                                            <Modal.Actions>
                                                <Button onClick={this.toggleReviewDialog}>Cancel</Button>
                                                <Button primary onClick={this.onSubmitReview}>Submit</Button>
                                            </Modal.Actions>
                                        </Modal>
                                    </Header>
                                    {detailRoute.comments.length === 0 &&
                                    <Container textAlign='center'>
                                        <i>No comments available. Be the first one to comment!</i>
                                    </Container>}
                                    {detailRoute.comments.map((comment) =>
                                        <Comment>
                                            <Comment.Avatar src='./static/media/avatar-1.png'/>
                                            <Comment.Content>
                                                <Comment.Author as='b'>{comment.author}</Comment.Author>
                                                <Comment.Metadata>
                                                    <span>{comment.datetime}</span>
                                                </Comment.Metadata>
                                                <Comment.Text><p>{comment.text}</p></Comment.Text>
                                                <Comment.Actions>
                                                    <Rating as='a' icon='star'
                                                            defaultRating={comment.stars}
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

