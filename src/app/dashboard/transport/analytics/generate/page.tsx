"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    BarChart3,
    FileText,
    Calendar,
    TrendingUp,
    Activity,
    Fuel,
    DollarSign,
    Users,
    Clock,
    Target,
    Zap,
    CheckCircle,
    Loader2,
    Eye,
    Download,
    Share2
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function GenerateReport() {
    const [reportSettings, setReportSettings] = useState({
        reportType: "comprehensive",
        title: "",
        description: "",
        dateRange: "month",
        customStartDate: "",
        customEndDate: "",
        includeExecutiveSummary: true,
        includeRecommendations: true,
        includeComparisons: true,
        focusAreas: ["performance", "efficiency"],
        reportFrequency: "monthly"
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);

    const reportTypes = [
        { 
            value: "comprehensive", 
            label: "Comprehensive Report", 
            description: "Complete analytics with all metrics and insights",
            duration: "5-7 minutes"
        },
        { 
            value: "executive", 
            label: "Executive Summary", 
            description: "High-level overview for management",
            duration: "2-3 minutes"
        },
        { 
            value: "operational", 
            label: "Operational Report", 
            description: "Detailed operational metrics and KPIs",
            duration: "3-4 minutes"
        },
        { 
            value: "financial", 
            label: "Financial Analysis", 
            description: "Revenue, costs, and financial performance",
            duration: "3-4 minutes"
        }
    ];

    const focusAreaOptions = [
        { id: "performance", label: "Performance Metrics", icon: TrendingUp },
        { id: "efficiency", label: "Efficiency Analysis", icon: Zap },
        { id: "financial", label: "Financial Analysis", icon: DollarSign },
        { id: "operations", label: "Operational Insights", icon: Activity },
        { id: "drivers", label: "Driver Performance", icon: Users },
        { id: "fleet", label: "Fleet Utilization", icon: Activity },
        { id: "customer", label: "Customer Satisfaction", icon: Target },
        { id: "fuel", label: "Fuel Optimization", icon: Fuel }
    ];

    const generationSteps = [
        "Collecting data from all sources...",
        "Analyzing performance metrics...",
        "Generating insights and trends...",
        "Creating visualizations...",
        "Compiling recommendations...",
        "Finalizing report structure...",
        "Report generation complete!"
    ];

    const handleFocusAreaToggle = (areaId: string) => {
        setReportSettings(prev => ({
            ...prev,
            focusAreas: prev.focusAreas.includes(areaId)
                ? prev.focusAreas.filter(a => a !== areaId)
                : [...prev.focusAreas, areaId]
        }));
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        setGenerationStep(0);

        try {
            // Simulate report generation with progress steps
            for (let i = 0; i < generationSteps.length; i++) {
                setGenerationStep(i);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            console.log('Generating report with settings:', reportSettings);
            
            // Show success and redirect
            setTimeout(() => {
                alert('Report generated successfully! You can now view, download, or share your report.');
                // In a real app, this would redirect to the generated report view
                window.location.href = '/dashboard/transport/analytics';
            }, 1000);

        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Please try again.');
        } finally {
            setTimeout(() => {
                setIsGenerating(false);
                setGenerationStep(0);
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen w-full overflow-auto">
            <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/dashboard/transport/analytics">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Generate Analytics Report</h1>
                            <p className="text-muted-foreground">
                                Create comprehensive analytics reports with AI-powered insights
                            </p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                        AI-Powered
                    </Badge>
                </div>

                {isGenerating ? (
                    /* Generation Progress */
                    <Card className="mx-auto max-w-2xl">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                Generating Your Report
                            </CardTitle>
                            <CardDescription>
                                Please wait while we analyze your data and create insights
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {generationSteps.map((step, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                            index < generationStep ? 'bg-green-500' :
                                            index === generationStep ? 'bg-blue-500' : 'bg-gray-200'
                                        }`}>
                                            {index < generationStep ? (
                                                <CheckCircle className="h-4 w-4 text-white" />
                                            ) : index === generationStep ? (
                                                <Loader2 className="h-4 w-4 text-white animate-spin" />
                                            ) : (
                                                <span className="text-xs text-gray-500">{index + 1}</span>
                                            )}
                                        </div>
                                        <span className={`text-sm ${
                                            index <= generationStep ? 'text-foreground' : 'text-muted-foreground'
                                        }`}>
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="text-center">
                                <div className="text-sm text-muted-foreground">
                                    Step {generationStep + 1} of {generationSteps.length}
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${((generationStep + 1) / generationSteps.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Report Configuration */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Report Type */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Report Type
                                    </CardTitle>
                                    <CardDescription>Choose the type of report you want to generate</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-3">
                                        {reportTypes.map((type) => (
                                            <div
                                                key={type.value}
                                                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                                    reportSettings.reportType === type.value
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                                onClick={() => setReportSettings({...reportSettings, reportType: type.value})}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">{type.label}</h4>
                                                        <p className="text-sm text-muted-foreground">{type.description}</p>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs">
                                                        {type.duration}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Report Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Report Details
                                    </CardTitle>
                                    <CardDescription>Customize your report title and description</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="reportTitle">Report Title</Label>
                                        <Input
                                            id="reportTitle"
                                            placeholder="e.g., Monthly Transport Analytics Report"
                                            value={reportSettings.title}
                                            onChange={(e) => setReportSettings({...reportSettings, title: e.target.value})}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="reportDescription">Description (Optional)</Label>
                                        <Textarea
                                            id="reportDescription"
                                            placeholder="Brief description of the report purpose and scope..."
                                            value={reportSettings.description}
                                            onChange={(e) => setReportSettings({...reportSettings, description: e.target.value})}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="dateRange">Date Range</Label>
                                            <Select value={reportSettings.dateRange} onValueChange={(value) => setReportSettings({...reportSettings, dateRange: value})}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select range" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="week">This Week</SelectItem>
                                                    <SelectItem value="month">This Month</SelectItem>
                                                    <SelectItem value="quarter">This Quarter</SelectItem>
                                                    <SelectItem value="year">This Year</SelectItem>
                                                    <SelectItem value="custom">Custom Range</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="frequency">Report Frequency</Label>
                                            <Select value={reportSettings.reportFrequency} onValueChange={(value) => setReportSettings({...reportSettings, reportFrequency: value})}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select frequency" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="daily">Daily</SelectItem>
                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {reportSettings.dateRange === "custom" && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="startDate">Start Date</Label>
                                                <Input
                                                    id="startDate"
                                                    type="date"
                                                    value={reportSettings.customStartDate}
                                                    onChange={(e) => setReportSettings({...reportSettings, customStartDate: e.target.value})}
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="endDate">End Date</Label>
                                                <Input
                                                    id="endDate"
                                                    type="date"
                                                    value={reportSettings.customEndDate}
                                                    onChange={(e) => setReportSettings({...reportSettings, customEndDate: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Focus Areas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Focus Areas
                                    </CardTitle>
                                    <CardDescription>Select the key areas to emphasize in your report</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {focusAreaOptions.map((area) => (
                                            <div key={area.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={area.id}
                                                    checked={reportSettings.focusAreas.includes(area.id)}
                                                    onCheckedChange={() => handleFocusAreaToggle(area.id)}
                                                />
                                                <Label htmlFor={area.id} className="flex items-center gap-2 cursor-pointer text-sm">
                                                    <area.icon className="h-3 w-3" />
                                                    {area.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Report Options */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Advanced Options</CardTitle>
                                    <CardDescription>Additional features to include in your report</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="executiveSummary"
                                            checked={reportSettings.includeExecutiveSummary}
                                            onCheckedChange={(checked) => setReportSettings({...reportSettings, includeExecutiveSummary: !!checked})}
                                        />
                                        <Label htmlFor="executiveSummary">Include executive summary</Label>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="recommendations"
                                            checked={reportSettings.includeRecommendations}
                                            onCheckedChange={(checked) => setReportSettings({...reportSettings, includeRecommendations: !!checked})}
                                        />
                                        <Label htmlFor="recommendations">Include AI-powered recommendations</Label>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="comparisons"
                                            checked={reportSettings.includeComparisons}
                                            onCheckedChange={(checked) => setReportSettings({...reportSettings, includeComparisons: !!checked})}
                                        />
                                        <Label htmlFor="comparisons">Include period-over-period comparisons</Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Report Preview */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        Report Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
                                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="font-semibold mb-2">Report Preview</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Preview will appear here after generation
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Report Type:</span>
                                            <span className="font-medium capitalize">{reportSettings.reportType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Focus Areas:</span>
                                            <span className="font-medium">{reportSettings.focusAreas.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Date Range:</span>
                                            <span className="font-medium capitalize">{reportSettings.dateRange}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Generation Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Generate Report</CardTitle>
                                    <CardDescription>Create your analytics report</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button 
                                        className="w-full" 
                                        onClick={handleGenerateReport}
                                        disabled={!reportSettings.reportType}
                                    >
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        Generate Report
                                    </Button>
                                    
                                    <div className="text-xs text-muted-foreground text-center">
                                        Estimated time: {reportTypes.find(t => t.value === reportSettings.reportType)?.duration || "3-5 minutes"}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                                        <Link href="/dashboard/transport/analytics/export">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export Existing Data
                                        </Link>
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share Template
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}