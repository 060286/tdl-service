import React, { useState, useRef } from "react";

import { Row, Col, Overlay } from "react-bootstrap";
import {
  LockFill,
  ThreeDotsVertical,
  Clipboard,
  Clipboard2,
} from "react-bootstrap-icons";

import PropTypes from "prop-types";

import "./style.css";

const MyDayTodoItem = ({
  title,
  isCompleted,
  category,
  id,
  handleOpenPopup,
}) => {
  const [isDone, setIsDone] = useState(isCompleted);
  const [isClickThreeDot, setIsClickThreeDot] = useState(false);
  const target = useRef(null);

  category = "test";

  const handleClickDetailPopup = (id) => {
    console.log(id);
  };

  const handleCompletedBtn = (event, id) => {
    const isChecked = event.target.checked;

    console.log({ id, isChecked });
  };

  return (
    <div
      className="MyDayTodoItemBlock"
      style={{
        width: "95%",
        height: "3.5rem",
        borderRadius: "5px",
        margin: "10px",
      }}
    >
      <div className="TodoItemEntriesBlock" style={{ position: "relative" }}>
        <div
          className={`TaskItemCheckbox ${
            isDone ? "TaskItemCheckBoxDone" : "TaskItemCheckBoxNotDone"
          }`}
          onClick={() => {
            setIsDone(!isDone);
          }}
          style={{
            width: "20px",
            height: "20px",
            background: isDone ? "gray" : null,
            border: isDone ? "" : "1px solid blue",
            borderRadius: "50%",
            position: "absolute",
            top: "30%",
            left: "30%",
          }}
        ></div>
      </div>
      <div className="MyDayTodoItemBock">
        <Row>
          <Col xs={8}>
            <div className="MyDayTodoItemCategory">
              <span>
                <LockFill className="MyDayTodoLockIcon" />
                <a className="MyDayTodoCategoryRoute"> {category}</a>
              </span>
            </div>
            <p>{title}</p>
          </Col>
          <Col xs={4}>
            <Row>
              <Col xs={6}></Col>
              <Col xs={1}>
                <ThreeDotsVertical
                  ref={target}
                  onClick={() => {
                    console.log("three dot");
                    setIsClickThreeDot(!isClickThreeDot);
                  }}
                />
              </Col>
              <Overlay
                target={target.current}
                show={isClickThreeDot}
                placement="right"
              >
                {({
                  placement: _placement,
                  arrowProps: _arrowProps,
                  show: _show,
                  popper: _popper,
                  hasDoneInitialMeasure: _hasDoneInitialMeasure,
                  ...props
                }) => (
                  <div
                    {...props}
                    style={{
                      position: "absolute",
                      backgroundColor: "rgba(255, 100, 100, 0.85)",
                      padding: "2px 10px",
                      color: "white",
                      borderRadius: 3,
                      ...props.style,
                    }}
                  >
                    Simple tooltip
                  </div>
                )}
              </Overlay>
              <Col xs={1}>
                <Clipboard2 onClick={(e) => handleOpenPopup(id)} />
              </Col>
              <Col xs={1}>4</Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MyDayTodoItem;

// implement proptypes
MyDayTodoItem.propTypes = {};
