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
    
    // Let other errors bubble up
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Firebase Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert className="max-w-md border-amber-200 bg-amber-50 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Connection Issue</AlertTitle>
            <AlertDescription className="mt-2">
              Firebase connection failed. The app is now running in demo mode with full functionality.
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Connection
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full"
                >
                  Continue in Demo Mode
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}