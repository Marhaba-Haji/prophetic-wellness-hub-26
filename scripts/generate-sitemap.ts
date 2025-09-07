import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { serviceContent } from '../src/data/serviceContent.ts';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and anonymous key are required.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const fetchBlogSlugs = async () => {
  const { data, error } = await supabase.from('blogs').select('slug');
  if (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
  return data.map((blog) => blog.slug);
};

const generateSitemap = async () => {
  const baseUrl = 'https://www.revivoheal.com';
  const blogSlugs = await fetchBlogSlugs();
  const serviceIds = Object.keys(serviceContent);

  const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${baseUrl}/services</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${baseUrl}/booking-appointment</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${baseUrl}/refund</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${baseUrl}/terms</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${baseUrl}/unani-health-care</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>${baseUrl}/acupressure-therapy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  ${blogSlugs
    .map(
      (slug) => `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.64</priority>
  </url>
`
    )
    .join('')}
  ${serviceIds
    .map(
      (id) => `
  <url>
    <loc>${baseUrl}/service/${id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.64</priority>
  </url>
`
    )
    .join('')}
</urlset>
  `.trim();

  fs.writeFileSync(path.resolve(process.cwd(), 'public', 'sitemap.xml'), sitemap);
};

generateSitemap();
