import React, { useState, useEffect } from "react";
import axios from "axios";

import TaskItem from "../../core/TaskItem";
import SuggestionItem from "../../core/SuggestionItem";

import { Row, Col, Container } from "react-bootstrap";
import { Lightbulb, Search } from "react-bootstrap-icons";

import { useDispatch, useSelector } from "react-redux";
import { VARIABLE_STATUS } from "../../../constants/appStatusConstant";
import {
  getSuggestionTodo,
  selectAllSuggestionTodo,
} from "../../../slices/todoSlice";

import "./style.css";

export default function MyDayRoute(props) {
  const { userName, todos } = props;
  const [quotes, setQuotes] = useState("");
  const [author, setAuthor] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayOfMonth, setDateOfMonth] = useState(0);
  const [monthOfYear, setMonthOfYear] = useState(0);

  const dispatch = useDispatch();
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

  useEffect(() => {
    hanleQuotes();

    if (suggestionStatus === VARIABLE_STATUS.IDLE) {
      dispatch(getSuggestionTodo());
    }
  }, []);

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
    <div className="MyDayRouteTop">
      <Row>
        <Col xs={8}>
          <Row className="MyDayRoute__title">
            <p className="MyDayRouteTitle">Good Evening, {userName}</p>
            <p className="MyDayRouteSubTitle">
              {quotes} {author}
            </p>
          </Row>
          <Row>
            <Col xs={4} className="MyDayRouteCalendar">
              <p
                style={{ fontSize: "15px", fontWeight: 500, color: "#9B9B9B" }}
              >
                {dayOfWeek}
              </p>
              <p
                style={{ fontSize: "41px", fontWeight: 500, color: "#030303" }}
              >
                {dayOfMonth}
              </p>
              <p
                style={{ fontSize: "15px", fontWeight: 500, color: "#D8D8D8" }}
              >
                {monthOfYear}
              </p>
            </Col>
            <Col xs={8} className="MyDayRouteEvent">
              <p>You have no events scheduled for today</p>
            </Col>
          </Row>
          <Row className="MyDayEntries">
            {todos.map((todo) => {
              return (
                <TaskItem
                  key={todo.id}
                  id={todo.id}
                  task={todo.title}
                  breadcrumb=""
                ></TaskItem>
              );
            })}
          </Row>
        </Col>
        <Col xs={4}>
          <div className="AppHeader">
            <div className="AppHeader__Dropdown">
              <Lightbulb />
              <span>Suggestions</span>
            </div>
            <div className="AppHeader__Search">
              <Search />
            </div>
          </div>
          <div>Filter</div>
          <div className="AppSuggestionList">
            {suggestionTodos.todos.map((suggestion) => {
              return <SuggestionItem key={suggestion.id} data={suggestion} />;
            })}
          </div>
        </Col>
      </Row>
    </div>
  );
}
