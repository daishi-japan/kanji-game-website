'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface FallingKanjiProps {
  character: string
  isActive: boolean
  onFallComplete?: () => void
  fallDuration?: number
  feedbackType?: 'correct' | 'wrong' | 'miss' | null
}

export function FallingKanji({
  character,
  isActive,
  onFallComplete,
  fallDuration = 3,
  feedbackType,
}: FallingKanjiProps) {
  // ランダムな水平位置を生成（20%〜80%の範囲）
  const [horizontalPosition] = useState(() => {
    return 20 + Math.random() * 60 // 20%から80%の間
  })

  // フィードバックに応じた表示内容
  const getFeedbackContent = () => {
    if (feedbackType === 'correct') {
      return { borderColor: 'border-green-500', bgColor: 'bg-green-200', char: '⭕️' }
    } else if (feedbackType === 'miss') {
      return { borderColor: 'border-red-500', bgColor: 'bg-red-200', char: '💥' }
    }
    return { borderColor: 'border-orange-500', bgColor: 'bg-white', char: character }
  }

  const { borderColor, bgColor, char } = getFeedbackContent()

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 落ちてくる漢字 */}
      {isActive && (
        <motion.div
          className="absolute"
          style={{ left: `${horizontalPosition}%`, top: 0 }}
          initial={{ y: -140, opacity: 1, x: '-50%' }}
          animate={{ y: 'calc(100vh - 400px)', opacity: 1 }}
          transition={{
            duration: fallDuration,
            ease: 'linear',
          }}
          onAnimationComplete={onFallComplete}
        >
          <div className="relative">
            {/* 円形の枠と白背景 */}
            <div className={`relative w-32 h-32 rounded-full ${bgColor} ${borderColor} border-8 shadow-2xl flex items-center justify-center`}>
              <div className="text-6xl font-black text-orange-900">
                {char}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
