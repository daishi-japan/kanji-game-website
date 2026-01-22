'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Star, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { GameButton } from '@/components/game/GameButton'
import { RewardDisplay } from '@/components/result/RewardDisplay'
import { calculateRewards } from '@/lib/data/reward-data'
import type { GameResult, RewardItem } from '@/lib/data/reward-data'

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URLパラメータからゲーム結果を取得
  const mode = (searchParams.get('mode') || 'reading') as 'reading' | 'writing'
  const stageId = searchParams.get('stage') || 'stage_001'
  const score = parseInt(searchParams.get('score') || '0')
  const maxScore = parseInt(searchParams.get('maxScore') || '1000')
  const rank = (searchParams.get('rank') || 'C') as 'S' | 'A' | 'B' | 'C' | 'D'
  const cleared = searchParams.get('cleared') === 'true'

  const [showRewards, setShowRewards] = useState(false)
  const [rewards, setRewards] = useState<RewardItem[]>([])

  // 報酬計算
  useEffect(() => {
    const result: GameResult = {
      mode,
      stageId,
      score,
      maxScore,
      rank,
      cleared,
    }

    const calculatedRewards = calculateRewards(result)
    setRewards(calculatedRewards)

    // 1秒後に報酬表示
    setTimeout(() => {
      setShowRewards(true)
    }, 1000)
  }, [mode, stageId, score, maxScore, rank, cleared])

  // ランク別のメッセージ
  const getRankMessage = () => {
    switch (rank) {
      case 'S':
        return 'かんぺき！すごい！'
      case 'A':
        return 'すばらしい！'
      case 'B':
        return 'いいかんじ！'
      case 'C':
        return 'がんばったね！'
      case 'D':
        return 'もういちど チャレンジ！'
    }
  }

  // ランク別の色
  const getRankColor = () => {
    switch (rank) {
      case 'S':
        return '#f59e0b'
      case 'A':
        return '#3b82f6'
      case 'B':
        return '#10b981'
      case 'C':
        return '#6b7280'
      case 'D':
        return '#9ca3af'
    }
  }

  const percentage = Math.round((score / maxScore) * 100)

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-100 to-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
          </motion.div>

          <motion.h1
            className="text-5xl font-bold"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {cleared ? 'クリア！' : 'ゲームオーバー'}
          </motion.h1>

          <motion.p
            className="text-2xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {getRankMessage()}
          </motion.p>
        </div>

        {/* スコアサマリー */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* ランク表示 */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-block"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div
                className="text-9xl font-bold"
                style={{ color: getRankColor() }}
              >
                {rank}
              </div>
            </motion.div>
            <p className="text-lg text-muted-foreground mt-2">ランク</p>
          </div>

          {/* スコア詳細 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* スコア */}
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-blue-500" />
                <p className="text-sm text-blue-600 font-bold">スコア</p>
              </div>
              <p className="text-4xl font-bold text-blue-600">{score}</p>
              <p className="text-sm text-blue-600 mt-1">/ {maxScore}</p>
            </div>

            {/* 達成率 */}
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6 text-green-500" />
                <p className="text-sm text-green-600 font-bold">たっせいりつ</p>
              </div>
              <p className="text-4xl font-bold text-green-600">{percentage}%</p>
            </div>

            {/* クリア状況 */}
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-purple-500" />
                <p className="text-sm text-purple-600 font-bold">けっか</p>
              </div>
              <p className="text-4xl font-bold text-purple-600">
                {cleared ? '🎉' : '💪'}
              </p>
              <p className="text-sm text-purple-600 mt-1">
                {cleared ? 'クリア' : 'もう いちど！'}
              </p>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="mt-6">
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* 報酬表示 */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <RewardDisplay
            rewards={rewards}
            isVisible={showRewards}
          />
        </motion.div>

        {/* アクションボタン */}
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Link href="/" className="flex-1">
            <GameButton variant="secondary" size="lg" className="w-full">
              ホームへ もどる
            </GameButton>
          </Link>
          <Link
            href={mode === 'reading' ? '/play/reading' : '/play/writing'}
            className="flex-1"
          >
            <GameButton size="lg" className="w-full">
              もう いちど あそぶ
            </GameButton>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">よみこみちゅう...</div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  )
}
