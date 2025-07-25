import React from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import Services from "@/components/home/Services";
import Testimonials from "@/components/home/Testimonials";
import BlogPreview from "@/components/home/BlogPreview";
import CTA from "@/components/home/CTA";
import CuppingInfo from "@/components/home/CuppingInfo";

const Index = () => {
  return (
    <Layout>
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

export default Index;
