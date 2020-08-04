import React, { Component } from "react";
import { Button, Modal, ListGroup, Col, Form } from "react-bootstrap";

export class PopupViewEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      v: { name: "Failed to Mount", type: { component: "", variant: "" }, references: [] },
      i: null
    }
    this.handleUpdateView = this.handleUpdateView.bind(this);
    this.handleOnShow = this.handleOnShow.bind(this);
  }

  componentDidUpdate() {
    if (this.props.view && this.props.view !== this.state.v) {
      this.setState({ v: this.props.view });
      this.setState({ i: this.props.index });
    }
  }

  handleOnShow = () => {
    this.setState({ v: this.props.view });
    this.forceUpdate();
  }

  handleUpdateView (view){
    this.setState({ v: view });
    this.props.updateView(this.props.index, view);
    this.forceUpdate();
  }

  revert() {
    this.setState({ v: this.props.view });
  }


  render() {
    if (this.props.show) {
      return (
        <>
          <Modal
            className="modal-editor"
            animation={false}
            show={this.props.show}
            onShow={this.handleOnShow}
            onHide={() => { this.props.handleClose(); }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter contained-modal-title-hcenter"
            centered
          >
            <Modal.Header className="modal-editor-body" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">Editing: {this.props.view.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-editor-body">
              <Col sm={12} md={6} lg={3}>
                <div className="autogen-units" id="view-variant">Variant</div>
                <ListGroup defaultActiveKey={this.props.view.type.variant}>
                  {this.props.viewProps.variants.map((variant, index) => {
                    return (
                      <ListGroup.Item
                        eventKey={variant}
                        key={"v-"+variant+"i-"+index+"vi-"+this.state.i}
                        onClick={() => {
                          var b = this.props.view;
                          b.type.variant = variant;
                          this.handleUpdateView(b);
                        }}
                      >
                        {variant}
                      </ListGroup.Item>);
                  })}
                </ListGroup>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Form>
                  <div className="autogen-control-name">
                    Name
                </div>
                  <Form.Control
                    size="lg" type="text"
                    value={this.props.view.name}
                    onChange={changeEvent => {
                      var b = this.props.view;
                      b.name = changeEvent.target.value;
                      this.handleUpdateView(b);
                    }}
                  />
                </Form>
              </Col>
              <div className="autogen autogen-panel card autogen-effect-preview">
                <div className="open-speech-header open-speech-header-std open-speech-accent-color">
                  <h1 className="open-speech-accent-font">Preview</h1>
                  </div>
                <div className="content autogen autogen-panel">
                  <div className="autogen autogen-control">
                  <this.props.component
                    view={this.props.view}
                    editing= {true }
                    data={this.props.functionalData}
                    callback={() => { }} />
                </div></div></div>
            </Modal.Body>
            <Modal.Footer className="modal-editor-body">
              <Button
              variant="primary"
              className="btn-simple btn-icon"
              onClick={() => {
                this.props.handleClose();
              }}
              >
              <i className="fa fa-check large-icon" />
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    }
    else {
      return (<div></div>);
    }
  }

}

export default PopupViewEditor;