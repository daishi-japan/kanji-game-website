import Link from 'next/link'
import { stages } from '@/lib/data/kanji-data'
import { ArrowLeft, Lock } from 'lucide-react'

export default function ReadingStageSelectPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-background p-8 flex flex-col">
      <div className="max-w-4xl mx-auto space-y-8 flex-1 flex flex-col justify-center">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-white rounded-full shadow-md hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">よむ（おちもの）</h1>
            <p className="text-muted-foreground">
              ステージを えらんで ぼうけんに でかけよう！
            </p>
          </div>
        </div>

        {/* ステージ一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stages.map((stage, index) => {
            const isLocked = false // 後で実装：前のステージをクリアしていないとロック

            return (
              <Link
                key={stage.id}
                href={isLocked ? '#' : `/play/reading/${stage.id}`}
                className={`block ${isLocked ? 'pointer-events-none' : ''}`}
              >
                <div
                  className={`p-6 rounded-2xl shadow-lg transition-all hover:scale-105 ${
                    isLocked
                      ? 'bg-gray-300 opacity-50'
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  {/* ステージ番号 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-6xl font-bold text-primary/20">
                      {index + 1}
                    </div>
                    {isLocked && <Lock className="w-8 h-8 text-gray-500" />}
                  </div>

                  {/* ステージ情報 */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{stage.name}</h2>
                    <p className="text-lg text-muted-foreground">
                      {stage.description}
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
                              (stage.difficulty === 'easy' && i < 1) ||
                              (stage.difficulty === 'normal' && i < 2) ||
                              (stage.difficulty === 'hard' && i < 3)
                                ? 'bg-primary'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 問題数 */}
                    <p className="text-sm text-muted-foreground">
                      もんだい: {stage.kanjiIds.length}こ
                    </p>
                  </div>

                  {/* ボタン */}
                  {!isLocked && (
                    <button className="mt-4 w-full game-button">
                      チャレンジ！
                    </button>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* フッター */}
        <div className="text-center text-sm text-muted-foreground">
          <p>かんじの よみかたを おぼえよう！</p>
        </div>
      </div>
    </main>
  )
}
