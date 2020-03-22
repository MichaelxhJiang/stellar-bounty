import React from "react";
import "./App.css";
// import the Container Component from the semantic-ui-react
import { Container, Menu, Button } from "semantic-ui-react";
// import the ToDoList component
import MainList from "./Main-List";
import CreateBountyForm from "./Create-Bounty-Form"
import SolutionList from "./Solution-List"
import { Switch, Route, BrowserRouter as Router, Link } from "react-router-dom"

function App() {
  return (
    <Container>
      <Router>
        <Menu>
          <Menu.Item>
            <Link to="/">Open Issues</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/solutions">Solutions</Link>
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
          <Route exact path="/">
            <MainList />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
}
export default App;