'use client'

import { useState } from 'react'
import { verifyParentGate } from '@/app/actions/auth'

interface ParentGateProps {
  onVerified: () => void
  onCancel?: () => void
}

export function ParentGate({ onVerified, onCancel }: ParentGateProps) {
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const maxAttempts = 3

  // 簡単な計算問題を生成（実際は動的に生成すべき）
  const problem = {
    question: '7 + 5 = ?',
    correctAnswer: 12,
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const numAnswer = parseInt(answer, 10)

    if (isNaN(numAnswer)) {
      setError('すうじを にゅうりょくしてください')
      return
    }

    const result = await verifyParentGate(numAnswer)

    if (result.success && result.data?.verified) {
      onVerified()
    } else {
      setAttempts((prev) => prev + 1)

      if (attempts + 1 >= maxAttempts) {
        setError('こたえが ちがいます。もう いちど ためしてね')
        setAttempts(0)
        setAnswer('')
      } else {
        setError(`こたえが ちがいます。あと ${maxAttempts - attempts - 1} かい`)
        setAnswer('')
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-8 max-w-md w-full space-y-6">
        {/* タイトル */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">おとなの かくにん</h2>
          <p className="text-muted-foreground">
            おとなの ひとに といて もらってね
          </p>
        </div>

        {/* 計算問題 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-4">
              {problem.question}
            </p>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full px-4 py-3 text-2xl text-center border-2 border-muted rounded-lg focus:outline-none focus:border-primary"
              placeholder="こたえ"
              autoFocus
            />
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="p-4 bg-accent/10 border border-accent rounded-lg">
              <p className="text-accent text-center">{error}</p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-4">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 text-lg font-bold bg-muted text-muted-foreground rounded-full hover:opacity-90 transition-all"
              >
                もどる
              </button>
            )}
            <button
              type="submit"
              disabled={!answer}
              className="flex-1 game-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              かくにん
            </button>
          </div>
        </form>

        {/* ヒント */}
        <p className="text-xs text-center text-muted-foreground">
          ※この もんだいは おとなの ひと むけです
        </p>
      </div>
    </div>
  )
}
