import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, FileText, Zap, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import axios from 'axios';
import CreateVideo from '../components/CreateVideo';
import PreviousWork from '../components/PreviousWork';
import Billing from '../components/Billing';
import Usage from '../components/Usage';
import Settings from '../components/Settings';
import '../styles/Dashboard.css';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('create');
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      checkAdminStatus();
      fetchCredits();
    }
  }, [navigate]);

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAdmin(true);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/credits/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredits(response.data.credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'create', label: 'Create Video', icon: LayoutDashboard },
    { id: 'previous', label: 'Previous Work', icon: FileText },
    { id: 'usage', label: 'Usage', icon: Zap },
    { id: 'billing', label: 'Billing & Payment', icon: CreditCard },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? 'closed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">S</div>
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
                onClick={() => {
                  setActivePage(item.id);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button onClick={handleLogout} className="nav-item logout-item">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-toggle">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="top-bar-right">
            {isAdmin && (
              <button 
                onClick={() => navigate('/admin')} 
                className="admin-access-btn"
                title="Go to Admin Panel"
              >
                👑 Admin
              </button>
            )}
            {credits !== null && (
              <div className="credit-badge" onClick={() => setActivePage('settings')}>
                <Zap size={18} />
                <span>{credits} credits</span>
              </div>
            )}
            <div className="user-info">
              <p className="user-greeting">Welcome back,</p>
              <p className="user-name">{user?.firstName} {user?.lastName}</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content fade-in">
          {activePage === 'create' && <CreateVideo />}
          {activePage === 'previous' && <PreviousWork />}
          {activePage === 'usage' && <Usage />}
          {activePage === 'billing' && <Billing />}
          {activePage === 'settings' && <Settings />}
        </div>
      </div>
    </div>
  );
}
