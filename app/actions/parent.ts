'use server'

import { createClient } from '@/lib/supabase/server'

export type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

/**
 * 保護者認証チェック（簡易計算問題）
 */
export async function verifyParentGate(answer: number): Promise<ActionResult<{ verified: boolean }>> {
  // 簡易的な検証: 7 + 5 = 12
  const correctAnswer = 12

  if (answer === correctAnswer) {
    return {
      success: true,
      data: { verified: true },
    }
  }

  return {
    success: false,
    error: 'こたえが ちがいます',
  }
}

/**
 * 学習サマリーを取得
 */
export async function getLearningSummary(): Promise<
  ActionResult<{
    totalPlayTime: number // 分単位
    kanjiMastered: number // 習得した漢字数
    averageAccuracy: number // 平均正解率（%）
    totalGamesPlayed: number // プレイ回数
    characterCount: number // 所持キャラ数
    collectionRate: number // 収集率（%）
  }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // ゲーム履歴から統計を計算
    const { data: gameHistory } = await supabase
      .from('game_history')
      .select('score, max_score, cleared, created_at')
      .eq('user_id', user.id)

    // プレイ時間の概算（1ゲーム約5分と仮定）
    const totalGamesPlayed = gameHistory?.length || 0
    const totalPlayTime = totalGamesPlayed * 5

    // 平均正解率
    let totalScore = 0
    let totalMaxScore = 0
    let clearedCount = 0

    gameHistory?.forEach((game) => {
      totalScore += game.score
      totalMaxScore += game.max_score
      if (game.cleared) clearedCount++
    })

    const averageAccuracy = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

    // 習得した漢字数（クリアしたステージ数の目安）
    const kanjiMastered = clearedCount * 5 // 1ステージ5個と仮定

    // キャラクター収集状況
    const { data: characters } = await supabase
      .from('user_characters')
      .select('character_id')
      .eq('user_id', user.id)

    const characterCount = characters?.length || 0
    // 全キャラ数を50と仮定（character_dataテーブルから取得する方が正確）
    const collectionRate = Math.round((characterCount / 50) * 100)

    return {
      success: true,
      data: {
        totalPlayTime,
        kanjiMastered,
        averageAccuracy,
        totalGamesPlayed,
        characterCount,
        collectionRate,
      },
    }
  } catch (error) {
    console.error('Get learning summary error:', error)
    return { success: false, error: '統計情報の取得に失敗しました' }
  }
}

/**
 * ご褒美リスト取得
 */
export async function getParentRewards(): Promise<
  ActionResult<{
    rewards: Array<{
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
    }>
  }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const { data: rewards, error } = await supabase
      .from('parent_rewards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Get parent rewards error:', error)
      return { success: false, error: 'ご褒美情報の取得に失敗しました' }
    }

    // 達成状況を判定
    const summary = await getLearningSummary()
    const stats = summary.data || {
      totalGamesPlayed: 0,
      kanjiMastered: 0,
      collectionRate: 0,
    }

    const rewardsWithStatus = rewards.map((reward) => {
      let achieved = false

      switch (reward.condition_type) {
        case 'games_played':
          achieved = stats.totalGamesPlayed >= reward.condition_value
          break
        case 'kanji_mastered':
          achieved = stats.kanjiMastered >= reward.condition_value
          break
        case 'collection_rate':
          achieved = stats.collectionRate >= reward.condition_value
          break
      }

      return {
        id: reward.id,
        title: reward.title,
        description: reward.description,
        condition: {
          type: reward.condition_type,
          value: reward.condition_value,
        },
        achieved,
        claimedAt: reward.claimed_at,
        createdAt: reward.created_at,
      }
    })

    return {
      success: true,
      data: { rewards: rewardsWithStatus },
    }
  } catch (error) {
    console.error('Get parent rewards error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * ご褒美作成
 */
export async function createReward(
  title: string,
  description: string,
  conditionType: 'games_played' | 'kanji_mastered' | 'collection_rate',
  conditionValue: number
): Promise<ActionResult<{ rewardId: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const { data, error } = await supabase
      .from('parent_rewards')
      .insert({
        user_id: user.id,
        title,
        description,
        condition_type: conditionType,
        condition_value: conditionValue,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Create reward error:', error)
      return { success: false, error: 'ご褒美の作成に失敗しました' }
    }

    return {
      success: true,
      data: { rewardId: data.id },
    }
  } catch (error) {
    console.error('Create reward error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * ご褒美削除
 */
export async function deleteReward(rewardId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const { error } = await supabase
      .from('parent_rewards')
      .delete()
      .eq('id', rewardId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Delete reward error:', error)
      return { success: false, error: 'ご褒美の削除に失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete reward error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * ご褒美を「使用済み」にする
 */
export async function claimReward(rewardId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const { error } = await supabase
      .from('parent_rewards')
      .update({ claimed_at: new Date().toISOString() })
      .eq('id', rewardId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Claim reward error:', error)
      return { success: false, error: 'ご褒美の更新に失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('Claim reward error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}
