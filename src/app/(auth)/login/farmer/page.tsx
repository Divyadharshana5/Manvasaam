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
import { Loader2, Eye, EyeOff, Tractor, Fingerprint, CheckCircle, AlertCircle, Mic } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { redirectToDashboard } from "@/lib/auth-redirect";

import { useLanguage } from "@/context/language-context";
// import { initEmailJS, sendPasswordResetEmail } from "@/lib/emailjs";
import "@/styles/navigation-transitions.css";
import "@/styles/auth-animations.css";
import { motion } from "framer-motion";
import { registerPasskey, authenticatePasskey, getInitialPasskeyStatus, type PasskeyStatus } from "@/lib/passkey";
import { FingerprintStatus } from "@/components/ui/fingerprint-status";
import { Languages } from "lucide-react";

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
    passkeyCredentialId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });



export default function FarmerAuthPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { navigateFast } = useOptimizedNavigation();
  const [activeTab, setActiveTab] = useState("login");

  const { t, selectedLanguage } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passkeyStatus, setPasskeyStatus] = useState<PasskeyStatus>({
    supported: false,
    registered: false,
    feedback: "Loading...",
    status: "ready"
  });
  const [usePasskey, setUsePasskey] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  // Initialize passkey status on client side only
  useEffect(() => {
    setPasskeyStatus(getInitialPasskeyStatus());
  }, []);

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
      passkeyCredentialId: undefined,
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
      const response = await fetch('/api/send-reset-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userType: 'farmer' })
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



  async function handleFingerprintLogin() {
    if (!passkeyStatus.supported) {
      toast({
        variant: "warning" as any,
        title: "Not Supported",
        description: "Fingerprint authentication is not supported on this device.",
        duration: 3000,
      });
      return;
    }

    const email = loginForm.getValues("email");
    if (!email) {
      toast({
        variant: "warning" as any,
        title: "Email Required",
        description: "Please enter your email address first.",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    setPasskeyStatus(prev => ({ ...prev, status: "authenticating", feedback: "Authenticating with fingerprint..." }));
    
    try {
      // In demo mode, simulate fingerprint authentication
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate authentication delay
      
      toast({
        title: "Fingerprint Login Successful",
        description: "Welcome back, farmer!",
        duration: 1000,
      });
      
      setTimeout(() => {
        redirectToDashboard('farmer', router);
      }, 1000);
    } catch (error: any) {
      setPasskeyStatus(prev => ({ ...prev, status: "error", feedback: "Fingerprint authentication failed" }));
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Please try again or use password login.",
        duration: 3000,
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
        localStorage.setItem('userType', 'farmer');
        localStorage.setItem('userEmail', values.email);
        
        toast({
          title: "Login successful",
          description: "Welcome back, farmer...",
          duration: 1000,
        });
        
        // Automatic redirection after toast
        setTimeout(() => {
          redirectToDashboard('farmer', router);
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

  async function handlePasskeyRegistration() {
    if (!passkeyStatus.supported) {
      toast({
        variant: "warning" as any,
        title: "Not Supported",
        description: "Fingerprint authentication is not supported on this device.",
        duration: 3000,
      });
      return;
    }

    setPasskeyStatus(prev => ({ ...prev, status: "registering", feedback: "Setting up fingerprint authentication..." }));
    
    const email = registerForm.getValues("email");
    if (!email) {
      toast({
        variant: "warning" as any,
        title: "Email Required",
        description: "Please enter your email first.",
        duration: 3000,
      });
      setPasskeyStatus(prev => ({ ...prev, status: "ready" }));
      return;
    }

    const result = await registerPasskey(email);
    
    if (result.success && result.credentialId) {
      setPasskeyStatus({
        supported: true,
        registered: true,
        credentialId: result.credentialId,
        feedback: "Fingerprint authentication set up successfully!",
        status: "success"
      });
      registerForm.setValue("passkeyCredentialId", result.credentialId);
      setUsePasskey(true);
      toast({
        title: "Fingerprint Set Up",
        description: "You can now use fingerprint authentication for secure login.",
        duration: 2000,
      });
      
      // Auto switch to login tab after fingerprint setup
      setTimeout(() => {
        setActiveTab("login");
        loginForm.setValue("email", registerForm.getValues("email"));
      }, 2000);
    } else {
      setPasskeyStatus({
        supported: true,
        registered: false,
        feedback: result.error || "Failed to set up fingerprint authentication",
        status: "error"
      });
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: result.error || "Could not set up fingerprint authentication.",
        duration: 3000,
      });
    }
  }

  async function onRegister(values: z.infer<typeof registerSchema>) {
    console.log("Farmer register function called with values:", values);
    setLoading(true);
    try {
      const { confirmPassword, ...apiData } = values;
      
      // If passkey is not set up, create a mock credential ID for demo mode
      let passkeyCredentialId = apiData.passkeyCredentialId;
      if (!passkeyCredentialId && usePasskey) {
        passkeyCredentialId = `mock-passkey-${Date.now()}`;
      }
      
      const farmerData = {
        ...apiData,
        userType: "farmer",
        passkeyCredentialId: passkeyCredentialId || `demo-passkey-${Date.now()}`, // Always provide a passkey ID for demo
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
        // Handle specific error cases
        if (result.message && result.message.includes("already in use")) {
          toast({
            variant: "destructive",
            title: "Email Already Registered",
            description: "This email is already registered. Please try logging in instead.",
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
        description: usePasskey 
          ? "Your farmer account has been created with fingerprint authentication. Please log in."
          : "Your farmer account has been created. Please log in.",
        duration: 5000,
      });
      setActiveTab("login");
      loginForm.setValue("email", values.email);
      loginForm.setValue("password", "");
      registerForm.reset();
    } catch (error: any) {
      // Handle other registration errors
      if (error.message && error.message.includes("already in use")) {
        toast({
          variant: "destructive",
          title: "Email Already Registered",
          description: "This email is already registered. Please try logging in instead.",
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

  function handleVoiceCommand(command: string) {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes("what is manvaasam")) {
      toast({
        title: "About Manvaasam",
        description: "Manvaasam is a platform empowering farmers and delivering freshness through direct farm-to-table connections.",
        duration: 5000,
      });
    } else if (lowerCommand.includes("take me to") && lowerCommand.includes("dashboard")) {
      setShowVoiceAssistant(false);
      toast({
        title: "Navigating to Dashboard",
        description: "Please complete login first to access your farmer dashboard.",
        duration: 3000,
      });
    } else if (lowerCommand.includes("login") || lowerCommand.includes("sign in")) {
      setShowVoiceAssistant(false);
      setActiveTab("login");
      toast({
        title: "Switched to Login",
        description: "Please enter your credentials to sign in.",
        duration: 2000,
      });
    } else if (lowerCommand.includes("register") || lowerCommand.includes("sign up")) {
      setShowVoiceAssistant(false);
      setActiveTab("register");
      toast({
        title: "Switched to Register",
        description: "Please fill out the form to create your farmer account.",
        duration: 2000,
      });
    } else if (lowerCommand.includes("help")) {
      toast({
        title: "Voice Commands Available",
        description: "Try: 'What is Manvaasam?', 'Take me to dashboard', 'Login', 'Register', or 'Help'",
        duration: 5000,
      });
    } else {
      toast({
        title: "Command Received",
        description: `You said: "${command}". Try asking about Manvaasam or navigation commands.`,
        duration: 3000,
      });
    }
  }

  return (
    <div className="animate-in fade-in duration-1000 relative min-h-screen flex flex-col overflow-hidden">
      {/* Language Display Badge */}
      <div className="absolute top-4 right-4 z-50">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 rounded-full shadow-lg">
          <Languages className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {selectedLanguage}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
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

        {/* Enhanced farm-specific animated elements */}
        <div
          className="absolute top-40 left-1/4 w-6 h-6 bg-yellow-400/60 rounded-full farmer-soil-ripple stagger-1"
        ></div>
        <div
          className="absolute top-60 right-1/3 w-4 h-4 bg-brown-600/50 rounded-full farmer-soil-ripple stagger-3"
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-7 h-7 bg-green-500/40 rounded-full farmer-soil-ripple stagger-5"
        ></div>
        <div
          className="absolute top-1/2 left-8 w-3 h-3 bg-amber-400/70 rounded-full farmer-growth-animate stagger-2"
        ></div>
        <div
          className="absolute top-1/4 right-16 w-5 h-5 bg-lime-400/60 rounded-full farmer-field-wave stagger-4"
        ></div>
        <div
          className="absolute bottom-1/4 right-8 w-4 h-4 bg-emerald-400/80 rounded-full particle-drift stagger-6"
        ></div>
      </div>

        {/* Hero Section */}
        <div className="absolute inset-0 flex items-center justify-center -z-5">
          <div className="text-center max-w-2xl mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-emerald-700 dark:text-emerald-300 mb-4"
            >
              Empowering Farmers, Delivering Freshness
            </motion.h2>
          </div>
        </div>

        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 card-entrance relative z-10 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-white dark:hover:bg-gray-900 group enhanced-hover smooth-transition gpu-accelerated">
        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6 relative">
          {/* Animated icon */}
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full border-2 border-emerald-200 dark:border-emerald-700 icon-bounce-in hover:scale-110 transition-all duration-300 group-hover:shadow-lg hover:rotate-6 auth-animation-container stagger-1">
            <motion.div
              className="farmer-tractor-animate"
              whileHover={{
                scale: 1.15,
                rotate: 10,
                transition: { type: "spring", stiffness: 300, damping: 10 },
              }}
              whileTap={{
                scale: 0.9,
                rotate: -10,
                transition: { type: "spring", stiffness: 400, damping: 15 },
              }}
            >
              <Tractor className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
          </div>

          <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300 animate-in slide-in-from-top-2 duration-800 delay-600 hover:text-emerald-600 dark:hover:text-emerald-200 transition-colors duration-300 text-reveal stagger-2">
            Farmer Portal
          </CardTitle>
          <CardDescription className="text-base sm:text-lg text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-800 delay-800 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-300 text-reveal stagger-3">
            Farm management access
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-20">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              console.log("Farmer tab changed to:", value);
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
                                placeholder="farmer@gmail.com"
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
                      
                      {/* Fingerprint Login Option */}
                      {passkeyStatus.supported && (
                        <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-700">
                          <div className="text-center mb-3">
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">
                              Or use fingerprint authentication
                            </span>
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-950 p-2 rounded mb-3">
                            <p className="text-xs text-emerald-700 dark:text-emerald-300 text-center">
                              👆 Touch your fingerprint sensor for quick & secure login
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900"
                            onClick={handleFingerprintLogin}
                            disabled={loading || !loginForm.getValues("email")}
                          >
                            {loading && passkeyStatus.status === "authenticating" ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Authenticating...
                              </>
                            ) : (
                              <>
                                <Fingerprint className="mr-2 h-4 w-4" />
                                Login with Fingerprint
                              </>
                            )}
                          </Button>
                        </div>
                      )}
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
                    console.log("Farmer form validation errors:", errors);
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
                            placeholder="farmer@gmail.com"
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
                  
                  {/* Optional Fingerprint Authentication Section */}
                  <div className="border-t border-emerald-200 dark:border-emerald-700 pt-4 mt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Fingerprint className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          Fingerprint Authentication (Optional)
                        </span>
                      </div>
                      {passkeyStatus.registered ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : passkeyStatus.supported ? (
                        <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      ) : null}
                    </div>
                    
                    <FingerprintStatus
                      status={passkeyStatus.status}
                      supported={passkeyStatus.supported}
                      registered={passkeyStatus.registered}
                      feedback={passkeyStatus.feedback}
                      className="mb-2"
                    />
                    
                    <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg mb-3">
                      <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                        👆 <strong>Easy & Secure:</strong> Use your fingerprint to login quickly without remembering passwords. 
                        This is completely optional - you can still use your password anytime.
                      </p>
                    </div>
                    
                    {passkeyStatus.supported && !passkeyStatus.registered && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900"
                        onClick={handlePasskeyRegistration}
                        disabled={passkeyStatus.status === "registering"}
                      >
                        {passkeyStatus.status === "registering" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Setting up...
                          </>
                        ) : (
                          <>
                            <Fingerprint className="mr-2 h-4 w-4" />
                            Set up Fingerprint
                          </>
                        )}
                      </Button>
                    )}
                    
                    {!passkeyStatus.supported && (
                      <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-xs">Not available on this device</span>
                      </div>
                    )}
                  </div>

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
        title="Enhanced Voice Assistant"
        description="Ask me anything! I can help you navigate, answer questions about Manvaasam, or provide information about our platform. Try saying 'What is Manvaasam?' or 'Take me to the dashboard'."
        onVoiceCommand={handleVoiceCommand}
      />
      </div>
    </div>
  );
}
