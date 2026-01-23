"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  Filter,
  RotateCcw,
  Search,
  Truck,
  Fuel,
  Battery,
  ThermometerSun,
  MapPin,
  User,
  Calendar,
  Gauge,
  CheckCircle,
  AlertTriangle,
  Clock,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/language-context";

export default function FleetFilter() {
  const { t } = useLanguage();
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    fuelRange: [0, 100],
    batteryRange: [0, 100],
    temperatureRange: [0, 100],
    location: "all",
    driver: "all",
    mileageRange: [0, 20],
    serviceStatus: [] as string[],
    dateRange: "all",
  });

  const statusOptions = [
    { value: "all", label: "All Status", count: 12 },
    { value: "active", label: "Active", count: 8 },
    { value: "maintenance", label: "Maintenance", count: 2 },
    { value: "offline", label: "Offline", count: 1 },
  ];

  const locationOptions = [
    { value: "all", label: "All Locations" },
    { value: "highway", label: "Highway Routes" },
    { value: "city", label: "City Center" },
    { value: "depot", label: "Depot" },
    { value: "rural", label: "Rural Areas" },
  ];

  const driverOptions = [
    { value: "all", label: "All Drivers" },
    { value: "raj-kumar", label: "Raj Kumar" },
    { value: "amit-singh", label: "Amit Singh" },
    { value: "suresh-patel", label: "Suresh Patel" },
    { value: "vikram-yadav", label: "Vikram Yadav" },
  ];

  const serviceStatusOptions = [
    { id: "due", label: "Service Due", count: 3 },
    { id: "overdue", label: "Service Overdue", count: 1 },
    { id: "recent", label: "Recently Serviced", count: 8 },
  ];

  const handleReset = () => {
    setFilters({
      search: "",
      status: "all",
      fuelRange: [0, 100],
      batteryRange: [0, 100],
      temperatureRange: [0, 100],
      location: "all",
      driver: "all",
      mileageRange: [0, 20],
      serviceStatus: [] as string[],
      dateRange: "all",
    });
  };

  const handleApplyFilters = () => {
    // Build a simple query string from some filter fields
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status && filters.status !== "all")
      params.set("status", filters.status);
    if (filters.location && filters.location !== "all")
      params.set("location", filters.location);
    if (filters.driver && filters.driver !== "all")
      params.set("driver", filters.driver);
    if (filters.serviceStatus && filters.serviceStatus.length)
      params.set("serviceStatus", filters.serviceStatus.join(","));
    // Ranges: include when different from defaults
    if (!(filters.fuelRange[0] === 0 && filters.fuelRange[1] === 100))
      params.set("fuelMin", String(filters.fuelRange[0]));
    if (!(filters.batteryRange[0] === 0 && filters.batteryRange[1] === 100))
      params.set("batteryMin", String(filters.batteryRange[0]));

    const url = `/dashboard/transport?tab=fleet${
      params.toString() ? `&${params.toString()}` : ""
    }`;
    router.push(url);
  };

  return (
    <div className="min-h-screen w-full overflow-auto">
      <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/transport">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Fleet Filters</h1>
              <p className="text-muted-foreground">Filter and search your fleet vehicles</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleApplyFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Search and Basic Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Status
              </CardTitle>
              <CardDescription>Basic search and status filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Search Vehicles</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                  <Input
                    id="search"
                    placeholder="Search by ID, driver, location..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="pl-10 pr-10"
                  />
                  {filters.search && (
                    <button
                      onClick={() => setFilters({ ...filters, search: "" })}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <Label>Vehicle Status</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {statusOptions.map((status) => (
                    <div
                      key={status.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        filters.status === status.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() =>
                        setFilters({ ...filters, status: status.value })
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {status.label}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {status.count}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location and Driver */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Driver
              </CardTitle>
              <CardDescription>
                Filter by location and assigned driver
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    setFilters({ ...filters, location: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationOptions.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="driver">Driver</Label>
                <Select
                  value={filters.driver}
                  onValueChange={(value) =>
                    setFilters({ ...filters, driver: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {driverOptions.map((driver) => (
                      <SelectItem key={driver.value} value={driver.value}>
                        {driver.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Filter by fuel, battery, and temperature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="h-4 w-4" />
                  <Label>
                    Fuel Level: {filters.fuelRange[0]}% - {filters.fuelRange[1]}
                    %
                  </Label>
                </div>
                <Slider
                  value={filters.fuelRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, fuelRange: value })
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Battery className="h-4 w-4" />
                  <Label>
                    Battery Level: {filters.batteryRange[0]}% -{" "}
                    {filters.batteryRange[1]}%
                  </Label>
                </div>
                <Slider
                  value={filters.batteryRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, batteryRange: value })
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ThermometerSun className="h-4 w-4" />
                  <Label>
                    Temperature: {filters.temperatureRange[0]}°C -{" "}
                    {filters.temperatureRange[1]}°C
                  </Label>
                </div>
                <Slider
                  value={filters.temperatureRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, temperatureRange: value })
                  }
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4" />
                  <Label>
                    Mileage: {filters.mileageRange[0]} -{" "}
                    {filters.mileageRange[1]} km/l
                  </Label>
                </div>
                <Slider
                  value={filters.mileageRange}
                  onValueChange={(value) =>
                    setFilters({ ...filters, mileageRange: value })
                  }
                  max={20}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Service Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Service Status
              </CardTitle>
              <CardDescription>
                Filter by maintenance and service status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {serviceStatusOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={filters.serviceStatus.includes(option.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            serviceStatus: [
                              ...filters.serviceStatus,
                              option.id,
                            ],
                          });
                        } else {
                          setFilters({
                            ...filters,
                            serviceStatus: filters.serviceStatus.filter(
                              (s) => s !== option.id
                            ),
                          });
                        }
                      }}
                    />
                    <Label
                      htmlFor={option.id}
                      className="flex items-center justify-between w-full"
                    >
                      <span>{option.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {option.count}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Filters Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Active Filters Summary</CardTitle>
            <CardDescription>
              Review your current filter settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.status !== "all" && (
                <Badge variant="secondary">
                  Status:{" "}
                  {statusOptions.find((s) => s.value === filters.status)?.label}
                </Badge>
              )}
              {filters.location !== "all" && (
                <Badge variant="secondary">
                  Location:{" "}
                  {
                    locationOptions.find((l) => l.value === filters.location)
                      ?.label
                  }
                </Badge>
              )}
              {filters.driver !== "all" && (
                <Badge variant="secondary">
                  Driver:{" "}
                  {driverOptions.find((d) => d.value === filters.driver)?.label}
                </Badge>
              )}
              {filters.search && (
                <Badge variant="secondary">Search: "{filters.search}"</Badge>
              )}
              {filters.serviceStatus.length > 0 && (
                <Badge variant="secondary">
                  Service: {filters.serviceStatus.length} selected
                </Badge>
              )}
              {(filters.fuelRange[0] !== 0 || filters.fuelRange[1] !== 100) && (
                <Badge variant="secondary">
                  Fuel: {filters.fuelRange[0]}%-{filters.fuelRange[1]}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/transport">Cancel</Link>
          </Button>
          <Button onClick={handleApplyFilters}>
            Apply Filters & View Results
          </Button>
        </div>
      </div>
    </div>
  );
}
