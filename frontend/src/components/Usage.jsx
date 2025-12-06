import { useState, useEffect } from "react";
import axios from "axios";
import { Loader, TrendingUp, Calendar, DollarSign, Receipt } from "lucide-react";
import "../styles/Components.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function Usage() {
  const [usage, setUsage] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsage();
    fetchTransactions();
  }, []);

  const fetchUsage = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/billing/usage`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsage(response.data);
    } catch (err) {
      setError("Failed to load usage data");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/billing/transactions?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data.transactions || []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
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
  if (!usage) {
    return <div className="alert alert-error">{error}</div>;
  }
  
  // Calculate usage percentage based on total earned vs spent
  const usagePercentage = usage.totalCreditsEarned > 0
    ? (usage.totalCreditsUsed / usage.totalCreditsEarned) * 100
    : 0;

  return (
    <div className="usage-container">
      {" "}
      <div className="page-header">
        {" "}
        <h2 className="page-title">Usage & Credits</h2>{" "}
        <p className="page-subtitle">Track your spending and activity</p>{" "}
      </div>{" "}
      {/* Credits Balance */}{" "}
      <div className="credits-banner">
        {" "}
        <div>
          {" "}
          <p className="credits-label">Available Credits</p>{" "}
          <h3 className="credits-value">${usage.creditsRemaining || 0}</h3>{" "}
        </div>{" "}
        <DollarSign size={48} className="credits-icon" />{" "}
      </div>{" "}
      {/* Warning */}{" "}
      {usage.creditsRemaining < 100 && (
        <div className="warning-banner">
          {" "}
          ⚠️ Low balance! You have less than 100 credits remaining.{" "}
        </div>
      )}{" "}
      {/* Usage Stats */}{" "}
      <div className="stats-grid">
        {" "}
        <div className="stat-card stat-card-blue">
          {" "}
          <div className="stat-header">
            {" "}
            <Calendar size={24} />{" "}
            <h3 className="stat-title">Daily Activity</h3>{" "}
          </div>{" "}
          <div className="stat-details">
            {" "}
            <div className="stat-row">
              {" "}
              <span className="stat-label">Credits Used Today</span>{" "}
              <span className="stat-value">{usage.dailyUsage || 0}</span>{" "}
            </div>{" "}
            <div className="stat-row">
              {" "}
              <span className="stat-label">Last Reset</span>{" "}
              <span className="stat-value text-sm">
                {new Date(usage.lastResetDate).toLocaleDateString()}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="stat-card stat-card-green">
          {" "}
          <div className="stat-header">
            {" "}
            <TrendingUp size={24} />{" "}
            <h3 className="stat-title">Monthly Activity</h3>{" "}
          </div>{" "}
          <div className="stat-details">
            {" "}
            <div className="stat-row">
              {" "}
              <span className="stat-label">Credits This Month</span>{" "}
              <span className="stat-value">{usage.monthlyUsage || 0}</span>{" "}
            </div>{" "}
            <div className="stat-row">
              {" "}
              <span className="stat-label">Total Spent</span>{" "}
              <span className="stat-value">
                {usage.totalCreditsUsed || 0}
              </span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Progress */}{" "}
      <div className="card">
        {" "}
        <h3 className="section-title">Credit Usage Progress</h3>{" "}
        <div className="progress-card">
          {" "}
          <div className="progress-header">
            {" "}
            <span className="progress-label">Usage Rate</span>{" "}
            <span className="progress-percentage">
              {usagePercentage.toFixed(1)}%
            </span>{" "}
          </div>{" "}
          <div className="progress-bar-container">
            {" "}
            <div
              className="progress-bar"
              style={{ width: `${usagePercentage}%` }}
            ></div>{" "}
          </div>{" "}
        </div>{" "}
        <div className="activity-grid">
          {" "}
          <div>
            {" "}
            <p className="stat-label">Total Earned</p>{" "}
            <p className="stat-value">
              {usage.totalCreditsEarned || 0}
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="stat-label">Total Spent</p>{" "}
            <p className="stat-value" style={{ color: "#ef4444" }}>
              {usage.totalCreditsUsed || 0}
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="stat-label">Available</p>{" "}
            <p className="stat-value" style={{ color: "#10b981" }}>
              {usage.creditsRemaining || 0}
            </p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* Transaction History */}
      <div className="card">
        <h3 className="section-title">
          <Receipt size={20} style={{ display: 'inline', marginRight: '8px' }} />
          Transaction History
        </h3>
        {transactions.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
            No transactions yet
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px' }}>Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#6b7280', fontSize: '14px' }}>Description</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#6b7280', fontSize: '14px' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#6b7280', fontSize: '14px' }}>Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      {new Date(txn.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: txn.type === 'purchase' ? '#dbeafe' :
                                       txn.type === 'refund' ? '#d1fae5' :
                                       txn.type === 'deduction' ? '#fee2e2' : '#f3f4f6',
                        color: txn.type === 'purchase' ? '#1e40af' :
                               txn.type === 'refund' ? '#065f46' :
                               txn.type === 'deduction' ? '#991b1b' : '#374151'
                      }}>
                        {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {txn.description}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'right', 
                      fontWeight: '600',
                      color: txn.type === 'deduction' ? '#ef4444' : '#10b981'
                    }}>
                      {txn.type === 'deduction' ? '-' : '+'}{txn.amount} credits
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', color: '#6b7280' }}>
                      {txn.balanceAfter} credits
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
