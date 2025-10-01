'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-4">
          We encountered an error while loading the application.
        </p>
        <div className="bg-gray-100 p-4 rounded mb-4 text-left">
          <p className="text-sm text-gray-700">
            <strong>Error:</strong> {error.message}
          </p>
          {error.digest && (
            <p className="text-sm text-gray-500 mt-2">
              <strong>Error ID:</strong> {error.digest}
            </p>
          )}
        </div>
        <button
          onClick={reset}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-2"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Go home
        </button>
      </div>
    </div>
  )
}
