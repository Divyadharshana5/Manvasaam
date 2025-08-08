
"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManvaasamLogo } from "@/components/icons";
import { ArrowRight, Languages, Users, Building, Tractor, Utensils, Mic } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, translations, languages } from "@/context/language-context";

export default function HomePage() {
  const { selectedLanguage, setSelectedLanguage, t } = useLanguage();
  
  const userRoles = [
    {
      name: t.roles.farmer.name,
      description: t.roles.farmer.description,
      href: "/login/farmer-customer",
      icon: <Tractor className="h-12 w-12 text-primary" />,
    },
    {
      name: t.roles.customer.name,
      description: t.roles.customer.description,
      href: "/login/farmer-customer",
      icon: <Users className="h-12 w-12 text-primary" />,
    },
    {
      name: t.roles.hub.name,
      description: t.roles.hub.description,
      href: "/login/hub",
      icon: <Building className="h-12 w-12 text-primary" />,
    },
    {
      name: t.roles.restaurant.name,
      description: t.roles.restaurant.description,
      href: "/login/restaurant",
      icon: <Utensils className="h-12 w-12 text-primary" />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2">
          <ManvaasamLogo width={32} height={32} />
          <span className="text-xl font-bold text-primary">Manvaasam</span>
        </Link>
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
                <Link href="/voice-assistant">
                    <Mic className="mr-2 h-4 w-4" />
                    {t.sidebar.voiceAssistant}
                </Link>
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                <Languages className="mr-2 h-4 w-4" />
                {selectedLanguage}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {languages.map((lang) => (
                <DropdownMenuItem key={lang} onSelect={() => setSelectedLanguage(lang as keyof typeof translations)}>
                    {lang}
                </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center pt-24 px-4 relative z-10">
        <section className="text-center w-full max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight text-center mb-12" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)' }}>{t.tagline}</h1>
          <h2 className="text-3xl font-bold mb-8 text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">{t.joinCommunity}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {userRoles.map((role) => (
              <Card
                key={role.name}
                className="bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6"
              >
                <CardHeader className="items-center">
                  {role.icon}
                  <CardTitle className="mt-4 text-2xl">{role.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{role.description}</p>
                  <Button asChild className="w-full">
                    <Link href={role.href}>
                      {t.continue} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="w-full max-w-4xl mx-auto mt-20 text-center">
           <h2 className="text-3xl font-bold mb-4 text-foreground [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">{t.ourMission}</h2>
           <p className="text-lg text-foreground/90 mb-8 max-w-3xl mx-auto [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">{t.missionStatement}</p>
            <Card className="bg-card/80 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-lg p-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-4 text-lg font-semibold text-foreground">
                        <span>{t.roles.farmer.name}</span>
                        <ArrowRight size={24} className="text-primary"/>
                        <span>{t.roles.hub.name}</span>
                        <ArrowRight size={24} className="text-primary"/>
                        <span>{t.roles.customer.name}</span>
                    </div>
                </CardContent>
            </Card>
        </section>
      </main>
      <footer className="w-full p-4 text-center text-foreground/80 mt-12 [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] relative z-10">
        © {new Date().getFullYear()} Manvaasam. {t.footer}
      </footer>
    </div>
  );
}
