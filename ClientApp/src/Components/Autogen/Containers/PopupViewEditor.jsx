import React, { Component } from "react";
import { Button, Modal, ListGroup, Col } from "react-bootstrap";

export class PopupViewEditor extends Component {
  constructor(props) {
    super(props);
    this.view = this.props.view;
    this.handleClose = this.handleClose.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }


  handleClose() {
     this.props.handleClose();
  }

  handleSave = () => {
    this.props.handleSave(this.view);
    this.props.handleClose();
  }

  handleUpdateView = (view) => {
    this.view = view;
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
              <ListGroup defaultActiveKey={b.type.variant}>
            {this.props.viewProps.variants.map((variant,index) => {
              return (
                <ListGroup.Item
                  eventKey={variant}
                  key={variant}
                  onClick={() => {
                    b.type.variant = variant;
                    this.handleUpdateView(b);
                  }}
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
            <Button variant="primary" onClick={this.handleSave}>
              Save Changes
        </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

}

export default PopupViewEditor;