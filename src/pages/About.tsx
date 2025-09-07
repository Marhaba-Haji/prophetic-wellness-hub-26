import React from "react";
import Layout from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout
      title="About Revivoheal | Unani, Hijama, and Acupressure Experts"
      description="Learn about Revivoheal, our experienced Dr. Arif Ali Shaik, and our commitment to natural healing through Unani medicine, Hijama, and Acupressure."
      canonical="https://www.revivoheal.com/about"
      image="https://www.revivoheal.com/images/about-us.jpg"
      keywords="about revivoheal, unani doctor, hijama therapy, acupressure clinic, dr arif ali shaik, natural healing bangalore"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-green mb-8 text-center">
          About Us – Revivoheal
        </h1>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-brand-green mb-4">Welcome to Revivoheal</h2>
          <p className="text-lg mb-6">
            At Revivoheal, we believe in healing the body naturally through time-tested alternative medicine. We specialize in Unani Medicine, Hijama (Cupping Therapy), and Acupressure, offering holistic treatments that restore balance to the mind, body, and spirit.
          </p>

          <h2 className="text-2xl font-semibold text-brand-green mb-4">Meet Our Doctor</h2>
          <h3 className="text-xl font-semibold text-gray-800">Dr. Arif Ali Shaik</h3>
          <p className="text-lg mb-6">
            35+ Years of Experience in Unani & Alternative Medicine
            <br />
            Bachelor of Unani Medicine & Surgery (Kamil-e-Tibb-o-Jarahat)
            <br />
            MD Moalijat – Dr. NTR University of Health Sciences, Andhra Pradesh (1994)
            <br />
            Registered Practitioner – Karnataka Ayurveda & Unani Practitioners Board (Reg. No. 630)
            <br />
            Expert in Regimental Therapy (Ilaj-bit-Tadbeer) and Munzij-Mushil Therapy – a cornerstone of Unani medicine for detoxification and purification
          </p>
          <p className="text-lg mb-6">
            Dr. Arif Ali Shaik has dedicated his life to treating patients with safe, natural therapies that focus on eliminating the root cause of illness rather than masking symptoms.
          </p>

          <h2 className="text-2xl font-semibold text-brand-green mb-4">Our Specializations</h2>
          <ul className="list-disc list-inside text-lg mb-6">
            <li>Unani Medicine – A holistic, natural system of medicine with centuries of proven efficacy</li>
            <li>Hijama (Cupping Therapy) – Improves circulation, detoxifies, and relieves pain & inflammation</li>
            <li>Acupressure – Stimulates energy pathways for relief from stress, fatigue, and chronic conditions</li>
          </ul>

          <h2 className="text-2xl font-semibold text-brand-green mb-4">Conditions We Treat</h2>
          <p className="text-lg mb-6">
            We provide treatment and management for a wide range of health conditions, including:
          </p>
          <ul className="list-disc list-inside text-lg mb-6">
            <li>Chronic Diseases: Hypertension, Diabetes, Cardiac Failure, High Cholesterol, Thyroidism</li>
            <li>Respiratory Disorders: Asthma, Bronchitis, Rhinitis, Sinusitis</li>
            <li>Digestive & Liver Issues: Indigestion, Acidity, Jaundice, Gall Bladder Stones, Hemorrhoids (Piles)</li>
            <li>Kidney & Urinary Problems: Kidney Stones, Creatinine Imbalance, Kidney Failure, Uric Acid</li>
            <li>Skin Conditions: Psoriasis, Eczema</li>
            <li>Musculoskeletal Disorders: Osteoarthritis, Spondylitis, Back Pain, Arthritis</li>
            <li>Neurological Conditions: Migraine, Paralysis</li>
            <li>Others: Varicose Veins, General Detoxification & Wellness</li>
          </ul>

          <h2 className="text-2xl font-semibold text-brand-green mb-4">Why Choose Revivoheal?</h2>
          <ul className="list-disc list-inside text-lg mb-6">
            <li>✔️ 35+ Years of Trusted Healing</li>
            <li>✔️ Safe, Natural & Non-Invasive Treatments</li>
            <li>✔️ Focus on Root Cause, Not Just Symptoms</li>
            <li>✔️ Personalized Care & Holistic Wellness Approach</li>
          </ul>

          <h2 className="text-2xl font-semibold text-brand-green mb-4">Our Commitment</h2>
          <p className="text-lg mb-6">
            At Revivoheal, we are committed to combining the wisdom of traditional Unani medicine with modern understanding of health and wellness. Our goal is to help patients achieve long-term relief, improved quality of life, and natural healing.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;
