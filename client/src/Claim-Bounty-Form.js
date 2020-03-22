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

        this.getBounty(decodedUrl)
    }

    getBounty = (url) => {
        /*
        TODO - call endpoint to retrieve the bounty
        */
        this.setState({
            "amount": "100",
            "asset": "XLM"
        })
    }

    changeAddress = (e, { value }) => {
        this.setState({ "address": value })
    }

    onSubmit = () => {
        let { address, githubUrl } = this.state;

        console.log("Destination Address::" + address)
        console.log("Issue Url::" + githubUrl)

        if (address && githubUrl) {
            console.log("Creating a bounty")
            axios.post(
                endpoint + "bounty/claim",
                {
                    "issueUrl": githubUrl,
                    "destinationAddress": address
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
        return (
            <div style={{ padding: '40px' }}>
                <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0px 0px 20px 0px' }}>
                    <Header className="header" as="h2">
                        Claim Bounty
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
                        <Form.Input fluid label='Stellar Address' placeholder='Enter your stellar public address' onChange={this.changeAddress} />
                        <div style={{ padding: "20px 0px 0px 0px" }}></div>
                        <Form.Button>Submit</Form.Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default withRouter(RewardSolutionForm);
