import { adminDb } from "@/lib/firebase-admin";
import { 
  Hub, 
  HubInventory, 
  FarmerHubAssignment, 
  HubDelivery, 
  HubOrder, 
  DeliveryPerson,
  StockMovement,
  HubAnalytics,
  CreateHubForm,
  UpdateInventoryForm
} from "@/types/hub";

// Hub Management Functions
export async function createHub(hubData: CreateHubForm & { managerId: string }): Promise<string> {
  const hubRef = adminDb.collection("hubs").doc();
  const branchId = `HUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  const hub: Omit<Hub, 'id'> = {
    branchId,
    ...hubData,
    currentLoad: 0,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await hubRef.set(hub);
  return hubRef.id;
}

export async function getHub(hubId: string): Promise<Hub | null> {
  const hubDoc = await adminDb.collection("hubs").doc(hubId).get();
  if (!hubDoc.exists) return null;
  
  return { id: hubDoc.id, ...hubDoc.data() } as Hub;
}

export async function getHubByBranchId(branchId: string): Promise<Hub | null> {
  const hubQuery = await adminDb.collection("hubs").where("branchId", "==", branchId).limit(1).get();
  if (hubQuery.empty) return null;
  
  const hubDoc = hubQuery.docs[0];
  return { id: hubDoc.id, ...hubDoc.data() } as Hub;
}

export async function getHubByManagerId(managerId: string): Promise<Hub | null> {
  const hubQuery = await adminDb.collection("hubs").where("managerId", "==", managerId).limit(1).get();
  if (hubQuery.empty) return null;
  
  const hubDoc = hubQuery.docs[0];
  return { id: hubDoc.id, ...hubDoc.data() } as Hub;
}

export async function updateHub(hubId: string, updates: Partial<Hub>): Promise<void> {
  await adminDb.collection("hubs").doc(hubId).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function getAllHubs(): Promise<Hub[]> {
  const hubsSnapshot = await adminDb.collection("hubs").orderBy("createdAt", "desc").get();
  return hubsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Hub));
}

// Inventory Management Functions
export async function addInventoryItem(inventoryData: UpdateInventoryForm & { hubId: string; batchId: string }): Promise<string> {
  const inventoryRef = adminDb.collection("hubInventory").doc();
  
  const inventory: Omit<HubInventory, 'id'> = {
    ...inventoryData,
    productId: `PROD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await inventoryRef.set(inventory);
  
  // Update hub current load
  const hub = await getHub(inventoryData.hubId);
  if (hub) {
    await updateHub(inventoryData.hubId, {
      currentLoad: hub.currentLoad + inventoryData.quantity
    });
  }

  // Record stock movement
  await recordStockMovement({
    hubId: inventoryData.hubId,
    inventoryId: inventoryRef.id,
    type: "stock_in",
    quantity: inventoryData.quantity,
    previousQuantity: 0,
    newQuantity: inventoryData.quantity,
    reason: `New stock from farmer ${inventoryData.farmerId}`,
    performedBy: inventoryData.farmerId,
    farmerId: inventoryData.farmerId,
  });

  return inventoryRef.id;
}

export async function getHubInventory(hubId: string, includeAll: boolean = false): Promise<HubInventory[]> {
  let query = adminDb
    .collection("hubInventory")
    .where("hubId", "==", hubId);

  if (!includeAll) {
    query = query.where("status", "in", ["available", "reserved"]);
  }

  const inventorySnapshot = await query.orderBy("createdAt", "desc").get();

  return inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HubInventory));
}

export async function getInventoryItem(inventoryId: string): Promise<HubInventory | null> {
  const inventoryDoc = await adminDb.collection("hubInventory").doc(inventoryId).get();
  if (!inventoryDoc.exists) return null;

  return { id: inventoryDoc.id, ...inventoryDoc.data() } as HubInventory;
}

