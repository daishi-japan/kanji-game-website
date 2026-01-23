'use client'

import { motion } from 'framer-motion'
import { Sparkles, Gift, Calendar } from 'lucide-react'
import { GameButton } from '@/components/game/GameButton'

interface LoginBonusModalProps {
  isOpen: boolean
  loginStreak: number
  bonusCoins: number
  bonusFood?: {
    foodId: string
    name: string
    emoji: string
    amount: number
  }
  onClose: () => void
}

export function LoginBonusModal({
  isOpen,
  loginStreak,
  bonusCoins,
  bonusFood,
  onClose,
}: LoginBonusModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <motion.div
        className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.5, opacity: 0, rotate: 10 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white text-center relative overflow-hidden">
          {/* キラキラエフェクト */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Gift className="w-16 h-16 mx-auto mb-2" />
          </motion.div>
          <h2 className="text-3xl font-bold">ログイン ボーナス！</h2>
          <p className="text-sm mt-2 opacity-90">まいにち ログインして とくてんを ゲット！</p>
        </div>

        {/* ボディ */}
        <div className="p-8 space-y-6">
          {/* 連続ログイン日数 */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-md text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar className="w-6 h-6 text-primary" />
              <p className="text-lg font-bold">れんぞくログイン</p>
            </div>
            <motion.p
              className="text-6xl font-bold text-primary"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {loginStreak}
            </motion.p>
            <p className="text-lg font-bold text-muted-foreground mt-2">日</p>
          </motion.div>

          {/* 獲得報酬 */}
          <motion.div
            className="space-y-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold text-center">きょうの ごほうび</h3>

            {/* コイン */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-5xl">🪙</span>
                <div>
                  <p className="font-bold">コイン</p>
                  <p className="text-sm text-muted-foreground">おかいものに つかえるよ</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-yellow-600">+{bonusCoins}</p>
            </div>

            {/* エサ（7日目） */}
            {bonusFood && (
              <motion.div
                className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center justify-between"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{bonusFood.emoji}</span>
                  <div>
                    <p className="font-bold">{bonusFood.name}</p>
                    <p className="text-sm text-muted-foreground">
                      🎉 7にちめ とくべつプレゼント！
                    </p>
                  </div>
                </div>
                <p className="text-3xl font-bold text-green-600">×{bonusFood.amount}</p>
              </motion.div>
            )}
          </motion.div>

          {/* メッセージ */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {loginStreak >= 7 ? (
              <p className="text-lg font-bold text-primary">
                すごい！ {loginStreak}にちれんぞく ログイン！
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                あと {7 - (loginStreak % 7)} にちで とくべつプレゼント！
              </p>
            )}
          </motion.div>

          {/* 閉じるボタン */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <GameButton className="w-full" size="lg" onClick={onClose}>
              ありがとう！
            </GameButton>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
