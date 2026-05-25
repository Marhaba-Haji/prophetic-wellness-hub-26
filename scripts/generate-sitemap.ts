import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { serviceContent } from '../src/data/serviceContent';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and anonymous key are required.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const fetchBlogSlugs = async () => {
  const { data, error } = await supabase.from('blogs').select('slug').eq('published', true);
  if (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
  return data.map((blog) => blog.slug);
};

const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('slug');
  if (error) return [];
  return (data || []).map((p) => p.slug);
};

const fetchCategories = async () => {
  const { data, error } = await supabase.from('product_categories').select('slug');
  if (error) return [];
  return (data || []).map((c) => c.slug);
};

const generateSitemap = async () => {
  const baseUrl = 'https://revivoheal.com';
  const now = new Date().toISOString();
  const blogSlugs = await fetchBlogSlugs();
  const productSlugs = await fetchProducts();
  const categorySlugs = await fetchCategories();
  const serviceIds = Object.keys(serviceContent);

  const staticRoutes = [
    { path: '/', priority: '1.00' },
    { path: '/about', priority: '0.80' },
    { path: '/benefits', priority: '0.70' },
    { path: '/cupping-therapy', priority: '0.80' },
    { path: '/greek-regimen-therapy', priority: '0.80' },
    { path: '/full-body-detox', priority: '0.80' },
    { path: '/unani-healthcare', priority: '0.80' },
    { path: '/acupressure-therapy', priority: '0.80' },
    { path: '/contact', priority: '0.80' },
    { path: '/blog', priority: '0.80' },
    { path: '/booking', priority: '0.70' },
    { path: '/products', priority: '0.80' },
    { path: '/privacy', priority: '0.40' },
    { path: '/refund', priority: '0.40' },
    { path: '/terms', priority: '0.40' },
  ];

  const urlEntry = (loc: string, priority = '0.64') =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;

  const urls = [
    ...staticRoutes.map((r) => urlEntry(`${baseUrl}${r.path}`, r.priority)),
    ...blogSlugs.map((s) => urlEntry(`${baseUrl}/blog/${s}`)),
    ...serviceIds.map((id) => urlEntry(`${baseUrl}/service/${id}`)),
    ...categorySlugs.map((s) => urlEntry(`${baseUrl}/products/category/${s}`)),
    ...productSlugs.map((s) => urlEntry(`${baseUrl}/products/${s}`)),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;

  fs.writeFileSync(path.resolve(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  console.log(`sitemap.xml written (${urls.length} entries)`);
};

generateSitemap();
