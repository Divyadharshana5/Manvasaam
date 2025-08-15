
"use client";

import { useState, useEffect } from "react";
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
import { Loader2, View, ViewOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/context/language-context";

const loginSchema = z.object({
  branchName: z.string().min(1, { message: "Branch name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const registerSchema = z.object({
  branchName: z.string().min(2, { message: "Branch name must be at least 2 characters." }),
  email: z.string().email({ message: "A valid email is required for the hub account." }).refine(email => email.endsWith('@gmail.com'), { message: "Email must be a @gmail.com address." }),
  location: z.string().min(3, { message: "Location is required." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character." })
    .refine(s => !s.includes(' '), "Password cannot contain spaces."),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


function HubAuthComponent() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { branchName: "", email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      branchName: "",
      email: "",
      location: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: "Login Successful", description: "Welcome back, Hub Manager!" });
        router.push("/dashboard");
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid credentials or branch name.",
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

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to save hub details.');
        }

        toast({ title: "Hub Registration Successful", description: `Your branch ID is ${result.branchId}. Please log in.` });
        registerForm.reset();
        loginForm.setValue("branchName", values.branchName);
        loginForm.setValue("email", values.email);
        loginForm.setValue("password", "");
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
       const email = loginForm.getValues("email");
      if (!email) {
          toast({ variant: "destructive", title: "Email required", description: "Please enter your email to reset your password."});
          setLoading(false);
          return;
      }
      
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, userType: 'hub' }),
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
            <TabsContent value="login" className="pt-4">
                <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" suppressHydrationWarning>
                    <FormField
                    control={loginForm.control}
                    name="branchName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.auth.branchNameLabel}</FormLabel>
                        <FormControl>
                            <Input placeholder="Central Hub" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.auth.emailLabel}</FormLabel>
                        <FormControl>
                            <Input placeholder="hub-admin@example.com" {...field} />
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
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <ViewOff className="h-4 w-4" /> : <View className="h-4 w-4" />}
                                </Button>
                            </div>
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
            <TabsContent value="register" className="pt-4">
                <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
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
                            <Input type="tel" placeholder="123-456-7890" maxLength={10} {...field} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} />
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
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <ViewOff className="h-4 w-4" /> : <View className="h-4 w-4" />}
                                </Button>
                            </div>
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
                            <div className="relative">
                                <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <ViewOff className="h-4 w-4" /> : <View className="h-4 w-4" />}
                                </Button>
                            </div>
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


export default function HubAuthPage() {
    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
        setIsClient(true)
    }, [])
 
    return isClient ? <HubAuthComponent /> : null
}
