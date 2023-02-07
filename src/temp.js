import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { useDispatch, useSelector } from "react-redux";

import { registerAccount } from "../../slices/accountSlice";

import {
  LESS_THAN_SIX_CHARACTER,
  BETTER_THAN_FIFTEEN_CHARACTER,
  REQUIRED_INPUT,
  LESS_THAN_ONE_CHARACTER,
} from "../../constants/validationConstant";

import "./style.css";
import logo from "../../assets/img/register.jpg";
import { Col, Container, Row, Form, Button } from "react-bootstrap";

export default function Register() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful, errors },
  } = useForm();

  const handleSubmitForm = async (data) => {
    console.log({ data, text: "register" });

    const response = await dispatch(registerAccount(data)).unwrap();
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({
        email: "",
        password: "",
        confirmpassword: "",
        firstname: "",
        lastname: "",
      });
    }
  }, [formState, reset]);

  return (
    <div className="RegisterPage" style={{ height: "100%", width: "100%" }}>
      {/* <form onSubmit={handleSubmit(handleSubmitForm)}>
        <input {...register("username")} type="text" placeholder="username" />
        <input {...register("password")} type="text" placeholder="password" />
        <input type="submit" value="Submit" />
      </form> */}

      <Container fluid>
        <Row>
          <Col style={{ padding: "0px" }}>
            <img
              src={logo}
              style={{
                width: "100%",
                height: "100vh",
                padding: "0px",
                position: "relative",
              }}
            />
          </Col>
          <Col ol style={{ padding: "0px" }}>
            <h2 style={{ paddingLeft: "40%", paddingTop: "10%" }}>
              Register Page
            </h2>

            <div className="RegisterContainer" style={{ height: "100vh" }}>
              <form
                className="RegisterForm"
                onSubmit={handleSubmit(handleSubmitForm)}
                style={{
                  height: "50%",
                  width: "50%",
                  position: "absolute",
                  top: "20%",
                  left: "50%",
                  padding: "0px 0px 0px 20%",
                }}
              >
                <div className="block email-block">
                  <label>Email</label>
                  <input
                    {...register("email", {
                      required: REQUIRED_INPUT,
                      minLength: {
                        value: 6,
                        message: LESS_THAN_SIX_CHARACTER,
                      },
                      maxLength: {
                        value: 50,
                        message: BETTER_THAN_FIFTEEN_CHARACTER,
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "invalid email address",
                      },
                    })}
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Input your email"
                  />
                  {formState.errors.email?.message && (
                    <p>Invalid email address</p>
                  )}
                  <ErrorMessage errors={errors} name="username" />
                </div>
                <div className="password-block block">
                  <label>Password</label>
                  <input
                    {...register("password", {
                      required: REQUIRED_INPUT,
                      minLength: {
                        value: 6,
                        message: LESS_THAN_SIX_CHARACTER,
                      },
                      maxLength: {
                        value: 50,
                        message: BETTER_THAN_FIFTEEN_CHARACTER,
                      },
                    })}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Input your password"
                  />
                  <ErrorMessage errors={errors} name="password" />
                </div>

                <div className="block confirmed-password-block">
                  <label>Confirm Password</label>
                  <input
                    {...register("confirmpassword", {
                      required: REQUIRED_INPUT,
                      minLength: {
                        value: 6,
                        message: LESS_THAN_SIX_CHARACTER,
                      },
                      maxLength: {
                        value: 50,
                        message: BETTER_THAN_FIFTEEN_CHARACTER,
                      },
                    })}
                    type="password"
                    name="confirmpassword"
                    id="confirmpassword"
                    placeholder="Input your confirm password"
                  />
                  <ErrorMessage errors={errors} name="confirmpassword" />
                </div>

                <div className="block first-name-block">
                  <label>First Name</label>
                  <input
                    {...register("firstname", {
                      required: REQUIRED_INPUT,
                      minLength: {
                        value: 1,
                        message: LESS_THAN_ONE_CHARACTER,
                      },
                      maxLength: {
                        value: 50,
                        message: BETTER_THAN_FIFTEEN_CHARACTER,
                      },
                    })}
                    type="text"
                    name="firstname"
                    id="firstname"
                    placeholder="Input your first name"
                  />
                  <ErrorMessage errors={errors} name="firstname" />
                </div>

                <div className="block lastname-block">
                  <label>Last Name</label>
                  <input
                    {...register("lastname", {
                      required: REQUIRED_INPUT,
                      minLength: {
                        value: 1,
                        message: LESS_THAN_ONE_CHARACTER,
                      },
                      maxLength: {
                        value: 50,
                        message: BETTER_THAN_FIFTEEN_CHARACTER,
                      },
                    })}
                    type="text"
                    name="lastname"
                    id="lastname"
                    placeholder="Input your last name"
                  />
                  <ErrorMessage errors={errors} name="lastname" />
                </div>

                <input type="submit" value="Register" />
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
