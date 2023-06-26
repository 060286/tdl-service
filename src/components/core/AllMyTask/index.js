import React from "react";
import AllMyTaskItem from "../AllMyTaskItem";
import { useDispatch } from "react-redux";
import { getTaskById } from "../../../slices/allMyTaskSlice";
import { updateTaskDetail } from "../../../slices/allMyTaskSlice";
import "./style.css";

export default function AllMyTask({ tasks }) {
  const [today, tomorrow, upcoming] = ["Today", "Tomorrow", "Upcoming"];
  const data = tasks.data;
  const { allTaskToday, allTaskTomorrow, allTaskUpComming } = tasks.data;
  const dispatch = useDispatch();

  const handleClick = async (id) => {
    const response = await dispatch(getTaskById({ id: id })).unwrap();

    dispatch(updateTaskDetail({ data: response }));
  };

  return (
    <div className="AllMyTask">
      <p>{today}</p>
      {allTaskToday?.map((task) => {
        return (
          <AllMyTaskItem
            handleClick={handleClick}
            id={task.id}
            title={task.title}
            key={task.id}
          />
        );
      })}
      <p>{tomorrow}</p>
      {allTaskTomorrow?.map((task) => {
        return (
          <AllMyTaskItem
            handleClick={handleClick}
            id={task.id}
            title={task.title}
            key={task.id}
          />
        );
      })}
      <p>{upcoming}</p>
      {allTaskUpComming?.map((task) => {
        return (
          <AllMyTaskItem
            handleClick={handleClick}
            id={task.id}
            title={task.title}
            key={task.id}
          />
        );
      })}
    </div>
  );
}
