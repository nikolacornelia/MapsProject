import React, {Component} from "react";
import {Grid, Header, Icon} from "semantic-ui-react";

class Home extends Component {

    render(){
        return (
            <Grid centered>
                <Grid.Row>
                    <Grid.Column width={6}>
                        hier kommt ein foto rein
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Header
                            as='header1'
                            content='Find your trail'
                            style={{
                                fontsize: '4em',
                                fontWeight: 'big',
                                padding: '20em 0em'
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
        );
    }


}

export default Home;