import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { Eye, EyeOff } from "lucide-react";

import axios from "axios";

import "../styles/Auth.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
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
        <form onSubmit={handleLogin} className="auth-form">
          <h2>Welcome Back</h2>
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
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" disabled={loading} className="auth-button">
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div className="auth-links">
            <p>
              <Link to="/forgot-password">Forgot your password?</Link>
            </p>
            <p>
              New user? <Link to="/signup">Create Account</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
