'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LoginBonusModal } from '@/components/daily/LoginBonusModal'
import { DailyMissions } from '@/components/daily/DailyMissions'
import { checkLoginBonus } from '@/app/actions/daily'

export default function Home() {
  const [userName, setUserName] = useState('プレイヤー')
  const [showLoginBonus, setShowLoginBonus] = useState(false)
  const [loginBonusData, setLoginBonusData] = useState({
    loginStreak: 1,
    bonusCoins: 0,
    bonusFood: undefined as
      | { foodId: string; name: string; emoji: string; amount: number }
      | undefined,
  })
  const [showMissions, setShowMissions] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/register'
        return
      }

      // プロフィール取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()

      setUserName(profile?.name || 'プレイヤー')

      // ログインボーナスチェック
      const bonusResponse = await checkLoginBonus()
      if (bonusResponse.success && bonusResponse.data) {
        if (bonusResponse.data.isNewDay) {
          // 新しい日のログイン：ボーナスモーダルを表示
          setLoginBonusData({
            loginStreak: bonusResponse.data.loginStreak,
            bonusCoins: bonusResponse.data.bonusCoins,
            bonusFood: bonusResponse.data.bonusFood,
          })
          setShowLoginBonus(true)
        }
      }
    }

    fetchUserData()
  }, [])

  return (
    <main className="flex min-h-screen flex-col p-8">
      {/* ヘッダー */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-muted-foreground">ようこそ</p>
          <h2 className="text-2xl font-bold">{userName}さん</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMissions(!showMissions)}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            デイリー
          </button>
          <Link
            href="/parent/auth"
            className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground rounded-lg hover:opacity-90 transition-all"
          >
            おとなメニュー
          </Link>
        </div>
      </header>

      {/* デイリーミッション */}
      {showMissions && (
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">きょうの ミッション</h2>
          </div>
          <DailyMissions />
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-primary">あつまれ！漢字の森</h1>
          <p className="text-2xl text-muted-foreground">
            きょうも ぼうけんに でかけよう！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {/* 読み攻略モード */}
          <Link href="/play/reading">
            <button className="game-button bg-primary w-full">よむ（おちもの）</button>
          </Link>

          {/* 書き攻略モード */}
          <Link href="/play/writing">
            <button
              className="game-button bg-secondary w-full"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              かく（おうぎ）
            </button>
          </Link>
        </div>

        {/* サブメニュー */}
        <div className="grid grid-cols-2 gap-4 pt-8">
          <Link href="/collection">
            <button className="px-6 py-3 text-lg font-bold bg-muted text-foreground rounded-full hover:opacity-90 transition-all w-full">
              ずかん
            </button>
          </Link>
          <Link href="/room">
            <button className="px-6 py-3 text-lg font-bold bg-muted text-foreground rounded-full hover:opacity-90 transition-all w-full">
              マイルーム
            </button>
          </Link>
        </div>

        {/* デモページリンク（開発用） */}
        <div className="pt-8">
          <Link
            href="/demo"
            className="px-6 py-3 text-sm font-bold bg-yellow-500 text-white rounded-full hover:opacity-90 transition-all inline-block"
          >
            🎨 コンポーネント デモ (Phase 2.1)
          </Link>
        </div>
      </div>

      {/* フッター */}
      <footer className="text-center text-sm text-muted-foreground">
        <p>バージョン 0.3.0 (Phase 6完了)</p>
      </footer>

      {/* ログインボーナスモーダル */}
      <LoginBonusModal
        isOpen={showLoginBonus}
        loginStreak={loginBonusData.loginStreak}
        bonusCoins={loginBonusData.bonusCoins}
        bonusFood={loginBonusData.bonusFood}
        onClose={() => setShowLoginBonus(false)}
      />
    </main>
  )
}
