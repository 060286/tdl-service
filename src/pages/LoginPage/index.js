import React, { useEffect } from "react";

import { useNavigate } from "react-router";
import "./style.css";

import LoginForm from "../../components/core/LoginForm";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";

export default function LoginPage() {
  const navigate = useNavigate();

  const isAuth = getTokenFromLocalStorage() != null;

  useEffect(() => {
    if (isAuth) {
      navigate("/myday");
    }
  }, [isAuth]);

  return (
    <div className="loginblock">
      <div className="center">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
