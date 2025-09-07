'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react'

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
}

export function LiveTracking() {
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
      lastUpdate: '2 min ago'
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
      lastUpdate: '30 sec ago'
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
      lastUpdate: '5 min ago'
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          Live Tracking - Incoming Deliveries
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trackingData.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={`${getStatusColor(item.status)} text-white`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1 capitalize">{item.status.replace('_', ' ')}</span>
                  </Badge>
                  <span className="font-semibold">{item.farmerName}</span>
                </div>
                <span className="text-sm text-gray-500">#{item.id}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Product:</span>
                  <p className="font-medium">{item.product} ({item.quantity})</p>
                </div>
                <div>
                  <span className="text-gray-600">ETA:</span>
                  <p className="font-medium">{item.estimatedArrival}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{item.currentLocation}</span>
                <Badge variant="outline" className="ml-auto">
                  {item.distance} • {item.lastUpdate}
                </Badge>
              </div>
              
              {item.status === 'arriving' && (
                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                  Prepare for Arrival
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}