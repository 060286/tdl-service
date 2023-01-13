import React, { useEffect, useState } from "react";

import SideBar from "../../components/layout/SideBar";
import MyDayRoute from "../../components/layout/MyDayRoute";
import AddTask from "../../components/core/AddTask";
import ListTodoItem from "../../components/core/ListTodoItem";

import { Col, Container, Row } from "react-bootstrap";
import { getTodo } from "../../adapters/myDayPageAdapter";

import "./style.css";

const MyDayPage = () => {
  const [todolist, setTodoList] = useState([]);

  const getTodoList = async () => {
    const data = await getTodo();

    setTodoList(data.data);
  };

  useEffect(() => {
    getTodoList();
  }, []);

  console.log(todolist, "todo");

  return (
    <Container fluid className="mydaypage">
      <Row className="top_content">
        <Col xs={3}>
          <SideBar />
        </Col>
        <Col>
          <MyDayRoute userName="Tâm Lê Văn" todos={todolist} />
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
