'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gift } from 'lucide-react'
import type { RewardItem } from '@/lib/data/reward-data'
import { rarityConfig } from '@/lib/data/character-data'

interface RewardDisplayProps {
  rewards: RewardItem[]
  isVisible: boolean
  onComplete?: () => void
}

/**
 * 報酬表示コンポーネント
 * ゲームクリア時の報酬を演出付きで表示
 */
export function RewardDisplay({
  rewards,
  isVisible,
  onComplete,
}: RewardDisplayProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 text-yellow-500" />
            <h3 className="text-2xl font-bold text-center">ほうび</h3>
            <Gift className="w-6 h-6 text-yellow-500" />
          </div>

          {/* 報酬グリッド */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rewards.map((reward, index) => (
              <RewardCard
                key={`${reward.type}-${reward.id}-${index}`}
                reward={reward}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * 個別報酬カード
 */
function RewardCard({ reward, index }: { reward: RewardItem; index: number }) {
  const isCharacter = reward.type === 'character'
  const isNewCharacter = isCharacter // 実際はSupabaseでチェック

  // キャラクターの場合はレアリティカラーを使用
  const bgColor = isCharacter && reward.rarity
    ? rarityConfig[reward.rarity as keyof typeof rarityConfig]?.bgColor
    : '#f3f4f6'

  const borderColor = isCharacter && reward.rarity
    ? rarityConfig[reward.rarity as keyof typeof rarityConfig]?.color
    : '#d1d5db'

  return (
    <motion.div
      className="relative p-6 rounded-2xl shadow-lg overflow-hidden"
      style={{
        backgroundColor: bgColor,
        borderWidth: '3px',
        borderStyle: 'solid',
        borderColor: borderColor,
      }}
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        delay: index * 0.2,
        type: 'spring',
        stiffness: 200,
        damping: 15,
      }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      {/* NEW バッジ（新規キャラクター） */}
      {isNewCharacter && (
        <motion.div
          className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
          }}
        >
          NEW!
        </motion.div>
      )}

      {/* キラキラエフェクト（レアアイテム） */}
      {isCharacter && reward.rarity && ['rare', 'epic', 'legendary'].includes(reward.rarity) && (
        <motion.div
          className="absolute top-2 left-2"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-5 h-5 text-yellow-500" />
        </motion.div>
      )}

      {/* アイテム表示 */}
      <div className="text-center space-y-2">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <span className="text-6xl">{reward.emoji}</span>
        </motion.div>

        <div>
          <p className="text-lg font-bold">{reward.name}</p>
          {reward.amount > 1 && (
            <p className="text-2xl font-bold text-primary">×{reward.amount}</p>
          )}
        </div>

        {/* レアリティ表示 */}
        {isCharacter && reward.rarity && (
          <div
            className="px-2 py-1 rounded-full text-xs font-bold inline-block"
            style={{
              backgroundColor: bgColor,
              color: borderColor,
            }}
          >
            {rarityConfig[reward.rarity as keyof typeof rarityConfig]?.label}
          </div>
        )}
      </div>

      {/* 背景エフェクト */}
      {isCharacter && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${borderColor}20 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  )
}
