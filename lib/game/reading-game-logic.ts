import { KanjiData, generateChoices, getKanjisByGrade } from '../data/kanji-data'

// ゲーム状態
export interface GameState {
  score: number // スコア（10点ずつ加算）
  lives: number
  timeRemaining: number // 秒
  isPlaying: boolean
  isGameOver: boolean
  currentKanji: KanjiData | null
  choices: string[]
  fallSpeed: number // 現在の落下時間（秒）
  correctCount: number // 正解数（統計用）
}

// ゲーム設定
export interface GameConfig {
  maxLives: number
  timeLimit: number // 秒
  scorePerCorrect: number // 正解あたりのスコア
  baseFallSpeed: number // 基本落下時間（秒）
  speedIncrement: number // 正解ごとの時間減少量（秒）
}

// 速度と学年による設定を生成
export function createGameConfig(
  speed: 'slow' | 'normal' | 'fast',
  grade: 1 | 2 | 3 | 4 | 5 | 6
): GameConfig {
  // 落下時間（秒）: 大きいほど遅い
  const speedMap = {
    slow: 8,    // 8秒かけて落下
    normal: 5,  // 5秒かけて落下
    fast: 3,    // 3秒かけて落下
  }

  // 学年が上がるほど少し速くなる（-0.1秒ずつ）
  const baseFallSpeed = Math.max(2, speedMap[speed] - (grade * 0.1))

  return {
    maxLives: 3,
    timeLimit: 30,
    scorePerCorrect: 10,
    baseFallSpeed,
    speedIncrement: -0.1,  // 正解するたびに0.1秒速くなる（マイナス）
  }
}

export const defaultGameConfig: GameConfig = {
  maxLives: 3,
  timeLimit: 30,
  scorePerCorrect: 10,
  baseFallSpeed: 5,      // 5秒かけて落下
  speedIncrement: -0.1,  // 正解ごとに0.1秒速くなる
}

// 初期状態を生成（ランダムに1問選択）
export function createInitialState(
  grade: 1 | 2 | 3 | 4 | 5 | 6,
  config: GameConfig = defaultGameConfig
): GameState {
  const allKanjis = getKanjisByGrade(grade)
  const randomKanji = allKanjis[Math.floor(Math.random() * allKanjis.length)]

  return {
    score: 0,
    lives: config.maxLives,
    timeRemaining: config.timeLimit,
    isPlaying: false,
    isGameOver: false,
    currentKanji: randomKanji,
    choices: randomKanji ? generateChoices(randomKanji) : [],
    fallSpeed: config.baseFallSpeed,
    correctCount: 0,
  }
}

// 次の問題を読み込む
export function loadNextQuestion(
  state: GameState,
  grade: 1 | 2 | 3 | 4 | 5 | 6,
  config: GameConfig = defaultGameConfig
): GameState {
  const allKanjis = getKanjisByGrade(grade)
  const randomKanji = allKanjis[Math.floor(Math.random() * allKanjis.length)]

  return {
    ...state,
    currentKanji: randomKanji,
    choices: randomKanji ? generateChoices(randomKanji) : [],
  }
}

// 回答判定
export function checkAnswer(
  state: GameState,
  selectedAnswer: string,
  grade: 1 | 2 | 3 | 4 | 5 | 6,
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
    // 正解時：スコア加算、速度アップ、次の問題へ
    const earnedScore = config.scorePerCorrect
    const newFallSpeed = state.fallSpeed + config.speedIncrement

    // 次の問題を読み込む
    const allKanjis = getKanjisByGrade(grade)
    const randomKanji = allKanjis[Math.floor(Math.random() * allKanjis.length)]

    const newState: GameState = {
      ...state,
      score: state.score + earnedScore,
      fallSpeed: newFallSpeed,
      correctCount: state.correctCount + 1,
      currentKanji: randomKanji,
      choices: randomKanji ? generateChoices(randomKanji) : [],
    }

    return { isCorrect: true, newState, earnedScore }
  } else {
    // 不正解時：ライフ減少、ゲーム継続（次の問題には進まない）
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

// 見逃し判定（地面に到達）
export function handleMiss(
  state: GameState,
  grade: 1 | 2 | 3 | 4 | 5 | 6
): GameState {
  if (!state.isPlaying) return state

  const newLives = state.lives - 1
  const isGameOver = newLives <= 0

  if (isGameOver) {
    return {
      ...state,
      lives: newLives,
      isGameOver: true,
      isPlaying: false,
    }
  }

  // ライフが残っている場合、次の問題へ
  const allKanjis = getKanjisByGrade(grade)
  const randomKanji = allKanjis[Math.floor(Math.random() * allKanjis.length)]

  return {
    ...state,
    lives: newLives,
    currentKanji: randomKanji,
    choices: randomKanji ? generateChoices(randomKanji) : [],
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
  grade: 1 | 2 | 3 | 4 | 5 | 6,
  config: GameConfig = defaultGameConfig
): GameState {
  return createInitialState(grade, config)
}
