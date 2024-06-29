import React, { useContext, useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/CreateReport.css";
import { useNavigate } from "react-router-dom";
import { ToastContext, UserContext } from "../context/MyContext";

export const CreateReport = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoder = useRef(null);
  const { getUser, userData } = useContext(UserContext);
  const context = useContext(ToastContext);
  const { error, success } = context;
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize the map
    mapRef.current = L.map("map").setView([51.505, -0.09], 13);

    // Load and display tile layers on the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapRef.current);

    // Initialize the Google Maps Geocoder
    geocoder.current = new window.google.maps.Geocoder();

    // Add a click event listener on the map to get coordinates
    mapRef.current.on("click", (e) => {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }
      markerRef.current = L.marker(e.latlng).addTo(mapRef.current);
      displayResult(e.latlng.lat, e.latlng.lng);
    });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
    }
    getUser();
  }, []);

  useEffect(() => {
    if (imageUrl) {
      async function reportData() {
        console.log(location);
        const date = new Date();
        const response = await fetch(
          "http://localhost:8000/api/post/createreport",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify({
              photo: imageUrl,
              description: description,
              location: location,
              postedOn: date.toLocaleString(),
            }),
          }
        );
        const json = await response.json();
        if (!json.errors) {
          navigate("/");
          success("Succesfully Posted");
        } else if (json.errors) {
          error(json.errors[0].msg);
        }
      }
      reportData();
    }
  }, [imageUrl]);

  const getCoordinates = () => {
    const address = document.getElementById("address").value;
    geocoder.current.geocode({ address }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        const latitude = location.lat();
        const longitude = location.lng();
        mapRef.current.setView([latitude, longitude], 13);
        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current);
        }
        markerRef.current = L.marker([latitude, longitude]).addTo(
          mapRef.current
        );
        displayResult(latitude, longitude);
      } else {
        handleError(status);
      }
    });
  };

  const displayResult = (lat, lng) => {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<p>Latitude: ${lat}</p><p>Longitude: ${lng}</p>`;
  };

  const handleError = (status) => {
    const resultDiv = document.getElementById("result");
    const errorMessage = `Geocode was not successful for the following reason: ${status}`;
    resultDiv.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
  };

  const postDetails = async (e) => {
    e.preventDefault();
    if (!image) {
      error("Kindly Upload the Photo!!");
    } else {
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
    }
  };

  const loadFile = function (event) {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };
  return (
    <>
      <div className="mx-auto my-5 row d-flex justify-content-center">
        <div className="box col-md-6">
          <h2>Create a New Post</h2>
          <form onSubmit={(e) => postDetails(e)}>

            <div className="form-group">
              <label
                htmlFor="img"
                className="btn btn-warning my-3"
                style={{
                  color: "white",
                  width: "40%",
                  margin: "auto",
                }}
              >
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                id="img"
                name="img"
                onChange={(e) => {
                  loadFile(e);
                  setImage(e.target.files[0]);
                }}
                style={{
                  display: "none",
                }}
              />
              <img
                src="https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                id="output"
                alt="report"
                style={{ objectFit: "cover", width: "90%" }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="caption">Description: </label>
              <textarea
                id="description"
                name="description"
                rows="2"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
            </div>
            <div>
              <div className="form-group">
                <label htmlFor="address">
                  Enter Address and Select Location on Map:{" "}
                </label>
                <input type="text" id="address" placeholder="Enter address" />
                <button className="btn btn-primary" style={{ fontSize: "21px", fontWeight: "bolder", marginTop: "30px" }} onClick={getCoordinates}>
                  Get Coordinates
                </button>
              </div>
              <div id="map" style={{ height: "400px", width: "100%" }}></div>
              <div id="result"></div>
            </div>

            <button className="btn btn-primary mt-3" type="submit">
              <span style={{ fontSize: "21px", fontWeight: "bolder" }}>
                Create Report
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
