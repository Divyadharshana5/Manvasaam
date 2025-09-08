"use client";

// Demo authentication service for when Firebase is not available
export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  userType: 'farmer' | 'hub' | 'customer' | 'restaurant';
}

const DEMO_USERS: DemoUser[] = [
  { uid: 'demo-farmer-1', email: 'farmer@demo.com', displayName: 'Demo Farmer', userType: 'farmer' },
  { uid: 'demo-hub-1', email: 'hub@demo.com', displayName: 'Demo Hub', userType: 'hub' },
  { uid: 'demo-customer-1', email: 'customer@demo.com', displayName: 'Demo Customer', userType: 'customer' },
  { uid: 'demo-restaurant-1', email: 'restaurant@demo.com', displayName: 'Demo Restaurant', userType: 'restaurant' },
];

class DemoAuthService {
  private currentUser: DemoUser | null = null;
  private listeners: ((user: DemoUser | null) => void)[] = [];

  async signInWithEmailAndPassword(email: string, password: string): Promise<DemoUser> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = DEMO_USERS.find(u => u.email === email) || DEMO_USERS[0];
    this.currentUser = user;
    this.notifyListeners();
    
    // Store in localStorage for persistence
    localStorage.setItem('demo-user', JSON.stringify(user));
    
    return user;
  }

  async createUserWithEmailAndPassword(email: string, password: string, userType: string): Promise<DemoUser> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user: DemoUser = {
      uid: `demo-${userType}-${Date.now()}`,
      email,
      displayName: `Demo ${userType.charAt(0).toUpperCase() + userType.slice(1)}`,
      userType: userType as any
    };
    
    this.currentUser = user;
    this.notifyListeners();
    localStorage.setItem('demo-user', JSON.stringify(user));
    
    return user;
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.notifyListeners();
    localStorage.removeItem('demo-user');
  }

  getCurrentUser(): DemoUser | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('demo-user');
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
        } catch (error) {
          console.warn('Failed to parse stored demo user:', error);
        }
      }
    }
    return this.currentUser;
  }

  onAuthStateChanged(callback: (user: DemoUser | null) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current user
    callback(this.getCurrentUser());
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Demo: Password reset email sent to ${email}`);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentUser));
  }
}

export const demoAuth = new DemoAuthService();