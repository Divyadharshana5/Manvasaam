"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FastButton } from "@/components/ui/fast-button";
import { useOptimizedNavigation } from "@/lib/navigation-optimizer";
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
import { Loader2, Eye, EyeOff, ChefHat } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/context/language-context";
import { initEmailJS, sendPasswordResetEmail } from "@/lib/emailjs";
import "@/styles/navigation-transitions.css";
import "@/styles/auth-animations.css";
import { motion } from "framer-motion";

const loginSchema = z.object({
  restaurantName: z
    .string()
    .min(1, { message: "Restaurant name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const registerSchema = z
  .object({
    restaurantName: z
      .string()
      .min(2, { message: "Restaurant name must be at least 2 characters." }),
    email: z
      .string()
      .email({ message: "A valid email is required." })
      .refine((email) => email.endsWith("@gmail.com"), {
        message: "Email must be a @gmail.com address.",
      }),
    phone: z.string().regex(/^\d{10}$/, {
      message: "Phone number must be exactly 10 digits.",
    }),
    location: z.string().min(3, { message: "Location is required." }),
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

export default function RestaurantAuthPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { navigateFast } = useOptimizedNavigation();
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize EmailJS on component mount
  useEffect(() => {
    initEmailJS();
  }, []);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { restaurantName: "", email: "", password: "" },
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

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      // Demo mode: Accept any email/password combination
      if (values.email && values.password) {
        toast({
          variant: "restaurant" as any,
          title: "Login successful, welcome back",
          duration: 1000,
        });
        router.push("/dashboard/restaurant");
        return;
      }
      
      throw new Error("Please enter email and password");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please enter valid email and password.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(values: z.infer<typeof registerSchema>) {
    console.log("Register function called with values:", values);
    setLoading(true);
    try {
      const { confirmPassword, ...rest } = values;
      const apiData = {
        userType: "restaurant",
        ...rest,
      };

      console.log("Sending registration data:", apiData);

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        throw new Error(errorData.message || "Failed to register restaurant.");
      }

      toast({
        title: "Restaurant Registration Successful",
        description: "Your registration is complete. Please log in.",
      });
      registerForm.reset();
      setActiveTab("login");
      loginForm.setValue("email", values.email);
    } catch (error: any) {
      console.error("Registration error:", error);
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
      const restaurantName = loginForm.getValues("restaurantName");

      if (!email) {
        toast({
          variant: "warning" as any,
          title: "Email required",
          description: "Please enter your email to reset your password.",
        });
        setLoading(false);
        return;
      }

      // Send password reset email using EmailJS
      const result = await sendPasswordResetEmail(
        email,
        restaurantName || "Restaurant Owner",
        "restaurant"
      );

      if (result.success) {
        toast({
          variant: "success" as any,
          title: "Password Reset Email Sent",
          description:
            "Please check your inbox for instructions to reset your password.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.message || "Failed to send password reset email.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-in fade-in duration-1000 relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Enhanced animated background with farm theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950 opacity-40 -z-10 gradient-shift"></div>

      {/* Floating background elements with farm theme */}
      <div className="absolute inset-0 -z-5">
        <div
          className="absolute top-28 left-14 w-32 h-32 bg-emerald-200/25 dark:bg-emerald-800/25 rounded-full blur-xl floating-bubble"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute top-20 right-18 w-28 h-28 bg-green-200/30 dark:bg-green-800/30 rounded-full blur-xl floating-bubble"
          style={{ animationDelay: "0.9s" }}
        ></div>
        <div
          className="absolute bottom-32 left-18 w-36 h-36 bg-lime-200/25 dark:bg-lime-800/25 rounded-full floating-bubble"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute bottom-24 right-14 w-30 h-30 bg-emerald-300/30 dark:bg-emerald-700/30 rounded-full floating-bubble"
          style={{ animationDelay: "0.6s" }}
        ></div>

        {/* Enhanced restaurant-specific animated elements */}
        <div
          className="absolute top-40 left-1/4 w-6 h-6 bg-orange-400/60 rounded-full restaurant-flame-flicker stagger-1"
        ></div>
        <div
          className="absolute top-60 right-1/3 w-4 h-4 bg-red-500/50 rounded-full restaurant-ingredient-drop stagger-3"
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-5 h-5 bg-yellow-500/40 rounded-full restaurant-steam-rise stagger-5"
        ></div>
        <div
          className="absolute top-1/2 left-8 w-3 h-3 bg-amber-400/70 rounded-full particle-drift stagger-2"
        ></div>
        <div
          className="absolute top-1/4 right-16 w-7 h-7 bg-orange-400/60 rounded-full restaurant-chef-hat-float stagger-4"
        ></div>
        <div
          className="absolute bottom-1/4 right-8 w-4 h-4 bg-red-400/80 rounded-full aurora-wave stagger-6"
        ></div>
      </div>

      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 card-entrance relative z-10 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-white dark:hover:bg-gray-900 group enhanced-hover smooth-transition gpu-accelerated">
        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6 relative">
          {/* Animated icon */}
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full border-2 border-emerald-200 dark:border-emerald-700 icon-bounce-in hover:scale-110 transition-all duration-300 group-hover:shadow-lg hover:rotate-6 auth-animation-container stagger-1">
            <motion.div
              className="restaurant-chef-hat-float"
              whileHover={{
                scale: 1.2,
                rotate: 12,
                transition: { type: "spring", stiffness: 300, damping: 10 },
              }}
              whileTap={{
                scale: 0.9,
                rotate: -12,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
            >
              <ChefHat className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
          </div>

          <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300 animate-in slide-in-from-top-2 duration-800 delay-600 hover:text-emerald-600 dark:hover:text-emerald-200 transition-colors duration-300 text-reveal stagger-2">
            Restaurant Portal
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-800 delay-800 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-300 text-reveal stagger-3">
            Restaurant management access
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-20">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              console.log("Tab changed to:", value);
              setActiveTab(value);
            }}
            className="w-full animate-in fade-in duration-500 delay-500 relative z-30"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 p-1 rounded-lg relative z-40 pointer-events-auto animate-in slide-in-from-bottom-2 duration-600 delay-1000 shadow-inner">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-200 data-[state=active]:to-green-200 dark:data-[state=active]:from-emerald-700 dark:data-[state=active]:to-green-700 data-[state=active]:shadow-md transition-all duration-400 cursor-pointer pointer-events-auto relative z-50 hover:scale-105 hover:bg-emerald-150 dark:hover:bg-emerald-800 transform-gpu animate-in slide-in-from-left-2 duration-500 delay-1200"
                onClick={() => console.log("Login tab clicked")}
              >
                {t.auth.login}
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-200 data-[state=active]:to-green-200 dark:data-[state=active]:from-emerald-700 dark:data-[state=active]:to-green-700 data-[state=active]:shadow-md transition-all duration-400 cursor-pointer pointer-events-auto relative z-50 hover:scale-105 hover:bg-emerald-150 dark:hover:bg-emerald-800 transform-gpu animate-in slide-in-from-right-2 duration-500 delay-1200"
                onClick={() => console.log("Register tab clicked")}
              >
                {t.auth.register}
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="login"
              className="animate-in slide-in-from-right-4 duration-500 delay-100 relative z-40 pointer-events-auto"
            >
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLogin)}
                  className="space-y-4 pt-4"
                >
                  <FormField
                    control={loginForm.control}
                    name="restaurantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                          {t.auth.restaurantNameLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="The Fresh Table"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                          {t.auth.emailLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="restaurant@gmail.com"
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
                          <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                            {t.auth.passwordLabel}
                          </FormLabel>
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
                        <FormMessage className="text-red-600 dark:text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FastButton
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white instant-feedback fast-transition"
                    disabled={loading}
                    showLoadingState={true}
                    preloadNext={[
                      "/dashboard/restaurant",
                      "/dashboard/restaurant/orders",
                    ]}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t.auth.login}
                  </FastButton>
                </form>
              </Form>
            </TabsContent>
            <TabsContent
              value="register"
              className="animate-in slide-in-from-left-4 duration-500 delay-100 relative z-40 pointer-events-auto"
            >
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegister, (errors) => {
                    console.log("Form validation errors:", errors);
                  })}
                  className="space-y-4 pt-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="restaurantName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.auth.restaurantNameLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="The Fresh Table"
                            className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400"
                            {...field}
                          />
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
                          <Input
                            type="email"
                            placeholder="restaurant@gmail.com"
                            className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400"
                            {...field}
                          />
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
                          <Input
                            type="tel"
                            placeholder="123-456-7890"
                            maxLength={10}
                            className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400"
                            {...field}
                            onInput={(e) => {
                              e.currentTarget.value =
                                e.currentTarget.value.replace(/[^0-9]/g, "");
                            }}
                          />
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
                          <Input
                            type="text"
                            placeholder="City, State"
                            className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400"
                            {...field}
                          />
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
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50"
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
                              className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50"
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
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white transition-all duration-400 hover:scale-[1.05] hover:shadow-xl active:scale-[0.98] transform-gpu animate-in slide-in-from-bottom-2 duration-600 delay-700 hover:rotate-1"
                    disabled={loading}
                    onClick={() => console.log("Register button clicked")}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t.auth.registerRestaurant}
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
