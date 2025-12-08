import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cookie, Settings, Eye, Shield } from 'lucide-react';
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

export default function CookiePolicy() {
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
          <Cookie size={48} className="header-icon" />
          <h1>Cookie Policy</h1>
          <p className="last-updated">Last Updated: December 8, 2025</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2>What Are Cookies?</h2>
            <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help websites remember your preferences, improve your experience, and provide analytics data.</p>
            <p>Shreevid AI uses cookies and similar tracking technologies to enhance your experience and ensure the platform functions properly.</p>
          </section>

          <section className="legal-section">
            <h2>Types of Cookies We Use</h2>
            
            <h3>1. Essential Cookies (Always Active)</h3>
            <div className="cookie-category essential">
              <Shield size={24} />
              <div>
                <p>These cookies are necessary for the platform to function. They cannot be disabled.</p>
                <ul>
                  <li><strong>Authentication:</strong> Keep you logged into your account</li>
                  <li><strong>Session Management:</strong> Maintain your session across pages</li>
                  <li><strong>Security:</strong> Protect against CSRF attacks and unauthorized access</li>
                  <li><strong>Load Balancing:</strong> Distribute traffic across our servers</li>
                </ul>
                <p className="cookie-info"><strong>Duration:</strong> Session cookies (deleted when you close browser) and persistent cookies (up to 30 days)</p>
              </div>
            </div>

            <h3>2. Functional Cookies</h3>
            <div className="cookie-category functional">
              <Settings size={24} />
              <div>
                <p>These cookies remember your preferences and settings.</p>
                <ul>
                  <li><strong>Language Preferences:</strong> Remember your selected language</li>
                  <li><strong>Currency Selection:</strong> Store USD/INR preference</li>
                  <li><strong>UI Preferences:</strong> Dark mode, layout settings</li>
                  <li><strong>Video Settings:</strong> Default quality and duration preferences</li>
                </ul>
                <p className="cookie-info"><strong>Duration:</strong> Up to 1 year</p>
              </div>
            </div>

            <h3>3. Analytics Cookies</h3>
            <div className="cookie-category analytics">
              <Eye size={24} />
              <div>
                <p>These cookies help us understand how users interact with the platform.</p>
                <ul>
                  <li><strong>Usage Statistics:</strong> Track feature usage and popular tools</li>
                  <li><strong>Performance Monitoring:</strong> Identify slow pages and errors</li>
                  <li><strong>User Behavior:</strong> Understand user journeys and drop-off points</li>
                  <li><strong>A/B Testing:</strong> Test new features with user groups</li>
                </ul>
                <p className="cookie-info"><strong>Duration:</strong> Up to 2 years</p>
                <p className="cookie-info"><strong>Note:</strong> Analytics data is aggregated and anonymized</p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>Specific Cookies Used</h2>
            <div className="cookie-table">
              <table>
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Type</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>shreevid_session</code></td>
                    <td>Essential</td>
                    <td>Maintains user login session</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td><code>auth_token</code></td>
                    <td>Essential</td>
                    <td>Authentication token for API requests</td>
                    <td>30 days</td>
                  </tr>
                  <tr>
                    <td><code>csrf_token</code></td>
                    <td>Essential</td>
                    <td>Security protection against CSRF attacks</td>
                    <td>Session</td>
                  </tr>
                  <tr>
                    <td><code>user_preferences</code></td>
                    <td>Functional</td>
                    <td>Stores UI and currency preferences</td>
                    <td>1 year</td>
                  </tr>
                  <tr>
                    <td><code>analytics_id</code></td>
                    <td>Analytics</td>
                    <td>Anonymous user identifier for analytics</td>
                    <td>2 years</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="legal-section">
            <h2>Local Storage and Session Storage</h2>
            <p>In addition to cookies, we use browser storage technologies:</p>
            
            <h3>Local Storage</h3>
            <ul>
              <li><strong>User Settings:</strong> Dashboard layout, theme preferences</li>
              <li><strong>Draft Content:</strong> Unsaved video prompts and scripts (for recovery)</li>
              <li><strong>Cache Data:</strong> Temporary storage to improve performance</li>
            </ul>

            <h3>Session Storage</h3>
            <ul>
              <li><strong>Navigation State:</strong> Current page and navigation history</li>
              <li><strong>Form Data:</strong> Temporary storage of form inputs</li>
              <li><strong>API Responses:</strong> Cached API data for the current session</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Third-Party Cookies</h2>
            <p>Some features on our platform may use third-party services that set their own cookies:</p>
            
            <h3>Payment Processors</h3>
            <ul>
              <li>Used for secure payment processing</li>
              <li>Subject to their own privacy and cookie policies</li>
              <li>Required for completing transactions</li>
            </ul>

            <h3>Cloud Services (Google Cloud Platform)</h3>
            <ul>
              <li>Infrastructure and CDN services</li>
              <li>Load balancing and security features</li>
              <li>See <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">Google's Cookie Policy</a></li>
            </ul>

            <p className="notice"><strong>Note:</strong> We do not use third-party advertising cookies or share data with advertisers.</p>
          </section>

          <section className="legal-section">
            <h2>Managing Cookies</h2>
            
            <h3>Browser Settings</h3>
            <p>You can control cookies through your browser settings. Most browsers allow you to:</p>
            <ul>
              <li>View cookies stored on your device</li>
              <li>Delete existing cookies</li>
              <li>Block all cookies</li>
              <li>Block third-party cookies only</li>
              <li>Delete cookies when you close the browser</li>
            </ul>

            <h3>Browser-Specific Instructions</h3>
            <div className="browser-instructions">
              <div className="browser-card">
                <h4>Google Chrome</h4>
                <ol>
                  <li>Settings → Privacy and security → Cookies</li>
                  <li>Choose your cookie settings</li>
                  <li>Manage exceptions and blocked cookies</li>
                </ol>
              </div>
              <div className="browser-card">
                <h4>Firefox</h4>
                <ol>
                  <li>Settings → Privacy & Security</li>
                  <li>Cookies and Site Data</li>
                  <li>Manage permissions and clear data</li>
                </ol>
              </div>
              <div className="browser-card">
                <h4>Safari</h4>
                <ol>
                  <li>Preferences → Privacy</li>
                  <li>Manage website data</li>
                  <li>Block all cookies or remove specific sites</li>
                </ol>
              </div>
              <div className="browser-card">
                <h4>Microsoft Edge</h4>
                <ol>
                  <li>Settings → Cookies and site permissions</li>
                  <li>Manage and delete cookies</li>
                  <li>Set tracking prevention level</li>
                </ol>
              </div>
            </div>

            <div className="warning-box">
              <Shield size={24} />
              <div>
                <h4>Impact of Blocking Cookies</h4>
                <p>Blocking essential cookies will prevent you from using Shreevid AI. You will not be able to:</p>
                <ul>
                  <li>Log into your account</li>
                  <li>Generate videos</li>
                  <li>Save preferences</li>
                  <li>Make purchases</li>
                </ul>
                <p>We recommend allowing essential cookies while optionally blocking analytics cookies.</p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>Do Not Track (DNT)</h2>
            <p>Some browsers offer a "Do Not Track" (DNT) setting. Currently:</p>
            <ul>
              <li>We respect DNT signals for non-essential cookies</li>
              <li>Essential cookies will still be used (required for functionality)</li>
              <li>Analytics cookies may be disabled when DNT is enabled</li>
            </ul>
            <p>Note: There is no universal standard for DNT, so implementation may vary.</p>
          </section>

          <section className="legal-section">
            <h2>Mobile Devices</h2>
            <p>On mobile devices, cookies work similarly to desktop browsers:</p>
            <ul>
              <li><strong>iOS (Safari):</strong> Settings → Safari → Block All Cookies</li>
              <li><strong>Android (Chrome):</strong> Settings → Site settings → Cookies</li>
              <li><strong>In-App Browsers:</strong> Cookie settings depend on the app</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Cookie Consent</h2>
            <p>By using Shreevid AI, you consent to our use of cookies as described in this policy.</p>
            <ul>
              <li>Essential cookies are automatically set (required for service)</li>
              <li>You can opt out of analytics cookies via browser settings</li>
              <li>We may display a cookie banner for consent in certain regions (e.g., EU)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Data Protection and Privacy</h2>
            <p>Cookie data is subject to our <span className="link" onClick={() => navigate('/privacy-policy')}>Privacy Policy</span>. We:</p>
            <ul>
              <li>Use cookies only for stated purposes</li>
              <li>Do not sell cookie data to third parties</li>
              <li>Encrypt sensitive cookie data</li>
              <li>Regularly review and delete unnecessary cookies</li>
              <li>Comply with data protection regulations</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Updates to Cookie Policy</h2>
            <p>We may update this Cookie Policy to reflect:</p>
            <ul>
              <li>Changes in technology or platform features</li>
              <li>Updates to legal requirements</li>
              <li>Addition or removal of third-party services</li>
            </ul>
            <p>The "Last Updated" date at the top shows when the policy was last modified. Continued use of the platform after updates constitutes acceptance.</p>
          </section>

          <section className="legal-section">
            <h2>Questions About Cookies</h2>
            <p>If you have questions about our use of cookies, contact us:</p>
            <div className="contact-box">
              <p><strong>Email:</strong> privacy@shreevid.ai</p>
              <p><strong>Support:</strong> support@shreevid.ai</p>
              <p><strong>Company:</strong> Priority Technologies, India</p>
            </div>
          </section>

          <div className="summary-box">
            <h3>Quick Summary</h3>
            <ul>
              <li>🍪 We use cookies to improve your experience and platform functionality</li>
              <li>🔒 Essential cookies are required for the service to work</li>
              <li>📊 Analytics cookies help us improve the platform (can be disabled)</li>
              <li>🚫 We do not use advertising or tracking cookies</li>
              <li>⚙️ You can manage cookies in your browser settings</li>
              <li>🛡️ All cookie data is protected and not sold to third parties</li>
            </ul>
          </div>
        </div>
      </div>

      <footer className="legal-footer">
        <p>&copy; 2025 Shreevid AI by Priority Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
