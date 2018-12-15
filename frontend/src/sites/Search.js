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
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            difficulty: [],
            routeLength: 5,
            searchText: '',
            sortBy: 1,

            searched: false,
            showDetail: null,
            reviewIsOpen: false,
            comments: [],
            files: [],
            routes: [],
            userComment: null
        };
        this.user = JSON.parse(sessionStorage.getItem("user"));
    }

    /** Injects leaflet functionality after React component was loaded */
    componentDidMount = () => {
        ShowRoute.onInit();
    };


    /********************************
     *  Functions on search list level
     ********************************/

    /**
     * Handles the change of a CheckBox control
     * @param e - Event triggered from CheckBox control
     * @param value - determines which CheckBox was pressed
     * @param checked -  determines whether the new state is checked
     */
    handleChangeDifficulty = (e, {value, checked}) => {
        let difficulty = this.state.difficulty;
        if (checked) {
            difficulty.push(value);
        } else {
            difficulty.splice(difficulty.indexOf(value), 1);
        }
        this.handleChange(e, { name: 'difficulty', value: difficulty});
    };

    /**
     * Handles the change from a user for one of the search/filter controls
     * @param e - Event that is triggered from the browser
     * @param name - name of the control that was changed
     * @param value - new value that was changed
     */
    handleChange = (e, {name, value}) => {
        this.setState({[name]: value});
    };

    /**
     * Sends a search for routes request
     * {boolean} dontDisplay - Determines whether the search result shall be given to the leaflet map
     */
    onSearch = (dontDisplay) => {
        axios.get('/getRoutes', {
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

            // update details data in case details view is active
            let detailData = this.state.showDetail && response.data.find((route) => route._id === this.state.showDetail._id);

            this.setState({
                searched: true,
                routes: response.data,
                showDetail: detailData
            });

            if (!dontDisplay) {
                ShowRoute.displayRoutes(response.data);
            }
        });

    };

    /**
     * Navigates to the detail view of a route (or back)
     * @param {string} id - the id of the route to be displayed (or null if back)
     */
    onShowDetail = (id) => {
        // scroll to top
        document.getElementsByClassName('sidebar')[0].scrollTop = 0;

        var detailData = this.state.routes.find((route) => route._id === id);

        if (id) {
            // request comments for selected route
            axios.get('/getRatings',
                {params: {route: id}}
            ).then((response) => {
                // returns object of all comments created
                this.setState({comments: response.data});
            });

            ShowRoute.displayOneRoute(detailData);
        } else {
            var routeData = this.state.routes;
            ShowRoute.displayRoutes(routeData);
        }

        // navigate internally to details view
        this.setState({showDetail: detailData});
    };

    /**
     * Changes the sorting of the search result list
     * @param key
     */
    onChangeSort = (key) => this.setState({sortBy: key}, this.onSearch);

    /********************************
     *  Functions for review dialog
     ********************************/

    /** Handler for submitting a new review */
    onSubmitReview = () => {
        let _submitReview = (e) => {
            let image = e && e.target.result; // sends the image as base64
            axios.post('/saveRating', {
                route: this.state.showDetail._id,
                rating: this.state.rating,
                comment: this.state.commentText,
                image: image
            }).then(() => {
                // close the dialog & refresh
                this.toggleReviewDialog();
                axios.get('/getRatings', {
                    params: {
                        route: this.state.showDetail._id
                    }
                }).then((response) => {
                    // returns object of all comments created
                    this.setState({comments: response.data});
                });
                // todo nstelle von this.onSearch nur DetailRoute updaten? --> refresh DetailRoute
                this.onSearch(true);
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

    /** Opens the Create new Review dialog */
    toggleReviewDialog = () => {
        if (this.user) {
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
                return;
            } else if (files[i].size >= 10 * 1024 * 1024) {
                // Error: file is too large
                // todo: define max. file size & error routine...
                alert("The file you tried to attach is too big. Images are limited to 1234mb.");
                return;
            }
        }
        this.setState({files: files});
    };


    /**
     * Changes the favorisation of a route
     * @param {boolean} isFavorised - determines the new state of favorization
     */
    toggleFavorite = (isFavorised) => {
        if (this.user === null) {
            window.location = '/#/login';
            return;
        }
        // send request to toggle favorite
        axios.post('/favoriseRoute', {
            route: this.state.showDetail._id,
            isFavorised: isFavorised
        }).then((response) => {
            // refresh
            this.onSearch(true);
        });
    };


    render() {
        let images = [];
        this.state.showDetail && this.state.showDetail.image && images.push(this.state.showDetail.image);
        for (let i = 0; i < this.state.comments.length; i++) {
            let img = this.state.comments[i].image;
            img && images.push(img);
        }


        return (
            <Grid stackable columns={2} className='map' data-testid='siteSearch'>
                <Grid.Column width={10} style={{paddingTop: '1.45rem', paddingRight: 0, paddingBottom: 0}}>
                    <div id='map' style={{height: "100%"}}/>
                </Grid.Column>
                <Grid.Column width={6} as={Segment} style={{height: '100%'}}>
                    {!this.state.showDetail ?
                        /* display search form*/
                        <div class='sidebar'>
                            <Form size='large'>
                                <Header as='h2'>Search for a route</Header>
                                <Form.Input fluid placeholder='Enter area, city or landmark' name='searchText'
                                            onChange={this.handleChange}
                                            action={{
                                                icon: 'search',
                                                onClick: this.onSearch,
                                                placeholder: 'searchButton'
                                            }}/>
                                <Header as='h4' dividing icon='filter' content='Filter'/>
                                <Form.Group inline>
                                    <label>Difficulty</label>
                                    <Form.Checkbox label='easy' value='easy' name='difficulty' data-testid='difficultyEasy'
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
                                <Grid columns='equal' data-testid='searchResultList'>
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
                                    {this.state.searched && this.state.routes.map((route, i) =>
                                        <Item key={route._id} onClick={() => this.onShowDetail(route._id)}
                                              data-testid={'searchResult' + i}>
                                            <Item.Image size='small' rounded
                                                        src={route.image ? axios.defaults.baseURL + '/Image?id=' + route.image : '/static/media/route-noimage.png'}/>
                                            <Item.Content>
                                                <Item.Header as='h4'> {route.title} </Item.Header>
                                                <Item.Meta>{route.location}</Item.Meta>
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
                            <Form size='large' data-testid='detailForm'>

                                <Header as='h2' style={{width: "100%"}}>
                                    <Icon link name='arrow left' style={{verticalAlign: 'top', fontSize: '1em'}}
                                          onClick={() => this.onShowDetail(null)}/>
                                    <Header.Content style={{width: "100%"}}>
                                        {this.state.showDetail.title}
                                        <span style={{float: 'right'}}>
                                        <Popup
                                            trigger={<Icon
                                                name={this.state.showDetail.isFavorised ? 'heart' : 'heart outline'}
                                                link color='red' data-testid='toggleFavorite'
                                                onClick={() => this.toggleFavorite(!this.state.showDetail.isFavorised)}/>}
                                            content={this.state.showDetail.isFavorised
                                                ? 'Remove this route from your favorites.'
                                                : 'Add this route to your favorites.'}
                                            size='tiny' position='bottom right'/>
                                    </span>
                                        <Header.Subheader as='h4'>{this.state.showDetail.location}</Header.Subheader>
                                    </Header.Content>
                                </Header>
                                <Segment.Group className='basic'>
                                    <Segment basic>
                                        <Carousel autoPlay showArrows infiniteLoop useKeyboardArrows showThumbs={false}>
                                            {images.length > 0
                                                ? images.map((image) => <div>
                                                    <img src={axios.defaults.baseURL + '/Image?id=' + image}/>
                                                </div>)
                                                : <div>
                                                    <img src='/static/media/route-noimage.png'/>
                                                </div>
                                            }
                                        </Carousel>
                                    </Segment>
                                    <Segment.Group className='basic' horizontal textAlign='center'>
                                        <Segment basic>
                                            <Statistic horizontal size='mini' label='km'>
                                                <Statistic.Value>
                                                    <Icon name='map'/> {this.state.showDetail.distance} km
                                                </Statistic.Value>
                                            </Statistic>
                                        </Segment>
                                        <Segment basic>
                                            <Statistic horizontal size='mini' label={this.state.showDetail.difficulty}/>
                                        </Segment>
                                        <Segment basic>
                                            <Rating basic icon='star' rating={this.state.showDetail.avg_rating}
                                                    maxRating={5} disabled size='huge'/>
                                        </Segment>
                                    </Segment.Group>

                                    {this.state.showDetail.features &&
                                    <Segment basic textAlign='center'>
                                        {this.state.showDetail.features.map((feature) => <Label>{feature}</Label>)}
                                    </Segment>
                                    }

                                    {this.state.showDetail.description &&
                                    <Segment basic>
                                        {this.state.showDetail.description}
                                    </Segment>
                                    }

                                    <Comment.Group minimal>

                                        <Header as='h2' dividing>
                                            <Button color='blue' icon='heart' content='Add Review'
                                                    data-testid='btnAddReview'
                                                    onClick={this.toggleReviewDialog} floated="right" compact/>
                                            <Header.Content>Reviews</Header.Content>
                                        </Header>
                                        {this.user &&
                                        <Modal open={this.state.reviewIsOpen} closeOnEscape={false}
                                               closeOnDimmerClick={false} size='small' centered>
                                            <Modal.Header>New Review for {this.state.showDetail.title}</Modal.Header>
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
                                                                                        maxRating={5}
                                                                                        data-testid='newReviewRating'/></Form.Field>
                                                                    <Form.TextArea autoHeight
                                                                                   name='commentText'
                                                                                   onChange={this.onChangeReviewText}
                                                                                   placeholder='Enter your review'/>
                                                                    <Form.Input type='file' fluid label='Image'
                                                                                placeholder='Upload image file'
                                                                                iconPosition='left'
                                                                                onChange={this.onChangeReviewImage}
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
                                                    <Comment.Text><p>{comment.comment ? comment.comment :
                                                        <div>&nbsp;</div>}</p></Comment.Text>
                                                    <Comment.Actions>
                                                        <Rating as='a' icon='star' rating={comment.rating}
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

