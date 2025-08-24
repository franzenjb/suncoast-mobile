'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Wind, Clock, MapPin, AlertTriangle, Zap, Activity, Eye, TrendingUp, Shield, ChevronRight, X, Menu, Download, RefreshCw, Map, List } from 'lucide-react'
import DashboardStats from './DashboardStats'
import Timeline from './Timeline'
import RiskHeatmap from './RiskHeatmap'
import dynamic from 'next/dynamic'

// Dynamically import the map to avoid SSR issues
const HurricaneMapView = dynamic(() => import('./HurricaneMapViewFixed'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <Wind className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading Hurricane Map...</p>
      </div>
    </div>
  )
})

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
}

// Complete branch data with hurricane predictions
const branchData: Branch[] = [
  {branchNumber: 49, locationName: "Holiday", address: "3422 U.S. Highway 19", city: "Holiday", county: "Pasco", region: 1, evacuationZone: "B", earliestArrival: "Aug 23, 3:00 AM", mostLikelyArrival: "Aug 23, 6:00 AM", latestArrival: "Aug 23, 12:00 PM", probability: 88, duration: "9 hrs"},
  {branchNumber: 75, locationName: "West Hernando", address: "12139 Cortez Blvd", city: "Brooksville", county: "Hernando", region: 1, evacuationZone: "C", earliestArrival: "Aug 23, 3:00 AM", mostLikelyArrival: "Aug 23, 6:00 AM", latestArrival: "Aug 23, 12:00 PM", probability: 87, duration: "9 hrs"},
  {branchNumber: 3, locationName: "Port Richey", address: "7225 Ridge Road", city: "Port Richey", county: "Pasco", region: 1, evacuationZone: "C", earliestArrival: "Aug 23, 3:00 AM", mostLikelyArrival: "Aug 23, 6:00 AM", latestArrival: "Aug 23, 12:00 PM", probability: 85, duration: "9 hrs"},
  {branchNumber: 88, locationName: "Chiefland", address: "2153 NW 11th Drive", city: "Chiefland", county: "Levy", region: 1, evacuationZone: "No", earliestArrival: "Aug 23, 2:00 AM", mostLikelyArrival: "Aug 23, 5:00 AM", latestArrival: "Aug 23, 11:00 AM", probability: 73, duration: "7 hrs"},
  {branchNumber: 172, locationName: "Trinity", address: "10843 State Road 54", city: "Trinity", county: "Pasco", region: 1, evacuationZone: "No", earliestArrival: "Aug 23, 3:30 AM", mostLikelyArrival: "Aug 23, 6:30 AM", latestArrival: "Aug 23, 12:30 PM", probability: 73, duration: "7 hrs"},
  {branchNumber: 51, locationName: "Crystal River", address: "1039 NE 5th Street", city: "Crystal River", county: "Citrus", region: 1, evacuationZone: "A", earliestArrival: "Aug 23, 2:30 AM", mostLikelyArrival: "Aug 23, 5:30 AM", latestArrival: "Aug 23, 11:30 AM", probability: 70, duration: "7 hrs"},
  {branchNumber: 67, locationName: "St. Pete Roosevelt", address: "3201 1st Avenue N", city: "St. Petersburg", county: "Pinellas", region: 2, evacuationZone: "A", earliestArrival: "Aug 23, 4:00 AM", mostLikelyArrival: "Aug 23, 7:00 AM", latestArrival: "Aug 23, 1:00 PM", probability: 69, duration: "7 hrs"},
  {branchNumber: 23, locationName: "South Tampa", address: "4302 Henderson Boulevard", city: "Tampa", county: "Hillsborough", region: 3, evacuationZone: "A", earliestArrival: "Aug 23, 5:00 AM", mostLikelyArrival: "Aug 23, 8:00 AM", latestArrival: "Aug 23, 2:00 PM", probability: 59, duration: "6 hrs"},
  {branchNumber: 2, locationName: "Bradenton Main", address: "4207 14th Street W", city: "Bradenton", county: "Manatee", region: 4, evacuationZone: "C", earliestArrival: "Aug 23, 6:00 AM", mostLikelyArrival: "Aug 23, 9:00 AM", latestArrival: "Aug 23, 3:00 PM", probability: 58, duration: "6 hrs"},
  {branchNumber: 20, locationName: "Town N Country", address: "8350 W Hillsborough Ave", city: "Tampa", county: "Hillsborough", region: 3, evacuationZone: "B", earliestArrival: "Aug 23, 5:30 AM", mostLikelyArrival: "Aug 23, 8:30 AM", latestArrival: "Aug 23, 2:30 PM", probability: 55, duration: "6 hrs"},
  {branchNumber: 83, locationName: "South St. Pete", address: "1901 4th Street S", city: "St. Petersburg", county: "Pinellas", region: 2, evacuationZone: "E", earliestArrival: "Aug 23, 4:30 AM", mostLikelyArrival: "Aug 23, 7:30 AM", latestArrival: "Aug 23, 1:30 PM", probability: 55, duration: "6 hrs"},
  {branchNumber: 72, locationName: "Countryside", address: "2765 Countryside Blvd", city: "Clearwater", county: "Pinellas", region: 2, evacuationZone: "No", earliestArrival: "Aug 23, 4:30 AM", mostLikelyArrival: "Aug 23, 7:30 AM", latestArrival: "Aug 23, 1:30 PM", probability: 54, duration: "5 hrs"},
  {branchNumber: 11, locationName: "Brooksville", address: "18915 Cortez Boulevard", city: "Brooksville", county: "Hernando", region: 1, evacuationZone: "No", earliestArrival: "Aug 23, 3:30 AM", mostLikelyArrival: "Aug 23, 6:30 AM", latestArrival: "Aug 23, 12:30 PM", probability: 53, duration: "5 hrs"},
  {branchNumber: 25, locationName: "West Bradenton", address: "4845 26th Street W", city: "Bradenton", county: "Manatee", region: 4, evacuationZone: "E", earliestArrival: "Aug 23, 6:30 AM", mostLikelyArrival: "Aug 23, 9:30 AM", latestArrival: "Aug 23, 3:30 PM", probability: 53, duration: "5 hrs"},
  {branchNumber: 22, locationName: "Spring Hill", address: "4139 Commercial Way", city: "Spring Hill", county: "Hernando", region: 1, evacuationZone: "No", earliestArrival: "Aug 23, 3:30 AM", mostLikelyArrival: "Aug 23, 6:30 AM", latestArrival: "Aug 23, 12:30 PM", probability: 52, duration: "5 hrs"},
  {branchNumber: 18, locationName: "Inverness", address: "2367 East Gulf to Lake Highway", city: "Inverness", county: "Citrus", region: 1, evacuationZone: "No", earliestArrival: "Aug 23, 3:45 AM", mostLikelyArrival: "Aug 23, 6:45 AM", latestArrival: "Aug 23, 12:45 PM", probability: 50, duration: "5 hrs"},
  {branchNumber: 81, locationName: "Sarasota Main", address: "1800 Ringling Boulevard", city: "Sarasota", county: "Sarasota", region: 4, evacuationZone: "C", earliestArrival: "Aug 23, 7:00 AM", mostLikelyArrival: "Aug 23, 10:00 AM", latestArrival: "Aug 23, 4:00 PM", probability: 49, duration: "5 hrs"},
  {branchNumber: 65, locationName: "Seminole", address: "8901 Seminole Boulevard", city: "Seminole", county: "Pinellas", region: 2, evacuationZone: "A", earliestArrival: "Aug 23, 4:15 AM", mostLikelyArrival: "Aug 23, 7:15 AM", latestArrival: "Aug 23, 1:15 PM", probability: 48, duration: "5 hrs"},
  {branchNumber: 77, locationName: "Wesley Chapel", address: "28447 State Road 54", city: "Wesley Chapel", county: "Pasco", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 6:00 AM", mostLikelyArrival: "Aug 23, 9:00 AM", latestArrival: "Aug 23, 3:00 PM", probability: 47, duration: "5 hrs"},
  {branchNumber: 21, locationName: "Dade City", address: "12510 South Highway 301", city: "Dade City", county: "Pasco", region: 1, evacuationZone: "No", earliestArrival: "Aug 23, 5:00 AM", mostLikelyArrival: "Aug 23, 8:00 AM", latestArrival: "Aug 23, 2:00 PM", probability: 45, duration: "5 hrs"},
  {branchNumber: 43, locationName: "Land O Lakes", address: "1837 Collier Parkway", city: "Lutz", county: "Pasco", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 5:30 AM", mostLikelyArrival: "Aug 23, 8:30 AM", latestArrival: "Aug 23, 2:30 PM", probability: 44, duration: "4 hrs"},
  {branchNumber: 59, locationName: "Bushnell", address: "217 West Belt Avenue", city: "Bushnell", county: "Sumter", region: 1, evacuationZone: "No", earliestArrival: "Aug 23, 4:30 AM", mostLikelyArrival: "Aug 23, 7:30 AM", latestArrival: "Aug 23, 1:30 PM", probability: 42, duration: "4 hrs"},
  {branchNumber: 5, locationName: "Brandon", address: "209 West Brandon Boulevard", city: "Brandon", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 6:30 AM", mostLikelyArrival: "Aug 23, 9:30 AM", latestArrival: "Aug 23, 3:30 PM", probability: 41, duration: "4 hrs"},
  {branchNumber: 17, locationName: "Clearwater", address: "2530 Gulf to Bay Boulevard", city: "Clearwater", county: "Pinellas", region: 2, evacuationZone: "B", earliestArrival: "Aug 23, 4:45 AM", mostLikelyArrival: "Aug 23, 7:45 AM", latestArrival: "Aug 23, 1:45 PM", probability: 40, duration: "4 hrs"},
  {branchNumber: 12, locationName: "Tampa Palms", address: "4302 Boy Scout Boulevard", city: "Tampa", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 6:15 AM", mostLikelyArrival: "Aug 23, 9:15 AM", latestArrival: "Aug 23, 3:15 PM", probability: 39, duration: "4 hrs"},
  {branchNumber: 13, locationName: "Carrollwood", address: "11720 North Dale Mabry Highway", city: "Tampa", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 6:00 AM", mostLikelyArrival: "Aug 23, 9:00 AM", latestArrival: "Aug 23, 3:00 PM", probability: 40, duration: "4 hrs"},
  {branchNumber: 1, locationName: "Main Office", address: "3651 Cortez Road W", city: "Bradenton", county: "Manatee", region: 4, evacuationZone: "D", earliestArrival: "Aug 23, 6:45 AM", mostLikelyArrival: "Aug 23, 9:45 AM", latestArrival: "Aug 23, 3:45 PM", probability: 38, duration: "4 hrs"},
  {branchNumber: 14, locationName: "Temple Terrace", address: "9350 North 56th Street", city: "Temple Terrace", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 6:30 AM", mostLikelyArrival: "Aug 23, 9:30 AM", latestArrival: "Aug 23, 3:30 PM", probability: 38, duration: "4 hrs"},
  {branchNumber: 4, locationName: "Plant City", address: "2302 James L Redman Parkway", city: "Plant City", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 7:00 AM", mostLikelyArrival: "Aug 23, 10:00 AM", latestArrival: "Aug 23, 4:00 PM", probability: 37, duration: "4 hrs"},
  {branchNumber: 6, locationName: "Sarasota North", address: "5607 Bee Ridge Road", city: "Sarasota", county: "Sarasota", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 8:00 AM", mostLikelyArrival: "Aug 23, 11:00 AM", latestArrival: "Aug 23, 5:00 PM", probability: 35, duration: "4 hrs"},
  {branchNumber: 15, locationName: "Sun City Center", address: "1651 Sun City Center Plaza", city: "Sun City Center", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 7:15 AM", mostLikelyArrival: "Aug 23, 10:15 AM", latestArrival: "Aug 23, 4:15 PM", probability: 35, duration: "4 hrs"},
  {branchNumber: 7, locationName: "Lakewood Ranch", address: "8141 Lakewood Main Street", city: "Lakewood Ranch", county: "Manatee", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 7:30 AM", mostLikelyArrival: "Aug 23, 10:30 AM", latestArrival: "Aug 23, 4:30 PM", probability: 34, duration: "3 hrs"},
  {branchNumber: 16, locationName: "Riverview", address: "10330 Big Bend Road", city: "Riverview", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 7:30 AM", mostLikelyArrival: "Aug 23, 10:30 AM", latestArrival: "Aug 23, 4:30 PM", probability: 34, duration: "3 hrs"},
  {branchNumber: 8, locationName: "University Parkway", address: "8650 University Parkway", city: "Lakewood Ranch", county: "Manatee", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 7:45 AM", mostLikelyArrival: "Aug 23, 10:45 AM", latestArrival: "Aug 23, 4:45 PM", probability: 33, duration: "3 hrs"},
  {branchNumber: 19, locationName: "Valrico", address: "3414 Lithia Pinecrest Road", city: "Valrico", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 7:45 AM", mostLikelyArrival: "Aug 23, 10:45 AM", latestArrival: "Aug 23, 4:45 PM", probability: 33, duration: "3 hrs"},
  {branchNumber: 9, locationName: "Venice", address: "1359 US Highway 41 Bypass S", city: "Venice", county: "Sarasota", region: 4, evacuationZone: "A", earliestArrival: "Aug 23, 8:30 AM", mostLikelyArrival: "Aug 23, 11:30 AM", latestArrival: "Aug 23, 5:30 PM", probability: 32, duration: "3 hrs"},
  {branchNumber: 26, locationName: "Ellenton", address: "5814 18th Street E", city: "Ellenton", county: "Manatee", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 7:30 AM", mostLikelyArrival: "Aug 23, 10:30 AM", latestArrival: "Aug 23, 4:30 PM", probability: 32, duration: "3 hrs"},
  {branchNumber: 24, locationName: "Fishhawk", address: "15020 Fishhawk Boulevard", city: "Lithia", county: "Hillsborough", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 8:00 AM", mostLikelyArrival: "Aug 23, 11:00 AM", latestArrival: "Aug 23, 5:00 PM", probability: 31, duration: "3 hrs"},
  {branchNumber: 10, locationName: "North Port", address: "14800 Tamiami Trail", city: "North Port", county: "Sarasota", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 9:00 AM", mostLikelyArrival: "Aug 23, 12:00 PM", latestArrival: "Aug 23, 6:00 PM", probability: 30, duration: "3 hrs"},
  {branchNumber: 33, locationName: "Sanford", address: "3405 Orlando Drive", city: "Sanford", county: "Orange", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 8:00 AM", mostLikelyArrival: "Aug 23, 11:00 AM", latestArrival: "Aug 23, 5:00 PM", probability: 30, duration: "3 hrs"},
  {branchNumber: 31, locationName: "Orange City", address: "2400 South Volusia Avenue", city: "Orange City", county: "Orange", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 8:15 AM", mostLikelyArrival: "Aug 23, 11:15 AM", latestArrival: "Aug 23, 5:15 PM", probability: 29, duration: "3 hrs"},
  {branchNumber: 28, locationName: "Bartow", address: "1955 South Broadway Avenue", city: "Bartow", county: "Polk", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 8:30 AM", mostLikelyArrival: "Aug 23, 11:30 AM", latestArrival: "Aug 23, 5:30 PM", probability: 28, duration: "3 hrs"},
  {branchNumber: 32, locationName: "Deltona", address: "2045 Deltona Boulevard", city: "Deltona", county: "Orange", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 8:30 AM", mostLikelyArrival: "Aug 23, 11:30 AM", latestArrival: "Aug 23, 5:30 PM", probability: 28, duration: "3 hrs"},
  {branchNumber: 30, locationName: "Lakeland", address: "4414 South Florida Avenue", city: "Lakeland", county: "Polk", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 8:45 AM", mostLikelyArrival: "Aug 23, 11:45 AM", latestArrival: "Aug 23, 5:45 PM", probability: 27, duration: "3 hrs"},
  {branchNumber: 29, locationName: "Winter Haven", address: "355 3rd Street SW", city: "Winter Haven", county: "Polk", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 9:00 AM", mostLikelyArrival: "Aug 23, 12:00 PM", latestArrival: "Aug 23, 6:00 PM", probability: 26, duration: "3 hrs"},
  {branchNumber: 27, locationName: "Arcadia", address: "112 West Oak Street", city: "Arcadia", county: "De Soto", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 9:30 AM", mostLikelyArrival: "Aug 23, 12:30 PM", latestArrival: "Aug 23, 6:30 PM", probability: 25, duration: "3 hrs"},
  {branchNumber: 34, locationName: "Kissimmee", address: "2804 13th Street", city: "Kissimmee", county: "Osceola", region: 3, evacuationZone: "No", earliestArrival: "Aug 23, 9:15 AM", mostLikelyArrival: "Aug 23, 12:15 PM", latestArrival: "Aug 23, 6:15 PM", probability: 24, duration: "2 hrs"},
  {branchNumber: 39, locationName: "Englewood", address: "34 N Indiana Avenue", city: "Englewood", county: "Charlotte", region: 4, evacuationZone: "A", earliestArrival: "Aug 23, 10:15 AM", mostLikelyArrival: "Aug 23, 1:15 PM", latestArrival: "Aug 23, 7:15 PM", probability: 23, duration: "2 hrs"},
  {branchNumber: 37, locationName: "Punta Gorda", address: "1441 Tamiami Trail", city: "Punta Gorda", county: "Charlotte", region: 4, evacuationZone: "B", earliestArrival: "Aug 23, 9:45 AM", mostLikelyArrival: "Aug 23, 12:45 PM", latestArrival: "Aug 23, 6:45 PM", probability: 22, duration: "2 hrs"},
  {branchNumber: 38, locationName: "Port Charlotte", address: "3801 Tamiami Trail", city: "Port Charlotte", county: "Charlotte", region: 4, evacuationZone: "C", earliestArrival: "Aug 23, 10:00 AM", mostLikelyArrival: "Aug 23, 1:00 PM", latestArrival: "Aug 23, 7:00 PM", probability: 21, duration: "2 hrs"},
  {branchNumber: 35, locationName: "Sebring", address: "3800 US Highway 27 S", city: "Sebring", county: "Highlands", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 10:00 AM", mostLikelyArrival: "Aug 23, 1:00 PM", latestArrival: "Aug 23, 7:00 PM", probability: 20, duration: "2 hrs"},
  {branchNumber: 40, locationName: "Fort Myers Main", address: "4707 Cleveland Avenue", city: "Fort Myers", county: "Lee", region: 4, evacuationZone: "D", earliestArrival: "Aug 23, 11:00 AM", mostLikelyArrival: "Aug 23, 2:00 PM", latestArrival: "Aug 23, 8:00 PM", probability: 19, duration: "2 hrs"},
  {branchNumber: 36, locationName: "Wauchula", address: "503 West Main Street", city: "Wauchula", county: "Hardee", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 10:30 AM", mostLikelyArrival: "Aug 23, 1:30 PM", latestArrival: "Aug 23, 7:30 PM", probability: 18, duration: "2 hrs"},
  {branchNumber: 42, locationName: "Cape Coral", address: "1925 NE Pine Island Road", city: "Cape Coral", county: "Lee", region: 4, evacuationZone: "C", earliestArrival: "Aug 23, 11:15 AM", mostLikelyArrival: "Aug 23, 2:15 PM", latestArrival: "Aug 23, 8:15 PM", probability: 18, duration: "2 hrs"},
  {branchNumber: 41, locationName: "Fort Myers Beach", address: "19260 San Carlos Boulevard", city: "Fort Myers Beach", county: "Lee", region: 4, evacuationZone: "A", earliestArrival: "Aug 23, 11:30 AM", mostLikelyArrival: "Aug 23, 2:30 PM", latestArrival: "Aug 23, 8:30 PM", probability: 17, duration: "2 hrs"},
  {branchNumber: 44, locationName: "Estero", address: "20351 Grande Oak Shoppes", city: "Estero", county: "Lee", region: 4, evacuationZone: "B", earliestArrival: "Aug 23, 11:45 AM", mostLikelyArrival: "Aug 23, 2:45 PM", latestArrival: "Aug 23, 8:45 PM", probability: 16, duration: "2 hrs"},
  {branchNumber: 52, locationName: "Lehigh Acres", address: "1600 Lee Boulevard", city: "Lehigh Acres", county: "Lee", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 12:15 PM", mostLikelyArrival: "Aug 23, 3:15 PM", latestArrival: "Aug 23, 9:15 PM", probability: 16, duration: "2 hrs"},
  {branchNumber: 45, locationName: "Bonita Springs", address: "25000 Bernwood Drive", city: "Bonita Springs", county: "Lee", region: 4, evacuationZone: "B", earliestArrival: "Aug 23, 12:00 PM", mostLikelyArrival: "Aug 23, 3:00 PM", latestArrival: "Aug 23, 9:00 PM", probability: 15, duration: "2 hrs"},
  {branchNumber: 53, locationName: "Pine Island", address: "13650 Stringfellow Road", city: "Bokeelia", county: "Lee", region: 4, evacuationZone: "A", earliestArrival: "Aug 23, 12:30 PM", mostLikelyArrival: "Aug 23, 3:30 PM", latestArrival: "Aug 23, 9:30 PM", probability: 15, duration: "2 hrs"},
  {branchNumber: 46, locationName: "Naples Main", address: "2400 North Tamiami Trail", city: "Naples", county: "Collier", region: 4, evacuationZone: "C", earliestArrival: "Aug 23, 12:30 PM", mostLikelyArrival: "Aug 23, 3:30 PM", latestArrival: "Aug 23, 9:30 PM", probability: 14, duration: "2 hrs"},
  {branchNumber: 47, locationName: "Naples North", address: "975 Pine Ridge Road", city: "Naples", county: "Collier", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 12:45 PM", mostLikelyArrival: "Aug 23, 3:45 PM", latestArrival: "Aug 23, 9:45 PM", probability: 13, duration: "2 hrs"},
  {branchNumber: 48, locationName: "Marco Island", address: "950 North Collier Boulevard", city: "Marco Island", county: "Collier", region: 4, evacuationZone: "A", earliestArrival: "Aug 23, 1:00 PM", mostLikelyArrival: "Aug 23, 4:00 PM", latestArrival: "Aug 23, 10:00 PM", probability: 12, duration: "2 hrs"},
  {branchNumber: 54, locationName: "Sanibel", address: "2450 Library Way", city: "Sanibel", county: "Lee", region: 4, evacuationZone: "A", earliestArrival: "Aug 23, 1:15 PM", mostLikelyArrival: "Aug 23, 4:15 PM", latestArrival: "Aug 23, 10:15 PM", probability: 11, duration: "2 hrs"},
  {branchNumber: 50, locationName: "Immokalee", address: "1020 New Market Road E", city: "Immokalee", county: "Collier", region: 4, evacuationZone: "No", earliestArrival: "Aug 23, 1:30 PM", mostLikelyArrival: "Aug 23, 4:30 PM", latestArrival: "Aug 23, 10:30 PM", probability: 10, duration: "2 hrs"}
]

export default function HurricaneTrackerEnhanced() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCounty, setSelectedCounty] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedRisk, setSelectedRisk] = useState('all')
  const [filteredData, setFilteredData] = useState(() => [...branchData].sort((a, b) => b.probability - a.probability))
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const [showDashboard, setShowDashboard] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [mainView, setMainView] = useState<'dashboard' | 'map'>('map')

  useEffect(() => {
    let filtered = branchData

    if (searchTerm) {
      filtered = filtered.filter(branch =>
        branch.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.branchNumber.toString().includes(searchTerm)
      )
    }

    if (selectedCounty !== 'all') {
      filtered = filtered.filter(branch => branch.county === selectedCounty)
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(branch => branch.region.toString() === selectedRegion)
    }

    if (selectedRisk !== 'all') {
      if (selectedRisk === 'high') {
        filtered = filtered.filter(branch => branch.probability >= 85)
      } else if (selectedRisk === 'medium') {
        filtered = filtered.filter(branch => branch.probability >= 70 && branch.probability < 85)
      } else if (selectedRisk === 'low') {
        filtered = filtered.filter(branch => branch.probability < 70)
      }
    }

    // Always sort by probability (highest first) for consistent rendering
    setFilteredData(filtered.sort((a, b) => b.probability - a.probability))
  }, [searchTerm, selectedCounty, selectedRegion, selectedRisk])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdated(new Date())
      setIsRefreshing(false)
    }, 1500)
  }

  const getRiskColor = (probability: number) => {
    if (probability >= 85) return 'text-red-600 bg-red-50 border-red-200'
    if (probability >= 70) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  }

  const getRiskBadgeColor = (probability: number) => {
    if (probability >= 85) return 'bg-red-600'
    if (probability >= 70) return 'bg-orange-600'
    if (probability >= 40) return 'bg-yellow-600'
    return 'bg-green-600'
  }

  const getEvacZoneColor = (zone: string) => {
    switch(zone) {
      case 'A': return 'bg-red-600'
      case 'B': return 'bg-orange-600'
      case 'C': return 'bg-yellow-600'
      case 'D': return 'bg-green-600'
      case 'E': return 'bg-blue-600'
      default: return 'bg-gray-600'
    }
  }

  const counties = Array.from(new Set(branchData.map(b => b.county))).sort()
  const regions = Array.from(new Set(branchData.map(b => b.region))).sort()

  const exportData = () => {
    const csv = [
      ['Branch #', 'Location', 'Address', 'City', 'County', 'Region', 'Evac Zone', 'Most Likely Arrival', 'Probability', 'Duration'],
      ...filteredData.map(b => [
        b.branchNumber,
        b.locationName,
        b.address,
        b.city,
        b.county,
        b.region,
        b.evacuationZone,
        b.mostLikelyArrival,
        `${b.probability}%`,
        b.duration
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hurricane-elena-branch-impact-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <div className="flex items-center space-x-3">
                    <Eye className="h-8 w-8 text-blue-300 animate-pulse" />
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      Hurricane Elena Command Center
                    </h1>
                  </div>
                  <p className="text-blue-200 text-sm md:text-base mt-1 flex items-center">
                    <Activity className="h-4 w-4 mr-1" />
                    Suncoast Credit Union Branch Impact Analysis
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center bg-white/10 rounded-lg p-1">
                  <button
                    onClick={() => setMainView('dashboard')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center ${mainView === 'dashboard' ? 'bg-white/20 text-white' : 'text-blue-200 hover:text-white'}`}
                  >
                    <List className="h-4 w-4 mr-1" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setMainView('map')}
                    className={`px-3 py-1 rounded-md transition-all flex items-center ${mainView === 'map' ? 'bg-white/20 text-white' : 'text-blue-200 hover:text-white'}`}
                  >
                    <Map className="h-4 w-4 mr-1" />
                    Map
                  </button>
                </div>
                <button
                  onClick={handleRefresh}
                  className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button
                  onClick={exportData}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Storm Info Bar */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm">
                <span className="flex items-center">
                  <Wind className="h-4 w-4 mr-1" />
                  Cat 2 - 100mph
                </span>
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  NNE @ 12mph
                </span>
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  120mi SW of Crystal River
                </span>
              </div>
              <span className="text-xs">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 border-b border-yellow-500">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-900 mr-2 flex-shrink-0 animate-pulse" />
              <p className="text-yellow-900 text-sm md:text-base font-medium">
                HURRICANE WARNING: Tropical Storm Force Winds Expected Within 36 Hours
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-yellow-900" />
          </div>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {mainView === 'map' ? (
        <HurricaneMapView />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Dashboard Stats */}
          {showDashboard && <DashboardStats branchData={branchData} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <Timeline branchData={filteredData} />
          </div>

          {/* Risk Heatmap */}
          <div>
            <RiskHeatmap branchData={filteredData} />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Branch Finder</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                Table
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by branch name, city, or number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Counties</option>
              {counties.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>Region {region}</option>
              ))}
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk (≥85%)</option>
              <option value="medium">Medium Risk (70-84%)</option>
              <option value="low">Low Risk (&lt;70%)</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCounty('all')
                setSelectedRegion('all')
                setSelectedRisk('all')
              }}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredData.length} of {branchData.length} branches</span>
            <span className="text-xs">Sorted by risk probability</span>
          </div>
        </div>

        {/* Branch Cards or Table */}
        {viewMode === 'cards' ? (
          <div className="space-y-3">
            {filteredData.map((branch) => (
              <div 
                key={branch.branchNumber} 
                className={`bg-white rounded-xl shadow-lg border-2 ${getRiskColor(branch.probability)} overflow-hidden transform hover:scale-[1.01] transition-all cursor-pointer`}
                onClick={() => setSelectedBranch(branch)}
              >
                <div className="p-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{branch.locationName}</h3>
                        <span className="text-sm text-gray-500">#{branch.branchNumber}</span>
                        <span className={`px-2 py-1 text-xs font-bold text-white rounded ${getEvacZoneColor(branch.evacuationZone)}`}>
                          Zone {branch.evacuationZone}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {branch.address}, {branch.city}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold flex items-center`}>
                        {branch.probability}%
                        <div className={`ml-2 w-3 h-3 rounded-full ${getRiskBadgeColor(branch.probability)} animate-pulse`}></div>
                      </div>
                      <div className="text-xs text-gray-600">Wind Probability</div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <div className="text-sm">
                        <div className="font-medium">Most Likely</div>
                        <div className="text-gray-600">{branch.mostLikelyArrival}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-2 text-gray-400" />
                      <div className="text-sm">
                        <div className="font-medium">Duration</div>
                        <div className="text-gray-600">{branch.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-gray-400" />
                      <div className="text-sm">
                        <div className="font-medium">County</div>
                        <div className="text-gray-600">{branch.county}</div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-2">Wind Arrival Timeline</div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2"></div>
                      </div>
                      <div className="relative flex justify-between text-xs">
                        <div className="bg-white pr-2">
                          <span className="text-gray-500">Earliest</span>
                          <p className="font-medium">{branch.earliestArrival.split(', ')[1]}</p>
                        </div>
                        <div className="bg-white px-2">
                          <span className="text-blue-600 font-bold">Most Likely</span>
                          <p className="font-bold text-blue-600">{branch.mostLikelyArrival.split(', ')[1]}</p>
                        </div>
                        <div className="bg-white pl-2">
                          <span className="text-gray-500">Latest</span>
                          <p className="font-medium">{branch.latestArrival.split(', ')[1]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">County</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((branch) => (
                    <tr key={branch.branchNumber} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedBranch(branch)}>
                      <td className="px-4 py-3 text-sm">#{branch.branchNumber}</td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{branch.locationName}</div>
                          <div className="text-xs text-gray-500">{branch.city}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{branch.county}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-bold text-white rounded ${getEvacZoneColor(branch.evacuationZone)}`}>
                          {branch.evacuationZone}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{branch.mostLikelyArrival}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className={`px-2 py-1 text-sm font-bold rounded ${getRiskBadgeColor(branch.probability)} text-white`}>
                            {branch.probability}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      )} {/* End of dashboard view */}

      {/* Branch Detail Modal */}
      {selectedBranch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBranch(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedBranch.locationName}</h2>
                <p className="text-gray-600">Branch #{selectedBranch.branchNumber}</p>
              </div>
              <button
                onClick={() => setSelectedBranch(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location Details</h3>
                <p className="text-gray-600">{selectedBranch.address}</p>
                <p className="text-gray-600">{selectedBranch.city}, {selectedBranch.county} County</p>
                <p className="text-gray-600">Region {selectedBranch.region}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Wind Impact Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Earliest Arrival:</span>
                    <span className="font-medium">{selectedBranch.earliestArrival}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Most Likely Arrival:</span>
                    <span className="font-bold text-blue-600">{selectedBranch.mostLikelyArrival}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latest Arrival:</span>
                    <span className="font-medium">{selectedBranch.latestArrival}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Duration:</span>
                    <span className="font-medium">{selectedBranch.duration}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Risk Assessment</h3>
                <div className="flex items-center space-x-4">
                  <div className={`text-3xl font-bold ${getRiskBadgeColor(selectedBranch.probability)} text-white px-4 py-2 rounded-lg`}>
                    {selectedBranch.probability}%
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Probability of 39+ MPH winds</p>
                    <p className="text-xs text-gray-500">Evacuation Zone: {selectedBranch.evacuationZone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}