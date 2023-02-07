import React from "react";

import "./style.css";

import { Link } from "react-router-dom";
import { House } from "react-bootstrap-icons";

export default function SideBarItem(props) {
  const { name, to } = props;
  return (
    <div className="SideBarItem">
      <Link to={to}>
        <House />
        <p>{name}</p>
      </Link>
    </div>
  );
}
