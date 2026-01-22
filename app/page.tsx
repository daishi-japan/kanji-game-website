import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()

  // ユーザー情報取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 未認証の場合は登録ページへ
  if (!user) {
    redirect('/register')
  }

  // プロフィール取得
  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .single()

  const userName = profile?.name || 'プレイヤー'

  return (
    <main className="flex min-h-screen flex-col p-8">
      {/* ヘッダー */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-muted-foreground">ようこそ</p>
          <h2 className="text-2xl font-bold">{userName}さん</h2>
        </div>
        <Link
          href="/parent/auth"
          className="px-4 py-2 text-sm font-medium bg-muted text-muted-foreground rounded-lg hover:opacity-90 transition-all"
        >
          おとなメニュー
        </Link>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-primary">
            あつまれ！漢字の森
          </h1>
          <p className="text-2xl text-muted-foreground">
            きょうも ぼうけんに でかけよう！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {/* 読み攻略モード */}
          <Link href="/play/reading">
            <button className="game-button bg-primary w-full">
              よむ（おちもの）
            </button>
          </Link>

          {/* 書き攻略モード */}
          <Link href="/play/writing">
            <button className="game-button bg-secondary w-full" style={{backgroundColor: 'var(--color-secondary)'}}>
              かく（おうぎ）
            </button>
          </Link>
        </div>

        {/* サブメニュー */}
        <div className="grid grid-cols-2 gap-4 pt-8">
          <button className="px-6 py-3 text-lg font-bold bg-muted text-foreground rounded-full hover:opacity-90 transition-all">
            ずかん
          </button>
          <button className="px-6 py-3 text-lg font-bold bg-muted text-foreground rounded-full hover:opacity-90 transition-all">
            マイルーム
          </button>
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
        <p>バージョン 0.1.0 (Phase 2.3)</p>
      </footer>
    </main>
  )
}
