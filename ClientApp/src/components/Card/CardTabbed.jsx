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
import React, { Component } from "react";
import { Row, Col, Tab, Nav } from "react-bootstrap";

export class CardTabbed extends Component {
  render() {
    return (
      <div className={"card" + (this.props.plain ? " card-plain" : "")}>
        <Tab.Container id={"chart-tabs " + this.props.id} defaultActiveKey="7">

          <div className={"header" + (this.props.hCenter ? " text-center" : "")}>
            <Row>
           <Col sm={4}>
          <h4 className="title">{this.props.title}</h4>
              <p className="category">{this.props.category}</p>
            </Col>
            <Col sm={8}>
                <Nav variant="tabs" className="justify-content-end">
                  <Nav.Item onClick={this.props.clickDay ? this.props.clickDay : ""}>
                  <Nav.Link eventKey="1">24-Hour</Nav.Link>
                </Nav.Item>
                  <Nav.Item onClick={this.props.clickWeek ? this.props.clickWeek : ""}>
                  <Nav.Link eventKey="7">7-Day</Nav.Link>
                </Nav.Item>
                  <Nav.Item onClick={this.props.clickMonth ? this.props.clickMonth : ""}>
                  <Nav.Link eventKey="30">30-Day</Nav.Link>
                  </Nav.Item>
                <Nav.Item onClick={this.props.clickSeason ? this.props.clickSeason : ""}>
                  <Nav.Link eventKey="Season">Season</Nav.Link>
                </Nav.Item>
              </Nav>
              </Col>
              </Row>
            </div>
          <Tab.Content className="col-lg-12 col-md-12 col-sm-12">

            <Tab.Pane eventKey="1">
            <div
              className={
                "content" +
                (this.props.ctAllIcons ? " all-icons" : "") +
                (this.props.ctTableFullWidth ? " table-full-width" : "") +
                (this.props.ctTableResponsive ? " table-responsive" : "") +
                (this.props.ctTableUpgrade ? " table-upgrade" : "") 
              }>
              {this.props.content}

             <div className="footer">
              {this.props.legend}
              {this.props.stats != null ? <hr /> : ""}
              <div className="stats">
                <i className={this.props.statsIcon} /> {this.props.stats}
              </div>
             </div>
            </div>
            </Tab.Pane>

            <Tab.Pane eventKey="7">
              <div
                className={
                  "content" +
                  (this.props.ctAllIcons ? " all-icons" : "") +
                  (this.props.ctTableFullWidth ? " table-full-width" : "") +
                  (this.props.ctTableResponsive ? " table-responsive" : "") +
                  (this.props.ctTableUpgrade ? " table-upgrade" : "")
                }>
                {this.props.content}

                <div className="footer">
                  {this.props.legend}
                  {this.props.stats != null ? <hr /> : ""}
                  <div className="stats">
                    <i className={this.props.statsIcon} /> {this.props.stats}
                  </div>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="30">
              <div
                className={
                  "content" +
                  (this.props.ctAllIcons ? " all-icons" : "") +
                  (this.props.ctTableFullWidth ? " table-full-width" : "") +
                  (this.props.ctTableResponsive ? " table-responsive" : "") +
                  (this.props.ctTableUpgrade ? " table-upgrade" : "")
                }>
                {this.props.content}

                <div className="footer">
                  {this.props.legend}
                  {this.props.stats != null ? <hr /> : ""}
                  <div className="stats">
                    <i className={this.props.statsIcon} /> {this.props.stats}
                  </div>
                </div>
              </div>
            </Tab.Pane>

            <Tab.Pane eventKey="Season">
              <div
                className={
                  "content" +
                  (this.props.ctAllIcons ? " all-icons" : "") +
                  (this.props.ctTableFullWidth ? " table-full-width" : "") +
                  (this.props.ctTableResponsive ? " table-responsive" : "") +
                  (this.props.ctTableUpgrade ? " table-upgrade" : "")
                }>
                {this.props.content}

                <div className="footer">
                  {this.props.legend}
                  {this.props.stats != null ? <hr /> : ""}
                  <div className="stats">
                    <i className={this.props.statsIcon} /> {this.props.stats}
                  </div>
                </div>
              </div>
            </Tab.Pane>

          </Tab.Content>
        </Tab.Container>
      </div>
    );
  }
}

export default CardTabbed;
