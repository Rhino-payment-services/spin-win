import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for prize tracking (won prizes)
let prizeCounts: Record<string, number> = {
  'Shirt': 0,
  'Book': 0,
  'Pen': 0,
  'Cap': 0,
  'Umbrella': 0,
  'Wristband': 0,
  'Try Again': 0
}

// Inventory management - total caps and daily limits for each prize
const prizeConfig = {
  'Shirt': { total: 50, dailyLimit: 5 },
  'Book': { total: 50, dailyLimit: 5 },
  'Pen': { total: 40, dailyLimit: 4 },
  'Cap': { total: 40, dailyLimit: 4 },
  'Umbrella': { total: 40, dailyLimit: 4 },
  'Wristband': { total: 200, dailyLimit: 18 }
  // 'Try Again' is not tracked - it's unlimited
}

let prizeInventory: Record<string, number> = {
  'Shirt': 50,
  'Book': 50,
  'Pen': 40,
  'Cap': 40,
  'Umbrella': 40,
  'Wristband': 200
}

// Daily tracking - resets every day
let dailyDistributed: Record<string, number> = {
  'Shirt': 0,
  'Book': 0,
  'Pen': 0,
  'Cap': 0,
  'Umbrella': 0,
  'Wristband': 0
}

let lastResetDate = new Date().toDateString()

// Function to reset daily counts if it's a new day
function checkAndResetDaily() {
  const today = new Date().toDateString()
  if (today !== lastResetDate) {
    // Reset all daily counts
    Object.keys(dailyDistributed).forEach(key => {
      dailyDistributed[key] = 0
    })
    lastResetDate = today
  }
}

// Prize configuration with probabilities
const prizes = [
  { name: 'Shirt', probability: 20 },
  { name: 'Book', probability: 20 },
  { name: 'Wristband', probability: 20 },
  { name: 'Try Again', probability: 15 },
  { name: 'Pen', probability: 10 },
  { name: 'Cap', probability: 10 },
  { name: 'Umbrella', probability: 5 }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { spinsUsed } = body

    // Check and reset daily counts if it's a new day
    checkAndResetDaily()

    // Check if user has exceeded spin limit
    if (spinsUsed >= 1) {
      return NextResponse.json(
        { error: 'Maximum spins reached (1 spin allowed)' },
        { status: 400 }
      )
    }

    // Generate random number between 1-100
    const random = Math.random() * 100

    // Find the winning prize based on probability
    let cumulativeProbability = 0
    let winningPrize = 'Try Again' // fallback

    for (const prize of prizes) {
      cumulativeProbability += prize.probability
      if (random <= cumulativeProbability) {
        winningPrize = prize.name
        break
      }
    }

    // Check if the prize is still available (except "Try Again" which is unlimited)
    if (winningPrize !== 'Try Again') {
      const config = prizeConfig[winningPrize]
      
      // Check total inventory
      if (prizeInventory[winningPrize] <= 0) {
        winningPrize = 'Try Again'
      }
      // Check daily limit
      else if (dailyDistributed[winningPrize] >= config.dailyLimit) {
        winningPrize = 'Try Again'
      }
    }

    // Update prize count
    prizeCounts[winningPrize]++
    
    // Decrease inventory and update daily count only for physical prizes (not "Try Again")
    if (winningPrize !== 'Try Again' && prizeInventory[winningPrize] !== undefined) {
      prizeInventory[winningPrize]--
      dailyDistributed[winningPrize]++
    }

    return NextResponse.json({
      prize: winningPrize,
      prizeCounts: { ...prizeCounts },
      spinsRemaining: 1 - (spinsUsed + 1)
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Check and reset daily counts if it's a new day
  checkAndResetDaily()
  
  // Return current prize counts, inventory, daily limits, and config
  return NextResponse.json({
    prizeCounts: { ...prizeCounts },
    inventory: { ...prizeInventory },
    dailyDistributed: { ...dailyDistributed },
    prizeConfig: { ...prizeConfig }
  })
}
