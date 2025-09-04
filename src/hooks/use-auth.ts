
"use client";

import React, {useEffect, useState, createContext, useContext, ReactNode} from 'react';
import { auth } from '@/lib/firebase';
import type {User} from 'firebase/auth';
import { onIdTokenChanged } from 'firebase/auth';
import { getUserType, type UserType } from '@/lib/auth-redirect';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userType: UserType | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, userType: null });

async function setSessionCookie(idToken: string) {
    await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
    });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<UserType | null>(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const idToken = await user.getIdToken();
        await setSessionCookie(idToken);
        
        // Get user type from localStorage or other sources
        const detectedUserType = getUserType();
        setUserType(detectedUserType);
      } else {
        setUser(null);
        setUserType(null);
        // You might want to have a way to clear the session cookie on the server
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading, userType };

  return React.createElement(AuthContext.Provider, { value: value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
