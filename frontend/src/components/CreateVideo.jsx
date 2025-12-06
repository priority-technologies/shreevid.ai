import { useState, useEffect } from "react";
import axios from "axios";
import {
  Upload,
  Loader,
  Sparkles,
  PartyPopper,
  AlertCircle,
  Zap,
} from "lucide-react";

import "../styles/Components.css";
import UpgradeModal from "./UpgradeModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const CREDIT_COST = 65; // Cost per 5-second video generation

export default function CreateVideo() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [voice, setVoice] = useState("default");
  const [backgroundNoise, setBackgroundNoise] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [credits, setCredits] = useState(null);
  const [showPurchasePrompt, setShowPurchasePrompt] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetchCredits();
    
    // Refresh credits every 10 seconds to stay updated
    const interval = setInterval(fetchCredits, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/credits/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredits(response.data.credits);
    } catch (fetchError) {
      console.error("Error fetching credits:", fetchError);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowPurchasePrompt(false);

    if (credits < CREDIT_COST) {
      setError(
        `Insufficient credits. You have ${credits} but need ${CREDIT_COST}.`,
      );
      setShowPurchasePrompt(true);
      setShowUpgradeModal(true); // Show upgrade modal
      return;
    }

    if (!image || !prompt) {
      setError("Please upload an image and enter a prompt");
      return;
    }

    setLoading(true);
    setProgress(0);
    setShowCelebration(false);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", prompt);
      formData.append(
        "voiceSettings",
        JSON.stringify({
          voice,
          backgroundNoise: parseInt(backgroundNoise, 10),
        }),
      );

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/projects/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (response.data.remainingCredits !== undefined) {
        setCredits(response.data.remainingCredits);
      } else {
        // Refresh credits after successful submission
        fetchCredits();
      }

      setTimeout(() => {
        setShowCelebration(true);
        setSuccess(
          "🎉 Video generation started! Check it in Previous Work tab.",
        );

        setTimeout(() => {
          setImage(null);
          setImagePreview(null);
          setPrompt("");
          setVoice("default");
          setBackgroundNoise(0);
          setProgress(0);
          setShowCelebration(false);
          setSuccess("");
        }, 5000);
      }, 500);
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.response?.data?.error || "Failed to create video");
      setProgress(0);
      setShowCelebration(false);
      setSuccess("");

      if (err.response?.data?.error?.includes("Insufficient credits")) {
        setShowPurchasePrompt(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-video-container">
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-content">
            <PartyPopper size={80} className="celebration-icon" />
            <h2 className="celebration-title">Success!</h2>
            <p className="celebration-text">
              Your video is being generated! Check the Previous Work tab to view it.
            </p>
            <div className="balloons">
              <div className="balloon balloon-1">🎈</div>
              <div className="balloon balloon-2">🎈</div>
              <div className="balloon balloon-3">🎈</div>
              <div className="balloon balloon-4">🎈</div>
              <div className="balloon balloon-5">🎈</div>
            </div>
            <div className="ribbons">
              <div className="ribbon ribbon-1"></div>
              <div className="ribbon ribbon-2"></div>
              <div className="ribbon ribbon-3"></div>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h2 className="page-title">Create Video</h2>
        <p className="page-subtitle">
          Upload an image and describe your vision
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div
            className="upload-zone"
            onClick={() => document.getElementById("image-upload").click()}
          >
            <Upload size={48} className="upload-icon" />
            <p className="upload-text">Click to upload image</p>
            <p className="upload-subtext">or drag and drop</p>
            <p className="upload-hint">PNG, JPG, GIF up to 50MB</p>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>

          {imagePreview && (
            <div className="file-selected">
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
              <p className="file-selected-text">
                ✓ Image selected: {image?.name}
              </p>
            </div>
          )}

          <div className="form-field" style={{ gridColumn: "1 / -1" }}>
            <label className="form-label">Video Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want the video to show. Be creative and detailed!"
              className="form-textarea"
            />
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label className="form-label">Voice Style</label>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="form-select"
              >
                <option value="default">Default Voice</option>
                <option value="male">Male Voice</option>
                <option value="female">Female Voice</option>
                <option value="robotic">Robotic Voice</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">
                Background Noise: {backgroundNoise}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={backgroundNoise}
                onChange={(e) => setBackgroundNoise(e.target.value)}
                className="range-slider"
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <div>
                <p>{error}</p>
                {showPurchasePrompt && (
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => {
                      window.location.hash = "#settings";
                    }}
                  >
                    Purchase credits now →
                  </button>
                )}
              </div>
            </div>
          )}

          {success && <div className="alert alert-success">{success}</div>}

          {credits !== null && (
            <div
              className={`credit-info ${credits < CREDIT_COST ? "insufficient" : ""}`}
            >
              <Zap size={16} />
              <span>
                Cost: <strong>{CREDIT_COST}</strong> credits
              </span>
              <span
                className={`balance ${credits < CREDIT_COST ? "low" : "ok"}`}
              >
                Your balance: <strong>{credits}</strong>
              </span>
            </div>
          )}

          {loading && (
            <div className="progress-container">
              <div className="progress-bar-wrapper">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="progress-text">{Math.round(progress)}% Complete</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (credits !== null && credits < CREDIT_COST)}
            className="btn btn-primary btn-generate"
          >
            {loading ? (
              <>
                <Loader size={20} className="spinner" />
                <span>Processing...</span>
              </>
            ) : credits !== null && credits < CREDIT_COST ? (
              <>
                <AlertCircle size={20} />
                <span>Insufficient Credits</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate Video</span>
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          // Navigate to Settings tab - trigger event
          const settingsTab = document.querySelector('[data-page="settings"]');
          if (settingsTab) settingsTab.click();
        }}
      />
    </div>
  );
}
