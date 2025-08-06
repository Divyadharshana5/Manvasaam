
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
import { Loader2, Camera, UserCheck, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { signInWithCustomToken } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const registerSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  userType: z.enum(["farmer", "customer"]),
  photoDataUri: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
    if (data.userType === 'farmer') {
        return !!data.photoDataUri;
    }
    return true;
}, {
    message: "Please capture a photo for face registration.",
    path: ["photoDataUri"],
});


const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

function RegisterForm({
    onRegisterSubmit,
    loading,
    form,
}: {
    onRegisterSubmit: (values: z.infer<typeof registerSchema>) => void;
    loading: boolean;
    form: any;
}) {
    const userType = useWatch({
        control: form.control,
        name: "userType",
    });
    
    const [facePhoto, setFacePhoto] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const startCamera = useCallback(async () => {
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
        }
    }, []);

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    }

    useEffect(() => {
        if (userType === 'farmer') {
            startCamera();
        } else {
            stopCamera();
            setFacePhoto(null);
            form.setValue('photoDataUri', undefined);
        }
        
        return () => {
            stopCamera();
        }
    }, [userType, form, startCamera]);

    const handleCaptureFace = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext("2d");
        context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        setFacePhoto(dataUri);
        form.setValue("photoDataUri", dataUri);
        form.clearErrors("photoDataUri");
        stopCamera();
    };

    const handleRetake = () => {
        setFacePhoto(null);
        form.setValue('photoDataUri', undefined);
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
                    <FormLabel>I am a...</FormLabel>
                    <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="customer" /></FormControl>
                            <FormLabel className="font-normal">Customer</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="farmer" /></FormControl>
                            <FormLabel className="font-normal">Farmer</FormLabel>
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
                                <FormLabel>Face Registration</FormLabel>
                                <FormControl>
                                   <Card className="p-4 bg-muted/50">
                                       {!facePhoto && (
                                           <div className="space-y-2">
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
                                                <Button type="button" onClick={handleCaptureFace} disabled={!isCameraActive || hasCameraPermission === false}>
                                                    <Camera className="mr-2 h-4 w-4"/> Capture Photo
                                                </Button>
                                           </div>
                                       )}
                                       {facePhoto && (
                                            <div className="space-y-4">
                                                <p className="text-sm font-medium text-green-600 flex items-center"><UserCheck className="mr-2 h-4 w-4"/> Photo captured successfully!</p>
                                                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                                                    <Image src={facePhoto} alt="Captured face" layout="fill" objectFit="cover" />
                                                </div>
                                                <Button type="button" variant="outline" onClick={handleRetake}>
                                                    <RefreshCw className="mr-2 h-4 w-4"/> Retake Photo
                                                </Button>
                                            </div>
                                       )}
                                   </Card>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
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
                    <FormLabel>Email</FormLabel>
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input type="tel" placeholder="123-456-7890" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
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
  const [isForgotPassDialogOpen, setIsForgotPassDialogOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);


  useEffect(() => {
    if (activeTab === 'login' && authMode === 'face') {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          setHasCameraPermission(false);
          toast({
            variant: "destructive",
            title: "Camera Access Denied",
            description: "Please enable camera permissions to use this feature.",
          });
        }
      };
      getCameraPermission();
    } else {
        // Stop camera stream when not in use
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    }
  }, [activeTab, authMode, toast]);

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

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleForgotPasswordOpen = useCallback(() => {
    const email = loginForm.getValues("email");
    if (email) {
      forgotPasswordForm.setValue("email", email);
    }
  }, [loginForm, forgotPasswordForm]);

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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed.');
      }

      const { token } = await response.json();
      await signInWithCustomToken(auth, token);

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

  async function onForgotPassword(values: z.infer<typeof forgotPasswordSchema>) {
    setLoading(true);
    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset link.');
      }

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox for instructions to reset your password.",
      });
      setIsForgotPassDialogOpen(false);
      forgotPasswordForm.reset();
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
    <Card className="w-full max-w-md bg-card/60 backdrop-blur-lg border-2 border-white/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle>Welcome to Manvaasam</CardTitle>
        <CardDescription>Sign in or create an account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Tabs value={authMode} onValueChange={setAuthMode} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email & Password</TabsTrigger>
                <TabsTrigger value="face">Farmer Face Sign-In</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="pt-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
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
                            <FormLabel>Password</FormLabel>
                            <Dialog open={isForgotPassDialogOpen} onOpenChange={setIsForgotPassDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="link" size="sm" type="button" className="p-0 h-auto text-xs" onClick={handleForgotPasswordOpen}>Forgot Password?</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Forgot Password</DialogTitle>
                                  <DialogDescription>Enter your email and we'll send a reset link.</DialogDescription>
                                </DialogHeader>
                                <Form {...forgotPasswordForm}>
                                  <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPassword)} className="space-y-4">
                                    <FormField
                                      control={forgotPasswordForm.control}
                                      name="email"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Email</FormLabel>
                                          <FormControl><Input type="email" placeholder="m@example.com" {...field} /></FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter>
                                      <DialogClose asChild><Button type="button" variant="secondary" disabled={loading}>Cancel</Button></DialogClose>
                                      <Button type="submit" disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send Reset Link
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <FormControl><Input type="password" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
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
                  Sign In
                </Button>
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="register">
             <RegisterForm 
                onRegisterSubmit={onRegister}
                loading={loading}
                form={registerForm}
              />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

    