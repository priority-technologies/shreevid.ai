import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import AcceptableUse from "./pages/AcceptableUse";
import HelpCenter from "./pages/HelpCenter";
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
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/acceptable-use" element={<AcceptableUse />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>{" "}
    </>
  );
}
export default App;
