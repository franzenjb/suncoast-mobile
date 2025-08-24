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
  quadrant?: string
  distance?: number
}

// Storm data
const stormData = {
  currentPosition: [26.8, -83.2], // 120 miles SW of Crystal River
  name: "Elena",
  category: 2,
  maxWinds: 100,
  movement: "NNE at 12 mph",
  pressure: 968,
  speed: 12, // mph
  direction: 22.5, // degrees (NNE)
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

// Calculate hurricane physics based on quadrant position
const calculateHurricaneImpact = (branchLat: number, branchLon: number, stormLat: number, stormLon: number, stormSpeed: number = 12) => {
  // Calculate distance using Haversine formula
  const R = 3959 // Earth's radius in miles
  const lat1Rad = stormLat * Math.PI / 180
  const lat2Rad = branchLat * Math.PI / 180
  const deltaLat = (branchLat - stormLat) * Math.PI / 180
  const deltaLon = (branchLon - stormLon) * Math.PI / 180
  
  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLon/2) * Math.sin(deltaLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  
  // Calculate bearing from storm to branch
  const y = Math.sin(deltaLon) * Math.cos(lat2Rad)
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon)
  const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360
  
  // Determine quadrant relative to storm motion (NNE = 22.5°)
  const stormDirection = 22.5
  const relativeAngle = (bearing - stormDirection + 360) % 360
  
  let quadrant = ''
  let riskMultiplier = 1.0
  
  if (relativeAngle >= 315 || relativeAngle < 45) {
    quadrant = 'Front' // In path
    riskMultiplier = 1.2
  } else if (relativeAngle >= 45 && relativeAngle < 135) {
    quadrant = 'Right-Front' // Most dangerous - strongest winds
    riskMultiplier = 1.5
  } else if (relativeAngle >= 135 && relativeAngle < 225) {
    quadrant = 'Right-Rear'
    riskMultiplier = 0.8
  } else {
    quadrant = 'Left' // Weakest quadrant
    riskMultiplier = 0.6
  }
  
  // Calculate arrival time based on distance and storm speed
  const arrivalHours = Math.max(0, distance / stormSpeed)
  
  // Calculate wind probability based on distance and quadrant
  // Tropical storm force winds (39+ mph) extend about 150-200 miles from center
  const windFieldRadius = 175 // miles
  const baseProbability = distance < windFieldRadius ? 
    100 * (1 - (distance / windFieldRadius) * 0.7) : 
    Math.max(0, 30 - (distance - windFieldRadius) * 0.2)
  
  const adjustedProbability = Math.min(100, Math.max(0, baseProbability * riskMultiplier))
  
  return {
    distance: Math.round(distance),
    quadrant,
    arrivalHours: Math.round(arrivalHours * 10) / 10,
    probability: Math.round(adjustedProbability)
  }
}

