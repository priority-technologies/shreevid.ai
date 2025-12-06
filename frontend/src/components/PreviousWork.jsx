import { useState, useEffect } from "react";
import axios from "axios";
import { Download, Trash2, Edit2, Loader, Save, X } from "lucide-react";
import "../styles/Components.css";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export default function PreviousWork() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editPrompt, setEditPrompt] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [editVoice, setEditVoice] = useState("default");
  const [editBackgroundNoise, setEditBackgroundNoise] = useState(0);
  
  useEffect(() => {
    fetchProjects();
    
    // Auto-refresh every 10 seconds to check for new/updated projects
    const interval = setInterval(() => {
      fetchProjects();
    }, 10000); // 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("[PreviousWork] Fetching projects...");
      const response = await axios.get(`${API_BASE_URL}/projects/my-projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[PreviousWork] Projects received:", response.data);
      // Sort by creation date (latest first)
      const sortedProjects = (response.data || []).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProjects(sortedProjects);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("[PreviousWork] Error fetching projects:", err);
      setError("Failed to load projects: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(projects.filter((p) => p._id !== projectId));
      } catch (err) {
        setError("Failed to delete project");
      }
    }
  };
  const handleEdit = (project) => {
    setEditingId(project._id);
    setEditPrompt(project.prompt);
    setEditVoice(project.voiceSettings?.voice || "default");
    setEditBackgroundNoise(project.voiceSettings?.backgroundNoise || 0);
    setShowEditModal(true);
  };
  const handleRegenerateVideo = async () => {
    if (!editPrompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setRegenerating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/projects/${editingId}/regenerate`,
        {
          prompt: editPrompt,
          voiceSettings: {
            voice: editVoice,
            backgroundNoise: parseInt(editBackgroundNoise),
          },
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowEditModal(false);
      setEditingId(null);
      setEditPrompt("");
      setEditVoice("default");
      setEditBackgroundNoise(0);
      alert("Video regeneration started! Credits will be deducted.");
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to regenerate video");
    } finally {
      setRegenerating(false);
    }
  };
  const handleSaveEdit = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/projects/${projectId}/edit`,
        { voiceSettings: editData },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchProjects();
      setEditingId(null);
    } catch (err) {
      setError("Failed to update project");
    }
  };
  const handleDownload = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/projects/${projectId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Open the video URL in a new tab for download
      const baseUrl = API_BASE_URL.replace('/api', '');
      const videoUrl = `${baseUrl}${response.data.downloadUrl}`;
      window.open(videoUrl, '_blank');
    } catch (err) {
      setError("Failed to download video: " + (err.response?.data?.error || err.message));
    }
  };
  if (loading) {
    return (
      <div className="loading-container">
        {" "}
        <Loader className="spinner" size={40} />{" "}
      </div>
    );
  }
  return (
    <div>
      {" "}
      {/* Edit Prompt Modal */}{" "}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          {" "}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {" "}
            <div className="modal-header">
              {" "}
              <h3>Edit & Regenerate Video</h3>{" "}
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                {" "}
                <X size={20} />{" "}
              </button>{" "}
            </div>{" "}
            <div className="modal-body">
              {" "}
              <p className="modal-description">
                {" "}
                Update the prompt and settings to regenerate the video. Credits
                will be consumed.{" "}
              </p>{" "}
              {/* Prompt */}{" "}
              <div
                className="form-field"
                style={{ marginBottom: "20px", gridColumn: "1 / -1" }}
              >
                {" "}
                <label className="form-label">Video Prompt</label>{" "}
                <textarea
                  className="form-textarea"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="Enter new prompt for video regeneration..."
                  rows="8"
                  style={{ width: "100%", resize: "vertical" }}
                />{" "}
              </div>{" "}
              {/* Voice & Noise Settings */}{" "}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                {" "}
                <div className="form-field">
                  {" "}
                  <label className="form-label">Voice Style</label>{" "}
                  <select
                    value={editVoice}
                    onChange={(e) => setEditVoice(e.target.value)}
                    className="form-select"
                  >
                    {" "}
                    <option value="default">Default Voice</option>{" "}
                    <option value="male">Male Voice</option>{" "}
                    <option value="female">Female Voice</option>{" "}
                    <option value="robotic">Robotic Voice</option>{" "}
                  </select>{" "}
                </div>{" "}
                <div className="form-field">
                  {" "}
                  <label className="form-label">
                    Background Noise: {editBackgroundNoise}%
                  </label>{" "}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={editBackgroundNoise}
                    onChange={(e) => setEditBackgroundNoise(e.target.value)}
                    className="range-slider"
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="modal-footer">
              {" "}
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                {" "}
                Cancel{" "}
              </button>{" "}
              <button
                className="btn btn-primary"
                onClick={handleRegenerateVideo}
                disabled={regenerating}
              >
                {" "}
                {regenerating ? (
                  <>
                    {" "}
                    <Loader size={16} className="spinner" />{" "}
                    Regenerating...{" "}
                  </>
                ) : (
                  <>
                    {" "}
                    <Edit2 size={16} /> Regenerate Video{" "}
                  </>
                )}{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
      <div className="page-header">
        {" "}
        <div>
          <h2 className="page-title">Previous Work</h2>{" "}
          <p className="page-subtitle">
            View and manage your video projects
          </p>{" "}
        </div>
        <button 
          onClick={() => {
            setLoading(true);
            fetchProjects();
          }}
          className="btn btn-secondary"
          style={{marginLeft: 'auto'}}
        >
          🔄 Refresh
        </button>
      </div>{" "}
      {error && <div className="alert alert-error">{error}</div>}{" "}
      {projects.length === 0 ? (
        <div className="empty-state">
          {" "}
          <p>No projects yet. Create your first video!</p>{" "}
          <p style={{fontSize: '14px', color: '#94a3b8', marginTop: '8px'}}>
            Tip: Videos auto-refresh every 10 seconds
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {" "}
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              {" "}
              {project.videoStatus === 'completed' && project.videoUrl ? (
                <video 
                  controls 
                  controlsList="nodownload"
                  preload="metadata"
                  className="project-image"
                  poster={`${API_BASE_URL.replace('/api', '')}${project.thumbnailUrl || project.imageUrl}`}
                  style={{ width: '100%', height: 'auto', borderRadius: '12px 12px 0 0' }}
                >
                  <source 
                    src={`${API_BASE_URL.replace('/api', '')}${project.videoUrl}`} 
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={`${API_BASE_URL.replace('/api', '')}${project.thumbnailUrl || project.imageUrl}`}
                  alt="Project"
                  className="project-image"
                />
              )}{" "}
              <div className="project-info">
                {" "}
                <p className="project-title">{project.prompt}</p>{" "}
                <div className="project-meta">
                  {" "}
                  <span
                    className={`status-badge status-${project.videoStatus}`}
                  >
                    {" "}
                    {project.videoStatus}{" "}
                  </span>{" "}
                  <span className="project-cost">
                    Cost: {project.cost || 65} credits
                  </span>{" "}
                </div>{" "}
                <div className="project-actions">
                  {" "}
                  <button
                    onClick={() => handleEdit(project)}
                    className="btn btn-primary btn-small"
                    title="Edit and regenerate"
                  >
                    {" "}
                    <Edit2 size={16} /> Edit{" "}
                  </button>{" "}
                  <button
                    onClick={() => handleDownload(project._id)}
                    disabled={project.videoStatus !== "completed"}
                    className={`btn btn-small ${project.videoStatus === "completed" ? "btn-success" : "btn-secondary"}`}
                    title={project.videoStatus === "completed" ? "Download video" : "Video not ready"}
                    style={{ minWidth: '110px' }}
                  >
                    {" "}
                    <Download size={16} /> Download{" "}
                  </button>{" "}
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="btn btn-danger btn-small"
                    title="Delete project"
                    style={{ minWidth: '90px' }}
                  >
                    {" "}
                    <Trash2 size={16} /> Delete{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
}
