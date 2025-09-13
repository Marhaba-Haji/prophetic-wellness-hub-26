// Service for tracking abandoned payments and retargeting
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
  abandonment_reason: 'modal_closed' | 'payment_failed' | 'timeout' | 'user_cancelled' | 'error';
  session_id?: string;
  user_agent?: string;
  ip_address?: string;
}

// Generate a unique session ID for tracking
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get user's IP address (simplified version)
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error getting IP address:', error);
    return 'unknown';
  }
};

// Track abandoned payment
export const trackAbandonedPayment = async (data: AbandonedPaymentData): Promise<void> => {
  try {
    const { error } = await supabase
      .from('abandoned_payments')
      .insert({
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
        session_id: data.session_id || null,
        user_agent: data.user_agent || navigator.userAgent,
        ip_address: data.ip_address || null,
        retargeted: false,
      });

    if (error) {
      console.error('Error tracking abandoned payment:', error);
    } else {
      console.log('Abandoned payment tracked successfully');
    }
  } catch (error) {
    console.error('Error in trackAbandonedPayment:', error);
  }
};

// Get abandoned payments for retargeting
export const getAbandonedPayments = async (limit: number = 50): Promise<AbandonedPayment[]> => {
  try {
    // First try to get all abandoned payments (without RLS filter)
    const { data, error } = await supabase
      .from('abandoned_payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching abandoned payments:', error);
      console.error('Error details:', error);
      return [];
    }

    console.log('Fetched abandoned payments:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getAbandonedPayments:', error);
    return [];
  }
};

// Mark payment as retargeted
export const markAsRetargeted = async (
  id: string, 
  retargetingNotes?: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('abandoned_payments')
      .update({
        retargeted: true,
        retargeted_at: new Date().toISOString(),
        retargeting_notes: retargetingNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Error marking as retargeted:', error);
    }
  } catch (error) {
    console.error('Error in markAsRetargeted:', error);
  }
};

// Get abandoned payments by email for follow-up
export const getAbandonedPaymentsByEmail = async (email: string): Promise<AbandonedPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('abandoned_payments')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching abandoned payments by email:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAbandonedPaymentsByEmail:', error);
    return [];
  }
};

// Get abandoned payments by phone for follow-up
export const getAbandonedPaymentsByPhone = async (phone: string): Promise<AbandonedPayment[]> => {
  try {
    const { data, error } = await supabase
      .from('abandoned_payments')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching abandoned payments by phone:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAbandonedPaymentsByPhone:', error);
    return [];
  }
};

// Get abandonment analytics
export const getAbandonmentAnalytics = async () => {
  try {
    const { data, error } = await supabase
      .from('abandoned_payments')
      .select('abandonment_reason, created_at');

    if (error) {
      console.error('Error fetching abandonment analytics:', error);
      return null;
    }

    // Group by abandonment reason
    const analytics = data?.reduce((acc: any, item: any) => {
      const reason = item.abandonment_reason || 'unknown';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});

    return {
      total_abandoned: data?.length || 0,
      by_reason: analytics,
      recent_abandonments: data?.slice(0, 10) || [],
    };
  } catch (error) {
    console.error('Error in getAbandonmentAnalytics:', error);
    return null;
  }
};
