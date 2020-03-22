import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

let endpoint = "http://localhost:8080";

class MainList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            issues: []
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
                open: true,
                githubUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            },
            {
                _id: "1",
                title: "Issue with completing transactions - Bounty Available",
                bounty: true,
                open: false,
                githubUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            },
            {
                _id: "2",
                title: "Please fix!",
                bounty: false,
                open: true,
                githubUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            }
        ]

        this.setState({
            issues: data.map(item => {
                return (
                    <Card key={item._id} color={item.bounty && !item.open ? "red" : item.bounty && item.open ? "green" : null} fluid>
                        <Card.Content>
                            {item.bounty && !item.open ?
                                <Card.Header textAlign="left">
                                    <div style={{ wordWrap: "break-word" }}>
                                        <Menu.Item
                                            href={item.githubUrl}
                                            target="_blank"
                                        >
                                            <Icon
                                                name="github"
                                                color="black"
                                            />
                                        </Menu.Item>
                                        <Link to={"/reward-solution/" + encodeURIComponent(item.githubUrl)} style={{ color: "black"}}>
                                            {item.title}
                                        </Link>
                                    </div>
                                </Card.Header> :
                                <Card.Header textAlign="left">
                                    <div style={{ wordWrap: "break-word" }}>
                                        <Menu.Item
                                            href={item.githubUrl}
                                            target="_blank"
                                        >
                                            <Icon
                                                name="github"
                                                color="black"
                                            />
                                        </Menu.Item>
                                        {item.title}
                                    </div>
                                </Card.Header>
                            }

                            {item.bounty && item.open ?
                                <Card.Meta textAlign="right">
                                    <Icon
                                        name="exclamation circle"
                                        color="green"
                                    />
                                    <span style={{ paddingRight: 10 }}>Open Bounty</span>
                                </Card.Meta> : null
                            }
                            {item.bounty && !item.open ?
                                <Card.Description>
                                    This issue is closed. Please select a solution to reward.
                                </Card.Description> : null
                            }
                            {item.bounty && !item.open ?
                                <Card.Meta textAlign="right">
                                    <Icon
                                        name="exclamation circle"
                                        color="red"
                                    />
                                    <span style={{ paddingRight: 10 }}>Closed Issue</span>
                                </Card.Meta> : null
                            }
                            {!item.bounty ?
                                <Card.Meta textAlign="right">
                                    <Icon
                                        name="edit"
                                        color="grey"
                                    />
                                    <Link to={"/create-bounty/" + encodeURIComponent(item.githubUrl)}>Create a Bounty</Link>
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
            <div style={{ padding: '40px' }}>
                <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0px 0px 40px 0px' }}>
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