import React, {Component} from 'react';
import {
    Container,
    Header,
    Button,
    Divider,
    Grid,
    Image,
    Sidebar,
    Visibility,
    Responsive,
    Segment,
    Menu,
    Icon,
    Input,
    Checkbox,
    Accordion,
    Form,
    Radio,
    Message
} from 'semantic-ui-react'
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';
import {Slider} from 'react-semantic-ui-range';


class FAQ extends Component {


    state = {activeIndex: -1}

    handleClick = (e, titleProps) => {
        const {index} = titleProps
        const {activeIndex} = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({activeIndex: newIndex})
    }

    render() {
        const {activeIndex} = this.state

        return (

            <Container>
                <Header as='h2'>FAQ</Header>
                <Accordion block fluid styled>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                        Most frequently asked quesion 1
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <p>
                            Answer to Q1
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                        Most frequently asked quesion 2
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <p>
                            Answer to Q2
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                        Most frequently asked quesion 3
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <p>
                            Answer to Q3. This is the following: Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
                        Most frequently asked quesion 4
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <p>
                            Answer to Q4. This is the following: Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 4} index={4} onClick={this.handleClick}>
                        Most frequently asked quesion 5
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 4}>
                        <p>
                            Answer to Q5. This is the following: Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 5} index={5} onClick={this.handleClick}>
                        Most frequently asked quesion 6
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 5}>
                        <p>
                            Answer to Q6. This is the following: Lorem ipsum dolor sit amet,
                            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                            voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                            cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </Accordion.Content>
                </Accordion>
            </Container>


        )
    }
}

export default FAQ;