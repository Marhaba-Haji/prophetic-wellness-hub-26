import { supabase } from "@/integrations/supabase/client";

export interface AbandonedPaymentData {
  full_name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  abandonment_reason?: string;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
}

export const ABANDONMENT_REASONS = {
  PAYMENT_FAILED: "payment_failed",
  CLOSED_MODAL: "closed_modal",
  SESSION_TIMEOUT: "session_timeout",
} as const;

export const getUserIP = async (): Promise<string | null> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || null;
  } catch (error) {
    console.error("Error getting user IP:", error);
    return null;
  }
};

export const trackAbandonedPayment = async (data: AbandonedPaymentData) => {
  try {
    const { error } = await supabase.from("abandoned_payments").insert({
      ...data,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error tracking abandoned payment:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error tracking abandoned payment:", error);
    return { success: false, error };
  }
};

export const captureAbandonedPayment = trackAbandonedPayment;
