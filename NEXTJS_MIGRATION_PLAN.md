# Next.js SSR Migration Plan for Hijama Healing Website

## Overview
This migration plan transforms the current React + Vite application to Next.js with Server-Side Rendering while maintaining 100% UI/UX parity. The focus is on backend architecture improvements for better SEO, performance, and user experience.

## 1. Project Structure Migration

### Current Structure → Next.js Structure
```
Current:                          Next.js:
src/pages/                   →    pages/ (or app/ for App Router)
src/components/              →    components/
src/hooks/                   →    hooks/
src/lib/                     →    lib/
src/integrations/            →    lib/integrations/
src/types/                   →    types/
public/                      →    public/
```

### File-Based Routing Migration
```
Current Route                     Next.js File
/                            →    pages/index.tsx
/about                       →    pages/about.tsx
/services                    →    pages/services.tsx
/services/:serviceId         →    pages/services/[serviceId].tsx
/benefits                    →    pages/benefits.tsx
/contact                     →    pages/contact.tsx
/blog                        →    pages/blog.tsx
/blog/:blogSlug              →    pages/blog/[blogSlug].tsx
/booking                     →    pages/booking.tsx
/booking/success             →    pages/booking/success.tsx
/admin                       →    pages/admin/index.tsx
/admin/dashboard             →    pages/admin/dashboard.tsx
/admin/blog/new              →    pages/admin/blog/new.tsx
/admin/blog/edit/:blogId     →    pages/admin/blog/edit/[blogId].tsx
```

## 2. Component Migration Strategy

### Layout Component Adaptation
```typescript
// components/layout/Layout.tsx (Next.js version)
import Head from 'next/head';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { WhatsAppChat } from '@/components/ui/whatsapp-chat';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

const Layout = ({ 
  children, 
  title = "RevivoHeal Bangalore | Centre for Pain Relief & Healing",
  description = "Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies.",
  canonical,
  ogImage
}: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        {ogImage && <meta property="og:image" content={ogImage} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Head>
      
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <WhatsAppChat phoneNumber="+919480389296" />
        <Footer />
      </div>
    </>
  );
};

export default Layout;
```

### Component Hydration Strategy
```typescript
// components/ui/ClientOnlyComponent.tsx
import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
```

## 3. Page Migration with SSR Implementation

### Static Pages (getStaticProps)
```typescript
// pages/about.tsx
import { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';

interface AboutPageProps {
  // Add any static data props here
}

const About = (props: AboutPageProps) => {
  return (
    <Layout 
      title="About Us - RevivoHeal Bangalore"
      description="Learn about our Hijama Therapy clinic specializing in Islamic traditional healing methods."
      canonical="https://revivoheal.com/about"
    >
      {/* Existing About component content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">About Us</h1>
        {/* Rest of existing content */}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 86400, // Revalidate every 24 hours
  };
};

export default About;
```

### Dynamic Pages with SSR (getServerSideProps)
```typescript
// pages/blog/[blogSlug].tsx
import { GetServerSideProps } from 'next';
import { supabase } from '@/lib/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { BlogPost } from '@/types/supabase-types';

interface BlogDetailProps {
  blog: BlogPost | null;
  recentPosts: BlogPost[];
  relatedPosts: BlogPost[];
}

const BlogDetail = ({ blog, recentPosts, relatedPosts }: BlogDetailProps) => {
  if (!blog) {
    return (
      <Layout title="Blog post not found - Hijama Healing">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog post not found</h1>
          </div>
        </div>
      </Layout>
    );
  }

  const currentUrl = `https://revivoheal.com/blog/${blog.slug}`;

  return (
    <Layout
      title={blog.meta_title || `${blog.title} - Hijama Healing`}
      description={blog.meta_description || blog.excerpt || `Read about ${blog.title} on Hijama Healing`}
      canonical={blog.canonical_url || currentUrl}
      ogImage={blog.og_image || blog.featured_image}
    >
      {/* Existing BlogDetail component content */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Rest of existing content */}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { blogSlug } = params!;

  try {
    // Fetch blog post
    const { data: blog, error: blogError } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', blogSlug)
      .eq('published', true)
      .single();

    if (blogError || !blog) {
      return {
        props: {
          blog: null,
          recentPosts: [],
          relatedPosts: [],
        },
      };
    }

    // Fetch recent posts
    const { data: recentPosts } = await supabase
      .from('blogs')
      .select('id, title, slug, published_date, featured_image')
      .eq('published', true)
      .neq('slug', blogSlug)
      .order('published_date', { ascending: false })
      .limit(5);

    // Fetch related posts
    const { data: relatedPosts } = await supabase
      .from('blogs')
      .select('id, title, slug, published_date, featured_image, category')
      .eq('published', true)
      .eq('category', blog.category)
      .neq('slug', blogSlug)
      .limit(3);

    return {
      props: {
        blog,
        recentPosts: recentPosts || [],
        relatedPosts: relatedPosts || [],
      },
    };
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return {
      props: {
        blog: null,
        recentPosts: [],
        relatedPosts: [],
      },
    };
  }
};

