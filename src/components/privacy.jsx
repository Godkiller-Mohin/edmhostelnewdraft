import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#01231f] text-white min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4 mt-12 text-center">Privacy Policy</h1>
          <p className="text-gray-300 text-lg text-center">Last Updated: December 2024</p>
        </header>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
              1. Information We Collect
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>Personal contact information</li>
              <li>Booking details</li>
              <li>Communication preferences</li>
              <li>Payment information</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We use the collected information to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>Process your bookings</li>
              <li>Communicate with you about your stay</li>
              <li>Improve our services</li>
              <li>Send promotional information (with your consent)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
              3. Data Protection
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
              4. Your Rights
            </h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
              <li>Access your personal information</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
              5. Contact Us
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 text-gray-300">
              <p>Email: edmhostel@gmail.com</p>
              <p>Phone: +91 8091977846</p>
            </div>
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-gray-700 text-center">
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;