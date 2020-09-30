import React, { Component } from "react";
import { Button, Modal, ListGroup, Col, Form } from "react-bootstrap";
import OptionsEditor from "./OptionsEditor";
import ViewSelector from "./ViewSelector";

export class PopupViewEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      v: { name: "Failed to Mount", type: { component: "", variant: "" }, references: [] },
      i: null,
      o: {},
      initialV: { name: "Failed to Mount", type: { component: "", variant: "" }, references: [] },
      initialO: {},
      viewOptionsIndex:null
    }
    this.handleUpdateView = this.handleUpdateView.bind(this);
    this.handleOnShow = this.handleOnShow.bind(this);
    this.handleAddOptions = this.handleAddOptions.bind(this);
    this.handleModifyOptions = this.handleModifyOptions.bind(this);
    this.updateViewComponentVar = this.updateViewComponentVar.bind(this);
  }


  componentDidUpdate() {
    if (this.props.view && this.props.view !== this.state.v) {
      if (this.props.options) {
        if (this.props.options !== this.state.o) {
          this.setState({ o: this.props.options });
        }
      }
      this.setState({ v: this.props.view });
      this.setState({ i: this.props.index });
      if (this.props.view.optionsIndex) {
        this.setState({viewOptionsIndex:this.props.view.optionsIndex});
      }
      else{
        this.setState({ viewOptionsIndex: null });
      }
    }

  }

  handleOnShow = () => {
    if (this.props.view.optionsIndex) { this.setState({ optionsIndex: this.props.view.optionsIndex }); }
    this.setState({ v: this.props.view, o: this.props.options });
    this.setState({ initialV: this.props.view, initialO:this.props.options});
    this.forceUpdate();
  }

  handleUpdateView (view){
    this.setState({ v: view });
    this.props.updateView(this.props.index, view);
    this.forceUpdate();
  }

  handleAddOptions(options, viewIndex) {
    this.setState({ o: options });
    console.log("Adding options " + JSON.stringify(options) + " at view:" + viewIndex);
    this.props.addOptions(options,viewIndex);
    this.forceUpdate();
  }

  handleModifyOptions(options, optionIndex) {
    this.setState({ o: options, viewOptionsIndex:optionIndex });
    console.log("Modifying options " + JSON.stringify(options) + " at options:" + optionIndex);
    this.props.updateOptions(options, optionIndex);
    this.forceUpdate();
  }

  revert() {
    //console.log("\n\nChanges not Saved! Reverting.\n\n");
    this.setState({
      v: this.state.initialV,
      o: this.state.initialO
    });
    this.handleUpdateView(this.state.initialV);
    if (this.state.v.optionIndex) {
      this.handleModifyOptions(this.state.initialO, this.state.v.optionIndex);
    }
    this.forceUpdate();
  }

  updateViewComponentVar(comp,variant) {
    var viewEdit = this.props.view;
    viewEdit.type.component = comp;
    viewEdit.type.variant = variant;
    console.log("Updating View Component!");
    //console.log(JSON.stringify(viewEdit));
  }
 


  render() {
    if (this.props.show) {
      // console.log("Popup View Editor State, Props: \n" + 
      //   "State [Options]: " + JSON.stringify(this.state.o) + "\n" +
      //   "Props [Options]: " + JSON.stringify(this.props.options) + "\n");
      return (
        <>
          <Modal
            className="modal-editor"
            animation={false}
            show={this.props.show}
            onShow={this.handleOnShow}
            onHide={() => { this.revert(); this.props.handleClose(); }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter contained-modal-title-hcenter"
            centered
          >
            <Modal.Header className="modal-editor-body" closeButton>
              <Modal.Title id="contained-modal-title-vcenter">Editing: {this.props.view.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-editor-body">
              <Col lg={4} md={6} sm={12}>
                <Form>
                  <div id="view-variant" className="autogen-units">
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
              <Col sm={12} md={6} lg={4}>
                <div className="autogen-units" id="view-variant">Widget</div>
                <ViewSelector
                  options={this.props.options}
                  data={this.props.functionalData.data[0].packet}
                  updateCallback={this.updateViewComponentVar}
                  currentComponent={this.props.view.type.component}
                  currentVariant={this.props.view.type.variant}
                />
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
              <Col lg={4} md={6} sm={12}>
                <div className="autogen-units" id="view-variant">Options</div>
                <OptionsEditor
                  componentLibs={this.props.componentLibs}
                  options={this.state.o}
                  addOptionsCallback={this.handleAddOptions}
                  modifyOptionCallback={this.handleModifyOptions}
                  viewIndex={this.props.index}
                  viewOptionsIndex={this.props.view.optionsIndex}
                />
              </Col>
            </Modal.Body>
            <Modal.Footer className="modal-editor-body">
              <div className="mr-auto autogen autogen-panel card autogen-effect-preview">
                <div className="open-speech-header open-speech-header-std open-speech-accent-color">
                  <h1 className="open-speech-accent-font">Preview</h1>
                </div>
                <div className="content autogen autogen-panel">
                  <div className="autogen autogen-control">
                    <this.props.component
                      view={this.props.view}
                      editing={true}
                      data={this.props.functionalData}
                      indexedOptions={this.props.options}
                      callback={() => { }} />
                  </div></div></div>
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