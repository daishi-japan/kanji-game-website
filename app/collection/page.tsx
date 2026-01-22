'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, Award } from 'lucide-react'
import { CharacterGrid } from '@/components/collection/CharacterGrid'
import { characterDatabase, calculateCollectionRate } from '@/lib/data/character-data'
import type { CharacterData } from '@/lib/data/character-data'

export default function CollectionPage() {
  const router = useRouter()

  // デモ用：実際はSupabaseから取得
  // 開発用に最初の5体を所持済みとする
  const [ownedCharacterIds] = useState<string[]>([
    'char_001',
    'char_002',
    'char_004',
    'char_006',
    'char_008',
  ])

  const collectionRate = calculateCollectionRate(ownedCharacterIds)

  const handleCharacterClick = (character: CharacterData) => {
    // キャラクター詳細画面へ遷移
    router.push(`/collection/${character.id}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-background p-8">
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
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold">キャラクター ずかん</h1>
            </div>
            <p className="text-muted-foreground">
              あつめた キャラクターを みてみよう！
            </p>
          </div>
        </div>

        {/* 収集率サマリー */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 収集率 */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-6 h-6 text-yellow-500" />
                <p className="text-sm text-muted-foreground">しゅうしゅうりつ</p>
              </div>
              <p className="text-5xl font-bold text-primary">{collectionRate}%</p>
              <p className="text-sm text-muted-foreground mt-1">
                {ownedCharacterIds.length} / {characterDatabase.length} たい
              </p>
            </div>

            {/* 所持数 */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">もっている</p>
              <p className="text-5xl font-bold text-green-500">
                {ownedCharacterIds.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">たい</p>
            </div>

            {/* 未所持数 */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">まだ みつけてない</p>
              <p className="text-5xl font-bold text-gray-400">
                {characterDatabase.length - ownedCharacterIds.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">たい</p>
            </div>
          </div>

          {/* プログレスバー */}
          <div className="mt-6">
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
          </div>

          {/* メッセージ */}
          <div className="mt-4 text-center">
            {collectionRate === 100 ? (
              <p className="text-lg font-bold text-primary">
                🎉 おめでとう！ぜんぶ あつめたよ！
              </p>
            ) : collectionRate >= 75 ? (
              <p className="text-lg font-bold text-primary">
                あと すこし！がんばって！
              </p>
            ) : collectionRate >= 50 ? (
              <p className="text-lg font-bold text-primary">
                はんぶん いじょう あつめたね！
              </p>
            ) : collectionRate >= 25 ? (
              <p className="text-lg font-bold text-primary">
                いいちょうし！もっと あつめよう！
              </p>
            ) : (
              <p className="text-lg font-bold text-primary">
                ゲームを プレイして キャラクターを ゲットしよう！
              </p>
            )}
          </div>
        </div>

        {/* キャラクターグリッド */}
        <CharacterGrid
          characters={characterDatabase}
          ownedCharacterIds={ownedCharacterIds}
          onCharacterClick={handleCharacterClick}
          showStats={false}
        />
      </div>
    </main>
  )
}
