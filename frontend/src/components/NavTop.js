import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { NavBottom } from "./NavBottom";

export const NavTop = (props) => {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };
  return (
    <>
      <header style={{zIndex:"100"}}>
        <div className="navigation">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1 logo">GarbageGo</span>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-end "
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav">
                  
                  {localStorage.getItem("token") ? (
                    <li className="nav-item">
                      <div
                        className="nav-link"
                        onClick={logOut}
                        style={{ fontSize: "18px", cursor: "pointer" }}
                      >
                        <strong>Log Out</strong>
                      </div>
                    </li>
                  ) : (
                    <>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="/signin"
                          style={{ fontSize: "18px" }}
                        >
                          <strong>Sign In</strong>
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          className="nav-link"
                          to="/signup"
                          style={{ fontSize: "18px" }}
                        >
                          <strong>Sign Up</strong>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {localStorage.getItem("token") && <NavBottom />}
      </header>
    </>
  );
};
