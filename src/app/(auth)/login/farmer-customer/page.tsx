
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Loader2, Camera, UserCheck, RefreshCw, View, ViewOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const registerSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }).refine(email => email.endsWith('@gmail.com'), { message: "Email must be a @gmail.com address." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character." })
    .refine(s => !s.includes(' '), "Password cannot contain spaces."),
  confirmPassword: z.string(),
  userType: z.enum(["farmer", "customer"]),
  photoDataUri: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


function RegisterForm({
    onRegisterSubmit,
    loading,
    form,
    videoRef,
    hasCameraPermission,
    isCameraActive,
    startCamera,
    stopCamera,
}: {
    onRegisterSubmit: (values: z.infer<typeof registerSchema>) => void;
    loading: boolean;
    form: any;
    videoRef: React.RefObject<HTMLVideoElement>;
    hasCameraPermission: boolean | null;
    isCameraActive: boolean;
    startCamera: () => void;
    stopCamera: () => void;
}) {
    const { t } = useLanguage();
    const userType = useWatch({
        control: form.control,
        name: "userType",
    });
    
    const [facePhoto, setFacePhoto] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (userType === 'farmer' && !facePhoto) {
            startCamera();
        } else {
            stopCamera();
        }
    }, [userType, facePhoto, startCamera, stopCamera]);

    const handleCaptureFace = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext("2d");
        context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        setFacePhoto(dataUri);
        form.setValue("photoDataUri", dataUri, { shouldValidate: true });
        form.clearErrors("photoDataUri");
        stopCamera();
    };

    const handleRetake = () => {
        setFacePhoto(null);
        form.setValue('photoDataUri', undefined, { shouldValidate: true });
        startCamera();
    }

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
      onRegisterSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>{t.auth.iamA}</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="customer" /></FormControl>
                            <FormLabel className="font-normal">{t.auth.customer}</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="farmer" /></FormControl>
                            <FormLabel className="font-normal">{t.auth.farmer}</FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 {userType === 'farmer' && (
                    <FormField
                        control={form.control}
                        name="photoDataUri"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t.auth.faceReg} (Optional)</FormLabel>
                                <Card className="p-4 bg-muted/50 border-dashed border-2">
                                       <CardContent className="p-0">
                                            {!facePhoto ? (
                                                <div className="space-y-2">
                                                        <p className="text-sm text-muted-foreground text-center">{t.auth.faceRegDesc}</p>
                                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-background">
                                                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                                        {hasCameraPermission === false && (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
                                                                <Camera className="h-10 w-10 mb-2"/>
                                                                <p className="text-center font-semibold">Camera access denied.</p>
                                                                <p className="text-sm text-center">Please enable camera permissions in your browser settings.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button type="button" onClick={handleCaptureFace} disabled={!isCameraActive || hasCameraPermission === false} className="w-full">
                                                        <Camera className="mr-2 h-4 w-4"/> {t.auth.capturePhoto}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="text-sm font-medium text-green-600 flex items-center justify-center"><UserCheck className="mr-2 h-4 w-4"/> {t.auth.photoCaptured}</div>
                                                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                                        <Image src={facePhoto} alt="Captured face" layout="fill" objectFit="cover" />
                                                    </div>
                                                    <Button type="button" variant="outline" onClick={handleRetake} className="w-full">
                                                        <RefreshCw className="mr-2 h-4 w-4"/> {t.auth.retakePhoto}
                                                    </Button>
                                                </div>
                                            )}
                                       </CardContent>
                                </Card>
                                <FormMessage className="pt-1"/>
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t.auth.usernameLabel}</FormLabel>
                    <FormControl><Input type="text" placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t.auth.emailLabel}</FormLabel>
                    <FormControl><Input type="email" placeholder="m@example.com" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t.auth.phoneLabel}</FormLabel>
                    <FormControl><Input type="tel" placeholder="123-456-7890" maxLength={10} {...field} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t.auth.passwordLabel}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input type={showPassword ? "text" : "password"} {...field} />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <ViewOff className="h-4 w-4" /> : <View className="h-4 w-4" />}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t.auth.confirmPasswordLabel}</FormLabel>
                    <FormControl>
                       <div className="relative">
                            <Input type={showConfirmPassword ? "text" : "password"} {...field} />
                            <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <ViewOff className="h-4 w-4" /> : <View className="h-4 w-4" />}
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
    );
}


