'use client'

import { useState, useEffect } from 'react'

export default function SimpleTest() {
  const [isClient, setIsClient] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('Simple test useEffect running')
    setIsClient(true)
    
    // Test API call
    fetch('/api/spin')
      .then(res => res.json())
      .then(data => {
        console.log('API data:', data)
        setData(data)
      })
      .catch(err => {
        console.error('API error:', err)
        setError(err.message)
      })
  }, [])

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}
      
      {data && (
        <div className="bg-green-100 p-4 rounded mb-4">
          <p className="text-green-600">API working! Data received.</p>
          <pre className="text-xs mt-2">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      
      <p>Client-side rendering: {isClient ? 'Yes' : 'No'}</p>
    </div>
  )
}
