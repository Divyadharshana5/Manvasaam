/**
 * Navigation Provider - Initializes navigation optimization
 */

"use client";

import { useEffect } from 'react';
import { useOptimizedNavigation } from '@/lib/navigation-optimizer';

interface NavigationProviderProps {
  children: React.ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const { preloadRoute } = useOptimizedNavigation();

  useEffect(() => {
    // Preload critical routes after initial load
    const preloadTimer = setTimeout(() => {
      // Preload login pages
      preloadRoute('/login/farmer');
      preloadRoute('/login/hub');
      preloadRoute('/login/customer');
      preloadRoute('/login/restaurant');
      
      // Preload dashboard pages based on user type
      const userType = localStorage.getItem('userType');
      if (userType) {
        switch (userType) {
          case 'farmer':
            preloadRoute('/dashboard/farmer');
            preloadRoute('/dashboard/farmer/crops');
            break;
          case 'hub':
            preloadRoute('/dashboard/hub');
            preloadRoute('/dashboard/hub/inventory');
            break;
          case 'customer':
            preloadRoute('/dashboard');
            preloadRoute('/dashboard/products');
            break;
          case 'restaurant':
            preloadRoute('/dashboard/restaurant');
            preloadRoute('/dashboard/restaurant/orders');
            break;
        }
      }
    }, 2000);

    return () => clearTimeout(preloadTimer);
  }, [preloadRoute]);

  return <>{children}</>;
}