import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ParentDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/register')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, login_streak, last_login_at')
    .eq('id', user.id)
    .single()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">保護者ダッシュボード</h1>
            <p className="text-muted-foreground mt-2">
              お子さま: {profile?.name || 'プレイヤー'}さん
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 font-bold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all"
          >
            ホームに戻る
          </Link>
        </header>

        {/* 学習サマリー */}
        <section className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold">学習サマリー</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4">
              <p className="text-sm text-muted-foreground">連続ログイン</p>
              <p className="text-3xl font-bold text-primary">{profile?.login_streak || 0}日</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-sm text-muted-foreground">最終ログイン</p>
              <p className="text-lg font-bold">
                {profile?.last_login_at
                  ? new Date(profile.last_login_at).toLocaleDateString('ja-JP')
                  : '未ログイン'}
              </p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-sm text-muted-foreground">習得漢字数</p>
              <p className="text-3xl font-bold text-success">0字</p>
            </div>
          </div>
        </section>

        {/* カスタムご褒美 */}
        <section className="bg-muted/50 rounded-lg p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">カスタムご褒美</h2>
            <button className="px-4 py-2 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all">
              新しいご褒美を追加
            </button>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <p>まだご褒美が設定されていません</p>
            <p className="text-sm mt-2">お子さまのモチベーションアップのために、ご褒美を設定しましょう</p>
          </div>
        </section>

        {/* 設定 */}
        <section className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold">設定</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 bg-background rounded-lg hover:bg-muted transition-all">
              <span className="font-medium">アカウント設定</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-background rounded-lg hover:bg-muted transition-all">
              <span className="font-medium">学習設定（難易度など）</span>
            </button>
            <button className="w-full text-left px-4 py-3 bg-background rounded-lg hover:bg-muted transition-all">
              <span className="font-medium">通知設定</span>
            </button>
          </div>
        </section>

        {/* Phase 1.3 実装完了メッセージ */}
        <div className="bg-success/10 border border-success rounded-lg p-6 text-center">
          <p className="font-bold text-success">Phase 1.3: 認証システム実装完了</p>
          <p className="text-sm text-muted-foreground mt-2">
            次のフェーズで詳細な機能を実装していきます
          </p>
        </div>
      </div>
    </main>
  )
}
