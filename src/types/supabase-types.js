// Type definitions converted to JavaScript - for documentation purposes

export const ContactSubmissionSchema = {
  id: 'string',
  name: 'string',
  email: 'string',
  subject: 'string',
  message: 'string',
  created_at: 'string'
};

export const AppointmentSchema = {
  id: 'string',
  full_name: 'string',
  email: 'string',
  phone: 'string',
  service: 'string',
  date: 'string',
  time: 'string',
  notes: 'string|null',
  status: 'string',
  created_at: 'string'
};

export const AdminSchema = {
  id: 'string',
  user_id: 'string',
  name: 'string|null',
  created_at: 'string'
};

export const BlogPostSchema = {
  id: 'string',
  title: 'string',
  meta_description: 'string',
  slug: 'string',
  featured_image: 'string',
  featured_image_alt: 'string',
  content: 'string',
  author: 'string',
  tags: 'array',
  published: 'boolean',
  published_date: 'string',
  schema_markup: 'string',
  created_at: 'string',
  meta_title: 'string',
  meta_keywords: 'string',
  canonical_url: 'string',
  og_title: 'string',
  og_description: 'string',
  og_image: 'string',
  og_type: 'string',
  twitter_title: 'string',
  twitter_description: 'string',
  twitter_image: 'string',
  twitter_card: 'string',
  excerpt: 'string',
  reading_time: 'number',
  category: 'string',
  status: 'string',
  featured: 'boolean',
  allow_comments: 'boolean',
  scheduled_date: 'string',
  visibility: 'string',
  password: 'string',
  robots_meta: 'string',
  focus_keyword: 'string',
  readability_score: 'number',
  seo_score: 'number'
};