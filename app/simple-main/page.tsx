'use client'

import { useState, useEffect } from 'react'

export default function SimpleMainPage() {
  const [isClient, setIsClient] = useState(false)
  const [deviceId, setDeviceId] = useState('')
  const [deviceHasSpun, setDeviceHasSpun] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winningPrize, setWinningPrize] = useState('')
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    console.log('Simple main page useEffect running')
    setIsClient(true)
    
    // Generate a simple device ID
    const fingerprint = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setDeviceId(fingerprint)
    
    // Check device status
    const checkDeviceStatus = async () => {
      try {
        const response = await fetch('/api/spin', {
          method: 'GET',
          headers: {
            'X-Device-ID': fingerprint
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('Device status:', data)
          setDeviceHasSpun(data.deviceHasSpun || false)
        }
      } catch (error) {
        console.error('Error checking device status:', error)
      }
    }
    
    checkDeviceStatus()
  }, [])

  const handleSpin = async () => {
    if (deviceHasSpun || isSpinning) return

    console.log('Starting spin...')
    setIsSpinning(true)

    try {
      const response = await fetch('/api/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId
        },
        body: JSON.stringify({ spinsUsed: 0, deviceId }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Spin result:', data)
        setWinningPrize(data.prize || '')
        setDeviceHasSpun(true)
        
        // Show result after spinning
        setTimeout(() => {
          setIsSpinning(false)
          setShowResult(true)
        }, 2000)
      } else {
        setIsSpinning(false)
        alert('Failed to spin')
      }
    } catch (error) {
      console.error('Spin error:', error)
      setIsSpinning(false)
      alert('Network error')
    }
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          RukaPay Spin & Win
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Simple Test Version
        </p>
        
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              {isSpinning ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
              ) : (
                <span className="text-4xl">🎯</span>
              )}
            </div>
          </div>
          
          <button
            onClick={handleSpin}
            disabled={deviceHasSpun || isSpinning}
            className={`px-8 py-3 rounded-lg font-semibold text-lg ${
              deviceHasSpun || isSpinning
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {deviceHasSpun ? 'Already Spun' : isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
          </button>
          
          {deviceHasSpun && (
            <p className="text-sm text-gray-600 mt-4">
              You have already spun the wheel on this device.
            </p>
          )}
        </div>
        
        {showResult && winningPrize && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-4">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
              <p className="text-xl mb-6">You won: <strong>{winningPrize}</strong></p>
              <button
                onClick={() => setShowResult(false)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
