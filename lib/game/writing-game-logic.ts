/**
 * 書き攻略モード ゲームロジック
 * 書き順練習のゲーム状態管理とスコア計算
 */

import type { KanjiStrokeData } from '@/lib/data/stroke-data'

export interface WritingGameState {
  currentKanjiIndex: number
  score: number
  isPlaying: boolean
  isCleared: boolean
  currentKanji: KanjiStrokeData | null
  mode: 'demo' | 'trace' | 'self-report' // デモ・なぞり・自己申告
  currentStrokeCount: number
  perfectStrokes: number // 完璧に書けた漢字の数
}

export interface WritingGameConfig {
  scorePerKanji: number // 1漢字あたりのスコア
  perfectBonus: number // 完璧ボーナス
}

export const defaultWritingConfig: WritingGameConfig = {
  scorePerKanji: 100,
  perfectBonus: 50,
}

/**
 * 初期状態を作成
 */
export function createInitialWritingState(
  kanjis: KanjiStrokeData[]
): WritingGameState {
  return {
    currentKanjiIndex: 0,
    score: 0,
    isPlaying: false,
    isCleared: false,
    currentKanji: kanjis.length > 0 ? kanjis[0] : null,
    mode: 'demo',
    currentStrokeCount: 0,
    perfectStrokes: 0,
  }
}

/**
 * ゲーム開始
 */
export function startWritingGame(
  state: WritingGameState
): WritingGameState {
  return {
    ...state,
    isPlaying: true,
    mode: 'demo',
  }
}

/**
 * モード切り替え
 */
export function switchMode(
  state: WritingGameState,
  mode: 'demo' | 'trace' | 'self-report'
): WritingGameState {
  return {
    ...state,
    mode,
    currentStrokeCount: 0,
  }
}

/**
 * なぞり書き完了判定
 * 実際のプロジェクトでは、書き順の正確性を判定するロジックを実装
 * ここでは簡易版として画数のみチェック
 */
export function checkTracing(
  state: WritingGameState,
  drawnPaths: string[],
  config: WritingGameConfig = defaultWritingConfig
): {
  isCorrect: boolean
  isPerfect: boolean
  newState: WritingGameState
  earnedScore: number
} {
  if (!state.currentKanji) {
    return {
      isCorrect: false,
      isPerfect: false,
      newState: state,
      earnedScore: 0,
    }
  }

  const expectedStrokes = state.currentKanji.strokes.length
  const drawnStrokes = drawnPaths.length

  // 画数チェック
  const isCorrect = drawnStrokes === expectedStrokes

  // 完璧判定（ここでは画数一致を完璧とする。実際はパスの類似度も判定）
  const isPerfect = isCorrect

  const baseScore = config.scorePerKanji
  const bonus = isPerfect ? config.perfectBonus : 0
  const earnedScore = baseScore + bonus

  const newPerfectStrokes = state.perfectStrokes + (isPerfect ? 1 : 0)
  const newScore = state.score + earnedScore

  return {
    isCorrect,
    isPerfect,
    earnedScore,
    newState: {
      ...state,
      score: newScore,
      perfectStrokes: newPerfectStrokes,
      currentStrokeCount: drawnStrokes,
    },
  }
}

/**
 * 自己申告で「できた」
 */
export function reportSuccess(
  state: WritingGameState,
  config: WritingGameConfig = defaultWritingConfig
): WritingGameState {
  const earnedScore = config.scorePerKanji

  return {
    ...state,
    score: state.score + earnedScore,
  }
}

/**
 * 次の漢字へ進む
 */
export function nextKanji(
  state: WritingGameState,
  kanjis: KanjiStrokeData[]
): WritingGameState {
  const nextIndex = state.currentKanjiIndex + 1

  if (nextIndex >= kanjis.length) {
    // ゲームクリア
    return {
      ...state,
      isPlaying: false,
      isCleared: true,
    }
  }

  return {
    ...state,
    currentKanjiIndex: nextIndex,
    currentKanji: kanjis[nextIndex],
    mode: 'demo',
    currentStrokeCount: 0,
  }
}

/**
 * リトライ
 */
export function retryWritingGame(
  kanjis: KanjiStrokeData[]
): WritingGameState {
  return createInitialWritingState(kanjis)
}

/**
 * 最大スコア計算
 */
export function calculateMaxWritingScore(
  kanjis: KanjiStrokeData[],
  config: WritingGameConfig = defaultWritingConfig
): number {
  return kanjis.length * (config.scorePerKanji + config.perfectBonus)
}

/**
 * スコアランク判定
 */
export type ScoreRank = 'S' | 'A' | 'B' | 'C' | 'D'

export function getWritingScoreRank(
  score: number,
  maxScore: number
): ScoreRank {
  const percentage = (score / maxScore) * 100

  if (percentage >= 95) return 'S'
  if (percentage >= 85) return 'A'
  if (percentage >= 70) return 'B'
  if (percentage >= 50) return 'C'
  return 'D'
}
