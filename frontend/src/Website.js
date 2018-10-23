import React, {Component} from "react";
import Create from "./sites/Create";
import Home from "./sites/Home";
import Search from "./sites/Search";
import LogIn from "./sites/LogIn";
import FAQ from "./sites/FAQ";
import LandingPage from "./sites/LandingPage"
import {Button, Container, Menu, Grid, Icon, Responsive, Segment} from "semantic-ui-react";
import {Route, HashRouter as Router, NavLink} from "react-router-dom";

class Website extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        // Layout der Seite:
        return (
            <Router>
                <div>
                    <Menu icon='labeled' style={{marginBottom: "0"}}>
                        <Menu.Item name='home' as={NavLink} exact to='/'>
                            <Icon name='home'/>
                            Home
                        </Menu.Item>
                        <Menu.Item name='search' as={NavLink} exact to='/search'>
                            <Icon name='search'/>
                            Search
                        </Menu.Item>
                        <Menu.Item name='create' as={NavLink} exact to='/create'>
                            <Icon name='pencil'/>
                            Create
                        </Menu.Item>
                        <Menu.Item name='logo'
                            // as={NavLink} exact to='/name'
                        >
                            <Icon name='tree'/>
                            Name
                        </Menu.Item>
                        <Menu.Item position='right' name='user' as={NavLink} exact to='/user'>
                            <Icon name='user'/>
                            LogIn
                        </Menu.Item>
                        <Menu.Item name='help' as={NavLink} exact to='/help'>
                            <Icon name='help'/>
                            FAQ
                        </Menu.Item>
                    </Menu>

                    <Segment vertical className="content" style={{padding: 0}}>
                        <Route exact path="/" component={LandingPage}/>
                        <Route path="/search" component={Search}/>
                        <Route path="/create" component={Create}/>
                        <Route path="/user" component={LogIn}/>
                        <Route path="/help" component={FAQ}/>
                    </Segment>
                </div>
            </Router>
        )

    }
}

export default Website;