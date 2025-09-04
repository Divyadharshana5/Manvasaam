"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { redirectToDashboard, getUserType, isAuthenticated, getUserEmail } from '@/lib/auth-redirect';
import { logout } from '@/lib/logout';
import { useToast } from '@/hooks/use-toast';

export function AuthTest() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUserType, setCurrentUserType] = useState(getUserType());
  const [currentUserEmail, setCurrentUserEmail] = useState(getUserEmail());
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  const handleTestLogin = (userType: 'farmer' | 'customer' | 'hub' | 'restaurant') => {
    // Simulate login by storing user data
    localStorage.setItem('userType', userType);
    localStorage.setItem('userEmail', `test-${userType}@example.com`);
    
    // Update state
    setCurrentUserType(userType);
    setCurrentUserEmail(`test-${userType}@example.com`);
    setIsAuth(true);
    
    toast({
      title: "Test Login Successful",
      description: `Logged in as ${userType}`,
      duration: 2000,
    });
    
    // Redirect to dashboard
    setTimeout(() => {
      redirectToDashboard(userType, router);
    }, 1000);
  };

  const handleLogout = async () => {
    await logout(router);
    
    // Update state
    setCurrentUserType(null);
    setCurrentUserEmail(null);
    setIsAuth(false);
    
    toast({
      title: "Logged Out",
      description: "Successfully logged out",
      duration: 2000,
    });
  };

  const refreshStatus = () => {
    setCurrentUserType(getUserType());
    setCurrentUserEmail(getUserEmail());
    setIsAuth(isAuthenticated());
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Authentication Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Authenticated:</strong> {isAuth ? 'Yes' : 'No'}</p>
          <p><strong>User Type:</strong> {currentUserType || 'None'}</p>
          <p><strong>User Email:</strong> {currentUserEmail || 'None'}</p>
        </div>
        
        <div className="space-y-2">
          <p className="font-semibold">Test Login As:</p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              onClick={() => handleTestLogin('farmer')}
              disabled={isAuth}
            >
              Farmer
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleTestLogin('customer')}
              disabled={isAuth}
            >
              Customer
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleTestLogin('hub')}
              disabled={isAuth}
            >
              Hub
            </Button>
            <Button 
              size="sm" 
              onClick={() => handleTestLogin('restaurant')}
              disabled={isAuth}
            >
              Restaurant
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            onClick={refreshStatus}
            className="w-full"
          >
            Refresh Status
          </Button>
          
          {isAuth && (
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="w-full"
            >
              Logout
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}