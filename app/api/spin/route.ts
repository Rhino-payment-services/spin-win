import { NextRequest, NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Prize from '../../../models/Prize'
import Device from '../../../models/Device'
import SpinRecord from '../../../models/SpinRecord'

// Prize configuration with probabilities
const prizes = [
  { name: 'Wristband', probability: 40 },  // Highest chance
  { name: 'Shirt', probability: 15 },
  { name: 'Book', probability: 15 },
  { name: 'Try Again', probability: 12 },
  { name: 'Pen', probability: 8 },
  { name: 'Cap', probability: 7 },
  { name: 'Umbrella', probability: 3 }
]

// Initial prize configuration
const initialPrizeConfig = {
  'Shirt': { total: 50, dailyLimit: 5 },
  'Book': { total: 50, dailyLimit: 5 },
  'Pen': { total: 40, dailyLimit: 4 },
  'Cap': { total: 40, dailyLimit: 4 },
  'Umbrella': { total: 40, dailyLimit: 4 },
  'Wristband': { total: 200, dailyLimit: 18 }
}

// Initialize prizes in database if they don't exist
async function initializePrizes() {
  try {
    await connectDB()
    
    for (const [prizeName, config] of Object.entries(initialPrizeConfig)) {
      const existingPrize = await Prize.findOne({ name: prizeName })
      if (!existingPrize) {
        await Prize.create({
          name: prizeName,
          total: config.total,
          dailyLimit: config.dailyLimit,
          currentStock: config.total,
          dailyDistributed: 0,
          lastResetDate: new Date().toDateString()
        })
      }
    }
  } catch (error) {
    console.error('Error initializing prizes:', error)
  }
}

// Reset daily counts if it's a new day
async function checkAndResetDaily() {
  try {
    await connectDB()
    const today = new Date().toDateString()
    
    const prizes = await Prize.find({})
    for (const prize of prizes) {
      if (prize.lastResetDate !== today) {
        prize.dailyDistributed = 0
        prize.lastResetDate = today
        await prize.save()
      }
    }
  } catch (error) {
    console.error('Error resetting daily counts:', error)
  }
}

// Get available prizes based on inventory and daily limits
async function getAvailablePrizes() {
  try {
    await connectDB()
    await checkAndResetDaily()
    
    const prizes = await Prize.find({})
    const availablePrizes = []
    
    for (const prize of prizes) {
      // Check if prize has stock and hasn't exceeded daily limit
      if (prize.currentStock > 0 && prize.dailyDistributed < prize.dailyLimit) {
        availablePrizes.push({
          name: prize.name,
          probability: getPrizeProbability(prize.name)
        })
      }
    }
    
    // Always include "Try Again" as it's unlimited
    availablePrizes.push({
      name: 'Try Again',
      probability: getPrizeProbability('Try Again')
    })
    
    return availablePrizes
  } catch (error) {
    console.error('Error getting available prizes:', error)
    return [{ name: 'Try Again', probability: 100 }] // Fallback
  }
}

// Get probability for a specific prize
function getPrizeProbability(prizeName: string) {
  const prize = prizes.find(p => p.name === prizeName)
  return prize ? prize.probability : 0
}

// Select a random prize based on probabilities
function selectRandomPrize(availablePrizes: any[]) {
  const totalProbability = availablePrizes.reduce((sum, prize) => sum + prize.probability, 0)
  let random = Math.random() * totalProbability
  
  for (const prize of availablePrizes) {
    random -= prize.probability
    if (random <= 0) {
      return prize.name
    }
  }
  
  return 'Try Again' // Fallback
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    await initializePrizes()
    await checkAndResetDaily()
    
    const body = await request.json()
    const { spinsUsed, deviceId } = body
    const deviceFingerprint = request.headers.get('X-Device-ID') || deviceId

    // Check if this device has already spun
    if (deviceFingerprint) {
      const existingDevice = await Device.findOne({ deviceId: deviceFingerprint })
      if (existingDevice && existingDevice.hasSpun) {
        return NextResponse.json(
          { error: 'This device has already been used to spin' },
          { status: 400 }
        )
      }
    }

    // Check if user has exceeded spin limit
    if (spinsUsed >= 1) {
      return NextResponse.json(
        { error: 'Maximum spins reached (1 spin allowed)' },
        { status: 400 }
      )
    }

    // Get available prizes
    const availablePrizes = await getAvailablePrizes()
    const selectedPrize = selectRandomPrize(availablePrizes)

    // Update inventory if it's not "Try Again"
    if (selectedPrize !== 'Try Again') {
      const prize = await Prize.findOne({ name: selectedPrize })
      if (prize && prize.currentStock > 0 && prize.dailyDistributed < prize.dailyLimit) {
        prize.currentStock -= 1
        prize.dailyDistributed += 1
        await prize.save()
      } else {
        // Fallback to "Try Again" if prize is no longer available
        return NextResponse.json({
          prize: 'Try Again',
          message: 'Better luck next time! Try again!',
          spinsUsed: 1,
          spinsRemaining: 0
        })
      }
    }

    // Record the device as having spun
    if (deviceFingerprint) {
      await Device.findOneAndUpdate(
        { deviceId: deviceFingerprint },
        { 
          deviceId: deviceFingerprint,
          hasSpun: true,
          spunAt: new Date()
        },
        { upsert: true, new: true }
      )
    }

    // Record the spin
    await SpinRecord.create({
      deviceId: deviceFingerprint || 'unknown',
      prizeWon: selectedPrize,
      spunAt: new Date()
    })

    // Get prize message
    const getPrizeMessage = (prize: string) => {
      switch (prize) {
        case 'Shirt': return 'Congratulations! You won a RukaPay T-Shirt! 👕'
        case 'Book': return 'Amazing! You won a RukaPay Book! 📚'
        case 'Wristband': return 'Awesome! You won a RukaPay Wristband! ⌚'
        case 'Cap': return 'Great! You won a RukaPay Cap! 🧢'
        case 'Umbrella': return 'Nice! You won a RukaPay Umbrella! ☂️'
        case 'Pen': return 'Cool! You won a RukaPay Pen! ✏️'
        case 'Try Again': return 'Better luck next time! Try again! 🔄'
        default: return 'Congratulations! You won a prize! 🎁'
      }
    }

    return NextResponse.json({
      prize: selectedPrize,
      message: getPrizeMessage(selectedPrize),
      spinsUsed: 1,
      spinsRemaining: 0
    })

  } catch (error) {
    console.error('Error in spin API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    await initializePrizes()
    await checkAndResetDaily()
    
    // Check if device has already spun
    const deviceFingerprint = request.headers.get('X-Device-ID')
    let deviceHasSpun = false
    
    if (deviceFingerprint) {
      const device = await Device.findOne({ deviceId: deviceFingerprint })
      deviceHasSpun = device ? device.hasSpun : false
    }

    // Get all prizes with their current status
    const prizes = await Prize.find({})
    
    // Calculate prize counts (total distributed)
    const prizeCounts: Record<string, number> = {}
    const inventory: Record<string, number> = {}
    const dailyDistributed: Record<string, number> = {}
    const prizeConfig: Record<string, any> = {}
    
    for (const prize of prizes) {
      prizeCounts[prize.name] = prize.total - prize.currentStock
      inventory[prize.name] = prize.currentStock
      dailyDistributed[prize.name] = prize.dailyDistributed
      prizeConfig[prize.name] = {
        total: prize.total,
        dailyLimit: prize.dailyLimit
      }
    }

    return NextResponse.json({
      prizeCounts,
      inventory,
      dailyDistributed,
      prizeConfig,
      deviceHasSpun
    })

  } catch (error) {
    console.error('Error in GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}