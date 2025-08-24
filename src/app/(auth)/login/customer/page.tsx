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
import { Loader2, Eye, EyeOff, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/context/language-context";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters." }),
    email: z
      .string()
      .email({ message: "Invalid email address." })
      .refine((email) => email.endsWith("@gmail.com"), {
        message: "Email must be a @gmail.com address.",
      }),
    phone: z.string().regex(/^\d{10}$/, {
      message: "Phone number must be exactly 10 digits.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character.",
      })
      .refine((s) => !s.includes(" "), "Password cannot contain spaces."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function CustomerAuthPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onForgotPassword() {
    setLoading(true);
    try {
      const email = loginForm.getValues("email");
      if (!email) {
        toast({
          variant: "destructive",
          title: "Email required",
          description:
            "Please enter your email address to reset your password.",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send reset link.");
      }

      toast({
        title: "Password Reset Email Sent",
        description:
          "Please check your inbox for instructions to reset your password.",
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

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      const idToken = await userCredential.user.getIdToken();
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      // Store user type for proper routing
      localStorage.setItem('userType', 'customer');

      toast({
        title: "Login successful",
        description: "Welcome back to dashboard...",
        duration: 1000,
      });
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
      const { confirmPassword, ...apiData } = values;
      const customerData = {
        ...apiData,
        userType: "customer",
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        throw new Error("Server error: Invalid response format.");
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to register.");
      }

      toast({
        title: "Registration Successful",
        description: "Your customer account has been created. Please log in.",
      });
      setActiveTab("login");
      loginForm.setValue("email", values.email);
      loginForm.setValue("password", "");
      registerForm.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-700 relative">
      {/* Agricultural background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950 opacity-30 rounded-lg"></div>
      <Card className="w-full max-w-md mx-4 sm:mx-auto bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-lime-50/90 dark:from-emerald-950/90 dark:via-green-950/90 dark:to-lime-950/90 backdrop-blur-lg border-2 border-emerald-200/50 dark:border-emerald-700/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
        {/* Decorative agricultural elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-lime-200/20 to-transparent rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full"></div>

        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6 relative z-10">
          <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
            <div className="relative">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-lime-400 rounded-full animate-ping"></div>
            </div>
            <span className="animate-in slide-in-from-left-2 duration-500 delay-200 bg-gradient-to-r from-emerald-700 via-green-600 to-lime-600 dark:from-emerald-400 dark:via-green-400 dark:to-lime-400 bg-clip-text text-transparent font-bold">
              Fresh Market Portal
            </span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base animate-in fade-in duration-500 delay-300 text-emerald-700 dark:text-emerald-300">
            🌱 Access fresh produce from local farms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-in fade-in duration-500 delay-400 relative z-10">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-emerald-100 via-green-100 to-lime-100 dark:from-emerald-900 dark:via-green-900 dark:to-lime-900 border border-emerald-200 dark:border-emerald-700">
              <TabsTrigger value="login" className="transition-all duration-300 hover:scale-105 hover:bg-emerald-200 dark:hover:bg-emerald-800 data-[state=active]:bg-emerald-300 dark:data-[state=active]:bg-emerald-700 data-[state=active]:text-emerald-900 dark:data-[state=active]:text-emerald-100">
                🛒 {t.auth.login}
              </TabsTrigger>
              <TabsTrigger value="register" className="transition-all duration-300 hover:scale-105 hover:bg-lime-200 dark:hover:bg-lime-800 data-[state=active]:bg-lime-300 dark:data-[state=active]:bg-lime-700 data-[state=active]:text-lime-900 dark:data-[state=active]:text-lime-100">
                🌱 {t.auth.register}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-4 animate-in slide-in-from-right-4 duration-500">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLogin)}
                  className="space-y-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">{t.auth.emailLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="customer@example.com"
                            className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 dark:text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">{t.auth.passwordLabel}</FormLabel>
                          <Button
                            variant="link"
                            size="sm"
                            type="button"
                            className="p-0 h-auto text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200"
                            onClick={onForgotPassword}
                            disabled={loading}
                          >
                            {t.auth.forgotPassword}
                          </Button>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-lime-600 hover:from-emerald-700 hover:via-green-700 hover:to-lime-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    🛒 {t.auth.login}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register" className="pt-4 animate-in slide-in-from-left-4 duration-500">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegister)}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">{t.auth.usernameLabel}</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="John Doe" className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-600 dark:text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">{t.auth.emailLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="customer@gmail.com"
                            className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 dark:text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">{t.auth.phoneLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="1234567890"
                            maxLength={10}
                            className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400"
                            {...field}
                            onInput={(e) => {
                              e.currentTarget.value =
                                e.currentTarget.value.replace(/[^0-9]/g, "");
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 dark:text-red-400" />
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
                            <Input
                              type={showPassword ? "text" : "password"}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
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
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-lime-600 via-green-600 to-emerald-600 hover:from-lime-700 hover:via-green-700 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    🌱 {t.auth.createAccount}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
