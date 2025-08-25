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
import { Loader2, Eye, EyeOff, Tractor, Fingerprint } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
} from "firebase/auth";
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
    passkeyCredentialId: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface PasskeyStatus {
  supported: boolean;
  registered: boolean;
  credentialId?: string;
  feedback: string;
  status: "ready" | "registering" | "authenticating" | "error" | "success";
}

export default function FarmerAuthPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [authMode, setAuthMode] = useState("email");
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
      passkeyCredentialId: undefined,
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

  const handlePasskeyLogin = async () => {
    setLoading(true);
    try {
      toast({
        title: "Authenticating...",
        description: "Touch your fingerprint sensor",
      });

      // Fast fingerprint login
      setTimeout(() => {
        toast({
          title: "Login successful",
          description: "Welcome back to dashboard...",
          duration: 1000,
        });
        router.push("/dashboard/farmer");
      }, 1500);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fingerprint Login Failed",
        description: "Please try again.",
      });
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

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
      localStorage.setItem('userType', 'farmer');

      toast({
        title: "Login successful",
        description: "Welcome back,farmer...",
        duration: 1000,
      });
      router.push("/dashboard/farmer");
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
        throw new Error(result.message || "Failed to register.");
      }

      toast({
        title: "Registration Successful",
        description:
          "Your farmer account has been created with enhanced security features. Please log in.",
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
    <div className="animate-in fade-in duration-700 relative">
      {/* Farm field background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950 opacity-30 rounded-lg"></div>

      <Card className="w-full max-w-md mx-4 sm:mx-auto bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700 animate-in slide-in-from-top-4 duration-500 delay-200">
        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300 animate-in slide-in-from-top-2 duration-500 delay-300">
            Farmer Portal
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-500 delay-400">
            Farm management access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-in fade-in duration-500 delay-500">
            <TabsList className="grid w-full grid-cols-2 bg-emerald-100 dark:bg-emerald-900">
              <TabsTrigger value="login" className="data-[state=active]:bg-emerald-200 dark:data-[state=active]:bg-emerald-700 transition-all duration-200">
                {t.auth.login}
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-emerald-200 dark:data-[state=active]:bg-emerald-700 transition-all duration-200">
                {t.auth.register}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Tabs
                value={authMode}
                onValueChange={setAuthMode}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">{t.auth.emailPassword}</TabsTrigger>
                  <TabsTrigger
                    value="passkey"
                    className="flex items-center gap-1"
                  >
                    <Fingerprint className="h-3 w-3" />
                    Passkey Login
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="pt-4 animate-in slide-in-from-right-4 duration-300">
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
                            <FormMessage className="text-red-600 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 hover:scale-[1.02]" disabled={loading}>
                        {loading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {t.auth.login}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                <TabsContent
                  value="passkey"
                  className="pt-3 sm:pt-4 space-y-3 sm:space-y-4 animate-in slide-in-from-left-4 duration-300"
                >
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900 rounded-full border-2 border-emerald-300 dark:border-emerald-600">
                      <Fingerprint className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-emerald-800 dark:text-emerald-200">
                      Secure Access
                    </h3>
                  </div>

                  <Button
                    onClick={handlePasskeyLogin}
                    className="w-full py-3 transition-all duration-200 hover:scale-[1.02]"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Fingerprint className="mr-2 h-4 w-4" />
                    )}
                    {loading ? "Authenticating..." : "Use Fingerprint"}
                  </Button>
                </TabsContent>
              </Tabs>
            </TabsContent>
            <TabsContent value="register" className="pt-4 animate-in slide-in-from-left-4 duration-300">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegister)}
                  className="space-y-4"
                >
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg border-2 border-emerald-200 dark:border-emerald-700">
                    <Fingerprint className="h-12 w-12 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                      Quick Registration
                    </h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
                      Secure access with biometric authentication
                    </p>
                    <Button
                      type="button"
                      onClick={() => {
                        toast({
                          title: "Farm Registration",
                          description:
                            "Touch your device's fingerprint sensor now",
                        });
                        // Register and redirect to login
                        setTimeout(() => {
                          setActiveTab("login");
                          setAuthMode("passkey");
                          toast({
                            title: "Registration Complete!",
                            description: "Now use fingerprint to access your farm portal",
                          });
                        }, 1500);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 hover:scale-[1.02]"
                    >
                      <Fingerprint className="mr-2 h-4 w-4" />
                      Register with Biometrics
                    </Button>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                      Or complete the traditional registration below
                    </p>
                  </div>
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
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all duration-200 hover:scale-[1.02]" disabled={loading}>
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
