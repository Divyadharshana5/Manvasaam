"use client";

import { FastNav, QuickAccessButton } from "@/components/ui/fast-nav";
import { useFastNavigation } from "@/hooks/use-fast-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Keyboard, Mouse, Smartphone } from "lucide-react";

export function FastNavDemo() {
  const { navigateFast } = useFastNavigation();

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Fast Navigation Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Horizontal Navigation */}
          <div>
            <h3 className="text-sm font-medium mb-3">Horizontal Layout</h3>
            <FastNav variant="horizontal" />
          </div>

          {/* Grid Navigation */}
          <div>
            <h3 className="text-sm font-medium mb-3">Grid Layout</h3>
            <FastNav variant="grid" />
          </div>

          {/* Vertical Navigation */}
          <div className="max-w-xs">
            <h3 className="text-sm font-medium mb-3">Vertical Layout</h3>
            <FastNav variant="vertical" />
          </div>

          {/* Programmatic Navigation */}
          <div>
            <h3 className="text-sm font-medium mb-3">Programmatic Navigation</h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigateFast("/privacy")}
                variant="outline"
                size="sm"
              >
                Go to Privacy
              </Button>
              <Button 
                onClick={() => navigateFast("/terms")}
                variant="outline"
                size="sm"
              >
                Go to Terms
              </Button>
              <Button 
                onClick={() => navigateFast("/support")}
                variant="outline"
                size="sm"
              >
                Go to Support
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center space-y-2">
              <Keyboard className="h-8 w-8 mx-auto text-blue-500" />
              <h4 className="font-medium text-sm">Keyboard Shortcuts</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Ctrl+Shift+P → Privacy</p>
                <p>Ctrl+Shift+T → Terms</p>
                <p>Ctrl+Shift+S → Support</p>
                <p>Ctrl+Shift+H → Home</p>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <Mouse className="h-8 w-8 mx-auto text-green-500" />
              <h4 className="font-medium text-sm">Instant Feedback</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Hover animations</p>
                <p>Click transformations</p>
                <p>Loading states</p>
                <p>Smooth transitions</p>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <Smartphone className="h-8 w-8 mx-auto text-purple-500" />
              <h4 className="font-medium text-sm">Mobile Optimized</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Touch-friendly</p>
                <p>Responsive design</p>
                <p>Fast loading</p>
                <p>Gesture support</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Button */}
      <QuickAccessButton />
    </div>
  );
}