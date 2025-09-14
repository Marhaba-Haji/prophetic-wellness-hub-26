// Payment capture service for Razorpay
import { supabase } from '@/integrations/supabase/client';

export interface PaymentCaptureRequest {
  payment_id: string;
  amount: number; // Amount in paise
  currency?: string;
}

export interface PaymentCaptureResponse {
  success: boolean;
  payment_id: string;
  captured_amount: number;
  captured_at: string;
  error?: string;
}

// Capture payment using Razorpay API
export const capturePayment = async (request: PaymentCaptureRequest): Promise<PaymentCaptureResponse> => {
  try {
    const response = await fetch('https://api.razorpay.com/v1/payments/' + request.payment_id + '/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`rzp_test_1234567890:your_key_secret_here`)}`,
      },
      body: JSON.stringify({
        amount: request.amount,
        currency: request.currency || 'INR',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Capture failed: ${errorData.error?.description || 'Unknown error'}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      payment_id: data.id,
      captured_amount: data.amount,
      captured_at: data.created_at,
    };
  } catch (error) {
    console.error('Payment capture error:', error);
    return {
      success: false,
      payment_id: request.payment_id,
      captured_amount: 0,
      captured_at: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Update appointment with capture status
export const updateAppointmentCaptureStatus = async (
  appointmentId: string,
  captureData: PaymentCaptureResponse
): Promise<void> => {
  try {
    // For now, just log the capture status
    // Database table doesn't have capture fields yet
    console.log('Payment capture status:', {
      appointmentId,
      success: captureData.success,
      amount: captureData.captured_amount,
      error: captureData.error
    });
  } catch (error) {
    console.error('Error in updateAppointmentCaptureStatus:', error);
    throw error;
  }
};

// Auto-capture payment after successful authorization
export const autoCapturePayment = async (
  paymentId: string,
  amount: number = 29900 // Default consultation fee
): Promise<PaymentCaptureResponse> => {
  try {
    console.log(`Auto-capturing payment: ${paymentId} for amount: ${amount}`);
    
    const captureResult = await capturePayment({
      payment_id: paymentId,
      amount: amount,
      currency: 'INR',
    });

    if (captureResult.success) {
      console.log('Payment captured successfully:', captureResult);
      
      // Update appointment status
      await updateAppointmentCaptureStatus(paymentId, captureResult);
    } else {
      console.error('Payment capture failed:', captureResult.error);
    }

    return captureResult;
  } catch (error) {
    console.error('Auto-capture error:', error);
    return {
      success: false,
      payment_id: paymentId,
      captured_amount: 0,
      captured_at: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Check payment status
export const checkPaymentStatus = async (paymentId: string) => {
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa(`rzp_test_1234567890:your_key_secret_here`)}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment status');
    }

    const data = await response.json();
    return {
      id: data.id,
      status: data.status,
      amount: data.amount,
      captured: data.captured,
      captured_at: data.captured_at,
      created_at: data.created_at,
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return null;
  }
};
