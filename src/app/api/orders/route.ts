import { NextResponse } from "next/server";
import type { Order } from "@/types/order";

const mockOrders: Order[] = [
  {
    id: "ORD001",
    customer: { name: "John Doe", email: "john.doe@example.com" },
    date: "2024-07-20T10:30:00Z",
    status: "Delivered",
    total: 150.75,
    items: [
      { id: "PROD01", name: "Organic Tomatoes", quantity: 2, price: 5.5 },
      { id: "PROD05", name: "Fresh Spinach", quantity: 1, price: 3.25 },
    ],
  },
  {
    id: "ORD002",
    customer: { name: "Jane Smith", email: "jane.smith@example.com" },
    date: "2024-07-19T14:00:00Z",
    status: "Shipped",
    total: 85.5,
    items: [{ id: "PROD02", name: "Free-range Eggs", quantity: 2, price: 4.75 }],
  },
  {
    id: "ORD003",
    customer: { name: "Alice Johnson", email: "alice.j@example.com" },
    date: "2024-07-19T11:45:00Z",
    status: "Processing",
    total: 210.0,
    items: [
      { id: "PROD10", name: "Artisanal Honey", quantity: 1, price: 12.0 },
      { id: "PROD03", name: "Whole Wheat Bread", quantity: 3, price: 6.0 },
    ],
  },
  {
    id: "ORD004",
    customer: { name: "Robert Brown", email: "robert.b@example.com" },
    date: "2024-07-18T09:00:00Z",
    status: "Cancelled",
    total: 45.2,
    items: [{ id: "PROD07", name: "Organic Apples", quantity: 4, price: 1.8 }],
  },
  {
    id: "ORD005",
    customer: { name: "Emily Davis", email: "emily.d@example.com" },
    date: "2024-07-21T16:20:00Z",
    status: "Processing",
    total: 99.99,
    items: [
      { id: "PROD01", name: "Organic Tomatoes", quantity: 5, price: 5.5 },
      { id: "PROD04", name: "Goat Cheese", quantity: 1, price: 8.99 },
    ],
  },
];

export async function GET() {
  // In a real application, you would fetch this data from your database.
  // For now, we'll simulate a network delay.
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return NextResponse.json(mockOrders);
}
