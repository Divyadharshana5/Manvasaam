export type UserRole = "farmer" | "buyer" | "transporter";

export interface Crop {
  id: string;
  name: string;
  type: "Vegetable" | "Fruit" | "Grain" | "Legume";
  farmer: string;
  location: string;
  quantity: number; // in kg
  price: number; // per kg
  harvestDate: Date;
  imageUrl: string;
  quality: "Premium" | "Standard" | "Basic";
}

export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "In Transit"
  | "Delivered"
  | "Cancelled";

export interface LogisticsUpdate {
  timestamp: Date | any; // Allow for server timestamp
  status: OrderStatus;
  location: string;
  notes: string;
}

export interface Order {
  id: string;
  crop: Crop;
  buyer: string;
  buyerId: string;
  quantity: number;
  totalPrice: number;
  orderDate: Date | any; // Allow for server timestamp
  status: OrderStatus;
  transporter?: string;
  logistics: LogisticsUpdate[];
}
