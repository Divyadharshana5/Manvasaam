"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, HeadphonesIcon, Mail, Phone, MessageCircle, Clock, HelpCircle, Users } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/" 
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </motion.div>
          <div className="flex items-center gap-2 text-primary">
            <HeadphonesIcon className="w-6 h-6" />
            <h1 className="text-xl font-bold">Support Center</h1>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden"
        >
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-100 to-primary/10 p-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <HeadphonesIcon className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">We're Here to Help</h2>
            <p className="text-gray-600">Get support for your agricultural marketplace needs. Our team is ready to assist you.</p>
          </div>

          {/* Contact Options */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Email Support */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Email Support</h3>
                    <p className="text-sm text-gray-600">Get detailed help via email</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Send us your questions and we'll respond within 24 hours.</p>
                <motion.a
                  href="mailto:slytherinpls8@gmail.com?subject=Support%20Request%20-%20Manvaasam&body=Hello%20Manvaasam%20Support%20Team,%0A%0AI%20need%20help%20with:%0A%0A[Please%20describe%20your%20issue%20here]%0A%0AThank%20you!"
                  className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </motion.a>
              </motion.div>

              {/* Phone Support */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Phone Support</h3>
                    <p className="text-sm text-gray-600">Speak directly with our team</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">Call us for immediate assistance with urgent issues.</p>
                <motion.a
                  href="tel:+919876543210"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </motion.a>
              </div>
            </div>

            {/* Support Hours */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-gray-800">Support Hours</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                <div>
                  <p className="font-medium">Email Support:</p>
                  <p>24/7 - We respond within 24 hours</p>
                </div>
                <div>
                  <p className="font-medium">Phone Support:</p>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                </div>
              </div>
            </motion.section>

            {/* FAQ Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <HelpCircle className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-gray-800">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-4">
                <motion.div 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-medium text-gray-800 mb-2">How do I register as a farmer?</h4>
                  <p className="text-gray-600 text-sm">Click on the "Farmer" button on the homepage and follow the registration process. You'll need to provide your farm details and contact information.</p>
                </motion.div>
                <motion.div 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-medium text-gray-800 mb-2">How can customers place orders?</h4>
                  <p className="text-gray-600 text-sm">Customers can browse available products, select items, and place orders directly through our platform. Payment and delivery options are available.</p>
                </motion.div>
                <motion.div 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-medium text-gray-800 mb-2">What are the quality standards?</h4>
                  <p className="text-gray-600 text-sm">We maintain strict quality standards for all agricultural products. Farmers must meet our quality guidelines and customers can rate their experience.</p>
                </motion.div>
              </div>
            </motion.section>

            {/* Additional Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-r from-primary/5 to-green-50 rounded-xl p-6 text-center"
            >
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Need More Help?</h3>
              <p className="text-gray-600 mb-4">
                Our support team is dedicated to helping you succeed on the Manvaasam platform.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 Email: <a href="mailto:slytherinpls8@gmail.com" className="text-primary hover:underline">slytherinpls8@gmail.com</a></p>
                <p>📞 Phone: <a href="tel:+919876543210" className="text-primary hover:underline">+91 9876543210</a></p>
                <p>📍 Address: Agricultural Hub, India</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
