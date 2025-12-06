import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import "../styles/Auth.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: signup, 2: otp verification
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      console.log("API_BASE_URL:", API_BASE_URL);
      console.log("Sending signup request with data:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      console.log("Signup response:", response.data);
      setUserId(response.data.userId);
      setStep(2);
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response);
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        userId,
        otp,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Shreevid.ai</h1>
          <p>by Priority Technologies Inc.</p>
        </div>
        {step === 1 ? (
          <form onSubmit={handleSignup} className="auth-form">
            <h2>Create Your Account</h2>
            <div className="auth-form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <div className="auth-links">
              <p>
                Already have an account? <Link to="/login">Sign In</Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="auth-form">
            <h2>Verify Email</h2>
            <div className="auth-info">
              ✉️ We've sent an OTP to your email. Enter it below to verify your
              account.
            </div>
            <div className="form-group">
              <label>6-Digit OTP</label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                maxLength="6"
                required
                className="otp-input"
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="auth-links">
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                💡 In demo mode, use OTP: <strong>123456</strong>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
