"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  User,
  Bell,
  CreditCard,
  Shield,
  Truck,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your restaurant account and preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Restaurant Profile
              </CardTitle>
              <CardDescription>
                Update your restaurant information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurant-name">Restaurant Name</Label>
                  <Input id="restaurant-name" defaultValue="The Fresh Table" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cuisine-type">Cuisine Type</Label>
                  <Select defaultValue="organic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic">Organic Farm-to-Table</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="continental">Continental</SelectItem>
                      <SelectItem value="fusion">Fusion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell customers about your restaurant..."
                  defaultValue="We specialize in organic, farm-to-table cuisine using fresh ingredients sourced directly from local contract farmers."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="restaurant@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+91 98765 43210" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  placeholder="Restaurant address..."
                  defaultValue="123 Green Street, Organic District, Bangalore, Karnataka 560001"
                />
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when orders are confirmed, shipped, or delivered
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when inventory levels are low
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about pending payments to farmers
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Farmer Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Be notified when new farmers join your network
                  </p>
                </div>
                <Switch />
              </div>

              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Manage your payment methods and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred Payment Method</Label>
                <Select defaultValue="upi">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI Payment</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input id="upi-id" defaultValue="restaurant@upi" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-pay for Regular Orders</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically pay for recurring orders from trusted farmers
                  </p>
                </div>
                <Switch />
              </div>

              <Button>Update Payment Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Preferences
              </CardTitle>
              <CardDescription>
                Set your delivery schedule and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Preferred Delivery Time</Label>
                  <Select defaultValue="morning">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (6 AM - 10 AM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12 PM - 4 PM)</SelectItem>
                      <SelectItem value="evening">Evening (5 PM - 8 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Delivery Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="alternate">Alternate Days</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-notes">Special Delivery Instructions</Label>
                <Textarea 
                  id="delivery-notes" 
                  placeholder="Any special instructions for delivery..."
                  defaultValue="Please deliver to the back entrance. Call before delivery."
                />
              </div>

              <Button>Save Delivery Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>

              <Button>Update Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}