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
    Form,
    Item,
    Dropdown,
    Statistic, Tab, Menu,
    Label, Rating
} from 'semantic-ui-react';
import {mockData} from '../../mockData';
import axios from 'axios';

class MyRoutes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            tab: 'created',
            sortBy: 1,
        };
    }

    /**
     * read my routes after component loaded
     */
    componentDidMount = () => {
        this.getMyRoutes();
    };

    /**
     * sets sort by parameter
     */
    onSortChange = (key) => {
        // change sort and afterwards trigger an update
        this.setState({sortBy: key}, this.getMyRoutes());
    };

    /**
     * Gets my routes from the backend
     */
    getMyRoutes = () => {
        if (this.state.tab == 'created') {
            axios.get('http://localhost:3001/getMyRoutes', {
                params: {
                    tab: this.state.tab,
                    sortBy: this.state.sortBy
                }
            }).then((response) => {
                this.setState({
                    searched: true,
                    routes: response.data
                });
            });

        } else if (this.state.tab == 'liked') {
            axios.get('http://localhost:3001/getMyLikedRoutes', {
                params: {
                    tab: this.state.tab,
                    sortBy: this.state.sortBy
                }
            }).then((response) => {
                this.setState({
                    searched: true,
                    routes: response.data
                });
            });

        }

    };

    /**
     * Change Tab and afterwards trigger an update
     * @param e - Change event
     * @param name - name of the tab to be selected
     */
    handleTabNavigation = (e, {name}) => {
        this.setState({tab: name}, this.getMyRoutes);
    };

    /**
     * Deletes a route
     * @param id - route id to be deleted
     */
    handleDelete = (id) => {
        if (this.state.tab == 'created') {
            axios.delete('http://localhost:3001/Route', {
                params: {
                    _id: id
                }
            }).then(() => this.getMyRoutes());
        } else if (this.state.tab == 'liked') {
            axios.delete('http://localhost:3001/LikedRoute', {
                params: {
                    _id: id
                }
            }).then(() => this.getMyRoutes());
        }
/**
        // http verb "DELETE" (similar to get)
        axios.delete('http://localhost:3001/myRoutes', {
            params: {
                _id: id
            }
        }).then(() => this.getMyRoutes()); **/
    };

    render() {
        return (
            <Container as={Segment} basic padded>
                <Header as='h2' dividing>
                    <Icon name='map signs'/>
                    <Header.Content>My Routes
                        <Header.Subheader as='h3'>Routes you have created</Header.Subheader>
                    </Header.Content>
                </Header>
                <Menu secondary pointing>
                    <Menu.Item name='created' link active={this.state.tab === 'created'}
                               onClick={this.handleTabNavigation}>Routes I created</Menu.Item>
                    <Menu.Item name='liked' link active={this.state.tab === 'liked'} onClick={this.handleTabNavigation}>Routes
                        I liked</Menu.Item>
                </Menu>

                <Grid columns='equal'>
                    <Grid.Column textAlign='left'>
                        <Icon name='list'/> {this.state.routes.length} results
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Dropdown text='Sort By' direction='left' onChange={this.onSortChange}>
                            <Dropdown.Menu>
                                <Dropdown.Header icon='sort' content='Sort by'/>
                                <Dropdown.Divider/>
                                <Dropdown.Item active={this.state.sortBy === 1} text='Name' onClick={()=>this.onSortChange(1)}/>
                                <Dropdown.Item active={this.state.sortBy === 2} text='Most popular' onClick={()=>this.onSortChange(2)}/>
                                <Dropdown.Item active={this.state.sortBy === 3} text='Most recently created' onClick={()=>this.onSortChange(3)}/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Grid.Column>
                </Grid>
                <Item.Group divided link>
                    {this.state.routes.map((result) =>
                        <Item>
                            <Item.Image size='small' src={result.image} />


                            <Item.Content>
                                <Item.Header as='h4'> {result.title} </Item.Header>
                                <Item.Meta>{result.location}</Item.Meta>
                                <Item.Description>
                                    <div>Distance:{result.distance} km</div>
                                    <div>Difficulty: {result.difficulty}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Rating icon='star' defaultRating={result.avg_rating} maxRating={5} disabled/>
                                    <Button floated='right' compact onClick={() => this.handleDelete(result._id)}>
                                        Delete
                                    </Button>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    )}
                </Item.Group>
            </Container>

        )
    }
}

export default MyRoutes;