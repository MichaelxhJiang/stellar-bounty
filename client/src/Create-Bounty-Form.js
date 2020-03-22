import React, { Component } from "react";
import axios from "axios";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react";
import { withRouter } from "react-router-dom"

let endpoint = "http://localhost:8080";

const assetOptions = [
    {key: 'XLM', text: 'XLM', value: 'XLM'},
    {key: 'USD', text: 'USD', value: 'USD'}
]

class CreateBountyForm extends Component {
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
    }

    onSubmit = () => {
        let { asset, amount, githubUrl } = this.state;

        console.log("asset::" + asset)
        console.log("amount::" + amount)
        console.log("github url::" + githubUrl)

        if (isNaN(amount)) {
            console.error("Amount is not a number")
            return
        }

        if (parseInt(amount) <= 0) {
            console.error("Must be a positive, non-zero amount")
            return
        }

        if (amount && asset) {
            console.log("Creating a bounty")
            axios.post(
                endpoint + "bounty/create", 
                {
                    "amount": amount, 
                    "asset": asset
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

    changeAmount = (e, { value }) => {
        this.setState({ "amount": value })
    }

    changeAsset = (e, { value }) => {
        this.setState({ "asset": value })
    }

    render() {
        /*
        Fields:
         - Amount
         - Asset
        */
        return (
            <div style={{padding: '40px'}}>
                <div className="row" style={{display: 'flex',  justifyContent:'center', alignItems:'center', margin:'40px'}}>
                    <Header className="header" as="h2">
                        Create a Bounty
                    </Header>
                </div>
                <div className="row">
                    <Form onSubmit={this.onSubmit}>
                        <Form.Input fluid label='Amount' placeholder='Enter Amount' onChange={this.changeAmount} />
                        <Form.Select
                            name='asset'
                            fluid
                            label='Asset'
                            options={assetOptions}
                            placeholder='Select Asset'
                            onChange={this.changeAsset}
                        />
                        <Form.Button>Submit</Form.Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default withRouter(CreateBountyForm);
