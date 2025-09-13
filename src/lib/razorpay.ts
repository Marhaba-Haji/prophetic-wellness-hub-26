// Razorpay configuration and utilities
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  capture?: boolean; // Enable/disable auto-capture
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    appointment_id?: string;
    service: string;
    date: string;
    time: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1234567890', // Replace with your actual key
  currency: 'INR',
  name: 'Revivoheal - Prophetic Wellness Hub',
  description: 'Consultation Fee',
  theme: {
    color: '#059669', // Brand green color
  },
  // Auto-capture configuration
  capture: true, // This enables automatic capture
};

// Payment amount in paise (Rs. 299 = 29900 paise)
export const CONSULTATION_FEE = 29900;

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order - for frontend integration, we'll use a simple approach
export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  // For frontend integration, we'll create a simple order object
  // In production, this should be done on your backend for security
  const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: orderId,
    amount: amount,
    currency: currency,
    status: 'created',
  };
};

// Verify payment signature (this should be done on your backend)
export const verifyPaymentSignature = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> => {
  // In a real implementation, this should be called from your backend
  // For now, we'll return true for demo purposes
  console.log('Payment verification:', {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });
  return true;
};
