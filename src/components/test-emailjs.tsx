"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendPasswordResetEmail, initEmailJS } from '@/lib/emailjs';
import { useToast } from '@/hooks/use-toast';

export default function TestEmailJS() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testEmailJS = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter an email address to test"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Initialize EmailJS
      initEmailJS();
      
      // Test sending email
      const result = await sendPasswordResetEmail(email, "Test User", "customer");
      
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Test Failed",
        description: error.message || "Unknown error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold mb-4">Test EmailJS Configuration</h3>
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Enter test email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button 
          onClick={testEmailJS} 
          disabled={loading}
          className="w-full"
        >
          {loading ? "Testing..." : "Test EmailJS"}
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Service ID:</strong> {process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'Not set'}</p>
        <p><strong>Template ID:</strong> {process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'Not set'}</p>
        <p><strong>Public Key:</strong> {process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ? 'Set' : 'Not set'}</p>
      </div>
    </div>
  );
}