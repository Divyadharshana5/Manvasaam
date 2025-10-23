import { db } from './firebase-admin';

export interface Hub {
  id: string;
  branchName: string;
  location: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  quality: string;
  farmerName: string;
  status: 'available' | 'sold' | 'expired';
  harvestDate?: string;
  expiryDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAllHubs(): Promise<Hub[]> {
  try {
    const hubsRef = db.collection('hubs');
    const snapshot = await hubsRef.get();
    
    const hubs: Hub[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      hubs.push({
        id: doc.id,
        branchName: data.branchName || '',
        location: data.location || '',
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    return hubs;
  } catch (error) {
    console.error('Error fetching hubs:', error);
    return [];
  }
}

export async function getHubInventory(hubId: string, includeAll: boolean = true): Promise<InventoryItem[]> {
  try {
    let inventoryRef = db.collection('hubs').doc(hubId).collection('inventory');
    
    if (!includeAll) {
      inventoryRef = inventoryRef.where('status', '==', 'available') as any;
    }
    
    const snapshot = await inventoryRef.get();
    
    const inventory: InventoryItem[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      inventory.push({
        id: doc.id,
        productName: data.productName || '',
        category: data.category || '',
        quantity: data.quantity || 0,
        unit: data.unit || '',
        pricePerUnit: data.pricePerUnit || 0,
        quality: data.quality || '',
        farmerName: data.farmerName || '',
        status: data.status || 'available',
        harvestDate: data.harvestDate,
        expiryDate: data.expiryDate,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    return inventory;
  } catch (error) {
    console.error(`Error fetching inventory for hub ${hubId}:`, error);
    return [];
  }
}

export async function getHubById(hubId: string): Promise<Hub | null> {
  try {
    const hubRef = db.collection('hubs').doc(hubId);
    const doc = await hubRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = doc.data()!;
    return {
      id: doc.id,
      branchName: data.branchName || '',
      location: data.location || '',
      status: data.status || 'active',
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  } catch (error) {
    console.error(`Error fetching hub ${hubId}:`, error);
    return null;
  }
}