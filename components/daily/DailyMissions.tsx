'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Gift, Check } from 'lucide-react'
import { GameButton } from '@/components/game/GameButton'
import { getDailyMissions, claimMissionReward } from '@/app/actions/daily'

type Mission = {
  id: string
  title: string
  description: string
  type: string
  targetCount: number
  currentCount: number
  rewardCoins: number
  rewardFood?: { foodId: string; name: string; emoji: string }
  completed: boolean
  claimed: boolean
}

export function DailyMissions() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMissions()
  }, [])

  const fetchMissions = async () => {
    const response = await getDailyMissions()
    if (response.success && response.data) {
      setMissions(response.data.missions)
    }
    setIsLoading(false)
  }

  const handleClaimReward = async (missionId: string) => {
    const response = await claimMissionReward(missionId)

    if (response.success) {
      // ミッションリストを再取得
      fetchMissions()
    } else {
      alert(response.error || '報酬の受け取りに失敗しました')
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">よみこみちゅう...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {missions.map((mission, index) => (
        <motion.div
          key={mission.id}
          className={`rounded-xl p-4 border-2 ${
            mission.claimed
              ? 'bg-gray-100 border-gray-300'
              : mission.completed
              ? 'bg-green-50 border-green-300'
              : 'bg-white border-gray-300'
          }`}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start gap-4">
            {/* アイコン */}
            <div
              className={`p-3 rounded-full ${
                mission.claimed
                  ? 'bg-gray-200'
                  : mission.completed
                  ? 'bg-green-200'
                  : 'bg-blue-100'
              }`}
            >
              {mission.claimed ? (
                <Check className="w-6 h-6 text-gray-600" />
              ) : (
                <Target className="w-6 h-6 text-primary" />
              )}
            </div>

            {/* ミッション情報 */}
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">{mission.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>

              {/* 進捗バー */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold">
                    {mission.currentCount} / {mission.targetCount}
                  </span>
                  <span className="text-muted-foreground">
                    {Math.round((mission.currentCount / mission.targetCount) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      mission.completed ? 'bg-green-500' : 'bg-primary'
                    }`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min((mission.currentCount / mission.targetCount) * 100, 100)}%`,
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  />
                </div>
              </div>

              {/* 報酬 */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="text-lg">🪙</span>
                  <span className="text-sm font-bold text-yellow-700">
                    +{mission.rewardCoins}
                  </span>
                </div>
                {mission.rewardFood && (
                  <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                    <span className="text-lg">{mission.rewardFood.emoji}</span>
                    <span className="text-sm font-bold text-green-700">
                      {mission.rewardFood.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 受け取りボタン */}
            <div className="flex items-center">
              {mission.claimed ? (
                <div className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="text-sm">かんりょう</span>
                </div>
              ) : mission.completed ? (
                <GameButton onClick={() => handleClaimReward(mission.id)} size="sm">
                  <Gift className="w-4 h-4 mr-1" />
                  うけとる
                </GameButton>
              ) : (
                <div className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg font-bold text-sm">
                  みたっせい
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}

      {missions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-bold">きょうの ミッションは ありません</p>
          <p className="text-sm mt-2">あした また きてね！</p>
        </div>
      )}
    </div>
  )
}
