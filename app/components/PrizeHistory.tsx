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
      case 'Cap': return '🧢'
      case 'Umbrella': return '☂️'
      case '100k': return '💰'
      case 'Pen': return '✏️'
      case 'Notebook': return '📓'
      case 'Try Again': return '🔄'
      default: return '🎁'
    }
  }

  const prizes: Prize[] = [
    { name: 'Cap', icon: '🧢' },
    { name: 'Notebook', icon: '📓' },
    { name: 'Try Again', icon: '🔄' },
    { name: 'Pen', icon: '✏️' },
    { name: 'Umbrella', icon: '☂️' },
    { name: '100k', icon: '💰' }
  ]

  const totalPrizes = Object.values(prizeCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="prize-history">
      <h3 className="text-xl font-bold text-blue-900 mb-4 text-center">
        Prize History
      </h3>
      
      {totalPrizes > 0 ? (
        <div className="space-y-3">
          {prizes.map((prize) => {
            const count = prizeCounts[prize.name] || 0
            return (
            <div key={prize.name} className="prize-item">
              <span className="flex items-center gap-2">
                <span className="text-lg">{prize.icon}</span>
                <span>{prize.name}s won:</span>
              </span>
              <span>{count}</span>
            </div>
            )
          })}
          
          <div className="border-t border-gray-200 pt-3 mt-4">
            <div className="prize-item">
              <span className="font-bold text-blue-900">Total Prizes:</span>
              <span>{totalPrizes}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-8">
          <div className="text-4xl mb-2">🎯</div>
          <p>No prizes won yet!</p>
          <p className="text-sm">Start spinning to see your wins here.</p>
        </div>
      )}
    </div>
  )
}
