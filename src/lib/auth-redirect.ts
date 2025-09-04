/**
 * Authentication redirect utility
 * Handles automatic redirection to appropriate dashboards based on user type
 */

export type UserType = 'farmer' | 'customer' | 'hub' | 'restaurant';

/**
 * Get the dashboard route for a specific user type
 */
export function getDashboardRoute(userType: UserType): string {
  const routes: Record<UserType, string> = {
    farmer: '/dashboard/farmer',
    customer: '/dashboard/customer',
    hub: '/dashboard/hub',
    restaurant: '/dashboard/restaurant'
  };
  
  return routes[userType] || '/dashboard';
}

/**
 * Redirect user to their appropriate dashboard
 */
export function redirectToDashboard(userType: UserType, router: any) {
  const route = getDashboardRoute(userType);
  
  // Store user type in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('userType', userType);
  }
  
  // Redirect to the appropriate dashboard
  router.push(route);
}

/**
 * Get user type from various sources (localStorage, URL, etc.)
 */
export function getUserType(): UserType | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from localStorage first
  const storedType = localStorage.getItem('userType') as UserType;
  if (storedType && ['farmer', 'customer', 'hub', 'restaurant'].includes(storedType)) {
    return storedType;
  }
  
  // Try to infer from current URL
  const path = window.location.pathname;
  if (path.includes('/farmer')) return 'farmer';
  if (path.includes('/customer')) return 'customer';
  if (path.includes('/hub')) return 'hub';
  if (path.includes('/restaurant')) return 'restaurant';
  
  return null;
}

/**
 * Clear stored user type (for logout)
 */
export function clearUserType() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userType');
  }
}