// Branch locations with physics-based calculations
const branchLocations = [
  {branchNumber: 51, locationName: "Crystal River", address: "1039 NE 5th Street", city: "Crystal River", county: "Citrus", region: 1, evacuationZone: "A", coordinates: [28.9025, -82.5926] as [number, number]},
  {branchNumber: 49, locationName: "Holiday", address: "3422 U.S. Highway 19", city: "Holiday", county: "Pasco", region: 1, evacuationZone: "B", coordinates: [28.1875, -82.7456] as [number, number]},
  {branchNumber: 11, locationName: "Brooksville", address: "18915 Cortez Boulevard", city: "Brooksville", county: "Hernando", region: 1, evacuationZone: "No", coordinates: [28.5544, -82.3897] as [number, number]},
  {branchNumber: 3, locationName: "Port Richey", address: "7225 Ridge Road", city: "Port Richey", county: "Pasco", region: 1, evacuationZone: "C", coordinates: [28.2719, -82.7193] as [number, number]},
  {branchNumber: 22, locationName: "Spring Hill", address: "4139 Commercial Way", city: "Spring Hill", county: "Hernando", region: 1, evacuationZone: "No", coordinates: [28.4789, -82.5253] as [number, number]},
  {branchNumber: 18, locationName: "Inverness", address: "2367 East Gulf to Lake Highway", city: "Inverness", county: "Citrus", region: 1, evacuationZone: "No", coordinates: [28.8356, -82.3303] as [number, number]},
  {branchNumber: 172, locationName: "Trinity", address: "10843 State Road 54", city: "Trinity", county: "Pasco", region: 1, evacuationZone: "No", coordinates: [28.1808, -82.6593] as [number, number]},
  {branchNumber: 21, locationName: "Dade City", address: "12510 South Highway 301", city: "Dade City", county: "Pasco", region: 1, evacuationZone: "No", coordinates: [28.3647, -82.1959] as [number, number]},
  {branchNumber: 67, locationName: "St. Pete Roosevelt", address: "3201 1st Avenue N", city: "St. Petersburg", county: "Pinellas", region: 2, evacuationZone: "A", coordinates: [27.7703, -82.6695] as [number, number]},
  {branchNumber: 17, locationName: "Clearwater", address: "2530 Gulf to Bay Boulevard", city: "Clearwater", county: "Pinellas", region: 2, evacuationZone: "B", coordinates: [27.9659, -82.8001] as [number, number]},
  {branchNumber: 65, locationName: "Seminole", address: "8901 Seminole Boulevard", city: "Seminole", county: "Pinellas", region: 2, evacuationZone: "A", coordinates: [27.8394, -82.7912] as [number, number]},
  {branchNumber: 23, locationName: "South Tampa", address: "4302 Henderson Boulevard", city: "Tampa", county: "Hillsborough", region: 3, evacuationZone: "A", coordinates: [27.9506, -82.4572] as [number, number]},
  {branchNumber: 5, locationName: "Brandon", address: "209 West Brandon Boulevard", city: "Brandon", county: "Hillsborough", region: 3, evacuationZone: "No", coordinates: [27.9378, -82.2859] as [number, number]},
  {branchNumber: 12, locationName: "Tampa Palms", address: "4302 Boy Scout Boulevard", city: "Tampa", county: "Hillsborough", region: 3, evacuationZone: "No", coordinates: [28.0764, -82.3889] as [number, number]},
  {branchNumber: 13, locationName: "Carrollwood", address: "11720 North Dale Mabry Highway", city: "Tampa", county: "Hillsborough", region: 3, evacuationZone: "No", coordinates: [28.0341, -82.5070] as [number, number]},
  {branchNumber: 4, locationName: "Plant City", address: "2302 James L Redman Parkway", city: "Plant City", county: "Hillsborough", region: 3, evacuationZone: "No", coordinates: [28.0186, -82.1287] as [number, number]},
  {branchNumber: 30, locationName: "Lakeland", address: "4414 South Florida Avenue", city: "Lakeland", county: "Polk", region: 3, evacuationZone: "No", coordinates: [28.0395, -81.9498] as [number, number]},
  {branchNumber: 2, locationName: "Bradenton Main", address: "4207 14th Street W", city: "Bradenton", county: "Manatee", region: 4, evacuationZone: "C", coordinates: [27.4989, -82.5748] as [number, number]},
  {branchNumber: 81, locationName: "Sarasota Main", address: "1800 Ringling Boulevard", city: "Sarasota", county: "Sarasota", region: 4, evacuationZone: "C", coordinates: [27.3364, -82.5307] as [number, number]},
  {branchNumber: 9, locationName: "Venice", address: "1359 US Highway 41 Bypass S", city: "Venice", county: "Sarasota", region: 4, evacuationZone: "A", coordinates: [27.0998, -82.4543] as [number, number]},
  {branchNumber: 40, locationName: "Fort Myers Main", address: "4707 Cleveland Avenue", city: "Fort Myers", county: "Lee", region: 4, evacuationZone: "D", coordinates: [26.6406, -81.8723] as [number, number]},
  {branchNumber: 46, locationName: "Naples Main", address: "2400 North Tamiami Trail", city: "Naples", county: "Collier", region: 4, evacuationZone: "C", coordinates: [26.1420, -81.7948] as [number, number]},
]

