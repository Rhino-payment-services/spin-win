'use client'

import { useState, useEffect } from 'react'
import SpinningWheel from './components/SpinningWheel'
import ResultModal from './components/ResultModal'
import PrizeHistory from './components/PrizeHistory'

interface PrizeCounts {
  [key: string]: number
}

export default function Home() {
  const [spinsUsed, setSpinsUsed] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [winningPrize, setWinningPrize] = useState('')
  const [prizeCounts, setPrizeCounts] = useState<PrizeCounts>({})
  const [spinsRemaining, setSpinsRemaining] = useState(1)
  const [deviceHasSpun, setDeviceHasSpun] = useState(false)
  const [deviceId, setDeviceId] = useState('')

  // Generate a unique device fingerprint
  const generateDeviceFingerprint = () => {
    const fingerprint = {
      screen: `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory || 'unknown',
      userAgent: navigator.userAgent
    }
    
    // Create a hash-like string from the fingerprint
    const fingerprintString = JSON.stringify(fingerprint)
    let hash = 0
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return `device_${Math.abs(hash)}`
  }

  // Check if device has already spun on mount
  useEffect(() => {
    const fingerprint = generateDeviceFingerprint()
    setDeviceId(fingerprint)
    
    // Check with backend if this device has already spun
    const checkDeviceStatus = async () => {
      try {
        const response = await fetch('/api/spin', {
          method: 'GET',
          headers: {
            'X-Device-ID': fingerprint
          }
        })
        
        const data = await response.json()
        const hasSpun = data.deviceHasSpun || false
        
        if (hasSpun) {
          setDeviceHasSpun(true)
          setSpinsUsed(1)
          setSpinsRemaining(0)
        }
      } catch (error) {
        console.error('Error checking device status:', error)
      }
    }
    
    checkDeviceStatus()
  }, [])

  const prizes = [
    { name: 'Shirt', color: '#8b5cf6', icon: '👕' },      // Purple
    { name: 'Book', color: '#f97316', icon: '📚' },       // Orange-red
    { name: 'Wristband', color: '#10b981', icon: '⌚' },   // Lime green
    { name: 'Try Again', color: '#3b82f6', icon: '🔄' },  // Blue
    { name: 'Pen', color: '#f59e0b', icon: '✏️' },        // Bright orange
    { name: 'Cap', color: '#ec4899', icon: '🧢' },        // Hot pink
    { name: 'Umbrella', color: '#14b8a6', icon: '☂️' }    // Teal
  ]

  const handleSpin = async () => {
    // Check if device has already spun
    if (deviceHasSpun || spinsUsed >= 1 || isSpinning) return

    console.log('Starting spin...', { spinsUsed, isSpinning, deviceId })
    setIsSpinning(true)

    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId
        },
        body: JSON.stringify({ spinsUsed, deviceId }),
      })

      const data = await response.json()
      console.log('API response:', data)

      if (response.ok) {
        setWinningPrize(data.prize)
        setPrizeCounts(data.prizeCounts)
        setSpinsRemaining(data.spinsRemaining)
        setSpinsUsed(spinsUsed + 1)
        
        // Mark device as having spun
        setDeviceHasSpun(true)
        
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
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4">
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
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            RukaPay Spin & Win
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Tap to pay, the Ugandan way. Spin the wheel and win amazing prizes!
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-blue-50 rounded-full shadow-md border border-blue-200">
            <span className="text-blue-900 font-semibold">Spins remaining:</span>
            <span className="ml-2 text-2xl font-bold text-blue-900">{spinsRemaining}</span>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-center">
          {/* Wheel Container */}
          <div className="flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
              <SpinningWheel
                prizes={prizes}
                isSpinning={isSpinning}
                winningPrize={winningPrize}
              />
              
              {/* Spin Button */}
              <div className="text-center mt-8">
                <button
                  onClick={(e) => {
                    console.log('Button clicked!', { spinsUsed, isSpinning, deviceHasSpun })
                    handleSpin()
                  }}
                  disabled={deviceHasSpun || spinsUsed >= 1 || isSpinning}
                  className={`px-12 py-4 text-2xl font-bold rounded-2xl transition-all duration-300 ${
                    deviceHasSpun || spinsUsed >= 1 || isSpinning
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-900 text-white hover:bg-blue-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl'
                  }`}
                >
                  {isSpinning ? 'Spinning...' : (deviceHasSpun || spinsUsed >= 1) ? 'Already Used - One Spin Per Device' : 'SPIN!'}
                </button>
              </div>
            </div>
          </div>

          {/* Prize History */}
          <div className="flex-1 max-w-md">
            <PrizeHistory prizeCounts={prizeCounts} />
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
