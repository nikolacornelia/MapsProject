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
                        <img src='./static/media/RiceTerraces.JPG'/>
                    </div>
                    <div>
                        <img src='./static/media/EndChineseWall.JPG'/>
                        <p className="legend">Wanderweg Chinesische Mauer</p>
                    </div>
                    <div>
                        <img src='./static/media/RiceTerraces.JPG'/>
                        <p className="legend">Wanderweg durch die Reisterrassen</p>
                    </div>
                    <div>
                        <img src='./static/media/EndChineseWall.JPG'/>
                        <p className="legend">Chinesische Mauer</p>
                    </div>

                </Carousel>
            </Container>
        )
    }

}

export default Home;