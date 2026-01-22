'use client'

import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import type { CharacterData } from '@/lib/data/character-data'
import { rarityConfig } from '@/lib/data/character-data'

interface CharacterCardProps {
  character: CharacterData
  isOwned: boolean
  onClick?: () => void
  showStats?: boolean
}

/**
 * キャラクターカードコンポーネント
 * 図鑑で使用するキャラクター表示カード
 */
export function CharacterCard({
  character,
  isOwned,
  onClick,
  showStats = false,
}: CharacterCardProps) {
  const rarityStyle = rarityConfig[character.rarity]

  return (
    <motion.div
      className={`relative rounded-2xl shadow-lg overflow-hidden cursor-pointer ${
        isOwned ? 'bg-white' : 'bg-gray-200'
      }`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* レアリティバッジ */}
      <div
        className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold z-10"
        style={{
          backgroundColor: rarityStyle.bgColor,
          color: rarityStyle.color,
        }}
      >
        {rarityStyle.label}
      </div>

      {/* 伝説キャラのキラキラエフェクト */}
      {isOwned && (character.rarity === 'legendary' || character.rarity === 'epic') && (
        <div className="absolute top-2 left-2 z-10">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </motion.div>
        </div>
      )}

      {/* カード本体 */}
      <div className="p-6">
        {/* キャラクター画像エリア */}
        <div className="relative w-full aspect-square mb-4">
          {isOwned ? (
            // 所持している場合
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            >
              <span className="text-8xl">{character.emoji}</span>
            </motion.div>
          ) : (
            // 未所持の場合（シルエット）
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300 rounded-xl">
              <Lock className="w-12 h-12 text-gray-500" />
              <span className="text-6xl filter blur-sm opacity-30">
                {character.emoji}
              </span>
            </div>
          )}
        </div>

        {/* キャラクター情報 */}
        <div className="space-y-2">
          <h3
            className={`text-lg font-bold text-center ${
              isOwned ? 'text-foreground' : 'text-gray-500'
            }`}
          >
            {isOwned ? character.name : '？？？'}
          </h3>

          {isOwned && (
            <>
              <p className="text-sm text-muted-foreground text-center line-clamp-2">
                {character.description}
              </p>

              {/* ステータス表示（オプション） */}
              {showStats && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">かわいさ</p>
                    <p className="text-sm font-bold text-pink-500">
                      {character.baseStats.cuteness}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">かしこさ</p>
                    <p className="text-sm font-bold text-blue-500">
                      {character.baseStats.wisdom}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">げんき</p>
                    <p className="text-sm font-bold text-green-500">
                      {character.baseStats.energy}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {!isOwned && (
            <p className="text-xs text-gray-500 text-center">
              {character.unlockCondition || 'ゲームを プレイして ゲット！'}
            </p>
          )}
        </div>
      </div>

      {/* ホバーエフェクト */}
      {isOwned && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${rarityStyle.color}20 0%, transparent 50%)`,
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}
    </motion.div>
  )
}
