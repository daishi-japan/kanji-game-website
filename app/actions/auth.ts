'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type ActionResult<T = void> = {
  success: boolean
  error?: string
  data?: T
}

/**
 * 初回登録（匿名認証でユーザー作成）
 */
export async function registerUser(name: string): Promise<ActionResult<{ userId: string }>> {
  try {
    if (!name || name.trim().length === 0) {
      return { success: false, error: 'なまえをいれてね' }
    }

    if (name.trim().length > 10) {
      return { success: false, error: 'なまえは10もじまでにしてね' }
    }

    const supabase = await createClient()

    // 匿名認証でユーザー作成
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          name: name.trim(),
        },
      },
    })

    if (authError || !authData.user) {
      console.error('Anonymous sign in error:', authError)
      return { success: false, error: 'ユーザーの作成に失敗しました' }
    }

    // プロフィールの名前を更新（トリガーで自動作成されるが、名前を確実に反映）
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name: name.trim() })
      .eq('id', authData.user.id)

    if (updateError) {
      console.error('Profile update error:', updateError)
      // エラーでも継続（トリガーで作成されているはず）
    }

    return {
      success: true,
      data: { userId: authData.user.id },
    }
  } catch (error) {
    console.error('registerUser error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * 現在のユーザー情報を取得
 */
export async function getCurrentUser(): Promise<ActionResult<{ id: string; name: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: '認証エラー' }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Get profile error:', profileError)
      return { success: false, error: 'プロフィールの取得に失敗しました' }
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: profile.name,
      },
    }
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * 保護者認証ゲート（計算問題の検証）
 */
export async function verifyParentGate(answer: number): Promise<ActionResult<{ verified: boolean }>> {
  try {
    // 簡単な計算問題（セッション内で生成された問題の答えと比較）
    // 実際の実装では、セッションやサーバー側で生成した問題を使用
    // ここでは簡易実装として、固定の問題を使用
    const correctAnswer = 12 // 例: 7 + 5 = 12

    if (answer === correctAnswer) {
      return {
        success: true,
        data: { verified: true },
      }
    }

    return {
      success: false,
      error: 'こたえがちがうよ',
      data: { verified: false },
    }
  } catch (error) {
    console.error('verifyParentGate error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}

/**
 * ログアウト
 */
export async function signOut(): Promise<ActionResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Sign out error:', error)
      return { success: false, error: 'ログアウトに失敗しました' }
    }

    return { success: true }
  } catch (error) {
    console.error('signOut error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}
