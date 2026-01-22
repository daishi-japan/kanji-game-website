'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Heart, Star, Zap, Lock, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCharacterById, getEvolutionChain, rarityConfig } from '@/lib/data/character-data'
import { GameButton } from '@/components/game/GameButton'

export default function CharacterDetailPage({
  params,
}: {
  params: Promise<{ characterId: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()

  const character = getCharacterById(resolvedParams.characterId)
  const evolutionChain = character ? getEvolutionChain(character.id) : []

  // デモ用：実際はSupabaseから取得
  const [isOwned] = useState(
    ['char_001', 'char_002', 'char_004', 'char_006', 'char_008'].includes(
      resolvedParams.characterId
    )
  )
  const [level] = useState(10)
  const [friendship] = useState(50)

  if (!character) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-purple-100 to-background p-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-2xl font-bold">キャラクターが みつかりません</p>
          <Link href="/collection">
            <GameButton>ずかんに もどる</GameButton>
          </Link>
        </div>
      </main>
    )
  }

  const rarityStyle = rarityConfig[character.rarity]
  const canEvolve =
    isOwned &&
    character.evolutionTo &&
    character.evolutionRequirements &&
    level >= character.evolutionRequirements.level &&
    friendship >= character.evolutionRequirements.friendship

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-100 to-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link
            href="/collection"
            className="p-2 bg-white rounded-full shadow-md hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">キャラクター しょうさい</h1>
          </div>
        </div>

        {/* キャラクターカード */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 左側：画像とレアリティ */}
            <div className="space-y-6">
              {/* キャラクター画像 */}
              <div className="relative aspect-square bg-gradient-to-br from-white to-gray-100 rounded-2xl p-8 shadow-inner">
                {isOwned ? (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <span className="text-[200px]">{character.emoji}</span>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-24 h-24 text-gray-400" />
                  </div>
                )}
              </div>

              {/* レアリティ */}
              <div
                className="p-4 rounded-xl text-center font-bold text-lg"
                style={{
                  backgroundColor: rarityStyle.bgColor,
                  color: rarityStyle.color,
                }}
              >
                {rarityStyle.label}
              </div>
            </div>

            {/* 右側：情報 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-2">
                  {isOwned ? character.name : '？？？'}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {isOwned ? character.description : 'このキャラクターは まだ ゲットしていません'}
                </p>
              </div>

              {isOwned && (
                <>
                  {/* ステータス */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">ステータス</h3>

                    <div className="space-y-3">
                      {/* かわいさ */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="w-5 h-5 text-pink-500" />
                          <span className="text-sm font-bold">かわいさ</span>
                          <span className="ml-auto text-lg font-bold text-pink-500">
                            {character.baseStats.cuteness}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-pink-500"
                            style={{ width: `${character.baseStats.cuteness}%` }}
                          />
                        </div>
                      </div>

                      {/* かしこさ */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Star className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-bold">かしこさ</span>
                          <span className="ml-auto text-lg font-bold text-blue-500">
                            {character.baseStats.wisdom}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${character.baseStats.wisdom}%` }}
                          />
                        </div>
                      </div>

                      {/* げんき */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-bold">げんき</span>
                          <span className="ml-auto text-lg font-bold text-green-500">
                            {character.baseStats.energy}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${character.baseStats.energy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* レベル・なつき度 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <p className="text-sm text-blue-600 mb-1">レベル</p>
                      <p className="text-3xl font-bold text-blue-600">Lv.{level}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
                      <p className="text-sm text-pink-600 mb-1">なつきど</p>
                      <p className="text-3xl font-bold text-pink-600">{friendship}</p>
                    </div>
                  </div>

                  {/* 好きなエサ */}
                  {character.favoriteFood && (
                    <div>
                      <h3 className="text-xl font-bold mb-2">すきな エサ</h3>
                      <div className="flex flex-wrap gap-2">
                        {character.favoriteFood.map((food, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold"
                          >
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {!isOwned && character.unlockCondition && (
                <div className="p-4 bg-gray-100 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">かいほうじょうけん</p>
                  <p className="font-bold">{character.unlockCondition}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 進化チェーン */}
        {evolutionChain.length > 1 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold">しんか</h3>
            </div>

            <div className="flex items-center justify-center gap-4 overflow-x-auto">
              {evolutionChain.map((evo, index) => (
                <div key={evo.id} className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-xl text-center cursor-pointer transition-all ${
                      evo.id === character.id
                        ? 'ring-4 ring-primary bg-white scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => router.push(`/collection/${evo.id}`)}
                  >
                    <span className="text-6xl">{evo.emoji}</span>
                    <p className="text-sm font-bold mt-2">{evo.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ステージ {evo.evolutionStage}
                    </p>
                  </div>

                  {index < evolutionChain.length - 1 && (
                    <div className="text-2xl font-bold text-muted-foreground">→</div>
                  )}
                </div>
              ))}
            </div>

            {/* 進化ボタン */}
            {canEvolve && (
              <div className="mt-6 text-center">
                <GameButton size="lg" onClick={() => alert('進化機能は Phase 3.2 で実装予定')}>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  しんか する！
                </GameButton>
              </div>
            )}

            {isOwned &&
              character.evolutionTo &&
              character.evolutionRequirements &&
              !canEvolve && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                  <p className="text-sm text-yellow-700 font-bold text-center">
                    しんかじょうけん: レベル {character.evolutionRequirements.level} ・
                    なつきど {character.evolutionRequirements.friendship}
                  </p>
                </div>
              )}
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-4">
          <Link href="/collection" className="flex-1">
            <GameButton variant="secondary" className="w-full">
              ずかんに もどる
            </GameButton>
          </Link>
          {isOwned && (
            <GameButton
              className="flex-1"
              onClick={() => alert('エサやり機能は Phase 3.2 で実装予定')}
            >
              エサを あげる
            </GameButton>
          )}
        </div>
      </div>
    </main>
  )
}
