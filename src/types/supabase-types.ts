

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
}

export interface Admin {
  id: string;
  user_id: string;
  name: string | null;
  created_at: string;
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
}

