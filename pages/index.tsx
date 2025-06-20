import { GetStaticProps } from 'next';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Benefits from '@/components/home/Benefits';
import Services from '@/components/home/Services';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
import CTA from '@/components/home/CTA';
import CuppingInfo from '@/components/home/CuppingInfo';

interface HomePageProps {
  // Add any static data props here
}

const HomePage = (props: HomePageProps) => {
  return (
    <Layout 
      title="RevivoHeal Bangalore | Centre for Pain Relief & Healing with Cupping & Massage Therapies"
      description="Experience pain relief at RevivoHeal Bangalore with Hijama cupping and traditional massage therapies. Natural healing by certified professionals. Book now."
      canonical="https://revivoheal.com/"
    >
      <Hero />
      <Benefits />
      <Services />
      <CuppingInfo />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 86400, // Revalidate every 24 hours
  };
};

export default HomePage;