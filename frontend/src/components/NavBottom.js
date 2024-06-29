import React, { useContext } from "react";
import "../css/NavBottom.css";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import UserData from "../context/UserData";
import { UserContext } from "../context/MyContext";

export const NavBottom = () => {
  
  const { getUser, userData } = useContext(UserContext);
  let location = useLocation();

  useEffect(() => {
      getUser();
  }, []);

  useEffect(() => {
    const list = document.querySelectorAll(".list");
    const home = document.getElementById("home");
    const search = document.getElementById("search");
    const profile = document.getElementById("profile");
    const chat = document.getElementById("chat");
    const post = document.getElementById("addpost");
    const news = document.getElementById("news");
    const navs = [search, home, profile, chat, post, news];
    list.forEach((li) => li.classList.remove("active"));
    if (location.pathname === "/") {
      home.classList.add("active");
    }
    for (let i of navs) {
      if (location.pathname === "/" + i.id) {
        i.classList.add("active");
      }
    }
  }, [location]);

  return (
    <>
      <div className="nav">
        <ul>
          <li className="list" id="search" style={{ "--clr": "#0f3741" }}>
            <Link to="/search">
              <span className="icon">
                <ion-icon name="search-outline"></ion-icon>
              </span>
            </Link>
          </li>
          <li className="list" id="home" style={{ "--clr": "#f44336"}}>
            <Link to="/">
              <span className="icon" >
                <ion-icon name="home-outline"></ion-icon>
              </span>
            </Link>
          </li>
          <li className="list" id="profile" style={{ "--clr": "#ffa117" }}>
            <Link to="/profile">
              <span className="icon">
                <ion-icon name="person-outline"></ion-icon>
              </span>
            </Link>
          </li>
          <li className="list" id="chat" style={{ "--clr": "#0fc70f" }}>
            <Link to="/chat">
              <span className="icon">
                <ion-icon name="chatbubble-outline"></ion-icon>
              </span>
            </Link>
          </li>
          <li className="list" id="news" style={{ "--clr": "#2196f3" }}>
            <Link to="/news">
              <span className="icon">
                <ion-icon name="newspaper-outline"></ion-icon>
              </span>
            </Link>
          </li>
          
          <li className="list" id="addpost" style={{ "--clr": "#b145e9" }}>
            {userData.role?
            <Link to="/addreport">
              <span className="icon">
                <ion-icon name="add-circle-outline"></ion-icon>
              </span>
            </Link>:[]}
          </li>
        </ul>
      </div>

      <script
        type="module"
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
      ></script>
      <script
        noModule
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
      ></script>
    </>
  );
};
