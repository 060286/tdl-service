import React, { useEffect, useState } from "react";

import { VARIABLE_STATUS } from "../../../constants/appStatusConstant";
import { Lock, PlusCircle } from "react-bootstrap-icons";

import { useDispatch, useSelector } from "react-redux";
import { removeSuggestion, addNewTodo } from "../../../slices/todoSlice";

import "./style.css";

export default function SuggestionItem({ data }) {
  const dispatch = useDispatch();

  const handleSuggestionItemClick = async (todoItem) => {
    try {
      const { id, title } = todoItem;

      dispatch(removeSuggestion(id));

      await dispatch(addNewTodo({ title: title })).unwrap();
    } catch (error) {}
  };

  return (
    <div
      className="SuggestionItem"
      onClick={() => handleSuggestionItemClick(data)}
    >
      <div className="Suggestion__Breadcrumb">
        <Lock /> - {data.breadcrumb}
      </div>
      <div className="Suggestion__TaskName">
        <PlusCircle /> {data.title}
      </div>
      <div className="Suggestion__Timeline">{data.dateRemind}</div>
    </div>
  );
}
