'use client'

interface PrizeCounts {
  [key: string]: number
}

interface PrizeHistoryProps {
  prizeCounts: PrizeCounts
}

interface Prize {
  name: string
  icon: string
}

export default function PrizeHistory({ prizeCounts }: PrizeHistoryProps) {
  const getPrizeEmoji = (prizeName: string) => {
    switch (prizeName) {
      case 'Shirt': return '👕'
      case 'Book': return '📚'
      case 'Wristband': return '⌚'
      case 'Cap': return '🧢'
      case 'Umbrella': return '☂️'
      case 'Pen': return '✏️'
      case 'Try Again': return '🔄'
      default: return '🎁'
    }
  }

  const prizes: Prize[] = [
    { name: 'Shirt', icon: '👕' },
    { name: 'Book', icon: '📚' },
    { name: 'Wristband', icon: '⌚' },
    { name: 'Try Again', icon: '🔄' },
    { name: 'Pen', icon: '✏️' },
    { name: 'Cap', icon: '🧢' },
    { name: 'Umbrella', icon: '☂️' }
  ]

  const totalPrizes = prizeCounts ? Object.values(prizeCounts).reduce((sum, count) => sum + count, 0) : 0

  return (
    <div className="prize-history bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-200">
      <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-4 text-center">
        Prize History
      </h3>
      
      {totalPrizes > 0 ? (
        <div className="space-y-2 sm:space-y-3">
          {prizes.map((prize) => {
            const count = prizeCounts ? (prizeCounts[prize.name] || 0) : 0
            return (
            <div key={prize.name} className="prize-item flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
              <span className="flex items-center gap-2">
                <span className="text-base sm:text-lg">{prize.icon}</span>
                <span className="text-sm sm:text-base">{prize.name}s won:</span>
              </span>
              <span className="font-bold text-blue-900 text-sm sm:text-base">{count}</span>
            </div>
            )
          })}
          
          <div className="border-t border-gray-200 pt-3 mt-4">
            <div className="prize-item flex justify-between items-center py-2 px-3 bg-blue-50 rounded-lg">
              <span className="font-bold text-blue-900 text-sm sm:text-base">Total Prizes:</span>
              <span className="font-bold text-blue-900 text-sm sm:text-base">{totalPrizes}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-6 sm:py-8">
          <div className="text-3xl sm:text-4xl mb-2">🎯</div>
          <p className="text-sm sm:text-base">No prizes won yet!</p>
          <p className="text-xs sm:text-sm">Start spinning to see your wins here.</p>
        </div>
      )}
    </div>
  )
}
