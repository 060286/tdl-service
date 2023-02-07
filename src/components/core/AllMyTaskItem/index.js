import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { selectTaskDetail } from "../../../slices/allMyTaskSlice";

export default function AllMyTaskItem({ id, title, handleClick }) {
  return (
    <div onClick={() => handleClick(id)}>
      <input type="checkbox" />
      <p>{title}</p>
    </div>
  );
}
