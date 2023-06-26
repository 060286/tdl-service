import React from "react";

import PropTypes from "prop-types";

const MyDayWelcomeName = ({ username, qoutes, author }) => {
  return (
    <div className="MyDayWelComeName">
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
          color: "#767474",
          opacity: '0.5',
          marginTop: "-2%",
        }}
      >
        {qoutes}
      </div>
    </div>
  );
};

MyDayWelcomeName.propTypes = {
  username: PropTypes.string,
  qoutes: PropTypes.string,
};

export default MyDayWelcomeName;
