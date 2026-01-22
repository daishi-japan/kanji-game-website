import Link from 'next/link'
import { strokeSets } from '@/lib/data/stroke-data'
import { ArrowLeft, Lock } from 'lucide-react'

export default function WritingSetSelectPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-white rounded-full shadow-md hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">かく（おうぎ）</h1>
            <p className="text-muted-foreground">
              セットを えらんで かきじゅんを れんしゅうしよう！
            </p>
          </div>
        </div>

        {/* セット一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strokeSets.map((set, index) => {
            const isLocked = false // 後で実装：前のセットをクリアしていないとロック

            return (
              <Link
                key={set.id}
                href={isLocked ? '#' : `/play/writing/${set.id}`}
                className={`block ${isLocked ? 'pointer-events-none' : ''}`}
              >
                <div
                  className={`p-6 rounded-2xl shadow-lg transition-all hover:scale-105 ${
                    isLocked
                      ? 'bg-gray-300 opacity-50'
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  {/* セット番号 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-6xl font-bold text-secondary/20">
                      {index + 1}
                    </div>
                    {isLocked && <Lock className="w-8 h-8 text-gray-500" />}
                  </div>

                  {/* セット情報 */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{set.name}</h2>
                    <p className="text-lg text-muted-foreground">
                      {set.description}
                    </p>

                    {/* 難易度 */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        むずかしさ:
                      </span>
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-6 rounded-full ${
                              (set.difficulty === 'easy' && i < 1) ||
                              (set.difficulty === 'normal' && i < 2) ||
                              (set.difficulty === 'hard' && i < 3)
                                ? 'bg-secondary'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 問題数 */}
                    <p className="text-sm text-muted-foreground">
                      もんだい: {set.kanjiIds.length}こ
                    </p>
                  </div>

                  {/* ボタン */}
                  {!isLocked && (
                    <button className="mt-4 w-full game-button bg-secondary" style={{backgroundColor: 'var(--color-secondary)'}}>
                      れんしゅう！
                    </button>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* フッター */}
        <div className="text-center text-sm text-muted-foreground">
          <p>かんじの かきじゅんを おぼえよう！</p>
        </div>
      </div>
    </main>
  )
}
