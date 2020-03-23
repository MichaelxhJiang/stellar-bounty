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

    getBounty = (url) => {
        /*
        TODO - call endpoint to retrieve the bounty
        */
        return {
            "amount": "100",
            "asset": "XLM"
        }
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
                title: "Open Issue - I'll pay anything :P",
                bounty: true,
                open: true,
                rewarded: false,
                githubUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            },
            {
                _id: "2",
                title: "Issue with completing transactions",
                bounty: true,
                open: false,
                rewarded: false,
                githubUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            },
            {
                _id: "3",
                title: "Please fix!",
                bounty: false,
                open: true,
                rewarded: false,
                githubUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            },
            {
                _id: "4",
                title: "Help! Too many bounties to hunt!",
                bounty: false,
                open: true,
                rewarded: false,
                githubUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            },
            {
                _id: "5",
                title: "Fatal Error in backend",
                bounty: true,
                open: false,
                rewarded: true,
                githubUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1"
            },
        ]

        this.setState({
            issues: data.map(item => {
                let { amount, asset } = this.getBounty(item.githubUrl)
                return (
                    <Card key={item._id} color={item.rewarded ? "grey" : item.bounty && !item.open ? "red" : item.bounty && item.open ? "green" : null} fluid>
                        <Card.Content>
                            {item.bounty && !item.open && !item.rewarded ?
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
                                        <Link to={"/reward-solution/" + encodeURIComponent(item.githubUrl)} style={{ color: "black" }}>
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
                            {item.bounty ?
                                <Card.Description>
                                    Bounty: {amount} {asset}
                                </Card.Description> : null
                            }
                            {item.bounty && !item.open && !item.rewarded ?
                                <Card.Description style={{padding: "5px 0px 0px 0px"}}>
                                    <Link to={"/reward-solution/" + encodeURIComponent(item.githubUrl)} style={{ color: "black" }}>
                                        <Header as="h4">
                                            This issue is closed. Click to select a solution to reward.
                                        </Header>
                                    </Link>
                                </Card.Description> : null
                            }
                            {item.bounty && !item.open && item.rewarded ?
                                <Card.Description style={{padding: "5px 0px 0px 0px"}}>
                                    <Link to={"/reward-solution/" + encodeURIComponent(item.githubUrl)} style={{ color: "black" }}>
                                        <Header as="h4">
                                            Solution has already been rewarded.
                                        </Header>
                                    </Link>
                                </Card.Description> : null
                            }
                            {item.bounty && item.open && !item.rewarded ?
                                <Card.Meta textAlign="right">
                                    <Icon
                                        name="exclamation circle"
                                        color="green"
                                    />
                                    <span style={{ paddingRight: 10 }}>Open Bounty</span>
                                </Card.Meta> : null
                            }
                            {item.bounty && !item.open && !item.rewarded ?
                                <Card.Meta textAlign="right">
                                    <Icon
                                        name="exclamation circle"
                                        color="red"
                                    />
                                    <span style={{ paddingRight: 10 }}>Closed Issue</span>
                                </Card.Meta> : null
                            }
                            {item.bounty && !item.open && item.rewarded ?
                                <Card.Meta textAlign="right">
                                    <Icon
                                        name="exclamation circle"
                                        color="grey"
                                    />
                                    <span style={{ paddingRight: 10 }}>Bounty Rewarded</span>
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
                        My Issues
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