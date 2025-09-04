"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { testEmailJS } from "@/lib/emailjs";

export default function TestEmailJS() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const result = await testEmailJS(email);
      setResult(result);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Test EmailJS</h2>
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="test@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleTest} disabled={loading || !email}>
          {loading ? "Testing..." : "Test Email"}
        </Button>
        {result && (
          <div className="mt-4 p-4 border rounded">
            <pre className="text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}