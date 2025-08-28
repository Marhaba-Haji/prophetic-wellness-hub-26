import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://zywvlznelzpoixnrzwqk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d3Zsem5lbHpwb2l4bnJ6d3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTE4NTgsImV4cCI6MjA2MzcyNzg1OH0.YiM6sMBADoUVw4hIQgEUP1KxJNnxPpPszd5JrtaZn8w";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Utility function to handle Supabase errors
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Utility function for retry operations
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};