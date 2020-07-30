import React, { Component } from "react";
import { Button, Modal, ListGroup, Col } from "react-bootstrap";

export class PopupViewEditor extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }


  handleClose() {
     this.props.handleClose();
  }


  render = () => {
    var b = { name: "", type: { component: "", variant: "" } };
    if (this.props.view) {
      b = this.props.view;
    }
    return (
      <>
        <Modal
          animation={false}
          show={this.props.show}
          onHide={this.handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Editing: {b.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Col sm={12} md={6} lg={3}>
              <div className="autogen-units" id="view-variant">Variant</div>
            <ListGroup>
            {this.props.viewProps.variants.map((variant,index) => {
              return (
                <ListGroup.Item
                  eventKey={index}
                  key={index}
                >
                  {variant}
                </ListGroup.Item>);
            })}
              </ListGroup>
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
        </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
        </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

}

export default PopupViewEditor;