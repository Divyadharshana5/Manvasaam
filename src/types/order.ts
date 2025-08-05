export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }
  
  export interface Customer {
    name: string;
    email: string;
  }
  
  export interface Order {
    id: string;
    customer: Customer;
    date: string;
    status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
    total: number;
    items: OrderItem[];
  }
  