export async function updateInventoryItem(inventoryId: string, updates: Partial<HubInventory>): Promise<void> {
  await adminDb.collection("hubInventory").doc(inventoryId).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteInventoryItem(inventoryId: string): Promise<void> {
  const inventoryItem = await getInventoryItem(inventoryId);
  if (!inventoryItem) throw new Error("Inventory item not found");

  // Update hub current load
  const hub = await getHub(inventoryItem.hubId);
  if (hub) {
    await updateHub(inventoryItem.hubId, {
      currentLoad: Math.max(0, hub.currentLoad - inventoryItem.quantity)
    });
  }

  // Record stock movement
  await recordStockMovement({
    hubId: inventoryItem.hubId,
    inventoryId,
    type: "stock_out",
    quantity: inventoryItem.quantity,
    previousQuantity: inventoryItem.quantity,
    newQuantity: 0,
    reason: "Item deleted",
    performedBy: "system",
  });

  await adminDb.collection("hubInventory").doc(inventoryId).delete();
}

export async function searchInventory(hubId: string, searchTerm: string, filters?: {
  category?: string;
  status?: string;
  quality?: string;
  farmerId?: string;
}): Promise<HubInventory[]> {
  let query = adminDb
    .collection("hubInventory")
    .where("hubId", "==", hubId);

  // Apply filters
  if (filters?.category) {
    query = query.where("category", "==", filters.category);
  }
  if (filters?.status) {
    query = query.where("status", "==", filters.status);
  }
  if (filters?.quality) {
    query = query.where("quality", "==", filters.quality);
  }
  if (filters?.farmerId) {
    query = query.where("farmerId", "==", filters.farmerId);
  }

  const inventorySnapshot = await query.orderBy("createdAt", "desc").get();
  const inventory = inventorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HubInventory));

  // Filter by search term (product name)
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    return inventory.filter(item =>
      item.productName.toLowerCase().includes(searchLower) ||
      item.farmerName.toLowerCase().includes(searchLower) ||
      item.batchId.toLowerCase().includes(searchLower)
    );
  }

  return inventory;
}

export async function updateInventoryQuantity(inventoryId: string, newQuantity: number, reason: string, performedBy: string): Promise<void> {
  const inventoryDoc = await adminDb.collection("hubInventory").doc(inventoryId).get();
  if (!inventoryDoc.exists) throw new Error("Inventory item not found");
  
  const inventory = inventoryDoc.data() as HubInventory;
  const previousQuantity = inventory.quantity;
  
  await adminDb.collection("hubInventory").doc(inventoryId).update({
    quantity: newQuantity,
    updatedAt: new Date().toISOString(),
  });

  // Record stock movement
  await recordStockMovement({
    hubId: inventory.hubId,
    inventoryId,
    type: newQuantity > previousQuantity ? "stock_in" : "stock_out",
    quantity: Math.abs(newQuantity - previousQuantity),
    previousQuantity,
    newQuantity,
    reason,
    performedBy,
  });

  // Update hub current load
  const hub = await getHub(inventory.hubId);
  if (hub) {
    const loadDifference = newQuantity - previousQuantity;
    await updateHub(inventory.hubId, {
      currentLoad: hub.currentLoad + loadDifference
    });
  }
}

