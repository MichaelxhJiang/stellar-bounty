import React from "react";
import "./App.css";
import { Container, Menu, Button, Header } from "semantic-ui-react";
import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom"

import MainList from "./Main-List";
import CreateBountyForm from "./Create-Bounty-Form"
import SolutionList from "./Solution-List"
import RewardSolutionForm from "./Reward-Solution-Form";
import ClaimBountyForm from "./Claim-Bounty-Form";


function App() {
  return (
    <Container>
      <Router>
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
              <Button class="ui primary button">
                Sign in with Github
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Switch>
          <Route exact path="/solutions" component={CreateBountyForm}>
            <SolutionList />
          </Route>
          <Route path="/claim-bounty/:githubUrl" component={ClaimBountyForm}>
            <ClaimBountyForm />
          </Route>
          <Route path="/create-bounty/:githubUrl" component={CreateBountyForm}>
            <CreateBountyForm />
          </Route>
          <Route path="/reward-solution/:githubUrl" component={RewardSolutionForm}>
            <RewardSolutionForm />
          </Route>
          <Route exact path="/" component={MainList}>
            <MainList />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}
export default App;