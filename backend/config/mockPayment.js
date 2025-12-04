/**
 * Mock Payment Processor
 * Simulates payment gateway interactions for testing
 */

const PAYMENT_METHODS = {
  credit_card: {
    name: 'Credit Card',
    icon: '💳',
    processingTime: 2000,
    successRate: 0.95,
    validationFields: ['cardNumber', 'cardName', 'expiryDate', 'cvv'],
  },
  debit_card: {
    name: 'Debit Card',
    icon: '💳',
    processingTime: 2000,
    successRate: 0.93,
    validationFields: ['cardNumber', 'cardName', 'expiryDate', 'cvv'],
  },
  upi: {
    name: 'UPI',
    icon: '📱',
    processingTime: 1500,
    successRate: 0.98,
    validationFields: ['upiId'],
  },
  net_banking: {
    name: 'Net Banking',
    icon: '🏦',
    processingTime: 3000,
    successRate: 0.90,
    validationFields: ['bankName', 'accountNumber'],
  },
  paypal: {
    name: 'PayPal',
    icon: '🅿️',
    processingTime: 2500,
    successRate: 0.97,
    validationFields: ['email'],
  },
  stripe: {
    name: 'Stripe',
    icon: '💰',
    processingTime: 2000,
    successRate: 0.96,
    validationFields: ['cardNumber', 'cardName', 'expiryDate', 'cvv'],
  },
};

/**
 * Generate mock transaction ID
 */
function generateTransactionId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${random}`;
}

/**
 * Validate payment details
 */
function validatePaymentDetails(method, details) {
  const methodConfig = PAYMENT_METHODS[method];
  if (!methodConfig) {
    return { valid: false, error: 'Invalid payment method' };
  }

  // Check required fields
  const requiredFields = methodConfig.validationFields;
  for (const field of requiredFields) {
    if (!details[field] || details[field].toString().trim() === '') {
      return { valid: false, error: `${field} is required` };
    }
  }

  // Validate specific formats
  if (details.cardNumber) {
    const cardNum = details.cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cardNum)) {
      return { valid: false, error: 'Invalid card number format' };
    }
  }

  if (details.cvv) {
    if (!/^\d{3,4}$/.test(details.cvv)) {
      return { valid: false, error: 'Invalid CVV format' };
    }
  }

  if (details.expiryDate) {
    if (!/^\d{2}\/\d{2}$/.test(details.expiryDate)) {
      return { valid: false, error: 'Invalid expiry date format (use MM/YY)' };
    }
  }

  if (details.upiId) {
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(details.upiId)) {
      return { valid: false, error: 'Invalid UPI ID format' };
    }
  }

  return { valid: true };
}

/**
 * Process mock payment
 */
async function processPayment(method, amount, details) {
  return new Promise((resolve) => {
    const methodConfig = PAYMENT_METHODS[method];
    const processingTime = methodConfig.processingTime;

    // Simulate processing
    setTimeout(() => {
      const random = Math.random();
      const successRate = methodConfig.successRate;

      if (random < successRate) {
        // Success
        resolve({
          status: 'success',
          transactionId: generateTransactionId(),
          amount,
          method,
          methodName: methodConfig.name,
          timestamp: new Date(),
          message: `Payment of $${amount.toFixed(2)} processed successfully via ${methodConfig.name}`,
        });
      } else {
        // Simulated failure
        const failures = [
          'Insufficient funds',
          'Card declined by issuer',
          'Invalid card details',
          'Transaction limit exceeded',
          'Network error - please retry',
        ];
        const randomFailure = failures[Math.floor(Math.random() * failures.length)];

        resolve({
          status: 'failed',
          transactionId: generateTransactionId(),
          amount,
          method,
          methodName: methodConfig.name,
          timestamp: new Date(),
          error: randomFailure,
        });
      }
    }, processingTime);
  });
}

module.exports = {
  PAYMENT_METHODS,
  generateTransactionId,
  validatePaymentDetails,
  processPayment,
};
