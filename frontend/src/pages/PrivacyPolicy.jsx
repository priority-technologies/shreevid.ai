import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Globe } from 'lucide-react';
import '../styles/LegalPages.css';

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

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      <nav className="legal-nav">
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

      <div className="legal-content">
        <div className="legal-header">
          <Shield size={48} className="header-icon" />
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: December 8, 2025</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2><Lock size={24} /> Information We Collect</h2>
            <p>At Shreevid AI, we are committed to protecting your privacy. We collect the following types of information:</p>
            
            <h3>Personal Information</h3>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
              <li><strong>Payment Information:</strong> Credit card details and billing address (processed securely through our payment providers)</li>
              <li><strong>Profile Data:</strong> Any additional information you choose to provide</li>
            </ul>

            <h3>Usage Information</h3>
            <ul>
              <li><strong>Video Generation Data:</strong> Prompts, scripts, and videos you create using our platform</li>
              <li><strong>Usage Analytics:</strong> How you interact with our service, features used, and generation history</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Database size={24} /> How We Use Your Information</h2>
            <p>We use your information for the following purposes:</p>
            <ul>
              <li><strong>Service Delivery:</strong> To provide, maintain, and improve our AI video generation services</li>
              <li><strong>Video Generation:</strong> To process your prompts through RunwayML and Google Cloud APIs</li>
              <li><strong>Account Management:</strong> To manage your account, credits, and subscription</li>
              <li><strong>Payment Processing:</strong> To process transactions and prevent fraud</li>
              <li><strong>Communication:</strong> To send service updates, billing notifications, and support messages</li>
              <li><strong>Analytics:</strong> To understand usage patterns and improve our platform</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Eye size={24} /> Information Sharing</h2>
            <p>We do not sell your personal information. We may share your data with:</p>
            
            <h3>Service Providers</h3>
            <ul>
              <li><strong>RunwayML:</strong> For AI video generation (your prompts and videos)</li>
              <li><strong>Google Cloud:</strong> For text-to-speech and infrastructure services</li>
              <li><strong>Payment Processors:</strong> For secure payment processing</li>
              <li><strong>Cloud Hosting:</strong> For data storage and platform hosting (Google Cloud Platform)</li>
            </ul>

            <h3>Legal Requirements</h3>
            <p>We may disclose information if required by law, court order, or to protect our rights and safety.</p>
          </section>

          <section className="legal-section">
            <h2><Lock size={24} /> Data Security</h2>
            <p>We implement industry-standard security measures to protect your information:</p>
            <ul>
              <li><strong>Encryption:</strong> All data is encrypted in transit (HTTPS/TLS) and at rest</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication mechanisms</li>
              <li><strong>Secure Infrastructure:</strong> Hosted on Google Cloud Platform with enterprise-grade security</li>
              <li><strong>Regular Audits:</strong> Regular security assessments and updates</li>
              <li><strong>Password Protection:</strong> Passwords are hashed using industry-standard algorithms</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><Globe size={24} /> Your Rights</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Export:</strong> Download your generated videos and data</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
            </ul>
            <p className="contact-info">To exercise these rights, contact us at: <strong>privacy@shreevid.ai</strong></p>
          </section>

          <section className="legal-section">
            <h2>Data Retention</h2>
            <p>We retain your information as follows:</p>
            <ul>
              <li><strong>Account Data:</strong> Until you delete your account</li>
              <li><strong>Generated Videos:</strong> Stored for 90 days unless you delete them earlier</li>
              <li><strong>Transaction History:</strong> Retained for 7 years for tax and accounting purposes</li>
              <li><strong>Usage Analytics:</strong> Aggregated and anonymized data retained indefinitely</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Maintain your login session</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
              <li>Improve platform performance</li>
            </ul>
            <p>You can control cookies through your browser settings. See our <span className="link" onClick={() => navigate('/cookie-policy')}>Cookie Policy</span> for more details.</p>
          </section>

          <section className="legal-section">
            <h2>Third-Party Services</h2>
            <p>Our platform integrates with third-party services that have their own privacy policies:</p>
            <ul>
              <li><strong>RunwayML:</strong> AI video generation - <a href="https://runwayml.com/privacy" target="_blank" rel="noopener noreferrer">RunwayML Privacy Policy</a></li>
              <li><strong>Google Cloud:</strong> Infrastructure and TTS - <a href="https://cloud.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Cloud Privacy</a></li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Children's Privacy</h2>
            <p>Our service is not intended for users under 18 years of age. We do not knowingly collect information from children. If you are a parent and believe your child has provided us with personal information, please contact us.</p>
          </section>

          <section className="legal-section">
            <h2>International Users</h2>
            <p>Our services are operated from India. If you are located outside India, your information will be transferred to and processed in India. By using our services, you consent to this transfer.</p>
          </section>

          <section className="legal-section">
            <h2>Changes to Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the platform. Your continued use of the service after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section className="legal-section">
            <h2>Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our data practices, contact us:</p>
            <div className="contact-box">
              <p><strong>Email:</strong> privacy@shreevid.ai</p>
              <p><strong>Support:</strong> support@shreevid.ai</p>
              <p><strong>Address:</strong> Priority Technologies, India</p>
            </div>
          </section>
        </div>
      </div>

      <footer className="legal-footer">
        <p>&copy; 2025 Shreevid AI by Priority Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
