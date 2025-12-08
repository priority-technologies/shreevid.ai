import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  CheckCircle,
  ChevronDown,
  Gauge,
  Github,
  Globe,
  Linkedin,
  Mail,
  Menu,
  Mic,
  Play,
  Quote,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Video,
  Wand2,
  X,
  Zap,
} from "lucide-react";

import "../styles/LandingPage.css";

// Shreevid AI Brain Logo Component
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
    {/* Brain outline with gradient */}
    <circle cx="16" cy="12" r="6" fill="url(#brain-grad)" opacity="0.9" />
    <path
      d="M 8 18 Q 8 24 16 26 Q 24 24 24 18"
      stroke="url(#brain-grad)"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="10" cy="10" r="2" fill="url(#brain-grad)" opacity="0.6" />
    <circle cx="22" cy="10" r="2" fill="url(#brain-grad)" opacity="0.6" />
    {/* Spark effect */}
    <path
      d="M 16 4 L 17 8 L 21 9 L 18 12 L 19 16 L 16 14 L 13 16 L 14 12 L 11 9 L 15 8"
      fill="url(#brain-grad)"
      opacity="0.7"
    />
  </svg>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const horizontalRef = useRef(null);
  const horizontalSectionRef = useRef(null);

  const handleGetStarted = () => {
    navigate("/signup");
  };

  // Smooth scrolling enabled - horizontal scroll-jacking removed
  // Horizontal scroll features
  const horizontalFeatures = [
    {
      icon: <Brain size={48} />,
      title: "AI-Powered Prompts",
      description:
        "Describe your vision in natural language. Our AI understands context, tone, and intent to generate exactly what you imagine.",
      image: "🎨",
    },
    {
      icon: <Video size={48} />,
      title: "RunwayML Gen-4 Turbo",
      description:
        "Leverage cutting-edge generative AI from RunwayML to create photorealistic videos with stunning clarity and motion.",
      image: "🎬",
    },
    {
      icon: <Mic size={48} />,
      title: "Google Neural Voice",
      description:
        "Add lifelike narration with Google Cloud's Neural2 TTS. Choose from multiple voices and languages for global reach.",
      image: "🎙️",
    },
    {
      icon: <Wand2 size={48} />,
      title: "Instant Composition",
      description:
        "Automated video editing, transitions, and effects. No timeline scrubbing or complex software—just pure creativity.",
      image: "✨",
    },
    {
      icon: <Gauge size={48} />,
      title: "Lightning Fast",
      description:
        "From prompt to final render in minutes. Optimized pipeline ensures you spend less time waiting, more time creating.",
      image: "⚡",
    },
    {
      icon: <Globe size={48} />,
      title: "Multi-Language Support",
      description:
        "Create videos in 7+ languages with region-specific voices. Perfect for global marketing and localized content.",
      image: "🌍",
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "10",
      priceINR: "830",
      credits: "1,000",
      videos: "~15 videos",
      features: [
        "1,000 Credits",
        "AI Video + Voice",
        "~15 Videos (5-sec)",
        "HD Quality (1080p)",
        "Instant Delivery",
        "Email Support",
      ],
      highlighted: false,
      savings: null,
    },
    {
      name: "Creator",
      price: "25",
      priceINR: "2,075",
      credits: "3,000",
      videos: "~46 videos",
      features: [
        "3,000 Credits",
        "AI Video + Voice",
        "~46 Videos (5-sec)",
        "Priority Processing",
        "HD Quality (1080p)",
        "Priority Support",
      ],
      highlighted: true,
      savings: "16% OFF",
    },
    {
      name: "Professional",
      price: "60",
      priceINR: "4,980",
      credits: "7,500",
      videos: "~115 videos",
      features: [
        "7,500 Credits",
        "AI Video + Voice",
        "~115 Videos (5-sec)",
        "Fastest Processing",
        "Full HD Quality",
        "Premium Support",
      ],
      highlighted: false,
      savings: "20% OFF",
    },
    {
      name: "Enterprise",
      price: "150",
      priceINR: "12,450",
      credits: "20,000",
      videos: "~307 videos",
      features: [
        "20,000 Credits",
        "AI Video + Voice",
        "~307 Videos (5-sec)",
        "API Access",
        "Dedicated Support",
        "White Label Option",
      ],
      highlighted: false,
      savings: "25% OFF",
    },
  ];

  const competitors = [
    { name: "Synthesia", price: "~$2.00", savings: "67%" },
    { name: "D-ID", price: "~$1.50", savings: "57%" },
    { name: "HeyGen", price: "~$1.80", savings: "64%" },
    { name: "Shreevid AI", price: "$0.65", highlight: true },
  ];

  const stats = [
    { label: "Videos Created", value: "10,000+", icon: <Video size={24} /> },
    { label: "Happy Creators", value: "2,000+", icon: <Users size={24} /> },
    { label: "Credits Issued", value: "1M+", icon: <Zap size={24} /> },
    { label: "Avg. Rating", value: "4.9/5", icon: <Star size={24} /> },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Content Creator",
      avatar: "SM",
      text: "Shreevid AI completely transformed my workflow. What used to take days now takes minutes. The quality is incredible!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Marketing Director",
      avatar: "RK",
      text: "We produce 20+ videos weekly for our campaigns. Shreevid AI is a game-changer—fast, affordable, and professional results.",
      rating: 5,
    },
    {
      name: "Emily Chen",
      role: "Entrepreneur",
      avatar: "EC",
      text: "As a solo founder, I needed something that just works. Shreevid AI delivers every time. Best investment for my business.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "How does the credit system work?",
      answer:
        "Each video generation costs credits based on duration and quality. For example, a 10-second HD video costs approximately 10 credits. You can purchase credits in bundles and they never expire.",
    },
    {
      question: "What AI models power Shreevid?",
      answer:
        "We use RunwayML Gen-4 Turbo for video generation and Google Cloud Neural2 for text-to-speech. Both are industry-leading AI models ensuring top-tier quality.",
    },
    {
      question: "Can I use the videos commercially?",
      answer:
        "Yes! All videos generated are yours to use commercially without attribution. Perfect for marketing, social media, presentations, and more.",
    },
    {
      question: "How long does video generation take?",
      answer:
        "Most videos are ready in 2-5 minutes depending on length and complexity. Enterprise users get priority processing for even faster turnaround.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a satisfaction guarantee. If you're not happy with your first video, contact us within 7 days for a full refund—no questions asked.",
    },
    {
      question: "Is there an API available?",
      answer:
        "Yes! Enterprise plans include full API access. Integrate Shreevid AI directly into your apps, workflows, or automation pipelines.",
    },
  ];

  const useCases = [
    {
      icon: <TrendingUp size={32} />,
      title: "Marketing & Ads",
      description:
        "Create product demos, explainer videos, and social media ads in minutes",
    },
    {
      icon: <Users size={32} />,
      title: "Education & Training",
      description:
        "Build engaging educational content and training materials at scale",
    },
    {
      icon: <Sparkles size={32} />,
      title: "Content Creation",
      description:
        "YouTube videos, Instagram reels, TikTok content—produce more, faster",
    },
    {
      icon: <Shield size={32} />,
      title: "Corporate Communications",
      description:
        "Internal announcements, onboarding videos, and company updates",
    },
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate("/")}>
            <ShreevIdLogo className="shreevid-icon" />
            <span className="logo-text">Shreevid AI</span>
          </div>
          <div className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <button
              onClick={() => {navigate("/pricing"); setMobileMenuOpen(false);}}
              className="nav-link-btn"
            >
              Pricing
            </button>
            <a href="#testimonials" onClick={() => setMobileMenuOpen(false)}>
              Testimonials
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>
              FAQ
            </a>
            <button
              onClick={() => navigate("/login")}
              className="btn-nav-login"
            >
              Login
            </button>
            <button onClick={handleGetStarted} className="btn-nav-signup">
              Get Started Free
            </button>
          </div>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
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
            No editing skills. No expensive software. Just describe your vision
            and watch it come to life. Professional-quality videos in minutes,
            powered by cutting-edge AI.
          </p>
          <div className="hero-actions">
            <button onClick={handleGetStarted} className="btn-primary-large">
              Start Creating Free
              <ArrowRight size={20} />
            </button>
            <button
              className="btn-secondary-large"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  "_blank",
                )
              }
            >
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
        <p className="trusted-label">
          Trusted by creators, marketers, and businesses worldwide
        </p>
        <div className="trusted-logos">
          <div className="logo-placeholder">🎬 Content Studios</div>
          <div className="logo-placeholder">📱 Social Media Agencies</div>
          <div className="logo-placeholder">🎓 EdTech Platforms</div>
          <div className="logo-placeholder">🏢 Enterprises</div>
        </div>
      </section>

      {/* Horizontal Scroll Features */}
      <section
        id="features"
        className="horizontal-features-section"
        ref={horizontalSectionRef}
      >
        <div className="horizontal-intro">
          <h2 className="section-title">Everything You Need to Create</h2>
          <p className="section-subtitle">
            Scroll through our powerful features designed for creators who
            demand quality and speed
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
          <p className="section-subtitle">
            From solo creators to enterprise teams, Shreevid AI scales with your
            needs
          </p>
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

      {/* Competitive Pricing Comparison */}
      <section className="comparison-section">
        <div className="section-container">
          <h2 className="section-title">Industry-Leading Value</h2>
          <p className="section-subtitle">
            60-70% cheaper than competitors. Same AI quality, better price.
          </p>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="header-item">Platform</div>
              <div className="header-item">Cost per 5-sec Video</div>
              <div className="header-item">You Save</div>
            </div>
            {competitors.map((comp, index) => (
              <div
                key={index}
                className={`comparison-row ${comp.highlight ? "highlight" : ""}`}
              >
                <div className="comp-name">
                  {comp.highlight && <Star size={18} fill="#3b82f6" color="#3b82f6" />}
                  {comp.name}
                </div>
                <div className="comp-price">{comp.price}</div>
                <div className="comp-savings">
                  {comp.savings ? (
                    <span className="savings-badge">{comp.savings} cheaper</span>
                  ) : comp.highlight ? (
                    <span className="best-value">Best Value</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">
            Pay only for what you use. No subscriptions. Credits never expire.
          </p>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`pricing-card ${plan.highlighted ? "highlighted" : ""}`}
              >
                {plan.highlighted && (
                  <div className="badge-popular">Most Popular</div>
                )}
                {plan.savings && (
                  <div className="badge-savings">{plan.savings}</div>
                )}
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="currency">$</span>
                  <span className="amount">{plan.price}</span>
                </div>
                <p className="credits-info">{plan.credits} Credits</p>
                <p className="videos-info">{plan.videos}</p>
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
                  className={
                    plan.highlighted
                      ? "btn-pricing-primary"
                      : "btn-pricing-secondary"
                  }
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
          <p className="section-subtitle">
            Join thousands who've transformed their content creation workflow
          </p>
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
          <p className="section-subtitle">
            Everything you need to know about Shreevid AI
          </p>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeFaq === index ? "active" : ""}`}
              >
                <button
                  className="faq-question"
                  onClick={() =>
                    setActiveFaq(activeFaq === index ? null : index)
                  }
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`chevron ${activeFaq === index ? "rotate" : ""}`}
                  />
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
          <p>
            Join 2,000+ creators using Shreevid AI to bring their ideas to life.
            Start free today.
          </p>
          <button onClick={handleGetStarted} className="btn-cta">
            Get Started Free
            <ArrowRight size={20} />
          </button>
          <p className="cta-subtext">
            ✓ No credit card required ✓ 125 free credits ✓ Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <ShreevIdLogo />
              <span>Shreevid AI</span>
            </div>
            <p>
              Professional AI-powered video generation platform. Turn ideas into
              stunning videos in minutes.
            </p>
            <img
              src="/White.png"
              alt="Priority Technologies"
              className="priority-logo-footer"
              title="Priority Technologies Inc"
            />
            <p className="footer-tagline-small">
              A brand of Priority Technologies Inc.
            </p>
            <div className="social-links">
              <a
                href="https://www.linkedin.com/company/prioritytechnologiesinc/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="Priority Technologies LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://www.instagram.com/priority_technologies_inc/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Priority Technologies Instagram"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <circle cx="17.5" cy="6.5" r="1.5"></circle>
                </svg>
              </a>
              <a
                href="https://github.com/priority-technologies"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="Priority Technologies GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="mailto:info@prioritytechnologiess.com"
                aria-label="Email"
                title="Contact Priority Technologies"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <button onClick={() => navigate('/pricing')} className="footer-link">Pricing</button>
            <button onClick={() => navigate('/dashboard')} className="footer-link">Dashboard</button>
            <a href="#faq">FAQ</a>
            <a href="#" className="footer-disabled">API Docs</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <button onClick={() => navigate('/privacy-policy')} className="footer-link">Privacy Policy</button>
            <button onClick={() => navigate('/terms-of-service')} className="footer-link">Terms of Service</button>
            <button onClick={() => navigate('/refund-policy')} className="footer-link">Refund Policy</button>
            <button onClick={() => navigate('/cookie-policy')} className="footer-link">Cookie Policy</button>
            <button onClick={() => navigate('/acceptable-use')} className="footer-link">Acceptable Use</button>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <button onClick={() => navigate('/help-center')} className="footer-link">Help Center</button>
            <a href="#" className="footer-disabled">Community</a>
            <a href="#" className="footer-disabled">Status</a>
            <a href="#" className="footer-disabled">Report Bug</a>
            <a href="mailto:support@shreevid.ai">Contact Support</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; 2025 Shreevid AI Powered By Priority Technologies Inc. All
            Rights Reserved.
          </p>
          <p className="footer-tagline">Made with ❤️ for creators worldwide</p>
        </div>
      </footer>
    </div>
  );
}
