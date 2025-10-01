'use client'

import Lottie from 'lottie-react'
import congratsAnimation from './wBzLu7Ks6E.json'

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
      {/* Congratulations Lottie Animation - Fullscreen, only for won prizes */}
      {!isTryAgain && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-start justify-center">
          <Lottie
            animationData={congratsAnimation}
            loop={true}
            autoplay={true}
            style={{ width: '100vw', height: '100vh', marginTop: '0' }}
          />
        </div>
      )}
      
      <div className="modal-content mx-4 sm:mx-0" onClick={(e) => e.stopPropagation()}>
        {/* Content with higher z-index */}
        <div className="relative z-50">
          <div className="text-4xl sm:text-6xl mb-4 animate-bounce">
            {getPrizeIcon(prize)}
          </div>
          
          <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${isTryAgain ? 'text-gray-600' : 'text-blue-900'}`}>
            {!isTryAgain && (
              <span className="block text-lg sm:text-xl text-yellow-500 mb-2">🎉 Congratulations! 🎉</span>
            )}
            {prize}
          </h2>
          
          <p className={`text-base sm:text-lg mb-6 ${isTryAgain ? 'text-gray-600' : 'text-gray-700 font-semibold'}`}>
            {getPrizeMessage(prize)}
          </p>
          
          {spinsRemaining > 0 && (
            <p className="text-xs sm:text-sm text-blue-600 mb-6">
              You have {spinsRemaining} spin remaining!
            </p>
          )}
          
          {spinsRemaining === 0 && (
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              You've used your spin. Thank you for playing!
            </p>
          )}
          
          <button
            onClick={onClose}
            className={`w-full sm:w-auto py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
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
