/**
 * 書き順データ
 * 小学1年生の漢字の書き順をSVGパスで定義
 */

export interface StrokeData {
  path: string // SVGパス
  duration: number // アニメーション時間（ミリ秒）
}

export interface KanjiStrokeData {
  id: string
  character: string
  strokes: StrokeData[]
  meaning: string
  reading: string
  grade: number
}

/**
 * 書き順データベース
 * 実際のプロジェクトでは、KanziVGなどの外部データソースを使用することを推奨
 * ここでは簡易版として主要な漢字のみ定義
 */
export const strokeDatabase: KanjiStrokeData[] = [
  // 一（いち）- 1画
  {
    id: 'stroke_001',
    character: '一',
    reading: 'いち',
    meaning: '数字の1',
    grade: 1,
    strokes: [
      { path: 'M 20 50 L 180 50', duration: 800 },
    ],
  },
  // 二（に）- 2画
  {
    id: 'stroke_002',
    character: '二',
    reading: 'に',
    meaning: '数字の2',
    grade: 1,
    strokes: [
      { path: 'M 20 30 L 180 30', duration: 800 },
      { path: 'M 20 70 L 180 70', duration: 800 },
    ],
  },
  // 三（さん）- 3画
  {
    id: 'stroke_003',
    character: '三',
    reading: 'さん',
    meaning: '数字の3',
    grade: 1,
    strokes: [
      { path: 'M 20 20 L 180 20', duration: 800 },
      { path: 'M 20 50 L 180 50', duration: 800 },
      { path: 'M 20 80 L 180 80', duration: 800 },
    ],
  },
  // 十（じゅう）- 2画
  {
    id: 'stroke_004',
    character: '十',
    reading: 'じゅう',
    meaning: '数字の10',
    grade: 1,
    strokes: [
      { path: 'M 100 20 L 100 80', duration: 800 },
      { path: 'M 40 50 L 160 50', duration: 800 },
    ],
  },
  // 口（くち）- 3画
  {
    id: 'stroke_005',
    character: '口',
    reading: 'くち',
    meaning: '口',
    grade: 1,
    strokes: [
      { path: 'M 60 30 L 60 80', duration: 600 },
      { path: 'M 60 80 L 140 80', duration: 600 },
      { path: 'M 140 80 L 140 30 L 60 30', duration: 800 },
    ],
  },
  // 日（ひ）- 4画
  {
    id: 'stroke_006',
    character: '日',
    reading: 'ひ',
    meaning: '太陽、日',
    grade: 1,
    strokes: [
      { path: 'M 50 20 L 50 90', duration: 700 },
      { path: 'M 50 20 L 150 20', duration: 600 },
      { path: 'M 150 20 L 150 90', duration: 700 },
      { path: 'M 50 90 L 150 90', duration: 600 },
    ],
  },
  // 月（つき）- 4画
  {
    id: 'stroke_007',
    character: '月',
    reading: 'つき',
    meaning: '月',
    grade: 1,
    strokes: [
      { path: 'M 50 20 L 50 90', duration: 700 },
      { path: 'M 50 20 L 150 20 Q 155 25 155 30 L 155 85 Q 155 90 150 90 L 50 90', duration: 1000 },
      { path: 'M 50 45 L 155 45', duration: 600 },
      { path: 'M 50 70 L 155 70', duration: 600 },
    ],
  },
  // 木（き）- 4画
  {
    id: 'stroke_008',
    character: '木',
    reading: 'き',
    meaning: '木',
    grade: 1,
    strokes: [
      { path: 'M 100 20 L 100 95', duration: 800 },
      { path: 'M 30 50 L 170 50', duration: 700 },
      { path: 'M 60 70 L 100 95', duration: 600 },
      { path: 'M 140 70 L 100 95', duration: 600 },
    ],
  },
  // 山（やま）- 3画
  {
    id: 'stroke_009',
    character: '山',
    reading: 'やま',
    meaning: '山',
    grade: 1,
    strokes: [
      { path: 'M 100 30 L 100 80', duration: 600 },
      { path: 'M 40 60 L 100 30 L 160 60', duration: 800 },
      { path: 'M 20 80 L 180 80', duration: 700 },
    ],
  },
  // 川（かわ）- 3画
  {
    id: 'stroke_010',
    character: '川',
    reading: 'かわ',
    meaning: '川',
    grade: 1,
    strokes: [
      { path: 'M 50 30 L 50 80', duration: 600 },
      { path: 'M 100 20 L 100 90', duration: 700 },
      { path: 'M 150 30 L 150 80', duration: 600 },
    ],
  },
  // 人（ひと）- 2画
  {
    id: 'stroke_011',
    character: '人',
    reading: 'ひと',
    meaning: '人',
    grade: 1,
    strokes: [
      { path: 'M 70 30 L 100 90', duration: 700 },
      { path: 'M 130 30 L 100 90', duration: 700 },
    ],
  },
  // 大（だい）- 3画
  {
    id: 'stroke_012',
    character: '大',
    reading: 'だい',
    meaning: '大きい',
    grade: 1,
    strokes: [
      { path: 'M 100 20 L 100 90', duration: 700 },
      { path: 'M 40 40 L 160 40', duration: 700 },
      { path: 'M 50 90 L 100 50', duration: 600 },
    ],
  },
]

/**
 * 書き順セット定義
 */
export interface StrokeSet {
  id: string
  name: string
  description: string
  kanjiIds: string[]
  difficulty: 'easy' | 'normal' | 'hard'
}

export const strokeSets: StrokeSet[] = [
  {
    id: 'set_001',
    name: 'かずの かんじ',
    description: 'かずを あらわす かんじだよ',
    kanjiIds: ['stroke_001', 'stroke_002', 'stroke_003', 'stroke_004'],
    difficulty: 'easy',
  },
  {
    id: 'set_002',
    name: 'しぜんの かんじ',
    description: 'しぜんに かんけいする かんじだよ',
    kanjiIds: ['stroke_006', 'stroke_007', 'stroke_008', 'stroke_009', 'stroke_010'],
    difficulty: 'normal',
  },
  {
    id: 'set_003',
    name: 'ひとの かんじ',
    description: 'ひとに かんけいする かんじだよ',
    kanjiIds: ['stroke_005', 'stroke_011', 'stroke_012'],
    difficulty: 'normal',
  },
]

/**
 * ヘルパー関数
 */
export function getStrokeSetById(id: string): StrokeSet | undefined {
  return strokeSets.find((set) => set.id === id)
}

export function getKanjiStrokeById(id: string): KanjiStrokeData | undefined {
  return strokeDatabase.find((kanji) => kanji.id === id)
}

export function getKanjisBySet(setId: string): KanjiStrokeData[] {
  const set = getStrokeSetById(setId)
  if (!set) return []

  return set.kanjiIds
    .map((id) => getKanjiStrokeById(id))
    .filter((kanji): kanji is KanjiStrokeData => kanji !== undefined)
}
