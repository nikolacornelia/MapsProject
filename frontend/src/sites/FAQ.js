import React, {Component} from 'react';
import {Container, Header, Segment, Icon, Accordion} from 'semantic-ui-react';

class FAQ extends Component {

    constructor(props){
        super(props);
        this.state = {
            activeIndex: -1
        };
    }

    handleClick = (e, titleProps) => {
        const {index} = titleProps;
        const {activeIndex} = this.state;
        const newIndex = activeIndex === index ? -1 : index;

        this.setState({activeIndex: newIndex});
    };

    render() {
        const {activeIndex} = this.state;

        return (
            <Container as={Segment} basic padded>
                <Header as='h2' dividing>
                    <Icon name='question'/>
                    <Header.Content>FAQ
                        <Header.Subheader as='h3'>Frequently asked Questions</Header.Subheader>
                    </Header.Content>
                </Header>
                <Accordion block fluid styled data-testid='faqAccordion'>
                    <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                        What are the requirements for a route?
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 0}>
                        <p>
                            When you are logged in, you can create your own route. It needs to consist of at least two points.
                            Another prerequisite is a route distance lower than 25 kilometers, as we are a website not only for trained athletes.
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                        Why is one of my photos not uploading?
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 1}>
                        <p>
                           Reassure that the type of your document is an image and that its size is not to large. Try it with a photo of lower quality.
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
                        In which countries can I create routes?
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 2}>
                        <p>
                           At the moment our application is limited to countries in Europe because of the used Geocoding API.
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
                        How many photos can I upload for my created route?
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 3}>
                        <p>
                            We appreciate you want to offer other users more insights, but the moment the number of images is limited to one.
                            Other users can share their photo in the comments of your route.
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 4} index={4} onClick={this.handleClick}>
                        How can I contact the team of this website when I have more questions?
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 4}>
                        <p>
                            Please don't hesitate to send us an email or to send us a direct message on Twitter.
                            We are looking forward to hearing from you!
                        </p>
                    </Accordion.Content>
                    <Accordion.Title active={activeIndex === 5} index={5} onClick={this.handleClick}>
                        Can I use this web application for free?
                        <Header as='h5' floated='right'> <Icon name='add'/> </Header>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === 5}>
                        <p>
                            There are no costs, because this started as a project at university.
                        </p>
                    </Accordion.Content>
                </Accordion>
            </Container>


        )
    }
}

export default FAQ;