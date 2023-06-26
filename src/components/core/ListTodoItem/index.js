import React from "react";

import "./style.css";

export default function ListTodoItem({ todos }) {
  return (
    <div className="TodoList_Block">
      {todos?.map((todo) => {
        return <li key={todo.id}>{todo.title}</li>;
      })}
    </div>
  );
}
