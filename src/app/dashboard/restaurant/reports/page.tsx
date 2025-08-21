"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Package,
  Users,
  Leaf,
} from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Insights into your farm-to-table operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,45,231</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Placed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Farmers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organic %</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Organic sourcing rate
            </p>
          </CardContent>
        </Card>
      </div>   
   {/* Report Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sourcing">Sourcing</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spending Trend</CardTitle>
                <CardDescription>
                  Your spending on organic products over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mb-4" />
                  <p>Chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>
                  Distribution of purchases by product category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Vegetables</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Fruits</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dairy</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Millets</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sourcing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Suppliers</CardTitle>
                <CardDescription>
                  Your most reliable contract farmers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Green Valley Farm</p>
                      <p className="text-sm text-muted-foreground">45 orders</p>
                    </div>
                    <span className="text-sm font-medium">₹45,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Hill Station Farms</p>
                      <p className="text-sm text-muted-foreground">32 orders</p>
                    </div>
                    <span className="text-sm font-medium">₹38,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Happy Cow Dairy</p>
                      <p className="text-sm text-muted-foreground">28 orders</p>
                    </div>
                    <span className="text-sm font-medium">₹32,100</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>
                  On-time delivery rates by supplier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Green Valley Farm</span>
                    <span className="text-sm font-medium text-green-600">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Hill Station Farms</span>
                    <span className="text-sm font-medium text-green-600">95%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sunrise Organics</span>
                    <span className="text-sm font-medium text-yellow-600">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
              <CardDescription>
                Financial breakdown of your organic sourcing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <p className="text-2xl font-bold">₹1,45,231</p>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">₹1,142</p>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">₹95</p>
                  <p className="text-sm text-muted-foreground">Cost per kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Metrics</CardTitle>
              <CardDescription>
                Your environmental impact and organic sourcing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Organic Sourcing</p>
                    <p className="text-2xl font-bold text-green-600">98.5%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Local Sourcing (within 500km)</p>
                    <p className="text-2xl font-bold text-blue-600">85%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Carbon Footprint Reduction</p>
                    <p className="text-2xl font-bold text-green-600">-23%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Farmers Supported</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}