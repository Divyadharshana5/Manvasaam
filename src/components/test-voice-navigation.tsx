"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { VoiceAssistantGlobal } from "@/components/VoiceAssistantGlobal";
import { isAuthenticated } from "@/lib/auth-redirect";

export function TestVoiceNavigation() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testText, setTestText] = useState("go to dashboard");
  const [authStatus, setAuthStatus] = useState<boolean>(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/voice-navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: testText,
          routes: ["dashboard", "orders", "products", "track", "farmer", "retail", "transport"]
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    const authenticated = isAuthenticated();
    setAuthStatus(authenticated);
    setResult({ authenticated, message: authenticated ? "User is authenticated" : "User is not authenticated" });
  };

  const simulateLogin = () => {
    localStorage.setItem('userType', 'customer');
    localStorage.setItem('userEmail', 'test@example.com');
    setResult({ message: "Simulated login successful" });
  };

  const simulateLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    setResult({ message: "Simulated logout successful" });
  };

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Voice Assistant Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span>Voice Assistant:</span>
            <VoiceAssistantGlobal />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Text Input:</label>
            <Input 
              value={testText} 
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter voice command to test"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testAPI} disabled={loading}>
              {loading ? "Testing..." : "Test API"}
            </Button>
            <Button onClick={checkAuth} variant="outline">
              Check Auth
            </Button>
            <Button onClick={simulateLogin} variant="outline">
              Simulate Login
            </Button>
            <Button onClick={simulateLogout} variant="outline">
              Simulate Logout
            </Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Test Commands:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Button size="sm" variant="ghost" onClick={() => setTestText("go to dashboard")}>
                "go to dashboard"
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTestText("show orders")}>
                "show orders"
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTestText("farmer login")}>
                "farmer login"
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTestText("track order")}>
                "track order"
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTestText("random text")}>
                "random text"
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setTestText("view products")}>
                "view products"
              </Button>
            </div>
          </div>
          
          {result && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}