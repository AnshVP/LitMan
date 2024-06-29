import React, { useContext, useEffect, useState } from "react";
import noProfile from "../img/noProfile.png";
import "../css/Profile.css";
import { Report } from "./Report";
import { PostContext, UserContext } from "../context/MyContext";
import { useNavigate } from "react-router-dom";
import { ToastContext } from "../context/MyContext";

export const Profile = () => {
  const context = useContext(ToastContext);
  const { getUser, userData } = useContext(UserContext);
  const { reports, getReports, editLikes, addComment, deletePost } = useContext(PostContext);
  const { error, success } = context;
  const [allReports, setAllReports] = useState([]);
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const reportProfilePic = async () => {
    const url = "https://api.cloudinary.com/v1_1/letsconnect/image/upload";
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "social-app");
    data.append("cloud_name", "letsconnect");

    const fetched = await fetch(url, {
      method: "post",
      body: data,
    });
    const parsed = await fetched.json();
    setImageUrl(parsed.url);
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
    } else {
      if (image) {
        reportProfilePic();
      }
    }
  }, [image]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
    } else {
      if (imageUrl) {
        async function editProfile() {
          const response = await fetch(
            `http://localhost:8000/api/user/editprofile`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({ profilePic: imageUrl }),
            }
          );
          const json = await response.json();
          if (!json.errors) {
            success("Profile Succesfully Updated");
          } else if (json.errors) {
            error(json.errors[0].msg);
          }
        }
        editProfile();
      }
      setImageUrl("");
      getUser();
      const fetchreports = async () => {
        const response = await fetch(
          "http://localhost:8000/api/post/fetchallreports",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        const allReports = await response.json();
        setAllReports(allReports);
      };
      fetchreports();
    }
  }, [imageUrl, deletePost]);

  return (
    <div className="d-flex justify-content-center">
      <div className="profile" style={{ zIndex: 100, width: "100%" }}>
        <div
          className="container d-flex profile-details"
          style={{
            background: "white",
            boxShadow: "0px 20px 10px grey",
            zIndex: 100,
          }}
        >
          <div className="profile-desc d-flex ms-5">
            <label
              className="d-flex flex-column "
              style={{ cursor: "pointer" }}
            >
              <img
                src={userData.profilePic || noProfile}
                className="rounded-circle mx-auto"
                alt="profile"
              />
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                style={{
                  position: "absolute",
                  opacity: "0",
                }}
              />
              <strong className="mx-auto" style={{ display: "block" }}>
                {userData.name}
              </strong>
            </label>
          </div>

          <div className="edit-icon">
            <i
              className="fa-solid fa-user-pen fa-beat-fade"
              style={{ color: "blue" }}
            ></i>
          </div>

          <div className="container my-4">
            <div className="d-flex justify-content-around">
              <div className="text-center">
                <div>
                  <>{allReports.length}</>
                </div>
                <strong>Reports</strong>
              </div>
              <div className="text-center">
                
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column">
          <div className="mx-auto my-4" style={{ color: "#3681b4" }}>
            <h1>My Reports</h1>
            <div style={{ border: "2px solid black" }}></div>
          </div>
          <div className="largeDevice justify-content-center">
            {allReports.map((data) => {
              let liked = data.severity.filter((id) => id === userData._id);
              return (
                <div key={data._id}>
                  <div
                    id={`${data._id}1`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      document.getElementById(`${data._id}2`).style.visibility =
                        "visible";
                      document.querySelector(".profile").style.zIndex = "300";
                      document.body.style.overflowY = "hidden";
                    }}
                  >
                    <Report
                      postData={data}
                      postWidth="330px"
                      font="15px"
                      imageHeight="220px"
                      heart={liked}
                      likedBy={
                        data.severity.length !== 0
                          ? data.severity.length === 1
                            ? [data.severity[0].name]
                            : [data.severity[0].name, data.severity[1].name]
                          : []
                      }
                      profilePic={data.postedBy.profilePic}
                    />
                  </div>

                  <div
                    className="view-post d-flex justify-content-evenly"
                    id={`${data._id}2`}
                  >
                    <label
                      className="close-button"
                      onClick={() => {
                        document.getElementById(
                          `${data._id}2`
                        ).style.visibility = "hidden";
                        document.querySelector(".profile").style.zIndex = "100";
                        document.body.style.overflowY = "auto";
                      }}
                    >
                      &times;
                    </label>
                    <div>
                      <Report
                        postData={data}
                        postWidth="500px"
                        font="20px"
                        imageHeight="57vh"
                        heart={liked}
                        likedBy={
                          data.severity.length !== 0
                            ? data.severity.length === 1
                              ? [data.severity[0].name]
                              : [data.severity[0].name, data.severity[1].name]
                            : []
                        }
                        profilePic={data.postedBy.profilePic}
                      />
                    </div>
                    <div style={{ margin: "27vh 0" }}>
                      <i
                        className="fa-solid fa-trash fa-bounce"
                        style={{
                          color: "red",
                          fontSize: "30vh",
                          opacity: "0.6",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          deletePost(data._id);
                          success("Report Deleted Successfully!!");
                          document.getElementById(
                            `${data._id}2`
                          ).style.visibility = "hidden";
                          document.querySelector(".profile").style.zIndex =
                            "100";
                          document.body.style.overflowY = "auto";
                        }}
                      ></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="smallDevice">
            {allReports.map((data) => {
              let liked = data.severity.filter((id) => id === userData._id);
              return (
                <div key={data._id} className="mx-auto my-1">
                  <div
                    id={`${data._id}s1`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      document.getElementById(
                        `${data._id}s2`
                      ).style.visibility = "visible";
                      document.querySelector(".profile").style.zIndex = "300";
                      document.body.style.overflowY = "hidden";
                    }}
                  >
                    <img
                      className="postImage"
                      src={data.photo}
                      alt="report"
                      style={{
                        width: "30vw",
                        padding: "5px",
                        background: "white",
                      }}
                    />
                  </div>
                  <div className="view-post" id={`${data._id}s2`}>
                    <label
                      className="close-button"
                      onClick={() => {
                        document.getElementById(
                          `${data._id}s2`
                        ).style.visibility = "hidden";
                        document.querySelector(".profile").style.zIndex = "100";
                        document.body.style.overflowY = "auto";
                      }}
                    >
                      &times;
                    </label>
                    <div className="d-flex flex-column">
                      <div className="mx-auto mt-5">
                        <i
                          className="fa-solid fa-trash fa-bounce"
                          style={{
                            color: "red",
                            fontSize: "15vh",
                            opacity: "0.6",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            deletePost(data._id);
                            success("Report Deleted Successfully!!");
                            document.getElementById(
                              `${data._id}s2`
                            ).style.visibility = "hidden";
                            document.querySelector(".profile").style.zIndex =
                              "100";
                            document.body.style.overflowY = "auto";
                          }}
                        ></i>
                      </div>
                      <div className="mx-auto">
                        <Report
                          postData={data}
                          postWidth="70vw"
                          font="16px"
                          imageHeight="45vh"
                          heart={liked}
                          likedBy={
                            data.severity.length !== 0
                              ? data.severity.length === 1
                                ? [data.severity[0].name]
                                : [data.severity[0].name, data.severity[1].name]
                              : []
                          }
                          profilePic={data.postedBy.profilePic}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
