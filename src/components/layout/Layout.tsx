
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { WhatsAppChat } from '@/components/ui/whatsapp-chat';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <WhatsAppChat phoneNumber="+919480389296" />
      <Footer />
    </div>
  );
};

export default Layout;
