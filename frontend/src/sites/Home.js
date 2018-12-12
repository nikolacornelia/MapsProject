import React, {Component} from "react";
import {Grid, Header, Image, Icon, Sidebar, Container, Segment} from "semantic-ui-react";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ReactDOM from 'react-dom';

class Home extends Component {

    render() {
        //
        return (
            <Container fluid data-testid='siteHome'>
                <Carousel autoPlay showArrows infiniteLoop useKeyboardArrows showThumbs={false}>
                    <div>
                        <img src='./static/media/Bild1.JPG'/>
                    </div>
                    <div>
                        <img src='./static/media/Bild2.JPG'/>
                    </div>
                    <div>
                        <img src='./static/media/Bild3.JPG'/>
                    </div>
                </Carousel>
            </Container>
        )
    }

}

export default Home;