// Farmer-Hub Assignment Functions
export async function assignFarmerToHub(farmerId: string, hubId: string, distance: number, assignmentType: "auto" | "manual" = "auto"): Promise<string> {
  // Check if assignment already exists
  const existingAssignment = await adminDb
    .collection("farmerHubAssignments")
    .where("farmerId", "==", farmerId)
    .where("isActive", "==", true)
    .limit(1)
    .get();

  if (!existingAssignment.empty) {
    // Update existing assignment
    const assignmentDoc = existingAssignment.docs[0];
    await assignmentDoc.ref.update({
      hubId,
      distance,
      assignmentType,
      updatedAt: new Date().toISOString(),
    });
    return assignmentDoc.id;
  }

  // Create new assignment
  const assignmentRef = adminDb.collection("farmerHubAssignments").doc();
  const assignment: Omit<FarmerHubAssignment, 'id'> = {
    farmerId,
    hubId,
    assignmentType,
    distance,
    isActive: true,
    assignedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await assignmentRef.set(assignment);
  return assignmentRef.id;
}

export async function getFarmerHub(farmerId: string): Promise<Hub | null> {
  const assignmentQuery = await adminDb
    .collection("farmerHubAssignments")
    .where("farmerId", "==", farmerId)
    .where("isActive", "==", true)
    .limit(1)
    .get();

  if (assignmentQuery.empty) return null;

  const assignment = assignmentQuery.docs[0].data() as FarmerHubAssignment;
  return await getHub(assignment.hubId);
}

export async function getHubFarmers(hubId: string): Promise<string[]> {
  const assignmentsSnapshot = await adminDb
    .collection("farmerHubAssignments")
    .where("hubId", "==", hubId)
    .where("isActive", "==", true)
    .get();

  return assignmentsSnapshot.docs.map(doc => doc.data().farmerId);
}

// Auto-assignment based on location
export async function autoAssignFarmerToNearestHub(farmerId: string, farmerLocation: { latitude: number; longitude: number }): Promise<string | null> {
  const hubs = await getAllHubs();
  
  let nearestHub: Hub | null = null;
  let minDistance = Infinity;

  for (const hub of hubs) {
    if (hub.coordinates && hub.status === "active") {
      const distance = calculateDistance(
        farmerLocation.latitude,
        farmerLocation.longitude,
        hub.coordinates.latitude,
        hub.coordinates.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestHub = hub;
      }
    }
  }

  if (nearestHub) {
    return await assignFarmerToHub(farmerId, nearestHub.id, minDistance, "auto");
  }

  return null;
}

// Utility function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Stock Movement Tracking
export async function recordStockMovement(movement: Omit<StockMovement, 'id' | 'createdAt'>): Promise<string> {
  const movementRef = adminDb.collection("stockMovements").doc();
  
  const stockMovement: Omit<StockMovement, 'id'> = {
    ...movement,
    createdAt: new Date().toISOString(),
  };

  await movementRef.set(stockMovement);
  return movementRef.id;
}

export async function getStockMovements(hubId: string, limit: number = 50): Promise<StockMovement[]> {
  const movementsSnapshot = await adminDb
    .collection("stockMovements")
    .where("hubId", "==", hubId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return movementsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StockMovement));
}

// Hub Statistics
export async function getHubStats(hubId: string) {
  const [inventory, orders, deliveries, farmers] = await Promise.all([
    getHubInventory(hubId),
    getHubOrders(hubId),
    getHubDeliveries(hubId),
    getHubFarmers(hubId)
  ]);

  const totalInventory = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const inventoryValue = inventory.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0);
  const pendingDeliveries = deliveries.filter(d => d.status === "pending" || d.status === "assigned").length;
  const activeOrders = orders.filter(o => ["pending", "confirmed", "preparing", "ready"].includes(o.orderStatus)).length;
  
  // Calculate monthly revenue (current month)
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyRevenue = orders
    .filter(o => o.createdAt.startsWith(currentMonth) && o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return {
    totalInventory,
    pendingDeliveries,
    activeOrders,
    connectedFarmers: farmers.length,
    monthlyRevenue,
    inventoryValue,
    deliverySuccess: 98.5, // This would be calculated from actual delivery data
    avgDeliveryTime: "2.3 hours" // This would be calculated from actual delivery data
  };
}

// Customer-Hub Integration Functions
export async function findNearestHubWithStock(
  customerLocation: { latitude: number; longitude: number },
  requiredItems: { productName: string; quantity: number }[]
): Promise<{ hub: Hub; availableItems: HubInventory[] } | null> {
  const hubs = await getAllHubs();
  const activeHubs = hubs.filter(hub => hub.status === "active" && hub.coordinates);

  let bestMatch: { hub: Hub; availableItems: HubInventory[]; distance: number } | null = null;

  for (const hub of activeHubs) {
    if (!hub.coordinates) continue;

    const distance = calculateDistance(
      customerLocation.latitude,
      customerLocation.longitude,
      hub.coordinates.latitude,
      hub.coordinates.longitude
    );

    // Get hub inventory
    const inventory = await getHubInventory(hub.id);
    const availableItems: HubInventory[] = [];

    // Check if hub has required items in stock
    for (const requiredItem of requiredItems) {
      const inventoryItem = inventory.find(item =>
        item.productName.toLowerCase() === requiredItem.productName.toLowerCase() &&
        item.status === "available" &&
        item.quantity >= requiredItem.quantity
      );

      if (inventoryItem) {
        availableItems.push(inventoryItem);
      }
    }

    // If hub has all required items or this is the closest hub so far
    if (availableItems.length > 0 && (!bestMatch || distance < bestMatch.distance)) {
      bestMatch = { hub, availableItems, distance };
    }
  }

  return bestMatch ? { hub: bestMatch.hub, availableItems: bestMatch.availableItems } : null;
}

