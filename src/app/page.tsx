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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen auth-layout-background">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <ManvaasamLogo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">Manvaasam</span>
        </div>
        <Button variant="outline">
          <Languages className="mr-2 h-4 w-4" />
          English
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pt-24 px-4">
        <section className="text-center w-full max-w-4xl mx-auto">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-2xl mb-12 bg-black/30">
             <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight text-center">
                Empowering Farmers, Delivering Freshness
              </h1>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-white">Join Our Community</h2>
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
           <h2 className="text-3xl font-bold mb-4 text-white">Our Mission</h2>
           <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
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

      <footer className="w-full p-4 text-center text-muted-foreground mt-12">
        © {new Date().getFullYear()} Manvaasam. All rights reserved.
      </footer>
    </div>
  );
}
