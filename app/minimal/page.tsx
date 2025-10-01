'use client'

export default function MinimalPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          RukaPay Spin & Win
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Minimal working version
        </p>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Test Database Connection</h2>
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/spin')
                const data = await response.json()
                alert('Database connected! Check console for details.')
                console.log('API Response:', data)
              } catch (error) {
                alert('Database error: ' + error.message)
                console.error('Error:', error)
              }
            }}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Test API Connection
          </button>
        </div>
      </div>
    </div>
  )
}
