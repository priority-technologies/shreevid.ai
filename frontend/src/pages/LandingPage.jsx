import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, Video, Sparkles, Users, TrendingUp, CheckCircle, ArrowRight, Play,
  Brain, Mic, Gauge, CreditCard, FileVideo, Wand2, Globe, Shield,
  ChevronDown, Star, Quote, Menu, X, Github, Twitter, Linkedin, Mail
} from 'lucide-react';
import '../styles/LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const horizontalRef = useRef(null);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  // Horizontal scroll features
  const horizontalFeatures = [
    {
      icon: <Brain size={48} />,
      title: 'AI-Powered Prompts',
      description: 'Describe your vision in natural language. Our AI understands context, tone, and intent to generate exactly what you imagine.',
      image: '🎨'
    },
    {
      icon: <Video size={48} />,
      title: 'RunwayML Gen-4 Turbo',
      description: 'Leverage cutting-edge generative AI from RunwayML to create photorealistic videos with stunning clarity and motion.',
      image: '🎬'
    },
    {
      icon: <Mic size={48} />,
      title: 'Google Neural Voice',
      description: 'Add lifelike narration with Google Cloud\'s Neural2 TTS. Choose from multiple voices and languages for global reach.',
      image: '🎙️'
    },
    {
      icon: <Wand2 size={48} />,
      title: 'Instant Composition',
      description: 'Automated video editing, transitions, and effects. No timeline scrubbing or complex software—just pure creativity.',
      image: '✨'
    },
    {
      icon: <Gauge size={48} />,
      title: 'Lightning Fast',
      description: 'From prompt to final render in minutes. Optimized pipeline ensures you spend less time waiting, more time creating.',
      image: '⚡'
    },
    {
      icon: <Globe size={48} />,
      title: 'Multi-Language Support',
      description: 'Create videos in 7+ languages with region-specific voices. Perfect for global marketing and localized content.',
      image: '🌍'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '125',
      credits: '125',
      features: ['125 Credits on Signup', 'AI Video Generation', 'Text-to-Speech', 'HD Quality (1080p)', 'Email Support', 'Cloud Storage'],
      highlighted: false
    },
    {
      name: 'Professional',
      price: '499',
      credits: '500',
      features: ['500 Credits', 'Priority Processing', 'Advanced Features', 'Full HD Quality', 'Priority Support', 'Custom Watermark', 'Batch Processing'],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: '1999',
      credits: '2500',
      features: ['2500 Credits', 'Fastest Processing', 'API Access', '4K Quality', 'Dedicated Support', 'White Label Option', 'SLA Guarantee'],
      highlighted: false
    }
  ];

  const stats = [
    { label: 'Videos Created', value: '10,000+', icon: <Video size={24} /> },
    { label: 'Happy Creators', value: '2,000+', icon: <Users size={24} /> },
    { label: 'Credits Issued', value: '1M+', icon: <Zap size={24} /> },
    { label: 'Avg. Rating', value: '4.9/5', icon: <Star size={24} /> }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Content Creator',
      avatar: 'SM',
      text: 'Shreevid AI completely transformed my workflow. What used to take days now takes minutes. The quality is incredible!',
      rating: 5
    },
    {
      name: 'Rajesh Kumar',
      role: 'Marketing Director',
      avatar: 'RK',
      text: 'We produce 20+ videos weekly for our campaigns. Shreevid AI is a game-changer—fast, affordable, and professional results.',
      rating: 5
    },
    {
      name: 'Emily Chen',
      role: 'Entrepreneur',
      avatar: 'EC',
      text: 'As a solo founder, I needed something that just works. Shreevid AI delivers every time. Best investment for my business.',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'How does the credit system work?',
      answer: 'Each video generation costs credits based on duration and quality. For example, a 10-second HD video costs approximately 10 credits. You can purchase credits in bundles and they never expire.'
    },
    {
      question: 'What AI models power Shreevid?',
      answer: 'We use RunwayML Gen-4 Turbo for video generation and Google Cloud Neural2 for text-to-speech. Both are industry-leading AI models ensuring top-tier quality.'
    },
    {
      question: 'Can I use the videos commercially?',
      answer: 'Yes! All videos generated are yours to use commercially without attribution. Perfect for marketing, social media, presentations, and more.'
    },
    {
      question: 'How long does video generation take?',
      answer: 'Most videos are ready in 2-5 minutes depending on length and complexity. Enterprise users get priority processing for even faster turnaround.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a satisfaction guarantee. If you\'re not happy with your first video, contact us within 7 days for a full refund—no questions asked.'
    },
    {
      question: 'Is there an API available?',
      answer: 'Yes! Enterprise plans include full API access. Integrate Shreevid AI directly into your apps, workflows, or automation pipelines.'
    }
  ];

  const useCases = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Marketing & Ads',
      description: 'Create product demos, explainer videos, and social media ads in minutes'
    },
    {
      icon: <Users size={32} />,
      title: 'Education & Training',
      description: 'Build engaging educational content and training materials at scale'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Content Creation',
      description: 'YouTube videos, Instagram reels, TikTok content—produce more, faster'
    },
    {
      icon: <Shield size={32} />,
      title: 'Corporate Communications',
      description: 'Internal announcements, onboarding videos, and company updates'
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <div className="logo-icon">S</div>
            <span className="logo-text">Shreevid AI</span>
          </div>
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <button onClick={() => navigate('/login')} className="btn-nav-login">Login</button>
            <button onClick={handleGetStarted} className="btn-nav-signup">Get Started Free</button>
          </div>
          <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Powered by RunwayML Gen-4 Turbo & Google Neural AI</span>
          </div>
          <h1 className="hero-title">
            Turn Ideas Into
            <span className="gradient-text"> Stunning AI Videos</span>
          </h1>
          <p className="hero-description">
            No editing skills. No expensive software. Just describe your vision and watch it come to life.
            Professional-quality videos in minutes, powered by cutting-edge AI.
          </p>
          <div className="hero-actions">
            <button onClick={handleGetStarted} className="btn-primary-large">
              Start Creating Free
              <ArrowRight size={20} />
            </button>
            <button className="btn-secondary-large" onClick={() => window.open('https://youtu.be/demo', '_blank')}>
              <Play size={20} />
              Watch Demo
            </button>
          </div>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">{stat.icon}</div>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-glow"></div>
          <div className="visual-card card-1">
            <Video size={40} />
            <p>AI Video Generation</p>
            <span className="card-badge">Gen-4 Turbo</span>
          </div>
          <div className="visual-card card-2">
            <Mic size={40} />
            <p>Neural Voice Synthesis</p>
            <span className="card-badge">7+ Languages</span>
          </div>
          <div className="visual-card card-3">
            <Zap size={40} />
            <p>Lightning Fast</p>
            <span className="card-badge">2-5 Min</span>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="trusted-section">
        <p className="trusted-label">Trusted by creators, marketers, and businesses worldwide</p>
        <div className="trusted-logos">
          <div className="logo-placeholder">🎬 Content Studios</div>
          <div className="logo-placeholder">📱 Social Media Agencies</div>
          <div className="logo-placeholder">🎓 EdTech Platforms</div>
          <div className="logo-placeholder">🏢 Enterprises</div>
        </div>
      </section>

      {/* Horizontal Scroll Features */}
      <section id="features" className="horizontal-features-section">
        <div className="horizontal-intro">
          <h2 className="section-title">Everything You Need to Create</h2>
          <p className="section-subtitle">
            Scroll through our powerful features designed for creators who demand quality and speed
          </p>
        </div>
        <div className="horizontal-scroll-wrapper">
          <div className="horizontal-scroll-container" ref={horizontalRef}>
            {horizontalFeatures.map((feature, index) => (
              <div key={index} className="horizontal-feature-card">
                <div className="feature-visual">
                  <span className="feature-emoji">{feature.image}</span>
                  <div className="feature-icon-circle">{feature.icon}</div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="scroll-hint">← Scroll horizontally to explore →</div>
      </section>

      {/* Use Cases */}
      <section className="use-cases-section">
        <div className="section-container">
          <h2 className="section-title">Built for Every Creator</h2>
          <p className="section-subtitle">From solo creators to enterprise teams, Shreevid AI scales with your needs</p>
          <div className="use-cases-grid">
            {useCases.map((useCase, index) => (
              <div key={index} className="use-case-card">
                <div className="use-case-icon">{useCase.icon}</div>
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your needs. Credits never expire. No hidden fees.</p>
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

      {/* Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <h2 className="section-title">Loved by Creators Worldwide</h2>
          <p className="section-subtitle">Join thousands who've transformed their content creation workflow</p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <Quote size={32} className="quote-icon" />
                <div className="stars">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f39c12" color="#f39c12" />
                  ))}
                </div>
                <p className="testimonial-text">{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div>
                    <p className="author-name">{testimonial.name}</p>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="faq-section">
        <div className="section-container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Everything you need to know about Shreevid AI</p>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <button 
                  className="faq-question"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={20} className={`chevron ${activeFaq === index ? 'rotate' : ''}`} />
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Create Your First AI Video?</h2>
          <p>Join 2,000+ creators using Shreevid AI to bring their ideas to life. Start free today.</p>
          <button onClick={handleGetStarted} className="btn-cta">
            Get Started Free
            <ArrowRight size={20} />
          </button>
          <p className="cta-subtext">✓ No credit card required  ✓ 125 free credits  ✓ Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">S</div>
              <span>Shreevid AI</span>
            </div>
            <p>Professional AI-powered video generation platform. Turn ideas into stunning videos in minutes.</p>
            <div className="social-links">
              <a href="https://twitter.com/shreevid" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com/company/shreevid" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/priority-technologies" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="mailto:support@shreevid.ai" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/dashboard">Dashboard</a>
            <a href="#faq">FAQ</a>
            <a href="#">API Docs</a>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
            <a href="#">Press Kit</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Acceptable Use</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Community</a>
            <a href="#">Status</a>
            <a href="#">Report Bug</a>
            <a href="mailto:support@shreevid.ai">Contact Support</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Shreevid AI by Priority Technologies Inc. All rights reserved.</p>
          <p className="footer-tagline">Made with ❤️ for creators worldwide</p>
        </div>
      </footer>
    </div>
  );
}
