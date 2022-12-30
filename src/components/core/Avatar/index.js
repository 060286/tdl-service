import React from "react";
import "./style.css";

import { Button } from "react-bootstrap";

export default function Avatar() {
  return (
    <>
      <img
        src="https://www.w3schools.com/howto/img_avatar.png"
        alt="avatar_img"
        className="tdl__avatar"
      />
      <p>Name User</p>
      <p>Workspace Account</p>
      <Button>React Button</Button>
    </>
  );
}
