import React from "react";
import "./App.css";
// import the Container Component from the semantic-ui-react
import { Container } from "semantic-ui-react";
// import the ToDoList component
import MainList from "./Main-List";
import CreateBountyForm from "./Create-Bounty-Form"
function App() {
  return (
    <div>
      <Container>
        <MainList />
      </Container>
    </div>
  );
}
export default App;