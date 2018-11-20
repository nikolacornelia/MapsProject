import React, {Component} from 'react';
import {Container, Header, Button, Divider, Grid, Image, Segment, Icon, Input} from 'semantic-ui-react'
import {mockData} from '../../mockData';

class MyReviews extends Component {

    render() {
        return (
            <Container as={Segment} basic padded>
                <Header as='h2' dividing>
                    <Icon name='globe'/>
                    <Header.Content>My Reviews
                        <Header.Subheader as='h3'> Routes you have reviewed</Header.Subheader>
                    </Header.Content>
                </Header>
            </Container>
        );
    }
}

export default MyReviews;