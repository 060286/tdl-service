import React from "react";

import SideBar from "../components/layout/SideBar";
import MyDayRoute from "../components/layout/MyDayRoute";

import { Col, Container, Row } from "react-bootstrap";

const MyDayPage = () => {
  return (
    <Container fluid className="mydaypage">
      <Row>
        <Col xs={3}>
          <SideBar />
        </Col>
        <Col>
          <MyDayRoute userName="Tâm Lê Văn" />
        </Col>
      </Row>
    </Container>
  );
};

export default MyDayPage;
