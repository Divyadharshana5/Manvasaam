"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    ArrowLeft,
    Download,
    FileText,
    FileSpreadsheet,
    Database,
    Calendar,
    BarChart3,
    TrendingUp,
    Activity,
    Fuel,
    IndianRupee,
    Users,
    Clock,
    Mail
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AnalyticsExport() {
    const router = useRouter();
    const [isExporting, setIsExporting] = useState(false);
    const [exportSettings, setExportSettings] = useState({
        format: "pdf",
        dateRange: "month",
        customStartDate: "",
        customEndDate: "",
        includeMetrics: [
            "revenue",
            "deliveries",
            "fuel",
            "efficiency"
        ],
        includeCharts: true,
        includeDriverData: true,
        includeVehicleData: true,
        emailReport: false,
        emailAddress: "",
        reportName: "Analytics_Report"
    });

    const formatOptions = [
        { value: "pdf", label: "PDF Report", icon: FileText, description: "Comprehensive formatted report" },
        { value: "csv", label: "CSV Data", icon: FileSpreadsheet, description: "Raw data for analysis" },
        { value: "xlsx", label: "Excel Report", icon: FileSpreadsheet, description: "Excel with charts and data" },
        { value: "json", label: "JSON Data", icon: Database, description: "Structured data format" }
    ];

    const dateRangeOptions = [
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "quarter", label: "This Quarter" },
        { value: "year", label: "This Year" },
        { value: "custom", label: "Custom Range" }
    ];

    const availableMetrics = [
        { id: "revenue", label: "Revenue Analytics", icon: IndianRupee, category: "financial" },
        { id: "deliveries", label: "Delivery Performance", icon: Activity, category: "operations" },
        { id: "fuel", label: "Fuel Consumption", icon: Fuel, category: "operations" },
        { id: "efficiency", label: "Route Efficiency", icon: TrendingUp, category: "performance" },
        { id: "drivers", label: "Driver Performance", icon: Users, category: "performance" },
        { id: "timing", label: "Delivery Timing", icon: Clock, category: "performance" },
        { id: "customer", label: "Customer Satisfaction", icon: BarChart3, category: "quality" },
        { id: "fleet", label: "Fleet Utilization", icon: Activity, category: "operations" }
    ];

    const handleMetricToggle = (metricId: string) => {
        setExportSettings(prev => ({
            ...prev,
            includeMetrics: prev.includeMetrics.includes(metricId)
                ? prev.includeMetrics.filter(m => m !== metricId)
                : [...prev.includeMetrics, metricId]
        }));
    };

    const handleCancel = () => {
        router.push("/dashboard/transport/analytics");
    };

    const handleExport = async () => {
        // Validate settings
        if (exportSettings.includeMetrics.length === 0) {
            return;
        }

        if (exportSettings.dateRange === "custom" && (!exportSettings.customStartDate || !exportSettings.customEndDate)) {
            return;
        }

        if (exportSettings.emailReport && !exportSettings.emailAddress) {
            return;
        }

        setIsExporting(true);
        
        try {
            console.log("Exporting analytics with settings:", exportSettings);
            
            // Simulate export process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const fileName = `${exportSettings.reportName}_${new Date().toISOString().split('T')[0]}.${exportSettings.format}`;
            
            // Create comprehensive mock data based on selected metrics
            let reportContent = `TRANSPORT ANALYTICS REPORT\n`;
            reportContent += `Generated: ${new Date().toLocaleString()}\n`;
            reportContent += `Format: ${exportSettings.format.toUpperCase()}\n`;
            reportContent += `Date Range: ${dateRangeOptions.find(d => d.value === exportSettings.dateRange)?.label}\n\n`;
            
            reportContent += `INCLUDED METRICS:\n`;
            exportSettings.includeMetrics.forEach(metricId => {
                const metric = availableMetrics.find(m => m.id === metricId);
                if (metric) {
                    reportContent += `- ${metric.label}\n`;
                }
            });
            
            reportContent += `\nREPORT OPTIONS:\n`;
            reportContent += `- Charts: ${exportSettings.includeCharts ? 'Yes' : 'No'}\n`;
            reportContent += `- Driver Data: ${exportSettings.includeDriverData ? 'Yes' : 'No'}\n`;
            reportContent += `- Vehicle Data: ${exportSettings.includeVehicleData ? 'Yes' : 'No'}\n`;
            
            if (exportSettings.emailReport) {
                reportContent += `\nEmail Delivery: ${exportSettings.emailAddress}\n`;
            }
            
            // Create mock download
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
            element.setAttribute('download', fileName);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            console.log(`Analytics report exported: ${fileName}`);
            
            // Redirect back to analytics page after successful export
            setTimeout(() => {
                router.push("/dashboard/transport/analytics");
            }, 1000);
            
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
    };

    const metricsByCategory = availableMetrics.reduce((acc, metric) => {
        if (!acc[metric.category]) acc[metric.category] = [];
        acc[metric.category].push(metric);
        return acc;
    }, {} as Record<string, typeof availableMetrics>);

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                        <Button variant="outline" size="icon" asChild className="shrink-0">
                            <Link href="/dashboard/transport/analytics">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl sm:text-2xl font-bold truncate">Export Analytics Report</h1>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                Generate and download comprehensive analytics reports
                            </p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-xs sm:text-sm shrink-0">
                        Analytics Export
                    </Badge>
                </div>

                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {/* Export Format */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Download className="h-5 w-5" />
                                Export Format
                            </CardTitle>
                            <CardDescription>Choose your preferred report format</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup 
                                value={exportSettings.format} 
                                onValueChange={(value) => setExportSettings({...exportSettings, format: value})}
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
                                onValueChange={(value) => setExportSettings({...exportSettings, dateRange: value})}
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
                                            onChange={(e) => setExportSettings({...exportSettings, customStartDate: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endDate">End Date</Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={exportSettings.customEndDate}
                                            onChange={(e) => setExportSettings({...exportSettings, customEndDate: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Report Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Report Options
                            </CardTitle>
                            <CardDescription>Customize your report content</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="reportName">Report Name</Label>
                                <Input
                                    id="reportName"
                                    value={exportSettings.reportName}
                                    onChange={(e) => setExportSettings({...exportSettings, reportName: e.target.value})}
                                    placeholder="Enter report name"
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeCharts"
                                        checked={exportSettings.includeCharts}
                                        onCheckedChange={(checked) => setExportSettings({...exportSettings, includeCharts: !!checked})}
                                    />
                                    <Label htmlFor="includeCharts">Include charts and graphs</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeDriverData"
                                        checked={exportSettings.includeDriverData}
                                        onCheckedChange={(checked) => setExportSettings({...exportSettings, includeDriverData: !!checked})}
                                    />
                                    <Label htmlFor="includeDriverData">Include driver performance data</Label>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="includeVehicleData"
                                        checked={exportSettings.includeVehicleData}
                                        onCheckedChange={(checked) => setExportSettings({...exportSettings, includeVehicleData: !!checked})}
                                    />
                                    <Label htmlFor="includeVehicleData">Include vehicle utilization data</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Metrics Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Select Metrics to Include</CardTitle>
                        <CardDescription>Choose which analytics metrics to include in your report</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {Object.entries(metricsByCategory).map(([category, metrics]) => (
                                <div key={category}>
                                    <h4 className="font-medium capitalize mb-2 sm:mb-3 text-sm sm:text-base">{category} Metrics</h4>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                                        {metrics.map((metric) => (
                                            <div key={metric.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={metric.id}
                                                    checked={exportSettings.includeMetrics.includes(metric.id)}
                                                    onCheckedChange={() => handleMetricToggle(metric.id)}
                                                />
                                                <Label htmlFor={metric.id} className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm">
                                                    <metric.icon className="h-3 w-3 shrink-0" />
                                                    <span className="truncate">{metric.label}</span>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Email Delivery */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Email Delivery
                        </CardTitle>
                        <CardDescription>Optionally email the report after generation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="emailReport"
                                checked={exportSettings.emailReport}
                                onCheckedChange={(checked) => setExportSettings({...exportSettings, emailReport: !!checked})}
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
                                    onChange={(e) => setExportSettings({...exportSettings, emailAddress: e.target.value})}
                                    placeholder="Enter email address"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Export Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Export Summary</CardTitle>
                        <CardDescription>Review your export settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                            <div>
                                <Label className="text-xs sm:text-sm font-medium">Format</Label>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {formatOptions.find(f => f.value === exportSettings.format)?.label}
                                </p>
                            </div>
                            <div>
                                <Label className="text-xs sm:text-sm font-medium">Date Range</Label>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {dateRangeOptions.find(d => d.value === exportSettings.dateRange)?.label}
                                </p>
                            </div>
                            <div>
                                <Label className="text-xs sm:text-sm font-medium">Metrics</Label>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    {exportSettings.includeMetrics.length} selected
                                </p>
                            </div>
                            <div>
                                <Label className="text-xs sm:text-sm font-medium">Options</Label>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {[exportSettings.includeCharts && "Charts", exportSettings.includeDriverData && "Drivers", exportSettings.includeVehicleData && "Vehicles"].filter(Boolean).join(", ") || "Basic"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isExporting}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleExport} 
                        className="w-full sm:w-auto sm:min-w-32"
                        disabled={isExporting}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        {isExporting ? "Exporting..." : "Export Report"}
                    </Button>
                </div>
            </div>
        </div>
    );
}