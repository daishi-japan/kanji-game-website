'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Star } from 'lucide-react'
import { GameButton } from '@/components/game/GameButton'
import { foodDatabase, type FoodData } from '@/lib/data/reward-data'

interface FeedingInterfaceProps {
  characterId: string
  characterName: string
  characterEmoji: string
  currentLevel: number
  currentExperience: number
  currentFriendship: number
  userFoods: { foodId: string; amount: number }[]
  onFeed: (foodId: string) => Promise<{
    success: boolean
    error?: string
    data?: {
      newLevel: number
      newExperience: number
      newFriendship: number
      leveledUp: boolean
    }
  }>
  onClose: () => void
}

export function FeedingInterface({
  characterId,
  characterName,
  characterEmoji,
  currentLevel,
  currentExperience,
  currentFriendship,
  userFoods,
  onFeed,
  onClose,
}: FeedingInterfaceProps) {
  const [isFeeding, setIsFeeding] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ユーザーが持っているエサのみをフィルタ
  const availableFoods = foodDatabase
    .map((food) => {
      const userFood = userFoods.find((uf) => uf.foodId === food.id)
      return {
        ...food,
        amount: userFood?.amount || 0,
      }
    })
    .filter((food) => food.amount > 0)

  const handleFeed = async (food: FoodData) => {
    setIsFeeding(true)
    setError(null)
    setFeedbackMessage(null)

    const response = await onFeed(food.id)

    if (response.success && response.data) {
      const { leveledUp } = response.data

      if (leveledUp) {
        setFeedbackMessage(`🎉 レベルアップ！ Lv.${response.data.newLevel} になったよ！`)
      } else {
        setFeedbackMessage(`${characterName} は ${food.name} を おいしそうに たべた！`)
      }

      // 3秒後にメッセージを消す
      setTimeout(() => {
        setFeedbackMessage(null)
      }, 3000)
    } else {
      setError(response.error || 'エサやりに失敗しました')
    }

    setIsFeeding(false)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'rare':
        return 'from-purple-100 to-purple-200 border-purple-300'
      case 'uncommon':
        return 'from-blue-100 to-blue-200 border-blue-300'
      default:
        return 'from-gray-100 to-gray-200 border-gray-300'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-6xl">{characterEmoji}</span>
              <div>
                <h2 className="text-2xl font-bold">{characterName} に エサを あげる</h2>
                <p className="text-sm opacity-90">すきな エサを えらんでね！</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 現在のステータス */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-xs opacity-80">レベル</p>
              <p className="text-2xl font-bold">Lv.{currentLevel}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-xs opacity-80">けいけんち</p>
              <p className="text-xl font-bold">{currentExperience}</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-xs opacity-80">なつきど</p>
              <p className="text-xl font-bold">{currentFriendship}</p>
            </div>
          </div>
        </div>

        {/* フィードバックメッセージ */}
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              className="bg-green-100 border-l-4 border-green-500 p-4 m-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-green-700 font-bold text-center">{feedbackMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 m-4">
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        )}

        {/* エサ一覧 */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {availableFoods.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl font-bold text-muted-foreground">エサが ありません</p>
              <p className="text-sm text-muted-foreground mt-2">
                ゲームを クリアして エサを ゲットしよう！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableFoods.map((food) => (
                <motion.div
                  key={food.id}
                  className={`bg-gradient-to-br ${getRarityColor(food.rarity)} border-2 rounded-xl p-4 cursor-pointer hover:scale-105 transition-transform`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !isFeeding && handleFeed(food)}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{food.emoji}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{food.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>+{food.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-pink-500" />
                          <span>+{food.friendship}</span>
                        </div>
                      </div>
                      <p className="text-sm font-bold mt-1">× {food.amount}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="border-t p-4 bg-gray-50">
          <GameButton
            variant="secondary"
            className="w-full"
            onClick={onClose}
            disabled={isFeeding}
          >
            とじる
          </GameButton>
        </div>
      </motion.div>
    </div>
  )
}
