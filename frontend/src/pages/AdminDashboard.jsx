import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Users,
  CreditCard,
  Zap,
  DollarSign,
  Activity,
  Search,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  AlertCircle,
  Edit2,
} from "lucide-react";
import axios from "axios";
import EditUserModal from "../components/EditUserModal";
import AdminCharts from "../components/AdminCharts";
import ApiUsageModal from "../components/ApiUsageModal";
import "../styles/Dashboard.css";
import "../styles/AdminDashboard.css";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("overview");
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [apiUsage, setApiUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);
  const closeProjectModal = () => {
    setShowProjectModal(false);
    setSelectedProject(null);
  };
  
  const handleViewApiUsage = (apiName) => {
    setSelectedApi(apiName);
    setShowApiModal(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      navigate("/login");
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchDashboardStats();
    }
  }, [navigate]);
  useEffect(() => {
    if (activePage === "users") fetchUsers();
    else if (activePage === "transactions") fetchTransactions();
    else if (activePage === "projects") fetchProjects();
    else if (activePage === "api-usage") fetchApiUsage();
  }, [activePage]);
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/admin/dashboard/stats`,
        getAuthHeaders(),
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 403) {
        alert("Access denied. Admin privileges required.");
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/admin/users?search=${searchTerm}`,
        getAuthHeaders(),
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/admin/transactions`,
        getAuthHeaders(),
      );
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/admin/projects`,
        getAuthHeaders(),
      );
      setProjects(response.data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchApiUsage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/admin/api-usage/summary`,
        getAuthHeaders(),
      );
      setApiUsage(response.data);
    } catch (error) {
      console.error("Error fetching API usage:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddCredits = async (userId) => {
    const amount = prompt("Enter credit amount to add:");
    if (!amount || isNaN(amount)) return;
    const reason =
      prompt("Reason for adding credits:") || "Admin credit addition";
    try {
      await axios.post(
        `${API_BASE_URL}/admin/users/${userId}/credits`,
        { amount: parseInt(amount), action: "add", reason },
        getAuthHeaders(),
      );
      alert("Credits added successfully!");
      fetchUsers();
    } catch (error) {
      alert("Error adding credits: " + error.response?.data?.error);
    }
  };
  const handleDeductCredits = async (userId) => {
    const amount = prompt("Enter credit amount to deduct:");
    if (!amount || isNaN(amount)) return;
    const reason =
      prompt("Reason for deducting credits:") || "Admin credit deduction";
    try {
      await axios.post(
        `${API_BASE_URL}/admin/users/${userId}/credits`,
        { amount: parseInt(amount), action: "deduct", reason },
        getAuthHeaders(),
      );
      alert("Credits deducted successfully!");
      fetchUsers();
    } catch (error) {
      alert("Error deducting credits: " + error.response?.data?.error);
    }
  };
  const handleDeleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    )
      return;
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/users/${userId}`,
        getAuthHeaders(),
      );
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      alert("Error deleting user: " + error.response?.data?.error);
    }
  };
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };
  const handleSaveUser = (updatedUser) => {
    // Update the user in the list    setUsers(users.map(u => u._id === updatedUser.id ? { ...u, ...updatedUser } : u));
  };
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "users", label: "Users Management", icon: Users },
    { id: "transactions", label: "Payments & Revenue", icon: DollarSign },
    { id: "projects", label: "Projects", icon: Activity },
    { id: "api-usage", label: "API Usage & Bills", icon: Zap },
  ];
  return (
    <div className="dashboard-container admin-dashboard">
      {" "}
      {/* Sidebar */}{" "}
      <div className={`sidebar ${!sidebarOpen ? "closed" : ""}`}>
        {" "}
        <div className="sidebar-header">
          {" "}
          <div className="logo-container">
            {" "}
            <div className="logo-icon admin-icon">A</div>{" "}
            <div className="logo-text">
              {" "}
              <h1 className="sidebar-logo">Super Admin</h1>{" "}
              <p className="sidebar-tagline">Shreevid AI</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <nav className="sidebar-nav">
          {" "}
          {menuItems.map((item) => {
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
                {" "}
                <Icon size={20} /> <span>{item.label}</span>{" "}
              </button>
            );
          })}{" "}
        </nav>{" "}
        <div className="sidebar-bottom">
          {" "}
          <button onClick={handleLogout} className="nav-item logout-item">
            {" "}
            <LogOut size={20} /> <span>Logout</span>{" "}
          </button>{" "}
        </div>{" "}
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
            <div className="admin-badge">
              {" "}
              <AlertCircle size={18} /> <span>Super Admin</span>{" "}
            </div>{" "}
            <div className="user-info">
              {" "}
              <p className="user-greeting">Admin Panel</p>{" "}
              <p className="user-name">
                {user?.firstName} {user?.lastName}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Page Content */}{" "}
        <div className="page-content fade-in">
          {" "}
          {/* OVERVIEW */}{" "}
          {activePage === "overview" && stats && (
            <div className="admin-overview">
              {" "}
              <h2 className="page-title">Dashboard</h2>{" "}
              <div className="stats-grid">
                {" "}
                <div className="stat-card">
                  {" "}
                  <div className="stat-icon users-icon">
                    {" "}
                    <Users size={24} />{" "}
                  </div>{" "}
                  <div className="stat-content">
                    {" "}
                    <p className="stat-label">Total Users</p>{" "}
                    <h3 className="stat-value">{stats.users.total}</h3>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="stat-card">
                  {" "}
                  <div className="stat-icon projects-icon">
                    {" "}
                    <Activity size={24} />{" "}
                  </div>{" "}
                  <div className="stat-content">
                    {" "}
                    <p className="stat-label">Total Projects</p>{" "}
                    <h3 className="stat-value">{stats.projects.total}</h3>{" "}
                    <p className="stat-sub">
                      Completed: {stats.projects.completed}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="stat-card">
                  {" "}
                  <div className="stat-icon revenue-icon">
                    {" "}
                    <DollarSign size={24} />{" "}
                  </div>{" "}
                  <div className="stat-content">
                    {" "}
                    <p className="stat-label">Total Revenue</p>{" "}
                    <h3 className="stat-value">
                      ₹{stats.revenue.total.toLocaleString()}
                    </h3>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="stat-card">
                  {" "}
                  <div className="stat-icon credits-icon">
                    {" "}
                    <Zap size={24} />{" "}
                  </div>{" "}
                  <div className="stat-content">
                    {" "}
                    <p className="stat-label">Credits Available</p>{" "}
                    <h3 className="stat-value">
                      {stats.credits.totalCreditsAvailable.toLocaleString()}
                    </h3>{" "}
                    <p className="stat-sub">
                      Issued:{" "}
                      {stats.credits.totalCreditsIssued.toLocaleString()}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              {/* Growth Charts */} <AdminCharts stats={stats} />{" "}
              <div className="recent-activity">
                {" "}
                <h3>Recent Users</h3>{" "}
                <div className="activity-list">
                  {" "}
                  {stats.users.recent.map((u) => (
                    <div key={u._id} className="activity-item">
                      {" "}
                      <div className="activity-icon">
                        {" "}
                        <Users size={16} />{" "}
                      </div>{" "}
                      <div>
                        {" "}
                        <p className="activity-title">
                          {u.firstName} {u.lastName}
                        </p>{" "}
                        <p className="activity-time">{u.email}</p>{" "}
                      </div>{" "}
                    </div>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {/* USERS MANAGEMENT */}{" "}
          {activePage === "users" && (
            <div className="admin-users">
              {" "}
              <div className="page-header">
                {" "}
                <h2 className="page-title">Users Management</h2>{" "}
                <div className="search-box">
                  {" "}
                  <Search size={18} />{" "}
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />{" "}
                  <button onClick={fetchUsers} className="btn-search">
                    {" "}
                    <RefreshCw size={16} />{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
              <div className="table-container">
                {" "}
                <table className="admin-table">
                  {" "}
                  <thead>
                    {" "}
                    <tr>
                      {" "}
                      <th>User</th> <th>Email</th> <th>Credits</th>{" "}
                      <th>Spent</th> <th>Joined</th> <th>Actions</th>{" "}
                    </tr>{" "}
                  </thead>{" "}
                  <tbody>
                    {" "}
                    {users.map((u) => (
                      <tr key={u._id}>
                        {" "}
                        <td>
                          {" "}
                          <div className="user-cell">
                            {" "}
                            <div className="user-avatar">
                              {u.firstName[0]}
                              {u.lastName[0]}
                            </div>{" "}
                            <span>
                              {u.firstName} {u.lastName}
                            </span>{" "}
                          </div>{" "}
                        </td>{" "}
                        <td>{u.email}</td>{" "}
                        <td>
                          <span className="badge badge-success">
                            {u.credits}
                          </span>
                        </td>{" "}
                        <td>{u.totalCreditsSpent}</td>{" "}
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>{" "}
                        <td>
                          {" "}
                          <div className="action-buttons">
                            {" "}
                            <button
                              onClick={() => handleEditUser(u)}
                              className="btn-icon btn-primary"
                              title="Edit User"
                            >
                              {" "}
                              <Edit2 size={16} />{" "}
                            </button>{" "}
                            <button
                              onClick={() => handleAddCredits(u._id)}
                              className="btn-icon btn-success"
                              title="Add Credits"
                            >
                              {" "}
                              <Plus size={16} />{" "}
                            </button>{" "}
                            <button
                              onClick={() => handleDeductCredits(u._id)}
                              className="btn-icon btn-warning"
                              title="Deduct Credits"
                            >
                              {" "}
                              <Zap size={16} />{" "}
                            </button>{" "}
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="btn-icon btn-danger"
                              title="Delete User"
                            >
                              {" "}
                              <Trash2 size={16} />{" "}
                            </button>{" "}
                          </div>{" "}
                        </td>{" "}
                      </tr>
                    ))}{" "}
                  </tbody>{" "}
                </table>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {/* TRANSACTIONS */}{" "}
          {activePage === "transactions" && (
            <div className="admin-transactions">
              {" "}
              <h2 className="page-title">Payments & Revenue</h2>{" "}
              <div className="table-container">
                {" "}
                <table className="admin-table">
                  {" "}
                  <thead>
                    {" "}
                    <tr>
                      {" "}
                      <th>Date</th> <th>User</th> <th>Type</th> <th>Amount</th>{" "}
                      <th>Balance After</th> <th>Status</th>{" "}
                    </tr>{" "}
                  </thead>{" "}
                  <tbody>
                    {" "}
                    {transactions.map((t) => (
                      <tr key={t._id}>
                        {" "}
                        <td>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>{" "}
                        <td>
                          {t.userId?.firstName} {t.userId?.lastName}
                        </td>{" "}
                        <td>
                          <span className="badge">{t.type}</span>
                        </td>{" "}
                        <td>
                          <span style={{ 
                            color: t.type === 'deduction' ? '#ef4444' : '#10b981',
                            fontWeight: '600'
                          }}>
                            {t.type === 'deduction' ? '-' : '+'}{t.amount} credits
                          </span>
                        </td>{" "}
                        <td>{t.balanceAfter} credits</td>{" "}
                        <td>
                          <span
                            className={`badge badge-${t.paymentStatus === "completed" ? "success" : "warning"}`}
                          >
                            {t.paymentStatus}
                          </span>
                        </td>{" "}
                      </tr>
                    ))}{" "}
                  </tbody>{" "}
                </table>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {/* PROJECTS */}{" "}
          {activePage === "projects" && (
            <div className="admin-projects">
              {" "}
              <h2 className="page-title">All Projects</h2>{" "}
              <div className="table-container">
                {" "}
                <table className="admin-table">
                  {" "}
                  <thead>
                    {" "}
                    <tr>
                      {" "}
                      <th>Created</th> <th>User</th> <th>Title</th>{" "}
                      <th>Status</th> <th>Duration</th> <th>Credits</th>{" "}
                      <th>Action</th>{" "}
                    </tr>{" "}
                  </thead>{" "}
                  <tbody>
                    {" "}
                    {projects.map((p) => (
                      <tr key={p._id}>
                        {" "}
                        <td>
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>{" "}
                        <td>
                          {p.userId?.firstName} {p.userId?.lastName}
                        </td>{" "}
                        <td>{p.title || "Untitled"}</td>{" "}
                        <td>
                          <span
                            className={`badge badge-${p.videoStatus === "completed" ? "success" : p.videoStatus === "failed" ? "danger" : "warning"}`}
                          >
                            {p.videoStatus}
                          </span>
                        </td>{" "}
                        <td>{p.duration}s</td> <td>{p.cost || 0} credits</td>{" "}
                        <td>
                          {" "}
                          <button
                            onClick={() => handleViewProject(p)}
                            className="btn-icon btn-info"
                            title="View Project"
                          >
                            {" "}
                            <Eye size={16} />{" "}
                          </button>{" "}
                        </td>{" "}
                      </tr>
                    ))}{" "}
                  </tbody>{" "}
                </table>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {/* API USAGE */}{" "}
          {activePage === "api-usage" && apiUsage && (
            <div className="admin-api-usage">
              {" "}
              <h2 className="page-title">API Usage & Bills</h2>{" "}
              <div className="api-cards">
                {" "}
                <div className="api-card">
                  {" "}
                  <h3>RunwayML Gen-4 Turbo</h3>{" "}
                  <p className="api-status active">Active</p>{" "}
                  <div className="api-details">
                    {" "}
                    <p>
                      Total Projects: <strong>{apiUsage.totalProjects}</strong>
                    </p>{" "}
                    <p>Model: Gen-4 Turbo</p>{" "}
                  </div>{" "}
                  <button className="btn-secondary" onClick={() => handleViewApiUsage("RunwayML Gen-4 Turbo")}>
                    View Usage Details
                  </button>{" "}
                </div>{" "}
                <div className="api-card">
                  {" "}
                  <h3>Google Cloud TTS</h3>{" "}
                  <p className="api-status active">Active</p>{" "}
                  <div className="api-details">
                    {" "}
                    <p>
                      Total Projects: <strong>{apiUsage.totalProjects}</strong>
                    </p>{" "}
                    <p>Voice: Neural2-C</p>{" "}
                  </div>{" "}
                  <button className="btn-secondary" onClick={() => handleViewApiUsage("Google Cloud TTS")}>
                    View Usage Details
                  </button>{" "}
                </div>{" "}
                <div className="api-card">
                  {" "}
                  <h3>FFmpeg Composition</h3>{" "}
                  <p className="api-status active">Active (Local)</p>{" "}
                  <div className="api-details">
                    {" "}
                    <p>
                      Total Videos: <strong>{apiUsage.totalProjects}</strong>
                    </p>{" "}
                    <p>Cost: Free (Self-hosted)</p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="summary-card">
                {" "}
                <h3>Monthly Summary</h3>{" "}
                <div className="summary-stats">
                  {" "}
                  <div className="summary-item">
                    {" "}
                    <p>Total Users</p> <h2>{apiUsage.totalUsers}</h2>{" "}
                  </div>{" "}
                  <div className="summary-item">
                    {" "}
                    <p>Total Projects</p> <h2>{apiUsage.totalProjects}</h2>{" "}
                  </div>{" "}
                  <div className="summary-item">
                    {" "}
                    <p>Total Revenue</p> <h2>₹{apiUsage.totalRevenue}</h2>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          {loading && (
            <div className="loading-overlay">
              {" "}
              <div className="spinner"></div>{" "}
            </div>
          )}{" "}
          {/* Edit User Modal */}{" "}
          {editingUser && (
            <EditUserModal
              user={editingUser}
              isOpen={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setEditingUser(null);
              }}
              onSave={handleSaveUser}
            />
          )}{" "}
          {/* Project Details Modal */}{" "}
          {selectedProject && showProjectModal && (
            <div className="modal-overlay" onClick={closeProjectModal}>
              {" "}
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {" "}
                <div className="modal-header">
                  {" "}
                  <h3>Project Details</h3>{" "}
                  <button className="modal-close" onClick={closeProjectModal}>
                    {" "}
                    <X size={20} />{" "}
                  </button>{" "}
                </div>{" "}
                <div className="project-details">
                  {" "}
                  <div className="detail-row">
                    {" "}
                    <label>Project Title</label>{" "}
                    <p>{selectedProject.title || "Untitled"}</p>{" "}
                  </div>{" "}
                  <div className="detail-row">
                    {" "}
                    <label>Created By</label>{" "}
                    <p>
                      {selectedProject.userId?.firstName}{" "}
                      {selectedProject.userId?.lastName}
                    </p>{" "}
                  </div>{" "}
                  <div className="detail-row">
                    {" "}
                    <label>Prompt/Description</label>{" "}
                    <p>{selectedProject.prompt || "No prompt"}</p>{" "}
                  </div>{" "}
                  <div className="detail-row">
                    {" "}
                    <label>Status</label>{" "}
                    <p>
                      {" "}
                      <span
                        className={`badge badge-${selectedProject.videoStatus === "completed" ? "success" : selectedProject.videoStatus === "failed" ? "danger" : "warning"}`}
                      >
                        {" "}
                        {selectedProject.videoStatus}{" "}
                      </span>{" "}
                    </p>{" "}
                  </div>{" "}
                  <div className="detail-row">
                    {" "}
                    <label>Duration</label>{" "}
                    <p>{selectedProject.duration}s</p>{" "}
                  </div>{" "}
                  <div className="detail-row">
                    {" "}
                    <label>Credits Used</label>{" "}
                    <p>{selectedProject.costCredits}</p>{" "}
                  </div>{" "}
                  <div className="detail-row">
                    {" "}
                    <label>Resolution</label>{" "}
                    <p>{selectedProject.resolution || "1080p"}</p>{" "}
                  </div>{" "}
                  {selectedProject.imageUrl && (
                    <div className="detail-row">
                      {" "}
                      <label>Image Preview</label>{" "}
                      <img
                        src={selectedProject.imageUrl}
                        alt="Project"
                        className="project-image"
                      />{" "}
                    </div>
                  )}{" "}
                  {selectedProject.videoUrl && (
                    <div className="detail-row">
                      {" "}
                      <label>Video URL</label>{" "}
                      <a
                        href={selectedProject.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {" "}
                        View Video{" "}
                      </a>{" "}
                    </div>
                  )}{" "}
                  <div className="detail-row">
                    {" "}
                    <label>Created</label>{" "}
                    <p>
                      {new Date(selectedProject.createdAt).toLocaleString()}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          )}{" "}
          
          {/* API Usage Modal */}
          <ApiUsageModal
            isOpen={showApiModal}
            onClose={() => {
              setShowApiModal(false);
              setSelectedApi(null);
            }}
            apiName={selectedApi}
            stats={apiUsage}
          />
        </div>{" "}
      </div>{" "}
    </div>
  );
}
