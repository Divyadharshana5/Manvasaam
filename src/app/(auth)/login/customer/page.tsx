"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FastButton } from "@/components/ui/fast-button";
import { useOptimizedNavigation } from "@/lib/navigation-optimizer";
import { VoiceAssistantModal } from "@/components/ui/voice-assistant-modal";
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
import { Loader2, Eye, EyeOff, ShoppingCart, Mic } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { redirectToDashboard } from "@/lib/auth-redirect";
import { useLanguage } from "@/context/language-context";
// import { initEmailJS, sendPasswordResetEmail } from "@/lib/emailjs";
import "@/styles/navigation-transitions.css";
import "@/styles/auth-animations.css";
import { motion } from "framer-motion";

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
  const { navigateFast } = useOptimizedNavigation();
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  // Initialize EmailJS on component mount
  useEffect(() => {
    // initEmailJS();
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
          description:
            "Please enter your email address to reset your password.",
          duration: 5000,
        });
        setLoading(false);
        return;
      }

      // Send password reset email using API
      const response = await fetch('/api/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType: 'customer' })
      });

      const result = await response.json();

      if (result.success) {
        toast({
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
        localStorage.setItem('userType', 'customer');
        localStorage.setItem('userEmail', values.email);

        toast({
          title: "Login successful",
          description: "Welcome back, customer...",
          duration: 1000,
        });

        // Automatic redirection after toast
        setTimeout(() => {
          redirectToDashboard('customer', router);
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
        duration: 5000,
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
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleVoiceCommand(command: string) {
    const lowerCommand = command.toLowerCase();

    // Enhanced voice commands for better user experience
    if (lowerCommand.includes("login") || lowerCommand.includes("sign in") || lowerCommand.includes("लॉगिन")) {
      setShowVoiceAssistant(false);
      setActiveTab("login");
      toast({
        title: "Login Tab Selected",
        description: "Please enter your credentials to sign in as a customer.",
        duration: 2000,
      });
    } else if (lowerCommand.includes("register") || lowerCommand.includes("sign up") || lowerCommand.includes("रजिस्टर")) {
      setShowVoiceAssistant(false);
      setActiveTab("register");
      toast({
        title: "Register Tab Selected",
        description: "Please fill out the form to create your customer account.",
        duration: 2000,
      });
    } else if (lowerCommand.includes("help") || lowerCommand.includes("मदद")) {
      toast({
        title: "Customer Portal Help",
        description: "You can say 'Login' to sign in or 'Register' to create a new account.",
        duration: 4000,
      });
    } else {
      toast({
        title: "Voice Command Received",
        description: `You said: "${command}". Try saying 'Login', 'Register', or 'Help'.`,
        duration: 3000,
      });
    }
  }

  return (
    <div className="animate-in fade-in duration-1000 relative min-h-screen flex flex-col overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full border-2 border-emerald-200 dark:border-emerald-700 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
              Manvaasam
            </h1>
          </div>

          {/* Voice and Language Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVoiceAssistant(true)}
              className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900"
            >
              <Mic className="h-4 w-4" />
              <span className="hidden sm:inline">Voice</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900"
            >
              <span className="text-sm">🌐</span>
              <span className="hidden sm:inline">English</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 pt-20">
        {/* Enhanced animated background with farm theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950 opacity-40 -z-10 gradient-shift"></div>





        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 card-entrance relative z-10 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-white dark:hover:bg-gray-900 group enhanced-hover smooth-transition gpu-accelerated">
          <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6 relative">
            {/* Animated icon */}
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full border-2 border-emerald-200 dark:border-emerald-700 animate-in zoom-in duration-800 delay-500 hover:scale-110 transition-all duration-300 group-hover:shadow-lg hover:rotate-6 auth-animation-container icon-bounce-in stagger-1">
              <motion.div
                className="customer-cart-bounce"
                whileHover={{
                  scale: 1.15,
                  rotate: 5,
                  transition: { type: "spring", stiffness: 300, damping: 10 },
                }}
                whileTap={{
                  scale: 0.95,
                  rotate: -5,
                  transition: { type: "spring", stiffness: 400, damping: 15 },
                }}
              >
                <ShoppingCart className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
            </div>

            <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300 animate-in slide-in-from-top-2 duration-800 delay-600 hover:text-emerald-600 dark:hover:text-emerald-200 transition-colors duration-300 text-reveal stagger-2">
              Customer Portal
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-800 delay-800 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-300 text-reveal stagger-3">
              Access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-20">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                console.log("Customer tab changed to:", value);
                setActiveTab(value);
              }}
              className="w-full animate-in fade-in duration-500 delay-500 relative z-30"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 p-1 rounded-lg relative z-40 pointer-events-auto animate-in slide-in-from-bottom-2 duration-600 delay-1000 shadow-inner">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-200 data-[state=active]:to-green-200 dark:data-[state=active]:from-emerald-700 dark:data-[state=active]:to-green-700 data-[state=active]:shadow-md transition-all duration-400 cursor-pointer hover:scale-105 hover:bg-emerald-150 dark:hover:bg-emerald-800 transform-gpu animate-in slide-in-from-left-2 duration-500 delay-1200"
                >
                  {t.auth.login}
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-200 data-[state=active]:to-green-200 dark:data-[state=active]:from-emerald-700 dark:data-[state=active]:to-green-700 data-[state=active]:shadow-md transition-all duration-400 cursor-pointer hover:scale-105 hover:bg-emerald-150 dark:hover:bg-emerald-800 transform-gpu animate-in slide-in-from-right-2 duration-500 delay-1200"
                >
                  {t.auth.register}
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="login"
                className="pt-4 animate-in slide-in-from-right-4 duration-500 delay-100"
              >
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
                              placeholder="customer@example.com"
                              className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400 smooth-transition input-focus-glow"
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white instant-feedback fast-transition"
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
              <TabsContent
                value="register"
                className="pt-4 animate-in slide-in-from-left-4 duration-500 delay-100"
              >
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
                          <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                            {t.auth.usernameLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="John Doe"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                            {t.auth.emailLabel}
                          </FormLabel>
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
                          <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                            {t.auth.phoneLabel}
                          </FormLabel>
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
                          <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                            {t.auth.passwordLabel}
                          </FormLabel>
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
                          <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">
                            {t.auth.confirmPasswordLabel}
                          </FormLabel>
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
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white transition-all duration-400 hover:scale-[1.05] hover:shadow-xl active:scale-[0.98] transform-gpu animate-in slide-in-from-bottom-2 duration-600 delay-700 hover:rotate-1"
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

        {/* Voice Assistant Modal */}
        <VoiceAssistantModal
          isOpen={showVoiceAssistant}
          onClose={() => setShowVoiceAssistant(false)}
          title="Voice Helper - आवाज़ सहायक"
          description="बोलकर बताएं कि आप क्या करना चाहते हैं। मैं आपकी मदद करूंगा। / Tell me what you want to do by speaking. I will help you."
          onVoiceCommand={handleVoiceCommand}
        />
      </div>
    </div>
  );
}
