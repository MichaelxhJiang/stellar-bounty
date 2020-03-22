import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

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
                pullRequestTitle: "Fix stale code",
                issueTitle: "Open Issue - I'll pay anything",
                reward: true,
                github_url: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            },
            {
                _id: "2",
                pullRequestTitle: "Temporary Fix for Issue",
                issueTitle: "Please fix!",
                reward: false,
                github_url: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            }   
        ]

        this.setState({
            solutions: data.map(item => {
                return ( 
                    <Card key={item._id} fluid>
                        <Card.Content>
                            <Card.Header textAlign="left">
                                <div style={{ wordWrap: "break-word" }}>
                                    <Menu.Item
                                        href={item.github_url}
                                        target="_blank"
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
                                </Card.Meta> : 
                                <Card.Meta textAlign="right">
                                <Icon
                                    name="edit"
                                    color="grey"
                                />
                                <Link to={"/create-bounty/" + encodeURIComponent(item.github_url)}>Create a Bounty</Link>
                            </Card.Meta>
                            }
                        </Card.Content>
                    </Card>
                );
            })
        });
    };

    render() {
        return (
            <div style={{padding: '40px'}}>
                <div className="row" style={{display: 'flex',  justifyContent:'center', alignItems:'center', margin:'0px 0px 20px 0px'}}>
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