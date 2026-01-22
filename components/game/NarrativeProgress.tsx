'use client'

import { motion } from 'framer-motion'
import { Gift, Flag, Award } from 'lucide-react'

interface NarrativeProgressProps {
  current: number
  total: number
  characterIcon?: string
  goalIcon?: 'treasure' | 'flag' | 'certificate'
  showLabel?: boolean
}

export function NarrativeProgress({
  current,
  total,
  characterIcon = '🦊',
  goalIcon = 'treasure',
  showLabel = true,
}: NarrativeProgressProps) {
  const progress = Math.min(Math.max((current / total) * 100, 0), 100)

  return (
    <div className="w-full space-y-2">
      {showLabel && (
        <div className="flex justify-between text-sm font-medium">
          <span>
            {current} / {total}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}

      <div className="relative h-8 w-full">
        {/* プログレスバーの背景（道） */}
        <div className="absolute inset-0 rounded-full bg-muted overflow-hidden">
          {/* 進捗部分 */}
          <motion.div
            className="h-full bg-gradient-to-r from-primary/80 via-primary to-primary/90 relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* ストライプアニメーション */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)',
                animation: 'progress-stripes 1s linear infinite',
              }}
            />
          </motion.div>
        </div>

        {/* キャラクターインジケーター */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-10 text-2xl"
          initial={{ left: '0%' }}
          animate={{ left: `${Math.max(progress - 3, 0)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          >
            {characterIcon}
          </motion.div>
        </motion.div>

        {/* ゴールアイコン */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
          {goalIcon === 'treasure' ? (
            <Gift className="w-6 h-6 text-yellow-500" />
          ) : goalIcon === 'certificate' ? (
            <Award className="w-6 h-6 text-yellow-500" />
          ) : (
            <Flag className="w-6 h-6 text-success" />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress-stripes {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 0;
          }
        }
      `}</style>
    </div>
  )
}
