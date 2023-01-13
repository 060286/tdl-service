import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { PlusCircle } from "react-bootstrap-icons";

import { createTodo } from "../../../adapters/myDayPageAdapter";
import { addNewTodo } from "../../../features/todoSlice";

import { VARIABLE_STATUS } from "../../../constants/appStatusConstant";

import "./style.css";

export default function AddTask() {
  const [taskTitle, setTaskTitle] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const onKeyPressHandler = async (e, title) => {
    const enterKey = "Enter";
    // debugger;

    if (e.key === enterKey) {
      try {
        setAddRequestStatus(VARIABLE_STATUS.LOADING);
        await dispatch(addNewTodo({ title: taskTitle })).unwrap();
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
          onKeyUp={(e) => onKeyPressHandler(e, taskTitle)}
          placeholder="Please fill and press enter to save task..."
          onChange={(e) => setTaskTitle(e.target.value)}
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
        />
      </InputGroup>
    </>
  );
}
