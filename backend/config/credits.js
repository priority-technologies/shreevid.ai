// Credit Pricing Plans (60% Profit Margin)
// Base Cost: $0.26 per 5-sec video | Selling Price: $0.65 (60% margin)
// Credit Economy: 1 Credit = $0.01 USD

const CREDIT_PACKAGES = [
  {
    id: 'free',
    name: 'Free Plan',
    credits: 65,          // 1 video (5-sec each at 65 credits)
    price: 0,             // USD
    priceINR: 0,
    popular: false,
    pricePerCredit: 0,
    videoCount: '1 video',
    isFree: true,
  },
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 1000,        // ~15 videos (1000/65 = 15.38)
    price: 10,            // USD
    priceINR: 830,        // ₹83 per $1
    popular: false,
    pricePerCredit: 0.01,
    videoCount: '~15 videos',
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    credits: 3000,        // ~46 videos (3000/65 = 46.15)
    price: 25,            // USD (16% discount)
    priceINR: 2075,
    popular: true,
    pricePerCredit: 0.0083,
    savings: '16% OFF',
    videoCount: '~46 videos',
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    credits: 7500,        // ~115 videos (7500/65 = 115.38)
    price: 60,            // USD (20% discount)
    priceINR: 4980,
    popular: false,
    pricePerCredit: 0.008,
    savings: '20% OFF',
    videoCount: '~115 videos',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 20000,       // ~307 videos (20000/65 = 307.69)
    price: 150,           // USD (25% discount)
    priceINR: 12450,
    popular: false,
    pricePerCredit: 0.0075,
    savings: '25% OFF',
    videoCount: '~307 videos',
  },
];

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
  CREDIT_COSTS,
  FREE_SIGNUP_CREDITS,
};
