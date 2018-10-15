import React, {Component} from "react";
import Create from "./sites/Create";
import Home from "./sites/Home";
import Search from "./sites/Search";
import LogIn from "./sites/LogIn";
import FAQ from "./sites/FAQ";
import {Button, Container, Menu, Grid, Icon, Responsive, Segment} from "semantic-ui-react";


class Website extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'home'
        }
    }

    // Menü Methoden:
    handleItemClick = (e, {name}) => this.setState({activeItem: name});

    render() {
        var content;
        switch (this.state.activeItem) {
            case 'create':
                content = <Create/>;
                break;
            case 'search':
                content = <Search/>;
                break;
            case 'user':
                content = <LogIn/>
                break;
            case 'help':
                content = <FAQ/>
                break;
            default:
                content = <Home/>;
        }


        // Layout der Seite:
        return (
            <div className="App">
                <Grid.Row>
                    <Menu icon='labeled'>
                        <Menu.Item
                            name='home'
                            active={this.state.activeItem === 'home'}
                            onClick={this.handleItemClick}
                        >
                            <Icon name='home'/>
                            Home
                        </Menu.Item>
                        <Menu.Item
                            name='search'
                            active={this.state.activeItem === 'search'}
                            onClick={this.handleItemClick}
                        >
                            <Icon name='search'/>
                            Search
                        </Menu.Item>
                        <Menu.Item
                            name='create'
                            active={this.state.activeItem === 'create'}
                            onClick={this.handleItemClick}
                        >
                            <Icon name='pencil'/>
                            Create
                        </Menu.Item>
                        <Menu.Item
                            name='tree'
                            active={this.state.activeItem === 'tree'}
                            onClick={this.handleItemClick}
                        >
                            <Icon name='tree'/>
                            Name
                        </Menu.Item>
                        <Menu.Item position='right'
                                   name='user'
                                   active={this.state.activeItem === 'user'}
                                   onClick={this.handleItemClick}
                        >
                            <Icon name='user'/>
                            LogIn
                        </Menu.Item>
                        <Menu.Item
                            name='help'
                            active={this.state.activeItem === 'help'}
                            onClick={this.handleItemClick}
                        >
                            <Icon name='help'/>
                            FAQ
                        </Menu.Item>
                    </Menu>

                </Grid.Row>
                <Segment vertical style={{padding: 0}}>
                    {content}
                </Segment>

            </div>
        )

    }
}

export default Website;