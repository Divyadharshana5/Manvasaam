
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/context/language-context";

const loginSchema = z.object({
  branchId: z.string().min(1, { message: "Branch ID is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const registerSchema = z.object({
  branchName: z.string().min(2, { message: "Branch name must be at least 2 characters." }),
  location: z.string().min(3, { message: "Location is required." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "A valid email is required for the hub account." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


export default function HubAuthPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useLanguage();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { branchId: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      branchName: "",
      location: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
        const emailRes = await fetch('/api/get-email-by-id', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ branchId: values.branchId, userType: 'hub' }),
        });

        if (!emailRes.ok) {
            throw new Error("Invalid Branch ID or password.");
        }
        const { email } = await emailRes.json();
        
        await signInWithEmailAndPassword(auth, email, values.password);
        toast({ title: "Login Successful", description: "Welcome back, Hub Manager!" });
        router.push("/dashboard");
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message,
        });
    } finally {
        setLoading(false);
    }
  }

  async function onRegister(values: z.infer<typeof registerSchema>) {
    setLoading(true);
     try {
        const { confirmPassword, ...rest } = values;
        const apiData = {
          userType: "hub",
          ...rest,
        };

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(apiData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save hub details.');
        }

        const { branchId } = await response.json();

        toast({ title: "Hub Registration Successful", description: `Your new Branch ID is: ${branchId}. Please use it to log in.` });
        loginForm.reset({ branchId: branchId, password: ""});
        setActiveTab("login");
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: error.message,
        });
    } finally {
        setLoading(false);
    }
  }
  
  async function onForgotPassword() {
    setLoading(true);
    try {
       const branchId = loginForm.getValues("branchId");
      if (!branchId) {
          toast({ variant: "destructive", title: "Branch ID required", description: "Please enter your Branch ID to reset your password."});
          setLoading(false);
          return;
      }
      
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: branchId, userType: 'hub' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset link.');
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox for instructions to reset your password.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>{t.auth.hubPortal}</CardTitle>
        <CardDescription>
          {t.auth.hubDesc}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t.auth.login}</TabsTrigger>
            <TabsTrigger value="register">{t.auth.register}</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4 pt-4">
                <FormField
                  control={loginForm.control}
                  name="branchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.branchIdLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder="HUB-XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>{t.auth.passwordLabel}</FormLabel>
                        <Button variant="link" size="sm" type="button" className="p-0 h-auto text-xs" onClick={onForgotPassword} disabled={loading}>
                          {t.auth.forgotPassword}
                        </Button>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.auth.login}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="register">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4 pt-4">
                 <FormField
                  control={registerForm.control}
                  name="branchName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.branchNameLabel}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Central Hub" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={registerForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.locationLabel}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="City, State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={registerForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.phoneLabel}</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="123-456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.hubAdminEmailLabel}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="hub-admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.passwordLabel}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.confirmPasswordLabel}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.auth.registerHub}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

    
    
    