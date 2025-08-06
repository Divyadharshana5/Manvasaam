
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";


const orderFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    mobile: z.string().min(10, { message: "Please enter a valid mobile number." }),
    whatsapp: z.string().min(10, { message: "Please enter a valid WhatsApp number." }),
    address: z.string().min(5, { message: "Address is required." }),
    country: z.string().min(2, { message: "Country is required." }),
    state: z.string().min(2, { message: "State is required." }),
    district: z.string().min(2, { message: "District is required." }),
});

export default function ProductsPage() {
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    
    const form = useForm<z.infer<typeof orderFormSchema>>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            name: user?.displayName || "",
            email: user?.email || "",
            mobile: "",
            whatsapp: "",
            address: "",
            country: "",
            state: "",
            district: "",
        },
    });

    async function onSubmit(values: z.infer<typeof orderFormSchema>) {
        setIsSubmitting(true);
        try {
            // In a real application, you would send this data to your backend API
            // For now, we simulate success and store it in localStorage to show on the orders page.
            
            const newOrder = {
                id: `ORD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                customer: { name: values.name, email: values.email },
                date: new Date().toISOString(),
                status: "Processing" as const,
                total: 20.00,
                items: [{ id: "PROD-CARROT", name: "Carrot", quantity: 1, price: 20.00 }]
            };

            // Retrieve existing orders from localStorage, add the new one, and save back.
            const existingOrders = JSON.parse(localStorage.getItem("mockOrders") || "[]");
            localStorage.setItem("mockOrders", JSON.stringify([newOrder, ...existingOrders]));


            toast({
                title: "Order Placed!",
                description: "Your order has been successfully submitted.",
            });
            
            setIsOrderDialogOpen(false);
            router.push("/dashboard/orders");

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Order Failed",
                description: error.message || "Something went wrong.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }


  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Products</h2>
            <p className="text-muted-foreground">
              Browse and purchase fresh produce directly from our farmers.
            </p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                    <div className="relative aspect-video">
                        <Image 
                            src="https://placehold.co/600x400.png"
                            alt="Fresh Carrots"
                            layout="fill"
                            objectFit="cover"
                            data-ai-hint="carrot"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <CardTitle>Fresh Carrots</CardTitle>
                    <p className="text-lg font-semibold text-primary mt-2">1kg - Rs.20</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                   <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
                     <DialogTrigger asChild>
                       <Button className="w-full">
                         <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                       </Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-lg">
                       <DialogHeader>
                         <DialogTitle>Place Your Order</DialogTitle>
                         <DialogDescription>
                           Please fill in your details to complete the purchase.
                         </DialogDescription>
                       </DialogHeader>
                       <Form {...form}>
                         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                           <FormField control={form.control} name="name" render={({ field }) => (
                               <FormItem>
                                 <FormLabel>Name</FormLabel>
                                 <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                           <FormField control={form.control} name="email" render={({ field }) => (
                               <FormItem>
                                 <FormLabel>Email ID</FormLabel>
                                 <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="mobile" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mobile Number</FormLabel>
                                        <FormControl><Input type="tel" placeholder="123-456-7890" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name="whatsapp" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp Number</FormLabel>
                                        <FormControl><Input type="tel" placeholder="123-456-7890" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                           </div>
                           <FormField control={form.control} name="address" render={({ field }) => (
                               <FormItem>
                                 <FormLabel>Address</FormLabel>
                                 <FormControl><Input placeholder="123 Main St, City" {...field} /></FormControl>
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <FormField control={form.control} name="country" render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>Country</FormLabel>
                                   <FormControl><Input placeholder="e.g. India" {...field} /></FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                             <FormField control={form.control} name="state" render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>State</FormLabel>
                                   <FormControl><Input placeholder="e.g. Maharashtra" {...field} /></FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                             <FormField control={form.control} name="district" render={({ field }) => (
                                 <FormItem>
                                   <FormLabel>District</FormLabel>
                                   <FormControl><Input placeholder="e.g. Pune" {...field} /></FormControl>
                                   <FormMessage />
                                 </FormItem>
                               )}
                             />
                           </div>
                           <DialogFooter>
                             <DialogClose asChild>
                               <Button type="button" variant="secondary" disabled={isSubmitting}>
                                 Cancel
                               </Button>
                             </DialogClose>
                             <Button type="submit" disabled={isSubmitting}>
                               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                               Place Order
                             </Button>
                           </DialogFooter>
                         </form>
                       </Form>
                     </DialogContent>
                   </Dialog>
                </CardFooter>
            </Card>
        </div>
      </div>
    </AppLayout>
  );
}
