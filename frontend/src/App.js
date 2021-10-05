import './App.css';
import Playground from './components/playground';
import React, { Component } from 'react';
import {Container} from "react-bootstrap";
import NavBar from './components/navbar'

class App extends Component {
  render() { 
    return (
      <React.Fragment>
        <NavBar />
        <Container className="mt-3" fluid>
          <Playground />
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
