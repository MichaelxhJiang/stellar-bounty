import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Menu } from "semantic-ui-react";

let endpoint = "http://localhost:8080";

class MainList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            task: "",
            items: []
        };
    }

    componentDidMount() {
        this.getSolutions();
    }

    getSolutions = () => {
        
    };

    render() {
        return (
            <div style={{padding: '50px'}}>
                <div className="row" style={{display: 'flex',  justifyContent:'center', alignItems:'center', margin:'40px'}}>
                    <Header className="header" as="h2">
                        Solutions
                    </Header>
                </div>
                <div className="row">
                    <Card.Group>{this.state.issues}</Card.Group>
                </div>
            </div>
        );
    }
}

export default MainList;