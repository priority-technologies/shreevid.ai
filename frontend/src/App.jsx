import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage";

import Signup from "./pages/Signup";

import Login from "./pages/Login";

import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";

import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";

function App() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const [cursorActive, setCursorActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      setCursorActive(true);
    };

    const handleMouseLeave = () => {
      setCursorActive(false);
    };

    window.addEventListener("mousemove", handleMouseMove);

    window.addEventListener("mouseleave", handleMouseLeave);

    window.addEventListener("mouseenter", () => setCursorActive(true));

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);

      window.removeEventListener("mouseleave", handleMouseLeave);

      window.removeEventListener("mouseenter", () => setCursorActive(true));
    };
  }, []);

  return (
    <>
      {" "}
      {/* Cursor Glow Effect */}{" "}
      <div
        className={`cursor-glow ${cursorActive ? "active" : ""}`}
        style={{ left: cursorPosition.x, top: cursorPosition.y }}
      />{" "}
      {/* Router */}{" "}
      <Router>
        {" "}
        <Routes>
          {" "}
          <Route path="/" element={<LandingPage />} />{" "}
          <Route path="/signup" element={<Signup />} />{" "}
          <Route path="/login" element={<Login />} />{" "}
          <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
          <Route path="/dashboard" element={<Dashboard />} />{" "}
          <Route path="/admin" element={<AdminDashboard />} />{" "}
        </Routes>{" "}
      </Router>{" "}
    </>
  );
}
export default App;
