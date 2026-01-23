'use server'

import { createClient } from '@/lib/supabase/server'

export type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

/**
 * ログインボーナスをチェック・付与
 */
export async function checkLoginBonus(): Promise<
  ActionResult<{
    isNewDay: boolean
    loginStreak: number
    bonusCoins: number
    bonusFood?: { foodId: string; name: string; emoji: string; amount: number }
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

    // RPC関数を呼び出してログインボーナス処理
    const { data, error } = await supabase.rpc('rpc_process_login_bonus', {
      p_user_id: user.id,
    })

    if (error) {
      console.error('Login bonus error:', error)
      return { success: false, error: 'ログインボーナスの処理に失敗しました' }
    }

    // 新しい日のログインかどうか
    const isNewDay = data?.is_new_day || false

    if (!isNewDay) {
      // 今日はすでにログイン済み
      return {
        success: true,
        data: {
          isNewDay: false,
          loginStreak: data?.login_streak || 1,
          bonusCoins: 0,
        },
      }
    }

    // 新しい日のログイン：ボーナス付与
    const loginStreak = data?.login_streak || 1
    const bonusCoins = Math.min(loginStreak * 10, 100) // 最大100コイン

    // 7日連続でエサもプレゼント
    let bonusFood
    if (loginStreak % 7 === 0) {
      bonusFood = {
        foodId: 'food_010', // はちみつ（rare）
        name: 'はちみつ',
        emoji: '🍯',
        amount: 1,
      }
    }

    return {
      success: true,
      data: {
        isNewDay: true,
        loginStreak,
        bonusCoins,
        bonusFood,
      },
    }
  } catch (error) {
    console.error('Check login bonus error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * デイリーミッション一覧を取得
 */
export async function getDailyMissions(): Promise<
  ActionResult<{
    missions: Array<{
      id: string
      title: string
      description: string
      type: 'play_game' | 'clear_stage' | 'feed_character' | 'get_character'
      targetCount: number
      currentCount: number
      rewardCoins: number
      rewardFood?: { foodId: string; name: string; emoji: string }
      completed: boolean
      claimed: boolean
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

    // 今日の日付（YYYY-MM-DD）
    const today = new Date().toISOString().split('T')[0]

    // デイリーミッションを取得
    const { data: missions, error } = await supabase
      .from('daily_missions')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)

    if (error) {
      console.error('Get daily missions error:', error)
      return { success: false, error: 'ミッション情報の取得に失敗しました' }
    }

    // デイリーミッションが存在しない場合は作成
    if (!missions || missions.length === 0) {
      // 固定の3つのミッションを作成
      const defaultMissions = [
        {
          user_id: user.id,
          date: today,
          mission_type: 'play_game',
          target_count: 3,
          current_count: 0,
          reward_coins: 50,
        },
        {
          user_id: user.id,
          date: today,
          mission_type: 'clear_stage',
          target_count: 1,
          current_count: 0,
          reward_coins: 100,
        },
        {
          user_id: user.id,
          date: today,
          mission_type: 'feed_character',
          target_count: 2,
          current_count: 0,
          reward_coins: 30,
          reward_food_id: 'food_006', // おだんご
        },
      ]

      const { data: newMissions } = await supabase
        .from('daily_missions')
        .insert(defaultMissions)
        .select('*')

      return {
        success: true,
        data: {
          missions: (newMissions || []).map(formatMission),
        },
      }
    }

    return {
      success: true,
      data: {
        missions: missions.map(formatMission),
      },
    }
  } catch (error) {
    console.error('Get daily missions error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * ミッション報酬を受け取る
 */
export async function claimMissionReward(missionId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // ミッション情報を取得
    const { data: mission } = await supabase
      .from('daily_missions')
      .select('*')
      .eq('id', missionId)
      .eq('user_id', user.id)
      .single()

    if (!mission) {
      return { success: false, error: 'ミッションが見つかりません' }
    }

    if (mission.claimed) {
      return { success: false, error: 'すでに受け取り済みです' }
    }

    if (mission.current_count < mission.target_count) {
      return { success: false, error: 'ミッションが未達成です' }
    }

    // 報酬を付与
    // コインを追加
    const { error: coinError } = await supabase.rpc('increment_coins', {
      user_id: user.id,
      amount: mission.reward_coins,
    })

    if (coinError) {
      console.error('Increment coins error:', coinError)
      return { success: false, error: 'コインの付与に失敗しました' }
    }

    // エサがある場合は追加
    if (mission.reward_food_id) {
      const { error: foodError } = await supabase.rpc('add_item', {
        p_user_id: user.id,
        p_item_type: 'food',
        p_item_id: mission.reward_food_id,
        p_amount: 1,
      })

      if (foodError) {
        console.error('Add food error:', foodError)
      }
    }

    // ミッションを「受け取り済み」にする
    const { error: updateError } = await supabase
      .from('daily_missions')
      .update({ claimed: true })
      .eq('id', missionId)

    if (updateError) {
      console.error('Update mission error:', updateError)
      return { success: false, error: 'ミッションの更新に失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('Claim mission reward error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * ミッション情報をフォーマット
 */
function formatMission(mission: any) {
  const missionConfig: Record<
    string,
    {
      title: string
      description: string
      rewardFood?: { foodId: string; name: string; emoji: string }
    }
  > = {
    play_game: {
      title: 'ゲームをプレイしよう',
      description: 'ゲームを3回プレイする',
    },
    clear_stage: {
      title: 'ステージをクリアしよう',
      description: 'ステージを1回クリアする',
    },
    feed_character: {
      title: 'キャラクターにエサをあげよう',
      description: 'キャラクターに2回エサをあげる',
      rewardFood: {
        foodId: 'food_006',
        name: 'おだんご',
        emoji: '🍡',
      },
    },
  }

  const config = missionConfig[mission.mission_type] || {
    title: 'ミッション',
    description: '',
  }

  return {
    id: mission.id,
    title: config.title,
    description: config.description,
    type: mission.mission_type,
    targetCount: mission.target_count,
    currentCount: mission.current_count,
    rewardCoins: mission.reward_coins,
    rewardFood: config.rewardFood,
    completed: mission.current_count >= mission.target_count,
    claimed: mission.claimed,
  }
}
