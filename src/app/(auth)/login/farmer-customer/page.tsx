"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tractor, Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";



export default function FarmerCustomerRedirectPage() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Auto-redirect to customer page after 3 seconds if no selection is made
    const timer = setTimeout(() => {
      router.push("/login/customer");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <Card className="w-full max-w-md mx-4 sm:mx-auto bg-card/80 backdrop-blur-lg border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="text-lg sm:text-xl">
          Choose Your Account Type
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          We now have separate portals for better experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-sm text-muted-foreground mb-6">
          Please select your account type to continue to the appropriate portal
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => router.push("/login/farmer")}
            className="w-full h-16 text-left justify-start"
            variant="outline"
          >
            <div className="flex items-center gap-3">
              <Tractor className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">Farmer Portal</div>
                <div className="text-xs text-muted-foreground">
                  Enhanced security with passkey authentication
                </div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </div>
          </Button>
          
          <Button
            onClick={() => router.push("/login/customer")}
            className="w-full h-16 text-left justify-start"
            variant="outline"
          >
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="font-semibold">Customer Portal</div>
                <div className="text-xs text-muted-foreground">
                  Simple and secure customer access
                </div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </div>
          </Button>
        </div>
        
        <div className="text-center text-xs text-muted-foreground mt-6">
          Auto-redirecting to Customer Portal in 5 seconds...
        </div>
      </CardContent>
    </Card>
  );
}
