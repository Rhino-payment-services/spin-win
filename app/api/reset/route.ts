import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Prize from '../../../models/Prize'
import Device from '../../../models/Device'
import SpinRecord from '../../../models/SpinRecord'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Clear all collections
    await Prize.deleteMany({})
    await Device.deleteMany({})
    await SpinRecord.deleteMany({})
    
    // Create default prizes with full stock
    const defaultPrizes = [
      { name: 'Shirt', total: 50, dailyLimit: 5, currentStock: 50, dailyDistributed: 0, lastResetDate: new Date().toDateString() },
      { name: 'Book', total: 50, dailyLimit: 5, currentStock: 50, dailyDistributed: 0, lastResetDate: new Date().toDateString() },
      { name: 'Pen', total: 40, dailyLimit: 4, currentStock: 40, dailyDistributed: 0, lastResetDate: new Date().toDateString() },
      { name: 'Cap', total: 40, dailyLimit: 4, currentStock: 40, dailyDistributed: 0, lastResetDate: new Date().toDateString() },
      { name: 'Umbrella', total: 40, dailyLimit: 4, currentStock: 40, dailyDistributed: 0, lastResetDate: new Date().toDateString() },
      { name: 'Wristband', total: 200, dailyLimit: 18, currentStock: 200, dailyDistributed: 0, lastResetDate: new Date().toDateString() }
    ]
    
    await Prize.insertMany(defaultPrizes)
    
    return NextResponse.json({
      message: 'Database reset successfully! All prizes restored to full stock.',
      prizes: defaultPrizes
    })
    
  } catch (error) {
    console.error('Error resetting database:', error)
    return NextResponse.json(
      { error: 'Failed to reset database' },
      { status: 500 }
    )
  }
}
