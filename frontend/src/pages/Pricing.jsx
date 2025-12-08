import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  Zap, 
  ArrowRight, 
  ShoppingCart,
  Star,
  TrendingUp,
  Package,
  X
} from 'lucide-react';
import '../styles/Pricing.css';

const ShreevIdLogo = ({ className = "" }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    <defs>
      <linearGradient id="brain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7800da" />
        <stop offset="50%" stopColor="#e63589" />
        <stop offset="100%" stopColor="#fe0307" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="12" r="6" fill="url(#brain-grad)" opacity="0.9" />
    <path
      d="M 8 18 Q 8 24 16 26 Q 24 24 24 18"
      stroke="url(#brain-grad)"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="10" cy="10" r="2" fill="url(#brain-grad)" opacity="0.6" />
    <circle cx="22" cy="10" r="2" fill="url(#brain-grad)" opacity="0.6" />
    <path
      d="M 16 4 L 17 8 L 21 9 L 18 12 L 19 16 L 16 14 L 13 16 L 14 12 L 11 9 L 15 8"
      fill="url(#brain-grad)"
      opacity="0.7"
    />
  </svg>
);

export default function Pricing() {
  const navigate = useNavigate();
  const [pricingType, setPricingType] = useState('plans'); // 'plans' or 'bundles'
  const [currency, setCurrency] = useState('USD');

  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free Plan',
      credits: 65,
      price: 0,
      priceINR: 0,
      videoCount: '1 video',
      popular: false,
      description: 'Try before you buy',
      features: [
        '1 free video',
        'Basic features',
        'Standard quality',
        'Community support'
      ]
    },
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 1000,
      price: 10,
      priceINR: 830,
      videoCount: '~15 videos',
      popular: false,
      description: 'Get started quickly',
      features: [
        '15 videos',
        'All features',
        'HD quality',
        'Email support',
        'No watermark'
      ]
    },
    {
      id: 'creator',
      name: 'Creator Pack',
      credits: 3000,
      price: 25,
      priceINR: 2075,
      videoCount: '~46 videos',
      popular: true,
      savings: '16% OFF',
      description: 'For regular creators',
      features: [
        '46 videos',
        'All features',
        'HD quality',
        'Priority support',
        'Custom branding',
        'API access'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Pack',
      credits: 7500,
      price: 60,
      priceINR: 4980,
      videoCount: '~115 videos',
      popular: false,
      savings: '20% OFF',
      description: 'For power users',
      features: [
        '115 videos',
        'All features',
        '4K quality',
        'Priority support',
        'API access',
        'White label option'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pack',
      credits: 20000,
      price: 150,
      priceINR: 12450,
      videoCount: '~307 videos',
      popular: false,
      savings: '25% OFF',
      description: 'For teams & agencies',
      features: [
        '307 videos',
        'All features',
        '4K quality',
        'Dedicated support',
        'Full API access',
        'Complete white label',
        'Custom integrations'
      ]
    }
  ];

  const creditBundles = [
    {
      id: 'bundle_small',
      name: 'Small Bundle',
      credits: 1000,
      price: 15,
      priceINR: 1245,
      videoCount: '~15 videos',
      popular: false,
      description: 'Perfect for occasional use'
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
      description: 'Most popular choice'
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
      description: 'Great value for creators'
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
      description: 'Maximum savings'
    }
  ];

  const handleGetStarted = (planId) => {
    navigate('/signup', { state: { selectedPlan: planId } });
  };

  return (
    <div className="pricing-page">
      {/* Navigation */}
      <nav className="pricing-nav">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => navigate('/')}>
            <ShreevIdLogo />
            <span>Shreevid AI</span>
          </div>
          <button className="nav-cta" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-hero-content">
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the perfect plan for your video creation needs. No hidden fees, credits never expire.</p>
        </div>
      </section>

      {/* Pricing Type Toggle */}
      <div className="pricing-type-toggle">
        <button
          className={`toggle-btn ${pricingType === 'plans' ? 'active' : ''}`}
          onClick={() => setPricingType('plans')}
        >
          <Package size={20} />
          Subscription Plans
        </button>
        <button
          className={`toggle-btn ${pricingType === 'bundles' ? 'active' : ''}`}
          onClick={() => setPricingType('bundles')}
        >
          <ShoppingCart size={20} />
          Credit Bundles
        </button>
      </div>

      {/* Currency Toggle */}
      <div className="currency-toggle">
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

      {/* Pricing Cards */}
      <div className="pricing-container">
        <div className="pricing-cards-grid">
          {(pricingType === 'plans' ? subscriptionPlans : creditBundles).map((item) => (
            <div
              key={item.id}
              className={`pricing-card ${item.popular ? 'popular' : ''}`}
            >
              {item.popular && <div className="popular-badge">POPULAR</div>}
              {item.savings && <div className="savings-badge">{item.savings}</div>}

              <div className="pricing-card-header">
                <h3>{item.name}</h3>
                <p className="plan-description">{item.description}</p>
              </div>

              <div className="pricing-card-price">
                <span className="currency-symbol">{currency === 'USD' ? '$' : '₹'}</span>
                <span className="price-amount">
                  {currency === 'USD' ? item.price : item.priceINR}
                </span>
              </div>

              <div className="credits-info">
                <div className="credits-amount">
                  <Zap size={18} />
                  {item.credits.toLocaleString()} Credits
                </div>
                <div className="video-count">{item.videoCount}</div>
              </div>

              {item.features && (
                <ul className="features-list">
                  {item.features.map((feature, index) => (
                    <li key={index}>
                      <Check size={18} />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              <button
                className="get-started-btn"
                onClick={() => handleGetStarted(item.id)}
              >
                Get Started
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <section className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>💳 How do credits work?</h3>
            <p>Each video costs 65 credits. Credits are deducted only when you successfully generate a video. Failed generations are automatically refunded.</p>
          </div>
          <div className="faq-item">
            <h3>⏰ Do credits expire?</h3>
            <p>No! Your credits never expire. Use them whenever you need, at your own pace.</p>
          </div>
          <div className="faq-item">
            <h3>🔄 Can I upgrade or buy more credits?</h3>
            <p>Yes! You can purchase credit bundles anytime, regardless of your current plan. Credits stack and never expire.</p>
          </div>
          <div className="faq-item">
            <h3>💰 What's the difference between plans and bundles?</h3>
            <p>Plans are one-time purchases with bonus features. Bundles are flexible credit top-ups you can buy anytime.</p>
          </div>
          <div className="faq-item">
            <h3>🎥 What video quality do I get?</h3>
            <p>All plans include HD quality. Professional and Enterprise plans offer 4K quality videos.</p>
          </div>
          <div className="faq-item">
            <h3>💳 What payment methods do you accept?</h3>
            <p>We accept all major credit cards, debit cards, and UPI for Indian customers.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta">
        <div className="cta-content">
          <h2>Ready to Create Amazing Videos?</h2>
          <p>Start with our free plan and upgrade anytime.</p>
          <button className="cta-btn" onClick={() => navigate('/signup')}>
            Start Creating for Free
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="pricing-footer">
        <p>&copy; 2025 Shreevid AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
