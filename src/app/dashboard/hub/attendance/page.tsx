"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
  Search,
  Filter,
  Download,
  UserCheck,
  AlertCircle,
} from "lucide-react";

// Mock data for staff members
const staffMembers = [
  {
    id: "1",
    name: "Amit Kumar",
    role: "Collection Agent",
    phone: "+91 98765 43210",
    avatar: "/api/placeholder/40/40",
    status: "present",
    checkInTime: "09:15 AM",
    checkOutTime: null,
    workingHours: "8.5",
    todayTasks: 5,
    completedTasks: 3,
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Delivery Executive",
    phone: "+91 87654 32109",
    avatar: "/api/placeholder/40/40",
    status: "present",
    checkInTime: "09:00 AM",
    checkOutTime: null,
    workingHours: "9.0",
    todayTasks: 8,
    completedTasks: 6,
  },
  {
    id: "3",
    name: "Rajesh Patel",
    role: "Inventory Manager",
    phone: "+91 76543 21098",
    avatar: "/api/placeholder/40/40",
    status: "absent",
    checkInTime: null,
    checkOutTime: null,
    workingHours: "0",
    todayTasks: 4,
    completedTasks: 0,
  },
  {
    id: "4",
    name: "Sunita Devi",
    role: "Quality Inspector",
    phone: "+91 65432 10987",
    avatar: "/api/placeholder/40/40",
    status: "present",
    checkInTime: "08:45 AM",
    checkOutTime: null,
    workingHours: "9.25",
    todayTasks: 6,
    completedTasks: 4,
  },
];

// Mock attendance history
const attendanceHistory = [
  {
    date: "2024-01-15",
    staffId: "1",
    staffName: "Amit Kumar",
    checkIn: "09:15 AM",
    checkOut: "06:30 PM",
    workingHours: "8.5",
    status: "present",
    overtime: "0.5",
  },
  {
    date: "2024-01-15",
    staffId: "2",
    staffName: "Priya Sharma",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    workingHours: "9.0",
    status: "present",
    overtime: "0",
  },
  {
    date: "2024-01-15",
    staffId: "3",
    staffName: "Rajesh Patel",
    checkIn: "-",
    checkOut: "-",
    workingHours: "0",
    status: "absent",
    overtime: "0",
  },
  {
    date: "2024-01-14",
    staffId: "1",
    staffName: "Amit Kumar",
    checkIn: "09:00 AM",
    checkOut: "06:00 PM",
    workingHours: "9.0",
    status: "present",
    overtime: "0",
  },
];

export default function AttendancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState("today");

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = attendanceHistory.filter(record =>
    record.date === selectedDate &&
    (record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     record.status.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const presentCount = staffMembers.filter(staff => staff.status === "present").length;
  const absentCount = staffMembers.filter(staff => staff.status === "absent").length;
  const totalTasks = staffMembers.reduce((sum, staff) => sum + staff.todayTasks, 0);
  const completedTasks = staffMembers.reduce((sum, staff) => sum + staff.completedTasks, 0);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Attendance</h1>
          <p className="text-muted-foreground">
            Track and manage hub staff attendance and activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <p className="text-xs text-muted-foreground">
              Out of {staffMembers.length} staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-muted-foreground">
              Staff members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Assigned</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              Total for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedTasks / totalTasks) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Today's Attendance
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Attendance History
          </TabsTrigger>
        </TabsList>

        {/* Today's Attendance */}
        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStaff.map((staff) => (
              <Card key={staff.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={staff.avatar} />
                        <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{staff.name}</CardTitle>
                        <CardDescription>{staff.role}</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={staff.status === "present" ? "default" : "destructive"}
                      className={staff.status === "present" ? "bg-green-100 text-green-800" : ""}
                    >
                      {staff.status === "present" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {staff.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Check In</p>
                      <p className="font-medium">{staff.checkInTime || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Working Hours</p>
                      <p className="font-medium">{staff.workingHours}h</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tasks Progress</span>
                      <span>{staff.completedTasks}/{staff.todayTasks}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(staff.completedTasks / staff.todayTasks) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Users className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{staff.name} - Daily Report</DialogTitle>
                          <DialogDescription>
                            Detailed attendance and task information
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Role</p>
                              <p className="text-sm text-muted-foreground">{staff.role}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Phone</p>
                              <p className="text-sm text-muted-foreground">{staff.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Check In Time</p>
                              <p className="text-sm text-muted-foreground">{staff.checkInTime || "Not checked in"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Working Hours</p>
                              <p className="text-sm text-muted-foreground">{staff.workingHours} hours</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Today's Tasks</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center p-2 bg-muted rounded">
                                <span className="text-sm">Collect from Farmer A</span>
                                <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-muted rounded">
                                <span className="text-sm">Deliver to Customer B</span>
                                <Badge variant="secondary">In Progress</Badge>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-muted rounded">
                                <span className="text-sm">Quality Check Batch C</span>
                                <Badge variant="outline">Pending</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" className="flex-1">
                      <Clock className="mr-2 h-4 w-4" />
                      Track
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Attendance History */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Historical attendance data for {selectedDate}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Working Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Overtime</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.staffName}</TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>{record.workingHours}h</TableCell>
                      <TableCell>
                        <Badge 
                          variant={record.status === "present" ? "default" : "destructive"}
                          className={record.status === "present" ? "bg-green-100 text-green-800" : ""}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.overtime}h</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}