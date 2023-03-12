import React from "react";
import NextSevenDayItem from "../NextSevenDayItem";

import "./style.css";

const NextSevenDayListItem = ({ todos }) => {
  console.log(todos);

  const items = todos?.map((todo) => {
    return <NextSevenDayItem title={todo.title} />;
  });

  return (
    <div className="NextSevenDayItemListBlock">
      <div className="NextSevenDayItemTitle">
        <div className="DayOfWeek">Todo</div>
        <div className="Day">Wednesday</div>
      </div>
      <div className="NextSevenDayItemList">{items}</div>
      <div>Add Task</div>
    </div>
  );
};

export default NextSevenDayListItem;
