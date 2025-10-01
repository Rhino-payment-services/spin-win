'use client'

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [isClient, setIsClient] = useState(false)
  const [deviceId, setDeviceId] = useState('')
  const [deviceHasSpun, setDeviceHasSpun] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winningPrize, setWinningPrize] = useState('')
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    console.log('HomePage useEffect running')
    setIsClient(true)
    
    // Simple device ID generation
    const fingerprint = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setDeviceId(fingerprint)
    
    // Check device status
    const checkDeviceStatus = async () => {
      try {
        console.log('Checking device status...')
        const response = await fetch('/api/spin', {
          method: 'GET',
          headers: {
            'X-Device-ID': fingerprint
          }
        })
        
        console.log('Device status response:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Device status data:', data)
          setDeviceHasSpun(data.deviceHasSpun || false)
        }
      } catch (error) {
        console.error('Error checking device status:', error)
      }
    }
    
    checkDeviceStatus()
  }, [])

  const handleSpin = async () => {
    console.log('handleSpin called')
    
    if (deviceHasSpun || isSpinning) {
      console.log('Cannot spin:', { deviceHasSpun, isSpinning })
      return
    }

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

      console.log('Spin response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Spin data:', data)
        setWinningPrize(data.prize || '')
        setDeviceHasSpun(true)
        
        setTimeout(() => {
          setIsSpinning(false)
          setShowResult(true)
        }, 2000)
      } else {
        console.error('Spin failed:', response.status)
        setIsSpinning(false)
        alert('Failed to spin')
      }
    } catch (error) {
      console.error('Spin error:', error)
      setIsSpinning(false)
      alert('Network error')
    }
  }

  const closeModal = () => {
    setShowResult(false)
  }

  console.log('HomePage render:', { isClient, deviceHasSpun, isSpinning })

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading RukaPay Spin & Win...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          RukaPay Spin & Win
        </h1>
        <p className="text-lg text-gray-600">
          Tap to Pay, the Ugandan Way
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        {/* Simple Wheel */}
        <div className="relative mb-8">
          <div className="w-80 h-80 rounded-full border-8 border-gray-300 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-6xl">🎯</div>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={deviceHasSpun || isSpinning}
          className={`px-8 py-4 rounded-full text-xl font-bold transition-all duration-200 ${
            deviceHasSpun || isSpinning
              ? 'bg-gray-400 cursor-not-allowed text-gray-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          {deviceHasSpun 
            ? 'Already Spun' 
            : isSpinning 
            ? 'Spinning...' 
            : 'SPIN THE WHEEL'
          }
        </button>

        {/* Device Status */}
        {deviceHasSpun && (
          <p className="text-sm text-gray-600 mt-4 text-center">
            You have already spun the wheel on this device.
          </p>
        )}

        {/* Debug Info */}
        <div className="mt-8 text-xs text-gray-500 text-center">
          <p>Device ID: {deviceId}</p>
          <p>Has Spun: {deviceHasSpun ? 'Yes' : 'No'}</p>
          <p>Is Spinning: {isSpinning ? 'Yes' : 'No'}</p>
        </div>
      </div>

      {/* Result Modal */}
      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
            <p className="text-xl mb-6">
              You won: <strong>{winningPrize}</strong>
            </p>
            <button
              onClick={closeModal}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Awesome!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}