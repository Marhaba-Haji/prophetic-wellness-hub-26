import { supabase } from '@/integrations/supabase/client';
import { AbandonedPayment } from '@/types/supabase-types';

export interface AbandonedPaymentData {
  full_name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  abandonment_reason: string;
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
}

/**
 * Captures an abandoned payment when user cancels or fails to complete payment
 */
export const captureAbandonedPayment = async (data: AbandonedPaymentData): Promise<void> => {
  try {
    const abandonedPaymentData = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      date: data.date,
      time: data.time,
      notes: data.notes || null,
      consultation_fee_amount: 299,
      payment_status: 'abandoned',
      abandonment_reason: data.abandonment_reason,
      session_id: data.session_id || generateSessionId(),
      user_agent: data.user_agent || navigator.userAgent,
      ip_address: data.ip_address || null,
      retargeted: false,
    };

    const { error } = await supabase
      .from('abandoned_payments')
      .insert(abandonedPaymentData);

    if (error) {
      console.error('Failed to capture abandoned payment:', error);
      // Don't throw error to avoid disrupting user experience
    } else {
      console.log('Abandoned payment captured successfully');
    }
  } catch (error) {
    console.error('Error capturing abandoned payment:', error);
    // Don't throw error to avoid disrupting user experience
  }
};

/**
 * Generates a unique session ID for tracking
 */
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Gets user's IP address (simplified version)
 */
export const getUserIP = async (): Promise<string | null> => {
  try {
    // Using a simple IP detection service
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip || null;
  } catch (error) {
    console.error('Failed to get IP address:', error);
    return null;
  }
};

/**
 * Common abandonment reasons
 */
export const ABANDONMENT_REASONS = {
  MODAL_CLOSED: 'modal_closed',
  PAYMENT_FAILED: 'payment_failed',
  USER_CANCELLED: 'user_cancelled',
  TIMEOUT: 'timeout',
  TECHNICAL_ERROR: 'technical_error',
  NETWORK_ERROR: 'network_error',
} as const;

export type AbandonmentReason = typeof ABANDONMENT_REASONS[keyof typeof ABANDONMENT_REASONS];
