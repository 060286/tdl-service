import React from "react";

import { Outlet } from "react-router";
import { Container, Col, Row } from "react-bootstrap";

import SideBar from "../../components/Sidebar/Sidebar";

import { Link } from "react-router-dom";

const LayoutPage = ({ isShowSideBar }) => {
  return (
    <>
      <Container fluid>
        <Row style={{ height: "100vh" }}>
          <Col xs={2} style={{ padding: "0px" }}>
            <SideBar />
          </Col>
          <Col xs={10}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LayoutPage;
