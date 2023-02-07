import React, { useEffect } from "react";

import SideBar from "../../components/layout/SideBar";
import MyDayRoute from "../../components/layout/MyDayRoute";
import AddTask from "../../components/core/AddTask";

import { useSelector, useDispatch } from "react-redux";
import { getCurrentTodoList, selectAllTodos } from "../../slices/todoSlice";
import { VARIABLE_STATUS } from "../../constants/appStatusConstant";

import { Col, Container, Row } from "react-bootstrap";

import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";

import "./style.css";

const MyDayPage = () => {
  const dispatch = useDispatch();
  const todos = useSelector(selectAllTodos);
  const todoStatus = useSelector(
    (state) => state.todoReducer.getCurrentTodo.status
  );
  const todoError = useSelector(
    (state) => state.todoReducer.getCurrentTodo.error
  );

  useEffect(() => {
    if (todoStatus === VARIABLE_STATUS.IDLE) {
      dispatch(getCurrentTodoList(todos));
    }
  }, [todoStatus, dispatch]);

  return (
    <Container fluid className="mydaypage">
      <Row className="top_content">
        <Col xs={3}>
          <SideBar />
        </Col>
        <Col>
          <MyDayRoute userName="Tâm Lê Văn" todos={todos.todos} />
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
