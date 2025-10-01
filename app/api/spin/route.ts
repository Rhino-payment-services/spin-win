import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for prize tracking (won prizes)
let prizeCounts: Record<string, number> = {
  'Cap': 0,
  'Umbrella': 0,
  '100k': 0,
  'Pen': 0,
  'Notebook': 0,
  'Try Again': 0
}

// Inventory management - starting caps for each prize
const INITIAL_INVENTORY = 1000

let prizeInventory: Record<string, number> = {
  'Cap': INITIAL_INVENTORY,
  'Umbrella': INITIAL_INVENTORY,
  '100k': INITIAL_INVENTORY,
  'Pen': INITIAL_INVENTORY,
  'Notebook': INITIAL_INVENTORY
  // 'Try Again' is not tracked - it's unlimited
}

// Prize configuration with probabilities
const prizes = [
  { name: 'Cap', probability: 30 },
  { name: 'Notebook', probability: 25 },
  { name: 'Try Again', probability: 25 },
  { name: 'Pen', probability: 10 },
  { name: 'Umbrella', probability: 9 },
  { name: '100k', probability: 1 }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { spinsUsed } = body

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

    // Check if the prize is still in stock (except "Try Again" which is unlimited)
    if (winningPrize !== 'Try Again' && prizeInventory[winningPrize] <= 0) {
      // If out of stock, give "Try Again" instead
      winningPrize = 'Try Again'
    }

    // Update prize count
    prizeCounts[winningPrize]++
    
    // Decrease inventory only for physical prizes (not "Try Again")
    if (winningPrize !== 'Try Again' && prizeInventory[winningPrize] !== undefined) {
      prizeInventory[winningPrize]--
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
  // Return current prize counts and inventory
  return NextResponse.json({
    prizeCounts: { ...prizeCounts },
    inventory: { ...prizeInventory }
  })
}

// Export inventory data for dashboard access
export function getInventoryData() {
  return {
    prizeCounts: { ...prizeCounts },
    inventory: { ...prizeInventory },
    initialInventory: INITIAL_INVENTORY
  }
}
