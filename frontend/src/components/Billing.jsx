import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Zap, Loader, DollarSign, Calendar, Check } from 'lucide-react';
import PaymentModal from './PaymentModal';
import '../styles/Components.css';

const API_BASE_URL = 'http://localhost:5000/api';

export default function Billing() {
  const [pendingBills, setPendingBills] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pricing, setPricing] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/billing/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBillingHistory(response.data.bills || []);

      // Fetch pricing packages
      const pricingRes = await axios.get(`${API_BASE_URL}/credits/pricing`);
      setPricing(pricingRes.data);
    } catch (err) {
      setError('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (packageId) => {
    const pkg = pricing.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    fetchBillingData();
    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="spinner" size={40} />
      </div>
    );
  }

  return (
    <div className="billing-container">
      <div className="page-header">
        <h2 className="page-title">Billing & Payments</h2>
        <p className="page-subtitle">Manage your credits and payment history</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Pricing Plans */}
      <div className="card">
        <h3 className="section-title">
          <CreditCard size={24} />
          Purchase Credits
        </h3>
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

      {/* Billing History */}
      <div>
        <h3 className="section-title" style={{ marginBottom: '1rem' }}>
          <Calendar size={24} />
          Billing History
        </h3>
        {billingHistory.length === 0 ? (
          <div className="no-bills">
            <p>No billing history yet.</p>
          </div>
        ) : (
          <div className="bills-grid">
            {billingHistory.map((bill) => (
              <div key={bill._id} className="bill-card">
                <div className="bill-header">
                  <div>
                    <p className="bill-amount">${bill.amount}</p>
                    <p className="bill-method">{bill.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                  </div>
                  <span className={`bill-status status-${bill.status}`}>
                    {bill.status}
                  </span>
                </div>
                <div className="bill-details">
                  <p className="detail-row">
                    <span>Transaction ID:</span>
                    <span>{bill.transactionId}</span>
                  </p>
                  <p className="detail-row">
                    <span>Date:</span>
                    <span>{new Date(bill.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="detail-row">
                    <span>Time:</span>
                    <span>{new Date(bill.createdAt).toLocaleTimeString()}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
