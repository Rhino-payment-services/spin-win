'use client'

export default function BasicPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Basic Test Page</h1>
      <p>This is a basic test page without any complex logic.</p>
      <button 
        onClick={() => alert('Button clicked!')}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Button
      </button>
    </div>
  )
}
