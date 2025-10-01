'use client'

interface ResultModalProps {
  prize: string
  onClose: () => void
  spinsRemaining: number
}

export default function ResultModal({ prize, onClose, spinsRemaining }: ResultModalProps) {
  const getPrizeIcon = (prizeName: string) => {
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

  const getPrizeMessage = (prizeName: string) => {
    switch (prizeName) {
      case 'Cap': return 'Congratulations! You won a stylish cap!'
      case 'Umbrella': return 'Great! You won an umbrella to keep you dry!'
      case '100k': return '🎉 AMAZING! You won 100k! 🎉'
      case 'Pen': return 'Nice! You won a premium pen!'
      case 'Notebook': return 'Awesome! You won a notebook!'
      case 'Try Again': return 'Better luck next time! Try again!'
      default: return 'Congratulations on your prize!'
    }
  }

  const isBigWin = prize === '100k'
  const isTryAgain = prize === 'Try Again'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="text-6xl mb-4">
          {getPrizeIcon(prize)}
        </div>
        
        <h2 className={`text-2xl font-bold mb-4 ${isBigWin ? 'text-yellow-600' : isTryAgain ? 'text-gray-600' : 'text-blue-900'}`}>
          {prize}
        </h2>
        
        <p className="text-gray-700 mb-6">
          {getPrizeMessage(prize)}
        </p>
        
        {spinsRemaining > 0 && (
          <p className="text-sm text-blue-600 mb-6">
            You have {spinsRemaining} spin remaining!
          </p>
        )}
        
        {spinsRemaining === 0 && (
          <p className="text-sm text-gray-600 mb-6">
            You've used your spin. Thank you for playing!
          </p>
        )}
        
        <button
          onClick={onClose}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            isBigWin 
              ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
              : 'bg-blue-900 text-white hover:bg-blue-800'
          }`}
        >
          Close
        </button>
      </div>
    </div>
  )
}
