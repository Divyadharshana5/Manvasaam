export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface Buyer {
    name: string;
    email: string;
    type: 'retail' | 'transport';
  }
  
  export interface Order {
    id: string;
    buyer: Buyer;
    date: string;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    total: number;
    items: OrderItem[];
  }
  