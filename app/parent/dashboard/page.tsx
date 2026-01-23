'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Award, Clock, Target, Users, Plus, Trash2, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { GameButton } from '@/components/game/GameButton'
import {
  getLearningSummary,
  getParentRewards,
  createReward,
  deleteReward,
  claimReward,
} from '@/app/actions/parent'

type Reward = {
  id: string
  title: string
  description: string
  condition: {
    type: 'games_played' | 'kanji_mastered' | 'collection_rate'
    value: number
  }
  achieved: boolean
  claimedAt: string | null
  createdAt: string
}

export default function ParentDashboard() {
  const [summary, setSummary] = useState({
    totalPlayTime: 0,
    kanjiMastered: 0,
    averageAccuracy: 0,
    totalGamesPlayed: 0,
    characterCount: 0,
    collectionRate: 0,
  })
  const [rewards, setRewards] = useState<Reward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showRewardForm, setShowRewardForm] = useState(false)

  // 新規ご褒美フォーム
  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    conditionType: 'games_played' as 'games_played' | 'kanji_mastered' | 'collection_rate',
    conditionValue: 10,
  })

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      const [summaryRes, rewardsRes] = await Promise.all([
        getLearningSummary(),
        getParentRewards(),
      ])

      if (summaryRes.success && summaryRes.data) {
        setSummary(summaryRes.data)
      }

      if (rewardsRes.success && rewardsRes.data) {
        setRewards(rewardsRes.data.rewards)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [])

  // ご褒美作成
  const handleCreateReward = async () => {
    if (!newReward.title || !newReward.description) {
      alert('タイトルと説明を入力してください')
      return
    }

    const response = await createReward(
      newReward.title,
      newReward.description,
      newReward.conditionType,
      newReward.conditionValue
    )

    if (response.success) {
      // ご褒美リストを再取得
      const rewardsRes = await getParentRewards()
      if (rewardsRes.success && rewardsRes.data) {
        setRewards(rewardsRes.data.rewards)
      }

      // フォームをリセット
      setNewReward({
        title: '',
        description: '',
        conditionType: 'games_played',
        conditionValue: 10,
      })
      setShowRewardForm(false)
    } else {
      alert(response.error || 'ご褒美の作成に失敗しました')
    }
  }

  // ご褒美削除
  const handleDeleteReward = async (rewardId: string) => {
    if (!confirm('このご褒美を削除しますか？')) return

    const response = await deleteReward(rewardId)

    if (response.success) {
      setRewards(rewards.filter((r) => r.id !== rewardId))
    } else {
      alert(response.error || 'ご褒美の削除に失敗しました')
    }
  }

  // ご褒美を使用済みにする
  const handleClaimReward = async (rewardId: string) => {
    if (!confirm('このご褒美を「使用済み」にしますか？')) return

    const response = await claimReward(rewardId)

    if (response.success) {
      // ご褒美リストを再取得
      const rewardsRes = await getParentRewards()
      if (rewardsRes.success && rewardsRes.data) {
        setRewards(rewardsRes.data.rewards)
      }
    } else {
      alert(response.error || 'ご褒美の更新に失敗しました')
    }
  }

  const getConditionLabel = (type: string, value: number) => {
    switch (type) {
      case 'games_played':
        return `ゲームを ${value} 回プレイ`
      case 'kanji_mastered':
        return `漢字を ${value} 字習得`
      case 'collection_rate':
        return `図鑑を ${value}% 達成`
      default:
        return ''
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-100 to-background p-8">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <p className="text-2xl font-bold">読み込み中...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-white rounded-full shadow-md hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">保護者ダッシュボード</h1>
            <p className="text-muted-foreground">お子さまの学習状況を確認できます</p>
          </div>
        </div>

        {/* 学習サマリー */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">学習サマリー</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* プレイ時間 */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-blue-600 font-bold">プレイ時間</p>
              </div>
              <p className="text-4xl font-bold text-blue-600">{summary.totalPlayTime}</p>
              <p className="text-sm text-blue-600 mt-1">分</p>
            </div>

            {/* 習得漢字数 */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-600 font-bold">習得漢字</p>
              </div>
              <p className="text-4xl font-bold text-green-600">{summary.kanjiMastered}</p>
              <p className="text-sm text-green-600 mt-1">字</p>
            </div>

            {/* 正解率 */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-purple-600 font-bold">平均正解率</p>
              </div>
              <p className="text-4xl font-bold text-purple-600">{summary.averageAccuracy}</p>
              <p className="text-sm text-purple-600 mt-1">%</p>
            </div>

            {/* プレイ回数 */}
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-600 font-bold">プレイ回数</p>
              </div>
              <p className="text-4xl font-bold text-yellow-600">{summary.totalGamesPlayed}</p>
              <p className="text-sm text-yellow-600 mt-1">回</p>
            </div>

            {/* 所持キャラ */}
            <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-pink-600" />
                <p className="text-sm text-pink-600 font-bold">所持キャラ</p>
              </div>
              <p className="text-4xl font-bold text-pink-600">{summary.characterCount}</p>
              <p className="text-sm text-pink-600 mt-1">体</p>
            </div>

            {/* 収集率 */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-orange-600 font-bold">収集率</p>
              </div>
              <p className="text-4xl font-bold text-orange-600">{summary.collectionRate}</p>
              <p className="text-sm text-orange-600 mt-1">%</p>
            </div>
          </div>
        </div>

        {/* ご褒美管理 */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">カスタムご褒美</h2>
            </div>
            <GameButton onClick={() => setShowRewardForm(!showRewardForm)}>
              <Plus className="w-5 h-5 mr-2" />
              新しいご褒美を追加
            </GameButton>
          </div>

          {/* 新規ご褒美フォーム */}
          {showRewardForm && (
            <motion.div
              className="bg-gray-50 rounded-xl p-6 mb-6 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div>
                <label className="block text-sm font-bold mb-2">ご褒美のタイトル</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="例: アイスクリーム"
                  value={newReward.title}
                  onChange={(e) => setNewReward({ ...newReward, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">説明</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="例: 好きなアイスを買いに行こう！"
                  value={newReward.description}
                  onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">達成条件</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newReward.conditionType}
                    onChange={(e) =>
                      setNewReward({
                        ...newReward,
                        conditionType: e.target.value as any,
                      })
                    }
                  >
                    <option value="games_played">ゲームプレイ回数</option>
                    <option value="kanji_mastered">習得漢字数</option>
                    <option value="collection_rate">図鑑収集率</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">目標値</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={newReward.conditionValue}
                    onChange={(e) =>
                      setNewReward({ ...newReward, conditionValue: parseInt(e.target.value) })
                    }
                    min="1"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <GameButton onClick={handleCreateReward} className="flex-1">
                  作成
                </GameButton>
                <GameButton
                  variant="secondary"
                  onClick={() => setShowRewardForm(false)}
                  className="flex-1"
                >
                  キャンセル
                </GameButton>
              </div>
            </motion.div>
          )}

          {/* ご褒美リスト */}
          {rewards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-bold">まだご褒美が設定されていません</p>
              <p className="text-sm mt-2">
                お子さまのモチベーションアップのために、ご褒美を設定しましょう
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <motion.div
                  key={reward.id}
                  className={`p-6 rounded-xl border-2 ${
                    reward.claimedAt
                      ? 'bg-gray-100 border-gray-300'
                      : reward.achieved
                      ? 'bg-green-50 border-green-300'
                      : 'bg-white border-gray-300'
                  }`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{reward.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteReward(reward.id)}
                      className="p-2 hover:bg-red-100 rounded-full transition-all"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground">
                      達成条件: {getConditionLabel(reward.condition.type, reward.condition.value)}
                    </p>

                    {reward.claimedAt ? (
                      <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-center font-bold">
                        使用済み ({new Date(reward.claimedAt).toLocaleDateString('ja-JP')})
                      </div>
                    ) : reward.achieved ? (
                      <div className="flex gap-2">
                        <div className="flex-1 bg-green-200 text-green-700 px-4 py-2 rounded-lg text-center font-bold">
                          🎉 達成！
                        </div>
                        <button
                          onClick={() => handleClaimReward(reward.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-bold flex items-center gap-2"
                          title="使用済みにする"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-center font-bold">
                        未達成
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Phase 5 完了メッセージ */}
        <div className="text-center text-sm text-muted-foreground">
          <p>保護者機能 (Phase 5 完了)</p>
        </div>
      </div>
    </main>
  )
}
