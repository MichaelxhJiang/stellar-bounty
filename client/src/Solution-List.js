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

    getBounty = (url) => {
        /*
        TODO - call endpoint to retrieve the bounty
        */
        return {
            "amount": "100",
            "asset": "XLM"
        }
    }

    getSolutions = () => {
        // axios.get(endpoint + "/solutions").then(res => {
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
                pullRequestUrl: "https://github.com/MichaelxhJiang/stellar-bounty/pull/2",
                issueUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1",
                claimed: false
            },
            {
                _id: "2",
                pullRequestTitle: "Temporary Fix for Issue",
                issueTitle: "Please fix!",
                reward: false,
                pullRequestUrl: "https://github.com/MichaelxhJiang/stellar-bounty/pull/2",
                issuerUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1",
                claimed: false
            },
            {
                _id: "3",
                pullRequestTitle: "Hotfix #1",
                issueTitle: "Urgent Bug (FIXED)",
                reward: true,
                pullRequestUrl: "https://github.com/MichaelxhJiang/stellar-bounty/pull/2",
                issueUrl: "https://github.com/MichaelxhJiang/stellar-bounty/issues/1",
                claimed: true
            },
        ]

        this.setState({
            solutions: data.map(item => {
                let { amount, asset } = this.getBounty(item.issueUrl)
                return (
                    <Card key={item._id} color={item.reward && !item.claimed ? "green" : item.reward && item.claimed ? "grey" : null} fluid>
                        <Card.Content>
                            {item.reward && !item.claimed ?
                                <Card.Header textAlign="left">
                                    <div style={{ wordWrap: "break-word" }}>
                                        <Menu.Item
                                            href={item.pullRequestUrl}
                                            target="_blank"
                                        >
                                            <Icon
                                                name="github"
                                                color="black"
                                            />

                                        </Menu.Item>
                                        <Link to={"/claim-bounty/" + encodeURIComponent(item.issueUrl)} style={{ color: "black" }}>
                                            {item.pullRequestTitle}
                                        </Link>
                                    </div>
                                </Card.Header>
                                :
                                <Card.Header textAlign="left">
                                    <div style={{ wordWrap: "break-word" }}>
                                        <Menu.Item
                                            href={item.pullRequestUrl}
                                            target="_blank"
                                        >
                                            <Icon
                                                name="github"
                                                color="black"
                                            />
                                        </Menu.Item>
                                        {item.pullRequestTitle}
                                    </div>
                                </Card.Header>

                            }

                            <Card.Description style={{ display: "flex", flexDirection: "row" }}>
                                Fixes:
                                <a href={item.issueUrl} target="_blank">
                                    <Header as="h4" style={{ padding: "0px 0px 0px 5px" }} >
                                        {item.issueTitle}
                                    </Header>
                                </a>
                            </Card.Description>

                            <Card.Description>
                                Bounty: {amount} {asset}
                            </Card.Description>

                            {item.reward && !item.claimed ?
                                <Card.Description style={{ padding: "5px 0px 0px 0px" }}>
                                    <Link to={"/claim-bounty/" + encodeURIComponent(item.issueUrl)}>
                                        <Header as="h4">
                                            Congrats, you were rewarded! Click to claim bounty.
                                    </Header>
                                    </Link>
                                </Card.Description> : null
                            }

                            {item.reward && item.claimed ?
                                <Card.Description style={{ padding: "5px 0px 0px 0px" }}>
                                    <Header as="h4">
                                        You already claimed this bounty.
                                    </Header>
                                </Card.Description> : null
                            }

                            {item.reward && !item.claimed ?
                                <Card.Meta textAlign="right">
                                    <Icon
                                        name="exclamation circle"
                                        color="green"
                                    />
                                    <Link to={"/claim-bounty/" + encodeURIComponent(item.issueUrl)}>Claim Bounty</Link>
                                </Card.Meta> : null
                            }

                            {item.reward && item.claimed ?
                                <Card.Meta textAlign="right">
                                    <Icon
                                        name="exclamation circle"
                                        color="grey"
                                    />
                                    Bounty Claimed
                                </Card.Meta> : null
                            }
                        </Card.Content>
                    </Card >
                );
            })
        });
    };

    render() {
        return (
            <div style={{ padding: '40px' }}>
                <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0px 0px 20px 0px' }}>
                    <Header className="header" as="h2">
                        My Solutions
                    </Header>
                </div>
                <div className="row">
                    <Card.Group>{this.state.solutions}</Card.Group>
                </div>
            </div>
        );
    }
}

export default MainList;