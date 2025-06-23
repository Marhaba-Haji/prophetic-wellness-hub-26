
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from './Navbar';
import Footer from './Footer';
import { WhatsAppChat } from '@/components/ui/whatsapp-chat';
import { ClientOnly } from '@/components/ui/ClientOnlyComponent';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  canonical?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = "RevivoHeal Bangalore | Centre for Pain Relief & Healing",
  description = "Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies.",
  canonical
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {canonical && <link rel="canonical" href={canonical} />}
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <ClientOnly>
          <WhatsAppChat phoneNumber="+919480389296" />
        </ClientOnly>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
