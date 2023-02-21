import React from "react";

import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";

import { loginAccount, getUserInfo } from "../../../slices/accountSlice";
import { setToken, setUserInfo } from "../../../slices/accountSlice";
import { useNavigate } from "react-router";
import { timeout } from "../../../extensions/delayExtension";

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const dispath = useDispatch();
  const navigate = useNavigate();

  const handleLoginClick = async (data) => {
    const res = await dispath(loginAccount(data)).unwrap();
    const userInfo = await dispath(getUserInfo(res.data.token)).unwrap();

    if (res.statusCode === 200 || res.isSuccess === true) {
      const { token } = res.data;

      localStorage.setItem("token", JSON.stringify(token));

      console.log("navigate");

      navigate("/myday");
    } else {
      if (res.statusCode === 401) {
        alert("Please input a correct username/password");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLoginClick)}>
      <div className="txt_field">
        <input {...register("username")} type="text" required />
        <span></span>
        <label>Username</label>
      </div>

      <div className="txt_field">
        <input {...register("password")} type="password" required />
        <span></span>
        <label>Password</label>
      </div>

      <div className="pass">Forgot Password?</div>
      <input type="submit" value="Login" />
      <div className="signup_link">
        Not a member <a href="#">Sign up</a>
      </div>
    </form>
  );
}
