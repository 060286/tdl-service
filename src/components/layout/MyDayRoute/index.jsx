import React, { useState, useEffect } from "react";

import { Row, Col, Container } from "react-bootstrap";
import TaskItem from "../../core/TaskItem";
import axios from "axios";

import "./style.css";

export default function MyDayRoute(props) {
  const { userName } = props;
  const [quotes, setQuotes] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    axios
      .get("https://type.fit/api/quotes")
      .then(function (response) {
        const result = response.data[Math.floor(Math.random() * 100)];
        console.log(result);

        setQuotes(result.text);
        setAuthor(result.author);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  return (
    <Container className="MyDayRoute">
      <Row className="">
        <Col>
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
                WeekDay
              </p>
              <p
                style={{ fontSize: "41px", fontWeight: 500, color: "#030303" }}
              >
                Day
              </p>
              <p
                style={{ fontSize: "15px", fontWeight: 500, color: "#D8D8D8" }}
              >
                Month
              </p>
            </Col>
            <Col xs={8} className="MyDayRouteEvent">
              <p>You have no events scheduled for today</p>
            </Col>
          </Row>
          <Row className="MyDayEntries">
            <TaskItem />
            <TaskItem />
          </Row>
        </Col>
        <Col>Suggestion</Col>
      </Row>
    </Container>
  );
}
