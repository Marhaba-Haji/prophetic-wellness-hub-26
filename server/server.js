
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import sirv from 'sirv';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/.vite/ssr-manifest.json', 'utf-8')
  : undefined;

// Create http server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  });
  app.use(vite.ssrLoadModule);
} else {
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// SEO middleware to fetch dynamic data
async function fetchSEOData(url) {
  // Extract blog slug from URL
  const blogMatch = url.match(/^\/blog\/(.+)$/);
  
  if (blogMatch) {
    const slug = blogMatch[1];
    try {
      // Import Supabase client for server-side usage
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://zywvlznelzpoixnrzwqk.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5d3Zsem5lbHpwb2l4bnJ6d3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTE4NTgsImV4cCI6MjA2MzcyNzg1OH0.YiM6sMBADoUVw4hIQgEUP1KxJNnxPpPszd5JrtaZn8w'
      );
      
      const { data: blog } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      
      if (blog) {
        return {
          title: blog.meta_title || `${blog.title} - RevivoHeal Blog`,
          description: blog.meta_description || blog.excerpt || `Read about ${blog.title} on RevivoHeal's blog about Hijama cupping therapy and natural healing.`,
          keywords: blog.meta_keywords || 'hijama therapy, cupping therapy, natural healing',
          ogTitle: blog.og_title || blog.meta_title || blog.title,
          ogDescription: blog.og_description || blog.meta_description || blog.excerpt || `Read about ${blog.title} on RevivoHeal's blog.`,
          ogImage: blog.og_image || blog.featured_image || 'https://i.ibb.co/TxLzP5H7/revivo-heal-logo.png',
          twitterTitle: blog.twitter_title || blog.meta_title || blog.title,
          twitterDescription: blog.twitter_description || blog.meta_description || blog.excerpt || `Read about ${blog.title} on RevivoHeal's blog.`,
          twitterImage: blog.twitter_image || blog.og_image || blog.featured_image || 'https://i.ibb.co/TxLzP5H7/revivo-heal-logo.png',
          canonicalUrl: blog.canonical_url || `https://revivoheal.com/blog/${blog.slug}`,
          schemaMarkup: blog.schema_markup || generateDefaultSchema(blog),
          author: blog.author,
          publishedDate: blog.published_date,
          category: blog.category,
          tags: blog.tags || []
        };
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    }
  }
  
  // Default SEO data for other pages
  return getDefaultSEOData(url);
}

function generateDefaultSchema(blog) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.meta_description || blog.excerpt,
    "author": {
      "@type": "Person",
      "name": blog.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "RevivoHeal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://i.ibb.co/TxLzP5H7/revivo-heal-logo.png"
      }
    },
    "datePublished": blog.published_date,
    "dateModified": blog.created_at,
    "url": `https://revivoheal.com/blog/${blog.slug}`
  });
}

function getDefaultSEOData(url) {
  const routes = {
    '/': {
      title: 'RevivoHeal Bangalore | Centre for Pain Relief & Healing with Cupping & Massage Therapies',
      description: 'Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies. Natural healing by certified professionals. Book now.',
      keywords: 'hijama therapy, cupping therapy, pain relief, natural healing, Islamic medicine, traditional therapy, back pain treatment, migraine relief, sports massage, wet cupping, dry cupping'
    },
    '/about': {
      title: 'About RevivoHeal - Professional Hijama & Cupping Therapy Center in Bangalore',
      description: 'Learn about RevivoHeal\'s mission to provide authentic Hijama cupping therapy and traditional healing methods in Bangalore. Meet our certified professionals.',
      keywords: 'about revivoheal, hijama center bangalore, cupping therapy clinic, traditional healing, islamic medicine center'
    },
    '/contact': {
      title: 'Contact RevivoHeal - Book Hijama Cupping Therapy in Bangalore',
      description: 'Contact RevivoHeal for Hijama cupping therapy appointments in Bangalore. Call +91 9480389296 or visit us at Frazer Town. Professional healing services.',
      keywords: 'contact revivoheal, book hijama appointment, cupping therapy bangalore, hijama center contact, frazer town clinic'
    },
    '/benefits': {
      title: 'Benefits of Hijama Cupping Therapy - Natural Pain Relief & Healing',
      description: 'Discover the proven benefits of Hijama cupping therapy for pain relief, detoxification, improved circulation, and overall wellness. Traditional Islamic healing methods.',
      keywords: 'hijama benefits, cupping therapy benefits, natural pain relief, detoxification, blood circulation, traditional healing benefits, islamic medicine benefits'
    }
  };
  
  const route = routes[url] || routes['/'];
  return {
    title: route.title,
    description: route.description,
    keywords: route.keywords,
    ogTitle: route.title,
    ogDescription: route.description,
    ogImage: 'https://i.ibb.co/TxLzP5H7/revivo-heal-logo.png',
    twitterTitle: route.title,
    twitterDescription: route.description,
    twitterImage: 'https://i.ibb.co/TxLzP5H7/revivo-heal-logo.png',
    canonicalUrl: `https://revivoheal.com${url}`
  };
}

function injectSEOTags(html, seoData, url) {
  // Inject meta tags into the HTML head
  const metaTags = `
    <title>${seoData.title}</title>
    <meta name="description" content="${seoData.description}" />
    <meta name="keywords" content="${seoData.keywords}" />
    <link rel="canonical" href="${seoData.canonicalUrl}" />
    
    <meta property="og:title" content="${seoData.ogTitle}" />
    <meta property="og:description" content="${seoData.ogDescription}" />
    <meta property="og:image" content="${seoData.ogImage}" />
    <meta property="og:url" content="${seoData.canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="RevivoHeal" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seoData.twitterTitle}" />
    <meta name="twitter:description" content="${seoData.twitterDescription}" />
    <meta name="twitter:image" content="${seoData.twitterImage}" />
    
    ${seoData.schemaMarkup ? `<script type="application/ld+json">${seoData.schemaMarkup}</script>` : ''}
  `;
  
  // Replace the head section with our dynamic meta tags
  return html.replace(
    /<head[^>]*>/i,
    `<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="https://i.ibb.co/d4L6Zb0d/revivoheal-favicon.png" />
    <link rel="apple-touch-icon" href="https://i.ibb.co/d4L6Zb0d/revivoheal-favicon.png" />
    ${metaTags}`
  );
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');
    
    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render;
    } else {
      template = templateHtml;
      render = (await import('./dist/server/entry-server.js')).render;
    }

    // Fetch SEO data for the current route
    const seoData = await fetchSEOData(url);
    
    // Render the app HTML
    const rendered = await render(url, ssrManifest);
    
    // Inject SEO tags into the template
    const html = injectSEOTags(template, seoData, url)
      .replace(`<!--app-html-->`, rendered.html ?? '')
      .replace(`<!--app-head-->`, rendered.head ?? '');

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
