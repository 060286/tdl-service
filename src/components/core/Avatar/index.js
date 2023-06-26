import React from "react";
import "./style.css";

import { useSelector } from "react-redux";

export default function Avatar() {
  const userInfo = useSelector((state) => {
    return state.accountReducer.userInfo;
  });

  return (
    <div className="avatar">
      <img
        src="https://www.w3schools.com/howto/img_avatar.png"
        alt="avatar__img"
        className="avatar__img"
      />
      <div className="avatar__info">
        <p className="avatar__user-name">Name User</p>
        <p className="avatar__acount-type">Workspace Account</p>
      </div>
    </div>
  );
}
