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
import {Route, HashRouter as Router, NavLink, Redirect} from "react-router-dom";

class Website extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: sessionStorage.getItem("loggedIn")
        }
    };

    updateLoginStatus = () => {
        this.setState({loggedIn: sessionStorage.getItem("loggedIn")});
    };

    render() {
        const PrivateRoute = ({component: Component, ...rest}) =>
            <Route {...rest} render={props => (
                sessionStorage.getItem('loggedIn')
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
                            <Icon name='tree'/>
                            <Header.Content> Name</Header.Content>
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
                                    <Dropdown.Item icon='settings' text='Settings' as={NavLink} exact to='/settings'/>
                                    <Dropdown.Item icon='logout' text='Logout' as={NavLink} exact to='/login' active={false}
                                                   onClick={() => {
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

                    <Segment vertical className='content' style={{padding: "5em 0 0 0"}} data-testid='siteContent'>
                        <Route exact path="/" component={Home}/>
                        <Route path="/search" component={Search}/>
                        <PrivateRoute path="/create" component={Create}/>
                        <Route path="/login"
                               render={props => (<LogIn  {...props} updateLoginStatus={this.updateLoginStatus}/>)}/>
                        <Route path="/help" component={FAQ}/>

                        <PrivateRoute path="/myroutes" component={MyRoutes}/>
                        <PrivateRoute path="/myreviews" component={MyReviews}/>
                        <PrivateRoute path="/settings" component={Settings}/>
                    </Segment>
                </div>
            </Router>
        )

    }
}

export default Website;