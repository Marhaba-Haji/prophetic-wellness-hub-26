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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">About Us</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-6">
            Welcome to our Hijama Therapy clinic where we specialize in Islamic traditional healing methods (Tibb e Nabwi). 
            Our approach combines traditional Islamic wellness practices with modern therapeutic techniques to address a wide range of health concerns.
          </p>
          <p className="text-lg mb-6">
            This page will contain detailed information about our clinic's history, philosophy, team members, facility, and certifications.
          </p>
        </div>
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