import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Prize from '../../../models/Prize'

export async function GET() {
  try {
    await connectDB()
    
    // Get all prizes with their current status
    const prizes = await Prize.find({})
    
    // Calculate inventory data
    const inventoryData = {
      prizes: prizes.map(prize => ({
        name: prize.name,
        total: prize.total,
        currentStock: prize.currentStock,
        dailyLimit: prize.dailyLimit,
        dailyDistributed: prize.dailyDistributed,
        dailyPercentage: prize.dailyLimit > 0 ? (prize.dailyDistributed / prize.dailyLimit) * 100 : 0,
        percentage: (prize.currentStock / prize.total) * 100
      }))
    }

    return NextResponse.json(inventoryData)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}