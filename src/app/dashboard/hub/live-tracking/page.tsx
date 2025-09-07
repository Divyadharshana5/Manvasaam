'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Truck, Clock, CheckCircle, AlertCircle, RefreshCw, Phone, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface TrackingData {
  id: string
  farmerName: string
  product: string
  quantity: string
  currentLocation: string
  estimatedArrival: string
  status: 'in_transit' | 'arriving' | 'arrived' | 'delayed'
  distance: string
  lastUpdate: string
  vehicleNumber: string
}

export default function LiveTrackingPage() {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([
    {
      id: 'TRK001',
      farmerName: 'Rajesh Kumar',
      product: 'Organic Tomatoes',
      quantity: '50 kg',
      currentLocation: 'Highway NH-48, 5km from hub',
      estimatedArrival: '10:30 AM',
      status: 'in_transit',
      distance: '5.2 km',
      lastUpdate: '2 min ago',
      vehicleNumber: 'MH 12 AB 1234'
    },
    {
      id: 'TRK002',
      farmerName: 'Priya Sharma',
      product: 'Fresh Spinach',
      quantity: '25 kg',
      currentLocation: 'Hub Gate - Arriving',
      estimatedArrival: '10:15 AM',
      status: 'arriving',
      distance: '0.1 km',
      lastUpdate: '30 sec ago',
      vehicleNumber: 'MH 14 CD 5678'
    },
    {
      id: 'TRK003',
      farmerName: 'Amit Patel',
      product: 'Carrots',
      quantity: '40 kg',
      currentLocation: 'Hub Warehouse',
      estimatedArrival: '10:00 AM',
      status: 'arrived',
      distance: '0 km',
      lastUpdate: '5 min ago',
      vehicleNumber: 'GJ 01 EF 9012'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit': return 'bg-blue-500'
      case 'arriving': return 'bg-yellow-500'
      case 'arrived': return 'bg-green-500'
      case 'delayed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_transit': return <Truck className="h-4 w-4" />
      case 'arriving': return <MapPin className="h-4 w-4" />
      case 'arrived': return <CheckCircle className="h-4 w-4" />
      case 'delayed': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingData(prev => prev.map(item => ({
        ...item,
        lastUpdate: Math.random() > 0.7 ? 'Just now' : item.lastUpdate
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Live Tracking</h1>
          <p className="text-muted-foreground">
            Real-time tracking of farmer deliveries to hub
          </p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {trackingData.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(item.status)} text-white`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1 capitalize">{item.status.replace('_', ' ')}</span>
                  </Badge>
                  <div>
                    <CardTitle className="text-lg">{item.farmerName}</CardTitle>
                    <p className="text-sm text-muted-foreground">#{item.id} • {item.vehicleNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Product & Quantity</span>
                  <p className="font-medium">{item.product}</p>
                  <p className="text-sm text-green-600 font-semibold">{item.quantity}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Current Location</span>
                  <p className="font-medium">{item.currentLocation}</p>
                  <p className="text-sm text-blue-600">{item.distance} away</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Estimated Arrival</span>
                  <p className="font-medium">{item.estimatedArrival}</p>
                  <p className="text-sm text-gray-500">Last update: {item.lastUpdate}</p>
                </div>
              </div>

              {item.status === 'arriving' && (
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Prepare for Arrival
                </Button>
              )}

              {item.status === 'arrived' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Delivery Completed</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}