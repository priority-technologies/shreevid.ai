import { useState } from 'react';
import axios from 'axios';
import { X, Loader, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import '../styles/PaymentModal.css';

const API_BASE_URL = 'http://localhost:5000/api';

export default function PaymentModal({ isOpen, onClose, packageInfo, onSuccess }) {
  const [step, setStep] = useState('method'); // method, details, processing, success
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [showCVV, setShowCVV] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactionId, setTransactionId] = useState('');

  // Fetch payment methods on mount
  const fetchPaymentMethods = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/payment/methods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentMethods(response.data);
    } catch (err) {
      console.error('Failed to fetch payment methods:', err);
    }
  };

  if (!isOpen) return null;

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    setError('');
    setPaymentDetails({});
  };

  const handleDetailChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateDetails = () => {
    const methodRequirements = {
      credit_card: ['cardNumber', 'cardName', 'expiryDate', 'cvv'],
      debit_card: ['cardNumber', 'cardName', 'expiryDate', 'cvv'],
      upi: ['upiId'],
      net_banking: ['bankName', 'accountNumber'],
      paypal: ['email'],
      stripe: ['cardNumber', 'cardName', 'expiryDate', 'cvv'],
    };

    const required = methodRequirements[paymentMethod] || [];
    for (const field of required) {
      if (!paymentDetails[field]) {
        setError(`${field.replace(/([A-Z])/g, ' $1').trim()} is required`);
        return false;
      }
    }

    // Validate card number
    if (paymentDetails.cardNumber) {
      const cardNum = paymentDetails.cardNumber.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cardNum)) {
        setError('Invalid card number (13-19 digits)');
        return false;
      }
    }

    // Validate CVV
    if (paymentDetails.cvv && !/^\d{3,4}$/.test(paymentDetails.cvv)) {
      setError('Invalid CVV (3-4 digits)');
      return false;
    }

    // Validate expiry
    if (paymentDetails.expiryDate && !/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
      setError('Invalid expiry date (use MM/YY format)');
      return false;
    }

    return true;
  };

  const handleProcessPayment = async () => {
    if (!validateDetails()) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/payment/process`,
        {
          method: paymentMethod,
          amount: packageInfo.price,
          paymentDetails,
          packageId: packageInfo.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === 'success') {
        setTransactionId(response.data.transactionId);
        setStep('success');
        if (onSuccess) {
          setTimeout(() => onSuccess(response.data), 2000);
        }
      } else {
        setError(response.data.message || 'Payment failed');
        setStep('details');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment processing failed');
      setStep('details');
    } finally {
      setLoading(false);
    }
  };

  // Render based on step
  if (step === 'method') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Select Payment Method</h2>
            <button onClick={onClose} className="modal-close">
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="package-summary">
              <h3>{packageInfo.name} Package</h3>
              <p className="price">${packageInfo.price.toFixed(2)}</p>
              <p className="credits">{packageInfo.credits.toLocaleString()} Credits</p>
            </div>

            <div className="payment-methods-list">
              <h4>Choose Payment Method:</h4>
              <div className="methods-grid">
                {[
                  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
                  { id: 'debit_card', name: 'Debit Card', icon: '💳' },
                  { id: 'upi', name: 'UPI', icon: '📱', regionHint: 'India' },
                  { id: 'net_banking', name: 'Net Banking', icon: '🏦', regionHint: 'India' },
                  { id: 'paypal', name: 'PayPal', icon: '🅿️' },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => {
                      setPaymentMethod(method.id);
                      setStep('details');
                    }}
                    className={`method-card ${paymentMethod === method.id ? 'active' : ''}`}
                  >
                    <span className="method-icon">{method.icon}</span>
                    <span className="method-name">{method.name}</span>
                    {method.regionHint && <span className="region-hint">{method.regionHint}</span>}
                  </button>
                ))}
              </div>
            </div>

            <p className="payment-info">
              💡 <strong>Secure Payment:</strong> All transactions are encrypted and secure. No payment details are stored.
            </p>
          </div>

          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button 
              onClick={() => setStep('details')} 
              className="btn btn-primary"
              disabled={!paymentMethod}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content payment-modal large" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Enter Payment Details</h2>
            <button onClick={onClose} className="modal-close">
              <X size={24} />
            </button>
          </div>

          <div className="modal-body">
            <div className="payment-form">
              {/* Card Details */}
              {['credit_card', 'debit_card', 'stripe'].includes(paymentMethod) && (
                <>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={paymentDetails.cardName || ''}
                      onChange={(e) => handleDetailChange('cardName', e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={paymentDetails.cardNumber || ''}
                      onChange={(e) => handleDetailChange('cardNumber', e.target.value)}
                      className="form-input"
                      maxLength="19"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="12/25"
                        value={paymentDetails.expiryDate || ''}
                        onChange={(e) => handleDetailChange('expiryDate', e.target.value)}
                        className="form-input"
                        maxLength="5"
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <div className="cvv-input-wrapper">
                        <input
                          type={showCVV ? 'text' : 'password'}
                          placeholder="123"
                          value={paymentDetails.cvv || ''}
                          onChange={(e) => handleDetailChange('cvv', e.target.value)}
                          className="form-input"
                          maxLength="4"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCVV(!showCVV)}
                          className="toggle-cvv"
                        >
                          {showCVV ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* UPI */}
              {paymentMethod === 'upi' && (
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="email"
                    placeholder="yourname@upi"
                    value={paymentDetails.upiId || ''}
                    onChange={(e) => handleDetailChange('upiId', e.target.value)}
                    className="form-input"
                  />
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'net_banking' && (
                <>
                  <div className="form-group">
                    <label>Bank Name</label>
                    <select
                      value={paymentDetails.bankName || ''}
                      onChange={(e) => handleDetailChange('bankName', e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select Bank</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="axis">Axis Bank</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      placeholder="Your account number"
                      value={paymentDetails.accountNumber || ''}
                      onChange={(e) => handleDetailChange('accountNumber', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </>
              )}

              {/* PayPal */}
              {paymentMethod === 'paypal' && (
                <div className="form-group">
                  <label>PayPal Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={paymentDetails.email || ''}
                    onChange={(e) => handleDetailChange('email', e.target.value)}
                    className="form-input"
                  />
                </div>
              )}

              {error && (
                <div className="alert alert-error">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="order-summary">
                <div className="summary-row">
                  <span>Amount:</span>
                  <strong>${packageInfo.price.toFixed(2)}</strong>
                </div>
                <div className="summary-row">
                  <span>You'll receive:</span>
                  <strong>{packageInfo.credits.toLocaleString()} Credits</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              onClick={() => setStep('method')} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Back
            </button>
            <button 
              onClick={handleProcessPayment} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Processing Payment...
                </>
              ) : (
                <>
                  Pay ${packageInfo.price.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content payment-modal success" onClick={e => e.stopPropagation()}>
          <div className="success-icon">
            <Check size={64} />
          </div>
          <h2>Payment Successful!</h2>
          <p>Your credits have been added to your account.</p>
          
          <div className="transaction-details">
            <div className="detail">
              <span>Transaction ID:</span>
              <code>{transactionId}</code>
            </div>
            <div className="detail">
              <span>Amount Paid:</span>
              <strong>${packageInfo.price.toFixed(2)}</strong>
            </div>
            <div className="detail">
              <span>Credits Received:</span>
              <strong>+{packageInfo.credits.toLocaleString()}</strong>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    );
  }

  return null;
}
