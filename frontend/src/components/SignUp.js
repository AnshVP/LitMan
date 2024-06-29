import React, { useContext, useState } from "react";
import "../css/Sign.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContext } from "../context/MyContext";

export const SignUp = () => {
  const context = useContext(ToastContext);
  const { error, success } = context;
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleClick = async (e) => {
    const response = await fetch("http://localhost:8000/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        role: "resident"
      }),
    });
    const json = await response.json();
    if (json.success) {

      localStorage.setItem("token", json.authtoken);
      navigate("/");
      success("Account Successfully Created!!");
    } else {
      error(json.errors[0].msg);
    }
  };
  return (
    <>
      <section className="my-5">
        <div className="sign">
          <div className="content">
            <div className="logo" style={{ color: "white" }}>
              GarbageGo
            </div>
            <div
              style={{
                color: "rgb(255, 0, 162)",
                fontSize: "30px",
                fontWeight: "500",
              }}
            >
              Sign Up
            </div>

            <div className="form">
              <div className="inputBox">
                <input type="email" name="email" onChange={onChange} required />
                <i>Email</i>
              </div>
              <div className="inputBox">
                <input
                  type="text"
                  name="name"
                  onChange={onChange}
                  minLength={3}
                  required
                />
                <i>Username</i>
              </div>
              <div className="inputBox">
                <input
                  type="password"
                  name="password"
                  onChange={onChange}
                  minLength={5}
                  required
                />
                <i>Password</i>
              </div>
              <div className="inputBox">
                <input
                  type="submit"
                  onClick={handleClick}
                  value="Create Account"
                />
              </div>
            </div>

            <div className="links d-flex">
              <div style={{ color: "white", fontWeight: "600" }}>
                Already have an account?
              </div>
              <Link
                to="/signin"
                style={{ color: "rgb(255, 0, 162)", fontWeight: "600" }}
                className="mx-3"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
