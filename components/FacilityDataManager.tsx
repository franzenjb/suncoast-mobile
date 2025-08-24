'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Lock, Eye, EyeOff, Save, Edit2, X, Check, Plus, Trash2, Download, Upload, Filter, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

interface FacilityData {
  id: number
  type: string
  branchName: string
  branchNumber: number | null
  address: string
  city: string
  state: string
  zipCode: string
  county: string
  evacZone: string
  femaFloodRisk: string
  wildfireRisk: string
  minimumManning: number | null
  armedGuard: string
  branchHub: string
  region: number | null
  floodRiskNotes: string
}

type SortField = 'branchName' | 'city' | 'county' | 'evacZone' | 'femaFloodRisk' | 'wildfireRisk' | 'minimumManning' | 'region' | 'branchNumber'
type SortDirection = 'asc' | 'desc'

export default function FacilityDataManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [facilities, setFacilities] = useState<FacilityData[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<FacilityData | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCounty, setFilterCounty] = useState('all')
  const [filterRegion, setFilterRegion] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [sortField, setSortField] = useState<SortField>('branchName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [newFacility, setNewFacility] = useState<Partial<FacilityData>>({
    type: 'Branch',
    state: 'FL',
    armedGuard: 'No',
    branchHub: 'No'
  })

  // Initial data from Excel file
  const initialData: FacilityData[] = [
    {id: 1, type: "Branch", branchName: "Brooksville", branchNumber: 11, address: "18915 Cortez Boulevard", city: "Brooksville", state: "FL", zipCode: "34601", county: "Hernando", evacZone: "No", femaFloodRisk: "N", wildfireRisk: "Moderate", minimumManning: 8, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: "Surrounded by marshland and retention ponds"},
    {id: 2, type: "Branch", branchName: "Bushnell", branchNumber: 59, address: "217 West Belt Avenue", city: "Bushnell", state: "FL", zipCode: "33513", county: "Sumter", evacZone: "No", femaFloodRisk: "N", wildfireRisk: "High", minimumManning: 6, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: ""},
    {id: 3, type: "Branch", branchName: "Chiefland", branchNumber: 88, address: "2153 NW 11th Drive", city: "Chiefland", state: "FL", zipCode: "32626", county: "Levy", evacZone: "No", femaFloodRisk: "N", wildfireRisk: "High", minimumManning: 4, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: ""},
    {id: 4, type: "Branch", branchName: "Crystal River", branchNumber: 51, address: "1039 NE 5th Street", city: "Crystal River", state: "FL", zipCode: "34429", county: "Citrus", evacZone: "A", femaFloodRisk: "Y", wildfireRisk: "Low", minimumManning: 5, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: "Coastal location, surge risk"},
    {id: 5, type: "Branch", branchName: "Dade City", branchNumber: 21, address: "12510 South Highway 301", city: "Dade City", state: "FL", zipCode: "33525", county: "Pasco", evacZone: "No", femaFloodRisk: "N", wildfireRisk: "Moderate", minimumManning: 6, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: ""},
    {id: 6, type: "Branch", branchName: "Holiday", branchNumber: 49, address: "3422 U.S. Highway 19", city: "Holiday", state: "FL", zipCode: "34691", county: "Pasco", evacZone: "B", femaFloodRisk: "Y", wildfireRisk: "Low", minimumManning: 7, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: "Near coast"},
    {id: 7, type: "Branch", branchName: "Inverness", branchNumber: 18, address: "2367 East Gulf to Lake Highway", city: "Inverness", state: "FL", zipCode: "34450", county: "Citrus", evacZone: "No", femaFloodRisk: "N", wildfireRisk: "Moderate", minimumManning: 5, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: ""},
    {id: 8, type: "Branch", branchName: "Port Richey", branchNumber: 3, address: "7225 Ridge Road", city: "Port Richey", state: "FL", zipCode: "34668", county: "Pasco", evacZone: "C", femaFloodRisk: "Y", wildfireRisk: "Low", minimumManning: 8, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: ""},
    {id: 9, type: "Branch", branchName: "Spring Hill", branchNumber: 22, address: "4139 Commercial Way", city: "Spring Hill", state: "FL", zipCode: "34606", county: "Hernando", evacZone: "No", femaFloodRisk: "N", wildfireRisk: "Moderate", minimumManning: 7, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: ""},
    {id: 10, type: "Branch", branchName: "Trinity", branchNumber: 172, address: "10843 State Road 54", city: "Trinity", state: "FL", zipCode: "34655", county: "Pasco", evacZone: "No", femaFloodRisk: "N", wildfireRisk: "Low", minimumManning: 6, armedGuard: "No", branchHub: "No", region: 1, floodRiskNotes: ""},
  ]

  useEffect(() => {
    // Load data from localStorage or use initial data
    const savedData = localStorage.getItem('facilityData')
    if (savedData) {
      setFacilities(JSON.parse(savedData))
    } else {
      setFacilities(initialData)
    }
  }, [])

  const handleLogin = () => {
    // WARNING: Client-side password check is NOT secure for production
    // Anyone can view this in the source code
    // For production, use server-side authentication with hashed passwords
    if (password === 'scu2025') {
      setIsAuthenticated(true)
      setPasswordError('')
    } else {
      setPasswordError('Incorrect password. Please try again.')
    }
  }

  const handleSave = () => {
    if (editData) {
      setFacilities(prev => {
        const updated = prev.map(f => f.id === editData.id ? editData : f)
        localStorage.setItem('facilityData', JSON.stringify(updated))
        return updated
      })
      setEditingId(null)
      setEditData(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData(null)
  }

  const handleEdit = (facility: FacilityData) => {
    setEditingId(facility.id)
    setEditData({ ...facility })
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      setFacilities(prev => {
        const updated = prev.filter(f => f.id !== id)
        localStorage.setItem('facilityData', JSON.stringify(updated))
        return updated
      })
    }
  }

  const handleAddNew = () => {
    const newId = Math.max(...facilities.map(f => f.id)) + 1
    const facilityToAdd: FacilityData = {
      id: newId,
      type: newFacility.type || 'Branch',
      branchName: newFacility.branchName || '',
      branchNumber: newFacility.branchNumber || null,
      address: newFacility.address || '',
      city: newFacility.city || '',
      state: newFacility.state || 'FL',
      zipCode: newFacility.zipCode || '',
      county: newFacility.county || '',
      evacZone: newFacility.evacZone || 'No',
      femaFloodRisk: newFacility.femaFloodRisk || 'N',
      wildfireRisk: newFacility.wildfireRisk || 'Low',
      minimumManning: newFacility.minimumManning || null,
      armedGuard: newFacility.armedGuard || 'No',
      branchHub: newFacility.branchHub || 'No',
      region: newFacility.region || null,
      floodRiskNotes: newFacility.floodRiskNotes || ''
    }
    
    setFacilities(prev => {
      const updated = [...prev, facilityToAdd]
      localStorage.setItem('facilityData', JSON.stringify(updated))
      return updated
    })
    
    setShowAddForm(false)
    setNewFacility({
      type: 'Branch',
      state: 'FL',
      armedGuard: 'No',
      branchHub: 'No'
    })
  }

  const exportToCSV = () => {
    const headers = ['Type', 'Branch Name', 'Branch #', 'Address', 'City', 'State', 'Zip', 'County', 'Evac Zone', 'FEMA Risk', 'Wildfire Risk', 'Min Manning', 'Armed Guard', 'Hub', 'Region', 'Notes']
    const rows = filteredAndSortedFacilities.map(f => [
      f.type,
      f.branchName,
      f.branchNumber || '',
      f.address,
      f.city,
      f.state,
      f.zipCode,
      f.county,
      f.evacZone,
      f.femaFloodRisk,
      f.wildfireRisk,
      f.minimumManning || '',
      f.armedGuard,
      f.branchHub,
      f.region || '',
      f.floodRiskNotes
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `facility-data-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort facilities
  const filteredAndSortedFacilities = facilities
    .filter(f => {
      const matchesSearch = searchTerm === '' || 
        f.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.address.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCounty = filterCounty === 'all' || f.county === filterCounty
      const matchesRegion = filterRegion === 'all' || f.region?.toString() === filterRegion
      
      return matchesSearch && matchesCounty && matchesRegion
    })
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      // Handle null values
      if (aValue === null || aValue === undefined) aValue = ''
      if (bValue === null || bValue === undefined) bValue = ''
      
      // Compare values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortDirection === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }
    })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-blue-600" />
      : <ChevronDown className="h-4 w-4 text-blue-600" />
  }

  const counties = Array.from(new Set(facilities.map(f => f.county))).sort()
  const regions = Array.from(new Set(facilities.map(f => f.region).filter(r => r !== null))).sort()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Facility Data Access</h2>
          <p className="text-gray-600 text-center mb-6">This section requires authentication</p>
          
          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {passwordError && (
              <p className="text-red-600 text-sm">{passwordError}</p>
            )}
            
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Access Facility Data
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Facility Data Management</h2>
            <p className="text-gray-600 mt-1">Manage branch and facility information across all regions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search facilities..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterCounty}
            onChange={(e) => setFilterCounty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Counties</option>
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
          
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>Region {region}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add New Facility Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Add New Facility</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Branch Name"
              value={newFacility.branchName || ''}
              onChange={(e) => setNewFacility({...newFacility, branchName: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Branch Number"
              value={newFacility.branchNumber || ''}
              onChange={(e) => setNewFacility({...newFacility, branchNumber: parseInt(e.target.value) || null})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={newFacility.address || ''}
              onChange={(e) => setNewFacility({...newFacility, address: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="City"
              value={newFacility.city || ''}
              onChange={(e) => setNewFacility({...newFacility, city: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="County"
              value={newFacility.county || ''}
              onChange={(e) => setNewFacility({...newFacility, county: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={newFacility.zipCode || ''}
              onChange={(e) => setNewFacility({...newFacility, zipCode: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Facility
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  onClick={() => handleSort('branchName')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Branch</span>
                    <SortIcon field="branchName" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('city')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Location</span>
                    <SortIcon field="city" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('county')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>County</span>
                    <SortIcon field="county" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('evacZone')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Evac Zone</span>
                    <SortIcon field="evacZone" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('femaFloodRisk')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>FEMA Risk</span>
                    <SortIcon field="femaFloodRisk" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('wildfireRisk')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Wildfire</span>
                    <SortIcon field="wildfireRisk" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('minimumManning')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Manning</span>
                    <SortIcon field="minimumManning" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('region')}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Region</span>
                    <SortIcon field="region" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedFacilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-gray-50">
                  {editingId === facility.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editData?.branchName || ''}
                          onChange={(e) => setEditData({...editData!, branchName: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editData?.city || ''}
                          onChange={(e) => setEditData({...editData!, city: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editData?.county || ''}
                          onChange={(e) => setEditData({...editData!, county: e.target.value})}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editData?.evacZone || ''}
                          onChange={(e) => setEditData({...editData!, evacZone: e.target.value})}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editData?.femaFloodRisk || ''}
                          onChange={(e) => setEditData({...editData!, femaFloodRisk: e.target.value})}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="Y">Y</option>
                          <option value="N">N</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={editData?.wildfireRisk || ''}
                          onChange={(e) => setEditData({...editData!, wildfireRisk: e.target.value})}
                          className="w-24 px-2 py-1 border border-gray-300 rounded"
                        >
                          <option value="Low">Low</option>
                          <option value="Moderate">Moderate</option>
                          <option value="High">High</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editData?.minimumManning || ''}
                          onChange={(e) => setEditData({...editData!, minimumManning: parseInt(e.target.value) || null})}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={editData?.region || ''}
                          onChange={(e) => setEditData({...editData!, region: parseInt(e.target.value) || null})}
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{facility.branchName}</div>
                        <div className="text-sm text-gray-500">#{facility.branchNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">{facility.city}</div>
                        <div className="text-xs text-gray-500">{facility.address}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{facility.county}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          facility.evacZone === 'A' ? 'bg-red-100 text-red-800' :
                          facility.evacZone === 'B' ? 'bg-orange-100 text-orange-800' :
                          facility.evacZone === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {facility.evacZone}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          facility.femaFloodRisk === 'Y' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {facility.femaFloodRisk}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          facility.wildfireRisk === 'High' ? 'bg-red-100 text-red-800' :
                          facility.wildfireRisk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {facility.wildfireRisk}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{facility.minimumManning}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{facility.region}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(facility)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(facility.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Facilities</div>
          <div className="text-2xl font-bold text-gray-900">{filteredAndSortedFacilities.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">High Risk (Evac A)</div>
          <div className="text-2xl font-bold text-red-600">
            {filteredAndSortedFacilities.filter(f => f.evacZone === 'A').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">FEMA Flood Risk</div>
          <div className="text-2xl font-bold text-blue-600">
            {filteredAndSortedFacilities.filter(f => f.femaFloodRisk === 'Y').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">High Wildfire Risk</div>
          <div className="text-2xl font-bold text-orange-600">
            {filteredAndSortedFacilities.filter(f => f.wildfireRisk === 'High').length}
          </div>
        </div>
      </div>
    </div>
  )
}