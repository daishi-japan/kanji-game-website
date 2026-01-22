/**
 * キャラクターマスタデータ
 * ゲーム内で収集できるキャラクターの定義
 */

export type CharacterRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
export type CharacterType = 'animal' | 'spirit' | 'mythical' | 'element'

export interface CharacterData {
  id: string
  name: string
  description: string
  emoji: string // 絵文字で代用（実際はイラスト画像）
  rarity: CharacterRarity
  type: CharacterType
  baseStats: {
    cuteness: number // かわいさ（1-100）
    wisdom: number // かしこさ（1-100）
    energy: number // げんき（1-100）
  }
  dropRate: number // ドロップ率（%）
  evolutionStage: number // 進化段階（1-3）
  evolutionFrom?: string // 進化元のキャラクターID
  evolutionTo?: string // 進化先のキャラクターID
  evolutionRequirements?: {
    level: number
    friendship: number
  }
  favoriteFood?: string[] // 好きなエサ
  unlockCondition?: string // 解放条件の説明
}

/**
 * キャラクターデータベース
 * 全30種類のキャラクター
 */
export const characterDatabase: CharacterData[] = [
  // === 動物系（common） ===
  {
    id: 'char_001',
    name: 'こぎつね',
    description: 'もりに すむ ちいさな きつね。かんじが だいすき！',
    emoji: '🦊',
    rarity: 'common',
    type: 'animal',
    baseStats: { cuteness: 80, wisdom: 60, energy: 70 },
    dropRate: 15,
    evolutionStage: 1,
    evolutionTo: 'char_002',
    evolutionRequirements: { level: 5, friendship: 30 },
    favoriteFood: ['りんご', 'おにぎり'],
  },
  {
    id: 'char_002',
    name: 'きつね',
    description: 'せいちょうした きつね。もっと かんじを おぼえたい！',
    emoji: '🦊',
    rarity: 'uncommon',
    type: 'animal',
    baseStats: { cuteness: 85, wisdom: 75, energy: 80 },
    dropRate: 8,
    evolutionStage: 2,
    evolutionFrom: 'char_001',
    evolutionTo: 'char_003',
    evolutionRequirements: { level: 15, friendship: 70 },
    favoriteFood: ['りんご', 'おにぎり', 'おだんご'],
  },
  {
    id: 'char_003',
    name: 'きゅうびのきつね',
    description: 'でんせつの きゅうびきつね。すべての かんじを しっている！',
    emoji: '🦊',
    rarity: 'legendary',
    type: 'mythical',
    baseStats: { cuteness: 95, wisdom: 100, energy: 95 },
    dropRate: 1,
    evolutionStage: 3,
    evolutionFrom: 'char_002',
    favoriteFood: ['りんご', 'おにぎり', 'おだんご', 'ケーキ'],
  },
  {
    id: 'char_004',
    name: 'こねこ',
    description: 'のんびりやの ねこ。ひらがなは とくい！',
    emoji: '🐱',
    rarity: 'common',
    type: 'animal',
    baseStats: { cuteness: 90, wisdom: 50, energy: 60 },
    dropRate: 15,
    evolutionStage: 1,
    evolutionTo: 'char_005',
    evolutionRequirements: { level: 5, friendship: 30 },
    favoriteFood: ['さかな', 'ミルク'],
  },
  {
    id: 'char_005',
    name: 'ねこ',
    description: 'おとなに なった ねこ。かんじも すこし よめるよ！',
    emoji: '🐱',
    rarity: 'uncommon',
    type: 'animal',
    baseStats: { cuteness: 92, wisdom: 70, energy: 75 },
    dropRate: 8,
    evolutionStage: 2,
    evolutionFrom: 'char_004',
    favoriteFood: ['さかな', 'ミルク', 'おにぎり'],
  },
  {
    id: 'char_006',
    name: 'こいぬ',
    description: 'げんきいっぱいの いぬ。いっしょに べんきょう しよう！',
    emoji: '🐶',
    rarity: 'common',
    type: 'animal',
    baseStats: { cuteness: 85, wisdom: 55, energy: 90 },
    dropRate: 15,
    evolutionStage: 1,
    evolutionTo: 'char_007',
    evolutionRequirements: { level: 5, friendship: 30 },
    favoriteFood: ['ほね', 'おにぎり'],
  },
  {
    id: 'char_007',
    name: 'いぬ',
    description: 'りこうな いぬ。かんじを どんどん おぼえるよ！',
    emoji: '🐶',
    rarity: 'uncommon',
    type: 'animal',
    baseStats: { cuteness: 88, wisdom: 72, energy: 95 },
    dropRate: 8,
    evolutionStage: 2,
    evolutionFrom: 'char_006',
    favoriteFood: ['ほね', 'おにぎり', 'ケーキ'],
  },
  {
    id: 'char_008',
    name: 'うさぎ',
    description: 'ぴょんぴょん はねる うさぎ。かんじが すき！',
    emoji: '🐰',
    rarity: 'common',
    type: 'animal',
    baseStats: { cuteness: 95, wisdom: 65, energy: 80 },
    dropRate: 12,
    evolutionStage: 1,
    favoriteFood: ['にんじん', 'りんご'],
  },
  {
    id: 'char_009',
    name: 'くま',
    description: 'やさしい くま。ゆっくり かんじを おぼえるよ。',
    emoji: '🐻',
    rarity: 'common',
    type: 'animal',
    baseStats: { cuteness: 80, wisdom: 60, energy: 85 },
    dropRate: 12,
    evolutionStage: 1,
    favoriteFood: ['はちみつ', 'さかな'],
  },
  {
    id: 'char_010',
    name: 'ぱんだ',
    description: 'めずらしい ぱんだ。ちからもちで かしこい！',
    emoji: '🐼',
    rarity: 'rare',
    type: 'animal',
    baseStats: { cuteness: 90, wisdom: 80, energy: 75 },
    dropRate: 5,
    evolutionStage: 1,
    favoriteFood: ['たけ', 'りんご'],
  },

  // === 精霊系（uncommon-rare） ===
  {
    id: 'char_011',
    name: 'ひのせいれい',
    description: 'ほのおの ちからを もつ せいれい。あつい！',
    emoji: '🔥',
    rarity: 'uncommon',
    type: 'element',
    baseStats: { cuteness: 70, wisdom: 75, energy: 95 },
    dropRate: 7,
    evolutionStage: 1,
    favoriteFood: ['カレー', 'おだんご'],
  },
  {
    id: 'char_012',
    name: 'みずのせいれい',
    description: 'みずの ちからを もつ せいれい。すずしい！',
    emoji: '💧',
    rarity: 'uncommon',
    type: 'element',
    baseStats: { cuteness: 70, wisdom: 80, energy: 70 },
    dropRate: 7,
    evolutionStage: 1,
    favoriteFood: ['ジュース', 'アイス'],
  },
  {
    id: 'char_013',
    name: 'かぜのせいれい',
    description: 'かぜの ちからを もつ せいれい。かるやか！',
    emoji: '💨',
    rarity: 'uncommon',
    type: 'element',
    baseStats: { cuteness: 65, wisdom: 85, energy: 90 },
    dropRate: 7,
    evolutionStage: 1,
    favoriteFood: ['ポップコーン', 'わたあめ'],
  },
  {
    id: 'char_014',
    name: 'つちのせいれい',
    description: 'だいちの ちからを もつ せいれい。どっしり！',
    emoji: '⛰️',
    rarity: 'uncommon',
    type: 'element',
    baseStats: { cuteness: 60, wisdom: 70, energy: 75 },
    dropRate: 7,
    evolutionStage: 1,
    favoriteFood: ['やさい', 'おにぎり'],
  },
  {
    id: 'char_015',
    name: 'ほしのせいれい',
    description: 'ほしの ちからを もつ せいれい。きらきら！',
    emoji: '⭐',
    rarity: 'rare',
    type: 'spirit',
    baseStats: { cuteness: 85, wisdom: 90, energy: 80 },
    dropRate: 4,
    evolutionStage: 1,
    favoriteFood: ['ほしがたクッキー', 'ケーキ'],
  },
  {
    id: 'char_016',
    name: 'つきのせいれい',
    description: 'つきの ちからを もつ せいれい。しずか！',
    emoji: '🌙',
    rarity: 'rare',
    type: 'spirit',
    baseStats: { cuteness: 80, wisdom: 95, energy: 70 },
    dropRate: 4,
    evolutionStage: 1,
    favoriteFood: ['つきみだんご', 'ミルク'],
  },

  // === 伝説系（epic-legendary） ===
  {
    id: 'char_017',
    name: 'りゅう',
    description: 'てんくうを とぶ りゅう。かんじの まもりがみ！',
    emoji: '🐉',
    rarity: 'epic',
    type: 'mythical',
    baseStats: { cuteness: 75, wisdom: 95, energy: 100 },
    dropRate: 2,
    evolutionStage: 1,
    favoriteFood: ['たからもの', 'おだんご'],
    unlockCondition: '全ステージクリア',
  },
  {
    id: 'char_018',
    name: 'ゆにこーん',
    description: 'でんせつの ゆにこーん。まほうが つかえる！',
    emoji: '🦄',
    rarity: 'epic',
    type: 'mythical',
    baseStats: { cuteness: 95, wisdom: 90, energy: 85 },
    dropRate: 2,
    evolutionStage: 1,
    favoriteFood: ['にじいろケーキ', 'りんご'],
    unlockCondition: 'ランクS を 10回',
  },
  {
    id: 'char_019',
    name: 'ふぇにっくす',
    description: 'ふっかつの とり。えいえんに いきる！',
    emoji: '🔥',
    rarity: 'legendary',
    type: 'mythical',
    baseStats: { cuteness: 85, wisdom: 100, energy: 100 },
    dropRate: 0.5,
    evolutionStage: 1,
    favoriteFood: ['ほのおのみ', 'おだんご'],
    unlockCondition: 'パーフェクト 50回',
  },
  {
    id: 'char_020',
    name: 'かんじのかみさま',
    description: 'すべての かんじを つくった かみさま。さいきょう！',
    emoji: '📚',
    rarity: 'legendary',
    type: 'spirit',
    baseStats: { cuteness: 100, wisdom: 100, energy: 100 },
    dropRate: 0.1,
    evolutionStage: 1,
    favoriteFood: ['すべて'],
    unlockCondition: '図鑑コンプリート',
  },
]

