import React, { useState } from "react";

import { useDispatch } from "react-redux";

import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { PlusCircle } from "react-bootstrap-icons";

import { addNewTodo } from "../../../slices/todoSlice";

import { VARIABLE_STATUS } from "../../../constants/appStatusConstant";

import "./style.css";

export default function AddTask() {
  const [taskTitle, setTaskTitle] = useState("Add Task");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const cansave =
    addRequestStatus === VARIABLE_STATUS.IDLE &&
    taskTitle.length > 0 &&
    taskTitle !== "Add Task";

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

        setTaskTitle("Add Task");
      } catch (err) {
        console.log("Failed to save the post", err);
      } finally {
        setAddRequestStatus(VARIABLE_STATUS.IDLE);
      }
    }
  };

  return (
    <>
      <div className="AddTask" style={{ height: "100px", display: "relative" }}>
        <InputGroup
          className="mb-3 InputTask AddIcon"
          style={{
            display: "absolute",
            left: "50%",
            top: "50%",
            width: "80%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* <InputGroup.Text className="InputTask" id="inputGroup-sizing-default">
            <PlusCircle />
          </InputGroup.Text> */}
          <Form.Control
            onKeyUp={(e) => onKeyPressHandler(e)}
            value={taskTitle}
            placeholder="Add Task"
            onChange={(e) => setTaskTitle(e.target.value)}
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
      </div>
    </>
  );
}