// Calculate physics-based data for all branches
const branchData: Branch[] = branchLocations.map(branch => {
  const impact = calculateHurricaneImpact(
    branch.coordinates[0],
    branch.coordinates[1],
    stormData.currentPosition[0],
    stormData.currentPosition[1],
    stormData.speed
  )
  
  // Format arrival times
  const baseTime = new Date('2023-08-23T00:00:00')
  const arrivalTime = new Date(baseTime.getTime() + impact.arrivalHours * 60 * 60 * 1000)
  const earliestTime = new Date(arrivalTime.getTime() - 3 * 60 * 60 * 1000) // 3 hours earlier
  const latestTime = new Date(arrivalTime.getTime() + 3 * 60 * 60 * 1000) // 3 hours later
  
  const formatTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes === 0 ? ':00' : `:${minutes.toString().padStart(2, '0')}`
    return `Aug ${date.getDate()}, ${displayHours}${displayMinutes} ${ampm}`
  }
  
  // Duration based on storm intensity at that distance
  const duration = impact.distance < 50 ? "9 hrs" : 
                   impact.distance < 100 ? "7 hrs" :
                   impact.distance < 150 ? "5 hrs" :
                   impact.distance < 200 ? "3 hrs" : "2 hrs"
  
  return {
    ...branch,
    probability: impact.probability,
    earliestArrival: formatTime(earliestTime),
    mostLikelyArrival: formatTime(arrivalTime),
    latestArrival: formatTime(latestTime),
    duration,
    quadrant: impact.quadrant,
    distance: impact.distance
  }
}).sort((a, b) => b.probability - a.probability) // Sort by risk level

