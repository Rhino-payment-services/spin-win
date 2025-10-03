import { NextRequest, NextResponse } from 'next/server'

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

// Get all available prizes (no database restrictions)
function getAvailablePrizes() {
  return prizes.map(prize => ({
    name: prize.name,
    probability: prize.probability
  }))
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
    // Get available prizes (no database restrictions)
    const availablePrizes = getAvailablePrizes()
    const selectedPrize = selectRandomPrize(availablePrizes)

    // Get prize message
    const getPrizeMessage = (prize: string) => {
      switch (prize) {
        case 'Shirt': return 'Congratulations! You won a RukaPay T-Shirt! 👕'
        case 'Book': return 'Amazing! You won a RukaPay Book! 📚'
        case 'Wristband': return 'Awesome! You won a RukaPay Wristband! 🎗️'
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
      spinsRemaining: 999 // Unlimited spins
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
    // Return basic prize information without database dependencies
    const prizeCounts: Record<string, number> = {}
    const inventory: Record<string, number> = {}
    const dailyDistributed: Record<string, number> = {}
    const prizeConfig: Record<string, any> = {}
    
    // Initialize with default values for all prizes
    for (const prize of prizes) {
      prizeCounts[prize.name] = 0 // No tracking without database
      inventory[prize.name] = 999 // Unlimited inventory
      dailyDistributed[prize.name] = 0
      prizeConfig[prize.name] = {
        total: 999,
        dailyLimit: 999
      }
    }

    return NextResponse.json({
      prizeCounts,
      inventory,
      dailyDistributed,
      prizeConfig,
      deviceHasSpun: false // No device restrictions
    })

  } catch (error) {
    console.error('Error in GET API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}