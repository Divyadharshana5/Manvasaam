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
import { Loader2, Eye, EyeOff, ChefHat } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { useLanguage } from "@/context/language-context";

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
  const [activeTab, setActiveTab] = useState("login");
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Get ID token and create session cookie
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
      localStorage.setItem('userType', 'restaurant');

      toast({
        title: "Login successful",
        description: "Welcome to restaurant dashboard...",
        duration: 1000,
      });
      router.push("/dashboard/restaurant");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password.",
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
        userType: "restaurant",
        ...rest,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
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
        body: JSON.stringify({ identifier: email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send reset link.");
      }

      toast({
        title: "Password Reset Email Sent",
        description:
          "If an account exists, you will receive an email with reset instructions.",
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
    <div className="animate-in fade-in duration-700 relative">
      {/* Farm-to-table restaurant background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950 opacity-30 rounded-lg"></div>

      <Card className="w-full max-w-md mx-4 sm:mx-auto bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700 animate-in slide-in-from-right-4 duration-500 delay-200">


        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300 animate-in slide-in-from-top-2 duration-500 delay-300">
            Restaurant Portal
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400 animate-in fade-in duration-500 delay-400">
            Restaurant management access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-in fade-in duration-500 delay-400 relative z-10">
            <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-emerald-100 via-green-100 to-lime-100 dark:from-emerald-900 dark:via-green-900 dark:to-lime-900 border border-emerald-200 dark:border-emerald-700">
              <TabsTrigger value="login" className="data-[state=active]:bg-emerald-200 dark:data-[state=active]:bg-emerald-700">
                {t.auth.login}
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-emerald-200 dark:data-[state=active]:bg-emerald-700">
                {t.auth.register}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
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
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">{t.auth.restaurantNameLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder="The Fresh Table" className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400" {...field} />
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
                        <FormLabel className="text-emerald-700 dark:text-emerald-300 font-medium">{t.auth.emailLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder="restaurant@gmail.com" className="border-emerald-200 dark:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/50 placeholder:text-emerald-500 dark:placeholder:text-emerald-400" {...field} />
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
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.auth.login}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register">
              <Form {...registerForm}>
                <form
                  onSubmit={registerForm.handleSubmit(onRegister)}
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
                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
