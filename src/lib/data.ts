import type { Crop, Order, OrderStatus } from "./types";

export const mockCrops: Crop[] = [
  {
    id: "CROP001",
    name: "Organic Tomatoes",
    type: "Vegetable",
    farmer: "Green Valley Farms",
    location: "Fresno, CA",
    quantity: 500,
    price: 2.5,
    harvestDate: new Date("2024-08-15"),
    imageUrl: "https://placehold.co/600x400.png",
    quality: "Premium",
  },
  {
    id: "CROP002",
    name: "Sweet Corn",
    type: "Vegetable",
    farmer: "Sunshine Acres",
    location: "Ames, IA",
    quantity: 1000,
    price: 0.5,
    harvestDate: new Date("2024-08-20"),
    imageUrl: "https://placehold.co/600x400.png",
    quality: "Standard",
  },
  {
    id: "CROP003",
    name: "Honeycrisp Apples",
    type: "Fruit",
    farmer: "Orchard Hill",
    location: "Yakima, WA",
    quantity: 800,
    price: 3.0,
    harvestDate: new Date("2024-09-01"),
    imageUrl: "https://placehold.co/600x400.png",
    quality: "Premium",
  },
  {
    id: "CROP004",
    name: "Hard Red Wheat",
    type: "Grain",
    farmer: "Plains Grain Co.",
    location: "Salina, KS",
    quantity: 10000,
    price: 0.2,
    harvestDate: new Date("2024-07-30"),
    imageUrl: "https://placehold.co/600x400.png",
    quality: "Standard",
  },
  {
    id: "CROP005",
    name: "Black Beans",
    type: "Legume",
    farmer: "Rio Grande Organics",
    location: "McAllen, TX",
    quantity: 2000,
    price: 1.8,
    harvestDate: new Date("2024-09-10"),
    imageUrl: "https://placehold.co/600x400.png",
    quality: "Standard",
  },
  {
    id: "CROP006",
    name: "Hass Avocados",
    type: "Fruit",
    farmer: "Green Valley Farms",
    location: "Fresno, CA",
    quantity: 1200,
    price: 1.75,
    harvestDate: new Date("2024-08-25"),
    imageUrl: "https://placehold.co/600x400.png",
    quality: "Premium",
  },
];

const generateLogistics = (status: OrderStatus, orderDate: Date) => {
    const logs = [{
        timestamp: orderDate,
        status: "Pending" as OrderStatus,
        location: "Warehouse",
        notes: "Order created by buyer."
    }];
    if(status === 'Accepted' || status === 'In Transit' || status === 'Delivered'){
        logs.push({
            timestamp: new Date(orderDate.getTime() + 1 * 60 * 60 * 1000),
            status: "Accepted" as OrderStatus,
            location: "Farmer's Location",
            notes: "Farmer has accepted the order."
        })
    }
     if(status === 'In Transit' || status === 'Delivered'){
        logs.push({
            timestamp: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000),
            status: "In Transit" as OrderStatus,
            location: "On the way",
            notes: "Transporter has picked up the shipment."
        })
    }
     if(status === 'Delivered'){
        logs.push({
            timestamp: new Date(orderDate.getTime() + 10 * 60 * 60 * 1000),
            status: "Delivered" as OrderStatus,
            location: "Buyer's Location",
            notes: "Shipment has been delivered."
        })
    }
    return logs;
}


export const mockOrders: Order[] = [
  {
    id: "ORD001",
    crop: mockCrops[0],
    buyer: "FreshMart Inc.",
    quantity: 100,
    totalPrice: 250,
    orderDate: new Date("2024-08-01"),
    status: "Delivered",
    transporter: "Speedy Logistics",
    logistics: generateLogistics("Delivered", new Date("2024-08-01")),
  },
  {
    id: "ORD002",
    crop: mockCrops[2],
    buyer: "Whole Foods",
    quantity: 200,
    totalPrice: 600,
    orderDate: new Date("2024-08-05"),
    status: "In Transit",
    transporter: "Reliable Freight",
    logistics: generateLogistics("In Transit", new Date("2024-08-05")),

  },
  {
    id: "ORD003",
    crop: mockCrops[3],
    buyer: "General Mills",
    quantity: 5000,
    totalPrice: 1000,
    orderDate: new Date("2024-07-20"),
    status: "Accepted",
    transporter: "Pending Assignment",
    logistics: generateLogistics("Accepted", new Date("2024-07-20")),
  },
    {
    id: "ORD004",
    crop: mockCrops[1],
    buyer: "Local Grocer",
    quantity: 50,
    totalPrice: 25,
    orderDate: new Date("2024-08-10"),
    status: "Pending",
    transporter: "N/A",
    logistics: generateLogistics("Pending", new Date("2024-08-10")),
  },
  {
    id: "ORD005",
    crop: mockCrops[4],
    buyer: "Goya Foods",
    quantity: 1000,
    totalPrice: 1800,
    orderDate: new Date("2024-07-15"),
    status: "Cancelled",
    transporter: "N/A",
    logistics: [
      ...generateLogistics("Accepted", new Date("2024-07-15")),
      { timestamp: new Date("2024-07-16"), status: "Cancelled", location: "System", notes: "Buyer cancelled the order."}
    ],
  },
];
