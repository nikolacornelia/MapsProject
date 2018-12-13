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
import {Slider} from 'react-semantic-ui-range';
import {mockData, mockFeatures} from '../mockData';
import axios from "axios";
import validator from 'validator';
import * as ShowRoute from './maps/ShowRoute';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            difficulty: [],
            routeLength: 5,
            searchText: '',
            sortBy: 1,

            searched: false,
            showDetail: -1,
            reviewIsOpen: false,
            comments: [],
            files: []
        };
        this.user = JSON.parse(sessionStorage.getItem("user"));
    }

    componentDidMount = () => {
        ShowRoute.onInit();
    };

    // RadioButton Logik
    handleChangeDifficulty = (e, {name, value, checked}) => {
        let difficulty = this.state.difficulty;
        if (checked) {
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
     * Sends a search for routes request
     */
    onSearch = () => {
        axios.get('http://localhost:3001/getRoutes', {
            withCredentials: true,
            params: {
                search: this.state.searchText,
                difficulty: this.state.difficulty,  // array
                distance: this.state.routeLength,
                features: this.state.features,      // array
                sortBy: this.state.sortBy,
            }
        }).then((response) => {

            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].distance && response.data[i].distance > 0)
                    response.data[i].distance = Math.round(response.data[i].distance * 100) / 100;
            }

            this.setState({
                searched: true,
                routes: response.data
            });

            ShowRoute.displayRoutes(response.data);
        });

    };

    /**
     * Navigates to the detail view of a route (or back)
     * @param {string} id - the id of the route to be displayed (or -1 if back)
     */
    onShowDetail = (id) => {
        // scroll to top
        document.getElementsByClassName('sidebar')[0].scrollTop = 0;

        // request comments for selected route
        if (id !== -1) {
            axios.get('http://localhost:3001/getRatings', {
                params: {
                    route: id
                }
            }).then((response) => {
                // returns object of all comments created
                console.log(response.data);
                this.setState({comments: response.data});
            });
            var routeData = this.state.routes.find((route) => route._id === id);
            console.log(routeData);
            ShowRoute.displayOneRoute(routeData);

        }
        if (id == -1){
            var routeData = this.state.routes;
            console.log (routeData);
            ShowRoute.displayRoutes(routeData);
        }

        // navigate internally to details view
        this.setState({ showDetail: id });
    };

    /**
     * Changes the sorting of the search result list
     * @param key
     */
    onChangeSort = (key) => this.setState({sortBy: key}, this.onSearch);

    onSubmitReview = () => {
        let _submitReview = (e) => {
            console.log("submitReview");
            let image = e && e.target.result; // sends the image as base64
            axios.post('http://localhost:3001/saveRating', {
                route: this.state.showDetail,
                rating: this.state.rating,
                // todo: never pass the userid as an identification in the backend
                //       because it can easily be manipulated. Use backend session as reference for user id
                user: this.user._id,
                comment: this.state.commentText,
                image: image
            }).then(() => {
                // close the dialog & refresh
                this.toggleReviewDialog();
                axios.get('http://localhost:3001/getRatings', {
                    params: {
                        route: this.state.showDetail
                    }
                }).then((response) => {
                    // returns object of all comments created
                    this.setState({comments: response.data});

                });
                // todo nstelle von this.onSearch nur DetailRoute updaten? --> refresh DetailRoute
                this.onSearch();
            });
        };

        // read file if given
        if (this.state.files.length === 1) {
            let fileReader = new FileReader();
            fileReader.onload = _submitReview;
            fileReader.readAsDataURL(this.state.files[0]);
        } else {
            _submitReview();
        }
    };

    /* Functions for review dialog */
    toggleReviewDialog = () => {
        if(this.user) {
            this.setState({reviewIsOpen: !this.state.reviewIsOpen});
        } else {
            window.location = '/#/login';
        }
    };

    onChangeReviewText = (e, {name, value}) => this.setState({[name]: value});
    onChangeReviewRating = (e, {name, rating}) => this.setState({[name]: rating});
    onChangeReviewImage = (e) => {
        let files = e.target.files;

        // Check file type and size
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match('image.*')) {
                // Error: file is not an image
                alert("The file you tried to attach is not an image!");
            } else if (files[i].size >= 10 * 1024 * 1024) {
                // Error: file is too large
                // todo: define max. file size & error routine...
                alert("The file you tried to attach is too big. Images are limited to 1234mb.");
            }
        }
        this.setState({files: files});
    };


    toggleFavorite = (isFavorised) => {
        //isFavorised = new state

        // send request to toggle favorite
        axios.post('http://localhost:3001/favoriseRoute', {
            route: this.state.showDetail,  // currently selected routeid
            isFavorised: isFavorised,
            user: this.user._id             // todo: remove - insecure  ! use userid from session
        }).then((response) => {
            // refresh
            this.onSearch();
        });
    };


    render() {
        var detailRoute;
        if (this.state.showDetail !== -1) {
            detailRoute = this.state.routes.find((route) => route._id === this.state.showDetail);
        }
        return (
            <Grid stackable columns={2} className='map' data-testid='siteSearch'>
                <Grid.Column width={10} style={{paddingRight: 0, paddingBottom: 0}}>
                    <div id='map' style={{height: "100%"}}/>
                </Grid.Column>
                <Grid.Column width={6} as={Segment} style={{height: '100%'}}>
                    {this.state.showDetail === -1 ?
                        /* display search form*/
                        <div class='sidebar'>
                            <Form size='large'>
                                <Header as='h2'>Find a trail / Search for a route</Header>
                                <Form.Input fluid placeholder='Enter area, city or landmark' name='searchText'
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
                                {/* Search Result List */}

                                <Divider/>
                                <Grid columns='equal'>
                                    <Grid.Column textAlign='left'>
                                        <Icon name='list'/> {this.state.routes.length} results
                                    </Grid.Column>
                                    <Grid.Column textAlign='right'>
                                        <Dropdown icon='sort' text='Sort By' direction='left'>
                                            <Dropdown.Menu>
                                                <Dropdown.Header icon='sort' content='Sort by'/>
                                                <Dropdown.Divider/>
                                                <Dropdown.Item active={this.state.sortBy === 1} text='Name'
                                                               onClick={() => this.onChangeSort(1)}/>
                                                <Dropdown.Item active={this.state.sortBy === 2} text='Most popular'
                                                               onClick={() => this.onChangeSort(2)}/>
                                                <Dropdown.Item active={this.state.sortBy === 3}
                                                               text='Most recently created'
                                                               onClick={() => this.onChangeSort(3)}/>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Grid.Column>
                                </Grid>

                                <Item.Group divided link>
                                    {this.state.searched && this.state.routes.map((route) =>
                                        <Item key={route._id} onClick={() => this.onShowDetail(route._id)}>
                                            <Item.Image size='small' rounded
                                                        src={route.image ? 'http://localhost:3001/Image?id=' + route.image : '/static/media/route-noimage.png'}/>
                                            <Item.Content>
                                                <Item.Header as='h4'> {route.title} </Item.Header>
                                                <Item.Meta>{route.address}</Item.Meta>
                                                <Item.Description>
                                                    <p/>
                                                    Distance: {route.distance} km
                                                    <p/>
                                                    Difficulty: {route.difficulty}
                                                    <Item.Extra>
                                                        <Rating icon='star' defaultRating={route.avg_rating}
                                                                maxRating={5} disabled/>
                                                    </Item.Extra>
                                                </Item.Description>
                                            </Item.Content>
                                        </Item>)}
                                </Item.Group>
                                <p/>
                            </div>}
                        </div>
                        : /*else display detail form*/
                        <div className='sidebar'>
                            <Form size='large'>

                                <Header as='h2' style={{width: "100%"}}>
                                    <Icon link name='arrow left' style={{verticalAlign: 'top', fontSize: '1em'}}
                                          onClick={() => this.onShowDetail(-1)}/>
                                    <Header.Content style={{width: "100%"}}>
                                        {detailRoute.title}
                                        <span style={{float: 'right'}}>
                                        <Popup
                                            trigger={<Icon name={detailRoute.isFavorised ? 'heart' : 'heart outline'}
                                                           link color='red' onClick={() => this.toggleFavorite(!detailRoute.isFavorised)}/>}
                                            content={detailRoute.isFavorised
                                                ? 'Remove this route from your favorites.'
                                                : 'Add this route to your favorites.'}
                                            size='tiny' position='bottom right'/>
                                    </span>
                                        <Header.Subheader as='h4'>{detailRoute.location}</Header.Subheader>
                                    </Header.Content>
                                </Header>

                                <Segment.Group className='basic'>
                                    <Segment basic>
                                        <Image centered fluid rounded
                                            //src={detailRoute.image.imageData || '/static/media/route-noimage.png'}
                                               src={'http://localhost:3001/Image?id=' + detailRoute.image || '/static/media/route-noimage.png'}
                                        />
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
                                            <Rating basic icon='star' defaultRating={detailRoute.avg_rating}
                                                    maxRating={5}
                                                    disabled size='huge'/>
                                        </Segment>
                                    </Segment.Group>

                                    {detailRoute.features &&
                                    <Segment basic textAlign='center'>
                                        {detailRoute.features.map((feature) => <Label>{feature}</Label>)}
                                    </Segment>
                                    }

                                    {detailRoute.description &&
                                    <Segment basic>
                                        {detailRoute.description}
                                    </Segment>
                                    }

                                    <Comment.Group minimal>

                                        <Header as='h2' dividing>
                                            <Button color='blue' icon='heart' content='Add Review'
                                                    onClick={this.toggleReviewDialog} floated="right" compact/>
                                            <Header.Content>Reviews</Header.Content>
                                        </Header>
                                        {this.user &&
                                        <Modal open={this.state.reviewIsOpen} closeOnEscape={false}
                                               closeOnDimmerClick={false} size='small' centered>
                                            <Modal.Header>New Review for {detailRoute.title}</Modal.Header>
                                            <Modal.Content scrolling>
                                                <Form>
                                                    <Comment.Group>
                                                        <Comment>
                                                            <Comment.Avatar src='./static/media/avatar-1.png'/>
                                                            <Comment.Content>
                                                                <Comment.Author
                                                                    as='a'>{this.user.username}</Comment.Author>
                                                                <Comment.Text>

                                                                    <Form.Field><Rating icon='star' size='huge'
                                                                                        name='rating' clearable
                                                                                        onRate={this.onChangeReviewRating}
                                                                                        maxRating={5}/></Form.Field>
                                                                    <Form.TextArea autoHeight
                                                                                   name='commentText'
                                                                                   onChange={this.onChangeReviewText}
                                                                                   placeholder='Enter your review'/>
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
                                        }
                                        {(!this.state.comments || this.state.comments.length === 0)
                                            ? <Container textAlign='center'>
                                                <i>No comments available. Be the first one to comment!</i>
                                            </Container>
                                            : this.state.comments.map((comment) => <Comment>
                                                <Comment.Avatar src='./static/media/avatar-1.png'/>
                                                <Comment.Content>
                                                    <Comment.Author as='b'>{comment.user.username}</Comment.Author>
                                                    <Comment.Metadata>
                                                        <span>{new Date(comment.created).toLocaleString()}</span>
                                                    </Comment.Metadata>
                                                    <Comment.Text><p>{comment.comment}</p></Comment.Text>
                                                    <Comment.Actions>
                                                        <Rating as='a' icon='star' defaultRating={comment.rating}
                                                                maxRating={5} disabled/>
                                                    </Comment.Actions>
                                                </Comment.Content>
                                            </Comment>)}
                                    </Comment.Group>
                                    <p/>
                                </Segment.Group>

                            </Form>
                        </div>
                    }
                </Grid.Column>
            </Grid>
        );
    };


}

export default Search;

