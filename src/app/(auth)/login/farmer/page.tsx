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
import { Loader2, Eye, EyeOff, Tractor } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { redirectToDashboard } from "@/lib/auth-redirect";
import { useLanguage } from "@/context/language-context";
import { InstantNavigation } from "@/components/instant-navigation";
import { useFastNavigation } from "@/hooks/use-fast-navigation";

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

export default function FarmerAuthPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { navigateInstantly, prefetchRoute } = useFastNavigation();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Safe language context usage with fallback
  let t;
  try {
    const languageContext = useLanguage();
    t = languageContext.t;
  } catch (error) {
    console.warn("Language context not available, using fallback");
    t = {
      auth: {
        login: "Login",
        register: "Register",
        emailLabel: "Email",
        passwordLabel: "Password",
        forgotPassword: "Forgot Password?",
        usernameLabel: "Username",
        phoneLabel: "Phone Number",
        confirmPasswordLabel: "Confirm Password",
        createAccount: "Create Account",
      },
    };
  }

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
          variant: "warning" as any,
          title: "Email required",
          description:
            "Please enter your email address to reset your password.",
          duration: 5000,
        });
        setLoading(false);
        return;
      }

      // Send password reset email using API
      const response = await fetch("/api/send-reset-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userType: "farmer" }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          variant: "success" as any,
          title: "Password Reset Email Sent",
          description:
            "Please check your inbox for instructions to reset your password.",
          duration: 5000,
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.message || "Failed to send password reset email.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      // Demo mode: Accept any email/password combination
      if (values.email && values.password) {
        // Store user type for persistence
        localStorage.setItem("userType", "farmer");
        localStorage.setItem("userEmail", values.email);

        toast({
          title: "Login successful",
          description: "Welcome back, farmer...",
          duration: 1000,
        });

        // Instant navigation to dashboard
        setTimeout(() => {
          navigateInstantly("/dashboard/farmer");
        }, 1000);
        return;
      }

      throw new Error("Please enter email and password");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please enter valid email and password.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      const { confirmPassword, ...apiData } = values;

      const farmerData = {
        ...apiData,
        userType: "farmer",
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(farmerData),
      });

      let result;
      try {
        result = await response.json();
      } catch (jsonErr) {
        throw new Error("Server error: Invalid response format.");
      }

      if (!response.ok) {
        if (result.message && result.message.includes("already in use")) {
          toast({
            variant: "destructive",
            title: "Email Already Registered",
            description:
              "This email is already registered. Please try logging in instead.",
            duration: 5000,
          });
          setActiveTab("login");
          loginForm.setValue("email", values.email);
          return;
        }
        throw new Error(result.message || "Failed to register.");
      }

      toast({
        title: "Registration Successful",
        description: "Your farmer account has been created. Please log in.",
        duration: 5000,
      });
      setActiveTab("login");
      loginForm.setValue("email", values.email);
      loginForm.setValue("password", "");
      registerForm.reset();
    } catch (error: any) {
      if (error.message && error.message.includes("already in use")) {
        toast({
          variant: "destructive",
          title: "Email Already Registered",
          description:
            "This email is already registered. Please try logging in instead.",
          duration: 5000,
        });
        setActiveTab("login");
        loginForm.setValue("email", values.email);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.message || "Unknown error",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Preload critical routes for instant navigation */}
      <InstantNavigation
        routes={[
          "/dashboard/farmer",
          "/dashboard/farmer/products",
          "/dashboard/farmer/matchmaking",
          "/dashboard/farmer/orders",
          "/dashboard/profile",
        ]}
        priority="high"
        preloadResources={true}
      />
      <div className="min-h-screen flex flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950 opacity-40 -z-10"></div>

          <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 relative z-10">
            <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6 relative">
              {/* Icon */}
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full border-2 border-emerald-200 dark:border-emerald-700">
                <Tractor className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>

              <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                Farmer Portal
              </CardTitle>
              <CardDescription className="text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                Farm management access
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-20">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 p-1 rounded-lg">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-200 data-[state=active]:to-green-200 dark:data-[state=active]:from-emerald-700 dark:data-[state=active]:to-green-700"
                  >
                    {t.auth.login}
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-200 data-[state=active]:to-green-200 dark:data-[state=active]:from-emerald-700 dark:data-[state=active]:to-green-700"
                  >
                    {t.auth.register}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="pt-4">
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
                            <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                              {t.auth.emailLabel}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="farmer@gmail.com"
                                className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500"
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
                              <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                                {t.auth.passwordLabel}
                              </FormLabel>
                              <Button
                                variant="link"
                                size="sm"
                                type="button"
                                className="p-0 h-auto text-xs text-emerald-600 dark:text-emerald-400"
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
                                  className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500"
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
                                    <EyeOff className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-red-600 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                        disabled={loading}
                      >
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t.auth.login}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register" className="pt-4">
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
                            <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                              {t.auth.usernameLabel}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="John Doe"
                                className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500"
                                {...field}
                              />
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
                            <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                              {t.auth.emailLabel}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="farmer@gmail.com"
                                className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500"
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
                            <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                              {t.auth.phoneLabel}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="1234567890"
                                maxLength={10}
                                className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500"
                                {...field}
                                onInput={(e) => {
                                  e.currentTarget.value =
                                    e.currentTarget.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    );
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
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
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
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                        disabled={loading}
                      >
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t.auth.createAccount}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
