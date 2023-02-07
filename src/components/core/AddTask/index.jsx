import React, { useState, useEffect } from "react";

import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import { getTodo } from "../../../adapters/myDayPageAdapter";

import "./style.css";

export default function AddTask() {
  const [taskTitle, setTaskTitle] = useState("");
  const [todoList, setTodoList] = useState([]);

  const todos = async () => {
    const response = await getTodo();

    if (response.isSuccess && response.statusCode === 200) {
      setTodoList(response.data);
    } else {
      console.warn(response.messageDetail);
    }
  };

  useEffect(() => {
    todos();
  }, []);

  console.log(taskTitle);

  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          Add Task
        </InputGroup.Text>
        <Form.Control
          onChange={(e) => setTaskTitle(e.target.value)}
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
        />
      </InputGroup>
    </>
  );
}
