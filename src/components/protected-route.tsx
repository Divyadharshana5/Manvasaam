"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { redirectToDashboard, getUserType, type UserType } from '@/lib/auth-redirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: UserType;
  redirectIfAuthenticated?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredUserType, 
  redirectIfAuthenticated = false 
}: ProtectedRouteProps) {
  const { user, loading, userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // If user is authenticated and we want to redirect authenticated users
    if (user && redirectIfAuthenticated) {
      const detectedUserType = userType || getUserType();
      if (detectedUserType) {
        redirectToDashboard(detectedUserType, router);
        return;
      }
    }

    // If user is not authenticated and we require authentication
    if (!user && requiredUserType) {
      router.push('/'); // Redirect to home page to select role
      return;
    }

    // If user is authenticated but doesn't have the required user type
    if (user && requiredUserType && userType !== requiredUserType) {
      const detectedUserType = userType || getUserType();
      if (detectedUserType && detectedUserType !== requiredUserType) {
        // Redirect to their appropriate dashboard
        redirectToDashboard(detectedUserType, router);
        return;
      }
    }
  }, [user, loading, userType, requiredUserType, redirectIfAuthenticated, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // If we're redirecting, show loading
  if (user && redirectIfAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated and we require authentication
  if (!user && requiredUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}