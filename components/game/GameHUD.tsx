'use client'

import { Heart, Star, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface GameHUDProps {
  score: number
  lives: number
  maxLives: number
  timeRemaining: number
  combo: number
}

export function GameHUD({
  score,
  lives,
  maxLives,
  timeRemaining,
  combo,
}: GameHUDProps) {
  // 時間の色（残り時間で変化）
  const timeColor =
    timeRemaining > 30
      ? 'text-foreground'
      : timeRemaining > 10
        ? 'text-yellow-500'
        : 'text-red-500'

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
      <div className="grid grid-cols-4 gap-4 items-center">
        {/* スコア */}
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
          <div>
            <p className="text-xs text-muted-foreground">スコア</p>
            <motion.p
              className="text-2xl font-bold"
              key={score}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {score}
            </motion.p>
          </div>
        </div>

        {/* ライフ */}
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xs text-muted-foreground">ライフ</p>
            <div className="flex gap-1">
              {[...Array(maxLives)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 ${
                    i < lives
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-300 fill-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* タイマー */}
        <div className="flex items-center gap-2">
          <Clock className={`w-6 h-6 ${timeColor}`} />
          <div>
            <p className="text-xs text-muted-foreground">のこり</p>
            <motion.p
              className={`text-2xl font-bold ${timeColor}`}
              animate={
                timeRemaining <= 10
                  ? {
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: timeRemaining <= 10 ? Infinity : 0,
              }}
            >
              {timeRemaining}s
            </motion.p>
          </div>
        </div>

        {/* コンボ */}
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xs text-muted-foreground">コンボ</p>
            <motion.p
              className="text-2xl font-bold text-primary"
              key={combo}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {combo > 0 ? `×${combo}` : '-'}
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  )
}
