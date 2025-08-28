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
import { Loader2, Eye, EyeOff, Building2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/context/language-context";
import { initEmailJS, sendPasswordResetEmail } from "@/lib/emailjs";
import "@/styles/navigation-transitions.css";

const loginSchema = z.object({
  branchName: z.string().min(1, { message: "Branch name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const registerSchema = z
  .object({
    branchName: z
      .string()
      .min(2, { message: "Branch name must be at least 2 characters." }),
    email: z
      .string()
      .email({ message: "A valid email is required for the hub account." })
      .refine((email) => email.endsWith("@gmail.com"), {
        message: "Email must be a @gmail.com address.",
      }),
    location: z.string().min(3, { message: "Location is required." }),
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

function HubAuthComponent() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { navigateFast } = useOptimizedNavigation();
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
      // First, try to authenticate with Firebase
      let idToken: string;
      let authMethod = "firebase";

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        idToken = await userCredential.user.getIdToken();
        console.log("✅ Firebase authentication successful");
      } catch (firebaseError: any) {
        // If Firebase auth fails, try mock authentication
        console.log("Firebase auth failed, using mock mode:", firebaseError.message);
        idToken = `mock-token-${Date.now()}-${values.email.replace('@', '-at-')}`;
        authMethod = "mock";
      }

      console.log(`🔐 Attempting login with ${authMethod} method...`);

      // Create session cookie with better error handling
      let response;
      try {
        response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });
        console.log(`📡 Response received - Status: ${response.status}, OK: ${response.ok}`);
      } catch (fetchError) {
        console.error("❌ Network error:", fetchError);
        throw new Error("Network error: Unable to connect to server. Please check your connection.");
      }

      let responseData;
      try {
        const responseText = await response.text();
        console.log("📝 Raw response text:", responseText);

        if (!responseText || responseText.trim() === '') {
          throw new Error("Server returned empty response");
        }

        try {
          responseData = JSON.parse(responseText);
          console.log("📦 Parsed response:", responseData);
        } catch (jsonError) {
          console.error("❌ JSON parse error:", jsonError);
          throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`);
        }

      } catch (textError) {
        console.error("❌ Response text error:", textError);
        throw new Error("Failed to read server response");
      }

      // Check if the response indicates success
      if (!response.ok) {
        const errorMessage = responseData?.message || `Server error (${response.status})`;
        console.error("❌ Server error:", errorMessage);
        throw new Error(errorMessage);
      }

      // Validate response structure
      if (!responseData || typeof responseData !== 'object') {
        console.error("❌ Invalid response structure:", responseData);
        throw new Error("Invalid response format from server");
      }

      if (!responseData.success && responseData.success !== undefined) {
        const errorMessage = responseData.message || "Login failed";
        console.error("❌ Login failed:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("✅ Login successful:", responseData);

      // Store user type and branch info for proper routing
      localStorage.setItem('userType', 'hub');
      localStorage.setItem('branchName', values.branchName);
      localStorage.setItem('authMethod', authMethod);

      toast({
        title: "Login successful",
        description: `Welcome to ${values.branchName}! ${responseData.mockMode ? '(Mock Mode)' : ''} Redirecting to dashboard...`,
        duration: 2000,
      });

      // Small delay to show the success message
      setTimeout(() => {
        router.push("/dashboard/hub");
      }, 1000);

    } catch (error: any) {
      console.error("Login error:", error);

      // Provide more specific error messages
      let errorMessage = "Login failed. Please try again.";

      if (error.message.includes("auth/user-not-found")) {
        errorMessage = "No account found with this email. Please register first.";
      } else if (error.message.includes("auth/wrong-password")) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.message.includes("auth/invalid-email")) {
        errorMessage = "Invalid email format. Please check your email.";
      } else if (error.message.includes("auth/too-many-requests")) {
        errorMessage = "Too many failed attempts. Please try again later.";
      } else if (error.message.includes("Failed to create session")) {
        errorMessage = "Session creation failed. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  async function onRegister(values: z.infer<typeof registerSchema>) {
    console.log("Hub register function called with values:", values);
    setLoading(true);
    try {
      const { confirmPassword, ...rest } = values;
      const apiData = {
        userType: "hub",
        ...rest,
      };

      const response = await fetch("/api/enhanced-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to register hub.");
      }

      // Show success message with branch ID
      toast({
        title: "Hub Registration Successful!",
        description: `Your branch ID is ${result.branchId}. Please save this ID for future reference.`,
        duration: 4000,
      });

      // Store the branch ID for future use
      if (result.branchId) {
        localStorage.setItem('branchId', result.branchId);
      }

      // Auto-login after successful registration
      try {
        let idToken: string;

        if (result.mockMode) {
          // In mock mode, create a mock token
          idToken = `mock-token-${Date.now()}-${values.email}`;
        } else {
          // Try to authenticate with Firebase using the registered credentials
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              values.email,
              values.password
            );
            idToken = await userCredential.user.getIdToken();
          } catch (authError) {
            // If Firebase auth fails, use mock token
            idToken = `mock-token-${Date.now()}-${values.email}`;
          }
        }

        // Create session
        const loginResponse = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        if (loginResponse.ok) {
          // Store user info
          localStorage.setItem('userType', 'hub');
          localStorage.setItem('branchName', values.branchName);

          toast({
            title: "Auto-login Successful",
            description: "Welcome to your Hub Dashboard!",
            duration: 2000,
          });

          // Redirect to dashboard
          setTimeout(() => {
            router.push("/dashboard/hub");
          }, 1500);
          return;
        }
      } catch (loginError) {
        console.error("Auto-login failed:", loginError);
      }

      // If auto-login fails, switch to login tab with pre-filled data
      toast({
        title: "Registration Complete",
        description: "Please log in with your new credentials.",
        duration: 3000,
      });

      registerForm.reset();
      loginForm.setValue("branchName", values.branchName);
      loginForm.setValue("email", values.email);
      loginForm.setValue("password", "");
      setActiveTab("login");

    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Failed to register hub. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function onForgotPassword() {
    setLoading(true);
    try {
      const email = loginForm.getValues("email");
      const branchName = loginForm.getValues("branchName");
      
      if (!email) {
        toast({
          variant: "destructive",
          title: "Email required",
          description: "Please enter your email to reset your password.",
        });
        setLoading(false);
        return;
      }

      // Send password reset email using EmailJS
      const result = await sendPasswordResetEmail(email, branchName || "Hub Admin", "hub");

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

  return (
    <div className="animate-in fade-in duration-1000 relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950 opacity-40 -z-10"></div>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 -z-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200/20 dark:bg-emerald-800/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-green-200/20 dark:bg-green-800/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-40 h-40 bg-lime-200/20 dark:bg-lime-800/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-emerald-300/20 dark:bg-emerald-700/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-emerald-200 dark:border-emerald-700 animate-in slide-in-from-left-4 duration-1000 delay-300 relative z-10 hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-white dark:hover:bg-gray-900 group">

        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6 relative">
          {/* Animated icon */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full border-2 border-emerald-200 dark:border-emerald-700 animate-in zoom-in duration-800 delay-500 hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
            <Building2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400 animate-in slide-in-from-bottom-2 duration-600 delay-700" />
          </div>
          
          <CardTitle className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300 animate-in slide-in-from-top-2 duration-800 delay-600 hover:text-emerald-600 dark:hover:text-emerald-200 transition-colors duration-300">
            Hub Portal
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-800 delay-800 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-300">
            Distribution center access
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-20">
          <Tabs value={activeTab} onValueChange={(value) => {
            console.log("Hub tab changed to:", value);
            setActiveTab(value);
          }} className="w-full animate-in fade-in duration-700 delay-800 relative z-30">
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
            <TabsContent value="login" className="pt-4 animate-in slide-in-from-right-4 duration-500 delay-100">
              <Form {...loginForm}>
                <form
                  onSubmit={loginForm.handleSubmit(onLogin)}
                  className="space-y-4"
                  suppressHydrationWarning
                >
                  <FormField
                    control={loginForm.control}
                    name="branchName"
                    render={({ field }) => (
                      <FormItem className="animate-in slide-in-from-left-2 duration-600 delay-300 group">
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-200 group-hover:scale-105 transform-gpu origin-left">{t.auth.branchNameLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder="Central Hub" className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-950/50 dark:to-green-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400 transition-all duration-400 focus:scale-[1.03] hover:border-emerald-300 dark:hover:border-emerald-600 transform-gpu hover:shadow-md focus:shadow-lg" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-600 dark:text-red-400 animate-in fade-in duration-300" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="animate-in slide-in-from-left-2 duration-600 delay-400 group">
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-200 group-hover:scale-105 transform-gpu origin-left">{t.auth.emailLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder="hub-admin@example.com" className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-950/50 dark:to-green-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400 transition-all duration-400 focus:scale-[1.03] hover:border-emerald-300 dark:hover:border-emerald-600 transform-gpu hover:shadow-md focus:shadow-lg" {...field} />
                        </FormControl>
                        <FormMessage className="text-red-600 dark:text-red-400 animate-in fade-in duration-300" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="animate-in slide-in-from-left-2 duration-600 delay-500 group">
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium transition-colors duration-300 hover:text-emerald-600 dark:hover:text-emerald-200 group-hover:scale-105 transform-gpu origin-left">{t.auth.passwordLabel}</FormLabel>
                          <Button
                            variant="link"
                            size="sm"
                            type="button"
                            className="p-0 h-auto text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 transition-all duration-300 hover:scale-110 transform-gpu animate-in fade-in delay-600"
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
                              className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-950/50 dark:to-green-950/50 transition-all duration-400 focus:scale-[1.03] hover:border-emerald-300 dark:hover:border-emerald-600 transform-gpu hover:shadow-md focus:shadow-lg"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all duration-300 hover:scale-125 transform-gpu hover:rotate-12"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-all duration-200" />
                              ) : (
                                <Eye className="h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-all duration-200" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-600 dark:text-red-400 animate-in fade-in duration-300" />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white transition-all duration-400 hover:scale-[1.05] hover:shadow-xl active:scale-[0.98] transform-gpu animate-in slide-in-from-bottom-2 duration-600 delay-600 hover:rotate-1" disabled={loading}>
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
                    console.log("Hub form validation errors:", errors);
                  })}
                  className="space-y-4"
                >
                  <FormField
                    control={registerForm.control}
                    name="branchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.auth.branchNameLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Central Hub"
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
                        <FormLabel>{t.auth.hubAdminEmailLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="hub-admin@example.com"
                            {...field}
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
                        <FormLabel>{t.auth.phoneLabel}</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="123-456-7890"
                            maxLength={10}
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
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 hover:scale-[1.02]" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.auth.registerHub}
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

export default function HubAuthPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initialize EmailJS when component mounts
    initEmailJS();
  }, []);

  return isClient ? <HubAuthComponent /> : null;
}
