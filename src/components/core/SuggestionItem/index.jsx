import React from "react";

import { Lock, PlusCircle } from "react-bootstrap-icons";

import "./style.css";

export default function SuggestionItem({ breadcrumb, title, timeline }) {
  return (
    <div className="SuggestionItem">
      <div className="Suggestion__Breadcrumb">
        <Lock /> - {breadcrumb}
      </div>
      <div className="Suggestion__TaskName">
        <PlusCircle /> {title}
      </div>
      <div className="Suggestion__Timeline">{timeline}</div>
    </div>
  );
}
