import { useState, useEffect } from "react";
import axios from "axios";
import {
  CreditCard,
  Zap,
  Loader,
  DollarSign,
  Calendar,
  Check,
} from "lucide-react";
import PaymentModal from "./PaymentModal";
import "../styles/Components.css";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export default function Billing() {
  const [pendingBills, setPendingBills] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pricing, setPricing] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activePlan, setActivePlan] = useState(null);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    fetchBillingData();
  }, []);
  const fetchBillingData = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("[Billing v2.0] Starting data fetch...");
      
      // Fetch billing history
      const billingResponse = await axios.get(`${API_BASE_URL}/billing/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("[Billing v2.0] History loaded:", billingResponse.data);
      setBillingHistory(billingResponse.data.billings || []);
      
      // Fetch pricing packages
      const pricingResponse = await axios.get(`${API_BASE_URL}/credits/pricing`);
      console.log("[Billing v2.0] Pricing loaded:", pricingResponse.data);
      setPricing(pricingResponse.data);
      
      // Fetch transactions to determine active plan
      const transactionsRes = await axios.get(`${API_BASE_URL}/credits/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactionsRes.data.transactions);
      
      // Determine active plan
      const purchaseTransactions = transactionsRes.data.transactions.filter(t => t.type === 'purchase');
      if (purchaseTransactions.length > 0) {
        const lastPurchase = purchaseTransactions[0];
        const matchedPlan = pricingResponse.data.find(p => 
          lastPurchase.description.includes(p.name)
        );
        setActivePlan(matchedPlan || null);
      }
      
      setError(""); // Clear any errors
      console.log("[Billing v2.0] All data loaded successfully!");
    } catch (err) {
      console.error("[Billing v2.0] ERROR:", err);
      setError("Failed to load billing data: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };
  const handlePurchase = (packageId) => {
    const pkg = pricing.find((p) => p.id === packageId);
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
        {" "}
        <Loader className="spinner" size={40} />{" "}
      </div>
    );
  }
  return (
    <div className="billing-container">
      {" "}
      <div className="page-header">
        {" "}
        <h2 className="page-title">Billing & Payments</h2>{" "}
        <p className="page-subtitle">
          Manage your credits and payment history
        </p>{" "}
      </div>{" "}
      {error && <div className="alert alert-error">{error}</div>}{" "}
      {/* Pricing Plans */}{" "}
      <div className="card">
        {" "}
        <h3 className="section-title">
          {" "}
          <CreditCard size={24} /> Purchase Credits{" "}
        </h3>{" "}
        <div className="pricing-grid">
          {" "}
          {pricing.map((plan) => {
            const isActive = activePlan && activePlan.id === plan.id;
            const canUpgrade = activePlan && !plan.isFree && 
              pricing.findIndex(p => p.id === activePlan.id) < pricing.findIndex(p => p.id === plan.id);
            
            return (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "popular" : ""} ${isActive ? "active-plan" : ""}`}
            >
              {" "}
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              {isActive && (
                <div className="active-plan-badge">Current Plan</div>
              )}
              <h4 className="plan-name">{plan.name}</h4>
              <div className="plan-price">
                <span className="price-currency">{plan.isFree ? "" : "$"}</span>
                <span className="price-amount">{plan.isFree ? "Free" : plan.price}</span>
              </div>
              <div className="plan-credits">
                {plan.credits.toLocaleString()} Credits
              </div>
              {plan.videoCount && (
                <div className="plan-video-count">
                  🎬 {plan.videoCount}
                </div>
              )}
              <div className="plan-details">
                <div className="plan-detail">
                  <Check size={16} />
                  <span>{plan.isFree ? "Perfect for testing" : `$${plan.pricePerCredit.toFixed(3)} per credit`}</span>
                </div>
                {plan.savings && (
                  <div className="plan-detail highlight">
                    <Check size={16} /> <span>{plan.savings}</span>
                  </div>
                )}
                <div className="plan-detail">
                  <Check size={16} /> <span>AI Video + Voice</span>
                </div>
                <div className="plan-detail">
                  <Check size={16} /> <span>Instant delivery</span>
                </div>
              </div>
              {!plan.isFree && (
                <button
                  className={`btn ${canUpgrade ? "btn-primary" : plan.popular ? "btn-primary" : "btn-secondary"} plan-button`}
                  onClick={() => handlePurchase(plan.id)}
                  disabled={isActive}
                >
                  <CreditCard size={18} /> {isActive ? "Current Plan" : canUpgrade ? "Upgrade Now" : "Purchase Now"}
                </button>
              )}
            </div>
            );
          })}
        </div>
      </div>
      {/* Payment Modal */}{" "}
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
      )}{" "}
      {/* Billing History */}{" "}
      <div>
        {" "}
        <h3 className="section-title" style={{ marginBottom: "1rem" }}>
          {" "}
          <Calendar size={24} /> Billing History{" "}
        </h3>{" "}
        {billingHistory.length === 0 ? (
          <div className="no-bills">
            {" "}
            <p>No billing history yet.</p>{" "}
          </div>
        ) : (
          <div className="bills-grid">
            {" "}
            {billingHistory.map((bill) => (
              <div key={bill._id} className="bill-card">
                {" "}
                <div className="bill-header">
                  {" "}
                  <div>
                    {" "}
                    <p className="bill-amount">${bill.amount}</p>{" "}
                    <p className="bill-method">
                      {bill.paymentMethod.replace("_", " ").toUpperCase()}
                    </p>{" "}
                  </div>{" "}
                  <span className={`bill-status status-${bill.status}`}>
                    {" "}
                    {bill.status}{" "}
                  </span>{" "}
                </div>{" "}
                <div className="bill-details">
                  {" "}
                  <p className="detail-row">
                    {" "}
                    <span>Transaction ID:</span>{" "}
                    <span>{bill.transactionId}</span>{" "}
                  </p>{" "}
                  <p className="detail-row">
                    {" "}
                    <span>Date:</span>{" "}
                    <span>
                      {new Date(bill.createdAt).toLocaleDateString()}
                    </span>{" "}
                  </p>{" "}
                  <p className="detail-row">
                    {" "}
                    <span>Time:</span>{" "}
                    <span>
                      {new Date(bill.createdAt).toLocaleTimeString()}
                    </span>{" "}
                  </p>{" "}
                </div>{" "}
              </div>
            ))}{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
