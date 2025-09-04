/**
 * Logout utility
 * Handles user logout and cleanup
 */

import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { clearUserType } from '@/lib/auth-redirect';

/**
 * Logout user and clear all stored data
 */
export async function logout(router?: any) {
  try {
    // Sign out from Firebase if available
    if (auth) {
      await signOut(auth);
    }
    
    // Clear localStorage data
    clearUserType();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('branchName');
      localStorage.removeItem('restaurantName');
      localStorage.removeItem('branchId');
      localStorage.removeItem('authMethod');
    }
    
    // Clear session cookie by calling logout API
    try {
      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.warn('Failed to clear session cookie:', error);
    }
    
    // Redirect to home page if router is provided
    if (router) {
      router.push('/');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error };
  }
}