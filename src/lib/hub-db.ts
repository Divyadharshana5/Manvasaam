import { adminDb, isFirebaseInitialized } from "@/lib/firebase-admin";

// Types
export interface Hub {
  id: string;
  branchName: string;
  location: string;
  status: "active" | "inactive";
  createdAt: string;
  managerId?: string;
  capacity?: number;
  currentLoad?: number;
}

export interface InventoryItem {
  id: string;
  hubId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  farmerId: string;
  farmerName: string;
  harvestDate: string;
  expiryDate: string;
  quality: "premium" | "standard" | "basic";
  batchId: string;
  status: "available" | "reserved" | "sold" | "expired";
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockHubs: Hub[] = [
  {
    id: "hub1",
    branchName: "Green Valley Hub",
    location: "Bangalore North",
    status: "active",
    createdAt: new Date().toISOString(),
    capacity: 1000,
    currentLoad: 450
  }
];

const mockInventory: InventoryItem[] = [
  {
    id: "inv1",
    hubId: "hub1",
    productName: "Organic Tomatoes",
    category: "vegetables",
    quantity: 25,
    unit: "kg",
    pricePerUnit: 80,
    farmerId: "farmer1",
    farmerName: "Ravi Kumar",
    harvestDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quality: "premium",
    batchId: "BATCH-001",
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Get all hubs from the database
 */
export async function getAllHubs(): Promise<Hub[]> {
  if (!isFirebaseInitialized || !adminDb) {
    return mockHubs;
  }

  try {
    const hubsSnapshot = await adminDb.collection('hubs').get();
    const hubs: Hub[] = [];
    
    hubsSnapshot.forEach((doc: any) => {
      hubs.push({
        id: doc.id,
        ...doc.data()
      } as Hub);
    });
    
    return hubs;
  } catch (error) {
    console.error('Error fetching hubs:', error);
    return mockHubs;
  }
}

/**
 * Get inventory for a specific hub
 */
export async function getHubInventory(hubId: string, includeAll: boolean = true): Promise<InventoryItem[]> {
  if (!isFirebaseInitialized || !adminDb) {
    return mockInventory.filter(item => item.hubId === hubId);
  }

  try {
    let query = adminDb.collection('inventory').where('hubId', '==', hubId);
    
    if (!includeAll) {
      query = query.where('status', '==', 'available');
    }
    
    const inventorySnapshot = await query.get();
    const inventory: InventoryItem[] = [];
    
    inventorySnapshot.forEach((doc: any) => {
      inventory.push({
        id: doc.id,
        ...doc.data()
      } as InventoryItem);
    });
    
    return inventory;
  } catch (error) {
    console.error('Error fetching hub inventory:', error);
    return mockInventory.filter(item => item.hubId === hubId);
  }
}

/**
 * Get the hub assigned to a farmer
 */
export async function getFarmerHub(farmerId: string): Promise<Hub | null> {
  if (!isFirebaseInitialized || !adminDb) {
    return mockHubs[0];
  }

  try {
    const farmerDoc = await adminDb.collection('farmers').doc(farmerId).get();
    
    if (!farmerDoc.exists) {
      return null;
    }
    
    const farmerData = farmerDoc.data();
    const hubId = farmerData?.hubId;
    
    if (!hubId) {
      return null;
    }
    
    const hubDoc = await adminDb.collection('hubs').doc(hubId).get();
    
    if (!hubDoc.exists) {
      return null;
    }
    
    return {
      id: hubDoc.id,
      ...hubDoc.data()
    } as Hub;
  } catch (error) {
    console.error('Error fetching farmer hub:', error);
    return mockHubs[0];
  }
}

/**
 * Add a new inventory item
 */
export async function addInventoryItem(data: any): Promise<string> {
  if (!isFirebaseInitialized || !adminDb) {
    const mockId = `inv-${Date.now()}`;
    return mockId;
  }

  try {
    const inventoryItem = {
      ...data,
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await adminDb.collection('inventory').add(inventoryItem);
    return docRef.id;
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
}