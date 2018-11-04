import React, {Component} from "react";
import Create from "./sites/Create";
import Search from "./sites/Search";
import LogIn from "./sites/LogIn";
import FAQ from "./sites/FAQ";
import Home from "./sites/Home";
import MyRoutes from "./sites/user/MyRoutes";
import MyReviews from "./sites/user/MyReviews";
import Settings from "./sites/user/Settings";

import {Button, Container, Menu, Grid, Icon, Responsive, Segment, Dropdown, Label, Header} from "semantic-ui-react";
import {Route, HashRouter as Router, NavLink} from "react-router-dom";


class Website extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false
        }
    };

    updateLoginStatus = (status) => {
        this.setState({loggedIn: status})
    };

    render() {
        // Layout der Seite:
        return (
            <Router>
                <div style={{height: "100%"}}>
                    <Menu fixed='top' icon='labeled' style={{marginBottom: "0"}}>
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
                        {!this.state.loggedIn ?
                            <Menu.Item position='right' name='user' as={NavLink} exact to='/user'>
                                <Icon name='user'/>
                                LogIn
                            </Menu.Item>
                            :
                            <Dropdown item icon={null} text={<Menu.Item name='user' >
                                <Icon name='user'/>
                                Test
                            </Menu.Item>} labeled className='right' style={{padding:0}}>

                                <Dropdown.Menu>
                                    <Dropdown.Item icon='edit' text='My Routes' as={NavLink} exact to='/myroutes' />
                                    <Dropdown.Item icon='globe' text='My Reviews' as={NavLink} exact to='/myreviews' />
                                    <Dropdown.Item icon='settings' text='Settings' as={NavLink} exact to='/settings' />
                                    <Dropdown.Item icon='logout' text='Logout' />
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                        <Menu.Item name='help' as={NavLink} exact to='/help'>
                            <Icon name='help'/>
                            FAQ
                        </Menu.Item>
                    </Menu>

                    <Segment vertical className='content' style={{padding: "5em 0 0 0"}}>
                        <Route exact path="/" component={Home}/>
                        <Route path="/search" component={Search}/>
                        <Route path="/create" component={Create}/>
                        <Route path="/user" render={() => <LogIn updateLoginStatus={this.updateLoginStatus}/>} />
                        <Route path="/help" component={FAQ}/>

                        <Route path="/myroutes" component={MyRoutes}/>
                        <Route path="/myreviews" component={MyReviews}/>
                        <Route path="/settings" component={Settings}/>
                    </Segment>
                </div>
            </Router>
        )

    }
}

export default Website;