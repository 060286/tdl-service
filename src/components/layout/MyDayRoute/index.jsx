import React, { useState, useEffect } from "react";
import axios from "axios";

import TaskItem from "../../core/TaskItem";
import SuggestionItem from "../../core/SuggestionItem";

import { Row, Col, Container } from "react-bootstrap";
import { Lightbulb, Search } from "react-bootstrap-icons";

import "./style.css";

export default function MyDayRoute(props) {
  const { userName, todos } = props;
  const [quotes, setQuotes] = useState("");
  const [author, setAuthor] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayOfMonth, setDateOfMonth] = useState(0);
  const [monthOfYear, setMonthOfYear] = useState(0);

  const suggestions = [
    {
      id: 1,
      title: "Xem tivi",
      time: "From 2 days ago",
      breadcrumb: "My lists > Personal",
    },
  ];

  useEffect(() => {
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

    console.log(date.getMonth());

    setDayOfWeek(dateFormatted(dateNumber));
    setDateOfMonth(date.getDate());
    setMonthOfYear(monthFormatted(monthNumber));
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
    <Container className="MyDayRoute">
      <Row className="">
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
            {suggestions.map((suggestion) => {
              return (
                <SuggestionItem
                  key={suggestion.id}
                  breadcrumb={suggestion.breadcrumb}
                  title={suggestion.title}
                  timeline={suggestion.time}
                />
              );
            })}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
