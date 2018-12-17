import React, {Component} from "react";
import Create from "./sites/Create";
import Search from "./sites/Search";
import LogIn from "./sites/LogIn";
import FAQ from "./sites/FAQ";
import Home from "./sites/Home";
import MyRoutes from "./sites/user/MyRoutes";
import MyReviews from "./sites/user/MyReviews";
import axios from "axios";

import {Button, Container, Image, Menu, Grid, Icon, Responsive, Segment, Dropdown, Label, Header} from "semantic-ui-react";
import {Route, HashRouter as Router, NavLink, Redirect} from "react-router-dom";

class Website extends Component {

    constructor(props) {
        super(props);

        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = "http://localhost:3001";
        // if there is an response code for "unauthorized" (= not logged in), then navigate accordingly
        axios.interceptors.response.use((resp) => { return resp }, (error) => {
            if (error.response && error.response.status === 401) {
                alert('You are not logged in anymore. Please login again.');
                sessionStorage.clear();
                this.updateLoginStatus();
            }
            return Promise.reject(error);
        });

        this.state = {
            loggedIn: sessionStorage.getItem("user")
        };
    };

    updateLoginStatus = () => {
        let loggedIn = false;
        if(sessionStorage.getItem("user"))
            loggedIn = true;
        this.setState({loggedIn: loggedIn});
    };

    render() {
        const PrivateRoute = ({component: Component, ...rest}) =>
            <Route {...rest} render={props => (
                sessionStorage.getItem('user')
                    ? <Component {...props} />
                    : <Redirect to={{
                        pathname: '/login',
                        state: {from: props.location, updateLoginStatus: this.updateLoginStatus}
                    }}/>
            )}/>;

        // Layout der Seite:
        return (
            <Router>
                <div style={{height: "100%"}}>
                    <Menu fixed='top' icon='labeled' style={{marginBottom: "0"}}>
                        <Menu.Item name='home' as={NavLink} exact to='/' data-testid='menuItemHome'>
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

                        <Header style={{paddingLeft: "1rem"}}>

                            <img src='./static/media/Logo.PNG' style={{width: "5.5em"}}/>
                            <Header.Content>
                            </Header.Content>

                        </Header>
                        {!this.state.loggedIn ?
                            <Menu.Item position='right' name='user' as={NavLink} exact to='/login'>
                                <Icon name='user'/>
                                LogIn
                            </Menu.Item>
                            :
                            <Dropdown item icon={null} text={<Menu.Item name='user'>
                                <Icon name='user'/>
                                User
                            </Menu.Item>} labeled className='right' style={{padding: 0}}>

                                <Dropdown.Menu>
                                    <Dropdown.Item icon='map signs' text='My Routes' as={NavLink} exact to='/myroutes'/>
                                    <Dropdown.Item icon='globe' text='My Reviews' as={NavLink} exact to='/myreviews'/>
                                    <Dropdown.Item icon='logout' text='Logout' as={NavLink} exact to='/login' active={false}
                                                   onClick={() => {
                                                       axios.get("/logout");
                                                       sessionStorage.clear();
                                                       this.updateLoginStatus();
                                                   }}/>
                                </Dropdown.Menu>
                            </Dropdown>
                        }
                        <Menu.Item name='help' as={NavLink} exact to='/help'>
                            <Icon name='help'/>
                            FAQ
                        </Menu.Item>
                    </Menu>

                    <Segment vertical className='content' style={{padding: "5.2em 0 0 0"}} data-testid='siteContent'>
                        <Route exact path="/" component={Home}/>
                        <Route path="/search" component={Search}/>
                        <PrivateRoute path="/create" component={Create}/>
                        <Route path="/login"
                               render={props => (<LogIn  {...props} updateLoginStatus={this.updateLoginStatus}/>)}/>
                        <Route path="/help" component={FAQ}/>

                        <PrivateRoute path="/myroutes" component={MyRoutes}/>
                        <PrivateRoute path="/myreviews" component={MyReviews}/>
                        </Segment>
                </div>
            </Router>
        )

    }
}

export default Website;