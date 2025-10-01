'use client'

import { useState, useEffect } from 'react'

export default function TestDB() {
  const [status, setStatus] = useState('Testing...')
  const [error, setError] = useState('')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/spin')
        const data = await response.json()
        
        if (response.ok) {
          setStatus('✅ Database connection successful!')
          setError('')
        } else {
          setStatus('❌ Database connection failed')
          setError(data.error || 'Unknown error')
        }
      } catch (err) {
        setStatus('❌ Network error')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
        
        <div className="mb-4">
          <p className="font-semibold">Status:</p>
          <p className={status.includes('✅') ? 'text-green-600' : 'text-red-600'}>
            {status}
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <p className="font-semibold text-red-600">Error:</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>Environment: {process.env.NODE_ENV}</p>
          <p>MongoDB URI: {process.env.MONGODB_URI ? 'Set' : 'Not set'}</p>
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Again
        </button>
      </div>
    </div>
  )
}
