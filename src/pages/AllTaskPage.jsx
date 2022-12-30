import React from "react";
import SideBar from "../components/layout/SideBar";

import { Col, Container, Row } from "react-bootstrap";

const AllTaskPage = () => {
  return (
    <Container fluid className="alltaskpage">
      <Row>
        <Col xs={3}>
          <SideBar />
        </Col>
        <Col>Đây là Content</Col>
      </Row>
    </Container>
  );
};

export default AllTaskPage;
