'use client'

import React from 'react'
import { Clock, AlertCircle } from 'lucide-react'

interface TimelineProps {
  branchData: any[]
}

export default function Timeline({ branchData }: TimelineProps) {
  // Group branches by arrival time
  const timelineData = branchData
    .sort((a, b) => {
      const timeA = new Date(`2025-${a.mostLikelyArrival}`)
      const timeB = new Date(`2025-${b.mostLikelyArrival}`)
      return timeA.getTime() - timeB.getTime()
    })
    .reduce((acc: any, branch) => {
      const time = branch.mostLikelyArrival
      if (!acc[time]) {
        acc[time] = []
      }
      acc[time].push(branch)
      return acc
    }, {})

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <Clock className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Impact Timeline</h2>
      </div>
      
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        {Object.entries(timelineData).slice(0, 10).map(([time, branches]: [string, any], index) => (
          <div key={time} className="relative flex items-start mb-6">
            <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
              branches.some((b: any) => b.probability >= 85) ? 'bg-red-500' :
              branches.some((b: any) => b.probability >= 70) ? 'bg-orange-500' :
              'bg-yellow-500'
            }`}>
              <span className="text-white text-xs font-bold">{branches.length}</span>
            </div>
            
            <div className="ml-12">
              <p className="text-sm font-semibold text-gray-900">{time}</p>
              <div className="mt-1 space-y-1">
                {branches.slice(0, 3).map((branch: any) => (
                  <div key={branch.branchNumber} className="flex items-center text-xs text-gray-600">
                    <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                      branch.probability >= 85 ? 'bg-red-500' :
                      branch.probability >= 70 ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}></span>
                    <span className="font-medium">{branch.locationName}</span>
                    <span className="ml-1 text-gray-400">({branch.probability}%)</span>
                  </div>
                ))}
                {branches.length > 3 && (
                  <p className="text-xs text-gray-400">+{branches.length - 3} more branches</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}