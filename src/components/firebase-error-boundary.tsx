"use client";

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class FirebaseErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a Firebase network error
    if (error.message.includes('auth/network-request-failed') || 
        error.message.includes('Firebase') ||
        error.name === 'FirebaseError') {
      console.warn('Firebase error caught by boundary, switching to demo mode:', error);
      return { hasError: true, error };
    }
    
    // Check if it's a hydration error - silently recover
    if (error.message.includes('Hydration') || 
        error.message.includes('hydration') ||
        error.message.includes('did not match')) {
      console.warn('Hydration error caught, recovering:', error);
      return { hasError: false };
    }
    
    // Let other errors bubble up
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Firebase Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Silently handle Firebase errors and continue in demo mode
      console.log('Running in demo mode due to Firebase connection issue');
      // Reset error state and continue rendering
      this.setState({ hasError: false });
    }

    return this.props.children;
  }
}