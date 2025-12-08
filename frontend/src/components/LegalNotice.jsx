import { useNavigate } from 'react-router-dom';
import { Info, X } from 'lucide-react';
import { useState } from 'react';
import '../styles/LegalNotice.css';

export default function LegalNotice() {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    <div className="legal-notice-banner">
      <div className="notice-content">
        <Info size={20} className="notice-icon" />
        <p>
          By using Shreevid AI, you agree to our{' '}
          <button onClick={() => navigate('/terms-of-service')} className="notice-link">
            Terms of Service
          </button>
          {' '}and{' '}
          <button onClick={() => navigate('/privacy-policy')} className="notice-link">
            Privacy Policy
          </button>
          . Please review our{' '}
          <button onClick={() => navigate('/acceptable-use')} className="notice-link">
            Acceptable Use Policy
          </button>
          {' '}for content guidelines.
        </p>
      </div>
      <button onClick={() => setIsVisible(false)} className="notice-close">
        <X size={18} />
      </button>
    </div>
  );
}
