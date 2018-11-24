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
    Statistic,
    Label, Rating
} from 'semantic-ui-react'
import {mockData} from '../../mockData';
import axios from 'axios';

class MyRoutes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            routes: []
        };
    }

    /**
     * read my routes after component loaded
     */
    componentDidMount = () => {
        this.getMyRoutes();
    };

    getMyRoutes = () => {
        axios.get('http://localhost:3001/getMyRoutes').then((response) => {
            this.setState({
                searched: true,
                routes: response.data
            });
        });
    };

    handleDelete = (id) => {
        // http verb "DELETE" (similar to get)
        axios.delete('http://localhost:3001/myRoutes', {
            params: {
                _id: id
            }
        });
    };

    render() {

        return (
            <Container as={Segment} basic padded>
                <Header as='h2' dividing>
                    <Icon name='map signs'/>
                    <Header.Content>My Routes
                        <Header.Subheader as='h3'> Routes you have created</Header.Subheader>
                    </Header.Content>
                </Header>
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
                    {this.state.routes.map((result) =>
                        <Item>
                            <Item.Image size='small' src={result.image}/>

                            <Item.Content>
                                <Item.Header as='h4'> {result.name} </Item.Header>
                                <Item.Meta>{result.address}</Item.Meta>
                                <Item.Description>
                                    <div>Distance:{result.distance} km</div>
                                    <div>Difficulty: {result.difficulty}</div>
                                </Item.Description>
                                <Item.Extra>
                                    <Rating icon='star' defaultRating={result.rating} maxRating={5} disabled/>
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