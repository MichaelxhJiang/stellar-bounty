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
        this.getOpenIssues();
    }

    getOpenIssues = () => {
        // axios.get(endpoint + "/issues").then(res => {
        //     console.log("Get issues response::" + res);
        //     if (res.data) {
        //         this.setState({
        //             issues: res.data.map(item => {
        //                 return (
        //                     <Card key={item._id} fluid>
        //                         <Card.Content>
        //                             <Card.Header textAlign="left">
        //                                 <div style={{ wordWrap: "break-word" }}>{item.title}</div>
        //                             </Card.Header>

        //                             {item.bounty ?
        //                                 <Card.Meta textAlign="right">
        //                                     <Icon
        //                                         name="exclamation circle"
        //                                         color="green"
        //                                         onClick={() => this.updateTask(item._id)}
        //                                     />
        //                                     <span style={{ paddingRight: 10 }}>Open Bounty</span>
        //                                 </Card.Meta> : null
        //                             }
        //                         </Card.Content>
        //                     </Card>
        //                 );
        //             })
        //         });
        //     } else {
        //         this.setState({
        //             items: []
        //         });
        //     }
        // });

        var data = [
            {
                _id: "1",
                title: "Open Issue - I'll pay anything",
                bounty: true,
                github_url: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            },
            {
                _id: "2",
                title: "Please fix!",
                bounty: false,
                github_url: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            }   
        ]

        this.setState({
            issues: data.map(item => {
                return ( 
                    <Card key={item._id} fluid>
                        <Card.Content>
                            <Card.Header textAlign="left">
                                <div style={{ wordWrap: "break-word" }}>
                                    <Menu.Item
                                        href={item.github_url}
                                    >
                                        <Icon 
                                            name= "github" 
                                            color="black" 
                                        />
                                    </Menu.Item>
                                    {item.title}
                                </div>
                            </Card.Header>

                            {item.bounty ?
                                <Card.Meta textAlign="right">
                                    <Icon
                                        name="exclamation circle"
                                        color="green"
                                    />
                                    <span style={{ paddingRight: 10 }}>Open Bounty</span>
                                </Card.Meta> : null
                            }
                        </Card.Content>
                    </Card>
                );
            })
        });
    };

    render() {
        return (
            <div style={{padding: '50px'}}>
                <div className="row" style={{display: 'flex',  justifyContent:'center', alignItems:'center', margin:'40px'}}>
                    <Header className="header" as="h2">
                        Open Issues
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