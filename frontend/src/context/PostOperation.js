import { useState } from "react";
import { PostContext } from "./MyContext";

const PostOperation = (props) => {
  const [reports, setReports] = useState([]);

  const getReports = async () => {
    const response = await fetch(
      "http://localhost:8000/api/post/fetchallrepost",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );
    const data = await response.json();
    setReports(data);
  };

  const editLikes = async (postId) => {
    await fetch("http://localhost:8000/api/post/likes", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ postId }),
    });
    getReports();
  };

  const addComment = async (postId, comment) => {
    await fetch("http://localhost:8000/api/post/addcomment", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ postId, comment }),
    });
    getReports();
  };

  const deletePost = async (postId) => {
    await fetch(`http://localhost:8000/api/post/deletepost/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    getReports();
  };

  return (
    <PostContext.Provider value={{ reports, getReports, editLikes, addComment, deletePost }}>
      {props.children}
    </PostContext.Provider>
  );
};

export default PostOperation;
