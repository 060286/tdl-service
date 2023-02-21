import React from "react";

import PropTypes from "prop-types";

const MyDayWelcomeName = ({ username, qoutes, author }) => {
  return (
    <div className="MyDayWelComeName" style={{ width: "100%", height: "100%" }}>
      <p
        style={{
          fontSize: "26px",
          fontWeight: "700",
          lineHeight: "36px",
        }}
      >
        Welcome to Todo Management System, {username}
        <span style={{ color: "#0083FF", fontSize: "30px" }}>.</span>
      </p>
      <div
        className="MyDayQuotes"
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color: "#d8d8d8",
          marginTop: "-3%",
        }}
      >
        {qoutes} {author}
      </div>
    </div>
  );
};

MyDayWelcomeName.propTypes = {
  username: PropTypes.string,
  qoutes: PropTypes.string,
};

export default MyDayWelcomeName;
