'use server'

import { createClient } from '@/lib/supabase/server'
import { calculateRewards } from '@/lib/data/reward-data'
import type { GameResult, RewardItem } from '@/lib/data/reward-data'

export type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

/**
 * ゲーム結果を送信し、報酬を付与
 */
export async function submitGameResult(
  result: GameResult
): Promise<ActionResult<{ rewards: RewardItem[] }>> {
  try {
    const supabase = await createClient()

    // ユーザー認証チェック
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // 報酬計算
    const rewards = calculateRewards(result)

    // RPC関数を呼び出してゲーム結果を保存し、報酬を付与
    const { data, error } = await supabase.rpc('rpc_finish_game', {
      p_user_id: user.id,
      p_mode: result.mode,
      p_stage_id: result.stageId,
      p_score: result.score,
      p_max_score: result.maxScore,
      p_rank: result.rank,
      p_cleared: result.cleared,
      p_rewards: rewards.map((r) => ({
        type: r.type,
        item_id: r.id,
        amount: r.amount,
      })),
    })

    if (error) {
      console.error('RPC Error:', error)
      return { success: false, error: 'ゲーム結果の保存に失敗しました' }
    }

    return {
      success: true,
      data: { rewards },
    }
  } catch (error) {
    console.error('Submit game result error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * 所持キャラクター一覧を取得
 */
export async function getOwnedCharacters(): Promise<
  ActionResult<{ characterIds: string[] }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    const { data, error } = await supabase
      .from('user_characters')
      .select('character_id')
      .eq('user_id', user.id)

    if (error) {
      console.error('Get owned characters error:', error)
      return { success: false, error: 'キャラクター情報の取得に失敗しました' }
    }

    const characterIds = data?.map((row) => row.character_id) || []

    return {
      success: true,
      data: { characterIds },
    }
  } catch (error) {
    console.error('Get owned characters error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * キャラクター詳細情報を取得
 */
export async function getCharacterDetails(characterId: string): Promise<
  ActionResult<{
    level: number
    experience: number
    friendship: number
    isOwned: boolean
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

    const { data, error } = await supabase
      .from('user_characters')
      .select('level, experience, friendship')
      .eq('user_id', user.id)
      .eq('character_id', characterId)
      .single()

    if (error) {
      // キャラクターを所持していない場合
      if (error.code === 'PGRST116') {
        return {
          success: true,
          data: {
            level: 1,
            experience: 0,
            friendship: 0,
            isOwned: false,
          },
        }
      }
      console.error('Get character details error:', error)
      return { success: false, error: 'キャラクター情報の取得に失敗しました' }
    }

    return {
      success: true,
      data: {
        level: data.level,
        experience: data.experience,
        friendship: data.friendship,
        isOwned: true,
      },
    }
  } catch (error) {
    console.error('Get character details error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * エサやり処理
 */
export async function feedCharacter(
  characterId: string,
  foodId: string
): Promise<
  ActionResult<{
    newLevel: number
    newExperience: number
    newFriendship: number
    leveledUp: boolean
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

    // RPC関数を呼び出してエサやり処理
    const { data, error } = await supabase.rpc('rpc_feed_character', {
      p_user_id: user.id,
      p_character_id: characterId,
      p_food_id: foodId,
    })

    if (error) {
      console.error('Feed character error:', error)
      return { success: false, error: 'エサやりに失敗しました' }
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    console.error('Feed character error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * 進化処理
 */
export async function evolveCharacter(
  characterId: string
): Promise<ActionResult<{ newCharacterId: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: '認証が必要です' }
    }

    // RPC関数を呼び出して進化処理
    const { data, error } = await supabase.rpc('rpc_evolve_character', {
      p_user_id: user.id,
      p_character_id: characterId,
    })

    if (error) {
      console.error('Evolve character error:', error)
      return { success: false, error: '進化に失敗しました' }
    }

    if (!data || !data.new_character_id) {
      return { success: false, error: '進化条件を満たしていません' }
    }

    return {
      success: true,
      data: { newCharacterId: data.new_character_id },
    }
  } catch (error) {
    console.error('Evolve character error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * 所持アイテム（エサ・コイン）を取得
 */
export async function getUserInventory(): Promise<
  ActionResult<{
    coins: number
    foods: { foodId: string; amount: number }[]
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

    // プロフィールからコイン取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('coins')
      .eq('id', user.id)
      .single()

    // アイテムテーブルからエサ取得
    const { data: items } = await supabase
      .from('user_items')
      .select('item_id, amount')
      .eq('user_id', user.id)
      .eq('item_type', 'food')

    return {
      success: true,
      data: {
        coins: profile?.coins || 0,
        foods:
          items?.map((item) => ({
            foodId: item.item_id,
            amount: item.amount,
          })) || [],
      },
    }
  } catch (error) {
    console.error('Get user inventory error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}
