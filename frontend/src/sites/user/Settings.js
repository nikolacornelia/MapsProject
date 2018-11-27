import React, {Component} from 'react';
import {Container, Header, Button, Divider, Grid, Image, Segment, Icon, Input} from 'semantic-ui-react'

class Settings extends Component {

    render() {
        return (
            <Container as={Segment} basic padded>
                <Header as='h2' dividing>
                    <Icon name='settings'/>
                    <Header.Content>Settings
                        <Header.Subheader as='h3'>Change the settings of your account</Header.Subheader>
                    </Header.Content>
                </Header>

            </Container>
        );
    }
}

export default Settings;