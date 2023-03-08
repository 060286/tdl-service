import React, { useEffect, useState } from "react";

import HeaderRouteItem from "../../components/core/HeaderRouteItem";
import NextSevenDayListItem from "../../components/core/NextSevenDayListItem";

import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { getMyListNextSevenDay } from "../../slices/nextSevenDaySlice";

import { VARIABLE_STATUS } from "../../constants/appStatusConstant";

import "./style.css";

const NextSevenDay = () => {
  const [isMyList, setIsMyList] = useState(true);
  const dispatch = useDispatch();

  const nextSevenDayTask = useSelector(
    (state) => state.nextSevenDayReducer.getMyListNextSevenDay
  );

  // console.log(nextSevenDayTask.data.dayOne);

  useEffect(() => {
    if (nextSevenDayTask.status === VARIABLE_STATUS.IDLE) {
      dispatch(getMyListNextSevenDay("2023-02-18"));
    }
  }, []);

  return (
    <div className="NextSevenDay_Page_Block" style={{ paddingTop: "20px" }}>
      <Row className="NextSevenDay_Header_Block">
        <Col>
          <HeaderRouteItem />
        </Col>
      </Row>
      <Row className="NextSevenDay_Content_Block">
        <NextSevenDayListItem todos={nextSevenDayTask.data.dayOne} />
        <NextSevenDayListItem todos={nextSevenDayTask.data.dayTwo} />
        <NextSevenDayListItem todos={nextSevenDayTask.data.dayThree} />
        <NextSevenDayListItem todos={nextSevenDayTask.data.dayFour} />
        <NextSevenDayListItem todos={nextSevenDayTask.data.dayFive} />
        <NextSevenDayListItem todos={nextSevenDayTask.data.daySix} />
        <NextSevenDayListItem todos={nextSevenDayTask.data.daySeven} />
      </Row>
    </div>
  );
};

export default NextSevenDay;
