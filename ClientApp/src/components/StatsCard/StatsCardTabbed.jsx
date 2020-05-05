/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import moment from 'moment';
import React, { Component } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { InputMoment } from 'react-input-moment';

var displayDate = "Date";

export class StatsCardTabbed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputMoment: moment().subtract(1,'hours'),
      showSeconds: true,
      locale: 'en',
      size: 'medium'
    };
  }

  componentWillMount() {
    this.setState({
      hide: (window.innerWidth < 1363 && window.innerWidth > 990)
    });
  }

  componentDidMount() {
    window.addEventListener('resize', () => {
      this.setState({
        hide: (window.innerWidth < 1363 && window.innerWidth > 990)
      });
    }, false);
  }

  displayDate = new Date();

  render() {
    const hideCalendarButtonText = this.state.hide ? 'hide date-text' : 'show date-text';
    return (
      <div className="card card-stats-calendar">
        <div className="content">
          <Row>
            <Col sm={6} md={6}>
              <CalendarModalWindow
                calendar={this.DatePicker()}
                handleSave={setDate.bind(this)}
                datestring={displayDate}
                dateDisplayClassName={hideCalendarButtonText}
              />
            </Col>
            <Col sm={6} md={6}>
              <p>{this.props.statsText}</p>
           </Col>
          </Row>
          <Row className="stats-val" >
            <div className="stats-val numbers">
              {this.props.statsChangeDirectionIcon}
              {this.props.statsValue}
            </div>
            </Row>
          <div className="footer">
            <hr />
            <div className="stats">
              {this.props.statsIcon} {this.props.statsIconText}
            </div>
          </div>
        </div>
      </div>
    );
  }

  DatePicker() {
    let { inputMoment, showSeconds, locale, size } = this.state;
    let wrapperClass = 'wrapper ' + size;

    return (
      <div>
        <div>
        <input
          className="output-datetime"
          type="text"
          value={inputMoment.format('llll')}
          readOnly
          />
          </div>
          <InputMoment
            moment={inputMoment}
            locale={locale}
            showSeconds={showSeconds}
            onChange={mom => this.setState({ inputMoment: mom })}
            prevMonthIcon="ion-ios-arrow-left" // default
            nextMonthIcon="ion-ios-arrow-right" // default
        />
        </div>);
  }

}

function setDate() {
  if (this.state.inputMoment) {
    displayDate = this.state.inputMoment.format('llll');
  }
  this.props.setDateRequestedFunction(displayDate);
  this.forceUpdate();
}

function CalendarModalWindow(props) {

  const [show, setShow] = React.useState(false);
  const handleClose = () => {
    setShow(false);
  }
  const handleSave = () => {
    { props.handleSave() }
    setShow(false);
  }
  const handleShow = () => setShow(true);
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        <Row className="calendar-button">
          <Col>
            <i className="material-icons md-72">calendar_today</i>
          </Col>
          <Col className={props.dateDisplayClassName}>
            {props.datestring}
          </Col>
        </Row>
      </Button>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Select A Date/Time</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.calendar}
        </Modal.Body>
        <Modal.Footer>
          <Button className="centerButton" variant="primary" onClick={handleSave}>
            Save 
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
 

export default StatsCardTabbed;
