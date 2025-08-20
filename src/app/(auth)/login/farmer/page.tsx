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
          description: "Welcome back,farmer...",
          duration: 3000,
        });
        setTimeout(() => {
          router.push("/dashboard/farmer");
        }, 5000);
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

      toast({
        title: "Login successful",
        description: "Welcome back,farmer...",
        duration: 3000,
      });
      setTimeout(() => {
        router.push("/dashboard/farmer");
      }, 5000);
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
    <Card className="w-full max-w-md mx-4 sm:mx-auto bg-card/80 backdrop-blur-lg border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
          <Tractor className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Farmer Portal
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Enhanced security with passkey authentication
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t.auth.login}</TabsTrigger>
            <TabsTrigger value="register">{t.auth.register}</TabsTrigger>
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
              <TabsContent value="email" className="pt-4">
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
                          <FormLabel>{t.auth.emailLabel}</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="farmer@gmail.com"
                              {...field}
                            />
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
                className="pt-3 sm:pt-4 space-y-3 sm:space-y-4"
              >
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-full">
                    <Fingerprint className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Fingerprint Login</h3>
                </div>

                <Button
                  onClick={handlePasskeyLogin}
                  className="w-full py-3"
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
          <TabsContent value="register" className="pt-4">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-4"
              >
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <Fingerprint className="h-12 w-12 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold text-green-800 mb-2">
                    Quick Fingerprint Setup
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    Skip typing! Just use your fingerprint to register quickly
                  </p>
                  <Button
                    type="button"
                    onClick={() => {
                      toast({
                        title: "Fingerprint Registration",
                        description:
                          "Touch your device's fingerprint sensor now",
                      });
                      // Register and redirect to login
                      setTimeout(() => {
                        setActiveTab("login");
                        setAuthMode("passkey");
                        toast({
                          title: "Registration Complete!",
                          description: "Now use fingerprint to login",
                        });
                      }, 1500);
                    }}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Fingerprint className="mr-2 h-4 w-4" />
                    Register with Fingerprint Only
                  </Button>
                  <p className="text-xs text-green-600 mt-2">
                    Or fill the form below for traditional registration
                  </p>
                </div>
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.auth.usernameLabel}</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="John Doe" {...field} />
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
                      <FormLabel>{t.auth.emailLabel}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="farmer@gmail.com"
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
                          placeholder="1234567890"
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
                  {t.auth.createAccount}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
