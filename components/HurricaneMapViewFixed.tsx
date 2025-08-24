'use client'

import React, { useEffect, useState } from 'react'
import { AlertTriangle, Eye, Wind, Clock, Navigation, Layers, ZoomIn, ZoomOut, Info } from 'lucide-react'

interface Branch {
  branchNumber: number
  locationName: string
  address: string
  city: string
  county: string
  region: number
  evacuationZone: string
  earliestArrival: string
  mostLikelyArrival: string
  latestArrival: string
  probability: number
  duration: string
  coordinates: [number, number]
}

// Enhanced branch data with accurate Florida coordinates
const branchData: Branch[] = [
  {branchNumber: 49, locationName: "Holiday", address: "3422 U.S. Highway 19", city: "Holiday", county: "Pasco", region: 1, evacuationZone: "B", earliestArrival: "Aug 23, 3:00 AM", mostLikelyArrival: "Aug 23, 6:00 AM", latestArrival: "Aug 23, 12:00 PM", probability: 88, duration: "9 hrs", coordinates: [28.1875, -82.7456]},
  {branchNumber: 75, locationName: "West Hernando", address: "12139 Cortez Blvd", city: "Brooksville", county: "Hernando", region: 1, evacuationZone: "C", earliestArrival: "Aug 23, 3:00 AM", mostLikelyArrival: "Aug 23, 6:00 AM", latestArrival: "Aug 23, 12:00 PM", probability: 87, duration: "9 hrs", coordinates: [28.5544, -82.3897]},
  {branchNumber: 3, locationName: "Port Richey", address: "7225 Ridge Road", city: "Port Richey", county: "Pasco", region: 1, evacuationZone: "C", earliestArrival: "Aug 23, 3:00 AM", mostLikelyArrival: "Aug 23, 6:00 AM", latestArrival: "Aug 23, 12:00 PM", probability: 85, duration: "9 hrs", coordinates: [28.2719, -82.7193]},
  {branchNumber: 51, locationName: "Crystal River", address: "1039 NE 5th Street", city: "Crystal River", county: "Citrus", region: 1, evacuationZone: "A", earliestArrival: "Aug 23, 2:30 AM", mostLikelyArrival: "Aug 23, 5:30 AM", latestArrival: "Aug 23, 11:30 AM", probability: 70, duration: "7 hrs", coordinates: [28.9025, -82.5926]},
  {branchNumber: 67, locationName: "St. Pete Roosevelt", address: "3201 1st Avenue N", city: "St. Petersburg", county: "Pinellas", region: 2, evacuationZone: "A", earliestArrival: "Aug 23, 4:00 AM", mostLikelyArrival: "Aug 23, 7:00 AM", latestArrival: "Aug 23, 1:00 PM", probability: 69, duration: "7 hrs", coordinates: [27.7703, -82.6695]},
  {branchNumber: 23, locationName: "South Tampa", address: "4302 Henderson Boulevard", city: "Tampa", county: "Hillsborough", region: 3, evacuationZone: "A", earliestArrival: "Aug 23, 5:00 AM", mostLikelyArrival: "Aug 23, 8:00 AM", latestArrival: "Aug 23, 2:00 PM", probability: 59, duration: "6 hrs", coordinates: [27.9506, -82.4572]},
  {branchNumber: 2, locationName: "Bradenton Main", address: "4207 14th Street W", city: "Bradenton", county: "Manatee", region: 4, evacuationZone: "C", earliestArrival: "Aug 23, 6:00 AM", mostLikelyArrival: "Aug 23, 9:00 AM", latestArrival: "Aug 23, 3:00 PM", probability: 58, duration: "6 hrs", coordinates: [27.4989, -82.5748]},
  {branchNumber: 17, locationName: "Clearwater", address: "2530 Gulf to Bay Boulevard", city: "Clearwater", county: "Pinellas", region: 2, evacuationZone: "B", earliestArrival: "Aug 23, 4:45 AM", mostLikelyArrival: "Aug 23, 7:45 AM", latestArrival: "Aug 23, 1:45 PM", probability: 40, duration: "4 hrs", coordinates: [27.9659, -82.8001]},
  {branchNumber: 81, locationName: "Sarasota Main", address: "1800 Ringling Boulevard", city: "Sarasota", county: "Sarasota", region: 4, evacuationZone: "C", earliestArrival: "Aug 23, 7:00 AM", mostLikelyArrival: "Aug 23, 10:00 AM", latestArrival: "Aug 23, 4:00 PM", probability: 49, duration: "5 hrs", coordinates: [27.3364, -82.5307]},
  {branchNumber: 9, locationName: "Venice", address: "1359 US Highway 41 Bypass S", city: "Venice", county: "Sarasota", region: 4, evacuationZone: "A", earliestArrival: "Aug 23, 8:30 AM", mostLikelyArrival: "Aug 23, 11:30 AM", latestArrival: "Aug 23, 5:30 PM", probability: 32, duration: "3 hrs", coordinates: [27.0998, -82.4543]},
  {branchNumber: 40, locationName: "Fort Myers Main", address: "4707 Cleveland Avenue", city: "Fort Myers", county: "Lee", region: 4, evacuationZone: "D", earliestArrival: "Aug 23, 11:00 AM", mostLikelyArrival: "Aug 23, 2:00 PM", latestArrival: "Aug 23, 8:00 PM", probability: 19, duration: "2 hrs", coordinates: [26.6406, -81.8723]},
  {branchNumber: 46, locationName: "Naples Main", address: "2400 North Tamiami Trail", city: "Naples", county: "Collier", region: 4, evacuationZone: "C", earliestArrival: "Aug 23, 12:30 PM", mostLikelyArrival: "Aug 23, 3:30 PM", latestArrival: "Aug 23, 9:30 PM", probability: 14, duration: "2 hrs", coordinates: [26.1420, -81.7948]},
  {branchNumber: 5, locationName: "Brandon", address: "209 West Brandon Boulevard", city: "Brandon", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 6:30 AM", mostLikelyArrival: "Aug 23, 9:30 AM", latestArrival: "Aug 23, 3:30 PM", probability: 41, duration: "4 hrs", coordinates: [27.9378, -82.2859]},
  {branchNumber: 30, locationName: "Lakeland", address: "4414 South Florida Avenue", city: "Lakeland", county: "Polk", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 8:45 AM", mostLikelyArrival: "Aug 23, 11:45 AM", latestArrival: "Aug 23, 5:45 PM", probability: 27, duration: "3 hrs", coordinates: [28.0395, -81.9498]},
  {branchNumber: 33, locationName: "Sanford", address: "3405 Orlando Drive", city: "Sanford", county: "Orange", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 8:00 AM", mostLikelyArrival: "Aug 23, 11:00 AM", latestArrival: "Aug 23, 5:00 PM", probability: 30, duration: "3 hrs", coordinates: [28.8028, -81.2733]},
  {branchNumber: 34, locationName: "Kissimmee", address: "2804 13th Street", city: "Kissimmee", county: "Osceola", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 9:15 AM", mostLikelyArrival: "Aug 23, 12:15 PM", latestArrival: "Aug 23, 6:15 PM", probability: 24, duration: "2 hrs", coordinates: [28.3042, -81.4168]},
]

// Storm data
const stormData = {
  currentPosition: [26.8, -83.2], // 120 miles SW of Crystal River
  name: "Elena",
  category: 2,
  maxWinds: 100,
  movement: "NNE at 12 mph",
  pressure: 968,
  // Forecast track points
  forecastTrack: [
    { time: 0, position: [26.8, -83.2], intensity: 100 },
    { time: 6, position: [27.2, -83.0], intensity: 95 },
    { time: 12, position: [27.6, -82.8], intensity: 90 },
    { time: 24, position: [28.4, -82.5], intensity: 75 },
    { time: 36, position: [29.2, -82.2], intensity: 60 },
    { time: 48, position: [30.0, -81.8], intensity: 45 },
  ],
  // Cone of uncertainty
  uncertaintyCone: [
    { time: 12, radius: 50 },
    { time: 24, radius: 100 },
    { time: 36, radius: 150 },
    { time: 48, radius: 200 },
  ]
}

// Wind arrival time contours (hours from now)
const windContours = [
  { hours: 3, coordinates: [[28.9, -82.8], [28.5, -82.9], [28.1, -82.8], [27.7, -82.7], [27.9, -82.5], [28.3, -82.6], [28.9, -82.8]] },
  { hours: 6, coordinates: [[28.4, -82.5], [28.0, -82.6], [27.6, -82.5], [27.2, -82.4], [27.4, -82.2], [27.8, -82.3], [28.4, -82.5]] },
  { hours: 9, coordinates: [[27.9, -82.2], [27.5, -82.3], [27.1, -82.2], [26.7, -82.1], [26.9, -81.9], [27.3, -82.0], [27.9, -82.2]] },
  { hours: 12, coordinates: [[27.4, -81.9], [27.0, -82.0], [26.6, -81.9], [26.2, -81.8], [26.4, -81.6], [26.8, -81.7], [27.4, -81.9]] },
]

export default function HurricaneMapViewFixed() {
  const [mapReady, setMapReady] = useState(false)
  const [selectedLayer, setSelectedLayer] = useState('street')
  const [showWindContours, setShowWindContours] = useState(true)
  const [showCone, setShowCone] = useState(true)
  const [showBranches, setShowBranches] = useState(true)
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    if (typeof window !== 'undefined') {
      import('leaflet').then((leaflet) => {
        import('react-leaflet').then(() => {
          // Fix default marker icons
          const L = leaflet.default
          delete (L.Icon.Default.prototype as any)._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: '/leaflet/marker-icon-2x.png',
            iconUrl: '/leaflet/marker-icon.png',
            shadowUrl: '/leaflet/marker-shadow.png',
          })
          setL(L)
          setMapReady(true)
        })
      })
    }
  }, [])

  const getRiskColor = (probability: number) => {
    if (probability >= 85) return '#dc2626' // red-600
    if (probability >= 70) return '#ea580c' // orange-600
    if (probability >= 40) return '#eab308' // yellow-600
    return '#16a34a' // green-600
  }

  const getContourColor = (hours: number) => {
    if (hours <= 3) return '#dc2626'
    if (hours <= 6) return '#ea580c'
    if (hours <= 9) return '#eab308'
    return '#3b82f6'
  }

  if (!mapReady || !L) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <Wind className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Hurricane Map...</p>
        </div>
      </div>
    )
  }

  const MapContainer = require('react-leaflet').MapContainer
  const TileLayer = require('react-leaflet').TileLayer
  const Marker = require('react-leaflet').Marker
  const Popup = require('react-leaflet').Popup
  const Circle = require('react-leaflet').Circle
  const Polyline = require('react-leaflet').Polyline
  const Polygon = require('react-leaflet').Polygon
  const useMap = require('react-leaflet').useMap

  // Create custom icons
  const stormIcon = L.divIcon({
    html: `<div class="storm-icon">
      <div class="storm-eye">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="2"></circle>
          <path d="M12 2v4"></path>
          <path d="M12 18v4"></path>
          <path d="M4.93 4.93l2.83 2.83"></path>
          <path d="M16.24 16.24l2.83 2.83"></path>
          <path d="M2 12h4"></path>
          <path d="M18 12h4"></path>
          <path d="M4.93 19.07l2.83-2.83"></path>
          <path d="M16.24 7.76l2.83-2.83"></path>
        </svg>
      </div>
    </div>`,
    className: 'custom-storm-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

  const createBranchIcon = (probability: number) => {
    const color = getRiskColor(probability)
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">${probability}</div>`,
      className: 'custom-branch-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  return (
    <div className="relative h-screen w-full">
      {/* Map Container - Centered on Florida */}
      <MapContainer
        center={[27.5, -82.5]}
        zoom={7}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        whenCreated={setMap}
      >
        {/* Base Map Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Storm Track */}
        <Polyline 
          positions={stormData.forecastTrack.map(point => point.position as [number, number])}
          color="#dc2626"
          weight={3}
          dashArray="10, 10"
        />

        {/* Storm Current Position */}
        <Marker position={stormData.currentPosition as [number, number]} icon={stormIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">Hurricane {stormData.name}</h3>
              <p className="text-sm">Category {stormData.category}</p>
              <p className="text-sm">Max Winds: {stormData.maxWinds} mph</p>
              <p className="text-sm">Movement: {stormData.movement}</p>
              <p className="text-sm">Pressure: {stormData.pressure} mb</p>
            </div>
          </Popup>
        </Marker>

        {/* Forecast Points */}
        {stormData.forecastTrack.map((point, index) => (
          <Circle
            key={index}
            center={point.position as [number, number]}
            radius={5000}
            fillColor="#dc2626"
            fillOpacity={0.8}
            color="#dc2626"
            weight={1}
          >
            <Popup>
              <div className="p-2">
                <p className="font-semibold">+{point.time} hours</p>
                <p className="text-sm">Wind: {point.intensity} mph</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Cone of Uncertainty */}
        {showCone && stormData.uncertaintyCone.map((cone, index) => {
          const forecastPoint = stormData.forecastTrack.find(p => p.time === cone.time)
          if (!forecastPoint) return null
          return (
            <Circle
              key={`cone-${index}`}
              center={forecastPoint.position as [number, number]}
              radius={cone.radius * 1609.34} // Convert miles to meters
              fillColor="#dc2626"
              fillOpacity={0.1}
              color="#dc2626"
              weight={1}
              dashArray="5, 5"
            />
          )
        })}

        {/* Wind Arrival Contours */}
        {showWindContours && windContours.map((contour, index) => (
          <Polygon
            key={`contour-${index}`}
            positions={contour.coordinates as [number, number][]}
            color={getContourColor(contour.hours)}
            weight={2}
            fillOpacity={0.1}
            fillColor={getContourColor(contour.hours)}
            dashArray="5, 10"
          >
            <Popup>
              <p className="font-semibold">39+ mph winds arrive in {contour.hours} hours</p>
            </Popup>
          </Polygon>
        ))}

        {/* Branch Markers */}
        {showBranches && branchData.map((branch) => (
          <Marker
            key={branch.branchNumber}
            position={branch.coordinates}
            icon={createBranchIcon(branch.probability)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-base">{branch.locationName}</h3>
                <p className="text-xs text-gray-600">Branch #{branch.branchNumber}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm"><strong>County:</strong> {branch.county}</p>
                  <p className="text-sm"><strong>Evac Zone:</strong> {branch.evacuationZone}</p>
                  <p className="text-sm"><strong>Wind Probability:</strong> {branch.probability}%</p>
                  <p className="text-sm"><strong>Arrival:</strong> {branch.mostLikelyArrival}</p>
                  <p className="text-sm"><strong>Duration:</strong> {branch.duration}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Controls Panel */}
      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-2xl p-4 z-[1000] max-w-sm">
        <div className="flex items-center mb-4">
          <Eye className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-bold">Hurricane Elena</h2>
        </div>
        
        <div className="space-y-3">
          {/* Storm Info */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Category 2</span>
              <span className="text-sm text-gray-600">100 mph winds</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">Moving NNE at 12 mph</div>
            <div className="text-xs text-gray-500 mt-1">120 mi SW of Crystal River</div>
          </div>

          {/* Layer Controls */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Map Layers</p>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showWindContours}
                onChange={(e) => setShowWindContours(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Wind Arrival Times</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showCone}
                onChange={(e) => setShowCone(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Forecast Cone</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showBranches}
                onChange={(e) => setShowBranches(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">Branch Locations</span>
            </label>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-2xl p-4 z-[1000]">
        <h3 className="text-sm font-bold mb-3">Legend</h3>
        
        <div className="space-y-2">
          {/* Risk Levels */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-600 rounded-full mr-1"></div>
              <span className="text-xs">≥85%</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-orange-600 rounded-full mr-1"></div>
              <span className="text-xs">70-84%</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-600 rounded-full mr-1"></div>
              <span className="text-xs">40-69%</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-600 rounded-full mr-1"></div>
              <span className="text-xs">&lt;40%</span>
            </div>
          </div>

          {/* Contour Lines */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold mb-1">Wind Arrival (39+ mph)</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-red-600 mr-1"></div>
                <span>3 hrs</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-orange-600 mr-1"></div>
                <span>6 hrs</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-yellow-600 mr-1"></div>
                <span>9 hrs</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-blue-600 mr-1"></div>
                <span>12 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Panel */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-2xl p-4 z-[1000] max-w-xs">
        <h3 className="text-sm font-bold mb-3 flex items-center">
          <AlertTriangle className="h-4 w-4 text-red-600 mr-1" />
          Impact Summary
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-lg p-2">
            <p className="text-2xl font-bold text-red-600">{branchData.filter(b => b.probability >= 85).length}</p>
            <p className="text-xs text-gray-600">Critical Risk</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-2">
            <p className="text-2xl font-bold text-orange-600">{branchData.filter(b => b.probability >= 70 && b.probability < 85).length}</p>
            <p className="text-xs text-gray-600">High Risk</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2">
            <p className="text-2xl font-bold text-yellow-600">{branchData.filter(b => b.evacuationZone === 'A').length}</p>
            <p className="text-xs text-gray-600">Zone A</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2">
            <p className="text-2xl font-bold text-blue-600">{branchData.length}</p>
            <p className="text-xs text-gray-600">Total Branches</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs font-semibold mb-2">First Impacts</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Crystal River</span>
              <span className="font-medium">5:30 AM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Holiday</span>
              <span className="font-medium">6:00 AM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">St. Petersburg</span>
              <span className="font-medium">7:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx global>{`
        .storm-icon {
          filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.5));
        }
        
        .storm-eye {
          animation: spin 2s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .leaflet-container {
          font-family: inherit;
        }

        .custom-branch-icon {
          background: transparent !important;
          border: none !important;
        }

        .custom-storm-icon {
          background: transparent !important;
          border: none !important;
        }

        .leaflet-control-attribution {
          font-size: 10px;
        }
      `}</style>
    </div>
  )
}