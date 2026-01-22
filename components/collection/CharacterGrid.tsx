'use client'

import { useState } from 'react'
import { CharacterCard } from './CharacterCard'
import type { CharacterData, CharacterRarity, CharacterType } from '@/lib/data/character-data'

interface CharacterGridProps {
  characters: CharacterData[]
  ownedCharacterIds: string[]
  onCharacterClick?: (character: CharacterData) => void
  showStats?: boolean
}

type FilterType = 'all' | CharacterRarity | CharacterType

/**
 * キャラクターグリッドコンポーネント
 * キャラクター一覧をグリッド表示
 */
export function CharacterGrid({
  characters,
  ownedCharacterIds,
  onCharacterClick,
  showStats = false,
}: CharacterGridProps) {
  const [filter, setFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState<'id' | 'rarity' | 'owned'>('id')

  // フィルタリング
  const filteredCharacters = characters.filter((char) => {
    if (filter === 'all') return true
    return char.rarity === filter || char.type === filter
  })

  // ソート
  const sortedCharacters = [...filteredCharacters].sort((a, b) => {
    if (sortBy === 'owned') {
      const aOwned = ownedCharacterIds.includes(a.id)
      const bOwned = ownedCharacterIds.includes(b.id)
      if (aOwned && !bOwned) return -1
      if (!aOwned && bOwned) return 1
    }

    if (sortBy === 'rarity') {
      const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 }
      return rarityOrder[b.rarity] - rarityOrder[a.rarity]
    }

    return a.id.localeCompare(b.id)
  })

  return (
    <div className="space-y-6">
      {/* フィルター・ソートコントロール */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:opacity-80'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('common')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'common'
                ? 'bg-gray-400 text-white'
                : 'bg-muted text-muted-foreground hover:opacity-80'
            }`}
          >
            ふつう
          </button>
          <button
            onClick={() => setFilter('uncommon')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'uncommon'
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground hover:opacity-80'
            }`}
          >
            めずらしい
          </button>
          <button
            onClick={() => setFilter('rare')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'rare'
                ? 'bg-blue-500 text-white'
                : 'bg-muted text-muted-foreground hover:opacity-80'
            }`}
          >
            レア
          </button>
          <button
            onClick={() => setFilter('epic')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'epic'
                ? 'bg-purple-500 text-white'
                : 'bg-muted text-muted-foreground hover:opacity-80'
            }`}
          >
            エピック
          </button>
          <button
            onClick={() => setFilter('legendary')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === 'legendary'
                ? 'bg-yellow-500 text-white'
                : 'bg-muted text-muted-foreground hover:opacity-80'
            }`}
          >
            でんせつ
          </button>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-full text-sm font-bold bg-muted border-none outline-none cursor-pointer"
          >
            <option value="id">ばんごう順</option>
            <option value="rarity">レアリティ順</option>
            <option value="owned">しょじ順</option>
          </select>
        </div>
      </div>

      {/* キャラクター数表示 */}
      <div className="text-center">
        <p className="text-lg font-bold text-muted-foreground">
          {sortedCharacters.length} たい みつかったよ！
        </p>
      </div>

      {/* グリッド */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {sortedCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            isOwned={ownedCharacterIds.includes(character.id)}
            onClick={() => onCharacterClick?.(character)}
            showStats={showStats}
          />
        ))}
      </div>

      {/* 空状態 */}
      {sortedCharacters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-2xl font-bold text-muted-foreground">
            キャラクターが みつかりません
          </p>
          <p className="text-muted-foreground mt-2">
            べつの フィルターを ためしてね！
          </p>
        </div>
      )}
    </div>
  )
}
