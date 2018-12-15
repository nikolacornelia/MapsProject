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
    Label, Rating, Confirm
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
            confirmDelete: false
        };
        this.user = JSON.parse(sessionStorage.getItem("user"));
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
            axios.get('/getMyRoutes', {
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
            axios.get('/getMyLikedRoutes', {
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
        this.setState({routes: []});
        this.setState({tab: name}, this.getMyRoutes);
    };

    /**
     * Deletes a route
     * @param id - route id to be deleted
     */
    handleDelete = () => {
        if(!this.state.confirmDeleteId)
            return;
        let id = this.state.confirmDeleteId;
        if (this.state.tab == 'created') {
            axios.delete('/Route', {
                params: {
                    _id: id
                }
            }).then(() => this.getMyRoutes());
        } else if (this.state.tab == 'liked') {
            axios.delete('/LikedRoute', {
                params: {
                    _id: id
                }
            }).then(() => this.getMyRoutes());
        }
        this.setState({confirmDelete: false, confirmDeleteId: undefined});
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
                                <Dropdown.Item active={this.state.sortBy === 1} text='Name'
                                               onClick={() => this.onSortChange(1)}/>
                                <Dropdown.Item active={this.state.sortBy === 2} text='Most popular'
                                               onClick={() => this.onSortChange(2)}/>
                                <Dropdown.Item active={this.state.sortBy === 3} text='Most recently created'
                                               onClick={() => this.onSortChange(3)}/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Grid.Column>
                </Grid>
                <Item.Group divided link>
                    {this.state.routes.map((result) =>
                        <Item>
                            <Item.Image size='small'
                                        src={result.image ? axios.defaults.baseURL + '/Image?id=' + result.image : '/static/media/route-noimage.png'} />


                            <Item.Content>
                                <Item.Header as='h4'> {result.title} </Item.Header>
                                <Item.Meta>{result.location}</Item.Meta>
                                <Item.Description>
                                    <div>Distance: {result.distance} km</div>
                                    <div>Difficulty: {result.difficulty}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Rating icon='star' defaultRating={result.avg_rating} maxRating={5} disabled/>
                                    <Button floated='right' compact
                                            onClick={() => this.setState({confirmDelete: true, confirmDeleteId: result._id})}>
                                        Delete
                                    </Button>
                                </Item.Extra>
                            </Item.Content>
                        </Item>
                    )}
                </Item.Group>
                <Confirm open={this.state.confirmDelete}
                         onCancel={() => this.setState({confirmDelete: false})}
                         onConfirm={this.handleDelete}
                         content='Are you sure you want to delete this route?'/>
            </Container>

        )
    }
}

export default MyRoutes;