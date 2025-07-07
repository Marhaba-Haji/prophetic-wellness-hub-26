
import React from "react";
import Layout from "@/components/layout/Layout";

const Refund = () => (
  <Layout>
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-brand-green">
        RETURNS & REFUNDS POLICY – Revivo Heal
      </h1>
      <p className="text-gray-700 mb-4">
        Revivo Heal offers in-person wellness and therapeutic services. As such,
        we do not deal in physical products and do not offer returns or
        deliveries.
      </p>
      <ol className="list-decimal list-inside space-y-4 text-gray-700">
        <li>
          <strong>Cancellations</strong>
          <br />
          You may cancel or reschedule your session up to 12 hours in advance at
          no additional charge.
          <br />
          Late cancellations may incur a cancellation fee equivalent to 50% of
          the session cost.
        </li>
        <li>
          <strong>Refunds</strong>
          <br />
          No refunds will be issued for completed sessions.
          <br />
          If you are dissatisfied with your service, please email us within 24
          hours of your appointment. We will review your feedback and work to
          resolve your concerns.
        </li>
        <li>
          <strong>No-Show Policy</strong>
          <br />
          Clients who fail to show up for an appointment without prior notice
          will be charged the full session fee.
        </li>
      </ol>
      <div className="mt-8 text-gray-700">
        <h2 className="text-xl font-semibold mb-2">Business Information:</h2>
        <p>Revivo Heal (A unit of Marhaba Ventures Private Limited)</p>
        <p>
          📍 Paramount Avenue, 63/1, 3rd Floor, Mosque Road Cross, Frazer Town,
          Bangalore – 560005, India
        </p>
        <p>
          📧 Email:{" "}
          <a
            href="mailto:revivoheal@gmail.com"
            className="text-brand-green underline"
          >
            revivoheal@gmail.com
          </a>
        </p>
        <p>
          🌐 Website:{" "}
          <a
            href="https://www.revivoheal.com"
            className="text-brand-green underline"
          >
            www.revivoheal.com
          </a>
        </p>
      </div>
    </div>
  </Layout>
);

export default Refund;