export default function FarmerCustomerAuthPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [authMode, setAuthMode] = useState("email");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);

  const startCamera = useCallback(async () => {
    if (isCameraActive || hasCameraPermission === false) return;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
    } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCameraPermission(false);
        toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions in your browser settings to use face authentication.",
        });
    }
  }, [isCameraActive, hasCameraPermission, toast]);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    const isFaceAuthVisible = activeTab === 'login' && authMode === 'face';
    const isRegisterFarmerVisible = activeTab === 'register'; // We'll refine this inside the component

    if (isFaceAuthVisible) {
        startCamera();
    } else if (!isRegisterFarmerVisible) {
        stopCamera();
    }
    
    // Cleanup on component unmount
    return () => {
        stopCamera();
    };
  }, [activeTab, authMode, startCamera, stopCamera]);
  

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
      userType: "customer",
      photoDataUri: undefined,
    },
  });

  async function onForgotPassword() {
    setLoading(true);
    try {
      const email = loginForm.getValues("email");
      if (!email) {
          toast({ variant: "destructive", title: "Email required", description: "Please enter your email address to reset your password."});
          setLoading(false);
          return;
      }

      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send reset link.');
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox for instructions to reset your password.",
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

  const handleFaceLogin = async () => {
    if (!videoRef.current) return;
    setLoading(true);

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoDataUri = canvas.toDataURL("image/jpeg");

    try {
        const response = await fetch('/api/face-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photoDataUri, userType: 'farmer' }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Face login failed.');
        }
        
        const { token } = await response.json();
        await signInWithCustomToken(auth, token);
        
        toast({ title: "Face Login Successful", description: "Welcome back!" });
        router.push("/dashboard");

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Face Login Failed",
            description: error.message,
        });
    } finally {
        setLoading(false);
    }
  };


  async function onLogin(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
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
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register.');
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please log in.",
      });
      setActiveTab("login");
      loginForm.setValue("email", values.email);
      loginForm.setValue("password", "");
      registerForm.reset();


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

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-lg border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>{t.auth.welcome}</CardTitle>
        <CardDescription>{t.auth.getStarted}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t.auth.login}</TabsTrigger>
            <TabsTrigger value="register">{t.auth.register}</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Tabs value={authMode} onValueChange={setAuthMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">{t.auth.emailPassword}</TabsTrigger>
                <TabsTrigger value="face">{t.auth.farmerFaceSignIn}</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="pt-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t.auth.emailLabel}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="m@example.com" {...field} />
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
                            <Button variant="link" size="sm" type="button" className="p-0 h-auto text-xs" onClick={onForgotPassword} disabled={loading}>{t.auth.forgotPassword}</Button>
                          </div>
                          <FormControl>
                            <div className="relative">
                                <Input type={showPassword ? "text" : "password"} {...field} />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <ViewOff className="h-4 w-4" /> : <View className="h-4 w-4" />}
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
              <TabsContent value="face" className="pt-4 space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    {hasCameraPermission === false && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
                            <Camera className="h-10 w-10 mb-2"/>
                            <p className="text-center font-semibold">Camera access denied.</p>
                            <p className="text-center text-sm">Please enable camera permissions in your browser settings.</p>
                        </div>
                    )}
                </div>
                <Button onClick={handleFaceLogin} className="w-full" disabled={loading || hasCameraPermission !== true}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t.auth.signIn}
                </Button>
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="register">
             <RegisterForm 
                onRegisterSubmit={onRegister}
                loading={loading}
                form={registerForm}
                videoRef={videoRef}
                hasCameraPermission={hasCameraPermission}
                isCameraActive={isCameraActive}
                startCamera={startCamera}
                stopCamera={stopCamera}
              />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

    