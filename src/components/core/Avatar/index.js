import React from "react";
import "./style.css";

export default function Avatar() {
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
