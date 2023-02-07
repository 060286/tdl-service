import React, { useState } from "react";

import { useDispatch } from "react-redux";

import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { PlusCircle } from "react-bootstrap-icons";

import { addNewTodo } from "../../../slices/todoSlice";

import { VARIABLE_STATUS } from "../../../constants/appStatusConstant";

import "./style.css";

export default function AddTask() {
  const [taskTitle, setTaskTitle] = useState(
    "Please fill and press enter to save task..."
  );
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const cansave =
    addRequestStatus === VARIABLE_STATUS.IDLE &&
    taskTitle.length > 0 &&
    taskTitle !== "Please fill and press enter to save task...";

  const onKeyPressHandler = async (e) => {
    const enterKey = "Enter";

    if (e.key === enterKey) {
      try {
        if (!cansave) {
          alert("Please fill the task!");
          return;
        }

        setAddRequestStatus(VARIABLE_STATUS.LOADING);
        await dispatch(addNewTodo({ title: taskTitle })).unwrap();

        setTaskTitle("Please fill and press enter to save task...");
      } catch (err) {
        console.log("Failed to save the post", err);
      } finally {
        setAddRequestStatus(VARIABLE_STATUS.IDLE);
      }
    }
  };

  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          <PlusCircle />
        </InputGroup.Text>
        <Form.Control
          onKeyUp={(e) => onKeyPressHandler(e)}
          value={taskTitle}
          placeholder="Please fill and press enter to save task..."
          onChange={(e) => setTaskTitle(e.target.value)}
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
        />
      </InputGroup>
    </>
  );
}
