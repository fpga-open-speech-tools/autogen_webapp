import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

class OpenSpeechNavbar extends Component {

  render() {
    return (
      <Navbar expand="sm" bg="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
         <Navbar.Brand href="https://fpga-open-speech-tools.github.io/docs/landing_page/index.html">
            FPGA Open Speech Tools
         </Navbar.Brand>
      </Navbar>
    );
  }
}

export default OpenSpeechNavbar;
