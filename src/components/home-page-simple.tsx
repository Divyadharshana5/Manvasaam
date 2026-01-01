"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tractor, Building, Users, Truck } from "lucide-react";

interface RoleOption {
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export default function HomePageSimple() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const roles: RoleOption[] = [
    {
      name: "Farmer",
      description: "Join our network to sell your produce directly.",
      href: "/login/farmer",
      icon: <Tractor className="w-12 h-12 text-green-600" />,
    },
    {
      name: "Customer",
      description: "Get fresh, organic products delivered to your doorstep.",
      href: "/login/retail",
      icon: <Users className="w-12 h-12 text-blue-600" />,
    },
    {
      name: "Hub Manager",
      description: "Manage logistics and connect farmers to customers.",
      href: "/login/transport",
      icon: <Building className="w-12 h-12 text-purple-600" />,
    },
    {
      name: "Transport",
      description: "Deliver fresh produce with our logistics network.",
      href: "/login/transport",
      icon: <Truck className="w-12 h-12 text-orange-600" />,
    },
  ];

  const handleContinue = (href: string) => {
    setLoading(href);
    setTimeout(() => {
      window.location.href = href;
    }, 300);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Manvaasam
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Empowering Farmers, Delivering Freshness
        </p>
        <p className="text-gray-500">
          Connect farmers, hubs, customers, and restaurants in a seamless
          agricultural marketplace.
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Join Our Community
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <Card
              key={role.href}
              className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <CardHeader className="text-center flex-shrink-0">
                <div className="flex justify-center mb-4">{role.icon}</div>
                <CardTitle className="text-xl">{role.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <p className="text-gray-600 text-sm mb-6 flex-grow">
                  {role.description}
                </p>
                <Button
                  onClick={() => handleContinue(role.href)}
                  disabled={loading === role.href}
                  className="w-full"
                >
                  {loading === role.href ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⟳</span>
                      Loading...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 px-4 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
          <p className="text-gray-600">
            Manvaasam connects you directly with local farmers through our
            trusted hub network, ensuring you receive the freshest organic
            products while supporting sustainable agriculture.
          </p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap mb-6">
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            href="/terms"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Terms of Service
          </Link>
          <span className="text-gray-400">•</span>
          <Link
            href="/support"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Support
          </Link>
        </div>

        <p className="text-gray-500 text-sm">
          © 2024 Manvaasam. All rights reserved.
        </p>
      </div>
    </div>
  );
}