// Wind arrival time contours (recalculated based on storm position and speed)
const windContours = [
  { hours: 6, coordinates: [[27.4, -82.9], [27.8, -82.7], [28.0, -82.5], [27.8, -82.3], [27.4, -82.2], [27.0, -82.4], [26.8, -82.6], [27.0, -82.8], [27.4, -82.9]] },
  { hours: 12, coordinates: [[28.0, -82.6], [28.4, -82.4], [28.6, -82.2], [28.4, -82.0], [28.0, -81.9], [27.6, -82.1], [27.4, -82.3], [27.6, -82.5], [28.0, -82.6]] },
  { hours: 18, coordinates: [[28.6, -82.3], [29.0, -82.1], [29.2, -81.9], [29.0, -81.7], [28.6, -81.6], [28.2, -81.8], [28.0, -82.0], [28.2, -82.2], [28.6, -82.3]] },
  { hours: 24, coordinates: [[29.2, -82.0], [29.6, -81.8], [29.8, -81.6], [29.6, -81.4], [29.2, -81.3], [28.8, -81.5], [28.6, -81.7], [28.8, -81.9], [29.2, -82.0]] },
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

  const getTileLayer = () => {
    switch(selectedLayer) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri'
        }
      case 'radar':
        return {
          url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY',
          attribution: '&copy; OpenWeatherMap'
        }
      default:
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors'
        }
    }
  }

  const getRiskColor = (probability: number) => {
    if (probability >= 85) return '#dc2626' // red-600
    if (probability >= 70) return '#ea580c' // orange-600
    if (probability >= 50) return '#ca8a04' // yellow-600
    if (probability >= 30) return '#65a30d' // green-600
    return '#0284c7' // sky-600
  }

  const getRiskLabel = (probability: number) => {
    if (probability >= 85) return 'Extreme'
    if (probability >= 70) return 'High'
    if (probability >= 50) return 'Moderate'
    if (probability >= 30) return 'Low'
    return 'Minimal'
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

  const { 
    MapContainer, 
    TileLayer, 
    Marker, 
    Popup, 
    Circle,
    Polyline,
    Polygon
  } = require('react-leaflet')

  const hurricaneIcon = L.divIcon({
    className: 'hurricane-icon',
    html: '<div class="relative">' +
          '<div class="absolute -inset-4 bg-red-500 rounded-full opacity-30 animate-ping"></div>' +
          '<div class="relative bg-red-600 rounded-full p-2 border-2 border-white shadow-lg">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="white">' +
          '<path d="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10 10-4.48 10-10S17.52,2 12,2zm0,18c-4.41,0-8-3.59-8-8s3.59-8 8-8 8,3.59 8,8-3.59,8-8,8z"/>' +
          '<circle cx="12" cy="12" r="3" fill="white"/>' +
          '</svg>' +
          '</div>' +
          '</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

  return (
    <div className="relative h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .hurricane-icon {
          z-index: 1000 !important;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}} />
      
      <MapContainer 
        center={[27.5, -82.5]} 
        zoom={7} 
        className="h-full w-full"
        whenCreated={setMap}
      >
        <TileLayer {...getTileLayer()} />
        
        {/* Hurricane Eye */}
        <Marker position={stormData.currentPosition} icon={hurricaneIcon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">Hurricane {stormData.name}</h3>
              <div className="space-y-1 mt-2">
                <div>Category {stormData.category}</div>
                <div>{stormData.maxWinds} mph winds</div>
                <div>{stormData.movement}</div>
                <div>Pressure: {stormData.pressure} mb</div>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Forecast Track */}
        <Polyline 
          positions={stormData.forecastTrack.map(point => point.position)}
          color="#ef4444"
          weight={3}
          dashArray="10, 5"
        />

        {/* Forecast Points */}
        {stormData.forecastTrack.slice(1).map((point, idx) => (
          <Circle
            key={idx}
            center={point.position}
            radius={3000}
            fillColor="#ef4444"
            fillOpacity={0.8}
            color="#white"
            weight={2}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold">+{point.time}H Forecast</div>
                <div>Winds: {point.intensity} mph</div>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Cone of Uncertainty */}
        {showCone && stormData.uncertaintyCone.map((cone, idx) => (
          <Circle
            key={idx}
            center={stormData.forecastTrack.find(t => t.time >= cone.time)?.position || stormData.currentPosition}
            radius={cone.radius * 1609} // Convert miles to meters
            fillColor="#fbbf24"
            fillOpacity={0.15}
            color="#f59e0b"
            weight={1}
            dashArray="5, 5"
          />
        ))}

        {/* Wind Arrival Contours */}
        {showWindContours && windContours.map((contour, idx) => (
          <Polygon
            key={idx}
            positions={contour.coordinates}
            fillColor="#3b82f6"
            fillOpacity={0.1}
            color="#2563eb"
            weight={2}
            dashArray="10, 5"
          >
            <Popup>
              <div className="text-sm font-semibold">
                Tropical Storm Force Winds
                <div className="text-xs">Arrival: ~{contour.hours} hours</div>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Branch Locations with Physics-Based Risk */}
        {showBranches && branchData.map((branch) => {
          const icon = L.divIcon({
            className: 'branch-marker',
            html: '<div class="relative">' +
                  '<div class="absolute -inset-2 rounded-full opacity-40" style="background-color: ' + getRiskColor(branch.probability) + '"></div>' +
                  '<div class="relative bg-white rounded-full p-2 border-2 shadow-lg" style="border-color: ' + getRiskColor(branch.probability) + '">' +
                  '<div class="text-xs font-bold" style="color: ' + getRiskColor(branch.probability) + '">' + branch.probability + '%</div>' +
                  '</div>' +
                  '</div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
          })

          return (
            <Marker key={branch.branchNumber} position={branch.coordinates} icon={icon}>
              <Popup>
                <div className="p-2 min-w-[250px]">
                  <h3 className="font-bold text-lg">{branch.locationName}</h3>
                  <div className="text-sm text-gray-600">{branch.city}, {branch.county} County</div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Risk Level:</span>
                      <span className={`px-2 py-1 rounded text-white text-xs`} style={{backgroundColor: getRiskColor(branch.probability)}}>
                        {getRiskLabel(branch.probability)} ({branch.probability}%)
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-semibold">Quadrant:</span>
                      <span className={`text-sm ${branch.quadrant === 'Right-Front' ? 'text-red-600 font-bold' : ''}`}>
                        {branch.quadrant}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-semibold">Distance:</span>
                      <span className="text-sm">{branch.distance} miles</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-semibold">Evac Zone:</span>
                      <span className={`text-sm ${branch.evacuationZone === 'A' ? 'text-red-600 font-bold' : ''}`}>
                        {branch.evacuationZone}
                      </span>
                    </div>
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="text-xs text-gray-600">Most Likely Arrival:</div>
                      <div className="font-semibold">{branch.mostLikelyArrival}</div>
                      <div className="text-xs text-gray-500">
                        Duration: {branch.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-4">
        {/* Layer Selector */}
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center mb-2">
            <Layers className="h-4 w-4 mr-2 text-gray-600" />
            <span className="text-sm font-semibold">Map Layers</span>
          </div>
          <div className="space-y-1">
            <button 
              onClick={() => setSelectedLayer('street')}
              className={`w-full text-left px-2 py-1 text-xs rounded ${selectedLayer === 'street' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Street Map
            </button>
            <button 
              onClick={() => setSelectedLayer('satellite')}
              className={`w-full text-left px-2 py-1 text-xs rounded ${selectedLayer === 'satellite' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="text-sm font-semibold mb-2">Display Options</div>
          <div className="space-y-2">
            <label className="flex items-center text-xs">
              <input 
                type="checkbox" 
                checked={showWindContours}
                onChange={(e) => setShowWindContours(e.target.checked)}
                className="mr-2"
              />
              Wind Fields
            </label>
            <label className="flex items-center text-xs">
              <input 
                type="checkbox" 
                checked={showCone}
                onChange={(e) => setShowCone(e.target.checked)}
                className="mr-2"
              />
              Forecast Cone
            </label>
            <label className="flex items-center text-xs">
              <input 
                type="checkbox" 
                checked={showBranches}
                onChange={(e) => setShowBranches(e.target.checked)}
                className="mr-2"
              />
              Branch Locations
            </label>
          </div>
        </div>
      </div>

      {/* Storm Info Panel */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center mb-3">
          <Eye className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-lg font-bold">Hurricane {stormData.name}</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-600">Category:</span>
            <span className="ml-2 font-semibold">{stormData.category}</span>
          </div>
          <div>
            <span className="text-gray-600">Winds:</span>
            <span className="ml-2 font-semibold">{stormData.maxWinds} mph</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Movement:</span>
            <span className="ml-2 font-semibold">{stormData.movement}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600">Position:</span>
            <span className="ml-2 font-semibold">120mi SW of Crystal River</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-gray-600 mb-2">Branch Impact Summary:</div>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Extreme Risk (≥85%):</span>
              <span className="font-bold text-red-600">{branchData.filter(b => b.probability >= 85).length} branches</span>
            </div>
            <div className="flex justify-between">
              <span>High Risk (70-84%):</span>
              <span className="font-bold text-orange-600">{branchData.filter(b => b.probability >= 70 && b.probability < 85).length} branches</span>
            </div>
            <div className="flex justify-between">
              <span>Right-Front Quadrant:</span>
              <span className="font-bold text-red-600">{branchData.filter(b => b.quadrant === 'Right-Front').length} branches</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="text-sm font-semibold mb-2">Risk Legend</div>
        <div className="space-y-1">
          <div className="flex items-center text-xs">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span>Extreme (≥85%)</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-4 h-4 bg-orange-600 rounded mr-2"></div>
            <span>High (70-84%)</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-4 h-4 bg-yellow-600 rounded mr-2"></div>
            <span>Moderate (50-69%)</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
            <span>Low (30-49%)</span>
          </div>
          <div className="flex items-center text-xs">
            <div className="w-4 h-4 bg-sky-600 rounded mr-2"></div>
            <span>Minimal (&lt;30%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}