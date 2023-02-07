import React from "react";

import "./style.css";

import LoginForm from "../../components/core/LoginForm";

export default function LoginPage() {
  return (
    <div className="loginblock">
      <div className="center">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
