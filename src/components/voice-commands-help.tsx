"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Navigation, Package, Truck, Users, BarChart3, Settings, Clock, Warehouse } from "lucide-react";

const voiceCommands = [
  {
    category: "Navigation",
    icon: Navigation,
    commands: [
      { phrase: "Go to overview", action: "Navigate to dashboard overview", color: "bg-blue-100 text-blue-800" },
      { phrase: "Show orders", action: "Open orders management", color: "bg-green-100 text-green-800" },
      { phrase: "Check deliveries", action: "View delivery status", color: "bg-orange-100 text-orange-800" },
      { phrase: "View farmers", action: "Manage farmer network", color: "bg-purple-100 text-purple-800" },
      { phrase: "Open analytics", action: "View reports and analytics", color: "bg-red-100 text-red-800" },
      { phrase: "Check inventory", action: "Manage stock and inventory", color: "bg-yellow-100 text-yellow-800" },
      { phrase: "Mark attendance", action: "Worker attendance system", color: "bg-indigo-100 text-indigo-800" },
      { phrase: "Open settings", action: "Hub configuration settings", color: "bg-gray-100 text-gray-800" },
    ]
  }
];

export function VoiceCommandsHelp() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-green-600" />
          Voice Commands Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {voiceCommands.map((category) => (
            <div key={category.category}>
              <div className="flex items-center gap-2 mb-3">
                <category.icon className="h-4 w-4 text-green-600" />
                <h3 className="font-semibold text-green-800">{category.category}</h3>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {category.commands.map((command, index) => (
                  <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={command.color}>
                        "{command.phrase}"
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{command.action}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-green-800 mb-2">💡 Tips for Better Recognition:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Speak clearly and at normal pace</li>
              <li>• Use the exact phrases shown above</li>
              <li>• Ensure microphone permissions are enabled</li>
              <li>• Try alternative phrases like "Navigate to orders" or "Take me to farmers"</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}