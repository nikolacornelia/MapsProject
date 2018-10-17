import React, {Component} from "react";
import {Grid, Header, Image, Icon, Sidebar, Container, Segment} from "semantic-ui-react";

class Home extends Component {

    render() {
        //                          <Image src='/RiceTerraces.JPG' fluid/>
        return (
            <div style={{
                backgroundImage: "url('RiceTerraces.JPG')",
                height: "100%",
                width: "100%",
                paddingTop: "1rem"
            }}>
                <Container>

                </Container>
                <Grid centered>
                    <Grid.Row>
                        <Grid.Column width={16}>

                        </Grid.Column>
                        <Grid.Column width={6}>

                            <Header
                                as='header1'
                                center
                                content='Find your trail'
                                style={{
                                    fontsize: '4em',
                                    fontWeight: 'big',
                                    padding: '20em 0em',

                                }}>
                            </Header>
                            <p style={{fontsize: '1.5em'}}>
                                Browse through the 1000+ existing trails to find the one route matching your
                                desires
                            </p>

                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Icon name='caret right'/>
                        </Grid.Column>

                    </Grid.Row>
                </Grid>
            </div>
        );
    }


}

export default Home;