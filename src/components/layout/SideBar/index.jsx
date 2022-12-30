import React from "react";
import Avatar from "../../core/Avatar";
import SideBarItem from "../../core/SideBarItem";

export default function SideBar() {
  const sideBarItems = [
    {
      id: 1,
      to: "/",
      name: "Home",
    },
    {
      id: 2,
      to: "/task/next-seven-days",
      name: "Next 7 Days",
    },
    {
      id: 3,
      to: "/task/all-task",
      name: "All Task",
    },
  ];

  return (
    <div className="sidebar">
      <Avatar />
      <br />
      <hr />
      <ul className="sidebar__items">
        {sideBarItems.map((sideBarItem) => {
          return (
            <SideBarItem
              key={sideBarItem.id}
              name={sideBarItem.name}
              to={sideBarItem.to}
            ></SideBarItem>
          );
        })}
      </ul>
    </div>
  );
}
