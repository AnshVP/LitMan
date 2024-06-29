import "./App.css";
import { SignIn } from "./components/SignIn";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignUp } from "./components/SignUp";
import { Home } from "./components/Home";
import { NavTop } from "./components/NavTop";
import { Profile } from "./components/Profile";
import { useState } from "react";
import { Background } from "./components/Background";
import { CreateReport } from "./components/CreateReport";
import Toast from "./context/Toast";
import UserData from "./context/UserData";
import PostOperation from "./context/PostOperation";

function App() {
  const api_key = process.env.REACT_APP_NEWS_API;
  const [bar, setBar] = useState(10);
  const setProgress = (progress) => {
    setBar(progress);
  };
  
  return (
    <Toast>
      <UserData>
        <PostOperation>
            <BrowserRouter>
              <Background />
              <NavTop />
              
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/signin" element={<SignIn />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path="/profile" element={<Profile />} />
                <Route exact path="/addreport" element={<CreateReport />} />
                
              </Routes>
              <div style={{ height: "15vh" }}></div>
            </BrowserRouter>
        </PostOperation>
      </UserData>
    </Toast>
  );
}

export default App;
