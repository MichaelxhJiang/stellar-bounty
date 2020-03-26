import React from "react";
import axios from "axios";
import "./App.css";
import { Container, Menu, Button, Header } from "semantic-ui-react";
import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom"

import MainList from "./Main-List";
import CreateBountyForm from "./Create-Bounty-Form"
import SolutionList from "./Solution-List"
import RewardSolutionForm from "./Reward-Solution-Form";
import ClaimBountyForm from "./Claim-Bounty-Form";
import NavBar from './Nav-Bar'

let endpoint = "http://localhost:8080";

function App() {
  return (
    <Container>
      <Router>
        <NavBar />

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