
import React from "react";
import Layout from "@/components/layout/Layout";

const Privacy = () => (
  <Layout>
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-brand-green">
        PRIVACY POLICY – Revivo Heal
      </h1>
      <p className="text-gray-700 mb-4">
        At Revivo Heal, we are committed to protecting your personal
        information. This Privacy Policy explains how we collect, use, and
        protect your data.
      </p>
      <ol className="list-decimal list-inside space-y-4 text-gray-700">
        <li>
          <strong>Information We Collect</strong>
          <br />
          We may collect the following:
          <ul className="list-disc list-inside ml-6">
            <li>Name, contact number, email address</li>
            <li>Details shared during service booking or consultations</li>
            <li>Browsing data via cookies when you visit our website</li>
          </ul>
        </li>
        <li>
          <strong>Use of Your Information</strong>
          <br />
          We use your information to:
          <ul className="list-disc list-inside ml-6">
            <li>Confirm and manage appointments</li>
            <li>Send reminders and important service-related communication</li>
            <li>Improve our customer service and offerings</li>
            <li>
              Send promotional messages (only if you've opted in—unsubscribe
              anytime)
            </li>
          </ul>
        </li>
        <li>
          <strong>Data Security</strong>
          <br />
          We employ reasonable security measures to protect your data. Your
          personal information will not be sold or shared with third parties
          without your explicit consent, unless required by law.
        </li>
        <li>
          <strong>Cookies</strong>
          <br />
          Our website may use cookies to enhance your browsing experience. You
          can disable cookies in your browser settings if you prefer.
        </li>
        <li>
          <strong>Your Rights</strong>
          <br />
          You may request access to or deletion of your personal data at any
          time by contacting us at{" "}
          <a
            href="mailto:revivoheal@gmail.com"
            className="text-brand-green underline"
          >
            revivoheal@gmail.com
          </a>
          .
        </li>
      </ol>
    </div>
  </Layout>
);

export default Privacy;
