import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllTask,
  selectAllTasks,
  selectTaskDetail,
} from "../../slices/allMyTaskSlice";
import { Col, Container, Row } from "react-bootstrap";
import { VARIABLE_STATUS } from "../../constants/appStatusConstant";
import AllMyTask from "../../components/core/AllMyTask";

const AllTaskPage = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectAllTasks);
  const tasksStatus = useSelector(
    (state) => state.allTaskReducer.allTasks.status
  );
  const { data } = useSelector(selectTaskDetail);
  const tasksError = useSelector(
    (state) => state.allTaskReducer.allTasks.error
  );

  useEffect(() => {
    if (tasksStatus === VARIABLE_STATUS.IDLE) {
      dispatch(getAllTask(tasks));
    }
  }, [tasksStatus, dispatch]);

  return (
    <Container className="alltaskpage">
      <Row>
        <Col>
          <Row>
            <h3>All My Task</h3>
          </Row>
          <Row>
            <Col>
              {tasksStatus !== VARIABLE_STATUS.IDLE ? (
                <AllMyTask tasks={tasks} />
              ) : (
                <></>
              )}
            </Col>
            <Col>
              <p>For Detail of Todo</p>
              <p>{data.id}</p>
              <p>{data.title}</p>
              <p>{data.isCompleted}</p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default AllTaskPage;
