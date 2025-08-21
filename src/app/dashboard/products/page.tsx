
"use client";

import { useState, useEffect } from "react";
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
import { Loader2, ShoppingCart, Star, Trees, Milk, Carrot, Apple, Wheat, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/language-context";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";


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

const farmerData = {
    name: "Rajesh Kumar",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "indian farmer",
    acres: 15,
    products: {
        vegetables: [
            { id: "PROD-CARROT", name: "Carrot", price: 30, unit: "1 kg", image: "https://placehold.co/600x400.png", dataAiHint: "fresh carrots" }
        ],
        fruits: [
            { id: "PROD-POM", name: "Pomegranate", price: 100, unit: "1 kg", image: "https://placehold.co/600x400.png", dataAiHint: "fresh pomegranates" }
        ],
        dairy: [
            { id: "PROD-GHEE", name: "Ghee", price: 80, unit: "500 g", image: "https://placehold.co/600x400.png", dataAiHint: "ghee jar" }
        ]
    }
};

type Product = {
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    dataAiHint: string;
};

function OrderForm({ product, onClose }: { product: Product, onClose: () => void}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    const { t } = useLanguage();
    
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
            const newOrder = {
                id: `ORD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                customer: { name: values.name, email: values.email },
                date: new Date().toISOString(),
                status: "Processing" as const,
                total: product.price,
                items: [{ id: product.id, name: product.name, quantity: 1, price: product.price }]
            };

            const existingOrders = JSON.parse(localStorage.getItem("mockOrders") || "[]");
            localStorage.setItem("mockOrders", JSON.stringify([newOrder, ...existingOrders]));


            toast({
                title: t.products.orderSuccessTitle,
                description: t.products.orderSuccessDescription,
            });
            
            onClose();
            router.push("/dashboard/orders");

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t.products.orderFailTitle,
                description: error.message || t.products.orderFailDescription,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>Place order for {product.name}</DialogTitle>
                <DialogDescription>
                {t.products.dialogDescription}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.products.nameLabel}</FormLabel>
                        <FormControl><Input placeholder={t.products.namePlaceholder} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.products.emailLabel}</FormLabel>
                        <FormControl><Input type="email" placeholder={t.products.emailPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="mobile" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.products.mobileLabel}</FormLabel>
                            <FormControl><Input type="tel" placeholder={t.products.mobilePlaceholder} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="whatsapp" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t.products.whatsappLabel}</FormLabel>
                            <FormControl><Input type="tel" placeholder={t.products.whatsappPlaceholder} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.products.addressLabel}</FormLabel>
                        <FormControl><Input placeholder={t.products.addressPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.products.countryLabel}</FormLabel>
                        <FormControl><Input placeholder={t.products.countryPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.products.stateLabel}</FormLabel>
                        <FormControl><Input placeholder={t.products.statePlaceholder} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField control={form.control} name="district" render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t.products.districtLabel}</FormLabel>
                        <FormControl><Input placeholder={t.products.districtPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <DialogFooter className="pt-4 sticky bottom-0 bg-background">
                    <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isSubmitting}>
                        {t.products.cancel}
                    </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.products.placeOrder}
                    </Button>
                </DialogFooter>
                </form>
            </Form>
        </>
    );
}


export default function ProductsPage() {
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { toast } = useToast();
    const { t } = useLanguage();
    const router = useRouter();
    const { user } = useAuth();

    // Redirect restaurant users to their specific products page
    useEffect(() => {
        // Check if user is a restaurant user (you can implement your own logic here)
        // For now, we'll check localStorage or user metadata
        const userType = localStorage.getItem('userType');
        if (userType === 'restaurant') {
            router.replace('/dashboard/restaurant/products');
            return;
        }
    }, [router]);

    const handleBuyNow = (product: Product) => {
        setSelectedProduct(product);
        setIsOrderDialogOpen(true);
    };

    const handleAddToCart = (product: Product) => {
        toast({
            title: "Added to Cart!",
            description: `${product.name} has been added to your cart.`
        });
    };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t.products.title}</h2>
            <p className="text-muted-foreground">
              {t.products.description}
            </p>
          </div>
        </div>

        <Card className="w-full">
             <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={farmerData.avatar} data-ai-hint={farmerData.dataAiHint} />
                        <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">{farmerData.name}</CardTitle>
                        <CardDescription>{farmerData.acres} Acres of Farmland</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
                {/* Vegetables Section */}
                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4"><Carrot className="text-primary"/>Vegetables</h3>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                       {farmerData.products.vegetables.map(product => (
                            <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-0">
                                    <div className="relative aspect-video">
                                        <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={product.dataAiHint} />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg">{product.name}</h4>
                                        <p className="text-primary font-semibold mt-1">{product.unit} – Rs.{product.price}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <div className="flex w-full gap-2">
                                        <Button className="w-full" variant="outline" onClick={() => handleAddToCart(product)}>
                                            <ShoppingCart className="mr-2 h-4 w-4" /> {t.products.addToCart}
                                        </Button>
                                        <Button className="w-full" onClick={() => handleBuyNow(product)}>
                                            {t.products.buyNow}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                       ))}
                    </div>
                </div>

                <Separator />
                
                {/* Fruits Section */}
                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4"><Apple className="text-primary"/>Fruits</h3>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                       {farmerData.products.fruits.map(product => (
                            <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-0">
                                    <div className="relative aspect-video">
                                        <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={product.dataAiHint} />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg">{product.name}</h4>
                                        <p className="text-primary font-semibold mt-1">{product.unit} – Rs.{product.price}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <div className="flex w-full gap-2">
                                        <Button className="w-full" variant="outline" onClick={() => handleAddToCart(product)}>
                                            <ShoppingCart className="mr-2 h-4 w-4" /> {t.products.addToCart}
                                        </Button>
                                        <Button className="w-full" onClick={() => handleBuyNow(product)}>
                                            {t.products.buyNow}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                       ))}
                    </div>
                </div>

                <Separator />

                {/* Dairy Products Section */}
                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-4"><Milk className="text-primary"/>Dairy Products</h3>
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                       {farmerData.products.dairy.map(product => (
                            <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-0">
                                    <div className="relative aspect-video">
                                        <Image src={product.image} alt={product.name} layout="fill" objectFit="cover" data-ai-hint={product.dataAiHint} />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg">{product.name}</h4>
                                        <p className="text-primary font-semibold mt-1">{product.unit} – Rs.{product.price}</p>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <div className="flex w-full gap-2">
                                        <Button className="w-full" variant="outline" onClick={() => handleAddToCart(product)}>
                                            <ShoppingCart className="mr-2 h-4 w-4" /> {t.products.addToCart}
                                        </Button>
                                        <Button className="w-full" onClick={() => handleBuyNow(product)}>
                                            {t.products.buyNow}
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                       ))}
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-lg">
            {selectedProduct && <OrderForm product={selectedProduct} onClose={() => setIsOrderDialogOpen(false)} />}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

    