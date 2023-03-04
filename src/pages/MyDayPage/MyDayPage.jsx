import React, { useEffect, useState } from "react";
import axios from "axios";

import AddTask from "../../components/core/AddTask";
import MyDayWelcomeName from "../../components/core/MyDayWelcomeName";
import MyDayCalendar from "../../components/core/MyDayCalendar";
import MyDayTodoItem from "../../components/core/MyDayTodoItem";
import MyDayTaskDetailModal from "../../components/core/MyDayTaskDetailModal";
import SuggestionItem from "../../components/core/SuggestionItem";
import {
  getSuggestionTodo,
  selectAllSuggestionTodo,
} from "../../slices/todoSlice";

import { getUserInfo } from "../../slices/accountSlice";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";

import { useSelector, useDispatch } from "react-redux";
import { getCurrentTodoList, selectAllTodos } from "../../slices/todoSlice";
import { VARIABLE_STATUS } from "../../constants/appStatusConstant";
import { Col, Row, Modal } from "react-bootstrap";
import "./style.css";

const MyDayPage = () => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [quotes, setQuotes] = useState("");
  const [author, setAuthor] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayOfMonth, setDateOfMonth] = useState(0);
  const [monthOfYear, setMonthOfYear] = useState(0);

  const dispatch = useDispatch();
  const todos = useSelector(selectAllTodos);
  const todoStatus = useSelector(
    (state) => state.todoReducer.getCurrentTodo.status
  );
  const todoState = useSelector((state) => state.todoReducer.getDetailTo);
  const userInfo = useSelector((state) => state.accountReducer.userInfo);
  const suggestionTodos = useSelector(selectAllSuggestionTodo);
  const suggestionStatus = useSelector(
    (state) => state.todoReducer.getSuggestionTodo.status
  );

  const hanleQuotes = () => {
    axios
      .get("https://type.fit/api/quotes")
      .then(function (response) {
        const result = response.data[Math.floor(Math.random() * 100)];
        setQuotes(result.text);
        setAuthor(result.author);
      })
      .catch(function (error) {
        console.error(error);
      });

    const date = new Date();
    const dateNumber = date.getDay();
    const monthNumber = date.getMonth();

    setDayOfWeek(dateFormatted(dateNumber));
    setDateOfMonth(date.getDate());
    setMonthOfYear(monthFormatted(monthNumber));
  };

  const handleOpenPopup = (id) => {
    setTaskId(id);
    setIsOpenPopup(!isOpenPopup);
  };

  useEffect(() => {
    hanleQuotes();

    if (todoStatus === VARIABLE_STATUS.IDLE) {
      dispatch(getCurrentTodoList(todos));
    }

    if (userInfo.status === VARIABLE_STATUS.IDLE) {
      const token = getTokenFromLocalStorage();

      dispatch(getUserInfo(token));
    }

    if (suggestionStatus === VARIABLE_STATUS.IDLE) {
      dispatch(getSuggestionTodo());
    }
  }, [todoStatus, dispatch]);

  const monthFormatted = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString("en-US", {
      month: "long",
    });
  };

  const dateFormatted = (dateNumber) => {
    switch (dateNumber) {
      case 0:
        return "Sunday";

      case 1:
        return "Monday";

      case 2:
        return "Tuesday";

      case 3:
        return "Wednesday";

      case 4:
        return "Thursday";

      case 5:
        return "Friday";

      case 6:
        return "Saturday";

      default:
        return "Error";
    }
  };

  return (
    <div className="MyDayPage" style={{ boxSizing: "border-box" }}>
      <MyDayTaskDetailModal
        id={taskId}
        show={isOpenPopup}
        onHide={() => {
          setIsOpenPopup(false);
          setTaskId(null);
        }}
      />
      {isOpenPopup ? <Modal /> : null}
      <Row style={{ height: "100%" }}>
        <Col xs={9} style={{ maxHeight: "90vh" }}>
          <div className="MyDayContentWelCome" style={{ padding: "2rem 5rem" }}>
            <MyDayWelcomeName
              username={userInfo.fullName}
              qoutes={quotes}
              author={author}
            />
            <MyDayCalendar
              weekday={dayOfWeek}
              day={dayOfMonth}
              month={monthOfYear}
            />
          </div>
          <div
            className="MyDayTaskListBlock"
            style={{
              overflow: "scroll",
              boxSizing: "border-box",
              position: "relative",
              height: "50%",
            }}
          >
            <div
              className="MyDayListItemBlock"
              style={{
                position: "absolute",
                width: "80%",
                left: "10%",
                top: "0",
                height: "100%",
                overflow: "scroll",
              }}
            >
              <div
                className="MyDayListItem"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {todos.todos.length !== 0 ? (
                  todos.todos.map((task) => {
                    return (
                      <MyDayTodoItem
                        title={task.title}
                        category={task.todoCategory}
                        id={task.id}
                        key={task.id}
                        isCompleted={task.isCompleted}
                        handleOpenPopup={handleOpenPopup}
                      />
                    );
                  })
                ) : (
                  <p
                    style={{
                      fontSize: "25px",
                      fontWeight: "700",
                    }}
                  >
                    Do some thing awesome
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="MyDayAddTask">
            <AddTask />
          </div>
        </Col>
        <Col xs={3} style={{ maxHeight: "100vh" }}>
          <div
            className="AppSuggestionList"
            style={{
              height: "95%",
              overflow: "scroll",
              boxSizing: "border-box",
            }}
          >
            {suggestionTodos.todos.map((suggestion) => {
              return <SuggestionItem key={suggestion.id} data={suggestion} />;
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MyDayPage;
