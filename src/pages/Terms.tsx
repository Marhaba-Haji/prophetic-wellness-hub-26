import React from 'react';
import Layout from '@/components/layout/Layout';

const Terms = () => (
  <Layout>
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-brand-green">TERMS & CONDITIONS – Revivo Heal</h1>
      <p className="text-gray-700 mb-4">
        Welcome to Revivo Heal. By accessing our website (revivoheal.com) and booking services with us, you agree to the following Terms and Conditions:
      </p>
      <ol className="list-decimal list-inside space-y-4 text-gray-700">
        <li>
          <strong>Use of Website</strong><br />
          The content on this website is for informational purposes only.<br />
          You agree not to misuse the website, submit misleading information, or engage in any activity that could disrupt our services or violate applicable laws.
        </li>
        <li>
          <strong>Booking Appointments</strong><br />
          All appointments are subject to therapist availability.<br />
          Revivo Heal reserves the right to accept, cancel, or reschedule appointments at its sole discretion.<br />
          Please ensure that health disclosures shared during booking are accurate to the best of your knowledge.
        </li>
        <li>
          <strong>Health Disclaimer</strong><br />
          Hijama (cupping therapy) and other services offered are complementary in nature and not a replacement for medical diagnosis or treatment.<br />
          It is your responsibility to consult your physician before undergoing any wellness therapy.
        </li>
        <li>
          <strong>User Conduct</strong><br />
          You agree not to:
          <ul className="list-disc list-inside ml-6">
            <li>Harass, intimidate, or cause harm to our therapists or staff.</li>
            <li>Misuse or reproduce our website content, brand, or media assets for commercial purposes without prior consent.</li>
          </ul>
        </li>
        <li>
          <strong>Intellectual Property</strong><br />
          All content on revivoheal.com—including but not limited to text, images, graphics, and branding—is the property of Revivo Heal (Marhaba Ventures Private Limited) and may not be copied or used without written permission.
        </li>
        <li>
          <strong>Modifications</strong><br />
          These terms may be updated periodically. Continued use of our website or services constitutes your acceptance of any changes.
        </li>
      </ol>
    </div>
  </Layout>
);

export default Terms; 