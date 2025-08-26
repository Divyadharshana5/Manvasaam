"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Lock, Users, Database, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

// Loading component for fast initial render
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/3 w-36 h-36 bg-purple-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            delay: 4
          }}
        />
      </div>

      {/* Enhanced Animated Header */}
      <motion.header 
        className="relative bg-white/95 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div 
              className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg"
              whileHover={{ 
                scale: 1.1, 
                rotate: 360,
                boxShadow: "0 10px 25px rgba(34, 197, 94, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              <Shield className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <motion.h1 
                className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Privacy Policy
              </motion.h1>
              <motion.p 
                className="text-xs text-muted-foreground"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Your data protection matters
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Hero */}
          <div className="relative text-center space-y-6 py-8">
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl blur-xl"></div>
              <Shield className="relative h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                How we collect, use, and protect your information on Manvaasam
                platform
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-green-700 font-medium">
                  Updated: December 2024
                </p>
              </div>
            </div>
          </div>

          {/* Key Points */}
          <Card className="relative border-0 bg-gradient-to-br from-white/80 to-green-50/80 backdrop-blur-sm shadow-xl">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <motion.div
                  className="space-y-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-green-200/50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base text-gray-800">
                    Secure
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Industry-standard encryption protects your data
                  </p>
                </motion.div>
                <motion.div
                  className="space-y-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-blue-200/50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base text-gray-800">
                    Private
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We never sell or share your personal data
                  </p>
                </motion.div>
                <motion.div
                  className="space-y-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-purple-200/50 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-base text-gray-800">
                    Your Control
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Delete or modify your data anytime
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">What We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Personal Info</h4>
                  <p className="text-gray-600 text-xs">
                    Name, email, phone, farm/business details
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Usage Data</h4>
                  <p className="text-gray-600 text-xs">
                    How you use our platform, device info
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">How We Use It</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Platform Services</h4>
                  <p className="text-gray-600 text-xs">
                    Connect farmers, buyers, facilitate transactions
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Communication</h4>
                  <p className="text-gray-600 text-xs">
                    Updates, notifications, support
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Rights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-3 text-center text-sm">
                <div className="space-y-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-xs">Access</h4>
                  <p className="text-xs text-gray-600">View your data</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-xs">Correct</h4>
                  <p className="text-xs text-gray-600">Update info</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-xs">Export</h4>
                  <p className="text-xs text-gray-600">Download data</p>
                </div>
                <div className="space-y-1">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="font-medium text-xs">Delete</h4>
                  <p className="text-xs text-gray-600">Remove account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-primary" />
                <h3 className="font-medium text-sm">Questions about Privacy?</h3>
              </div>
              <div className="text-xs space-y-1">
                <p>
                  <strong>Email:</strong> slytherinpls8@gmail.com
                </p>
                <p>
                  <strong>Phone:</strong> +91 9876543210
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Return Button */}
          <div className="text-center pt-6">
            <Link href="/" prefetch={true}>
              <Button className="gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl transform-gpu hover:scale-105 active:scale-95">
                <ArrowLeft className="h-4 w-4" />
                Return to Manvaasam
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PrivacyContent />
    </Suspense>
  );
}
