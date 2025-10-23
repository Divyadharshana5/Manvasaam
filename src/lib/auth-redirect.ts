/**
 * Authentication redirect utility
 * Handles automatic redirection to appropriate dashboards based on user type
 */

export type UserType = 'farmer' | 'retail' | 'transport';

/**
 * Get the dashboard route for a specific user type
 */
export function getDashboardRoute(userType: UserType): string {
  switch (userType) {
    case 'farmer':
      return '/dashboard/farmer';
    case 'retail':
      return '/dashboard/retail';
    case 'transport':
      return '/dashboard/transport';
    default:
      return '/dashboard';
  }
}

/**
 * Redirect user to their appropriate dashboard
 */
export function redirectToDashboard(userType: UserType, router: any) {
  // Check if there's a pending redirect from voice assistant
  const pendingRedirect = typeof window !== 'undefined' ? sessionStorage.getItem('redirectAfterLogin') : null;
  
  let route = getDashboardRoute(userType);
  
  // If there's a pending redirect, use that instead
  if (pendingRedirect) {
    route = pendingRedirect;
    sessionStorage.removeItem('redirectAfterLogin');
  }
  
  // Store user type in localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('userType', userType);
  }
  
  // Redirect to the appropriate dashboard
  if (router) {
    router.push(route);
  } else if (typeof window !== 'undefined') {
    window.location.href = route;
  }
}

/**
 * Get user type from various sources (localStorage, URL, etc.)
 */
export function getUserType(): UserType | null {
  if (typeof window === 'undefined') return null;
  
  // Try to get from localStorage first
  const storedType = localStorage.getItem('userType') as UserType;
  if (storedType && ['farmer', 'retail', 'transport'].includes(storedType)) {
    return storedType;
  }
  
  // Try to infer from current URL
  const path = window.location.pathname;
  if (path.includes('/farmer')) return 'farmer';
  if (path.includes('/retail')) return 'retail';
  if (path.includes('/transport')) return 'transport';
  
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

/**
 * Check if user is authenticated based on stored data
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userType = localStorage.getItem('userType');
  const userEmail = localStorage.getItem('userEmail');
  
  return !!(userType && userEmail);
}

/**
 * Get stored user email
 */
export function getUserEmail(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userEmail');
}