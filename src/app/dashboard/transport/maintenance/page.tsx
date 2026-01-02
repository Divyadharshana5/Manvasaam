"use client";

import { motion, AnimatePresence } from "framer-motion";
import "@/styles/transport-animations.css";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Wrench,
    Truck,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Clock,
    ArrowLeft,
    Search,
    Plus,
    Filter,
    Download,
    Fuel,
    Battery,
    Gauge,
    Settings,
    Activity,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function MaintenancePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    // Handler functions for the action buttons
    const handleServiceDetails = (vehicleId: string) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            alert(`Service Details for ${vehicleId}\n\n` +
                `Model: ${vehicle.model}\n` +
                `Last Service: ${vehicle.lastService}\n` +
                `Next Service: ${vehicle.nextService}\n` +
                `Service Type: ${vehicle.serviceType}\n` +
                `Mileage: ${vehicle.mileage.toLocaleString()} km\n` +
                `Health Score: ${vehicle.healthScore}%\n` +
                `Maintenance Cost: ₹${vehicle.maintenanceCost.toLocaleString()}\n` +
                `Downtime: ${vehicle.downtime} days`);
        }
        console.log(`Opening service details for ${vehicleId}`);
    };

    const handleScheduleService = (vehicleId: string) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            const serviceDate = prompt(`Schedule Service for ${vehicleId}\n\nEnter service date (YYYY-MM-DD):`);
            if (serviceDate) {
                alert(`Service Scheduled Successfully!\n\n` +
                    `Vehicle: ${vehicleId} (${vehicle.model})\n` +
                    `Scheduled Date: ${serviceDate}\n` +
                    `Service Type: ${vehicle.serviceType}\n` +
                    `Estimated Cost: ₹${vehicle.maintenanceCost.toLocaleString()}\n\n` +
                    `A confirmation will be sent to the service center.`);
                console.log(`Service scheduled for ${vehicleId} on ${serviceDate}`);
            }
        }
    };

    const handleHealthReport = (vehicleId: string) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (vehicle) {
            const reportData = `
VEHICLE HEALTH REPORT
=====================
Vehicle ID: ${vehicleId}
Model: ${vehicle.model}
Overall Health Score: ${vehicle.healthScore}%

PERFORMANCE METRICS:
• Mileage: ${vehicle.mileage.toLocaleString()} km
• Fuel Efficiency: ${vehicle.fuelEfficiency} km/L
• Downtime: ${vehicle.downtime} days
• Status: ${vehicle.status.toUpperCase()}

MAINTENANCE STATUS:
• Last Service: ${vehicle.lastService}
• Next Service: ${vehicle.nextService}
• Service Type: ${vehicle.serviceType}

CURRENT ISSUES:
${vehicle.issues.length > 0 ? vehicle.issues.map(issue => `• ${issue}`).join('\n') : '• No issues reported'}

UPCOMING MAINTENANCE:
${vehicle.upcomingMaintenance.map(maintenance => `• ${maintenance}`).join('\n')}

COST ANALYSIS:
• Maintenance Cost: ₹${vehicle.maintenanceCost.toLocaleString()}
• Health Score Trend: ${vehicle.healthScore >= 80 ? 'Excellent' : vehicle.healthScore >= 60 ? 'Good' : 'Needs Attention'}
            `;
            
            alert(reportData);
            console.log(`Health report generated for ${vehicleId}:`, reportData);
        }
    };

    const handleNewScheduleService = () => {
        const availableVehicles = vehicles.map(v => `${v.id} (${v.model})`).join('\n');
        const selectedVehicle = prompt(`Schedule New Service\n\nAvailable Vehicles:\n${availableVehicles}\n\nEnter Vehicle ID:`);
        
        if (selectedVehicle) {
            const vehicle = vehicles.find(v => v.id === selectedVehicle.toUpperCase());
            if (vehicle) {
                const serviceDate = prompt(`Schedule Service for ${vehicle.id}\n\nEnter service date (YYYY-MM-DD):`);
                if (serviceDate) {
                    const serviceType = prompt(`Select Service Type:\n1. Regular Service\n2. Major Service\n3. Emergency Repair\n4. Preventive Maintenance\n\nEnter option (1-4):`);
                    const serviceTypes = ['Regular Service', 'Major Service', 'Emergency Repair', 'Preventive Maintenance'];
                    const selectedType = serviceTypes[parseInt(serviceType || '1') - 1] || 'Regular Service';
                    
                    alert(`Service Scheduled Successfully!\n\n` +
                        `Vehicle: ${vehicle.id} (${vehicle.model})\n` +
                        `Service Type: ${selectedType}\n` +
                        `Scheduled Date: ${serviceDate}\n` +
                        `Estimated Cost: ₹${vehicle.maintenanceCost.toLocaleString()}\n\n` +
                        `Service center has been notified and will contact you for confirmation.`);
                    console.log(`New service scheduled: ${vehicle.id} - ${selectedType} on ${serviceDate}`);
                }
            } else {
                alert('Vehicle not found. Please enter a valid Vehicle ID.');
            }
        }
    };

    const handleExportReport = () => {
        // Generate comprehensive maintenance report
        const reportDate = new Date().toLocaleDateString('en-IN');
        const reportTime = new Date().toLocaleTimeString('en-IN');
        
        // CSV Header
        let csvContent = "Fleet Maintenance Report\n";
        csvContent += `Generated on: ${reportDate} at ${reportTime}\n\n`;
        
        // Fleet Summary
        csvContent += "FLEET SUMMARY\n";
        csvContent += "Metric,Value\n";
        csvContent += `Total Vehicles,${totalVehicles}\n`;
        csvContent += `Active Vehicles,${activeVehicles}\n`;
        csvContent += `In Maintenance,${inMaintenance}\n`;
        csvContent += `Average Health Score,${avgHealthScore}%\n\n`;
        
        // Vehicle Details
        csvContent += "VEHICLE DETAILS\n";
        csvContent += "Vehicle ID,Model,Status,Health Score,Mileage (km),Fuel Efficiency (km/L),Last Service,Next Service,Service Type,Maintenance Cost (₹),Downtime (days),Issues,Upcoming Maintenance\n";
        vehicles.forEach(vehicle => {
            csvContent += `${vehicle.id},${vehicle.model},${vehicle.status},${vehicle.healthScore}%,${vehicle.mileage},${vehicle.fuelEfficiency},${vehicle.lastService},${vehicle.nextService},${vehicle.serviceType},${vehicle.maintenanceCost},${vehicle.downtime},"${vehicle.issues.join('; ')}","${vehicle.upcomingMaintenance.join('; ')}"\n`;
        });
        
        csvContent += "\n";
        
        // Maintenance Schedule
        csvContent += "UPCOMING MAINTENANCE SCHEDULE\n";
        csvContent += "Vehicle ID,Service Type,Date,Estimated Cost (₹),Duration,Priority,Description\n";
        maintenanceSchedule.forEach(schedule => {
            csvContent += `${schedule.vehicleId},${schedule.type},${schedule.date},${schedule.estimatedCost},${schedule.duration},${schedule.priority},"${schedule.description}"\n`;
        });
        
        csvContent += "\n";
        
        // Maintenance History
        csvContent += "MAINTENANCE HISTORY\n";
        csvContent += "Vehicle ID,Service Type,Date,Cost (₹),Duration,Status,Description\n";
        maintenanceHistory.forEach(history => {
            csvContent += `${history.vehicleId},${history.type},${history.date},${history.cost},${history.duration},${history.status},"${history.description}"\n`;
        });
        
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `Fleet_Maintenance_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('Maintenance report exported successfully');
        alert(`Maintenance Report Exported!\n\nFile: Fleet_Maintenance_Report_${new Date().toISOString().split('T')[0]}.csv\n\nThe report includes:\n• Fleet Summary\n• Vehicle Details\n• Maintenance Schedule\n• Maintenance History`);
    };

    const vehicles = [
        {
            id: "TRK-001",
            model: "Tata Ace",
            status: "active",
            mileage: 45230,
            lastService: "2024-01-10",
            nextService: "2024-02-10",
            serviceType: "Regular",
            healthScore: 85,
            fuelEfficiency: 12.5,
            issues: [],
            upcomingMaintenance: ["Oil Change", "Brake Inspection"],
            maintenanceCost: 8500,
            downtime: 0
        },
        {
            id: "TRK-002",
            model: "Mahindra Bolero",
            status: "maintenance",
            mileage: 67890,
            lastService: "2024-01-15",
            nextService: "2024-01-16",
            serviceType: "Major",
            healthScore: 65,
            fuelEfficiency: 11.2,
            issues: ["Engine Check", "Transmission Service"],
            upcomingMaintenance: ["Complete Overhaul"],
            maintenanceCost: 25000,
            downtime: 2
        },
        {
            id: "TRK-003",
            model: "Ashok Leyland Dost",
            status: "needs-attention",
            mileage: 52100,
            lastService: "2024-01-08",
            nextService: "2024-02-08",
            serviceType: "Regular",
            healthScore: 72,
            fuelEfficiency: 10.8,
            issues: ["Tire Replacement", "AC Service"],
            upcomingMaintenance: ["Tire Change", "AC Repair"],
            maintenanceCost: 12000,
            downtime: 0
        },
        {
            id: "TRK-004",
            model: "Tata Super Ace",
            status: "active",
            mileage: 38750,
            lastService: "2024-01-12",
            nextService: "2024-02-12",
            serviceType: "Regular",
            healthScore: 92,
            fuelEfficiency: 13.1,
            issues: [],
            upcomingMaintenance: ["Routine Check"],
            maintenanceCost: 6500,
            downtime: 0
        }
    ];

    const maintenanceSchedule = [
        {
            vehicleId: "TRK-002",
            type: "Major Service",
            date: "2024-01-16",
            estimatedCost: 25000,
            duration: "2 days",
            priority: "high",
            description: "Complete engine overhaul and transmission service"
        },
        {
            vehicleId: "TRK-003",
            type: "Tire Replacement",
            date: "2024-01-18",
            estimatedCost: 8000,
            duration: "4 hours",
            priority: "medium",
            description: "Replace all four tires and wheel alignment"
        },
        {
            vehicleId: "TRK-001",
            type: "Oil Change",
            date: "2024-01-20",
            estimatedCost: 2500,
            duration: "2 hours",
            priority: "low",
            description: "Engine oil and filter replacement"
        }
    ];

    const maintenanceHistory = [
        {
            vehicleId: "TRK-004",
            type: "Regular Service",
            date: "2024-01-12",
            cost: 6500,
            duration: "3 hours",
            status: "completed",
            description: "Oil change, brake check, general inspection"
        },
        {
            vehicleId: "TRK-001",
            type: "Brake Service",
            date: "2024-01-10",
            cost: 8500,
            duration: "5 hours",
            status: "completed",
            description: "Brake pad replacement and brake fluid change"
        },
        {
            vehicleId: "TRK-003",
            type: "AC Repair",
            date: "2024-01-08",
            cost: 4500,
            duration: "4 hours",
            status: "completed",
            description: "AC compressor repair and gas refill"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "default";
            case "maintenance": return "destructive";
            case "needs-attention": return "secondary";
            default: return "outline";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high": return "destructive";
            case "medium": return "secondary";
            case "low": return "outline";
            default: return "outline";
        }
    };

    const getHealthColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter(v => v.status === "active").length;
    const inMaintenance = vehicles.filter(v => v.status === "maintenance").length;
    const avgHealthScore = Math.round(vehicles.reduce((sum, v) => sum + v.healthScore, 0) / vehicles.length);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4 }
        },
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div 
            className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/dashboard/transport">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold tracking-tight">Fleet Maintenance</h1>
                    <p className="text-muted-foreground">Monitor and manage vehicle maintenance schedules and health</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExportReport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                    <Button onClick={handleNewScheduleService}>
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Service
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Fleet</p>
                                <p className="text-2xl font-bold">{totalVehicles}</p>
                            </div>
                            <Truck className="h-8 w-8 text-blue-500 icon-bounce" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Vehicles</p>
                                <p className="text-2xl font-bold text-green-600">{activeVehicles}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500 icon-bounce" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">In Maintenance</p>
                                <p className="text-2xl font-bold text-red-600">{inMaintenance}</p>
                            </div>
                            <Wrench className="h-8 w-8 text-red-500 icon-bounce" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Health Score</p>
                                <p className="text-2xl font-bold text-purple-600">{avgHealthScore}%</p>
                            </div>
                            <Activity className="h-8 w-8 text-purple-500 icon-bounce" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Fleet Overview</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    {/* Search */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                                <Input
                                    placeholder="Search vehicles by ID or model..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-10"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
                                        aria-label="Clear search"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vehicle Fleet Status */}
                    <div className="grid gap-4">
                        {filteredVehicles.map((vehicle) => (
                            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Truck className="h-6 w-6 text-blue-600" />
                                            <div>
                                                <h3 className="font-semibold text-lg">{vehicle.id}</h3>
                                                <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                                            </div>
                                        </div>
                                        <Badge variant={getStatusColor(vehicle.status)}>
                                            {vehicle.status}
                                        </Badge>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-4 mb-4">
                                        {/* Health Score */}
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Gauge className="h-4 w-4" />
                                                <span className="text-sm font-medium">Health Score</span>
                                            </div>
                                            <div className={`text-2xl font-bold ${getHealthColor(vehicle.healthScore)}`}>
                                                {vehicle.healthScore}%
                                            </div>
                                            <Progress value={vehicle.healthScore} className="mt-2 h-2" />
                                        </div>

                                        {/* Mileage */}
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Activity className="h-4 w-4" />
                                                <span className="text-sm font-medium">Mileage</span>
                                            </div>
                                            <div className="text-lg font-bold">{vehicle.mileage.toLocaleString()}</div>
                                            <p className="text-xs text-muted-foreground">km</p>
                                        </div>

                                        {/* Fuel Efficiency */}
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Fuel className="h-4 w-4" />
                                                <span className="text-sm font-medium">Efficiency</span>
                                            </div>
                                            <div className="text-lg font-bold">{vehicle.fuelEfficiency}</div>
                                            <p className="text-xs text-muted-foreground">km/L</p>
                                        </div>

                                        {/* Next Service */}
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-sm font-medium">Next Service</span>
                                            </div>
                                            <div className="text-sm font-bold">{vehicle.nextService}</div>
                                            <p className="text-xs text-muted-foreground">{vehicle.serviceType}</p>
                                        </div>
                                    </div>

                                    {/* Issues & Maintenance */}
                                    <div className="grid gap-4 md:grid-cols-2 mb-4">
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Current Issues</h4>
                                            {vehicle.issues.length > 0 ? (
                                                <div className="space-y-1">
                                                    {vehicle.issues.map((issue, index) => (
                                                        <Badge key={index} variant="destructive" className="text-xs mr-1">
                                                            {issue}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-green-600">No issues reported</p>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Upcoming Maintenance</h4>
                                            <div className="space-y-1">
                                                {vehicle.upcomingMaintenance.map((maintenance, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs mr-1">
                                                        {maintenance}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleServiceDetails(vehicle.id)}>
                                            <Settings className="h-4 w-4 mr-2" />
                                            Service Details
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleScheduleService(vehicle.id)}>
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Schedule Service
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleHealthReport(vehicle.id)}>
                                            <Activity className="h-4 w-4 mr-2" />
                                            Health Report
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="schedule" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Upcoming Maintenance Schedule</CardTitle>
                            <CardDescription>Planned maintenance activities for your fleet</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {maintenanceSchedule.map((schedule, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <Calendar className="h-5 w-5 mx-auto mb-1" />
                                                <p className="text-sm font-medium">{schedule.date}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{schedule.vehicleId} - {schedule.type}</h4>
                                                <p className="text-sm text-muted-foreground">{schedule.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span className="text-xs">{schedule.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant={getPriorityColor(schedule.priority)} className="mb-2">
                                                {schedule.priority} priority
                                            </Badge>
                                            <p className="font-semibold">₹{schedule.estimatedCost.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Maintenance History</CardTitle>
                            <CardDescription>Recent maintenance activities and costs</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {maintenanceHistory.map((history, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <div>
                                                <h4 className="font-semibold">{history.vehicleId} - {history.type}</h4>
                                                <p className="text-sm text-muted-foreground">{history.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span className="text-xs">{history.date}</span>
                                                    <Clock className="h-3 w-3 ml-2" />
                                                    <span className="text-xs">{history.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className="mb-2">
                                                {history.status}
                                            </Badge>
                                            <p className="font-semibold">₹{history.cost.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Maintenance Costs</CardTitle>
                                <CardDescription>Monthly maintenance expenditure</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">January 2024</span>
                                        <span className="font-semibold">₹47,000</span>
                                    </div>
                                    <Progress value={75} className="h-2" />
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">December 2023</span>
                                        <span className="font-semibold">₹32,500</span>
                                    </div>
                                    <Progress value={52} className="h-2" />
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">November 2023</span>
                                        <span className="font-semibold">₹28,000</span>
                                    </div>
                                    <Progress value={45} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Fleet Health Trends</CardTitle>
                                <CardDescription>Average health scores over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <p className="text-2xl font-bold text-green-600">78%</p>
                                        <p className="text-sm text-muted-foreground">Average Fleet Health</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <p className="text-lg font-bold text-blue-600">96%</p>
                                            <p className="text-xs text-muted-foreground">Uptime</p>
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <p className="text-lg font-bold text-purple-600">12.1</p>
                                            <p className="text-xs text-muted-foreground">Avg Efficiency</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </motion.div>

    );
}