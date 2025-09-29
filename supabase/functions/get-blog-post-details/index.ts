import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";
import { corsHeaders } from "../_shared/cors.ts";

interface SimpleBlogPost {
  id: string;
  title: string;
  slug: string;
  published_date: string | null;
  featured_image: string | null;
  category?: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { slug } = await req.json();
    if (!slug) {
      return new Response(JSON.stringify({ error: "Slug is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // 1. Fetch the main blog post
    const blogPostPromise = supabase
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    // 2. Fetch recent posts
    const recentPostsPromise = supabase
      .from("blogs")
      .select("id, title, slug, published_date, featured_image")
      .eq("published", true)
      .neq("slug", slug)
      .order("published_date", { ascending: false })
      .limit(5);

    // Execute initial fetches in parallel
    const [blogPostResult, recentPostsResult] = await Promise.all([
      blogPostPromise,
      recentPostsPromise,
    ]);

    if (blogPostResult.error) throw blogPostResult.error;
    if (!blogPostResult.data) {
      return new Response(JSON.stringify({ error: "Blog post not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }
    const blog = blogPostResult.data;

    // 3. Fetch related posts based on the category of the main post
    let relatedPosts: SimpleBlogPost[] = [];
    if (blog.category) {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, published_date, featured_image, category")
        .eq("published", true)
        .eq("category", blog.category)
        .neq("slug", slug)
        .limit(3);

      if (error) {
        console.error("Error fetching related posts:", error);
      } else {
        relatedPosts = data || [];
      }
    }

    return new Response(
      JSON.stringify({
        blog,
        recentPosts: recentPostsResult.data || [],
        relatedPosts,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});