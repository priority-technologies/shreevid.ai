// Credit Pricing Structure
// RunwayML Cost: $0.05 per second (5-sec video = $0.25)
// Our Cost with overhead: ~$0.30 per video
// Selling Price: $0.65 per video (54% profit margin)
// Credit Economy: 1 Credit = $0.01 USD, 65 credits = 1 video

// FLEXIBLE CREDIT BUNDLES - Users can purchase credits anytime
const CREDIT_BUNDLES = [
  {
    id: 'bundle_small',
    name: 'Small Bundle',
    credits: 1000,
    price: 15,              // $15 for 1000 credits = $0.015/credit (15% markup)
    priceINR: 1245,         // ₹83 per $1
    popular: false,
    pricePerCredit: 0.015,
    videoCount: '~15 videos',
    savings: null,
    description: 'Perfect for occasional use',
    type: 'bundle',
  },
  {
    id: 'bundle_medium',
    name: 'Medium Bundle',
    credits: 2500,
    price: 30,              // $30 for 2500 credits = $0.012/credit (20% bulk discount)
    priceINR: 2490,
    popular: true,
    pricePerCredit: 0.012,
    videoCount: '~38 videos',
    savings: '20% OFF',
    description: 'Most popular choice',
    type: 'bundle',
  },
  {
    id: 'bundle_large',
    name: 'Large Bundle',
    credits: 5000,
    price: 55,              // $55 for 5000 credits = $0.011/credit (27% bulk discount)
    priceINR: 4565,
    popular: false,
    pricePerCredit: 0.011,
    videoCount: '~76 videos',
    savings: '27% OFF',
    description: 'Great value for creators',
    type: 'bundle',
  },
  {
    id: 'bundle_xlarge',
    name: 'XL Bundle',
    credits: 10000,
    price: 100,             // $100 for 10000 credits = $0.010/credit (33% bulk discount)
    priceINR: 8300,
    popular: false,
    pricePerCredit: 0.010,
    videoCount: '~153 videos',
    savings: '33% OFF',
    description: 'Maximum savings',
    type: 'bundle',
  },
];

// SUBSCRIPTION PLANS - One-time purchase with credits
const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    credits: 65,
    price: 0,
    priceINR: 0,
    popular: false,
    pricePerCredit: 0,
    videoCount: '1 video',
    isFree: true,
    description: 'Try before you buy',
    features: ['1 free video', 'Basic features', 'Standard quality'],
    type: 'plan',
  },
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 1000,
    price: 10,
    priceINR: 830,
    popular: false,
    pricePerCredit: 0.01,
    videoCount: '~15 videos',
    description: 'Get started quickly',
    features: ['15 videos', 'All features', 'HD quality', 'Email support'],
    type: 'plan',
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    credits: 3000,
    price: 25,
    priceINR: 2075,
    popular: true,
    pricePerCredit: 0.0083,
    savings: '16% OFF',
    videoCount: '~46 videos',
    description: 'For regular creators',
    features: ['46 videos', 'All features', 'HD quality', 'Priority support', 'Custom branding'],
    type: 'plan',
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    credits: 7500,
    price: 60,
    priceINR: 4980,
    popular: false,
    pricePerCredit: 0.008,
    savings: '20% OFF',
    videoCount: '~115 videos',
    description: 'For power users',
    features: ['115 videos', 'All features', '4K quality', 'Priority support', 'API access'],
    type: 'plan',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 20000,
    price: 150,
    priceINR: 12450,
    popular: false,
    pricePerCredit: 0.0075,
    savings: '25% OFF',
    videoCount: '~307 videos',
    description: 'For teams & agencies',
    features: ['307 videos', 'All features', '4K quality', 'Dedicated support', 'White label'],
    type: 'plan',
  },
];

// Combined packages for compatibility
const CREDIT_PACKAGES = [...SUBSCRIPTION_PLANS, ...CREDIT_BUNDLES];

// Credit costs for different operations
const CREDIT_COSTS = {
  VIDEO_GENERATION_5SEC: 65,   // $0.65 (includes 60% margin over $0.26 cost)
  VIDEO_GENERATION_10SEC: 130, // $1.30 (10 seconds)
  IMAGE_GENERATION: 25,         // Future feature
  AUDIO_GENERATION: 10,         // TTS is mostly free
  VIDEO_UPSCALE: 50,            // Future feature
};

// Free credits given to new users (1 free video to test)
const FREE_SIGNUP_CREDITS = 65;

module.exports = {
  CREDIT_PACKAGES,
  CREDIT_BUNDLES,
  SUBSCRIPTION_PLANS,
  CREDIT_COSTS,
  FREE_SIGNUP_CREDITS,
};
