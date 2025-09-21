import { supabase } from "@/integrations/supabase/client";

// Optimized query fields for blog listing (excludes heavy content)
const BLOG_LIST_FIELDS = `
  id,
  title,
  slug,
  excerpt,
  meta_description,
  featured_image,
  featured_image_alt,
  published_date,
  author,
  category,
  tags,
  reading_time
`;

// Fields for blog detail view
const BLOG_DETAIL_FIELDS = `
  id,
  title,
  slug,
  content,
  excerpt,
  meta_title,
  meta_description,
  meta_keywords,
  featured_image,
  featured_image_alt,
  og_image,
  og_title,
  og_description,
  published_date,
  author,
  category,
  tags,
  reading_time,
  canonical_url
`;

// Fields for related/recent posts (minimal data)
const BLOG_PREVIEW_FIELDS = `
  id,
  title,
  slug,
  featured_image,
  published_date,
  category
`;

export const blogQueries = {
  // Get paginated blog posts with optimized fields
  async getBlogPosts(page: number = 1, limit: number = 9) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from("blogs")
      .select(BLOG_LIST_FIELDS)
      .eq("published", true)
      .order("published_date", { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data || [];
  },

  // Get total count of published blogs
  async getBlogCount() {
    const { count, error } = await supabase
      .from("blogs")
      .select("*", { count: "exact", head: true })
      .eq("published", true);

    if (error) throw error;
    return count || 0;
  },

  // Get single blog post by slug
  async getBlogBySlug(slug: string) {
    const { data, error } = await supabase
      .from("blogs")
      .select(BLOG_DETAIL_FIELDS)
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) throw error;
    return data;
  },

  // Get recent posts (excluding current post)
  async getRecentPosts(excludeSlug?: string, limit: number = 5) {
    let query = supabase
      .from("blogs")
      .select(BLOG_PREVIEW_FIELDS)
      .eq("published", true)
      .order("published_date", { ascending: false })
      .limit(limit);

    if (excludeSlug) {
      query = query.neq("slug", excludeSlug);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Get related posts by category
  async getRelatedPosts(category: string, excludeSlug: string, limit: number = 3) {
    const { data, error } = await supabase
      .from("blogs")
      .select(BLOG_PREVIEW_FIELDS)
      .eq("published", true)
      .eq("category", category)
      .neq("slug", excludeSlug)
      .order("published_date", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // Get latest posts for homepage preview
  async getLatestPosts(limit: number = 3) {
    const { data, error } = await supabase
      .from("blogs")
      .select(BLOG_PREVIEW_FIELDS)
      .eq("published", true)
      .order("published_date", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }
};
