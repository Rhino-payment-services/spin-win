import { NextResponse } from 'next/server'

// This will be imported from the spin route to access the same data
// Note: In production, you'd want to use a proper database
// For now, we'll fetch from the spin endpoint

export async function GET() {
  try {
    // In a real app, this would query a database
    // For now, we'll return the data from the spin endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/spin`, {
      method: 'GET',
      cache: 'no-store'
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch inventory data')
    }
    
    const data = await response.json()
    
    // Calculate additional metrics
    const inventory = data.inventory || {}
    const prizeCounts = data.prizeCounts || {}
    const INITIAL_INVENTORY = 1000
    
    const dashboardData = Object.keys(inventory).map(prizeName => {
      const remaining = inventory[prizeName]
      const distributed = prizeCounts[prizeName] || 0
      const percentage = ((remaining / INITIAL_INVENTORY) * 100).toFixed(1)
      
      return {
        name: prizeName,
        remaining,
        distributed,
        total: INITIAL_INVENTORY,
        percentage: parseFloat(percentage)
      }
    })
    
    return NextResponse.json({
      items: dashboardData,
      totalDistributed: Object.values(prizeCounts).reduce((sum: number, val: any) => sum + val, 0)
    })
  } catch (error) {
    console.error('Inventory fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    )
  }
}

