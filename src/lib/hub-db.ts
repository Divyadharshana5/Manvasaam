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

export interface AddInventoryItemData {
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
}

// Mock data for when Firebase is not initialized
const mockHubs: Hub[] = [
  {
    id: "hub1",
    branchName: "Green Valley Hub",
    location: "Bangalore North",
    status: "active",
    createdAt: new Date().toISOString(),
    capacity: 1000,
    currentLoad: 450
  },
  {
    id: "hub2",
    branchName: "Fresh Farm Hub",
    location: "Chennai Central",
    status: "active",
    createdAt: new Date().toISOString(),
    capacity: 800,
    currentLoad: 320
  },
  {
    id: "hub3",
    branchName: "Organic Harvest Hub",
    location: "Hyderabad West",
    status: "active",
    createdAt: new Date().toISOString(),
    capacity: 1200,
    currentLoad: 680
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
  },
  {
    id: "inv2",
    hubId: "hub1",
    productName: "Fresh Spinach",
    category: "vegetables",
    quantity: 15,
    unit: "kg",
    pricePerUnit: 60,
    farmerId: "farmer2",
    farmerName: "Priya Sharma",
    harvestDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quality: "standard",
    batchId: "BATCH-002",
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "inv3",
    hubId: "hub2",
    productName: "Basmati Rice",
    category: "grains",
    quantity: 50,
    unit: "kg",
    pricePerUnit: 120,
    farmerId: "farmer3",
    farmerName: "Suresh Patel",
    harvestDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quality: "premium",
    batchId: "BATCH-003",
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Get all hubs from the database
 */
export async function getAllHubs(): Promise<Hub[]> {
  if (!isFirebaseInitialized) {
    return mockHubs;
  }

  try {
    if (!adminDb) {
      return mockHubs;
    }
    
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
    return mockHubs; // Fallback to mock data
  }
}

/**
 * Get inventory for a specific hub
 */
export async function getHubInventory(hubId: string, includeAll: boolean = true): Promise<InventoryItem[]> {
  if (!isFirebaseInitialized) {
    return mockInventory.filter(item => item.hubId === hubId);
  }

  try {
    if (!adminDb) {
      return mockInventory.filter(item => item.hubId === hubId);
    }
    
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
    return mockInventory.filter(item => item.hubId === hubId); // Fallback to mock data
  }
}

/**
 * Add a new inventory item
 */
export async function addInventoryItem(data: AddInventoryItemData): Promise<string> {
  if (!isFirebaseInitialized) {
    const mockId = `inv-${Date.now()}`;
    const newItem: InventoryItem = {
      id: mockId,
      ...data,
      status: "available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockInventory.push(newItem);
    return mockId;
  }

  try {
    if (!adminDb) {
      const mockId = `inv-${Date.now()}`;
      const newItem: InventoryItem = {
        id: mockId,
        ...data,
        status: "available",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockInventory.push(newItem);
      return mockId;
    }
    
    const inventoryItem: Omit<InventoryItem, 'id'> = {
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

/**
 * Get the hub assigned to a farmer
 */
export async function getFarmerHub(farmerId: string): Promise<Hub | null> {
  if (!isFirebaseInitialized) {
    // Return first hub as mock assignment
    return mockHubs[0];
  }

  try {
    if (!adminDb) {
      return mockHubs[0];
    }
    
    // First, get the farmer's hub assignment
    const farmerDoc = await adminDb.collection('farmers').doc(farmerId).get();
    
    if (!farmerDoc.exists) {
      return null;
    }
    
    const farmerData = farmerDoc.data();
    const hubId = farmerData?.hubId;
    
    if (!hubId) {
      return null;
    }
    
    // Get the hub details
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
    return mockHubs[0]; // Fallback to mock data
  }
}

/**
 * Update inventory item status
 */
export async function updateInventoryItemStatus(itemId: string, status: InventoryItem['status']): Promise<void> {
  if (!isFirebaseInitialized) {
    const item = mockInventory.find(i => i.id === itemId);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
    }
    return;
  }

  try {
    if (!adminDb) {
      const item = mockInventory.find(i => i.id === itemId);
      if (item) {
        item.status = status;
        item.updatedAt = new Date().toISOString();
      }
      return;
    }
    
    await adminDb.collection('inventory').doc(itemId).update({
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating inventory item status:', error);
    throw error;
  }
}

/**
 * Get inventory items by farmer ID
 */
export async function getFarmerInventory(farmerId: string): Promise<InventoryItem[]> {
  if (!isFirebaseInitialized) {
    return mockInventory.filter(item => item.farmerId === farmerId);
  }

  try {
    if (!adminDb) {
      return mockInventory.filter(item => item.farmerId === farmerId);
    }
    
    const inventorySnapshot = await adminDb.collection('inventory')
      .where('farmerId', '==', farmerId)
      .get();
    
    const inventory: InventoryItem[] = [];
    
    inventorySnapshot.forEach((doc: any) => {
      inventory.push({
        id: doc.id,
        ...doc.data()
      } as InventoryItem);
    });
    
    return inventory;
  } catch (error) {
    console.error('Error fetching farmer inventory:', error);
    return mockInventory.filter(item => item.farmerId === farmerId); // Fallback to mock data
  }
}