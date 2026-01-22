'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Home, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { getOwnedCharacters } from '@/app/actions/game'
import { getCharacterById } from '@/lib/data/character-data'
import { GameButton } from '@/components/game/GameButton'

export default function RoomPage() {
  const [ownedCharacterIds, setOwnedCharacterIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 所持キャラクターを取得
  useEffect(() => {
    const fetchOwnedCharacters = async () => {
      const response = await getOwnedCharacters()

      if (response.success && response.data) {
        setOwnedCharacterIds(response.data.characterIds)
      }

      setIsLoading(false)
    }

    fetchOwnedCharacters()
  }, [])

  // 所持キャラクターのデータを取得
  const ownedCharacters = ownedCharacterIds
    .map((id) => getCharacterById(id))
    .filter((char) => char !== undefined)

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-green-100 to-background p-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <p className="text-2xl font-bold">よみこみちゅう...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 bg-white rounded-full shadow-md hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Home className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">マイルーム</h1>
            </div>
            <p className="text-muted-foreground">
              キャラクターたちと いっしょに すごそう！
            </p>
          </div>
        </div>

        {/* メインルーム */}
        <div className="bg-gradient-to-br from-yellow-50 to-green-50 rounded-2xl p-8 shadow-lg min-h-[500px] relative overflow-hidden border-4 border-white">
          {/* 背景装飾 */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-200/50 to-transparent" />

          {/* キャラクター表示エリア */}
          <div className="relative z-10 h-full flex flex-wrap items-end justify-center gap-8 pb-12">
            {ownedCharacters.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold text-muted-foreground">
                    まだ キャラクターが いません
                  </p>
                  <p className="text-lg text-muted-foreground">
                    ゲームを プレイして キャラクターを ゲットしよう！
                  </p>
                  <Link href="/play/reading">
                    <GameButton size="lg">ゲームを はじめる</GameButton>
                  </Link>
                </div>
              </div>
            ) : (
              ownedCharacters.slice(0, 6).map((character, index) => (
                <motion.div
                  key={character.id}
                  className="cursor-pointer hover:scale-110 transition-transform"
                  initial={{ scale: 0, y: 100 }}
                  animate={{
                    scale: 1,
                    y: [0, -10, 0],
                  }}
                  transition={{
                    scale: { delay: index * 0.1, type: 'spring', stiffness: 200 },
                    y: {
                      duration: 2 + index * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                  whileHover={{ y: -20 }}
                  title={character.name}
                >
                  <div className="text-center">
                    <div className="text-8xl mb-2 drop-shadow-lg">{character.emoji}</div>
                    <div className="bg-white/80 rounded-lg px-3 py-1 text-sm font-bold shadow-md">
                      {character.name}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* 太陽 */}
          <motion.div
            className="absolute top-8 right-8 text-6xl"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            ☀️
          </motion.div>

          {/* 雲 */}
          <motion.div
            className="absolute top-16 left-12 text-4xl"
            animate={{
              x: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            ☁️
          </motion.div>
        </div>

        {/* 情報カード */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 所持キャラ数 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-6 h-6 text-pink-500" />
              <p className="text-sm text-muted-foreground">なかまの かず</p>
            </div>
            <p className="text-5xl font-bold text-primary">{ownedCharacters.length}</p>
            <p className="text-sm text-muted-foreground mt-1">たい</p>
          </div>

          {/* 今日の一言 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg md:col-span-2">
            <h3 className="text-lg font-bold mb-3">きょうの ひとこと</h3>
            <p className="text-muted-foreground">
              {ownedCharacters.length > 0
                ? `${ownedCharacters[0].name}: 「きょうも いっしょに がんばろうね！」`
                : 'キャラクターを ゲットすると メッセージが とどくよ！'}
            </p>
          </div>
        </div>

        {/* 機能ボタン */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/collection">
            <GameButton variant="secondary" className="w-full">
              ずかんを みる
            </GameButton>
          </Link>
          <Link href="/play/reading">
            <GameButton className="w-full">ゲームを プレイする</GameButton>
          </Link>
        </div>

        {/* Phase 3.2 完了メッセージ */}
        <div className="text-center text-sm text-muted-foreground">
          <p>マイルーム 基礎機能 (Phase 3.2)</p>
          <p className="text-xs mt-1">
            ※配置変更・一括エサやり機能は 今後のアップデートで追加予定
          </p>
        </div>
      </div>
    </main>
  )
}