export default BlogDetail;
```

### Static Generation with Dynamic Routes
```typescript
// pages/services/[serviceId].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '@/components/layout/Layout';

const servicesData = {
  // Your existing services data
};

interface ServiceDetailProps {
  service: any;
  serviceId: string;
}

const ServiceDetail = ({ service, serviceId }: ServiceDetailProps) => {
  if (!service) {
    return (
      <Layout title="Service Not Found - RevivoHeal">
        {/* 404 content */}
      </Layout>
    );
  }

  return (
    <Layout
      title={`${service.title} - RevivoHeal Bangalore`}
      description={service.longDescription}
      canonical={`https://revivoheal.com/services/${serviceId}`}
    >
      {/* Existing ServiceDetail content */}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(servicesData).map((serviceId) => ({
    params: { serviceId },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { serviceId } = params!;
  const service = servicesData[serviceId as keyof typeof servicesData] || null;

  return {
    props: {
      service,
      serviceId,
    },
    revalidate: 86400, // Revalidate every 24 hours
  };
};

export default ServiceDetail;
```

## 4. API Routes Migration

### Contact Form API Route
```typescript
// pages/api/contact.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        subject,
        message,
      });

    if (error) throw error;

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
}
```

### Appointment Booking API Route
```typescript
// pages/api/appointments.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const appointmentData = req.body;

    const { error } = await supabase
      .from('appointments')
      .insert({
        ...appointmentData,
        status: 'pending',
      });

    if (error) throw error;

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    console.error('Appointment booking error:', error);
    res.status(500).json({ message: 'Failed to book appointment' });
  }
}
```

## 5. State Management Adaptation

### React Query Integration with SSR
```typescript
// lib/react-query.ts
import { QueryClient, dehydrate, Hydrate } from '@tanstack/react-query';

export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// pages/_app.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
```

### Authentication State Management
```typescript
// lib/auth.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
```

## 6. Form Handling Migration

### Contact Form with API Route
```typescript
// components/ContactForm.tsx (Next.js version)
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of component remains the same
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Existing form JSX */}
    </div>
  );
};

export default ContactForm;
```

## 7. SEO Implementation

### Dynamic Meta Tags for Blog Posts
```typescript
// components/BlogSEO.tsx
import Head from 'next/head';
import { BlogPost } from '@/types/supabase-types';

interface BlogSEOProps {
  blog: BlogPost;
  currentUrl: string;
}

