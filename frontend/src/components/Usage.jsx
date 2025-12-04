import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import '../styles/Components.css';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Usage() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/billing/usage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsage(response.data);
    } catch (err) {
      setError('Failed to load usage data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" size={40} />
      </div>
    );
  }

  if (!usage) {
    return <div className="alert alert-error">{error}</div>;
  }

  const usagePercentage = (usage.totalCreditsUsed / (usage.totalCreditsUsed + usage.creditsRemaining)) * 100;

  return (
    <div className="usage-container">
      <div className="page-header">
        <h2 className="page-title">Usage & Credits</h2>
        <p className="page-subtitle">Track your spending and activity</p>
      </div>

      {/* Credits Balance */}
      <div className="credits-banner">
        <div>
          <p className="credits-label">Available Credits</p>
          <h3 className="credits-value">${usage.creditsRemaining || 0}</h3>
        </div>
        <DollarSign size={48} className="credits-icon" />
      </div>

      {/* Warning */}
      {usage.creditsRemaining < 100 && (
        <div className="warning-banner">
          ⚠️ Low balance! You have less than 100 credits remaining.
        </div>
      )}

      {/* Usage Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-card-blue">
          <div className="stat-header">
            <Calendar size={24} />
            <h3 className="stat-title">Daily Activity</h3>
          </div>
          <div className="stat-details">
            <div className="stat-row">
              <span className="stat-label">Credits Used Today</span>
              <span className="stat-value">{usage.dailyUsage || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Last Reset</span>
              <span className="stat-value text-sm">{new Date(usage.lastResetDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="stat-card stat-card-green">
          <div className="stat-header">
            <TrendingUp size={24} />
            <h3 className="stat-title">Monthly Activity</h3>
          </div>
          <div className="stat-details">
            <div className="stat-row">
              <span className="stat-label">Credits This Month</span>
              <span className="stat-value">{usage.monthlyUsage || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Total Used</span>
              <span className="stat-value">{usage.totalCreditsUsed || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <h3 className="section-title">Credit Usage Progress</h3>
        <div className="progress-card">
          <div className="progress-header">
            <span className="progress-label">Usage Rate</span>
            <span className="progress-percentage">{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${usagePercentage}%` }}></div>
          </div>
        </div>

        <div className="activity-grid">
          <div>
            <p className="stat-label">Total Credits</p>
            <p className="stat-value">{usage.totalCreditsUsed + usage.creditsRemaining}</p>
          </div>
          <div>
            <p className="stat-label">Used</p>
            <p className="stat-value" style={{ color: '#ef4444' }}>{usage.totalCreditsUsed}</p>
          </div>
          <div>
            <p className="stat-label">Available</p>
            <p className="stat-value" style={{ color: '#10b981' }}>{usage.creditsRemaining}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
