import React from "react";

import "./style.css";
import { Row, Col, Button } from "react-bootstrap";
import { CalendarDate } from "react-bootstrap-icons";

const HeaderRouteItem = () => {
  return (
    <div className="HeaderRouteItemBlock">
      <Row>
        <Col xs={1} style={{ marginLeft: "5px" }}>
          <CalendarDate />
        </Col>
        <Col xs={3}>
          <div className="CalendarHeader">Next 7 Days</div>
        </Col>
        <Col>
          <Button className="RouteBtn">My Lists</Button>
          <Button className="RouteBtn">Workspace</Button>
        </Col>
      </Row>
    </div>
  );
};

export default HeaderRouteItem;
