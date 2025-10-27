 "use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Download,
    FileText,
    FileSpreadsheet,
    Database,
    Calendar,
    Truck,
    Fuel,
    Battery,
    User,
    MapPin,
    Gauge,
    Clock,
    CheckCircle,
    AlertTriangle,
    Mail,
    Share2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FleetExport() {
    const [exportSettings, setExportSettings] = useState({
        format: "csv",
        dateRange: "all",
        customStartDate: "",
        customEndDate: "",
        includeFields: [
            "vehicleId",
            "driver",
            "status",
            "location",
            "fuel",
            "battery",
            "temperature",
            "mileage"
        ],
        filterBy: "all",
        emailReport: false,
        emailAddress: "",
        reportName: "Fleet_Report",
        includeCharts: false,
        groupBy: "none"
    });

    const formatOptions = [
        { value: "csv", label: "CSV", icon: FileSpreadsheet, description: "Comma-separated values for Excel" },
        { value: "pdf", label: "PDF", icon: FileText, description: "Formatted report document" },
        { value: "json", label: "JSON", icon: Database, description: "Structured data format" },
        { value: "xlsx", label: "Excel", icon: FileSpreadsheet, description: "Microsoft Excel format" }
    ];

    const dateRangeOptions = [
        { value: "all", label: "All Time" },
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "quarter", label: "This Quarter" },
        { value: "year", label: "This Year" },
        { value: "custom", label: "Custom Range" }
    ];

    const availableFields = [
        { id: "vehicleId", label: "Vehicle ID", category: "basic" },
        { id: "driver", label: "Driver Name", category: "basic" },
        { id: "status", label: "Status", category: "basic" },
        { id: "location", label: "Current Location", category: "basic" },
        { id: "fuel", label: "Fuel Level", category: "performance" },
        { id: "battery", label: "Battery Level", category: "performance" },
        { id: "temperature", label: "Engine Temperature", category: "performance" },
        { id: "mileage", label: "Fuel Efficiency", category: "performance" },
        { id: "lastService", label: "Last Service Date", category: "maintenance" },
        { id: "nextService", label: "Next Service Due", category: "maintenance" },
        { id: "totalDistance", label: "Total Distance", category: "analytics" },
        { id: "deliveries", label: "Deliveries Count", category: "analytics" },
        { id: "revenue", label: "Revenue Generated", category: "analytics" },
        { id: "rating", label: "Driver Rating", category: "analytics" }
    ];

    const filterOptions = [
        { value: "all", label: "All Vehicles" },
        { value: "active", label: "Active Only" },
        { value: "available", label: "Available Only" },
        { value: "maintenance", label: "In Maintenance" },
        { value: "high-fuel", label: "High Fuel (>80%)" },
        { value: "low-fuel", label: "Low Fuel (<20%)" },
        { value: "service-due", label: "Service Due" }
    ];

    const groupByOptions = [
        { value: "none", label: "No Grouping" },
        { value: "status", label: "Group by Status" },
        { value: "driver", label: "Group by Driver" },
        { value: "location", label: "Group by Location" },
        { value: "service", label: "Group by Service Status" }
    ];

    const handleFieldToggle = (fieldId: string) => {
        setExportSettings(prev => ({
            ...prev,
            includeFields: prev.includeFields.includes(fieldId)
                ? prev.includeFields.filter(f => f !== fieldId)
                : [...prev.includeFields, fieldId]
        }));
    };

    const handleSelectAllFields = (category?: string) => {
        const fieldsToSelect = category
            ? availableFields.filter(f => f.category === category).map(f => f.id)
            : availableFields.map(f => f.id);

        setExportSettings(prev => ({
            ...prev,
            includeFields: [...new Set([...prev.includeFields, ...fieldsToSelect])]
        }));
    };

    const handleDeselectAllFields = (category?: string) => {
        const fieldsToDeselect = category
            ? availableFields.filter(f => f.category === category).map(f => f.id)
            : availableFields.map(f => f.id);

        setExportSettings(prev => ({
            ...prev,
            includeFields: prev.includeFields.filter(f => !fieldsToDeselect.includes(f))
        }));
    };

    const handleExport = () => {
        // In a real app, this would trigger the export process
        console.log("Exporting with settings:", exportSettings);

        // Simulate export process
        const fileName = `${exportSettings.reportName}_${new Date().toISOString().split('T')[0]}.${exportSettings.format}`;

        // Create a mock download
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent('Mock fleet data export'));
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        // Show success message or redirect
        alert(`Export started! File: ${fileName}`);
    };

    const fieldsByCategory = availableFields.reduce((acc, field) => {
        if (!acc[field.category]) acc[field.category] = [];
        acc[field.category].push(field);
        return acc;
    }, {} as Record<string, typeof availableFields>);

    return (
        <div className="min-h-screen w-full overflow-auto">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/dashboard/transport">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Export Fleet Data</h1>
                            <p className="text-muted-foreground">
                                Generate and download fleet reports in various formats
                            </p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        12 vehicles available
                    </Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Export Format */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Export Format
                            </CardTitle>
                            <CardDescription>Choose your preferred file format</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup
                                value={exportSettings.format}
                                onValueChange={(value) => setExportSettings({ ...exportSettings, format: value })}
                                className="space-y-3"
                            >
                                {formatOptions.map((format) => (
                                    <div key={format.value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={format.value} id={format.value} />
                                        <Label htmlFor={format.value} className="flex items-center gap-2 cursor-pointer">
                                            <format.icon className="h-4 w-4" />
                                            <div>
                                                <div className="font-medium">{format.label}</div>
                                                <div className="text-xs text-muted-foreground">{format.description}</div>
                                            </div>
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {/* Date Range */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Date Range
                            </CardTitle>
                            <CardDescription>Select the time period for your report</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select
                                value={exportSettings.dateRange}
                                onValueChange={(value) => setExportSettings({ ...exportSettings, dateRange: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select date range" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dateRangeOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {exportSettings.dateRange === "custom" && (
                                <div className="space-y-2">
                                    <div>
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={exportSettings.customStartDate}
                                            onChange={(e) => setExportSettings({ ...exportSettings, customStartDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endDate">End Date</Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={exportSettings.customEndDate}
                                            onChange={(e) => setExportSettings({ ...exportSettings, customEndDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Filter Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Filter & Group
                            </CardTitle>
                            <CardDescription>Filter vehicles and organize data</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Filter Vehicles</Label>
                                <Select
                                    value={exportSettings.filterBy}
                                    onValueChange={(value) => setExportSettings({ ...exportSettings, filterBy: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select filter" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filterOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Group By</Label>
                                <Select
                                    value={exportSettings.groupBy}
                                    onValueChange={(value) => setExportSettings({ ...exportSettings, groupBy: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select grouping" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {groupByOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Field Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select Fields to Export</CardTitle>
                        <CardDescription>Choose which data fields to include in your export</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {Object.entries(fieldsByCategory).map(([category, fields]) => (
                                <div key={category}>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium capitalize">{category} Fields</h4>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleSelectAllFields(category)}
                                            >
                                                Select All
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDeselectAllFields(category)}
                                            >
                                                Deselect All
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                        {fields.map((field) => (
                                            <div key={field.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={field.id}
                                                    checked={exportSettings.includeFields.includes(field.id)}
                                                    onCheckedChange={() => handleFieldToggle(field.id)}
                                                />
                                                <Label htmlFor={field.id} className="text-sm cursor-pointer">
                                                    {field.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Report Settings */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Report Settings</CardTitle>
                            <CardDescription>Customize your report appearance and delivery</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="reportName">Report Name</Label>
                                <Input
                                    id="reportName"
                                    value={exportSettings.reportName}
                                    onChange={(e) => setExportSettings({ ...exportSettings, reportName: e.target.value })}
                                    placeholder="Enter report name"
                                />
                            </div>

                            {exportSettings.format === "pdf" && (
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeCharts"
                                        checked={exportSettings.includeCharts}
                                        onCheckedChange={(checked) => setExportSettings({ ...exportSettings, includeCharts: checked })}
                                    />
                                    <Label htmlFor="includeCharts">Include charts and graphs</Label>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Email Delivery
                            </CardTitle>
                            <CardDescription>Optionally email the report</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="emailReport"
                                    checked={exportSettings.emailReport}
                                    onCheckedChange={(checked) => setExportSettings({ ...exportSettings, emailReport: checked })}
                                />
                                <Label htmlFor="emailReport">Email report after generation</Label>
                            </div>

                            {exportSettings.emailReport && (
                                <div>
                                    <Label htmlFor="emailAddress">Email Address</Label>
                                    <Input
                                        id="emailAddress"
                                        type="email"
                                        value={exportSettings.emailAddress}
                                        onChange={(e) => setExportSettings({ ...exportSettings, emailAddress: e.target.value })}
                                        placeholder="Enter email address"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Export Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Export Summary</CardTitle>
                        <CardDescription>Review your export settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <Label className="text-sm font-medium">Format</Label>
                                <p className="text-sm text-muted-foreground">
                                    {formatOptions.find(f => f.value === exportSettings.format)?.label}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Date Range</Label>
                                <p className="text-sm text-muted-foreground">
                                    {dateRangeOptions.find(d => d.value === exportSettings.dateRange)?.label}
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Fields</Label>
                                <p className="text-sm text-muted-foreground">
                                    {exportSettings.includeFields.length} selected
                                </p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium">Filter</Label>
                                <p className="text-sm text-muted-foreground">
                                    {filterOptions.find(f => f.value === exportSettings.filterBy)?.label}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/transport">Cancel</Link>
                    </Button>
                    <Button onClick={handleExport} className="min-w-32">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                    </Button>
                </div>
            </div>
        </div>
    );
}