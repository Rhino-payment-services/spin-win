'use client'

import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import celebrationAnimation from './celebration.json'

interface Prize {
  name: string
  color: string
  icon: string
}

interface SpinningWheelProps {
  prizes: Prize[]
  isSpinning: boolean
  winningPrize: string
}

export default function SpinningWheel({ prizes, isSpinning, winningPrize }: SpinningWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (isSpinning && wheelRef.current && winningPrize) {
      const wheel = wheelRef.current
      const prizeIndex = prizes.findIndex(prize => prize.name === winningPrize)
      
      console.log('Wheel spinning to:', { winningPrize, prizeIndex, isSpinning })
      
      if (prizeIndex !== -1) {
        // Calculate rotation angle - spin multiple times then land on the prize
        const baseRotation = 360 * 6 // 6 full rotations for more dramatic effect
        const segmentAngle = 360 / prizes.length // 60 degrees per segment for 6 segments
        const prizeAngle = segmentAngle * prizeIndex
        
        // Position the prize at the top (12 o'clock position where arrow points)
        // In SVG, angle 0 is at 3 o'clock (right), and top is at -90 degrees (270 degrees)
        // We need to rotate the wheel so the winning segment center is at top (-90 degrees)
        // finalRotation = baseRotation - prizeAngle - 90
        const finalRotation = baseRotation - prizeAngle - 90
        
        console.log('Prize details:', {
          prizeName: winningPrize,
          prizeIndex,
          segmentAngle,
          prizeAngle,
          baseRotation,
          finalRotation
        })
        wheel.style.transform = `rotate(${finalRotation}deg)`
        
        // Show celebration animation when wheel stops
        const celebrateTimer = setTimeout(() => {
          setShowCelebration(true)
          const hideCelebrationTimer = setTimeout(() => {
            setShowCelebration(false)
          }, 3000) // Hide after 3 seconds
          
          return () => clearTimeout(hideCelebrationTimer)
        }, 4000) // Show celebration after wheel stops (4s duration)
        
        return () => clearTimeout(celebrateTimer)
      }
    }
  }, [isSpinning, winningPrize, prizes])

  // Reset wheel position when not spinning
  useEffect(() => {
    if (!isSpinning && wheelRef.current) {
      // Reset to initial position where first segment (Cap) is at the top
      // Rotate -90 degrees to align first prize (index 0 at 0°) with top arrow (at -90°)
      wheelRef.current.style.transform = 'rotate(-90deg)'
    }
  }, [isSpinning])

  return (
    <div className="modern-wheel-container w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto">
      {/* Pointer */}
      <div className="wheel-pointer-modern"></div>
      
      {/* Wheel */}
      <div
        ref={wheelRef}
        className="modern-wheel"
        style={{
          transform: 'rotate(-90deg)',
          transition: isSpinning ? 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 400"
          className="wheel-svg"
        >
          <defs>
            {prizes.map((prize, index) => {
              const angle = (360 / prizes.length) * index
              const segmentAngle = 360 / prizes.length
              const startAngle = (angle - segmentAngle / 2) * Math.PI / 180
              const endAngle = (angle + segmentAngle / 2) * Math.PI / 180
              const radius = 200
              const innerRadius = 60
              
              const x1 = 200 + radius * Math.cos(startAngle)
              const y1 = 200 + radius * Math.sin(startAngle)
              const x2 = 200 + radius * Math.cos(endAngle)
              const y2 = 200 + radius * Math.sin(endAngle)
              
              const x3 = 200 + innerRadius * Math.cos(endAngle)
              const y3 = 200 + innerRadius * Math.sin(endAngle)
              const x4 = 200 + innerRadius * Math.cos(startAngle)
              const y4 = 200 + innerRadius * Math.sin(startAngle)
              
              return (
                <path
                  key={prize.name}
                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
                  fill={prize.color}
                />
              )
            })}
          </defs>
          {prizes.map((prize, index) => {
            const angle = (360 / prizes.length) * index
            const segmentAngle = 360 / prizes.length
            const startAngle = (angle - segmentAngle / 2) * Math.PI / 180
            const endAngle = (angle + segmentAngle / 2) * Math.PI / 180
            const radius = 200
            const innerRadius = 60
            
            const x1 = 200 + radius * Math.cos(startAngle)
            const y1 = 200 + radius * Math.sin(startAngle)
            const x2 = 200 + radius * Math.cos(endAngle)
            const y2 = 200 + radius * Math.sin(endAngle)
            
            const x3 = 200 + innerRadius * Math.cos(endAngle)
            const y3 = 200 + innerRadius * Math.sin(endAngle)
            const x4 = 200 + innerRadius * Math.cos(startAngle)
            const y4 = 200 + innerRadius * Math.sin(startAngle)
            
            const textAngle = angle * Math.PI / 180
            const textRadius = 140
            const textX = 200 + textRadius * Math.cos(textAngle)
            const textY = 200 + textRadius * Math.sin(textAngle)
            
            return (
              <g key={prize.name}>
                <path
                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z`}
                  fill={prize.color}
                  stroke={!isSpinning && winningPrize === prize.name ? "#FFD700" : "none"}
                  strokeWidth={!isSpinning && winningPrize === prize.name ? "6" : "0"}
                  opacity={!isSpinning && winningPrize === prize.name ? "1.1" : "1"}
                  style={{
                    filter: !isSpinning && winningPrize === prize.name ? "drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))" : "none"
                  }}
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  fill="white"
                  fontWeight="bold"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {prize.icon}
                </text>
                <text
                  x={textX}
                  y={textY + 20}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="white"
                  fontWeight="bold"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {prize.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      
      {/* Center SPIN Button */}
      <div className="wheel-center-modern">
        <div className="spin-button-container">
          <div className="spin-button">
            <span className="spin-text">SPIN</span>
          </div>
        </div>
      </div>
      
            {/* Celebration Lottie Animation */}
            {showCelebration && (
              <div className="celebration-overlay">
                <div className="celebration-lottie-container">
                  <Lottie
                    animationData={celebrationAnimation}
                    loop={false}
                    autoplay={true}
                    style={{ width: '450px', height: '450px' }}
                  />
                </div>
              </div>
            )}
    </div>
  )
}
