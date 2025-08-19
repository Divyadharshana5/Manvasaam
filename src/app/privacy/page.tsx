"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Database, Users, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
            <Shield className="w-6 h-6" />
            <h1 className="text-xl font-bold">Privacy Policy</h1>
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
          <div className="bg-gradient-to-r from-primary/10 to-green-100 p-8 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Privacy Matters</h2>
            <p className="text-gray-600">We are committed to protecting your personal information and privacy rights.</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: December 2024</p>
          </div>

          {/* Content Sections */}
          <div className="p-8 space-y-8">
            {/* Information We Collect */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="border-l-4 border-primary/30 pl-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold text-gray-800">Information We Collect</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>• <strong>Personal Information:</strong> Name, email address, phone number, and location data</p>
                <p>• <strong>Agricultural Data:</strong> Crop information, farming practices, and production details</p>
                <p>• <strong>Usage Data:</strong> How you interact with our platform and services</p>
                <p>• <strong>Device Information:</strong> Browser type, IP address, and device identifiers</p>
              </div>
            </motion.section>

            {/* How We Use Information */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="border-l-4 border-green-300 pl-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">How We Use Your Information</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>• Facilitate connections between farmers, customers, and distribution hubs</p>
                <p>• Improve our agricultural marketplace and services</p>
                <p>• Send important updates and notifications about your account</p>
                <p>• Ensure platform security and prevent fraudulent activities</p>
                <p>• Provide customer support and respond to your inquiries</p>
              </div>
            </motion.section>

            {/* Data Protection */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="border-l-4 border-blue-300 pl-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">Data Protection & Security</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>• We use industry-standard encryption to protect your data</p>
                <p>• Regular security audits and monitoring systems</p>
                <p>• Limited access to personal information on a need-to-know basis</p>
                <p>• Secure data storage with backup and recovery procedures</p>
              </div>
            </motion.section>

            {/* Your Rights */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="border-l-4 border-purple-300 pl-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-800">Your Rights</h3>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>• <strong>Access:</strong> Request a copy of your personal data</p>
                <p>• <strong>Correction:</strong> Update or correct inaccurate information</p>
                <p>• <strong>Deletion:</strong> Request deletion of your personal data</p>
                <p>• <strong>Portability:</strong> Transfer your data to another service</p>
                <p>• <strong>Opt-out:</strong> Unsubscribe from marketing communications</p>
              </div>
            </motion.section>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-r from-primary/5 to-green-50 rounded-xl p-6 text-center"
            >
              <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Questions About Privacy?</h3>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
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
