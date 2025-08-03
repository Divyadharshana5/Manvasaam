"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManvaasamLogo } from "@/components/icons";
import { ArrowRight, Languages, Users, Building, Tractor } from "lucide-react";
import Image from 'next/image';
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const userRoles = [
  {
    name: "Farmer",
    description: "Join our network to sell your produce directly.",
    href: "/login/farmer-customer",
    icon: <Tractor className="h-12 w-12 text-primary" />,
  },
  {
    name: "Customer",
    description: "Get fresh, organic products delivered to your doorstep.",
    href: "/login/farmer-customer",
    icon: <Users className="h-12 w-12 text-primary" />,
  },
  {
    name: "Hub",
    description: "Manage logistics and connect farmers to customers.",
    href: "/login/hub",
    icon: <Building className="h-12 w-12 text-primary" />,
  },
];

const languages = ["English", "Tamil", "Malayalam", "Telugu", "Hindi"];

export default function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  return (
    <div className="flex flex-col min-h-screen auth-layout-background">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ManvaasamLogo width={32} height={32} />
          <span className="text-xl font-bold text-primary">Manvaasam</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Languages className="mr-2 h-4 w-4" />
              {selectedLanguage}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {languages.map((lang) => (
              <DropdownMenuItem key={lang} onSelect={() => setSelectedLanguage(lang)}>
                {lang}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pt-24 px-4">
        <section className="text-center w-full max-w-4xl mx-auto">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-12 flex items-center justify-center">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight text-center [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]">
                Empowering Farmers, Delivering Freshness
              </h1>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">Join Our Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userRoles.map((role) => (
              <Card key={role.name} className="bg-card/60 backdrop-blur-lg border-2 border-white/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="items-center">
                  {role.icon}
                  <CardTitle className="mt-4 text-2xl">{role.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{role.description}</p>
                  <Button asChild className="w-full">
                    <Link href={role.href}>
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="w-full max-w-4xl mx-auto mt-20 text-center">
           <h2 className="text-3xl font-bold mb-4 text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">Our Mission</h2>
           <p className="text-lg text-foreground/90 mb-8 max-w-3xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
            Manvaasam connects you directly with local farmers through our trusted hub network, ensuring you receive the freshest organic products while supporting sustainable agriculture.
           </p>
            <Card className="bg-card/60 backdrop-blur-lg border-2 border-white/20 shadow-lg">
                <CardContent className="p-6">
                    <div className="flex items-center justify-around text-lg font-semibold text-foreground">
                        <span>Farmer</span>
                        <ArrowRight size={48} className="text-primary"/>
                        <span>Hub</span>
                        <ArrowRight size={48} className="text-primary"/>
                        <span>Customer</span>
                    </div>
                </CardContent>
            </Card>
        </section>
      </main>

      <footer className="w-full p-4 text-center text-foreground/80 mt-12 [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
        © {new Date().getFullYear()} Manvaasam. All rights reserved.
      </footer>
    </div>
  );
}
