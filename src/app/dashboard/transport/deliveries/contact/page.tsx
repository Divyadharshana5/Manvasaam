"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ArrowLeft,
    Phone,
    MessageCircle,
    User,
    Star,
    Clock,
    MapPin,
    Truck,
    Send,
    PhoneCall,
    Video,
    Mail,
    AlertTriangle,
    CheckCircle,
    History,
    Mic,
    Image,
    Paperclip
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ContactDriver() {
    const [activeTab, setActiveTab] = useState("call");
    const [message, setMessage] = useState("");
    const [urgencyLevel, setUrgencyLevel] = useState("normal");

    // Mock driver data - in real app, this would come from URL params
    const driver = {
        name: "Raj Kumar",
        phone: "+91 98765 12345",
        email: "raj.kumar@swiftlogistics.com",
        rating: 4.8,
        experience: "5 years",
        currentDelivery: "DEL-001",
        status: "active",
        location: "Highway 45, Near Toll Plaza",
        photo: "/api/placeholder/60/60",
        languages: ["Hindi", "English", "Tamil"],
        emergencyContact: "+91 98765 54321"
    };

    const recentCommunications = [
        {
            type: "call",
            time: "10:30 AM",
            duration: "2 min 15 sec",
            status: "completed",
            note: "Confirmed pickup completion"
        },
        {
            type: "message",
            time: "09:45 AM",
            content: "Starting pickup from Green Valley Farm",
            status: "delivered"
        },
        {
            type: "call",
            time: "09:15 AM",
            duration: "1 min 30 sec",
            status: "completed",
            note: "Route confirmation"
        }
    ];

    const quickMessages = [
        "What's your current location?",
        "How much time to reach destination?",
        "Any issues with the delivery?",
        "Please confirm pickup completion",
        "Update on delivery status",
        "Need assistance with route?"
    ];

    const handleCall = () => {
        // Initiate phone call
        window.open(`tel:${driver.phone}`);
        // Log the call attempt
        console.log(`Initiating call to ${driver.name} at ${driver.phone}`);
    };

    const handleVideoCall = () => {
        // In a real app, this would integrate with video calling service
        alert(`Initiating video call with ${driver.name}...`);
        console.log(`Video call initiated with ${driver.name}`);
    };

    const handleSendEmail = () => {
        const subject = (document.getElementById('subject') as HTMLInputElement)?.value || `Delivery Update - ${driver.currentDelivery}`;
        const body = (document.getElementById('emailBody') as HTMLTextAreaElement)?.value || '';
        
        // Open default email client
        const mailtoLink = `mailto:${driver.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);
        console.log(`Email initiated to ${driver.email}`);
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            // In real app, this would send via SMS/messaging service
            const smsLink = `sms:${driver.phone}?body=${encodeURIComponent(message)}`;
            window.open(smsLink);
            console.log("Sending message:", message);
            setMessage("");
            alert("Message sent successfully!");
        }
    };

    const handleQuickMessage = (quickMsg: string) => {
        setMessage(quickMsg);
    };

    const handleEmergencyCall = () => {
        // Call emergency contact
        window.open(`tel:${driver.emergencyContact}`);
        console.log(`Emergency call initiated to ${driver.emergencyContact}`);
        alert("Initiating emergency call...");
    };

    const handleVoiceMessage = () => {
        alert("Voice message recording started...");
        console.log("Voice message feature activated");
    };

    const handleImageAttachment = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                alert(`Image selected: ${file.name}`);
                console.log("Image attachment:", file.name);
            }
        };
        input.click();
    };

    const handleFileAttachment = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                alert(`File selected: ${file.name}`);
                console.log("File attachment:", file.name);
            }
        };
        input.click();
    };

    const handleTrackLive = () => {
        // Navigate to live tracking page
        window.open(`/dashboard/transport/deliveries/tracking?id=${driver.currentDelivery}`, '_blank');
        console.log(`Opening live tracking for delivery ${driver.currentDelivery}`);
    };

    const handleViewDeliveryDetails = () => {
        // Navigate to delivery details page
        window.open(`/dashboard/transport/deliveries/details?id=${driver.currentDelivery}`, '_blank');
        console.log(`Opening delivery details for ${driver.currentDelivery}`);
    };

    const handleReportIssue = () => {
        // In a real app, this would open an issue reporting form
        const issueTypes = ['Vehicle breakdown', 'Route blocked', 'Customer unavailable', 'Package damaged', 'Weather conditions', 'Other'];
        const selectedIssue = prompt(`Report an issue:\n\nSelect issue type:\n${issueTypes.map((issue, index) => `${index + 1}. ${issue}`).join('\n')}\n\nEnter issue number (1-${issueTypes.length}):`);
        
        if (selectedIssue && parseInt(selectedIssue) >= 1 && parseInt(selectedIssue) <= issueTypes.length) {
            const issueType = issueTypes[parseInt(selectedIssue) - 1];
            alert(`Issue reported: ${issueType}\nDelivery: ${driver.currentDelivery}\nDriver: ${driver.name}\n\nSupport team has been notified.`);
            console.log(`Issue reported: ${issueType} for delivery ${driver.currentDelivery}`);
        }
    };

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
                            <h1 className="text-2xl font-bold">Contact Driver</h1>
                            <p className="text-muted-foreground">
                                Communicate with {driver.name} for delivery {driver.currentDelivery}
                            </p>
                        </div>
                    </div>
                    <Badge variant={driver.status === "active" ? "default" : "secondary"}>
                        {driver.status === "active" ? "Online" : "Offline"}
                    </Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Communication Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Communication Tabs */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-500" />
                                    </div>
                                    <div>
                                        <CardTitle>{driver.name}</CardTitle>
                                        <CardDescription>
                                            Professional Driver • {driver.experience} experience
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Tab Navigation */}
                                <div className="flex gap-2 mb-6">
                                    <Button
                                        variant={activeTab === "call" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setActiveTab("call")}
                                    >
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call
                                    </Button>
                                    <Button
                                        variant={activeTab === "message" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setActiveTab("message")}
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Message
                                    </Button>
                                    <Button
                                        variant={activeTab === "email" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setActiveTab("email")}
                                    >
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email
                                    </Button>
                                </div>

                                {/* Call Tab */}
                                {activeTab === "call" && (
                                    <div className="space-y-4">
                                        <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-lg">
                                            <Phone className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">Make a Call</h3>
                                            <p className="text-muted-foreground mb-4">
                                                Connect directly with {driver.name}
                                            </p>
                                            <div className="flex justify-center gap-3">
                                                <Button onClick={handleCall} className="min-w-32">
                                                    <PhoneCall className="h-4 w-4 mr-2" />
                                                    Call Now
                                                </Button>
                                                <Button variant="outline" onClick={handleVideoCall}>
                                                    <Video className="h-4 w-4 mr-2" />
                                                    Video Call
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <Label className="font-medium">Primary Phone</Label>
                                                <p className="text-muted-foreground">{driver.phone}</p>
                                            </div>
                                            <div>
                                                <Label className="font-medium">Emergency Contact</Label>
                                                <p className="text-muted-foreground">{driver.emergencyContact}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Message Tab */}
                                {activeTab === "message" && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="urgency">Message Priority</Label>
                                            <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low Priority</SelectItem>
                                                    <SelectItem value="normal">Normal</SelectItem>
                                                    <SelectItem value="high">High Priority</SelectItem>
                                                    <SelectItem value="urgent">Urgent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="message">Message</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Type your message here..."
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                rows={4}
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button onClick={handleSendMessage} className="flex-1">
                                                <Send className="h-4 w-4 mr-2" />
                                                Send Message
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={handleVoiceMessage}>
                                                <Mic className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={handleImageAttachment}>
                                                <Image className="h-4 w-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={handleFileAttachment}>
                                                <Paperclip className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Quick Messages */}
                                        <div>
                                            <Label className="text-sm font-medium">Quick Messages</Label>
                                            <div className="grid grid-cols-1 gap-2 mt-2">
                                                {quickMessages.map((quickMsg, index) => (
                                                    <Button
                                                        key={index}
                                                        variant="outline"
                                                        size="sm"
                                                        className="justify-start text-left h-auto p-3"
                                                        onClick={() => handleQuickMessage(quickMsg)}
                                                    >
                                                        {quickMsg}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Email Tab */}
                                {activeTab === "email" && (
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="subject">Subject</Label>
                                            <Input
                                                id="subject"
                                                placeholder="Enter email subject"
                                                defaultValue={`Delivery Update - ${driver.currentDelivery}`}
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="emailBody">Message</Label>
                                            <Textarea
                                                id="emailBody"
                                                placeholder="Type your email message here..."
                                                rows={6}
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button className="flex-1" onClick={handleSendEmail}>
                                                <Mail className="h-4 w-4 mr-2" />
                                                Send Email
                                            </Button>
                                            <Button variant="outline" onClick={handleFileAttachment}>
                                                <Paperclip className="h-4 w-4 mr-2" />
                                                Attach File
                                            </Button>
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            <p>Email will be sent to: {driver.email}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Communication History */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Recent Communications
                                </CardTitle>
                                <CardDescription>Your recent interactions with {driver.name}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentCommunications.map((comm, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                            <div className="p-2 bg-gray-100 rounded-full">
                                                {comm.type === "call" && <Phone className="h-4 w-4" />}
                                                {comm.type === "message" && <MessageCircle className="h-4 w-4" />}
                                                {comm.type === "email" && <Mail className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium capitalize">{comm.type}</span>
                                                    <span className="text-sm text-muted-foreground">{comm.time}</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {comm.status}
                                                    </Badge>
                                                </div>
                                                {comm.duration && (
                                                    <p className="text-sm text-muted-foreground">Duration: {comm.duration}</p>
                                                )}
                                                {comm.content && (
                                                    <p className="text-sm">{comm.content}</p>
                                                )}
                                                {comm.note && (
                                                    <p className="text-sm text-muted-foreground">{comm.note}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Driver Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Driver Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <User className="h-8 w-8 text-gray-500" />
                                    </div>
                                    <h3 className="font-semibold">{driver.name}</h3>
                                    <div className="flex items-center justify-center gap-1 mt-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm">{driver.rating}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Experience</span>
                                        <span className="font-medium">{driver.experience}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Languages</span>
                                        <span className="font-medium">{driver.languages.join(", ")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status</span>
                                        <Badge variant={driver.status === "active" ? "default" : "secondary"}>
                                            {driver.status}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Current Location */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Current Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{driver.location}</p>
                                <Button size="sm" className="w-full mt-3" onClick={handleTrackLive}>
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Track Live
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Current Delivery */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Current Delivery
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Delivery ID</Label>
                                    <p className="text-sm">{driver.currentDelivery}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <Badge variant="secondary" className="ml-2">In Transit</Badge>
                                </div>
                                <Button size="sm" className="w-full" onClick={handleViewDeliveryDetails}>
                                    View Delivery Details
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Emergency Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <AlertTriangle className="h-5 w-5" />
                                    Emergency
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="destructive" size="sm" className="w-full" onClick={handleEmergencyCall}>
                                    <Phone className="h-4 w-4 mr-2" />
                                    Emergency Call
                                </Button>
                                <Button variant="outline" size="sm" className="w-full" onClick={handleReportIssue}>
                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                    Report Issue
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}