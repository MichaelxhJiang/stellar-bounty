import React, { Component }  from "react";
import axios from "axios";
import "./App.css";
import { Container, Menu, Button, Header } from "semantic-ui-react";
import { Switch, Route, BrowserRouter as Router, Link, withRouter } from "react-router-dom"

let endpoint = "http://localhost:8080";

class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    githubAuth = () => {
        console.log("Github auth")
        axios.put(
          endpoint + "auth/github",
          
          ).then(res => {
              console.log(res)
          })
      }

    render() {
        return (
            <Menu>
          <Menu.Item style={{backgroundColor: "#222"}}>
            <Header as="h1" style={{color:"white"}}>
              Stellar Hunter
            </Header>
          </Menu.Item>
          <Menu.Item>
            <Link to="/" style={{ color: "black" }}>My Issues</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/solutions" style={{ color: "black" }}> My Solutions</Link>
          </Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item>
              <Button onClick={this.githubAuth.bind(this)}>
                Sign in with Github
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        );
    }
}

export default withRouter(NavBar);
