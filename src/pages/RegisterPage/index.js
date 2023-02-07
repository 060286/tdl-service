import React from "react";

import { registerAccount } from "../../slices/accountSlice";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router";

import { timeout } from "../../extensions/delayExtension";

import "./style.css";

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (user) => {
    const response = await dispatch(registerAccount(user)).unwrap();

    if (response.isSuccess) {
      await timeout(1000);
      navigate("/login");
    }
  };

  return (
    <div className="registerblock">
      <div className="container">
        <div className="title">Registration</div>
        <form onSubmit={handleSubmit(handleRegister)}>
          <div className="user-details">
            <div className="input-box">
              <span className="details">Full name</span>
              <input
                {...register("firstname")}
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="input-box">
              <span className="details">Last name</span>
              <input
                {...register("lastname")}
                type="text"
                placeholder="Enter your lastname"
                required
              />
            </div>

            <div className="input-box">
              <span className="details">Email</span>
              <input
                {...register("email")}
                type="text"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="input-box">
              <span className="details">Phone number</span>
              <input
                {...register("phoneNumber")}
                type="text"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="input-box">
              <span className="details">Password</span>
              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="input-box">
              <span className="details">Confirm Password</span>
              <input
                {...register("confirmpassword")}
                type="password"
                placeholder="Enter your confirm password"
                required
              />
            </div>
          </div>

          <div className="button">
            <input type="submit" value="Register" />
          </div>
        </form>
      </div>
    </div>
  );
}
