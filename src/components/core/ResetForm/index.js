import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Snackbar, IconButton, Button, Slide } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";

export default function ResetForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [errorMessage, setErrowMessage] = useState("Your new password and confirm password is not match");

  const handleResetPassword = async (data) => {
    validateSubmit(data);

    const url = `https://localhost:44334/api/v1/user/reset-password`;

    try {
        const response = await axios({
            url: url,
            method: "post",
            data: {
              email: data.email,
              newPassword: data.newpassword,
              confirmPassword: data.confirmpassword,
            },
          });

        if(response.data.isSuccess) {
            navigate('/login');
        }
    } catch (error) {
        setErrowMessage(error.response.data.data[0].message);
        setShow(true);
    }  
  };

  const validateSubmit = (data) => {
    if (data.newpassword !== data.confirmpassword) {
      setShow(true);
    }
  };

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  const handleCloseSnackbar = () => {
    setShow(false);
  };

  return (
    <form onSubmit={handleSubmit(handleResetPassword)}>
      <Snackbar
        open={show}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={errorMessage}
        TransitionComponent={TransitionLeft}
      ></Snackbar>
      <div className="txt_field">
        <input {...register("email")} type="text" required />
        <span></span>
        <label>Email/UserName</label>
      </div>

      <div className="txt_field">
        <input {...register("newpassword")} type="password" required />
        <span></span>
        <label>New Password</label>
      </div>

      <div className="txt_field">
        <input {...register("confirmpassword")} type="password" required />
        <span></span>
        <label>Confirmed Password</label>
      </div>

      <div className="pass">Forgot Password?</div>
      <input type="submit" value="Reset Password" />
      <div className="signup_link">
        Not a member <a href="/login">Sign up</a>
      </div>
    </form>
  );
}
