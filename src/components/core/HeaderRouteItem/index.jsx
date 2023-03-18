import React from "react";

import "./style.css";
import { Row, Col, Button } from "react-bootstrap";
import { CalendarDate } from "react-bootstrap-icons";
import {Box} from "@mui/material"
const HeaderRouteItem = () => {
  return (
    <Box className="HeaderRouteItemBlock">
      <Row style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Col xs={1} style={{ margin: "0px 8px 6px 8px", fontSize: "20px"}}>
          <CalendarDate />
        </Col>
        <Col xs={4} style={{display: "flex", alignItems: "center"}}>
          <div className="CalendarHeader">Next 7 Days</div>
        </Col>
        <Col xs={6}  style={{display: "flex", alignItems: "center"}}>
          <Button className="RouteBtn">My Lists</Button>
          <Button className="RouteBtn">Workspace</Button>
        </Col>
      </Row>
    </Box>
  );
};

export default HeaderRouteItem;
