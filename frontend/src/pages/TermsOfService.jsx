import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, AlertCircle, CreditCard, Ban } from 'lucide-react';
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

export default function TermsOfService() {
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
          <FileText size={48} className="header-icon" />
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: December 8, 2025</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2>1. Agreement to Terms</h2>
            <p>By accessing or using Shreevid AI ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our Service.</p>
            <p>These Terms constitute a legally binding agreement between you and Priority Technologies ("Company", "we", "us", or "our").</p>
          </section>

          <section className="legal-section">
            <h2>2. Service Description</h2>
            <p>Shreevid AI is an AI-powered video generation platform that allows users to:</p>
            <ul>
              <li>Generate videos from text prompts using AI technology</li>
              <li>Create voiceovers with text-to-speech capabilities</li>
              <li>Generate thumbnails and compose final videos</li>
              <li>Manage projects and video generation history</li>
            </ul>
            <p>We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.</p>
          </section>

          <section className="legal-section">
            <h2>3. Account Registration</h2>
            <h3>Eligibility</h3>
            <ul>
              <li>You must be at least 18 years old to use this Service</li>
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>One person or entity may not maintain multiple accounts</li>
            </ul>

            <h3>Account Security</h3>
            <ul>
              <li>Keep your password confidential and secure</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>You are responsible for all activities under your account</li>
              <li>We are not liable for losses from unauthorized use</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><CreditCard size={24} /> 4. Credits and Billing</h2>
            
            <h3>Credit System</h3>
            <ul>
              <li><strong>1 Credit = $0.01 USD</strong></li>
              <li>Free tier includes 65 credits upon signup (1 video)</li>
              <li>Credits are consumed based on video generation length and quality</li>
              <li>Estimated cost: ~65 credits per 5-second video</li>
              <li>Credits are non-refundable and non-transferable</li>
              <li>Unused credits do not expire but may be subject to inactivity policies</li>
            </ul>

            <h3>Subscription Plans</h3>
            <ul>
              <li><strong>Free Plan:</strong> 65 credits (1 video)</li>
              <li><strong>Starter Plan:</strong> $10/month - 1,000 credits (~15 videos)</li>
              <li><strong>Creator Plan:</strong> $25/month - 3,000 credits (~46 videos)</li>
              <li><strong>Pro Plan:</strong> $60/month - 7,500 credits (~115 videos)</li>
              <li><strong>Enterprise Plan:</strong> $150/month - 20,000 credits (~307 videos)</li>
            </ul>

            <h3>Credit Bundles (One-time Purchase)</h3>
            <ul>
              <li><strong>Small Bundle:</strong> $15 - 1,000 credits (~15 videos)</li>
              <li><strong>Medium Bundle:</strong> $30 - 2,500 credits (~38 videos) - 20% OFF</li>
              <li><strong>Large Bundle:</strong> $55 - 5,000 credits (~76 videos) - 27% OFF</li>
              <li><strong>XL Bundle:</strong> $100 - 10,000 credits (~153 videos) - 33% OFF</li>
            </ul>

            <h3>Payment Terms</h3>
            <ul>
              <li>Subscriptions are billed monthly in advance</li>
              <li>Prices are in USD (INR conversion at ₹83 per $1)</li>
              <li>All payments are processed securely through our payment provider</li>
              <li>Failed payments may result in service suspension</li>
              <li>You authorize us to charge your payment method automatically</li>
            </ul>

            <h3>Cancellation</h3>
            <ul>
              <li>You may cancel your subscription at any time</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>No refunds for partial months</li>
              <li>Unused credits remain available until account deletion</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Acceptable Use Policy</h2>
            <p>You agree NOT to use the Service to create, upload, or generate content that:</p>
            
            <div className="warning-box">
              <AlertCircle size={24} />
              <div>
                <h3>Prohibited Content</h3>
                <ul>
                  <li><strong>Illegal Content:</strong> Violates any laws or regulations</li>
                  <li><strong>Harmful Content:</strong> Promotes violence, terrorism, or harm to individuals</li>
                  <li><strong>Hateful Content:</strong> Contains hate speech, discrimination, or harassment</li>
                  <li><strong>Sexual Content:</strong> Pornographic, sexually explicit, or exploitative material</li>
                  <li><strong>Deceptive Content:</strong> Deepfakes, misinformation, or impersonation</li>
                  <li><strong>Intellectual Property Violations:</strong> Infringes on copyrights, trademarks, or other IP rights</li>
                  <li><strong>Spam/Malware:</strong> Contains viruses, spam, or malicious code</li>
                  <li><strong>Child Exploitation:</strong> Any content involving minors inappropriately</li>
                  <li><strong>Privacy Violations:</strong> Shares private information without consent</li>
                </ul>
              </div>
            </div>

            <h3>Additional Restrictions</h3>
            <ul>
              <li>Do not reverse engineer or attempt to extract our AI models</li>
              <li>Do not use automated systems to abuse the Service</li>
              <li>Do not resell or redistribute our Service without permission</li>
              <li>Do not attempt to bypass credit limits or security measures</li>
              <li>Do not overload or interfere with Service infrastructure</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Intellectual Property</h2>
            
            <h3>Your Content</h3>
            <ul>
              <li>You retain ownership of content you create using the Service</li>
              <li>You grant us a license to process and store your content to provide the Service</li>
              <li>You are responsible for ensuring you have rights to any input content (prompts, scripts)</li>
              <li>You warrant that your content does not infringe on third-party rights</li>
            </ul>

            <h3>Our Platform</h3>
            <ul>
              <li>The Service, including all code, design, and branding, is owned by Priority Technologies</li>
              <li>You may not copy, modify, or distribute our platform</li>
              <li>Our trademarks and logos are protected and may not be used without permission</li>
            </ul>

            <h3>AI-Generated Content</h3>
            <ul>
              <li>Videos are generated using RunwayML's AI models</li>
              <li>You receive a commercial license to use generated videos</li>
              <li>We do not claim ownership of your AI-generated content</li>
              <li>You should review third-party AI provider terms (RunwayML, Google)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Content Moderation</h2>
            <p>We reserve the right to:</p>
            <ul>
              <li>Review and monitor content generated on our platform</li>
              <li>Remove content that violates these Terms</li>
              <li>Suspend or terminate accounts for violations</li>
              <li>Report illegal content to authorities</li>
              <li>Use automated systems to detect policy violations</li>
            </ul>
            <p className="notice">We are not obligated to monitor content but reserve the right to do so.</p>
          </section>

          <section className="legal-section">
            <h2><Ban size={24} /> 8. Termination</h2>
            
            <h3>By You</h3>
            <ul>
              <li>You may delete your account at any time from Settings</li>
              <li>Deletion is permanent and cannot be undone</li>
              <li>All your data and generated videos will be deleted</li>
              <li>No refunds will be issued upon voluntary termination</li>
            </ul>

            <h3>By Us</h3>
            <p>We may suspend or terminate your account if:</p>
            <ul>
              <li>You violate these Terms or our policies</li>
              <li>Payment fails or fraud is suspected</li>
              <li>Your account is inactive for an extended period</li>
              <li>We discontinue the Service</li>
              <li>Required by law or legal process</li>
            </ul>
            <p>We will provide notice when reasonably possible, except in cases of severe violations or legal requirements.</p>
          </section>

          <section className="legal-section">
            <h2>9. Disclaimers and Limitations</h2>
            
            <h3>Service "As Is"</h3>
            <p>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to:</p>
            <ul>
              <li>Merchantability or fitness for a particular purpose</li>
              <li>Accuracy, reliability, or quality of generated videos</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Security or freedom from viruses</li>
            </ul>

            <h3>AI Limitations</h3>
            <ul>
              <li>AI-generated content may contain errors, inconsistencies, or unexpected results</li>
              <li>We do not guarantee specific quality or outcomes</li>
              <li>Results depend on third-party AI providers (RunwayML)</li>
              <li>You should review and verify AI-generated content before use</li>
            </ul>

            <h3>Limitation of Liability</h3>
            <p>To the maximum extent permitted by law, Priority Technologies shall not be liable for:</p>
            <ul>
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages exceeding the amount you paid in the last 12 months</li>
              <li>Issues arising from third-party services (RunwayML, Google Cloud)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>10. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Priority Technologies, its officers, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from:</p>
            <ul>
              <li>Your use of the Service</li>
              <li>Content you create or upload</li>
              <li>Violation of these Terms</li>
              <li>Infringement of third-party rights</li>
              <li>Your breach of any laws or regulations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>11. Governing Law</h2>
            <ul>
              <li>These Terms are governed by the laws of India</li>
              <li>Disputes will be subject to the exclusive jurisdiction of courts in India</li>
              <li>If any provision is found invalid, the remaining provisions remain in effect</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>12. Changes to Terms</h2>
            <p>We may modify these Terms at any time. We will:</p>
            <ul>
              <li>Notify you of material changes via email or platform notification</li>
              <li>Update the "Last Updated" date at the top</li>
              <li>Give you 30 days' notice for significant changes</li>
              <li>Consider your continued use as acceptance of new Terms</li>
            </ul>
            <p>If you don't agree to the updated Terms, you must stop using the Service.</p>
          </section>

          <section className="legal-section">
            <h2>13. Miscellaneous</h2>
            <ul>
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and Priority Technologies</li>
              <li><strong>No Waiver:</strong> Our failure to enforce any right does not waive that right</li>
              <li><strong>Assignment:</strong> You may not assign these Terms; we may assign them to affiliates or successors</li>
              <li><strong>Force Majeure:</strong> We are not liable for delays due to circumstances beyond our control</li>
              <li><strong>Severability:</strong> Invalid provisions do not affect remaining Terms</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>14. Contact Information</h2>
            <p>For questions about these Terms, contact us:</p>
            <div className="contact-box">
              <p><strong>Email:</strong> legal@shreevid.ai</p>
              <p><strong>Support:</strong> support@shreevid.ai</p>
              <p><strong>Company:</strong> Priority Technologies</p>
              <p><strong>Location:</strong> India</p>
            </div>
          </section>

          <div className="acknowledgment-box">
            <AlertCircle size={24} />
            <p><strong>Acknowledgment:</strong> By using Shreevid AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
          </div>
        </div>
      </div>

      <footer className="legal-footer">
        <p>&copy; 2025 Shreevid AI by Priority Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
