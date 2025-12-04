// Credit Pricing Plans (Runway-style)
const CREDIT_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 625,
    price: 12, // USD
    priceINR: 999,
    popular: false,
    pricePerCredit: 0.019,
  },
  {
    id: 'creator',
    name: 'Creator Pack',
    credits: 2125,
    price: 35, // USD
    priceINR: 2899,
    popular: true,
    pricePerCredit: 0.016,
    savings: '15%',
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    credits: 6250,
    price: 95, // USD
    priceINR: 7899,
    popular: false,
    pricePerCredit: 0.015,
    savings: '20%',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 15625,
    price: 225, // USD
    priceINR: 18699,
    popular: false,
    pricePerCredit: 0.014,
    savings: '25%',
  },
];

// Credit costs for different operations
const CREDIT_COSTS = {
  VIDEO_GENERATION_5SEC: 125, // 5 seconds of video
  VIDEO_GENERATION_10SEC: 250, // 10 seconds of video
  IMAGE_GENERATION: 50,
  AUDIO_GENERATION: 25,
  VIDEO_UPSCALE: 100,
};

// Free credits given to new users
const FREE_SIGNUP_CREDITS = 125;

module.exports = {
  CREDIT_PACKAGES,
  CREDIT_COSTS,
  FREE_SIGNUP_CREDITS,
};
