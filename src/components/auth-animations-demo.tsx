"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tractor, ChefHat, Building2, ShoppingCart, Heart, Star, Flame, Cog } from "lucide-react";

export function AuthAnimationsDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-center text-emerald-800 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Unique Login/Register Page Animations
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Farmer Animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-80 bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-emerald-700">Farmer Portal</CardTitle>
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-full border-2 border-emerald-200">
                  <motion.div className="farmer-tractor-animate">
                    <Tractor className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full farmer-soil-ripple"></div>
                    <span>Soil Ripple Effect</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full farmer-soil-ripple" style={{ animationDelay: '1s' }}></div>
                    <span>Growth Animation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brown-600 rounded-full farmer-soil-ripple" style={{ animationDelay: '2s' }}></div>
                    <span>Farming Theme</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Restaurant Animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-80 bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-emerald-700">Restaurant Portal</CardTitle>
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-full border-2 border-emerald-200">
                  <motion.div className="restaurant-chef-hat-float">
                    <ChefHat className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-400 rounded-full restaurant-flame-flicker"></div>
                    <span>Flame Flicker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full restaurant-flame-flicker" style={{ animationDelay: '1.5s' }}></div>
                    <span>Cooking Theme</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full restaurant-ingredient-drop"></div>
                    <span>Ingredient Drop</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hub Animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-80 bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-emerald-700">Hub Portal</CardTitle>
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-full border-2 border-emerald-200">
                  <motion.div className="hub-building-construct">
                    <Building2 className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full hub-pulse-glow"></div>
                    <span>Pulse Glow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full hub-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
                    <span>Building Construct</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-3 h-3 bg-purple-500 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    ></motion.div>
                    <span>Cog Rotation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Customer Animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-80 bg-white/80 backdrop-blur-sm border-emerald-200 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-emerald-700">Customer Portal</CardTitle>
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-emerald-100 to-green-100 rounded-full border-2 border-emerald-200">
                  <motion.div className="customer-shopping-bag-swing">
                    <ShoppingCart className="h-8 w-8 text-emerald-600" />
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-400 rounded-full customer-heart-beat"></div>
                    <span>Heart Beat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full customer-star-twinkle"></div>
                    <span>Star Twinkle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full customer-heart-beat" style={{ animationDelay: '2s' }}></div>
                    <span>Shopping Theme</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Background Animation Demo */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-emerald-700 mb-6">Background Animations</h2>
          <div className="relative h-32 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 gradient-shift"></div>
            <div className="absolute top-8 left-1/4 w-8 h-8 bg-emerald-300/50 rounded-full floating-bubble"></div>
            <div className="absolute top-16 right-1/4 w-6 h-6 bg-green-300/50 rounded-full floating-bubble" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-8 left-1/3 w-10 h-10 bg-lime-300/50 rounded-full floating-bubble" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-16 right-1/3 w-7 h-7 bg-emerald-400/50 rounded-full floating-bubble" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </motion.div>

        {/* Form Animation Demo */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-emerald-700 mb-6">Form Field Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-medium text-emerald-600">Focus Animation</h3>
              <div className="h-12 bg-emerald-100 rounded border-2 border-emerald-200 form-field-focus-animate"></div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-emerald-600">Error Animation</h3>
              <div className="h-12 bg-red-100 rounded border-2 border-red-200 form-field-error-animate"></div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-emerald-600">Success Animation</h3>
              <div className="h-12 bg-green-100 rounded border-2 border-green-200 flex items-center justify-center">
                <motion.div 
                  className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                ></motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Features */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h2 className="text-2xl font-semibold text-emerald-700 mb-6">Performance Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-700">Hardware Acceleration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• transform: translateZ(0)</div>
                  <div>• will-change: transform, opacity</div>
                  <div>• backface-visibility: hidden</div>
                  <div>• GPU-accelerated animations</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-emerald-700">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• Reduced motion support</div>
                  <div>• Screen reader friendly</div>
                  <div>• Keyboard navigation</div>
                  <div>• High contrast support</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
