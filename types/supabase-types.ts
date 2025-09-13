
// Temporary type definitions to use until Supabase types are properly generated

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes: string | null;
  status: string;
  created_at: string;
  // Payment fields
  payment_id?: string | null;
  payment_order_id?: string | null;
  payment_signature?: string | null;
  consultation_fee_paid?: boolean;
  consultation_fee_amount?: number;
  payment_status?: string;
  payment_date?: string | null;
}

export interface Admin {
  id: string;
  user_id: string;
  name: string | null;
  created_at: string;
}

export interface AbandonedPayment {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  notes?: string | null;
  consultation_fee_amount: number;
  payment_status: string;
  abandonment_reason?: string | null;
  session_id?: string | null;
  user_agent?: string | null;
  ip_address?: string | null;
  created_at: string;
  updated_at: string;
  retargeted: boolean;
  retargeted_at?: string | null;
  retargeting_notes?: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  meta_description: string;
  slug: string;
  featured_image?: string;
  featured_image_alt?: string;
  content: string;
  author: string;
  tags: string[];
  published: boolean;
  published_date?: string;
  schema_markup?: string;
  created_at: string;
  
  // SEO Fields
  meta_title?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_card?: string;
  
  // Content Settings
  excerpt?: string;
  reading_time?: number;
  category?: string;
  status?: string;
  featured?: boolean;
  allow_comments?: boolean;
  
  // Publishing Settings
  scheduled_date?: string;
  visibility?: string;
  password?: string;
  
  // Advanced SEO
  robots_meta?: string;
  focus_keyword?: string;
  readability_score?: number;
  seo_score?: number;
}
