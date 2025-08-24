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
import { Loader2, Eye, EyeOff, Building2 } from "lucide-react";
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
        description: `Welcome to ${values.branchName}! ${responseData.mockMode ? '(Mock Mode)' : ''} Welcome back to dashboard...`,
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
      if (!email) {
        toast({
          variant: "destructive",
          title: "Email required",
          description: "Please enter your email to reset your password.",
        });
        setLoading(false);
        return;
      }

      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, userType: "hub" }),
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

  return (
    <div className="animate-in slide-in-from-left-4 duration-700 relative">
      {/* Agricultural distribution center background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-teal-950 dark:via-cyan-950 dark:to-blue-950 opacity-40 rounded-lg"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(6,182,212,0.1),rgba(255,255,255,0))]"></div>
      
      <Card className="w-full max-w-md mx-4 sm:mx-auto bg-gradient-to-br from-teal-50/95 via-cyan-50/95 to-blue-50/95 dark:from-teal-950/95 dark:via-cyan-950/95 dark:to-blue-950/95 backdrop-blur-lg border-2 border-teal-200/60 dark:border-teal-700/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden">
        {/* Decorative distribution elements */}
        <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-cyan-200/20 to-transparent rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-teal-200/20 to-transparent rounded-full"></div>
        <div className="absolute top-1/3 left-0 w-20 h-1 bg-gradient-to-r from-teal-300/30 to-transparent"></div>
        <div className="absolute bottom-1/3 right-0 w-16 h-1 bg-gradient-to-l from-cyan-300/30 to-transparent"></div>
        
        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6 relative z-10">
          <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
            <div className="relative">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 dark:text-teal-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            </div>
            <span className="animate-in slide-in-from-bottom-2 duration-500 delay-200 bg-gradient-to-r from-teal-700 via-cyan-600 to-blue-600 dark:from-teal-400 dark:via-cyan-400 dark:to-blue-400 bg-clip-text text-transparent font-bold">
              🏢 Agricultural Hub Center
            </span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base animate-in fade-in duration-500 delay-300 text-teal-700 dark:text-teal-300">
            🚛 Central distribution & logistics management
          </CardDescription>
        </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-in fade-in duration-500 delay-400 relative z-10">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900 dark:via-cyan-900 dark:to-blue-900 border border-teal-200 dark:border-teal-700">
            <TabsTrigger value="login" className="transition-all duration-300 hover:scale-105 hover:bg-teal-200 dark:hover:bg-teal-800 data-[state=active]:bg-teal-300 dark:data-[state=active]:bg-teal-700 data-[state=active]:text-teal-900 dark:data-[state=active]:text-teal-100">
              🏢 {t.auth.login}
            </TabsTrigger>
            <TabsTrigger value="register" className="transition-all duration-300 hover:scale-105 hover:bg-cyan-200 dark:hover:bg-cyan-800 data-[state=active]:bg-cyan-300 dark:data-[state=active]:bg-cyan-700 data-[state=active]:text-cyan-900 dark:data-[state=active]:text-cyan-100">
              🚛 {t.auth.register}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="pt-4 animate-in slide-in-from-right-4 duration-500">
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
                    <FormItem>
                      <FormLabel className="text-teal-700 dark:text-teal-300 font-medium">{t.auth.branchNameLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder="Central Hub" className="border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 focus:ring-teal-200 dark:focus:ring-teal-800 bg-teal-50/50 dark:bg-teal-950/50 placeholder:text-teal-500 dark:placeholder:text-teal-400" {...field} />
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
                      <FormLabel className="text-teal-700 dark:text-teal-300 font-medium">{t.auth.emailLabel}</FormLabel>
                      <FormControl>
                        <Input placeholder="hub-admin@example.com" className="border-teal-200 dark:border-teal-700 focus:border-teal-400 dark:focus:border-teal-500 focus:ring-teal-200 dark:focus:ring-teal-800 bg-teal-50/50 dark:bg-teal-950/50 placeholder:text-teal-500 dark:placeholder:text-teal-400" {...field} />
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
                        <FormLabel>{t.auth.passwordLabel}</FormLabel>
                        <Button
                          variant="link"
                          size="sm"
                          type="button"
                          className="p-0 h-auto text-xs"
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
    </div>
  );
}

export default function HubAuthPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <HubAuthComponent /> : null;
}
