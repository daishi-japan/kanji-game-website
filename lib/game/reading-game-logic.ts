import { KanjiData, generateChoices } from '../data/kanji-data'

// ゲーム状態
export interface GameState {
  currentKanjiIndex: number
  score: number // 正解数
  lives: number
  timeRemaining: number // 秒
  isPlaying: boolean
  isGameOver: boolean
  isCleared: boolean
  currentKanji: KanjiData | null
  choices: string[]
  // ===== Phase 2以降の機能：コメントアウト開始 =====
  // combo: number // 連続正解数
  // ===== コメントアウト終了 =====
}

// ゲーム設定
export interface GameConfig {
  maxLives: number
  timeLimit: number // 秒
  baseScore: number // 基本点数
  comboBonus: number // コンボボーナス倍率
  timeBonusRate: number // 時間ボーナス係数
}

export const defaultGameConfig: GameConfig = {
  maxLives: 3,
  timeLimit: 60,
  baseScore: 1, // 1問正解 = 1点
  comboBonus: 0, // 使用しない
  timeBonusRate: 0, // 使用しない
}

// 初期状態を生成
export function createInitialState(
  kanjis: KanjiData[],
  config: GameConfig = defaultGameConfig
): GameState {
  const firstKanji = kanjis[0] || null

  return {
    currentKanjiIndex: 0,
    score: 0,
    lives: config.maxLives,
    timeRemaining: config.timeLimit,
    isPlaying: false,
    isGameOver: false,
    isCleared: false,
    currentKanji: firstKanji,
    choices: firstKanji ? generateChoices(firstKanji) : [],
  }
}

// 回答判定
export function checkAnswer(
  state: GameState,
  selectedAnswer: string,
  kanjis: KanjiData[],
  config: GameConfig = defaultGameConfig
): {
  isCorrect: boolean
  newState: GameState
  earnedScore: number
} {
  if (!state.currentKanji || !state.isPlaying) {
    return { isCorrect: false, newState: state, earnedScore: 0 }
  }

  const isCorrect = selectedAnswer === state.currentKanji.reading

  if (isCorrect) {
    // 正解時（スコアは正解数のみ）
    const earnedScore = 1

    const nextIndex = state.currentKanjiIndex + 1
    const isLastKanji = nextIndex >= kanjis.length
    const nextKanji = isLastKanji ? null : kanjis[nextIndex]

    const newState: GameState = {
      ...state,
      currentKanjiIndex: nextIndex,
      score: state.score + earnedScore,
      currentKanji: nextKanji,
      choices: nextKanji ? generateChoices(nextKanji) : [],
      isCleared: isLastKanji,
      isPlaying: !isLastKanji,
    }

    return { isCorrect: true, newState, earnedScore }
  } else {
    // 不正解時
    const newLives = state.lives - 1
    const isGameOver = newLives <= 0

    const newState: GameState = {
      ...state,
      lives: newLives,
      isGameOver,
      isPlaying: !isGameOver,
    }

    return { isCorrect: false, newState, earnedScore: 0 }
  }
}

// タイマー更新
export function updateTimer(state: GameState): GameState {
  if (!state.isPlaying) return state

  const newTimeRemaining = Math.max(0, state.timeRemaining - 1)
  const isGameOver = newTimeRemaining <= 0

  return {
    ...state,
    timeRemaining: newTimeRemaining,
    isGameOver,
    isPlaying: !isGameOver,
  }
}

// ゲーム開始
export function startGame(state: GameState): GameState {
  return {
    ...state,
    isPlaying: true,
  }
}

// ゲームリトライ
export function retryGame(
  kanjis: KanjiData[],
  config: GameConfig = defaultGameConfig
): GameState {
  return createInitialState(kanjis, config)
}

// ===== Phase 2以降の機能：コメントアウト開始 =====
// スコアランク判定
// export type ScoreRank = 'S' | 'A' | 'B' | 'C' | 'D'
//
// export function getScoreRank(
//   score: number,
//   maxScore: number
// ): ScoreRank {
//   const percentage = (score / maxScore) * 100
//
//   if (percentage >= 90) return 'S'
//   if (percentage >= 80) return 'A'
//   if (percentage >= 70) return 'B'
//   if (percentage >= 60) return 'C'
//   return 'D'
// }
// ===== コメントアウト終了 =====

// 最大スコア計算（全問数）
export function calculateMaxScore(
  kanjis: KanjiData[],
  config: GameConfig = defaultGameConfig
): number {
  return kanjis.length // 問題数 = 最大スコア
}
