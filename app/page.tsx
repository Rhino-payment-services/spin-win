'use client'

import { useState, useEffect } from 'react'
import SpinningWheel from './components/SpinningWheel'
import ResultModal from './components/ResultModal'

interface PrizeCounts {
  [key: string]: number
}

export default function Home() {
  const [spinsUsed, setSpinsUsed] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [winningPrize, setWinningPrize] = useState('')
  const [prizeCounts, setPrizeCounts] = useState<PrizeCounts>({})
  const [spinsRemaining, setSpinsRemaining] = useState(999) // Unlimited spins
  const [isClient, setIsClient] = useState(false)

  // Initialize on mount
  useEffect(() => {
    // Mark as client-side
    setIsClient(true)
    
    // Load initial data
    const loadInitialData = async () => {
      try {
        const response = await fetch('/api/spin', {
          method: 'GET'
        })
        
        if (response.ok) {
          const data = await response.json()
          setPrizeCounts(data.prizeCounts || {})
          setSpinsRemaining(data.spinsRemaining || 999)
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
      }
    }
    
    loadInitialData()
  }, [])

  const prizes = [
    { name: 'Shirt', color: '#8b5cf6', icon: '👕' },      // Purple
    { name: 'Book', color: '#f97316', icon: '📚' },       // Orange-red
    { name: 'Wristband', color: '#10b981', icon: '🎗️' },   // Lime green
    { name: 'Try Again', color: '#3b82f6', icon: '🔄' },  // Blue
    { name: 'Pen', color: '#f59e0b', icon: '✏️' },        // Bright orange
    { name: 'Cap', color: '#ec4899', icon: '🧢' },        // Hot pink
    { name: 'Umbrella', color: '#14b8a6', icon: '☂️' }    // Teal
  ]

  const handleSpin = async () => {
    // Only prevent spinning if already spinning
    if (isSpinning) return

    console.log('Starting spin...', { spinsUsed, isSpinning })
    setIsSpinning(true)

    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ spinsUsed }),
      })

      const data = await response.json()
      console.log('API response:', data)

      if (response.ok) {
        setWinningPrize(data.prize)
        setPrizeCounts(data.prizeCounts || {})
        setSpinsRemaining(data.spinsRemaining || 999)
        setSpinsUsed(spinsUsed + 1)
        
        // Show result after spinning animation
        setTimeout(() => {
          setIsSpinning(false)
          setShowResult(true)
        }, 4000)
      } else {
        setIsSpinning(false)
        alert(data.error || 'Failed to spin')
      }
    } catch (error) {
      console.error('Spin error:', error)
      setIsSpinning(false)
      alert('Network error. Please try again.')
    }
  }

  const closeModal = () => {
    setShowResult(false)
  }

  return (
    <div className="min-h-screen bg-white py-3 sm:py-6 lg:py-8 xl:py-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8 xl:mb-12">
          <div className="mb-3 sm:mb-6 hidden sm:block">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 mb-3 sm:mb-4">
              <div className="rukapay-logo">
                <div className="logo-circle">
                  <div className="logo-r">R</div>
                  <div className="logo-accent accent-1"></div>
                  <div className="logo-accent accent-2"></div>
                  <div className="logo-horn"></div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-900 mb-2 sm:mb-3 lg:mb-4 px-4">
            RukaPay Spin & Win
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 mb-3 sm:mb-4 px-4">
            Tap to pay, the Ugandan way. Spin the wheel and win amazing prizes!
          </p>
          <div className="inline-flex items-center px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-blue-50 rounded-full shadow-none sm:shadow-sm border border-blue-200 mx-4">
            <span className="text-blue-900 font-semibold text-xs sm:text-sm lg:text-base">Spins used:</span>
            <span className="ml-2 text-lg sm:text-xl lg:text-2xl font-bold text-blue-900">
              {isClient ? spinsUsed : 0}
            </span>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center lg:items-start justify-center">
          {/* Wheel Container */}
          <div className="flex-shrink-0 w-full max-w-sm sm:max-w-md lg:max-w-none">
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 xl:p-8 shadow-none sm:shadow-lg lg:shadow-xl border border-gray-200">
              <SpinningWheel
                prizes={prizes}
                isSpinning={isSpinning}
                winningPrize={winningPrize}
              />
              
              {/* Spin Button */}
              <div className="text-center mt-3 sm:mt-4 lg:mt-6 xl:mt-8">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className={`w-full sm:w-auto px-5 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-3 lg:py-4 text-base sm:text-lg lg:text-xl xl:text-2xl font-bold rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 ${
                    isSpinning
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-900 text-white hover:bg-blue-800 hover:scale-105 active:scale-95 shadow-none sm:shadow-md hover:shadow-lg'
                  }`}
                >
                  {isSpinning ? 'Spinning...' : 'SPIN!'}
                </button>
                <p className="text-xs sm:text-sm text-green-600 mt-1.5 sm:mt-2 font-medium">
                  Unlimited spins available!
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Result Modal */}
        {showResult && (
          <ResultModal
            prize={winningPrize}
            onClose={closeModal}
            spinsRemaining={spinsRemaining}
          />
        )}
      </div>
    </div>
  )
}
