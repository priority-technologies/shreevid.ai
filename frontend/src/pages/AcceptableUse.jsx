import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';
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

export default function AcceptableUse() {
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
          <h1>Acceptable Use Policy</h1>
          <p className="last-updated">Last Updated: December 8, 2025</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2>Purpose</h2>
            <p>This Acceptable Use Policy ("Policy") governs your use of Shreevid AI's video generation platform. It outlines what content and activities are permitted and prohibited on our service.</p>
            <p>By using Shreevid AI, you agree to comply with this Policy. Violations may result in content removal, account suspension, or permanent termination.</p>
          </section>

          <section className="legal-section">
            <h2>Core Principles</h2>
            <p>Shreevid AI is designed to empower creators with AI technology. We expect all users to:</p>
            <div className="principles-grid">
              <div className="principle-card">
                <CheckCircle size={32} />
                <h4>Use Responsibly</h4>
                <p>Create content that is legal, ethical, and respects others' rights</p>
              </div>
              <div className="principle-card">
                <CheckCircle size={32} />
                <h4>Respect Rights</h4>
                <p>Honor intellectual property, privacy, and human dignity</p>
              </div>
              <div className="principle-card">
                <CheckCircle size={32} />
                <h4>Be Transparent</h4>
                <p>Disclose AI-generated content when required or appropriate</p>
              </div>
              <div className="principle-card">
                <CheckCircle size={32} />
                <h4>Follow Laws</h4>
                <p>Comply with all applicable laws and regulations</p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2><XCircle size={24} /> Prohibited Content</h2>
            <p>You may NOT use Shreevid AI to create, upload, or generate any of the following types of content:</p>

            <div className="prohibited-category severe">
              <AlertTriangle size={24} />
              <div>
                <h3>Illegal Content (Zero Tolerance)</h3>
                <p><strong>Immediate termination and reporting to authorities</strong></p>
                <ul>
                  <li><strong>Child Sexual Abuse Material (CSAM):</strong> Any content depicting, promoting, or soliciting sexual exploitation of minors</li>
                  <li><strong>Human Trafficking:</strong> Content promoting or facilitating human trafficking or modern slavery</li>
                  <li><strong>Terrorism:</strong> Content promoting, recruiting for, or instructing terrorist activities</li>
                  <li><strong>Illegal Drugs:</strong> Content promoting illegal drug manufacturing, distribution, or use</li>
                  <li><strong>Weapons Trafficking:</strong> Facilitating illegal sale or distribution of weapons</li>
                </ul>
              </div>
            </div>

            <div className="prohibited-category high">
              <XCircle size={24} />
              <div>
                <h3>Harmful Content</h3>
                <ul>
                  <li><strong>Violence & Gore:</strong> Graphic violence, torture, mutilation, or cruelty</li>
                  <li><strong>Self-Harm:</strong> Content promoting suicide, self-injury, or eating disorders</li>
                  <li><strong>Dangerous Activities:</strong> Instructions for creating weapons, explosives, or harmful substances</li>
                  <li><strong>Animal Cruelty:</strong> Depictions of animal abuse or torture</li>
                  <li><strong>Threats:</strong> Direct threats of violence against individuals or groups</li>
                </ul>
              </div>
            </div>

            <div className="prohibited-category high">
              <XCircle size={24} />
              <div>
                <h3>Hate Speech & Discrimination</h3>
                <ul>
                  <li><strong>Hate Speech:</strong> Content attacking individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
                  <li><strong>Harassment:</strong> Bullying, intimidation, stalking, or sustained targeting of individuals</li>
                  <li><strong>Discrimination:</strong> Content promoting discriminatory practices or ideologies</li>
                  <li><strong>Extremism:</strong> Content promoting violent extremism or supremacist ideologies</li>
                </ul>
              </div>
            </div>

            <div className="prohibited-category high">
              <XCircle size={24} />
              <div>
                <h3>Sexual Content</h3>
                <ul>
                  <li><strong>Pornography:</strong> Sexually explicit content or nudity</li>
                  <li><strong>Sexual Services:</strong> Content soliciting or offering sexual services</li>
                  <li><strong>Non-Consensual Content:</strong> Intimate images or videos shared without consent ("revenge porn")</li>
                  <li><strong>Sexual Exploitation:</strong> Content exploiting individuals sexually</li>
                </ul>
              </div>
            </div>

            <div className="prohibited-category medium">
              <XCircle size={24} />
              <div>
                <h3>Deceptive Content</h3>
                <ul>
                  <li><strong>Deepfakes:</strong> Realistic fake videos of people without their consent, especially public figures or private individuals</li>
                  <li><strong>Misinformation:</strong> Deliberately false information that could cause public harm (health, elections, emergencies)</li>
                  <li><strong>Impersonation:</strong> Pretending to be someone else to deceive or defraud</li>
                  <li><strong>Fraud & Scams:</strong> Content designed to defraud users or steal information</li>
                  <li><strong>Fake Reviews:</strong> Creating deceptive endorsements or reviews</li>
                </ul>
              </div>
            </div>

            <div className="prohibited-category medium">
              <XCircle size={24} />
              <div>
                <h3>Intellectual Property Violations</h3>
                <ul>
                  <li><strong>Copyright Infringement:</strong> Using copyrighted material without permission (music, footage, characters)</li>
                  <li><strong>Trademark Misuse:</strong> Unauthorized use of brands, logos, or trademarks</li>
                  <li><strong>Piracy:</strong> Distributing pirated content or circumventing DRM</li>
                  <li><strong>Unauthorized Adaptations:</strong> Creating derivative works from copyrighted material</li>
                </ul>
              </div>
            </div>

            <div className="prohibited-category medium">
              <XCircle size={24} />
              <div>
                <h3>Privacy Violations</h3>
                <ul>
                  <li><strong>Doxxing:</strong> Sharing personal information (addresses, phone numbers, IDs) without consent</li>
                  <li><strong>Surveillance:</strong> Using the service to stalk or monitor individuals</li>
                  <li><strong>Data Theft:</strong> Content facilitating identity theft or data breaches</li>
                  <li><strong>Non-Consensual Imagery:</strong> Creating videos of people without their knowledge or consent</li>
                </ul>
              </div>
            </div>

            <div className="prohibited-category low">
              <XCircle size={24} />
              <div>
                <h3>Spam & Abuse</h3>
                <ul>
                  <li><strong>Spam:</strong> Mass-generated content for commercial purposes</li>
                  <li><strong>Malware:</strong> Content containing or linking to viruses or malicious software</li>
                  <li><strong>Phishing:</strong> Content designed to steal credentials or sensitive information</li>
                  <li><strong>Link Farming:</strong> Artificially manipulating search rankings or traffic</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>Prohibited Activities</h2>
            <p>You may NOT engage in the following activities:</p>
            
            <h3>Platform Abuse</h3>
            <ul>
              <li><strong>Automated Abuse:</strong> Using bots, scrapers, or automation to abuse the service</li>
              <li><strong>Credit Fraud:</strong> Attempting to manipulate credit systems or billing</li>
              <li><strong>Account Farming:</strong> Creating multiple accounts to circumvent limits</li>
              <li><strong>Rate Limiting Bypass:</strong> Attempting to circumvent usage restrictions</li>
              <li><strong>Infrastructure Attacks:</strong> DDoS attacks or attempts to overload our systems</li>
            </ul>

            <h3>Reverse Engineering</h3>
            <ul>
              <li>Attempting to extract or copy our AI models</li>
              <li>Decompiling or reverse engineering our platform code</li>
              <li>Scraping or downloading content at scale</li>
              <li>Bypassing security measures or access controls</li>
            </ul>

            <h3>Resale & Redistribution</h3>
            <ul>
              <li>Reselling access to our platform without authorization</li>
              <li>White-labeling our service as your own</li>
              <li>Distributing API keys or account credentials</li>
              <li>Creating competing services using our platform</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><CheckCircle size={24} /> Acceptable Use Examples</h2>
            <p>Here are examples of ALLOWED uses of Shreevid AI:</p>

            <div className="allowed-grid">
              <div className="allowed-card">
                <CheckCircle size={24} />
                <h4>Marketing & Advertising</h4>
                <p>Creating promotional videos for products, services, or events</p>
              </div>
              <div className="allowed-card">
                <CheckCircle size={24} />
                <h4>Educational Content</h4>
                <p>Tutorials, explainer videos, e-learning materials, and presentations</p>
              </div>
              <div className="allowed-card">
                <CheckCircle size={24} />
                <h4>Entertainment</h4>
                <p>Creative storytelling, animations, music videos, and artistic projects</p>
              </div>
              <div className="allowed-card">
                <CheckCircle size={24} />
                <h4>Social Media</h4>
                <p>Content for YouTube, Instagram, TikTok, and other platforms (within their rules)</p>
              </div>
              <div className="allowed-card">
                <CheckCircle size={24} />
                <h4>Business Communications</h4>
                <p>Internal training, company updates, investor pitches, and presentations</p>
              </div>
              <div className="allowed-card">
                <CheckCircle size={24} />
                <h4>Personal Projects</h4>
                <p>Family videos, hobby content, personal branding, and creative experiments</p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>AI-Specific Guidelines</h2>
            
            <h3>Deepfakes & Synthetic Media</h3>
            <div className="warning-box">
              <AlertTriangle size={24} />
              <div>
                <h4>Important Restrictions</h4>
                <ul>
                  <li><strong>Public Figures:</strong> Do not create fake videos of politicians, celebrities, or public figures that could mislead</li>
                  <li><strong>Private Individuals:</strong> Do not create videos depicting real people without their consent</li>
                  <li><strong>Disclosure:</strong> Clearly label AI-generated content when sharing publicly</li>
                  <li><strong>Context Matters:</strong> Parody and satire are allowed if clearly labeled and not malicious</li>
                </ul>
              </div>
            </div>

            <h3>Election & Political Content</h3>
            <ul>
              <li>Do not create fake videos of political candidates or officials</li>
              <li>Do not spread election misinformation or voter suppression content</li>
              <li>Political commentary and advocacy are allowed, but must be truthful</li>
              <li>Clearly disclose AI-generated political content</li>
            </ul>

            <h3>Health & Medical Content</h3>
            <ul>
              <li>Do not create content with false medical claims or dangerous health advice</li>
              <li>Do not promote unproven treatments or discourage proven medical care</li>
              <li>General health education is allowed, but cite credible sources</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Content Moderation</h2>
            
            <h3>How We Enforce</h3>
            <ul>
              <li><strong>Automated Detection:</strong> AI systems scan content for policy violations</li>
              <li><strong>User Reports:</strong> Users can report violating content</li>
              <li><strong>Manual Review:</strong> Human reviewers assess flagged content</li>
              <li><strong>Third-Party Providers:</strong> RunwayML also moderates generated content</li>
            </ul>

            <h3>Enforcement Actions</h3>
            <p>Depending on the severity and frequency of violations:</p>
            <ul>
              <li><strong>Warning:</strong> First-time minor violations may receive a warning</li>
              <li><strong>Content Removal:</strong> Violating content will be deleted</li>
              <li><strong>Credit Forfeiture:</strong> Credits used for violations will not be refunded</li>
              <li><strong>Temporary Suspension:</strong> Account access may be suspended (7-30 days)</li>
              <li><strong>Permanent Termination:</strong> Severe or repeated violations result in permanent ban</li>
              <li><strong>Legal Action:</strong> Illegal content will be reported to authorities</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Reporting Violations</h2>
            <p>If you encounter content that violates this Policy:</p>
            
            <h3>How to Report</h3>
            <ol>
              <li>Email <strong>abuse@shreevid.ai</strong> with:
                <ul>
                  <li>Description of the violation</li>
                  <li>Link or identifier of the content</li>
                  <li>Category of violation (hate speech, illegal content, etc.)</li>
                  <li>Your contact information (kept confidential)</li>
                </ul>
              </li>
              <li>We will review the report within 24-48 hours</li>
              <li>You will receive confirmation of receipt</li>
              <li>Action will be taken if the violation is confirmed</li>
            </ol>

            <h3>Protection for Reporters</h3>
            <ul>
              <li>Reporter identities are kept confidential</li>
              <li>No retaliation against good-faith reporters</li>
              <li>False reports may result in consequences for the reporter</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Appeals Process</h2>
            <p>If your content was removed or account was suspended:</p>
            <ol>
              <li>Email <strong>appeals@shreevid.ai</strong> within 30 days</li>
              <li>Explain why you believe the action was incorrect</li>
              <li>Provide any relevant context or evidence</li>
              <li>We will review and respond within 7 business days</li>
            </ol>
            <p className="notice">Appeals are final. Repeated frivolous appeals may be ignored.</p>
          </section>

          <section className="legal-section">
            <h2>Transparency & Disclosure</h2>
            <p>We encourage responsible disclosure of AI-generated content:</p>
            <ul>
              <li>Label videos as "AI-generated" when sharing publicly</li>
              <li>Be transparent about the use of AI tools</li>
              <li>Do not misrepresent AI content as human-created when it matters</li>
              <li>Follow platform-specific disclosure requirements (e.g., YouTube, Facebook)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Your Responsibility</h2>
            <p>As a user of Shreevid AI, you are responsible for:</p>
            <ul>
              <li>Ensuring your content complies with this Policy</li>
              <li>Understanding and following applicable laws</li>
              <li>Obtaining necessary permissions and licenses</li>
              <li>Respecting third-party rights and privacy</li>
              <li>Using the service ethically and responsibly</li>
              <li>Monitoring how your content is used and shared</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Updates to This Policy</h2>
            <p>We may update this Policy to address:</p>
            <ul>
              <li>Emerging types of harmful content</li>
              <li>New AI capabilities and risks</li>
              <li>Changes in laws or regulations</li>
              <li>Community feedback and concerns</li>
            </ul>
            <p>Updates will be posted with a new "Last Updated" date. Continued use constitutes acceptance.</p>
          </section>

          <section className="legal-section">
            <h2>Contact Us</h2>
            <p>For questions about this Acceptable Use Policy:</p>
            <div className="contact-box">
              <p><strong>Report Violations:</strong> abuse@shreevid.ai</p>
              <p><strong>Appeals:</strong> appeals@shreevid.ai</p>
              <p><strong>General Questions:</strong> legal@shreevid.ai</p>
              <p><strong>Support:</strong> support@shreevid.ai</p>
            </div>
          </section>

          <div className="acknowledgment-box">
            <Shield size={24} />
            <p><strong>By using Shreevid AI, you agree to use the service responsibly, ethically, and in compliance with this Acceptable Use Policy. Thank you for helping us maintain a safe and creative platform.</strong></p>
          </div>
        </div>
      </div>

      <footer className="legal-footer">
        <p>&copy; 2025 Shreevid AI by Priority Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
