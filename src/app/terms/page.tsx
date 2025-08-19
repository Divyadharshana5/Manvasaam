"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle, Users, Gavel } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
            <Scale className="w-6 h-6" />
            <h1 className="text-xl font-bold">Terms of Service</h1>
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
          <div className="bg-gradient-to-r from-blue-100 to-primary/10 p-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Scale className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Terms of Service</h2>
            <p className="text-gray-600">Please read these terms carefully before using our agricultural platform.</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: December 2024</p>
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            {/* Acceptance of Terms */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="border-l-4 border-primary/30 pl-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-gray-800">Acceptance of Terms</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>By accessing and using Manvaasam, you accept and agree to be bound by the terms and provision of this agreement.</p>
                <p>If you do not agree to abide by the above, please do not use this service.</p>
                <p>These terms apply to all users of the platform including farmers, customers, restaurants, and distribution hubs.</p>
              </div>
            </motion.section>

            {/* Platform Services */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="border-l-4 border-green-300 pl-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">Platform Services</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>• <strong>Marketplace:</strong> Connect farmers with customers, restaurants, and distribution hubs</p>
                <p>• <strong>Quality Assurance:</strong> Facilitate fresh, quality produce transactions</p>
                <p>• <strong>Communication:</strong> Enable direct communication between parties</p>
                <p>• <strong>Order Management:</strong> Track and manage agricultural product orders</p>
                <p>• <strong>Support Services:</strong> Provide customer support and technical assistance</p>
              </div>
            </motion.section>

            {/* User Responsibilities */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="border-l-4 border-blue-300 pl-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">User Responsibilities</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>• Provide accurate and truthful information about products and services</p>
                <p>• Maintain the quality and safety standards of agricultural products</p>
                <p>• Respect other users and conduct business in good faith</p>
                <p>• Comply with all applicable laws and regulations</p>
                <p>• Protect your account credentials and notify us of any unauthorized access</p>
              </div>
            </motion.section>

            {/* Prohibited Activities */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="border-l-4 border-red-300 pl-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-semibold text-gray-800">Prohibited Activities</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>• Posting false or misleading information about products</p>
                <p>• Engaging in fraudulent or deceptive practices</p>
                <p>• Violating intellectual property rights</p>
                <p>• Attempting to harm or disrupt the platform</p>
                <p>• Using the platform for illegal activities</p>
              </div>
            </motion.section>

            {/* Limitation of Liability */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="border-l-4 border-purple-300 pl-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-800">Limitation of Liability</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>Manvaasam acts as a platform to facilitate connections between agricultural stakeholders.</p>
                <p>We are not responsible for the quality, safety, or legality of products listed on the platform.</p>
                <p>Users are responsible for their own transactions and agreements made through the platform.</p>
                <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
              </div>
            </motion.section>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-xl p-6 text-center"
            >
              <Scale className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Questions About Terms?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
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
