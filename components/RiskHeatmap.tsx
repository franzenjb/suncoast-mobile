'use client'

import React from 'react'
import { MapPin, Navigation } from 'lucide-react'

interface RiskHeatmapProps {
  branchData: any[]
}

export default function RiskHeatmap({ branchData }: RiskHeatmapProps) {
  // Group by county and calculate average risk
  const countyRisks = branchData.reduce((acc: any, branch) => {
    if (!acc[branch.county]) {
      acc[branch.county] = { total: 0, count: 0, branches: [] }
    }
    acc[branch.county].total += branch.probability
    acc[branch.county].count += 1
    acc[branch.county].branches.push(branch)
    return acc
  }, {})

  const countyData = Object.entries(countyRisks)
    .map(([county, data]: [string, any]) => ({
      county,
      avgRisk: Math.round(data.total / data.count),
      count: data.count,
      highRisk: data.branches.filter((b: any) => b.probability >= 70).length
    }))
    .sort((a, b) => b.avgRisk - a.avgRisk)

  const getRiskGradient = (risk: number) => {
    if (risk >= 70) return 'bg-gradient-to-r from-red-500 to-red-600'
    if (risk >= 50) return 'bg-gradient-to-r from-orange-500 to-orange-600'
    if (risk >= 30) return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    return 'bg-gradient-to-r from-green-500 to-green-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <MapPin className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-900">County Risk Analysis</h2>
        </div>
        <Navigation className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        {countyData.slice(0, 8).map((county) => (
          <div key={county.county} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{county.county}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{county.count} branches</span>
                <span className="text-sm font-bold text-gray-900">{county.avgRisk}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className={`h-full rounded-full ${getRiskGradient(county.avgRisk)} flex items-center justify-end pr-2 transition-all duration-500`}
                style={{ width: `${county.avgRisk}%` }}
              >
                {county.highRisk > 0 && (
                  <span className="text-white text-xs font-medium">
                    {county.highRisk} high risk
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Risk Scale</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
              <span>High</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span>Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}