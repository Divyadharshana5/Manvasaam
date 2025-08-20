// Hub Management System Types

export interface Hub {
  id: string;
  branchId: string;
  branchName: string;
  location: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  managerId: string; // User ID of the hub manager
  capacity: number; // Maximum storage capacity in kg
  currentLoad: number; // Current storage load in kg
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  operatingHours: {
    open: string; // "09:00"
    close: string; // "18:00"
  };
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
  updatedAt: string;
}

export interface HubInventory {
  id: string;
  hubId: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: "kg" | "pieces" | "liters";
  pricePerUnit: number;
  farmerId: string;
  farmerName: string;
  harvestDate: string;
  expiryDate: string;
  quality: "premium" | "standard" | "economy";
  status: "available" | "reserved" | "sold" | "expired";
  batchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerHubAssignment {
  id: string;
  farmerId: string;
  hubId: string;
  assignmentType: "auto" | "manual";
  distance: number; // in kilometers
  isActive: boolean;
  assignedAt: string;
  updatedAt: string;
}

export interface HubDelivery {
  id: string;
  hubId: string;
  orderId: string;
  customerId: string;
  deliveryPersonId?: string;
  deliveryAddress: string;
  items: HubDeliveryItem[];
  totalAmount: number;
  status: "pending" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled";
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  trackingNumber: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HubDeliveryItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  inventoryId: string;
}

export interface DeliveryPerson {
  id: string;
  userId: string; // Reference to user account
  hubId: string;
  name: string;
  phone: string;
  vehicleType: "bike" | "auto" | "van";
  vehicleNumber: string;
  licenseNumber: string;
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  totalDeliveries: number;
  status: "active" | "inactive" | "on_delivery";
  createdAt: string;
  updatedAt: string;
}

export interface HubOrder {
  id: string;
  hubId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: HubOrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cash" | "card" | "upi" | "wallet";
  orderStatus: "pending" | "confirmed" | "preparing" | "ready" | "dispatched" | "delivered" | "cancelled";
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  deliveryId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HubOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  inventoryId: string;
  farmerId: string;
  farmerName: string;
}

export interface HubAnalytics {
  hubId: string;
  date: string; // YYYY-MM-DD
  totalOrders: number;
  totalRevenue: number;
  totalDeliveries: number;
  averageDeliveryTime: number; // in minutes
  inventoryTurnover: number;
  farmerSupplies: number;
  customerSatisfaction: number;
  operationalCosts: number;
  profitMargin: number;
}

export interface StockMovement {
  id: string;
  hubId: string;
  inventoryId: string;
  type: "stock_in" | "stock_out" | "adjustment" | "expired" | "damaged";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  performedBy: string; // User ID
  orderId?: string; // If related to an order
  farmerId?: string; // If related to farmer supply
  createdAt: string;
}

// API Response Types
export interface HubStatsResponse {
  totalInventory: number;
  pendingDeliveries: number;
  activeOrders: number;
  connectedFarmers: number;
  monthlyRevenue: number;
  inventoryValue: number;
  deliverySuccess: number;
  avgDeliveryTime: string;
}

export interface HubActivityResponse {
  id: number;
  type: "stock_in" | "order_out" | "stock_low" | "farmer_connect" | "delivery_complete";
  message: string;
  timestamp: string;
  status: "completed" | "in_transit" | "warning" | "pending";
}

// Form Types
export interface CreateHubForm {
  branchName: string;
  location: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  capacity: number;
  operatingHours: {
    open: string;
    close: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface UpdateInventoryForm {
  productName: string;
  category: string;
  quantity: number;
  unit: "kg" | "pieces" | "liters";
  pricePerUnit: number;
  harvestDate: string;
  expiryDate: string;
  quality: "premium" | "standard" | "economy";
  farmerId: string;
}

export interface AssignDeliveryForm {
  deliveryPersonId: string;
  estimatedDeliveryTime: string;
  notes?: string;
}

// Filter and Search Types
export interface HubInventoryFilters {
  category?: string;
  farmerId?: string;
  status?: string;
  quality?: string;
  expiryDateFrom?: string;
  expiryDateTo?: string;
  search?: string;
}

export interface HubOrderFilters {
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  customerId?: string;
  search?: string;
}

export interface DeliveryFilters {
  status?: string;
  deliveryPersonId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
