import React, { useContext, useEffect, useState } from "react";
import "../css/Sign.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContext } from "../context/MyContext";

export const SignIn = () => {
  const context = useContext(ToastContext);
  const { error, success } = context;
  const [credentials, setCredentials] = useState({ name: "", password: "" });
  const navigate = useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const handleClick = async (e) => {
    const response = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: credentials.name,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("token", json.authtoken);
      navigate("/");
      success("Succesfully Logged In!!");
    } else {
      error(json.msg);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
    } else {
      navigate("/");
    }
  }, []);
  return (
    <>
      <section className="my-5">
        <div className="sign">
          <div className="content">
            <div className="logo" style={{ color: "white" }}>
              Let'sConnect
            </div>
            <div
              style={{
                color: "rgb(255, 0, 162)",
                fontSize: "30px",
                fontWeight: "500",
              }}
            >
              Sign In
            </div>
            <div className="form">
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
              <div className="links">
                <a href="/">Forgot Password</a>
                <Link to="/signup">Signup</Link>
              </div>
              <div className="inputBox">
                <input type="submit" onClick={handleClick} value="Login" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
