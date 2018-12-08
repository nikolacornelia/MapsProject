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
import * as ShowRoute from './maps/showRoute';


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
            isFavorised: false,
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
        // todo: check if features are supposed to be sent as strings?
        axios.get('http://localhost:3001/getRoutes', {
            params: {
                search: this.state.searchText,
                difficulty: this.state.difficulty,  // array
                distance: this.state.routeLength,
                features: this.state.features,      // array
                sortBy: this.state.sortBy,
            }
        }).then((response) => {

            // todo: it would be better to provide URLs for the images (put urls in response body, not image data)
            //       then the search response is smaller (because not every image is in there) & quicker.
            //       The browser can then send requests for each <img src="..."> asynchronously

            for (let i = 0; i < response.data.length; i++) {

                if(response.data[i].distance && response.data[i].distance > 0)
                    response.data[i].distance = Math.round(response.data[i].distance * 100) / 100;
                // response.data[i].image = new Buffer( response.data[i].image, 'base64').toString('binary');
                // response.data[i].image = Buffer.from(response.data[i].image, 'base64');
                if (response.data[i].image != undefined) {
                    //response.data[i].image.toString();
                    //response.data[i].image = "data:image/jpeg;base64,/9j" + response.data[i].image;
                    response.data[i].image.toString();

                    console.log(response.data[i].image);
                    //response.data[i].image.toString();
                    //response.data[i].image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCADqATkDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAAECA//EACQQAQEBAAIBBAMBAQEBAAAAAAABESExQQISUXFhgZGxocHw/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEQH/2gAMAwEAAhEDEQA/AMriLyCKgg1gQwCgs4FTMOdutepjQak+FzMSVqgxZdRdPPIIvH5WzzGdBriphtTeAXg2ZjKA1pqKDUGZca3foBek8gFv8Ie3fKdA1qb8s7hoL6eLVt51FsAnql3Ut1M7AWbflLMDkEMX/F6/YjK/pADFQAUNA6alYagKk72m/j9p4Bq2fDDSYKLNXPNLoHE/NT6RYC31cJxZ3yWVM+aBYi/S2ZgiAsnYJx5D21vPmqrm3PTfpQQwyAC8JZvSKDni41ZrMuUVVl+Uz9w9v/1QWrZsZ5nFPHYH+JZyureQSF5M+fJ0CAfwRAVRBQA1DAWVUayoJUWoDpsxntPsueBV4+VxhdyAtv8AjOLGpIDMLbeGvbF4iozJfr/WukAVABAXAQXEAAASzVAZdO2WNordm+emFl7XcQSNZiFtv0C9w90nhJf4mA1u+GcJFwIyAqL/AOovwgGNfSRqdIrNa29M0gKCAojU9PAMjWXpckEJFNFEAAXEUBABYz6rZ0ureQc9vyt9XxDF2QAXtABcQAs0AZywkvluJbyipifas52DcyxjlZweAO0xri/hc+wZOEKIu6nSyeToVZyWXwvCg53gW81QQ7aTNAn5dGZJPs1UXURQAUEMCXQLZE93PRZ5hPTgNMrbIzKCm52LZwCs+2M8w2g3sjPuZAXb4IsMAUACzVUGM4/K+md6vEXUUyM5PDR0IxYe6ramih0VNBrS4xoqN8Q1BFQk3yqyAsioioAAKgDSJL4/jQIn5igLrPqtOuf6oOaxbMoAltUAhhIoJiiggrPu+AaOIxtAX3JbaAIaLwi4t9X4T3fg2AFtqcrUUarP20zUDAmqoE0WRBZPNVUVEAAAAVAC8kvih2DSKxOdBqs7Z0l0gI0mKAC4AuHE7ZtBriM+744QAAAAABAFsveIttBICyaikvy1+r/Cen5rWQHIBQa4rIDRqSl5qDWqziqgAAAATA7BpGdqXb2C2+J/UgAtRQBSQtkBWb6vhLbQAAAAAEBRAAAAAUbm+GZNdPxAP+ql2Tjwx7/wIgZ8iKvBk+CJoCXii9gaqZ/qqihAAAEVABGkBFUwBftNkZ3QW34QAAABFAQAVAAAAAARVkl8gs/43sk1jL45LvHArepk+E9XTG35oLqsmIKmLAEygKg0y1AFQBUXwgAAAoBC34S3UAAABAVAAAAAABAUQAVABdRQa1PcYyit2z58M8C4ouM2NXpOEGeWtNZUatiAIoAKIoCoAoG4C9MW6dgIoAIAAAAAAACKWAgL0CAAAALiANCKioNLgM1CrLihmTafkt1EF3SZ5ZVUW4mnIKvAi5fhEURVDWVQBRAAAAAAAAQFRVyAyulgAqCKlF8IqLsEgC9mGoC+IusqCrv5ZEUVOk1RuJfwSLOOkGFi4XPCoYYrNiKauosBGi9ICstM1UAAAAAAFQ0VcTBAXUGgIqGoKhKAzRRUQUAwxoSrGRpkQA/qiosOL9oJptMRRVZa0VUqSiChE6BqMgCwqKqIogAIAqKCKgKoogg0lBFuIKgAAAKNRlf2gqsftsEtZWoAAqAACKoMqAAeSoqp39kL2AqLOlE8rEBFQARYALhigrNC9gGmooLp4TweEQFFBFAECgIoAu0ifIAqAAA//9k=";
                    /**
                     response.data[i].image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==";
                     console.log(response.data[i].image);
                     } **/

            } else {
                    response.data[i].image = undefined;
                } }

            console.log(response.data);

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
        let isFavorised = id !== -1
            ? this.state.routes.find((route) => route._id === id).isFavorised
            : false;

        // scroll to top

        document.getElementsByClassName('sidebar')[0].scrollTop = 0;

        // request comments for selected route
        if(id !== -1) {
            axios.get('http://localhost:3001/getRatings', {
                params: {
                    route: id
                }
            }).then((response) => {
                // returns object of all comments created
                console.log(response.data);
                this.setState({comments: response.data});
            });
        }

        // navigate internally to details view
        this.setState({
            showDetail: id,
            isFavorised: isFavorised
        });
    };

    /**
     * Changes the sorting of the search result list
     * @param key
     */
    onChangeSort = (key) => this.setState({sortBy: key}, this.onSearch);

    onSubmitReview = () => {
        let _submitReview = (e) => {
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
    toggleReviewDialog = () => this.setState({reviewIsOpen: !this.state.reviewIsOpen});

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


    toggleFavorite = () => {
        console.log("beginning");
        console.log(isFavorised);
        //let isFavorised = !this.state.isFavorised;
        let isFavorised = !this.state.isFavorised; //state is favorised is new state

        // send request to toggle favorite
        axios.post('http://localhost:3001/favoriseRoute', {
            route: this.state.showDetail,  // currently selected routeid
            isFavorised: isFavorised,
            user: this.user._id
        }).then((response) => {
            // toggle status (or is the new status in response.data?)
            this.setState({isFavorised: isFavorised});
            //todo update this.state.routes change is Favorised for Route which status got changed -> heart is changing directly

        });

    };


    render() {
        /*
                var searchResults = [];
                if (this.state.searched) {
                    console.log(this.state.routes);
                    this.state.routes.forEach((route) => {
                        searchResults.push(
                            //route._id is the right name to get id from mongo db

                        )
                    });
                }*/
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
                                            trigger={<Icon name={this.state.isFavorised ? 'heart' : 'heart outline'}
                                                           link color='red' onClick={this.toggleFavorite}/>}
                                            content={this.state.isFavorised
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
                                                src = {'http://localhost:3001/Image?id=' + detailRoute.image || '/static/media/route-noimage.png'}
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

                                        {(!this.state.comments || this.state.comments.length === 0)
                                            ? <Container textAlign='center'>
                                                <i>No comments available. Be the first one to comment!</i>
                                            </Container>
                                            : this.state.comments.map((comment) => <Comment>
                                                <Comment.Avatar src='./static/media/avatar-1.png'/>
                                                <Comment.Content>
                                                    <Comment.Author as='b'>{comment.user.username}</Comment.Author>
                                                    <Comment.Metadata>
                                                        <span>{comment.created}</span>
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

