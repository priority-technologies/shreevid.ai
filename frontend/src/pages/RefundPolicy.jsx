import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, DollarSign, XCircle, CheckCircle } from 'lucide-react';
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

export default function RefundPolicy() {
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
          <RotateCcw size={48} className="header-icon" />
          <h1>Refund Policy</h1>
          <p className="last-updated">Last Updated: December 8, 2025</p>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2>Overview</h2>
            <p>At Shreevid AI, we strive to provide high-quality AI video generation services. This Refund Policy outlines our refund procedures for subscription plans and credit purchases.</p>
            <p className="notice"><strong>Important:</strong> Due to the immediate delivery of digital services and credits, most purchases are non-refundable. Please review this policy carefully before making a purchase.</p>
          </section>

          <section className="legal-section">
            <h2><DollarSign size={24} /> Subscription Plans</h2>
            
            <h3>Monthly Subscriptions</h3>
            <p>Our monthly subscription plans include:</p>
            <ul>
              <li>Starter Plan: $10/month (1,000 credits)</li>
              <li>Creator Plan: $25/month (3,000 credits)</li>
              <li>Pro Plan: $60/month (7,500 credits)</li>
              <li>Enterprise Plan: $150/month (20,000 credits)</li>
            </ul>

            <h3>Subscription Refund Policy</h3>
            <div className="policy-grid">
              <div className="policy-card eligible">
                <CheckCircle size={32} />
                <h4>Eligible for Refund</h4>
                <ul>
                  <li><strong>First Subscription Only:</strong> 7-day money-back guarantee for your first subscription purchase</li>
                  <li><strong>No Credits Used:</strong> You must not have used any of the allocated credits</li>
                  <li><strong>Technical Issues:</strong> Service unavailability for more than 48 hours</li>
                  <li><strong>Billing Errors:</strong> Duplicate charges or incorrect amounts</li>
                </ul>
              </div>

              <div className="policy-card not-eligible">
                <XCircle size={32} />
                <h4>Not Eligible for Refund</h4>
                <ul>
                  <li>Credits have been used (even partially)</li>
                  <li>Renewal subscriptions (after first month)</li>
                  <li>Cancellations after the 7-day period</li>
                  <li>Change of mind after using the service</li>
                  <li>Dissatisfaction with AI-generated quality (subjective)</li>
                </ul>
              </div>
            </div>

            <h3>Subscription Cancellation</h3>
            <ul>
              <li>You may cancel your subscription at any time from your Settings page</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>You will retain access to your plan benefits until the period ends</li>
              <li>Unused credits from the current period will remain available</li>
              <li><strong>No refunds for partial months or unused time</strong></li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Credit Bundles (One-time Purchase)</h2>
            
            <h3>Available Bundles</h3>
            <ul>
              <li>Small Bundle: $15 - 1,000 credits</li>
              <li>Medium Bundle: $30 - 2,500 credits (20% OFF)</li>
              <li>Large Bundle: $55 - 5,000 credits (27% OFF)</li>
              <li>XL Bundle: $100 - 10,000 credits (33% OFF)</li>
            </ul>

            <h3>Credit Bundle Refund Policy</h3>
            <div className="warning-box">
              <XCircle size={24} />
              <div>
                <h4>Generally Non-Refundable</h4>
                <p>Credit bundles are <strong>non-refundable</strong> once purchased because:</p>
                <ul>
                  <li>Credits are delivered instantly to your account</li>
                  <li>They can be used immediately upon purchase</li>
                  <li>Credits do not expire and remain available for future use</li>
                </ul>
              </div>
            </div>

            <h3>Exceptions for Credit Refunds</h3>
            <p>Refunds for credit bundles may be issued only in the following circumstances:</p>
            <ul>
              <li><strong>Technical Error:</strong> Credits were not added to your account within 24 hours</li>
              <li><strong>Duplicate Charge:</strong> You were charged multiple times for the same purchase</li>
              <li><strong>Unauthorized Transaction:</strong> Your account was compromised (must be reported within 48 hours)</li>
              <li><strong>Service Failure:</strong> Platform was completely unavailable for more than 72 hours</li>
            </ul>
            <p className="notice">Refund requests must be submitted within 48 hours of purchase for consideration.</p>
          </section>

          <section className="legal-section">
            <h2>Refund Request Process</h2>
            
            <h3>How to Request a Refund</h3>
            <ol>
              <li><strong>Contact Support:</strong> Email us at <strong>support@shreevid.ai</strong> with your refund request</li>
              <li><strong>Provide Information:</strong>
                <ul>
                  <li>Your account email address</li>
                  <li>Transaction ID or payment receipt</li>
                  <li>Date of purchase</li>
                  <li>Reason for refund request</li>
                  <li>Supporting documentation (if applicable)</li>
                </ul>
              </li>
              <li><strong>Review Process:</strong> We will review your request within 3-5 business days</li>
              <li><strong>Decision Notification:</strong> You will receive an email with our decision</li>
              <li><strong>Refund Processing:</strong> If approved, refunds are processed within 7-10 business days</li>
            </ol>

            <h3>Refund Timeline</h3>
            <ul>
              <li><strong>Request Review:</strong> 3-5 business days</li>
              <li><strong>Refund Processing:</strong> 7-10 business days after approval</li>
              <li><strong>Bank/Card Processing:</strong> Additional 5-10 business days (depends on your financial institution)</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Refund Methods</h2>
            <p>Approved refunds will be issued using the same payment method used for the original purchase:</p>
            <ul>
              <li><strong>Credit/Debit Card:</strong> Refunded to the original card</li>
              <li><strong>Digital Wallets:</strong> Refunded to the original wallet</li>
              <li><strong>Bank Transfer:</strong> May require additional verification</li>
            </ul>
            <p className="notice">We do not issue refunds in cash or to different payment methods.</p>
          </section>

          <section className="legal-section">
            <h2>Special Circumstances</h2>
            
            <h3>Technical Issues</h3>
            <p>If you experience technical problems that prevent you from using the service:</p>
            <ul>
              <li>Contact support immediately at <strong>support@shreevid.ai</strong></li>
              <li>We will work to resolve the issue within 24-48 hours</li>
              <li>If unresolved, we may issue a refund or credit compensation</li>
            </ul>

            <h3>Service Quality Issues</h3>
            <p>AI-generated content quality is subjective and depends on various factors:</p>
            <ul>
              <li>Prompt quality and specificity</li>
              <li>Third-party AI model capabilities (RunwayML)</li>
              <li>Random variation in AI outputs</li>
            </ul>
            <p><strong>Refunds are not provided for dissatisfaction with AI output quality.</strong> We recommend using the free tier to test the service before purchasing.</p>

            <h3>Billing Disputes</h3>
            <p>For billing errors or disputes:</p>
            <ul>
              <li>Email <strong>billing@shreevid.ai</strong> with transaction details</li>
              <li>We will investigate and respond within 48 hours</li>
              <li>Legitimate errors will be corrected immediately</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Account Deletion</h2>
            <p>If you delete your account:</p>
            <ul>
              <li>All unused credits will be forfeited (no refund)</li>
              <li>Active subscriptions will be cancelled (no prorated refund)</li>
              <li>All data and generated videos will be permanently deleted</li>
              <li>Deletion cannot be reversed</li>
            </ul>
            <p className="notice"><strong>Warning:</strong> Consider cancelling your subscription instead of deleting your account if you may want to use the service again in the future.</p>
          </section>

          <section className="legal-section">
            <h2>Chargebacks</h2>
            <div className="warning-box">
              <XCircle size={24} />
              <div>
                <h4>Chargeback Policy</h4>
                <p><strong>Please contact us before initiating a chargeback.</strong> Chargebacks have serious consequences:</p>
                <ul>
                  <li>Immediate account suspension</li>
                  <li>Loss of all credits and access</li>
                  <li>Permanent ban from the platform</li>
                  <li>Negative impact on our small business</li>
                </ul>
                <p>We are committed to resolving disputes fairly. Contact <strong>support@shreevid.ai</strong> first.</p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>Currency and Exchange Rates</h2>
            <ul>
              <li>All prices are listed in USD</li>
              <li>INR conversion shown at ₹83 per $1 (approximate)</li>
              <li>Refunds are issued in the original purchase currency</li>
              <li>Exchange rate fluctuations are not grounds for refunds</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Free Tier</h2>
            <p>The Free Plan includes:</p>
            <ul>
              <li>65 free credits upon signup (~1 video)</li>
              <li>No payment required</li>
              <li>Full platform access</li>
            </ul>
            <p><strong>We recommend testing the service with the free tier before purchasing.</strong></p>
          </section>

          <section className="legal-section">
            <h2>Promotional Credits</h2>
            <ul>
              <li>Credits received through promotions or referrals are non-refundable</li>
              <li>Promotional credits cannot be exchanged for cash</li>
              <li>Promotions are subject to their own terms and conditions</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Changes to Refund Policy</h2>
            <p>We reserve the right to modify this Refund Policy at any time. Changes will:</p>
            <ul>
              <li>Be posted on this page with an updated "Last Updated" date</li>
              <li>Apply to purchases made after the change</li>
              <li>Not retroactively affect existing purchases</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Contact Us</h2>
            <p>For refund requests or questions about this policy:</p>
            <div className="contact-box">
              <p><strong>Refund Requests:</strong> support@shreevid.ai</p>
              <p><strong>Billing Inquiries:</strong> billing@shreevid.ai</p>
              <p><strong>General Support:</strong> support@shreevid.ai</p>
              <p><strong>Company:</strong> Priority Technologies, India</p>
            </div>
          </section>

          <div className="summary-box">
            <h3>Quick Summary</h3>
            <ul>
              <li>✅ 7-day money-back guarantee on first subscription (if no credits used)</li>
              <li>❌ Credit bundles are generally non-refundable</li>
              <li>✅ Refunds for billing errors and technical issues</li>
              <li>❌ No refunds for partial months or used credits</li>
              <li>💡 Try the free tier before purchasing</li>
              <li>📧 Contact support before initiating chargebacks</li>
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
