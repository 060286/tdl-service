import React from "react";

import { Row, Col } from "react-bootstrap";
const MyDayCalendar = ({ weekday, day, month }) => {
  return (
    <div className="MyDayCalendar" style={{ marginTop: "25px" }}>
      <Row>
        <Col xs={2}>
          <div className="MyDayCalendar__calendar">
            <div className="MyDayCalendar__calendargroup">
              <div
                className="MyDayCalendar__calendaritem"
                style={{
                  fontSize: "15px",
                  color: "#9B9B9B",
                  textTransform: "uppercase",
                  marginBottom: "-3px",
                }}
              >
                {weekday}
              </div>
              <div
                className="MyDayCalendar__calendaritem"
                style={{
                  fontWeight: "700",
                  color: "#030303",
                  marginBottom: "-3px",
                  lineHeight: "44.26px",
                  fontSize: "42px",
                }}
              >
                {day}
              </div>
              <div
                className="MyDayCalendar__calendaritem"
                style={{
                  fontSize: "15px",
                  lineHeight: "1.2",
                  color: "#d8d8d8",
                }}
              >
                {month}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MyDayCalendar;
