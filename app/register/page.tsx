'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/app/actions/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await registerUser(name)

      if (result.success) {
        // 登録成功 → ホーム画面へ
        router.push('/')
        router.refresh()
      } else {
        setError(result.error || 'とうろくに しっぱいしました')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError('よきしない えらーが はっせいしました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        {/* タイトル */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            あつまれ！漢字の森
          </h1>
          <p className="text-xl text-muted-foreground">
            きみの なまえを おしえてね
          </p>
        </div>

        {/* 登録フォーム */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium mb-2">
              なまえ（ひらがなで）
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="よりちゃん"
              maxLength={10}
              className="w-full px-4 py-3 text-xl border-2 border-muted rounded-lg focus:outline-none focus:border-primary"
              autoFocus
              disabled={isLoading}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              ※10もじまで いれられるよ
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-4 bg-accent/10 border border-accent rounded-lg">
              <p className="text-accent font-medium">{error}</p>
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="game-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'まってね...' : 'ぼうけんを はじめる！'}
          </button>
        </form>

        {/* 説明 */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>このなまえは あとから かえられるよ</p>
          <p>まずは すきな なまえを いれてね</p>
        </div>
      </div>
    </main>
  )
}
