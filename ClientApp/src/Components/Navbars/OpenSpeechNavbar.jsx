import React, { Component } from "react";
import { Container, Navbar } from "react-bootstrap";

class OpenSpeechNavbar extends Component {

  render() {
    return (
      <Navbar bg="dark">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Brand className="open-speech-brand">
              FROST EDGE UI
          </Navbar.Brand>
         </Container>
      </Navbar>
    );
  }
}
//href="https://fpga-open-speech-tools.github.io"
export default OpenSpeechNavbar;