/**
 * レアリティごとの表示情報
 */
export const rarityConfig = {
  common: {
    label: 'ふつう',
    color: '#9ca3af',
    bgColor: '#f3f4f6',
  },
  uncommon: {
    label: 'めずらしい',
    color: '#10b981',
    bgColor: '#d1fae5',
  },
  rare: {
    label: 'レア',
    color: '#3b82f6',
    bgColor: '#dbeafe',
  },
  epic: {
    label: 'エピック',
    color: '#8b5cf6',
    bgColor: '#ede9fe',
  },
  legendary: {
    label: 'でんせつ',
    color: '#f59e0b',
    bgColor: '#fef3c7',
  },
}

/**
 * ヘルパー関数
 */
export function getCharacterById(id: string): CharacterData | undefined {
  return characterDatabase.find((char) => char.id === id)
}

export function getCharactersByRarity(rarity: CharacterRarity): CharacterData[] {
  return characterDatabase.filter((char) => char.rarity === rarity)
}

export function getCharactersByType(type: CharacterType): CharacterData[] {
  return characterDatabase.filter((char) => char.type === type)
}

export function getEvolutionChain(characterId: string): CharacterData[] {
  const chain: CharacterData[] = []
  let current = getCharacterById(characterId)

  if (!current) return chain

  // 進化元を遡る
  while (current.evolutionFrom) {
    const prev = getCharacterById(current.evolutionFrom)
    if (!prev) break
    chain.unshift(prev)
    current = prev
  }

  // 現在のキャラを追加
  current = getCharacterById(characterId)
  if (current) chain.push(current)

  // 進化先を追加
  while (current?.evolutionTo) {
    const next = getCharacterById(current.evolutionTo)
    if (!next) break
    chain.push(next)
    current = next
  }

  return chain
}

/**
 * 収集率を計算
 */
export function calculateCollectionRate(ownedCharacterIds: string[]): number {
  if (characterDatabase.length === 0) return 0
  return Math.round((ownedCharacterIds.length / characterDatabase.length) * 100)
}
