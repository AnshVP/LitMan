import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Report } from "./Report";
import { PostContext, UserContext } from "../context/MyContext";
import "../css/Sidebar.css";
import noProfile from "../img/noProfile.png";
import like from "../img/like.gif";
import unlike from "../img/unlike.gif";

export const Home = () => {
  const { getUser, userData } = useContext(UserContext);
  const { reports, getReports, editLikes } = useContext(PostContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
    } else {
      getUser();
      getReports();
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
    } else {
      getUser();
    }
  }, []);

  function openNav() {
    if (window.innerWidth > 1200) {
      document.getElementById("notification-section").style.position = "fixed";
      document.getElementById("notification-section").style.width = "340px";
    } else if (window.innerWidth > 950) {
      document.getElementById("notification-section").style.position = "sticky";
      document.getElementById("notification-section").style.width = "400px";
    } else if (window.innerWidth > 800) {
      document.getElementById("notification-section").style.position = "sticky";
      document.getElementById("notification-section").style.width = "300px";
    } else if (window.innerWidth < 800) {
      document.getElementById("notification-section").style.position = "fixed";
      document.getElementById("notification-section").style.zIndex = "200";
      document.getElementById("notification-section").style.width = "370px";
      document.getElementById("notification-section").style.backdropFilter =
        "blur(5px)";
    }

    document.getElementById("main").style.display = "none";
  }

  function closeNav() {
    document.getElementById("notification-section").style.width = "0";
    document.getElementById("main").style.display = "block";
  }

  return (
    <>
      <div className="home d-flex">
        <div id="notification-section" className="notification-section">
          <h5 className="text-center mb-4" style={{ color: "white" }}>
            Notifications
          </h5>
          <a className="closebtn" onClick={closeNav}>
            ×
          </a>
          <ul
            className="list-group list-group-flush mx-2"
            style={{ height: "80vh" }}
          >
          </ul>
        </div>

        <div
          id="main"
          style={
            window.innerWidth < 800
              ? { position: "absolute", top: "0%", left: "50vw" }
              : {}
          }
        >
          <button className="openbtn" onClick={openNav}>
            {window.innerWidth >= 1200
              ? "☰ Notification Section"
              : "☰ Notifications"}
          </button>
        </div>
        <div className="mx-auto" style={{ zIndex: "100" }}>
          {reports.length !== 0
            ? reports.map((data) => {
                let liked = data.likes.filter(
                  (likedBy) => likedBy._id === userData._id
                );
                return (
                  <div
                    key={data._id}
                    className="mx-auto"
                    onDoubleClick={() => {
                      editLikes(data._id);
                      if (liked.length === 0) {
                        document.getElementById(
                          `${data._id}like`
                        ).style.display = "block";
                        setTimeout(() => {
                          document.getElementById(
                            `${data._id}like`
                          ).style.display = "none";
                        }, 1500);
                      } else {
                        document.getElementById(
                          `${data._id}unlike`
                        ).style.display = "block";
                        setTimeout(() => {
                          document.getElementById(
                            `${data._id}unlike`
                          ).style.display = "none";
                        }, 1500);
                      }
                    }}
                    style={{ position: "relative" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        position: "absolute",
                        top: "25%",
                        left: "35%",
                        display: "none",
                      }}
                      id={`${data._id}like`}
                    >
                      <img
                        src={like}
                        width="30%"
                        style={{
                          textAlign: "center",
                        }}
                        alt="liked"
                      ></img>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        position: "absolute",
                        top: "25%",
                        left: "35%",
                        display: "none",
                      }}
                      id={`${data._id}unlike`}
                    >
                      <img
                        src={unlike}
                        width="30%"
                        style={{
                          textAlign: "center",
                        }}
                        alt="disliked"
                      ></img>
                    </div>
                    <Report
                      postData={data}
                      heart={liked}
                      postWidth="450px"
                      font="16px"
                      imageHeight="350px"
                      likedBy={
                        data.likes.length !== 0
                          ? data.likes.length === 1
                            ? [data.likes[0].name]
                            : [data.likes[0].name, data.likes[1].name]
                          : []
                      }
                      profilePic={data.postedBy.profilePic}
                    />
                  </div>
                );
              })
            : ""}
        </div>
        
      </div>
    </>
  );
};
