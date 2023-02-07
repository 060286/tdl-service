import React from "react";

import SideBar from "../../components/layout/SideBar";
import MyDayRoute from "../../components/layout/MyDayRoute";
import AddTask from "../../components/core/AddTask";

import "./style.css";

import { Col, Container, Row } from "react-bootstrap";

const MyDayPage = () => {
  return (
    <Container fluid className="mydaypage">
      <Row className="top_content">
        <Col xs={3}>
          <SideBar />
        </Col>
        <Col>
          <MyDayRoute userName="Tâm Lê Văn" />
        </Col>
      </Row>
      <Row className="bottom_content">
        <div className="AddTaskInput_Block">
          <AddTask />
        </div>
      </Row>
    </Container>
  );
};

export default MyDayPage;
