import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { Circle, CheckCircleFill, CircleFill } from "react-bootstrap-icons";

import { VARIABLE_STATUS } from "../../../constants/appStatusConstant";
import { useDispatch, useSelector } from "react-redux";
import { getTodoById } from "../../../slices/todoSlice";
import {
  removeDetailTodo,
  changeTitleByDetail,
  createSubTodo,
  addSubTaskToDetailTodo,
  changeCompletedStatusOfSubtaskById,
} from "../../../slices/todoSlice";

import "./style.css";
import { Row, Col } from "react-bootstrap";

const MyDayTaskDetailModal = (props) => {
  const [subtaskText, setSubtaskText] = useState("");
  let isShow = props.show;

  const dispatch = useDispatch();
  const todo = useSelector((state) => state.todoReducer.getDetailTodo);
  const subtaskPlaceHolder = "Add a new subtask";

  useEffect(() => {
    if (todo.status === VARIABLE_STATUS.IDLE && props.id !== null) {
      dispatch(getTodoById(props.id));
    }
  }, [isShow]);

  const handleCreateSubtask = async (e, id, tod) => {
    if (e.key === "Enter") {
      await dispatch(
        createSubTodo({ todoId: id, name: e.target.value })
      ).unwrap();

      setSubtaskText("");
      dispatch(
        addSubTaskToDetailTodo({
          todoId: id,
          name: e.target.value,
          isCompleted: false,
        })
      );
      e.target.value = "";
    }
  };

  const handleSubtaskIconClick = (id, name, isCompleted) => {
    dispatch(changeCompletedStatusOfSubtaskById({ id, name, isCompleted }));
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onExit={() => dispatch(removeDetailTodo())}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {todo.status === VARIABLE_STATUS.SUCCEEDED ? todo.todo.title : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="TitleInputBlock">
          {todo.status === VARIABLE_STATUS.SUCCEEDED ? (
            <input
              onChange={(e) => dispatch(changeTitleByDetail(e.target.value))}
              maxLength={250}
              placeholder={todo.todo.title}
              type="text"
              className="InputPlace"
            />
          ) : (
            <></>
          )}
        </div>
        <Row className="MyDayTaskFunction">
          <Button variant="secondary" className="MDT_TopButton">
            Remind
          </Button>
          <Button variant="secondary" className="MDT_TopButton">
            Work
          </Button>
          <Button variant="secondary" className="MDT_TopButton">
            Tags
          </Button>
        </Row>
        <Row className="MDT_NoteTitle">
          <p>Notes</p>
        </Row>
        <Row>
          <input
            className="MDT_InputNoteTitle"
            type="text"
            placeholder="Insert your notes here"
          />
        </Row>
        <Row className="MDT_SubTask">Sub Task Here</Row>
        <Row>
          <div className="MDT_SubTaskItem">
            <Row>
              <Col xs={2}>
                <Circle />
              </Col>
              <Col xs={10}>
                <input
                  type="text"
                  placeholder={subtaskPlaceHolder}
                  defaultValue={subtaskText}
                  onKeyDown={(e) => handleCreateSubtask(e, todo.todo.id)}
                />
              </Col>
            </Row>
          </div>
        </Row>
        <Row className="MDT_SubTaskItemBlock">
          {todo.status === VARIABLE_STATUS.SUCCEEDED ? (
            todo.todo.subTasks.map((todo) => (
              <div key={todo.id} className="MDT_SubTaskItem">
                <Row>
                  <Col xs={2}>
                    {todo.isCompleted ? (
                      <CircleFill
                        onClick={() =>
                          handleSubtaskIconClick(
                            todo.id,
                            todo.name,
                            todo.isCompleted
                          )
                        }
                      />
                    ) : (
                      <Circle
                        onClick={() =>
                          handleSubtaskIconClick(
                            todo.id,
                            todo.name,
                            todo.isCompleted
                          )
                        }
                      />
                    )}
                  </Col>
                  <Col xs={10}>
                    <input
                      type="text"
                      defaultValue={todo.name}
                      disabled={todo.isCompleted}
                    />
                  </Col>
                </Row>
              </div>
            ))
          ) : (
            <></>
          )}
        </Row>
        <Row>
          <p className="MDT_InputAttachmentTitle">ATTACHMENTS</p>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={(e) => props.handleArchivedTodo(todo.todo.id)}>
          Archived
        </Button>
        <Button>Update</Button>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyDayTaskDetailModal;
