
"use client";

import { useState, useCallback } from "react";
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
import { signInWithCustomToken } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/language-context";

const loginSchema = z.object({
  restaurantId: z.string().min(1, { message: "Restaurant ID is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const registerSchema = z.object({
  restaurantName: z.string().min(2, { message: "Restaurant name must be at least 2 characters." }),
  email: z.string().email({ message: "A valid email is required." }),
  phone: z.string().min(10, { message: "A valid phone number is required." }),
  location: z.string().min(3, { message: "Location is required." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, { message: "Please enter your Restaurant ID or email." }),
});

export default function RestaurantAuthPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [isForgotPassDialogOpen, setIsForgotPassDialogOpen] = useState(false);
  const { t } = useLanguage();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { restaurantId: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      restaurantName: "",
      email: "",
      phone: "",
      location: "",
      password: "",
      confirmPassword: "",
    },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: "" },
  });

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      // The client cannot directly sign in with restaurantId.
      // The backend must find the user's email from the restaurantId,
      // and then the client can sign in with the email and password.
      // This is not ideal. A better flow is to have the backend do the lookup
      // and return a custom token.
      
      const response = await fetch('/api/restaurant-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed.');
      }

      const { token } = await response.json();
      await signInWithCustomToken(auth, token);

      toast({ title: "Login Successful", description: "Welcome back, Restaurant Manager!" });
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
        userType: "restaurant",
        ...rest,
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register restaurant.');
      }

      toast({
        title: "Restaurant Registration Successful",
        description: "Please check your email for your unique Restaurant ID.",
      });
      registerForm.reset();
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

  async function onForgotPassword(values: z.infer<typeof forgotPasswordSchema>) {
    setLoading(true);
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset link.');
      }

      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists, you will receive an email with reset instructions.",
      });
      setIsForgotPassDialogOpen(false);
      forgotPasswordForm.reset();
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
    <Card className="w-full max-w-md bg-card/60 backdrop-blur-lg border-2 border-white/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>{t.auth.restaurantPortal}</CardTitle>
        <CardDescription>
          {t.auth.restaurantDesc}
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
                  name="restaurantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.restaurantIdLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.auth.restaurantIdPlaceholder} {...field} />
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
                        <Dialog open={isForgotPassDialogOpen} onOpenChange={setIsForgotPassDialogOpen}>
                           <DialogTrigger asChild>
                            <Button variant="link" size="sm" type="button" className="p-0 h-auto text-xs">
                              {t.auth.forgotPassword}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t.auth.forgotPasswordTitle}</DialogTitle>
                              <DialogDescription>
                                {t.auth.forgotPasswordRestaurantDesc}
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...forgotPasswordForm}>
                              <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-4">
                                <FormField
                                  control={forgotPasswordForm.control}
                                  name="identifier"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t.auth.restaurantIdOrEmailLabel}</FormLabel>
                                      <FormControl>
                                        <Input placeholder={t.auth.restaurantIdOrEmailPlaceholder} {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button type="button" variant="secondary" disabled={loading}>
                                      {t.auth.cancel}
                                    </Button>
                                  </DialogClose>
                                  <Button type="submit" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {t.auth.sendResetLink}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
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
                  name="restaurantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.restaurantNameLabel}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="The Fresh Table" {...field} />
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
                      <FormLabel>{t.auth.restaurantEmailLabel}</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@thefreshtable.com" {...field} />
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
                      <FormLabel>{t.auth.restaurantPhoneLabel}</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="123-456-7890" {...field} />
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
                  {t.auth.registerRestaurant}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
