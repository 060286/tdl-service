import React from "react";

import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { House, Calendar, ListTask } from "react-bootstrap-icons";
import "./style.css";

const SideBar = ({ username }) => {
  const userInfo = useSelector((state) => state.accountReducer.userInfo);
  const img =
    userInfo !== null
      ? "https://www.w3schools.com/howto/img_avatar.png"
      : // ? userInfo.img
        "https://www.w3schools.com/howto/img_avatar.png";

  console.log({ userInfo });

  const routeItem = {
    task: "tasks",
    nextsevenday: "nextsevenday",
    myday: "myday",
  };

  return (
    <div className="SideBar">
      <div className="SideBarUserInto">
        <div className="Avatar">
          <img src={img} />
        </div>
        <div className="UserInfo" style={{ marginLeft: "10px" }}>
          <p>{userInfo !== null ? userInfo.fullName : ""}</p>
          <p>{userInfo !== null ? userInfo.email : ""}</p>
        </div>
      </div>

      <div className="SideBarGroupItem">
        <div className="SideBarItem">
          <div className="SideBarItem__Block">
            <House />
            <Link to={routeItem.myday}>My Day</Link>
          </div>
        </div>
        <div className="SideBarItem">
          <div className="SideBarItem__Block">
            <Calendar />
            <Link to="nextsevenday">Next 7 Days</Link>
          </div>
        </div>
        <div className="SideBarItem">
          <div className="SideBarItem__Block">
            <ListTask />
            <Link to="tasks">All My Tasks</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
