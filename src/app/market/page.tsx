"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCrops } from "@/lib/data";
import type { Crop } from "@/lib/types";
import Image from "next/image";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MarketPage() {
  const { toast } = useToast();
  const crops: Crop[] = mockCrops;

  const handlePlaceOrder = (cropName: string) => {
    toast({
      title: "Order Placed (Simulated)",
      description: `Your order for ${cropName} has been placed.`,
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Crop Market</h2>
          <p className="text-muted-foreground">
            Browse and buy fresh produce directly from farmers.
          </p>
        </div>
        <div className="flex w-full md:w-auto items-center space-x-2">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search crops..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vegetable">Vegetable</SelectItem>
              <SelectItem value="fruit">Fruit</SelectItem>
              <SelectItem value="grain">Grain</SelectItem>
              <SelectItem value="legume">Legume</SelectItem>
            </SelectContent>
          </Select>
          <Button>Search</Button>
        </div>
      </div>
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Crop Name</TableHead>
              <TableHead>Farmer</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Price (per kg)</TableHead>
              <TableHead className="text-right">Available (kg)</TableHead>
              <TableHead>Harvest Date</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {crops.map((crop) => (
              <TableRow key={crop.id}>
                <TableCell>
                  <Image
                    src={crop.imageUrl}
                    alt={crop.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                    data-ai-hint={`${crop.type} ${crop.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div>{crop.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {crop.quality} Quality
                  </div>
                </TableCell>
                <TableCell>{crop.farmer}</TableCell>
                <TableCell>{crop.location}</TableCell>
                <TableCell className="text-right">
                  ${crop.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  {crop.quantity.toLocaleString()}
                </TableCell>
                <TableCell>
                  {crop.harvestDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePlaceOrder(crop.name)}
                  >
                    Place Order
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
