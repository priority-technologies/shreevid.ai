import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Book, MessageCircle, Video, FileText, Mail } from 'lucide-react';
import '../styles/SupportPages.css';

const ShreevIdLogo = ({ className = "" }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={className}>
    <defs>
      <linearGradient id="brain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7800da" />
        <stop offset="50%" stopColor="#e63589" />
        <stop offset="100%" stopColor="#fe0307" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="12" r="6" fill="url(#brain-grad)" opacity="0.9" />
    <path d="M 8 18 Q 8 24 16 26 Q 24 24 24 18" stroke="url(#brain-grad)" strokeWidth="2" fill="none" />
    <circle cx="10" cy="10" r="2" fill="url(#brain-grad)" opacity="0.6" />
    <circle cx="22" cy="10" r="2" fill="url(#brain-grad)" opacity="0.6" />
    <path d="M 16 4 L 17 8 L 21 9 L 18 12 L 19 16 L 16 14 L 13 16 L 14 12 L 11 9 L 15 8" fill="url(#brain-grad)" opacity="0.7" />
  </svg>
);

export default function HelpCenter() {
  const navigate = useNavigate();

  const helpCategories = [
    {
      icon: <Book size={32} />,
      title: "Getting Started",
      articles: [
        { title: "How to create your first video", link: "#" },
        { title: "Understanding the credit system", link: "#" },
        { title: "Setting up your account", link: "#" },
        { title: "Choosing the right subscription plan", link: "#" }
      ]
    },
    {
      icon: <Video size={32} />,
      title: "Video Generation",
      articles: [
        { title: "Writing effective prompts", link: "#" },
        { title: "Generating videos with AI", link: "#" },
        { title: "Adding voiceovers to videos", link: "#" },
        { title: "Customizing thumbnails", link: "#" }
      ]
    },
    {
      icon: <MessageCircle size={32} />,
      title: "Account & Billing",
      articles: [
        { title: "How to purchase credits", link: "#" },
        { title: "Upgrading your subscription", link: "#" },
        { title: "Managing payment methods", link: "#" },
        { title: "Understanding invoices", link: "#" }
      ]
    },
    {
      icon: <FileText size={32} />,
      title: "Troubleshooting",
      articles: [
        { title: "Video generation fails", link: "#" },
        { title: "Payment issues", link: "#" },
        { title: "Login problems", link: "#" },
        { title: "Quality concerns", link: "#" }
      ]
    }
  ];

  const faqs = [
    {
      question: "How many credits does a video cost?",
      answer: "On average, a 5-second video costs approximately 65 credits. Longer videos or higher quality settings may use more credits."
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 7-day money-back guarantee on your first subscription if you haven't used any credits. See our Refund Policy for details."
    },
    {
      question: "Do credits expire?",
      answer: "No, purchased credits do not expire. However, accounts inactive for extended periods may be subject to review."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from the Settings page. Your access continues until the end of the current billing period."
    },
    {
      question: "Can I download my generated videos?",
      answer: "Yes! All videos you generate are available for download. Videos are stored for 90 days unless deleted earlier."
    }
  ];

  return (
    <div className="support-page">
      <nav className="support-nav">
        <div className="nav-container">
          <div className="nav-brand" onClick={() => navigate('/')}>
            <ShreevIdLogo />
            <span>Shreevid AI</span>
          </div>
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </nav>

      <div className="support-content">
        <div className="support-header">
          <HelpCircle size={48} className="header-icon" />
          <h1>Help Center</h1>
          <p className="subtitle">Find answers to your questions and get the help you need</p>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search for help articles..." 
            className="help-search"
          />
        </div>

        {/* Help Categories */}
        <div className="help-categories">
          {helpCategories.map((category, idx) => (
            <div key={idx} className="help-category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.title}</h3>
              <ul>
                {category.articles.map((article, i) => (
                  <li key={i}>
                    <a href={article.link}>{article.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular FAQs */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="contact-support">
          <Mail size={48} />
          <h2>Still need help?</h2>
          <p>Our support team is here to assist you</p>
          <div className="contact-buttons">
            <a href="mailto:support@shreevid.ai" className="contact-btn primary">
              Email Support
            </a>
            <button onClick={() => navigate('/dashboard')} className="contact-btn secondary">
              Go to Dashboard
            </button>
          </div>
          <p className="response-time">Average response time: 24 hours</p>
        </section>
      </div>

      <footer className="support-footer">
        <p>&copy; 2025 Shreevid AI by Priority Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
