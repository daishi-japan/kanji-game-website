/**
 * 報酬・ドロップマスタデータ
 * ゲームクリア時の報酬とキャラクタードロップの定義
 */

import type { CharacterData } from './character-data'
import { characterDatabase } from './character-data'

export type RewardType = 'character' | 'food' | 'coin' | 'experience'

export interface RewardItem {
  type: RewardType
  id: string // character_id, food_id, etc.
  name: string
  emoji: string
  amount: number
  rarity?: string
}

export interface GameResult {
  mode: 'reading' | 'writing'
  stageId: string
  score: number
  maxScore: number
  rank: 'S' | 'A' | 'B' | 'C' | 'D'
  cleared: boolean
  perfectCount?: number // 完璧な回答数
  combo?: number // 最大コンボ
  timeBonus?: number // タイムボーナス
}

/**
 * エサマスタデータ
 */
export interface FoodData {
  id: string
  name: string
  emoji: string
  experience: number // 獲得経験値
  friendship: number // なつき度上昇
  rarity: 'common' | 'uncommon' | 'rare'
}

export const foodDatabase: FoodData[] = [
  // Common
  { id: 'food_001', name: 'りんご', emoji: '🍎', experience: 10, friendship: 5, rarity: 'common' },
  { id: 'food_002', name: 'おにぎり', emoji: '🍙', experience: 15, friendship: 5, rarity: 'common' },
  { id: 'food_003', name: 'さかな', emoji: '🐟', experience: 12, friendship: 5, rarity: 'common' },
  { id: 'food_004', name: 'にんじん', emoji: '🥕', experience: 8, friendship: 3, rarity: 'common' },
  { id: 'food_005', name: 'ミルク', emoji: '🥛', experience: 10, friendship: 5, rarity: 'common' },

  // Uncommon
  { id: 'food_006', name: 'おだんご', emoji: '🍡', experience: 25, friendship: 10, rarity: 'uncommon' },
  { id: 'food_007', name: 'ケーキ', emoji: '🍰', experience: 30, friendship: 12, rarity: 'uncommon' },
  { id: 'food_008', name: 'カレー', emoji: '🍛', experience: 28, friendship: 10, rarity: 'uncommon' },
  { id: 'food_009', name: 'ほね', emoji: '🦴', experience: 20, friendship: 15, rarity: 'uncommon' },

  // Rare
  { id: 'food_010', name: 'はちみつ', emoji: '🍯', experience: 50, friendship: 20, rarity: 'rare' },
  { id: 'food_011', name: 'にじいろケーキ', emoji: '🎂', experience: 60, friendship: 25, rarity: 'rare' },
  { id: 'food_012', name: 'ほしがたクッキー', emoji: '⭐', experience: 55, friendship: 22, rarity: 'rare' },
]

/**
 * ドロップテーブル
 * ランクとモードに応じたドロップ率
 */
export interface DropTable {
  rank: 'S' | 'A' | 'B' | 'C' | 'D'
  characterDropRate: number // キャラクタードロップ確率（%）
  foodDropRate: number // エサドロップ確率（%）
  coinBonus: number // コインボーナス倍率
  experienceBonus: number // 経験値ボーナス倍率
}

export const dropTables: Record<string, DropTable> = {
  S: {
    rank: 'S',
    characterDropRate: 80,
    foodDropRate: 100,
    coinBonus: 2.0,
    experienceBonus: 2.0,
  },
  A: {
    rank: 'A',
    characterDropRate: 60,
    foodDropRate: 90,
    coinBonus: 1.5,
    experienceBonus: 1.5,
  },
  B: {
    rank: 'B',
    characterDropRate: 40,
    foodDropRate: 80,
    coinBonus: 1.2,
    experienceBonus: 1.2,
  },
  C: {
    rank: 'C',
    characterDropRate: 20,
    foodDropRate: 60,
    coinBonus: 1.0,
    experienceBonus: 1.0,
  },
  D: {
    rank: 'D',
    characterDropRate: 10,
    foodDropRate: 40,
    coinBonus: 0.8,
    experienceBonus: 0.8,
  },
}

/**
 * 報酬計算ロジック（キャラクター・エサドロップ含む）
 */
