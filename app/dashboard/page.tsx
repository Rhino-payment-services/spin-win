'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface InventoryItem {
  name: string
  remaining: number
  distributed: number
  total: number
  percentage: number
  dailyDistributed: number
  dailyLimit: number
  dailyPercentage: number
}

interface DashboardData {
  items: InventoryItem[]
  totalDistributed: number
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/spin', {
        method: 'GET',
        cache: 'no-store'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const rawData = await response.json()
      
      // Process the data
      const inventory = rawData.inventory || {}
      const prizeCounts = rawData.prizeCounts || {}
      const dailyDistributed = rawData.dailyDistributed || {}
      const prizeConfig = rawData.prizeConfig || {}
      
      const items: InventoryItem[] = Object.keys(inventory)
        .filter(prizeName => prizeName !== 'Try Again') // Exclude "Try Again" from inventory
        .map(prizeName => {
          const remaining = inventory[prizeName]
          const distributed = prizeCounts[prizeName] || 0
          const config = prizeConfig[prizeName]
          const total = config?.total || 0
          const dailyLimit = config?.dailyLimit || 0
          const dailyDist = dailyDistributed[prizeName] || 0
          const percentage = total > 0 ? ((remaining / total) * 100) : 0
          const dailyPercentage = dailyLimit > 0 ? ((dailyDist / dailyLimit) * 100) : 0
          
          return {
            name: prizeName,
            remaining,
            distributed,
            total,
            percentage,
            dailyDistributed: dailyDist,
            dailyLimit,
            dailyPercentage
          }
        })
      
      setData({
        items,
        totalDistributed: Object.values(prizeCounts).reduce((sum: number, val: any) => sum + val, 0)
      })
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError('Failed to load inventory data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const getPrizeEmoji = (prizeName: string) => {
    switch (prizeName) {
      case 'Shirt': return '👕'
      case 'Book': return '📚'
      case 'Wristband': return '⌚'
      case 'Cap': return '🧢'
      case 'Umbrella': return '☂️'
      case 'Pen': return '✏️'
      case 'Try Again': return '🔄'
      default: return '🎁'
    }
  }

  const getStatusColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500'
    if (percentage > 25) return 'bg-yellow-500'
    if (percentage > 10) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getStatusText = (percentage: number) => {
    if (percentage > 50) return 'In Stock'
    if (percentage > 25) return 'Medium'
    if (percentage > 10) return 'Low'
    if (percentage > 0) return 'Critical'
    return 'Out of Stock'
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 mb-2">
                📊 Inventory Dashboard
              </h1>
              <p className="text-gray-600">
                Real-time monitoring of prize inventory
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-lg"
            >
              ← Back to Spin
            </Link>
          </div>
          
          <div className="flex gap-4 items-center text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
            <span>•</span>
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <span>•</span>
            <button
              onClick={fetchData}
              className="text-blue-900 hover:underline font-medium"
            >
              Refresh Now
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Total Items</span>
              <span className="text-3xl">📦</span>
            </div>
            <div className="text-3xl font-bold text-blue-900">
              {data?.items.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Distributed</span>
              <span className="text-3xl">🎁</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {data?.totalDistributed.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">Remaining</span>
              <span className="text-3xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {data?.items.reduce((sum, item) => sum + item.remaining, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-blue-900 border-b">
            <h2 className="text-xl font-bold text-white">Prize Inventory</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Prize</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Total Remaining</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Total Distributed</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Daily Distributed</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Daily Limit</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Stock Level</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Daily Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.items.map((item) => {
                  const dailyRemaining = item.dailyLimit - item.dailyDistributed
                  const dailyPercentageUsed = item.dailyLimit > 0 ? ((item.dailyDistributed / item.dailyLimit) * 100) : 0
                  
                  return (
                    <tr key={item.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getPrizeEmoji(item.name)}</span>
                          <span className="font-medium text-gray-900">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-bold text-blue-900">
                          {item.remaining.toLocaleString()} / {item.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-green-600">
                          {item.distributed.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-orange-600">
                          {item.dailyDistributed.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-700">
                          {item.dailyDistributed.toLocaleString()} / {item.dailyLimit.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">
                              {item.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full ${getStatusColor(item.percentage)} transition-all duration-500`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">
                              {dailyPercentageUsed.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full ${dailyPercentageUsed >= 100 ? 'bg-red-500' : dailyPercentageUsed >= 75 ? 'bg-orange-500' : 'bg-blue-500'} transition-all duration-500`}
                              style={{ width: `${Math.min(dailyPercentageUsed, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-center mt-1 text-gray-600">
                            {dailyRemaining} left today
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Dashboard auto-refreshes every 5 seconds</p>
          <p className="mt-1">Daily limits reset automatically at midnight</p>
        </div>
      </div>
    </div>
  )
}

