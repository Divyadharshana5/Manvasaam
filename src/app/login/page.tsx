"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Sprout, 
  Store, 
  Truck, 
  ChefHat,
  ArrowRight,
  Users
} from "lucide-react";

const userTypes = [
  {
    type: "farmer",
    title: "Farmer",
    description: "Sell your harvest directly to hubs",
    icon: Sprout,
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600"
  },
  {
    type: "retail",
    title: "Retail Store",
    description: "Manage inventory and orders",
    icon: Store,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600"
  },
  {
    type: "transport",
    title: "Transport",
    description: "Handle deliveries and logistics",
    icon: Truck,
    color: "bg-orange-500",
    hoverColor: "hover:bg-orange-600"
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleUserTypeSelect = (userType: string) => {
    setSelectedType(userType);
    // Navigate to the specific login page
    router.push(`/login/${userType}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Users className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Manvaasam</h1>
          </motion.div>
          <p className="text-xl text-gray-600">Choose your account type to continue</p>
        </motion.div>

        {/* User Type Selection */}
        <motion.div 
          className="grid gap-6 md:grid-cols-3"
          variants={containerVariants}
        >
          {userTypes.map((userType) => {
            const IconComponent = userType.icon;
            return (
              <motion.div
                key={userType.type}
                variants={cardVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg border-2 hover:border-primary"
                  onClick={() => handleUserTypeSelect(userType.type)}
                >
                  <CardHeader className="text-center pb-4">
                    <motion.div
                      className={`w-16 h-16 ${userType.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl">{userType.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {userType.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button 
                      className={`w-full ${userType.color} ${userType.hoverColor} text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUserTypeSelect(userType.type);
                      }}
                    >
                      Login as {userType.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-8"
          variants={itemVariants}
        >
          <p className="text-gray-500 text-sm">
            Don't have an account? Contact your administrator or{" "}
            <button 
              className="text-green-600 hover:text-green-700 underline"
              onClick={() => router.push("/signup")}
            >
              sign up here
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}