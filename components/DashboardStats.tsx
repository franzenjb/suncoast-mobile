'use client'

import React from 'react'
import { AlertTriangle, Shield, Clock, TrendingUp, Users, Wind } from 'lucide-react'

interface DashboardStatsProps {
  branchData: any[]
}

export default function DashboardStats({ branchData }: DashboardStatsProps) {
  const criticalRisk = branchData.filter(b => b.probability >= 85).length
  const highRisk = branchData.filter(b => b.probability >= 70 && b.probability < 85).length
  const mediumRisk = branchData.filter(b => b.probability >= 40 && b.probability < 70).length
  const lowRisk = branchData.filter(b => b.probability < 40).length
  
  const evacuationZoneA = branchData.filter(b => b.evacuationZone === 'A').length
  const avgProbability = Math.round(branchData.reduce((acc, b) => acc + b.probability, 0) / branchData.length)
  
  const earliestImpact = branchData.reduce((earliest, branch) => {
    const branchTime = new Date(`2025-${branch.earliestArrival}`)
    return branchTime < earliest ? branchTime : earliest
  }, new Date('2025-Aug 24, 12:00 AM'))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Critical Risk Card */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">Critical Risk</p>
            <p className="text-3xl font-bold mt-1">{criticalRisk}</p>
            <p className="text-red-100 text-xs mt-1">≥85% probability</p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* High Risk Card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">High Risk</p>
            <p className="text-3xl font-bold mt-1">{highRisk}</p>
            <p className="text-orange-100 text-xs mt-1">70-84% probability</p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <Wind className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Zone A Evacuations */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium">Zone A Branches</p>
            <p className="text-3xl font-bold mt-1">{evacuationZoneA}</p>
            <p className="text-purple-100 text-xs mt-1">Mandatory evacuation</p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <Shield className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Average Risk */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Avg. Probability</p>
            <p className="text-3xl font-bold mt-1">{avgProbability}%</p>
            <p className="text-blue-100 text-xs mt-1">All branches</p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  )
}