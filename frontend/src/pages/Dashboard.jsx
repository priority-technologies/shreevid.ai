import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  FileText,
  Zap,
  CreditCard,
  Settings as SettingsIcon,
  Brain,
} from "lucide-react";

import axios from "axios";

import CreateVideo from "../components/CreateVideo";

import PreviousWork from "../components/PreviousWork";

import Billing from "../components/Billing";

import Usage from "../components/Usage";

import Settings from "../components/Settings";

import "../styles/Dashboard.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Shreevid AI Brain Logo Component
const ShreevIdLogo = ({ className = '' }) => (
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className={className}>
    <defs>
      <linearGradient id="brain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7800da" />
        <stop offset="50%" stopColor="#e63589" />
        <stop offset="100%" stopColor="#fe0307" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="12" r="6" fill="url(#brain-grad)" opacity="0.9"/>
    <path d="M 8 18 Q 8 24 16 26 Q 24 24 24 18" stroke="url(#brain-grad)" strokeWidth="2" fill="none" />
    <circle cx="10" cy="10" r="2" fill="url(#brain-grad)" opacity="0.6"/>
    <circle cx="22" cy="10" r="2" fill="url(#brain-grad)" opacity="0.6"/>
    <path d="M 16 4 L 17 8 L 21 9 L 18 12 L 19 16 L 16 14 L 13 16 L 14 12 L 11 9 L 15 8" fill="url(#brain-grad)" opacity="0.7"/>
  </svg>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Start closed on mobile
  const [activePage, setActivePage] = useState("create");
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  useEffect(() => {
    // Set sidebar open on desktop by default
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      navigate("/login");
    } else {
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user data:", error);
        }
      }
      checkAdminStatus();
      fetchCredits();
      
      // Check for payment success/cancel in URL
      const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
      const paymentStatus = urlParams.get('payment');
      const sessionId = urlParams.get('session_id');
      
      if (paymentStatus === 'success' && sessionId) {
        verifyPayment(sessionId);
      } else if (paymentStatus === 'cancelled') {
        alert('Payment was cancelled. You can try again anytime.');
        // Clean URL
        window.history.replaceState({}, document.title, "/#/dashboard");
      }
    }
  }, [navigate]);
  
  const verifyPayment = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/payment/verify-session/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.status === 'success' || response.data.status === 'already_processed') {
        alert(`✓ Payment successful! ${response.data.credits} credits added to your account.`);
        fetchCredits(); // Refresh credits
      }
      
      // Clean URL
      window.history.replaceState({}, document.title, "/#/dashboard");
    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed. Please contact support if credits were not added.');
      window.history.replaceState({}, document.title, "/#/dashboard");
    }
  };
  
  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/admin/dashboard/stats`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsAdmin(true);
    } catch (error) {
      setIsAdmin(false);
    }
  };
  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/credits/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredits(response.data.credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const menuItems = [
    { id: "create", label: "Create Video", icon: LayoutDashboard },
    { id: "previous", label: "Previous Work", icon: FileText },
    { id: "usage", label: "Usage", icon: Zap },
    { id: "billing", label: "Billing & Payment", icon: CreditCard },
  ];
  const bottomMenuItems = [
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];
  
  return (
    <div className="dashboard-container">
      {/* Mobile Overlay */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? "closed" : ""}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <ShreevIdLogo className="logo-icon-svg" />
            <div className="logo-text">
              <h1 className="sidebar-logo">Shreevid AI</h1>
              <p className="sidebar-tagline">Priority Technologies Inc.</p>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                data-page={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`nav-item ${activePage === item.id ? "active" : ""}`}
              >
                <Icon size={20} /> <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="priority-logo-section">
            <img
              src="/White.png"
              alt="Priority Technologies"
              className="priority-logo-sidebar"
              title="Priority Technologies Inc"
            />
          </div>
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`nav-item ${activePage === item.id ? "active" : ""}`}
              >
                <Icon size={20} /> <span>{item.label}</span>
              </button>
            );
          })}
          <button onClick={handleLogout} className="nav-item logout-item">
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </div>{" "}
      {/* Main Content */}{" "}
      <div className="main-content">
        {" "}
        {/* Top Bar */}{" "}
        <div className="top-bar">
          {" "}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="menu-toggle"
          >
            {" "}
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}{" "}
          </button>{" "}
          <div className="top-bar-right">
            {" "}
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="admin-access-btn"
                title="Go to Admin Panel"
              >
                {" "}
                👑 Admin{" "}
              </button>
            )}{" "}
            {credits !== null && (
              <div
                className="credit-badge"
                onClick={() => setActivePage("settings")}
              >
                {" "}
                <Zap size={18} /> <span>{credits} credits</span>{" "}
              </div>
            )}{" "}
            <div className="user-info" style={{position: 'relative'}}>
              {" "}
              <div 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{cursor: 'pointer'}}
              >
                <p className="user-greeting">Welcome back,</p>{" "}
                <p className="user-name">
                  {user?.firstName} {user?.lastName}
                </p>{" "}
              </div>
              {showUserDropdown && (
                <div className="user-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '10px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '16px',
                  minWidth: '250px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                  zIndex: 1000
                }}>
                  <div style={{marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #334155'}}>
                    <p style={{fontSize: '14px', color: '#94a3b8', marginBottom: '4px'}}>Logged in as</p>
                    <p style={{fontSize: '15px', color: '#f1f5f9', fontWeight: '600'}}>{user?.email}</p>
                  </div>
                  <div style={{marginBottom: '8px'}}>
                    <p style={{fontSize: '13px', color: '#94a3b8'}}>Name</p>
                    <p style={{fontSize: '14px', color: '#f1f5f9'}}>{user?.firstName} {user?.lastName}</p>
                  </div>
                  {isAdmin && (
                    <div style={{
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      borderRadius: '8px',
                      padding: '8px',
                      marginTop: '12px',
                      textAlign: 'center'
                    }}>
                      <p style={{fontSize: '13px', color: '#fbbf24', fontWeight: '600'}}>👑 Admin Account</p>
                    </div>
                  )}
                  <button 
                    onClick={() => { handleLogout(); setShowUserDropdown(false); }}
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      padding: '10px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Page Content */}{" "}
        <div className="page-content fade-in" onClick={() => setShowUserDropdown(false)}>
          {" "}
          {activePage === "create" && <CreateVideo />}{" "}
          {activePage === "previous" && <PreviousWork />}{" "}
          {activePage === "usage" && <Usage />}{" "}
          {activePage === "billing" && <Billing />}{" "}
          {activePage === "settings" && <Settings />}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
