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
import {
  Loader2,
  Eye,
  EyeOff,
  Tractor,
  Fingerprint,
  UserCheck,
  CheckCircle,
  AlertCircle,
  Key,
  Lock,
  Square,
  Mic,
  MicOff,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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

function PasskeyStatusDisplay({ status }: { status: PasskeyStatus | null }) {
  if (!status) return null;

  const getStatusBadge = (statusType: string) => {
    switch (statusType) {
      case "ready":
        return "bg-blue-100 text-blue-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "registering":
      case "authenticating":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center justify-between">
        <h4 className="font-medium flex items-center gap-2">
          <Fingerprint className="h-4 w-4" />
          Passkey Status
        </h4>
        <Badge className={getStatusBadge(status.status)}>
          {status.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status.supported ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span>Browser Support</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              status.registered ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span>Registered</span>
        </div>
      </div>

      {status.credentialId && (
        <div className="text-xs text-muted-foreground">
          <span>Credential ID: </span>
          <span className="font-mono">
            {status.credentialId.slice(0, 16)}...
          </span>
        </div>
      )}

      {status.feedback && (
        <Alert
          className={
            status.status === "success"
              ? "border-green-200"
              : status.status === "error"
              ? "border-red-200"
              : "border-blue-200"
          }
        >
          {status.status === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : status.status === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <Key className="h-4 w-4 text-blue-600" />
          )}
          <AlertDescription className="text-sm">
            {status.feedback}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
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
  const [passkeyLoginStatus, setPasskeyLoginStatus] =
    useState<PasskeyStatus | null>(null);
  const [authenticatingPasskey, setAuthenticatingPasskey] = useState(false);
  const [passkeyStatus, setPasskeyStatus] = useState<PasskeyStatus | null>(
    null
  );
  const [isRegisteringPasskey, setIsRegisteringPasskey] = useState(false);

  useEffect(() => {
    if (authMode === "passkey") {
      checkPasskeyLoginSupport();
    }
  }, [authMode]);

  useEffect(() => {
    if (activeTab === "register") {
      checkPasskeySupport();
    }
  }, [activeTab]);

  const checkPasskeyLoginSupport = async () => {
    try {
      const isSupported =
        window.PublicKeyCredential &&
        (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());

      setPasskeyLoginStatus({
        supported: isSupported,
        registered: false,
        feedback: isSupported
          ? "Ready for passkey authentication"
          : "Passkey authentication is not supported on this device",
        status: isSupported ? "ready" : "error",
      });
    } catch (error) {
      console.error("Passkey support check failed:", error);
      setPasskeyLoginStatus({
        supported: false,
        registered: false,
        feedback: "Unable to check passkey support",
        status: "error",
      });
    }
  };

  const checkPasskeySupport = async () => {
    try {
      const isSupported =
        window.PublicKeyCredential &&
        (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());

      setPasskeyStatus({
        supported: isSupported,
        registered: false,
        feedback: isSupported
          ? "Your device supports passkey authentication"
          : "Passkey authentication is not supported on this device",
        status: isSupported ? "ready" : "error",
      });
    } catch (error) {
      console.error("Passkey support check failed:", error);
      setPasskeyStatus({
        supported: false,
        registered: false,
        feedback: "Unable to check passkey support",
        status: "error",
      });
    }
  };

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
    if (!passkeyLoginStatus?.supported) {
      toast({
        variant: "destructive",
        title: "Passkey Not Supported",
        description: "Your device doesn't support passkey authentication.",
      });
      return;
    }

    setLoading(true);
    setAuthenticatingPasskey(true);
    setPasskeyLoginStatus((prev) =>
      prev ? { ...prev, status: "authenticating" } : null
    );

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = (await navigator.credentials.get({
        publicKey: {
          challenge,
          rpId: window.location.hostname,
          userVerification: "required",
          timeout: 60000,
        },
      })) as PublicKeyCredential;

      if (!credential) {
        throw new Error("No passkey credential found");
      }

      const response = await fetch("/api/passkey-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credentialId: Array.from(new Uint8Array(credential.rawId))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""),
          userType: "farmer",
          authenticatorData: Array.from(
            new Uint8Array(
              (
                credential.response as AuthenticatorAssertionResponse
              ).authenticatorData
            )
          ),
          signature: Array.from(
            new Uint8Array(
              (credential.response as AuthenticatorAssertionResponse).signature
            )
          ),
          clientDataJSON: Array.from(
            new Uint8Array(credential.response.clientDataJSON)
          ),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Passkey authentication failed.");
      }

      const { token, user } = await response.json();
      const userCredential = await signInWithCustomToken(auth, token);

      const idToken = await userCredential.user.getIdToken();
      const sessionResponse = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionResponse.ok) {
        throw new Error("Failed to create session");
      }

      setPasskeyLoginStatus((prev) =>
        prev
          ? {
              ...prev,
              feedback: "Authentication successful!",
              status: "success",
            }
          : null
      );

      toast({
        title: "Passkey Login Successful",
        description: `Welcome back, ${user.username}!`,
      });
      router.push("/dashboard");
    } catch (error: any) {
      setPasskeyLoginStatus((prev) =>
        prev
          ? {
              ...prev,
              feedback:
                error.message || "Authentication failed. Please try again.",
              status: "error",
            }
          : null
      );

      toast({
        variant: "destructive",
        title: "Passkey Login Failed",
        description: error.message || "Unable to authenticate with passkey.",
      });
    } finally {
      setLoading(false);
      setAuthenticatingPasskey(false);
    }
  };

  const handleRegisterPasskey = async () => {
    if (!passkeyStatus?.supported) {
      toast({
        variant: "destructive",
        title: "Passkey Not Supported",
        description: "Your device doesn't support passkey authentication.",
      });
      return;
    }

    setIsRegisteringPasskey(true);
    setPasskeyStatus((prev) =>
      prev ? { ...prev, status: "registering" } : null
    );

    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const tempUserId = `farmer_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const tempEmail = `${tempUserId}@temp.manvaasam.local`;

      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: {
            name: "Manvaasam",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(tempUserId),
            name: tempEmail,
            displayName: "Farmer User",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
        },
      })) as PublicKeyCredential;

      if (credential) {
        const credentialId = Array.from(new Uint8Array(credential.rawId))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        registerForm.setValue("passkeyCredentialId", credentialId, {
          shouldValidate: true,
        });

        setPasskeyStatus({
          supported: true,
          registered: true,
          credentialId,
          feedback:
            "Fingerprint registered successfully! You can now use fingerprint login.",
          status: "success",
        });
      }
    } catch (error: any) {
      console.error("Passkey registration failed:", error);
      setPasskeyStatus((prev) =>
        prev
          ? {
              ...prev,
              feedback:
                error.message ||
                "Failed to register fingerprint. Please try again or skip this step.",
              status: "error",
            }
          : null
      );

      toast({
        variant: "destructive",
        title: "Fingerprint Setup Failed",
        description:
          error.message ||
          "Unable to setup fingerprint. Please try again or skip this step.",
      });
    } finally {
      setIsRegisteringPasskey(false);
    }
  };

  const handleResetPasskey = () => {
    setPasskeyStatus((prev) =>
      prev
        ? {
            ...prev,
            registered: false,
            credentialId: undefined,
            feedback: "Ready to register your fingerprint",
            status: "ready",
          }
        : null
    );
    registerForm.setValue("passkeyCredentialId", undefined, {
      shouldValidate: true,
    });
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

      toast({ title: "Login Successful", description: "Welcome back!" });
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
                <div className="text-center space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-primary/10 rounded-full">
                    <Fingerprint className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </div>
                  <div className="px-2">
                    <h3 className="font-semibold text-base sm:text-lg">
                      Passkey Authentication
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Use your device's biometric sensors for secure login
                    </p>
                  </div>
                </div>

                {passkeyLoginStatus && (
                  <PasskeyStatusDisplay status={passkeyLoginStatus} />
                )}

                {authenticatingPasskey && (
                  <div className="text-center py-3 sm:py-4">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <span className="hidden sm:inline">
                        Authenticating with passkey...
                      </span>
                      <span className="sm:hidden">Authenticating...</span>
                    </p>
                  </div>
                )}

                <Button
                  onClick={handlePasskeyLogin}
                  className="w-full text-sm sm:text-base py-2 sm:py-3 animate-pulse hover:animate-none"
                  disabled={loading || !passkeyLoginStatus?.supported}
                >
                  {loading && (
                    <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  )}
                  <Fingerprint className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">
                    👆 Touch Your Device's Fingerprint Sensor
                  </span>
                  <span className="sm:hidden">👆 Touch Sensor</span>
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
                <FormField
                  control={registerForm.control}
                  name="passkeyCredentialId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4" />
                        Quick Fingerprint Setup (Optional)
                        <span className="text-xs text-green-600 font-normal ml-2">
                          • No details required - just your fingerprint!
                        </span>
                      </FormLabel>
                      <Card className="p-3 sm:p-4 bg-muted/50 border-dashed border-2">
                        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <div className="text-blue-600 text-sm">ℹ️</div>
                            <div className="text-xs text-blue-800">
                              <strong>Quick Setup:</strong> You can set up your
                              fingerprint right now - no other details needed!
                              Or skip this step and use password login instead.
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-0">
                          {!passkeyStatus?.registered ? (
                            <div className="space-y-3 sm:space-y-4">
                              <div className="text-center space-y-2">
                                <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-primary/10 rounded-full">
                                  <Fingerprint className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground px-2">
                                  <strong>Simple & Fast:</strong> Just touch your
                                  fingerprint sensor - no typing required!
                                  <br />
                                  <span className="text-green-600 text-xs">
                                    ✓ Works with your phone's fingerprint, face
                                    unlock, or PIN
                                  </span>
                                </p>
                              </div>

                              {passkeyStatus && (
                                <PasskeyStatusDisplay status={passkeyStatus} />
                              )}

                              <div className="space-y-2">
                                <Button
                                  type="button"
                                  onClick={handleRegisterPasskey}
                                  disabled={
                                    !passkeyStatus?.supported ||
                                    isRegisteringPasskey
                                  }
                                  className="w-full text-sm sm:text-base py-2 sm:py-3"
                                >
                                  {isRegisteringPasskey ? (
                                    <>
                                      <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                      <span className="hidden sm:inline">
                                        Touch Your Fingerprint Sensor...
                                      </span>
                                      <span className="sm:hidden">
                                        Touch Sensor...
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Fingerprint className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                      <span className="hidden sm:inline">
                                        Touch Fingerprint to Register
                                      </span>
                                      <span className="sm:hidden">
                                        Touch Fingerprint
                                      </span>
                                    </>
                                  )}
                                </Button>

                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setPasskeyStatus({
                                      supported: false,
                                      registered: false,
                                      credentialId: "",
                                      feedback:
                                        "Fingerprint setup skipped. You can use password login.",
                                      status: "ready",
                                    });
                                  }}
                                  className="w-full text-xs sm:text-sm py-1.5 sm:py-2 border-dashed text-muted-foreground hover:text-foreground"
                                >
                                  ✋ Skip Fingerprint Setup (Use Password Only)
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 sm:space-y-4">
                              <div className="text-xs sm:text-sm font-medium text-green-600 flex items-center justify-center">
                                <UserCheck className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">
                                  {passkeyStatus?.credentialId
                                    ? "Fingerprint Setup Complete"
                                    : "Setup Complete - Password Login Ready"}
                                </span>
                                <span className="sm:hidden">Setup Complete</span>
                              </div>
                              <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-green-100 rounded-full">
                                <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                              </div>
                              <PasskeyStatusDisplay status={passkeyStatus} />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleResetPasskey}
                                className="w-full text-sm sm:text-base py-2 sm:py-3"
                              >
                                <Key className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">
                                  Register New Passkey
                                </span>
                                <span className="sm:hidden">New Passkey</span>
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                      <FormMessage className="pt-1" />
                    </FormItem>
                  )}
                />
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
                            e.currentTarget.value = e.currentTarget.value.replace(
                              /[^0-9]/g,
                              ""
                            );
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