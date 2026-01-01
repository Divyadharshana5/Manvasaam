
"use client";

import React, {useEffect, useState, createContext, useContext, ReactNode} from 'react';
import { auth, isFirebaseAvailable } from '@/lib/firebase';
import { demoAuth, type DemoUser } from '@/lib/demo-auth';
import type {User} from 'firebase/auth';
import { onIdTokenChanged } from 'firebase/auth';
import { getUserType, type UserType } from '@/lib/auth-redirect';

interface AuthContextType {
  user: User | DemoUser | null;
  loading: boolean;
  userType: UserType | null;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  userType: null,
  isDemoMode: !isFirebaseAvailable 
});

async function setSessionCookie(idToken: string) {
  try {
    await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.warn('Session cookie setting failed:', error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [mounted, setMounted] = useState(false);
  const isDemoMode = !isFirebaseAvailable;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isFirebaseAvailable || !auth) {
      console.log('🔄 Running in demo mode - Firebase not available');
      
      // Use demo auth service
      const unsubscribe = demoAuth.onAuthStateChanged((demoUser) => {
        setUser(demoUser);
        if (demoUser) {
          setUserType(demoUser.userType as UserType);
          // Store user type for getUserType function
          localStorage.setItem('userType', demoUser.userType);
        } else {
          setUserType(null);
          localStorage.removeItem('userType');
        }
        setLoading(false);
      });
      
      return unsubscribe;
    }

    let unsubscribe: (() => void) | undefined;
    
    try {
      unsubscribe = onIdTokenChanged(auth, async (user) => {
        try {
          if (user) {
            setUser(user);
            const idToken = await user.getIdToken();
            await setSessionCookie(idToken);
            
            const detectedUserType = getUserType();
            setUserType(detectedUserType);
          } else {
            setUser(null);
            setUserType(null);
          }
        } catch (error) {
          console.warn('Auth token error, continuing in demo mode:', error);
          setUser(null);
          setUserType(null);
        }
        setLoading(false);
      });
    } catch (error) {
      console.warn('Auth listener setup failed, running in demo mode:', error);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.warn('Auth cleanup error:', error);
        }
      }
    };
  }, [mounted]);

  const value = { user, loading, userType, isDemoMode };

  return React.createElement(
    AuthContext.Provider,
    { value: value, suppressHydrationWarning: true as any },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export demo auth for use in components
export { demoAuth };
