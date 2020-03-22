import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Icon, Menu } from "semantic-ui-react";
import { withRouter } from "react-router-dom"

let endpoint = "http://localhost:8080";

class RewardSolutionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: "0",
            asset: "None"
        };
    }

    componentDidMount() {
        const { githubUrl } = this.props.match.params
        let decodedUrl = decodeURIComponent(githubUrl)
        console.log(decodedUrl)

        this.setState({
            "githubUrl": decodedUrl
        })

        this.getSolutions()
        this.getBounty(decodedUrl)
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

        let data = [
            {
                "pullRequestTitle": "Pull Request 1",
                "githubUrl": "https://github.com/MichaelxhJiang/stellar-bounty/pull/2",
                "solver": "MichaelxhJiang",
                "merged": true
            },
            {
                "pullRequestTitle": "Pull Request 2",
                "githubUrl": "https://github.com/MichaelxhJiang/stellar-bounty/pull/3",
                "solver": "MichaelxhJiang",
                "merged": false
            }
        ]

        this.setState({
            "solutions": data
        })
    }

    renderSolutions = () => {
        if (this.state.solutions) {
            return this.state.solutions.map(item => {
                return (
                    <div style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
                        <Form.Radio
                            key={item._id}
                            value={item.githubUrl}
                            checked={this.state.solution === item.githubUrl}
                            onChange={this.setSolution}
                            style={{ margin: "20px 20px 0px 0px" }}
                        />
                        <Card color={item.merged ? "green" : "red"} fluid>
                            <Card.Content>
                                <Card.Header>
                                    <Menu.Item
                                        href={item.githubUrl}
                                        target="_blank"
                                    >
                                        <Icon
                                            name="github"
                                            color="black"
                                        />
                                    </Menu.Item>
                                    {item.pullRequestTitle}
                                </Card.Header>
                                <Card.Description>
                                    {item.solver}
                                </Card.Description>

                                {item.merged ?
                                    <Card.Meta textAlign="right">
                                        <Icon
                                            name="code branch"
                                            color="green"
                                        />
                                        <span style={{ paddingRight: 10 }}> Merged </span>
                                    </Card.Meta> :
                                    <Card.Meta textAlign="right">
                                        <Icon
                                            name="cancel"
                                            color="red"
                                        />
                                        <span style={{ paddingRight: 10 }}> Not Merged </span>
                                    </Card.Meta>
                                }
                            </Card.Content>
                        </Card>
                    </div>
                )
            })
        }
    }

    getBounty = (url) => {
        this.setState({
            "amount": "100",
            "asset": "XLM"
        })
    }

    setSolution = (e, { value }) => {
        this.setState({
            "solution": value
        })
    }

    onSubmit = () => {
        let { solution, githubUrl } = this.state;

        console.log("Solution Url::" + solution)
        console.log("Issue Url::" + githubUrl)

        if (solution && githubUrl) {
            console.log("Creating a bounty")
            axios.post(
                endpoint + "bounty/create",
                {
                    "issueUrl": githubUrl,
                    "pullRequestUrl": solution
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(res => {
                    console.log(res)
                })
        }
    };

    render() {
        /*
        Fields:
         - Amount
         - Asset
        */
        return (
            <div style={{ padding: '40px' }}>
                <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0px 0px 20px 0px' }}>
                    <Header className="header" as="h2">
                        Select Solution
                    </Header>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px 0px 20px 0px' }}>
                    <a href={this.state.githubUrl} target="_blank" style={{ color: "grey" }}>
                        <Icon
                            size="big"
                            name="github"
                        />
                        View Issue
                    </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'left', padding: '0px 0px 20px 0px' }}>
                    <Header as="h3">
                        Bounty: {this.state.amount} {this.state.asset}
                    </Header>
                </div>
                <div className="row">
                    <Form onSubmit={this.onSubmit}>
                        {this.renderSolutions()}
                        <div style={{ padding: "20px 0px 0px 0px" }}></div>
                        <Form.Button>Submit</Form.Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default withRouter(RewardSolutionForm);