const BlogSEO = ({ blog, currentUrl }: BlogSEOProps) => {
  const generateSchemaMarkup = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.meta_description || blog.excerpt,
      "image": blog.featured_image || blog.og_image,
      "author": {
        "@type": "Person",
        "name": blog.author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Hijama Healing"
      },
      "datePublished": blog.published_date,
      "dateModified": blog.created_at,
      "keywords": blog.meta_keywords || blog.tags?.join(', '),
      "url": currentUrl
    };
    return JSON.stringify(schema);
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{blog.meta_title || `${blog.title} - Hijama Healing`}</title>
      <meta name="description" content={blog.meta_description || blog.excerpt} />
      {blog.meta_keywords && <meta name="keywords" content={blog.meta_keywords} />}
      {blog.canonical_url && <link rel="canonical" href={blog.canonical_url} />}
      {!blog.canonical_url && <link rel="canonical" href={currentUrl} />}
      {blog.robots_meta && <meta name="robots" content={blog.robots_meta} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={blog.og_title || blog.meta_title || blog.title} />
      <meta property="og:description" content={blog.og_description || blog.meta_description || blog.excerpt} />
      <meta property="og:type" content={blog.og_type || 'article'} />
      <meta property="og:url" content={currentUrl} />
      {(blog.og_image || blog.featured_image) && <meta property="og:image" content={blog.og_image || blog.featured_image} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={blog.twitter_card || 'summary_large_image'} />
      <meta name="twitter:title" content={blog.twitter_title || blog.meta_title || blog.title} />
      <meta name="twitter:description" content={blog.twitter_description || blog.meta_description || blog.excerpt} />
      {(blog.twitter_image || blog.og_image || blog.featured_image) && 
        <meta name="twitter:image" content={blog.twitter_image || blog.og_image || blog.featured_image} />}
      
      {/* Schema Markup */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: blog.schema_markup || generateSchemaMarkup() }}
      />
    </Head>
  );
};

export default BlogSEO;
```

## 8. Build and Deployment Configuration

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'i.ibb.co', 'ibb.co'],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      // Add any necessary redirects from old routes
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
```

### Package.json Updates
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    // ... existing dependencies
  }
}
```

## 9. Performance Optimization

### Image Optimization
```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  width = 800, 
  height = 600, 
  className, 
  priority = false 
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};

export default OptimizedImage;
```

### Code Splitting and Lazy Loading
```typescript
// components/LazyComponents.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
export const AdminBlogEditor = dynamic(
  () => import('@/components/admin/AdminBlogEditor'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded" />,
    ssr: false, // Disable SSR for admin components
  }
);

export const ContactMap = dynamic(
  () => import('@/components/ContactMap'),
  {
    loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded" />,
    ssr: false, // Maps don't need SSR
  }
);
```

## 10. Migration Steps

### Phase 1: Setup and Basic Migration
1. Create new Next.js project
2. Install dependencies
3. Migrate basic components and layouts
4. Set up file-based routing structure

### Phase 2: Page Migration
1. Convert static pages (About, Services, Benefits)
2. Implement dynamic routes (Blog, Service Details)
3. Add SSR data fetching

### Phase 3: API and Forms
1. Create API routes
2. Update form handling
3. Migrate authentication logic

### Phase 4: SEO and Performance
1. Implement dynamic meta tags
2. Add structured data
3. Optimize images and code splitting

### Phase 5: Testing and Deployment
1. Test all routes and functionality
2. Performance testing
3. SEO validation
4. Deploy to production

## 11. Compatibility Considerations

### Supabase Integration
- No changes needed to Supabase configuration
- Client-side auth patterns remain the same
- RLS policies continue to work as expected

### Styling and UI
- All Tailwind CSS classes remain unchanged
- Component styling preserved exactly
- Animations and interactions maintained

### Third-party Integrations
- React Query works seamlessly with Next.js
- Supabase client-side integration unchanged
- All existing hooks and utilities preserved

## 12. Testing Strategy

### Component Testing
```typescript
// __tests__/components/Layout.test.tsx
import { render, screen } from '@testing-library/react';
import Layout from '@/components/layout/Layout';

describe('Layout Component', () => {
  it('renders with correct meta tags', () => {
    const title = 'Test Title';
    const description = 'Test Description';
    
    render(
      <Layout title={title} description={description}>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(document.title).toBe(title);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
```

### SSR Testing
```typescript
// __tests__/pages/blog/[blogSlug].test.tsx
import { getServerSideProps } from '@/pages/blog/[blogSlug]';

describe('/blog/[blogSlug] SSR', () => {
  it('fetches blog data correctly', async () => {
    const context = {
      params: { blogSlug: 'test-blog' },
    };
    
    const result = await getServerSideProps(context as any);
    
    expect(result).toHaveProperty('props');
    expect(result.props).toHaveProperty('blog');
  });
});
```

This migration plan ensures a smooth transition to Next.js while maintaining exact UI/UX parity and improving SEO, performance, and user experience through server-side rendering.