"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, FileText, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface FastNavProps {
  className?: string;
  variant?: "horizontal" | "vertical" | "grid";
  showIcons?: boolean;
}

export function FastNav({ 
  className = "", 
  variant = "horizontal", 
  showIcons = true 
}: FastNavProps) {
  const navItems = [
    {
      href: "/privacy",
      label: "Privacy",
      icon: Shield,
      description: "Data protection policy",
      color: "from-green-500 to-emerald-500"
    },
    {
      href: "/terms",
      label: "Terms",
      icon: FileText,
      description: "Service agreement",
      color: "from-blue-500 to-cyan-500"
    },
    {
      href: "/support",
      label: "Support",
      icon: HelpCircle,
      description: "Get help & FAQs",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const containerClasses = {
    horizontal: "flex flex-wrap gap-2 justify-center",
    vertical: "flex flex-col gap-2",
    grid: "grid grid-cols-1 sm:grid-cols-3 gap-3"
  };

  const itemClasses = {
    horizontal: "flex-1 min-w-[120px]",
    vertical: "w-full",
    grid: "w-full"
  };

  return (
    <nav className={`${containerClasses[variant]} ${className}`}>
      {navItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
            className={itemClasses[variant]}
          >
            <Link href={item.href} prefetch={true}>
              <Button
                variant="outline"
                className={`
                  ${variant === "grid" ? "h-auto p-4 flex-col gap-2" : "gap-2"}
                  w-full transition-all duration-200 transform-gpu
                  hover:scale-105 active:scale-95
                  hover:shadow-lg hover:border-transparent
                  bg-gradient-to-r ${item.color} hover:opacity-90
                  text-white border-0 shadow-md
                  group relative overflow-hidden
                `}
              >
                {/* Background animation */}
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                
                {/* Content */}
                <div className={`relative z-10 flex items-center ${variant === "grid" ? "flex-col" : ""} gap-2`}>
                  {showIcons && (
                    <Icon className={`${variant === "grid" ? "h-6 w-6" : "h-4 w-4"} flex-shrink-0`} />
                  )}
                  <div className={`${variant === "grid" ? "text-center" : ""}`}>
                    <div className="font-medium text-sm">{item.label}</div>
                    {variant === "grid" && (
                      <div className="text-xs opacity-90 mt-1">{item.description}</div>
                    )}
                  </div>
                  {variant !== "grid" && (
                    <ArrowRight className="h-3 w-3 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                  )}
                </div>
              </Button>
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}

// Quick access floating button
export function QuickAccessButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        className="relative"
      >
        <Button
          className="rounded-full w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200 transform-gpu hover:scale-110 active:scale-95"
          onClick={() => {
            // Toggle quick nav menu
            const menu = document.getElementById('quick-nav-menu');
            if (menu) {
              menu.classList.toggle('hidden');
            }
          }}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
        
        {/* Quick menu */}
        <div
          id="quick-nav-menu"
          className="hidden absolute bottom-16 right-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-3 min-w-[200px]"
        >
          <FastNav variant="vertical" className="gap-1" />
        </div>
      </motion.div>
    </div>
  );
}