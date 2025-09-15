"use client";

import { FastNavButton } from "@/components/ui/fast-nav-button";
import { useInstantNav } from "@/hooks/use-instant-nav";

export function FastNavExample() {
  const { navigate } = useInstantNav();

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Fast Navigation Examples</h2>
      
      {/* Method 1: Using FastNavButton component */}
      <div className="space-y-2">
        <h3 className="font-semibold">Using FastNavButton:</h3>
        <FastNavButton 
          href="/dashboard/farmer"
          preloadNext={["/dashboard/farmer/products", "/dashboard/farmer/orders"]}
        >
          Go to Farmer Dashboard
        </FastNavButton>
        
        <FastNavButton 
          href="/dashboard/hub"
          preloadNext={["/dashboard/hub/inventory"]}
          variant="outline"
        >
          Go to Hub Dashboard
        </FastNavButton>
      </div>

      {/* Method 2: Using useInstantNav hook */}
      <div className="space-y-2">
        <h3 className="font-semibold">Using useInstantNav hook:</h3>
        <button 
          onClick={() => navigate("/dashboard/customer")}
          className="fast-button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Customer Dashboard (Instant)
        </button>
        
        <button 
          onClick={() => navigate("/dashboard/restaurant")}
          className="fast-button px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Restaurant Dashboard (Instant)
        </button>
      </div>
    </div>
  );
}