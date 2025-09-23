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

// Get Razorpay key from environment or use test key
const getRazorpayKey = () => {
  // Since we can't use import.meta.env in this setup, we'll need to provide the key differently
  // For now, we'll create a function that can be called with the key
  return 'rzp_test_1234567890'; // This should be replaced with actual key in production
};

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  key: getRazorpayKey(),
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

// Create Razorpay order using edge function
export const createRazorpayOrder = async (amount: number, currency: string = 'INR') => {
  try {
    // Import supabase client
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
      body: {
        amount: amount,
        currency: currency,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to create order');
    }

    if (!data?.success) {
      throw new Error('Failed to create order');
    }

    return {
      id: data.order_id,
      amount: data.amount,
      currency: data.currency,
      key_id: data.key_id,
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
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