export async function checkProductAvailability(
  productName: string,
  quantity: number,
  customerLocation?: { latitude: number; longitude: number }
): Promise<{ hub: Hub; item: HubInventory; distance?: number }[]> {
  const hubs = await getAllHubs();
  const activeHubs = hubs.filter(hub => hub.status === "active");
  const availableOptions: { hub: Hub; item: HubInventory; distance?: number }[] = [];

  for (const hub of activeHubs) {
    const inventory = await getHubInventory(hub.id);
    const availableItem = inventory.find(item =>
      item.productName.toLowerCase() === productName.toLowerCase() &&
      item.status === "available" &&
      item.quantity >= quantity
    );

    if (availableItem) {
      let distance: number | undefined;
      if (customerLocation && hub.coordinates) {
        distance = calculateDistance(
          customerLocation.latitude,
          customerLocation.longitude,
          hub.coordinates.latitude,
          hub.coordinates.longitude
        );
      }

      availableOptions.push({ hub, item: availableItem, distance });
    }
  }

  // Sort by distance if location is provided
  if (customerLocation) {
    availableOptions.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  return availableOptions;
}

export async function reserveInventoryItems(
  items: { inventoryId: string; quantity: number }[],
  customerId: string,
  orderId: string
): Promise<void> {
  for (const item of items) {
    const inventoryItem = await getInventoryItem(item.inventoryId);
    if (!inventoryItem) {
      throw new Error(`Inventory item ${item.inventoryId} not found`);
    }

    if (inventoryItem.quantity < item.quantity) {
      throw new Error(`Insufficient stock for ${inventoryItem.productName}`);
    }

    // Update inventory status to reserved and reduce quantity
    await updateInventoryQuantity(
      item.inventoryId,
      inventoryItem.quantity - item.quantity,
      `Reserved for order ${orderId}`,
      customerId
    );

    // You might also want to create a separate reservation record
    // This is a simplified approach
  }
}

export async function createHubOrder(orderData: Omit<HubOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const orderRef = adminDb.collection("hubOrders").doc();

  const order: Omit<HubOrder, 'id'> = {
    ...orderData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await orderRef.set(order);
  return orderRef.id;
}

export async function getHubOrders(hubId: string, filters?: {
  status?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<HubOrder[]> {
  let query = adminDb
    .collection("hubOrders")
    .where("hubId", "==", hubId);

  if (filters?.status) {
    query = query.where("orderStatus", "==", filters.status);
  }
  if (filters?.customerId) {
    query = query.where("customerId", "==", filters.customerId);
  }

  const ordersSnapshot = await query.orderBy("createdAt", "desc").get();
  let orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HubOrder));

  // Filter by date range if provided
  if (filters?.dateFrom || filters?.dateTo) {
    orders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (filters.dateFrom && orderDate < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && orderDate > new Date(filters.dateTo)) return false;
      return true;
    });
  }

  return orders;
}

export async function updateHubOrder(orderId: string, updates: Partial<HubOrder>): Promise<void> {
  await adminDb.collection("hubOrders").doc(orderId).update({
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

export async function getHubDeliveries(hubId: string, filters?: {
  status?: string;
  deliveryPersonId?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<HubDelivery[]> {
  let query = adminDb
    .collection("hubDeliveries")
    .where("hubId", "==", hubId);

  if (filters?.status) {
    query = query.where("status", "==", filters.status);
  }
  if (filters?.deliveryPersonId) {
    query = query.where("deliveryPersonId", "==", filters.deliveryPersonId);
  }

  const deliveriesSnapshot = await query.orderBy("createdAt", "desc").get();
  let deliveries = deliveriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HubDelivery));

  // Filter by date range if provided
  if (filters?.dateFrom || filters?.dateTo) {
    deliveries = deliveries.filter(delivery => {
      const deliveryDate = new Date(delivery.createdAt);
      if (filters.dateFrom && deliveryDate < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && deliveryDate > new Date(filters.dateTo)) return false;
      return true;
    });
  }

  return deliveries;
}
