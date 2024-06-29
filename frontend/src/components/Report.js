import React, { useContext, useState } from "react";
import noProfile from "../img/noProfile.png";
import "../css/Report.css";
import { PostContext, UserContext } from "../context/MyContext";

export const Report = (props) => {
  const { postData, font, postWidth, imageHeight, heart, likedBy, profilePic } =
    props;
  const { addComment } = useContext(PostContext);
  const [comment, setComment] = useState();

  return (
    <>
      <div className="report mx-2" style={{ width: postWidth, fontSize: font }}>
        <div className="header" style={{ position: "relative" }}>
          <img
            src={profilePic || noProfile}
            className="rounded-circle"
            style={{ width: "10%", height: "10%" }}
            alt="profile"
          />
          <div className="user-details">
            <div className="username">{postData.postedBy.name}</div>
            <div className="timestamp">Reported on {postData.postedOn}</div>
            <div className="location">
              <strong>{postData.location}</strong>
            </div>
          </div>
        </div>
        <img
          src={postData.photo}
          alt="Report Image"
          style={{ width: "100%", height: imageHeight }}
          className="report-image"
        />
        <div className="interaction-bar">
          <div>
            <ion-icon
              name={`heart${heart.length !== 0 ? "" : "-outline"}`}
              style={{ fontSize: "39px", color: "red" }}
            ></ion-icon>
          </div>
          <div className="mx-3">
            {`${
              likedBy.length !== 0
                ? "raised by " +
                postData.likes.length 
                : "0 likes"
            }`}
          </div>
        </div>
        <div className="caption" style={{ color: "#6b0878" }}>
          {postData.postedBy.name}: {postData.description}
        </div>

        <strong
          type="button"
          data-bs-toggle="modal"
          data-bs-target={`#modal${postData._id}`}
          style={{ color: "grey" }}
        >
          View comments
        </strong>

        <div
          className="modal fade"
          id={`modal${postData._id}`}
          tabIndex="-1"
          aria-labelledby={`modal${postData._id}label`}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`modal${postData._id}label`}>
                  <strong>Comments</strong>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body d-flex">
                <div className="comment-photo" style={{ width: "50%" }}>
                  <img
                    src={postData.photo}
                    alt="report"
                    style={{ width: "100%", height: "60vh" }}
                  />
                </div>
                <div className="comment-section mx-3" style={{ width: "50%" }}>
                  <input
                    type="text"
                    placeholder="Add Your Comment Here..."
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: "89%" }}
                  />
                  <span
                    style={{ cursor: "pointer", fontSize: "25px" }}
                    onClick={() => addComment(postData._id, comment)}
                    className="mx-3"
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </span>
                  <div className="all-comments my-4">
                    {postData.comments.length !== 0 ? (
                      postData.comments.map((comment) => {
                        return (
                          <div key={comment._id}>
                            <p>
                              <strong>{comment.userId.name}:</strong>{" "}
                              {comment.comment}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <p>No Comments</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
