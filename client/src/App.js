import React from "react";
import "./App.css";
import { Container, Menu, Button } from "semantic-ui-react";
import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom"

import MainList from "./Main-List";
import CreateBountyForm from "./Create-Bounty-Form"
import SolutionList from "./Solution-List"
import RewardSolutionForm from "./Reward-Solution-Form";



function App() {
  return (
    <Container>
      <Router>
        <Menu>
          <Menu.Item>
            <Link to="/" style={{ color: "black"}}>My Issues</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/solutions" style={{ color: "black"}}> My Solutions</Link>
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
          <Route path="/create-bounty/:githubUrl" component={CreateBountyForm}>
            <CreateBountyForm />
          </Route>
          <Route path="/reward-solution/:githubUrl" component={CreateBountyForm}>
            <RewardSolutionForm />
          </Route>
          <Route exact path="/">
            <MainList />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}
export default App;