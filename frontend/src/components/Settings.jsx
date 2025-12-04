import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, History, User, Zap, TrendingUp, DollarSign, Check } from 'lucide-react';
import PaymentModal from './PaymentModal';
import '../styles/Settings.css';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('credits');
  const [credits, setCredits] = useState(null);
  const [pricing, setPricing] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
      
      // Fetch credits
      const creditsRes = await axios.get(`${API_BASE_URL}/credits/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredits(creditsRes.data);

      // Fetch pricing
      const pricingRes = await axios.get(`${API_BASE_URL}/credits/pricing`);
      setPricing(pricingRes.data);

      // Fetch transactions
      const transactionsRes = await axios.get(`${API_BASE_URL}/credits/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactionsRes.data.transactions);

      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handlePurchase = async (packageId) => {
    const pkg = pricing.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    // Refresh credits and close modal
    fetchData();
    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
        <p className="page-subtitle">Manage your account, credits, and preferences</p>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'credits' ? 'active' : ''}`}
          onClick={() => setActiveTab('credits')}
        >
          <Zap size={18} />
          Credits & Billing
        </button>
        <button
          className={`settings-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <History size={18} />
          Transaction History
        </button>
        <button
          className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <User size={18} />
          Account Settings
        </button>
      </div>

      {/* Credits & Billing Tab */}
      {activeTab === 'credits' && (
        <div className="settings-content">
          {/* Credit Balance Card */}
          <div className="credit-balance-card">
            <div className="balance-header">
              <div>
                <h3>Available Credits</h3>
                <p className="balance-subtitle">Use credits to generate videos</p>
              </div>
              <div className="balance-icon">
                <Zap size={32} />
              </div>
            </div>
            <div className="balance-amount">{credits?.credits || 0}</div>
            <div className="balance-stats">
              <div className="balance-stat">
                <TrendingUp size={16} />
                <span>Total Earned: {credits?.totalEarned || 0}</span>
              </div>
              <div className="balance-stat">
                <DollarSign size={16} />
                <span>Total Spent: {credits?.totalSpent || 0}</span>
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <h3 className="section-title">Purchase Credits</h3>
          <div className="pricing-grid">
            {pricing.map((plan) => (
              <div key={plan.id} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h4 className="plan-name">{plan.name}</h4>
                <div className="plan-price">
                  <span className="price-currency">$</span>
                  <span className="price-amount">{plan.price}</span>
                </div>
                <div className="plan-credits">{plan.credits.toLocaleString()} Credits</div>
                <div className="plan-details">
                  <div className="plan-detail">
                    <Check size={16} />
                    <span>${plan.pricePerCredit.toFixed(3)} per credit</span>
                  </div>
                  {plan.savings && (
                    <div className="plan-detail highlight">
                      <Check size={16} />
                      <span>Save {plan.savings}</span>
                    </div>
                  )}
                  <div className="plan-detail">
                    <Check size={16} />
                    <span>Instant delivery</span>
                  </div>
                  <div className="plan-detail">
                    <Check size={16} />
                    <span>Never expires</span>
                  </div>
                </div>
                <button
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} plan-button`}
                  onClick={() => handlePurchase(plan.id)}
                >
                  <CreditCard size={18} />
                  Purchase Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History Tab */}
      {activeTab === 'transactions' && (
        <div className="settings-content">
          <h3 className="section-title">Transaction History</h3>
          {transactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="transactions-table">
              {transactions.map((txn) => (
                <div key={txn._id} className="transaction-row">
                  <div className="transaction-icon">
                    {txn.type === 'purchase' && <CreditCard size={20} className="icon-purchase" />}
                    {txn.type === 'deduction' && <Zap size={20} className="icon-deduction" />}
                    {txn.type === 'bonus' && <TrendingUp size={20} className="icon-bonus" />}
                    {txn.type === 'refund' && <DollarSign size={20} className="icon-refund" />}
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-description">{txn.description}</div>
                    <div className="transaction-date">
                      {new Date(txn.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <span className={`amount ${txn.type === 'purchase' || txn.type === 'bonus' || txn.type === 'refund' ? 'positive' : 'negative'}`}>
                      {txn.type === 'purchase' || txn.type === 'bonus' || txn.type === 'refund' ? '+' : '-'}
                      {txn.amount}
                    </span>
                    <span className="balance-after">Balance: {txn.balanceAfter}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Account Settings Tab */}
      {activeTab === 'account' && (
        <div className="settings-content">
          <h3 className="section-title">Account Information</h3>
          <div className="account-card">
            <div className="account-field">
              <label>Name</label>
              <div className="field-value">{user?.firstName} {user?.lastName}</div>
            </div>
            <div className="account-field">
              <label>Email</label>
              <div className="field-value">{user?.email}</div>
            </div>
            <div className="account-field">
              <label>Account Type</label>
              <div className="field-value">Prepaid Credits</div>
            </div>
            <div className="account-field">
              <label>Member Since</label>
              <div className="field-value">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {selectedPackage && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPackage(null);
          }}
          packageInfo={selectedPackage}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
