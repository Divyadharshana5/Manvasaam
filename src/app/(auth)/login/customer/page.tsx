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
import { Loader2, Eye, EyeOff, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/context/language-context";
import { initEmailJS, sendPasswordResetEmail } from "@/lib/emailjs";

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

  // Initialize EmailJS on component mount
  useEffect(() => {
    initEmailJS();
  }, []);

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
          description: "Please enter your email address to reset your password.",
        });
        setLoading(false);
        return;
      }

      // Send password reset email using EmailJS
      const result = await sendPasswordResetEmail(email, "Customer", "customer");

      if (result.success) {
        toast({
          title: "Password Reset Email Sent",
          description: "Please check your inbox for instructions to reset your password.",
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
    console.log("Customer register function called with values:", values);
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
    <div className="relative animate-in fade-in duration-1000 min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950 opacity-40 -z-10"></div>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 -z-5">
        <div className="absolute top-32 left-16 w-28 h-28 bg-emerald-200/30 dark:bg-emerald-800/30 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-16 right-24 w-36 h-36 bg-green-200/25 dark:bg-green-800/25 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-40 left-12 w-32 h-32 bg-lime-200/30 dark:bg-lime-800/30 rounded-full blur-xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-16 right-16 w-24 h-24 bg-emerald-300/25 dark:bg-emerald-700/25 rounded-full blur-xl animate-pulse delay-300"></div>
      </div>

      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 animate-in slide-in-from-bottom-4 duration-1000 delay-300 relative z-10 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-white dark:hover:bg-gray-900 group">


        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6 relative">
          {/* Animated icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full border-2 border-emerald-200 dark:border-emerald-700 animate-in zoom-in duration-800 delay-500 hover:scale-110 transition-all duration-300 group-hover:shadow-lg hover:rotate-12">
            <ShoppingCart className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-in slide-in-from-bottom-2 duration-600 delay-700" />
          </div>
          
          <CardTitle className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300 animate-in slide-in-from-top-2 duration-800 delay-600 hover:text-emerald-600 dark:hover:text-emerald-200 transition-colors duration-300">
            Customer Portal
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-800 delay-800 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-300">
            Access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-20">
          <Tabs value={activeTab} onValueChange={(value) => {
            console.log("Customer tab changed to:", value);
            setActiveTab(value);
          }} className="w-full animate-in fade-in duration-500 delay-500 relative z-30">
            <TabsList className="grid w-full grid-cols-2 bg-emerald-100 dark:bg-emerald-900 p-1 rounded-md relative z-40 pointer-events-auto animate-in slide-in-from-bottom-2 duration-500 delay-1000">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-emerald-200 dark:data-[state=active]:bg-emerald-700 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-emerald-150 dark:hover:bg-emerald-800 transform-gpu"
              >
                {t.auth.login}
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="data-[state=active]:bg-emerald-200 dark:data-[state=active]:bg-emerald-700 transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-emerald-150 dark:hover:bg-emerald-800 transform-gpu"
              >
                {t.auth.register}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-4 animate-in slide-in-from-right-4 duration-500 delay-100">
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
                            className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400 transition-all duration-200 focus:scale-[1.02]"
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
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-[1.05] hover:shadow-lg active:scale-[0.98] transform-gpu animate-in slide-in-from-bottom-2 duration-500 delay-500" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.auth.login}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register" className="pt-4 animate-in slide-in-from-left-4 duration-500 delay-100">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegister, (errors) => {
                    console.log("Customer form validation errors:", errors);
                  })}
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
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">{t.auth.passwordLabel}</FormLabel>
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
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">{t.auth.confirmPasswordLabel}</FormLabel>
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
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-emerald-100 dark:hover:bg-emerald-900"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
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
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-300 hover:scale-[1.05] hover:shadow-lg active:scale-[0.98] transform-gpu animate-in slide-in-from-bottom-2 duration-500 delay-600" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.auth.createAccount}
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
