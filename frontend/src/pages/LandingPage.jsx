import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Video, Sparkles, Users, TrendingUp, CheckCircle, ArrowRight, Play } from 'lucide-react';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const features = [
    {
      icon: <Video size={32} />,
      title: 'AI-Powered Video Generation',
      description: 'Create stunning videos from simple prompts using RunwayML Gen-4 Turbo technology'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Natural Voice Synthesis',
      description: 'Convert text to speech with Google Cloud Neural2 voices for realistic narration'
    },
    {
      icon: <Zap size={32} />,
      title: 'Lightning Fast Processing',
      description: 'Get your videos ready in minutes with our optimized generation pipeline'
    },
    {
      icon: <Users size={32} />,
      title: 'Credit-Based System',
      description: 'Pay only for what you use with our flexible prepaid credit system'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '125',
      credits: '125',
      features: ['125 Credits on Signup', 'AI Video Generation', 'Text-to-Speech', 'HD Quality', 'Email Support'],
      highlighted: false
    },
    {
      name: 'Professional',
      price: '499',
      credits: '500',
      features: ['500 Credits', 'Priority Processing', 'Advanced Features', 'Full HD Quality', 'Priority Support', 'Custom Watermark'],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: '1999',
      credits: '2500',
      features: ['2500 Credits', 'Fastest Processing', 'API Access', '4K Quality', 'Dedicated Support', 'White Label Option'],
      highlighted: false
    }
  ];

  const stats = [
    { label: 'Videos Created', value: '10,000+' },
    { label: 'Happy Users', value: '500+' },
    { label: 'Credits Issued', value: '1M+' },
    { label: 'Success Rate', value: '99.9%' }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">S</div>
            <span className="logo-text">Shreevid AI</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
            <button onClick={() => navigate('/login')} className="btn-nav-login">Login</button>
            <button onClick={handleGetStarted} className="btn-nav-signup">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Powered by RunwayML Gen-4 Turbo & Google AI</span>
          </div>
          <h1 className="hero-title">
            Create Stunning AI Videos
            <span className="gradient-text"> In Minutes</span>
          </h1>
          <p className="hero-description">
            Transform your ideas into professional videos using cutting-edge AI technology.
            No editing skills required. Just type, generate, and share.
          </p>
          <div className="hero-actions">
            <button onClick={handleGetStarted} className="btn-primary-large">
              Start Creating Free
              <ArrowRight size={20} />
            </button>
            <button className="btn-secondary-large">
              <Play size={20} />
              Watch Demo
            </button>
          </div>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card card-1">
            <Video size={40} />
            <p>AI Video Generation</p>
          </div>
          <div className="visual-card card-2">
            <Sparkles size={40} />
            <p>Neural Voice Synthesis</p>
          </div>
          <div className="visual-card card-3">
            <Zap size={40} />
            <p>Instant Processing</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to create professional AI-generated videos</p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your needs. All plans include full access to features.</p>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
                {plan.highlighted && <div className="badge-popular">Most Popular</div>}
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.price}</span>
                </div>
                <p className="credits-info">{plan.credits} Credits</p>
                <ul className="features-list">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex}>
                      <CheckCircle size={18} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={handleGetStarted} 
                  className={plan.highlighted ? 'btn-pricing-primary' : 'btn-pricing-secondary'}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Create Your First AI Video?</h2>
          <p>Join hundreds of creators using Shreevid AI to bring their ideas to life</p>
          <button onClick={handleGetStarted} className="btn-cta">
            Start Free Trial
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">S</div>
              <span>Shreevid AI</span>
            </div>
            <p>AI-powered video generation platform by Priority Technologies Inc.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">API Docs</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Shreevid AI by Priority Technologies Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
