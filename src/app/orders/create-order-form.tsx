"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { mockCrops } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  cropId: z.string().min(1, { message: "Please select a crop." }),
  quantity: z.coerce
    .number()
    .positive({ message: "Quantity must be a positive number." }),
});

export default function CreateOrderForm() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropId: "",
      quantity: 1,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "You must be logged in to create an order.",
      });
      return;
    }

    setLoading(true);
    try {
      const selectedCrop = mockCrops.find((c) => c.id === values.cropId);
      if (!selectedCrop) {
        throw new Error("Selected crop not found.");
      }
      
      const totalPrice = selectedCrop.price * values.quantity;

      await addDoc(collection(db, "orders"), {
        buyerId: user.uid,
        buyer: user.displayName || user.email,
        crop: selectedCrop,
        quantity: values.quantity,
        totalPrice: totalPrice + 15 + 10, // including mock shipping and tax
        orderDate: serverTimestamp(),
        status: "Pending",
        logistics: [
          {
            timestamp: serverTimestamp(),
            status: "Pending",
            location: "System",
            notes: "Order created by buyer.",
          },
        ],
      });

      toast({
        title: "Order Created!",
        description: "Your new order has been successfully placed.",
      });
      form.reset();
      // Potentially close dialog here if passed a function to do so
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Create Order",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cropId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Crop</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a crop to order" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockCrops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.name} (${crop.price}/kg)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity (in kg)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="animate-spin mr-2" />}
          Place Order
        </Button>
      </form>
    </Form>
  );
}