export function calculateRewards(result: GameResult): RewardItem[] {
  const rewards: RewardItem[] = []
  const dropTable = dropTables[result.rank]

  // 基本コイン
  const baseCoins = Math.floor(result.score / 10)
  const coins = Math.floor(baseCoins * dropTable.coinBonus)
  rewards.push({
    type: 'coin',
    id: 'coin',
    name: 'コイン',
    emoji: '🪙',
    amount: coins,
  })

  // 基本経験値
  const baseExp = result.cleared ? 100 : 50
  const experience = Math.floor(baseExp * dropTable.experienceBonus)
  rewards.push({
    type: 'experience',
    id: 'exp',
    name: 'けいけんち',
    emoji: '⭐',
    amount: experience,
  })

  // キャラクタードロップ抽選
  const characterDropped = Math.random() * 100 < dropTable.characterDropRate
  if (characterDropped && result.cleared) {
    const droppedCharacter = rollCharacter(result.rank)
    if (droppedCharacter) {
      rewards.push({
        type: 'character',
        id: droppedCharacter.id,
        name: droppedCharacter.name,
        emoji: droppedCharacter.emoji,
        amount: 1,
        rarity: droppedCharacter.rarity,
      })
    }
  }

  // エサドロップ抽選
  const foodDropped = Math.random() * 100 < dropTable.foodDropRate
  if (foodDropped) {
    const droppedFood = rollFood(result.rank)
    const foodAmount = result.rank === 'S' ? 3 : result.rank === 'A' ? 2 : 1
    rewards.push({
      type: 'food',
      id: droppedFood.id,
      name: droppedFood.name,
      emoji: droppedFood.emoji,
      amount: foodAmount,
      rarity: droppedFood.rarity,
    })
  }

  return rewards
}

/**
 * キャラクター抽選
 * ランクが高いほど、レアなキャラが出やすい
 */
function rollCharacter(rank: 'S' | 'A' | 'B' | 'C' | 'D'): CharacterData | null {
  // ランクに応じたレアリティ重み付け
  const rarityWeights: Record<string, Record<string, number>> = {
    S: { legendary: 5, epic: 15, rare: 30, uncommon: 30, common: 20 },
    A: { legendary: 2, epic: 10, rare: 25, uncommon: 33, common: 30 },
    B: { legendary: 1, epic: 5, rare: 19, uncommon: 35, common: 40 },
    C: { legendary: 0, epic: 2, rare: 13, uncommon: 35, common: 50 },
    D: { legendary: 0, epic: 0, rare: 10, uncommon: 30, common: 60 },
  }

  const weights = rarityWeights[rank]

  // レアリティ抽選
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)
  let random = Math.random() * totalWeight
  let selectedRarity = 'common'

  for (const [rarity, weight] of Object.entries(weights)) {
    random -= weight
    if (random <= 0) {
      selectedRarity = rarity
      break
    }
  }

  // 該当レアリティのキャラクターからランダム選択
  const candidates = characterDatabase.filter((char) => char.rarity === selectedRarity)
  if (candidates.length === 0) return null

  const randomIndex = Math.floor(Math.random() * candidates.length)
  return candidates[randomIndex]
}

/**
 * エサ抽選
 * ランクが高いほど、良いエサが出やすい
 */
function rollFood(rank: 'S' | 'A' | 'B' | 'C' | 'D'): FoodData {
  const rarityWeights: Record<string, Record<string, number>> = {
    S: { rare: 40, uncommon: 40, common: 20 },
    A: { rare: 25, uncommon: 45, common: 30 },
    B: { rare: 15, uncommon: 45, common: 40 },
    C: { rare: 5, uncommon: 35, common: 60 },
    D: { rare: 0, uncommon: 30, common: 70 },
  }

  const weights = rarityWeights[rank]

  // レアリティ抽選
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0)
  let random = Math.random() * totalWeight
  let selectedRarity: 'common' | 'uncommon' | 'rare' = 'common'

  for (const [rarity, weight] of Object.entries(weights)) {
    random -= weight
    if (random <= 0) {
      selectedRarity = rarity as 'common' | 'uncommon' | 'rare'
      break
    }
  }

  // 該当レアリティのエサからランダム選択
  const candidates = foodDatabase.filter((food) => food.rarity === selectedRarity)
  const randomIndex = Math.floor(Math.random() * candidates.length)
  return candidates[randomIndex]
}

/**
 * ヘルパー関数
 */
export function getFoodById(id: string): FoodData | undefined {
  return foodDatabase.find((food) => food.id === id)
}
