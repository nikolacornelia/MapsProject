import React, {Component} from 'react';
import {
    Container,
    Header,
    Button,
    Divider,
    Grid,
    Image,
    Segment,
    Icon,
    Input,
    Comment,
    Rating,
    TextArea,
    Item
} from 'semantic-ui-react';
import axios from 'axios';
import {mockData} from '../../mockData';

class MyReviews extends Component {
    constructor(props) {
        super(props);
        this.state = {
            routes: mockData
        };
        this.user = JSON.parse(sessionStorage.getItem("user"));
    }

    /**
     * This function is called after the react component has loaded.
     */
    componentDidMount = () => {
        this.getMyReviews();
    };

    /**
     * Requests the data for my reviews.
     */
    getMyReviews = () => {
        axios.get("http://localhost:3001/reviewedRoutes", {
            params: {
                user: this.user._id
            }
        }).then((response) => this.setState({routes: response.data}));
    };


    /**
     * Deletes a review from a route.
     * @param i - i-th review to be deleted
     */
    handleDelete = (i) => {
        axios.delete('http://localhost:3001/Rating', {
            params: {
                _id: i,
            }
        }).then(() => this.getMyReviews());

    };


    /**
     * Switches a selected review to edit mode.
     * @param i - i-th review to be edited
     */
    handleEdit = (i) => {
        let routes = this.state.routes;
        routes[i].edit = true;
        this.setState({routes: routes});
    };

    /**
     * Cancels the edit mode of a review.
     * @param i - i-th review to cancel
     */
    handleCancel = (i) => {
        let routes = this.state.routes;
        routes[i].edit = false;
        this.setState({routes: routes});
    };


    /**
     * Saves the changes of a review.
     * @param i - i-th review to save
     */
    handleSave = (i) => {
        let route = this.state.routes[i];

        // todo: check if ok?
        axios.post('http://localhost:3001/review', {
            routeId: route._id,
            review: route.comments[0]
        }).then(this.getMyReviews);
    };

    render() {
        return (
            <Container as={Segment} basic padded>
                <Header as='h2' dividing>
                    <Icon name='globe'/>
                    <Header.Content>My Reviews
                        <Header.Subheader as='h3'> Reviews you have created</Header.Subheader>
                    </Header.Content>
                </Header>
                <Grid columns={2} divided='vertically'>
                    {this.state.routes.map((route, i) =>
                        <Grid.Row>
                            <Grid.Column>
                                <Item.Group>
                                    <Item>
                                        <Item.Image size='small'
                                                    src={route.image ? 'http://localhost:3001/Image?id=' + route.image : '/static/media/route-noimage.png'}/>
                                        <Item.Content>
                                            <Item.Header as='h4'> {route.title} </Item.Header>
                                            <Item.Meta>{route.location}</Item.Meta>
                                            <Item.Description>
                                                <div>Distance: {route.distance} km</div>
                                                <div>Difficulty: {route.difficulty}</div>
                                            </Item.Description>
                                            <Item.Extra>
                                                <Rating icon='star' defaultRating={route.avg_rating} maxRating={5}
                                                        disabled/>
                                            </Item.Extra>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                            </Grid.Column>
                            <Grid.Column>
                                {route.comments.length > 0 && <div>
                                    <Comment.Group size='large'>
                                        <Comment>
                                            <Comment.Avatar src='./static/media/avatar-1.png'/>
                                            <Comment.Content>
                                                <Comment.Author as='b'>{route.comments[0].author}</Comment.Author>
                                                <Comment.Metadata>
                                                    <span>{route.comments[0].created}</span>
                                                </Comment.Metadata>
                                                <Comment.Text>
                                                    {route.edit
                                                        ? <TextArea style={{width: "100%"}}
                                                                    onChange={this.handleChangeComment}>{route.comments[0].comment}</TextArea>
                                                        : (route.comments[0].comment)
                                                    }
                                                </Comment.Text>
                                                <Comment.Actions>
                                                    <Rating as='a' icon='star' defaultRating={route.comments[0].rating}
                                                            maxRating={5} disabled={!route.edit}
                                                            onChange={this.handleChangeComment}
                                                    />
                                                </Comment.Actions>
                                            </Comment.Content>
                                        </Comment>
                                    </Comment.Group>

                                    {!route.edit ? <div>
                                        <Button floated='right' compact
                                                onClick={() => this.handleDelete(route.comments[0]._id)}>
                                            Delete
                                        </Button>
                                        <Button floated='right' primary compact
                                                onClick={() => this.handleEdit(i)}>
                                            Edit
                                        </Button>
                                    </div> : <div>
                                        <Button floated='right' compact onClick={() => this.handleCancel(i)}>
                                            Cancel
                                        </Button>
                                        <Button floated='right' primary compact
                                                onClick={() => this.handleSave(i)}>
                                            Save
                                        </Button>
                                    </div>
                                    }
                                </div>}
                            </Grid.Column>
                        </Grid.Row>
                    )}
                </Grid>
            </Container>
        );
    }
}

export default MyReviews;