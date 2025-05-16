import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Feed from "./pages/Feed";
import CreateMeme from "./pages/CreateMeme";
import Dashboard from "./pages/Dashboard";
import LeaderBoard from "./pages/LeaderBoard";

function App() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="pt-16 flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/create" element={<CreateMeme />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
}

export default App;
