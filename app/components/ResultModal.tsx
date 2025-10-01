'use client'

import Lottie from 'lottie-react'
import congratsAnimation from './congrats_summer.json'

interface ResultModalProps {
  prize: string
  onClose: () => void
  spinsRemaining: number
}

export default function ResultModal({ prize, onClose, spinsRemaining }: ResultModalProps) {
  const getPrizeIcon = (prizeName: string) => {
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

  const getPrizeMessage = (prizeName: string) => {
    switch (prizeName) {
      case 'Shirt': return 'Congratulations! You won a cool T-Shirt!'
      case 'Book': return 'Awesome! You won a book!'
      case 'Wristband': return 'Great! You won a stylish wristband!'
      case 'Cap': return 'Congratulations! You won a stylish cap!'
      case 'Umbrella': return 'Great! You won an umbrella to keep you dry!'
      case 'Pen': return 'Nice! You won a premium pen!'
      case 'Try Again': return 'Better luck next time! Try spinning again!'
      default: return 'Congratulations on your prize!'
    }
  }

  const isTryAgain = prize === 'Try Again'

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Congratulations Lottie Animation - only for won prizes */}
        {!isTryAgain && (
          <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
            <Lottie
              animationData={congratsAnimation}
              loop={false}
              autoplay={true}
              style={{ width: '120%', height: '120%', maxWidth: '600px' }}
            />
          </div>
        )}
        
        {/* Content with higher z-index */}
        <div className="relative z-10">
          <div className="text-6xl mb-4 animate-bounce">
            {getPrizeIcon(prize)}
          </div>
          
          <h2 className={`text-3xl font-bold mb-4 ${isTryAgain ? 'text-gray-600' : 'text-blue-900'}`}>
            {!isTryAgain && (
              <span className="block text-xl text-yellow-500 mb-2">🎉 Congratulations! 🎉</span>
            )}
            {prize}
          </h2>
          
          <p className={`text-lg mb-6 ${isTryAgain ? 'text-gray-600' : 'text-gray-700 font-semibold'}`}>
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
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
              isTryAgain
                ? 'bg-gray-500 text-white hover:bg-gray-600' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
            }`}
          >
            {isTryAgain ? 'Close' : 'Claim Prize!'}
          </button>
        </div>
      </div>
    </div>
  )
}
