import React from "react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import MainServices from "@/components/home/MainServices";
import Benefits from "@/components/home/Benefits";
import Testimonials from "@/components/home/Testimonials";
import BlogPreview from "@/components/home/BlogPreview";
import CTA from "@/components/home/CTA";
import CuppingInfo from "@/components/home/CuppingInfo";

const Index = () => {
  return (
    <Layout 
      canonical="/"
      image="/lovable-uploads/47141481-b66c-419d-aadb-9fe29f691c16.png"
      keywords="RevivoHeal, cupping therapy, Hijama, pain relief, Bangalore, traditional medicine"
    >
      <Hero />
      <MainServices />
      <Benefits />
      <CuppingInfo />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </Layout>
  );
};

export default Index;
