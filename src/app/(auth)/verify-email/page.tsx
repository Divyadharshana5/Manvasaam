"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendEmailVerification } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(interval);
          router.push("/");
          toast({
            title: "Success!",
            description: "Your email has been verified. Welcome to AgriLink!",
          });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [user, router, toast]);

  const handleResend = async () => {
    if (!user) return;
    setResending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: "Verification Email Sent",
        description: "A new verification link has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend verification email. Please try again later."
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Check Your Email</CardTitle>
        <CardDescription>
          We've sent a verification link to{" "}
          <span className="font-semibold">{user?.email}</span>. Please click the
          link to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Waiting for verification... This page will automatically redirect once
          you're verified.
        </p>
        <Button onClick={handleResend} disabled={resending} className="w-full">
          {resending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Resend Verification Email
        </Button>
      </CardContent>
    </Card>
  );
}
