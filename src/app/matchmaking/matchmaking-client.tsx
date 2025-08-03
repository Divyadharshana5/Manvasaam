"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  intelligentCropMatching,
  type IntelligentCropMatchingOutput,
} from "@/ai/flows/intelligent-crop-matching";
import { Loader2, Sparkles } from "lucide-react";

const formSchema = z.object({
  cropType: z.string().min(2, {
    message: "Crop type must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  quantity: z.coerce
    .number()
    .positive({ message: "Quantity must be a positive number." }),
  maxPrice: z.coerce
    .number()
    .positive({ message: "Price must be a positive number." }),
});

export default function MatchmakingClient() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IntelligentCropMatchingOutput | null>(
    null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: "",
      location: "",
      quantity: 1000,
      maxPrice: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResults(null);
    try {
      const response = await intelligentCropMatching(values);
      setResults(response);
    } catch (error) {
      console.error("Error with AI matching:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Failed to get matchmaking results. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Find a Farmer</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Organic Tomatoes" {...field} />
                    </FormControl>
                    <FormDescription>
                      What crop are you looking for?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco, CA" {...field} />
                    </FormControl>
                    <FormDescription>
                      This helps find nearby farmers.
                    </FormDescription>
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
              <FormField
                control={form.control}
                name="maxPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Price (per kg)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Sparkles className="mr-2" /> Find Matches
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Matching Results</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Our AI is searching for the best matches...</p>
            </div>
          )}
          {!loading && !results && (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground text-center">
              <Sparkles className="h-8 w-8 mb-4" />
              <p>Your AI-powered results will appear here.</p>
              <p className="text-sm">
                Fill out the form to find your perfect match.
              </p>
            </div>
          )}
          {results && (
            <div>
              {results.matchedFarmers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Farmer ID</TableHead>
                      <TableHead>Distance (km)</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Available Qty</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.matchedFarmers.map((farmer) => (
                      <TableRow key={farmer.farmerId}>
                        <TableCell className="font-mono">
                          {farmer.farmerId}
                        </TableCell>
                        <TableCell>{farmer.distance} km</TableCell>
                        <TableCell>${farmer.price.toFixed(2)}</TableCell>
                        <TableCell>
                          {farmer.availableQuantity.toLocaleString()} kg
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Contact
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No farmers matched your criteria. Try adjusting your search.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
