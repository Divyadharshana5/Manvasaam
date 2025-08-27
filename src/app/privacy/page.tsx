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
            y: [0, -10, 0],
            rotate: [0, 45, 0]
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
            scale: [1, 0.8, 1.3, 1],
            opacity: [0.3, 0.6, 0.2, 0.3],
            x: [0, -15, 10, 0],
            y: [0, 15, -5, 0],
            skewX: [0, 10, -10, 0]
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
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.3, 0.4, 0.6, 0.3],
            rotate: [0, 180, 360],
            borderRadius: ["50%", "30%", "50%"]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "linear",
            delay: 4
          }}
        />
        <motion.div 
          className="absolute top-1/2 right-10 w-24 h-24 bg-emerald-200/25 rounded-full blur-2xl"
          animate={{ 
            scale: [0.8, 1.4, 0.8],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -30, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-cyan-200/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 0.7, 1.2, 1],
            opacity: [0.2, 0.4, 0.1, 0.2],
            rotate: [0, -90, 90, 0],
            x: [0, 25, -15, 0]
          }}
          transition={{ 
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
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
          {/* Enhanced Hero Section */}
          <motion.div 
            className="relative text-center space-y-6 py-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.4,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.15,
                rotate: [0, -5, 5, 0],
                boxShadow: "0 25px 50px rgba(34, 197, 94, 0.3)",
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl blur-xl"
                animate={{ 
                  scale: [1, 1.3, 0.9, 1],
                  opacity: [0.2, 0.5, 0.1, 0.2],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                whileHover={{
                  rotate: [0, 720],
                  transition: { duration: 1 }
                }}
              >
                <Shield className="relative h-10 w-10 text-green-600" />
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-green-300/30"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </motion.div>
            <div className="space-y-3">
              <motion.h1 
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Privacy Policy
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                How we collect, use, and protect your information on Manvaasam
                platform
              </motion.p>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <p className="text-sm text-green-700 font-medium">
                  Updated: December 2024
                </p>
              </motion.div>
            </div>
          </motion.div>

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

          {/* Enhanced Main Content */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-green-200/50 hover:border-green-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                    >
                      <Database className="h-4 w-4 text-green-600" />
                    </motion.div>
                    What We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 }}
                  >
                    <h4 className="font-medium mb-1">Personal Info</h4>
                    <p className="text-gray-600 text-xs">
                      Name, email, phone, farm/business details
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.6 }}
                  >
                    <h4 className="font-medium mb-1">Usage Data</h4>
                    <p className="text-gray-600 text-xs">
                      How you use our platform, device info
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-blue-200/50 hover:border-blue-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 3 }}
                    >
                      <Users className="h-4 w-4 text-blue-600" />
                    </motion.div>
                    How We Use It
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.6 }}
                  >
                    <h4 className="font-medium mb-1">Platform Services</h4>
                    <p className="text-gray-600 text-xs">
                      Connect farmers, buyers, facilitate transactions
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.8 }}
                  >
                    <h4 className="font-medium mb-1">Communication</h4>
                    <p className="text-gray-600 text-xs">
                      Updates, notifications, support
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Enhanced Your Rights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Shield className="h-4 w-4 text-primary" />
                  </motion.div>
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-3 text-center text-sm">
                  {[
                    { icon: Users, title: "Access", desc: "View your data", delay: 1.8 },
                    { icon: Lock, title: "Correct", desc: "Update info", delay: 2.0 },
                    { icon: Database, title: "Export", desc: "Download data", delay: 2.2 },
                    { icon: Shield, title: "Delete", desc: "Remove account", delay: 2.4 }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="space-y-1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: item.delay }}
                      whileHover={{ 
                        scale: 1.05,
                        y: -5
                      }}
                    >
                      <motion.div 
                        className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
                        whileHover={{ 
                          backgroundColor: "rgba(34, 197, 94, 0.2)",
                          scale: 1.1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <item.icon className="h-4 w-4 text-primary" />
                      </motion.div>
                      <h4 className="font-medium text-xs">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

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
