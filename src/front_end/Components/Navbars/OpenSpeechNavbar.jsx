import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

class OpenSpeechNavbar extends Component {

  render() {
    return (
      <Navbar bg="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
         <Navbar.Brand className="open-speech-brand">
            FPGA Open Speech Tools
         </Navbar.Brand>
      </Navbar>
    );
  }
}
//href="https://fpga-open-speech-tools.github.io/docs/landing_page/index.html"
export default OpenSpeechNavbar;
