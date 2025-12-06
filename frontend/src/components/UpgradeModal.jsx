import { X, Zap, CreditCard, TrendingUp } from "lucide-react";
import "../styles/UpgradeModal.css";

export default function UpgradeModal({ isOpen, onClose, onUpgrade }) {
  if (!isOpen) return null;

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="upgrade-modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <div className="upgrade-modal-header">
          <div className="upgrade-icon">
            <Zap size={48} />
          </div>
          <h2>Out of Credits!</h2>
          <p>You've used all your available credits. Purchase more to continue creating amazing videos.</p>
        </div>

        <div className="upgrade-benefits">
          <h3>Why Upgrade?</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">
                <Zap size={24} />
              </div>
              <div>
                <h4>Instant Access</h4>
                <p>Credits added immediately</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4>Save More</h4>
                <p>Up to 25% discount on bulk packs</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">
                <CreditCard size={24} />
              </div>
              <div>
                <h4>Never Expires</h4>
                <p>Use your credits anytime</p>
              </div>
            </div>
          </div>
        </div>

        <div className="upgrade-actions">
          <button className="btn btn-primary btn-large" onClick={onUpgrade}>
            <CreditCard size={20} />
            Purchase Credits Now
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
