import { useState } from 'react';
import '../styles/BuyCreditsModal.css';

const BuyCreditsModal = ({ isOpen, onClose, currentCredits = 0 }) => {
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [currency, setCurrency] = useState('USD');

  const creditBundles = [
    {
      id: 'bundle_small',
      name: 'Small Bundle',
      credits: 1000,
      price: 15,
      priceINR: 1245,
      videoCount: '~15 videos',
      popular: false,
      savings: null,
      description: 'Perfect for occasional use',
    },
    {
      id: 'bundle_medium',
      name: 'Medium Bundle',
      credits: 2500,
      price: 30,
      priceINR: 2490,
      videoCount: '~38 videos',
      popular: true,
      savings: '20% OFF',
      description: 'Most popular choice',
    },
    {
      id: 'bundle_large',
      name: 'Large Bundle',
      credits: 5000,
      price: 55,
      priceINR: 4565,
      videoCount: '~76 videos',
      popular: false,
      savings: '27% OFF',
      description: 'Great value for creators',
    },
    {
      id: 'bundle_xlarge',
      name: 'XL Bundle',
      credits: 10000,
      price: 100,
      priceINR: 8300,
      videoCount: '~153 videos',
      popular: false,
      savings: '33% OFF',
      description: 'Maximum savings',
    },
  ];

  const handlePurchase = async () => {
    if (!selectedBundle) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/credits/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: selectedBundle.id,
          amount: currency === 'USD' ? selectedBundle.price : selectedBundle.priceINR,
          currency: currency,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Successfully purchased ${selectedBundle.credits} credits!`);
        onClose();
        window.location.reload(); // Refresh to show updated credits
      } else {
        alert(data.message || 'Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to process purchase. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="buy-credits-overlay" onClick={onClose}>
      <div className="buy-credits-modal" onClick={(e) => e.stopPropagation()}>
        <div className="buy-credits-header">
          <div className="header-content">
            <h2>💳 Buy Credits</h2>
            <p className="current-balance">
              Current Balance: <span className="credits-amount">{currentCredits} credits</span>
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="currency-selector">
          <button
            className={`currency-btn ${currency === 'USD' ? 'active' : ''}`}
            onClick={() => setCurrency('USD')}
          >
            💵 USD
          </button>
          <button
            className={`currency-btn ${currency === 'INR' ? 'active' : ''}`}
            onClick={() => setCurrency('INR')}
          >
            💰 INR
          </button>
        </div>

        <div className="bundles-grid">
          {creditBundles.map((bundle) => (
            <div
              key={bundle.id}
              className={`bundle-card ${selectedBundle?.id === bundle.id ? 'selected' : ''} ${bundle.popular ? 'popular' : ''}`}
              onClick={() => setSelectedBundle(bundle)}
            >
              {bundle.popular && <div className="popular-badge">POPULAR</div>}
              {bundle.savings && <div className="savings-badge">{bundle.savings}</div>}
              
              <div className="bundle-name">{bundle.name}</div>
              <div className="bundle-credits">{bundle.credits.toLocaleString()} Credits</div>
              
              <div className="bundle-price">
                {currency === 'USD' ? (
                  <>
                    <span className="price-currency">$</span>
                    <span className="price-amount">{bundle.price}</span>
                  </>
                ) : (
                  <>
                    <span className="price-currency">₹</span>
                    <span className="price-amount">{bundle.priceINR}</span>
                  </>
                )}
              </div>

              <div className="bundle-video-count">{bundle.videoCount}</div>
              <div className="bundle-description">{bundle.description}</div>

              <div className="price-per-credit">
                {currency === 'USD'
                  ? `$${(bundle.price / bundle.credits).toFixed(4)}`
                  : `₹${(bundle.priceINR / bundle.credits).toFixed(4)}`
                } per credit
              </div>
            </div>
          ))}
        </div>

        <div className="purchase-footer">
          <div className="selected-info">
            {selectedBundle ? (
              <>
                <span className="selected-label">Selected:</span>
                <span className="selected-bundle">{selectedBundle.name}</span>
                <span className="selected-price">
                  {currency === 'USD' ? `$${selectedBundle.price}` : `₹${selectedBundle.priceINR}`}
                </span>
              </>
            ) : (
              <span className="select-prompt">Select a bundle to continue</span>
            )}
          </div>
          
          <div className="purchase-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="purchase-btn"
              onClick={handlePurchase}
              disabled={!selectedBundle}
            >
              Purchase Now
            </button>
          </div>
        </div>

        <div className="purchase-note">
          <p>💡 <strong>Note:</strong> Credits never expire and can be used anytime. All purchases are final.</p>
        </div>
      </div>
    </div>
  );
};

export default BuyCreditsModal;
