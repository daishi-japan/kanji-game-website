'use client'

import { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import {
  createInitialState,
  createGameConfig,
  checkAnswer,
  updateTimer,
  startGame,
  retryGame,
  handleMiss,
  GameState,
} from '@/lib/game/reading-game-logic'
import { submitGameResult } from '@/app/actions/game'
import type { RewardItem } from '@/lib/data/reward-data'
import { FallingKanji } from '@/components/game/FallingKanji'
import { AnswerButtons } from '@/components/game/AnswerButtons'
import { MikanCharacter } from '@/components/game/MikanCharacter'
import { RewardDisplay } from '@/components/result/RewardDisplay'
import { motion, AnimatePresence } from 'framer-motion'

export default function ReadingGamePage({
  params,
}: {
  params: Promise<{ stage: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()

  // stage IDから学年と速度を抽出 (例: "grade_1_slow" => grade=1, speed="slow")
  const parseStageId = (stageId: string): { grade: 1 | 2 | 3 | 4 | 5 | 6; speed: 'slow' | 'normal' | 'fast' } | null => {
    const match = stageId.match(/grade_(\d+)_(slow|normal|fast)/)
    if (!match) return null
    return {
      grade: parseInt(match[1], 10) as 1 | 2 | 3 | 4 | 5 | 6,
      speed: match[2] as 'slow' | 'normal' | 'fast',
    }
  }

  const stageInfo = parseStageId(resolvedParams.stage)

  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [showScoreCalculation, setShowScoreCalculation] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | 'miss' | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [characterMessage, setCharacterMessage] = useState<string>('')
  const [selectedButtonIndex, setSelectedButtonIndex] = useState<number | null>(null)
  const [kanjiKey, setKanjiKey] = useState(0)
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const hasSubmittedResult = useRef(false)

  // ステージ情報が無効な場合はリダイレクト
  useEffect(() => {
    if (!stageInfo) {
      router.push('/play/reading')
    }
  }, [stageInfo, router])

  // 初期化：自動的にカウントダウン開始
  useEffect(() => {
    if (stageInfo && !gameState) {
      const config = createGameConfig(stageInfo.speed, stageInfo.grade)
      const initialState = createInitialState(stageInfo.grade, config)
      setGameState(initialState)
      setCountdown(3)
      setCharacterMessage('はじまるよ！')
    }
  }, [stageInfo, gameState])

  // カウントダウンタイマー
  useEffect(() => {
    if (countdown === null) return

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }

    if (countdown === 0) {
      // カウントダウン終了：ゲーム開始
      if (gameState) {
        setGameState(startGame(gameState))
        setCharacterMessage('')
      }
      setCountdown(null)
    }
  }, [countdown, gameState])

  // タイマー更新
  useEffect(() => {
    if (!gameState || !gameState.isPlaying) return

    const interval = setInterval(() => {
      setGameState((prev) => (prev ? updateTimer(prev) : prev))
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState?.isPlaying])

  // ゲームオーバー検知：集計画面を表示後、3秒後にリザルト表示
  useEffect(() => {
    if (gameState?.isGameOver) {
      setShowScoreCalculation(true)

      // ゲーム結果をDBに保存（二重送信防止）
      if (!hasSubmittedResult.current) {
        hasSubmittedResult.current = true
        const score = gameState.score
        const getRank = (s: number): 'S' | 'A' | 'B' | 'C' | 'D' => {
          if (s >= 130) return 'S'
          if (s >= 80) return 'A'
          if (s >= 40) return 'B'
          if (s >= 20) return 'C'
          return 'D'
        }
        submitGameResult({
          mode: 'reading',
          stageId: resolvedParams.stage,
          score,
          maxScore: 300,
          rank: getRank(score),
          cleared: score >= 40,
        }).then((res) => {
          if (res.success && res.data) {
            setRewards(res.data.rewards)
          }
        }).catch((err) => console.error('Failed to save game result:', err))
      }

      const timer = setTimeout(() => {
        setShowScoreCalculation(false)
        setShowResult(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [gameState?.isGameOver, resolvedParams.stage])

  // 回答処理
  const handleAnswer = (answer: string, index: number) => {
    if (!gameState || !stageInfo) return

    setSelectedButtonIndex(index)

    const { isCorrect, newState } = checkAnswer(
      gameState,
      answer,
      stageInfo.grade,
      createGameConfig(stageInfo.speed, stageInfo.grade)
    )

    setGameState(newState)

    if (isCorrect) {
      setFeedbackType('correct')
      setCharacterMessage('すごい！')

      // 0.5秒後に次の問題へ
      setTimeout(() => {
        setFeedbackType(null)
        setSelectedButtonIndex(null)
        setCharacterMessage('')
        setKanjiKey(prev => prev + 1)
      }, 500)
    } else {
      setFeedbackType('wrong')
      setCharacterMessage('あちゃー')

      // 即座に次の問題へ
      setTimeout(() => {
        setFeedbackType(null)
        setSelectedButtonIndex(null)
        setCharacterMessage('')
        setKanjiKey(prev => prev + 1)
      }, 300)
    }
  }

  // 落下完了処理（見逃し）
  const handleFallComplete = () => {
    if (!gameState || !stageInfo) return

    const newState = handleMiss(gameState, stageInfo.grade)
    setGameState(newState)

    setFeedbackType('miss')
    setCharacterMessage('おちちゃった...')

    // 即座に次の問題へ
    setTimeout(() => {
      setFeedbackType(null)
      setCharacterMessage('')
      setKanjiKey(prev => prev + 1)
    }, 300)
  }

  // リトライ
  // スコアに応じたタイトルとメッセージを取得
  const getResultMessage = (score: number) => {
    if (score >= 130) {
      return {
        title: 'でんせつ！',
        message: 'しんきろく！きみはすごすぎる！'
      }
    } else if (score >= 80) {
      return {
        title: 'さいこう！',
        message: 'かんぺき！きみはてんさいだ！'
      }
    } else if (score >= 40) {
      return {
        title: 'すごいね！',
        message: 'どんどんうまくなってるよ！'
      }
    } else {
      return {
        title: 'がんばったね！',
        message: 'まだまだこれから！なんどでもちょうせんしよう！'
      }
    }
  }

  const handleRetry = () => {
    if (!stageInfo) return

    const config = createGameConfig(stageInfo.speed, stageInfo.grade)
    setGameState(retryGame(stageInfo.grade, config))
    setShowResult(false)
    setShowScoreCalculation(false)
    hasSubmittedResult.current = false
    setRewards([])
    setFeedbackType(null)
    setSelectedButtonIndex(null)
    setKanjiKey(0)
    setCountdown(3)
    setCharacterMessage('はじまるよ！')
  }

  if (!stageInfo || !gameState) {
    return null
  }

  return (
    <main className="h-screen bg-pattern flex flex-col overflow-hidden relative">
      {/* ヘッダー */}
      <div className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm">
        <Link
          href="/play/reading"
          className="p-2 bg-white rounded-full shadow-md hover:opacity-90 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
      </div>

      {/* カウントダウン表示 */}
      {!gameState.isPlaying && !gameState.isGameOver && countdown !== null && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            {countdown > 0 ? (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-muted-foreground">
                  スタートまで...
                </h2>
                <div className="text-9xl font-bold text-primary animate-pulse">
                  {countdown}
                </div>
              </div>
            ) : (
              <div className="text-6xl font-bold text-primary animate-bounce">
                スタート！
              </div>
            )}
          </div>
        </div>
      )}

      {/* ゲームプレイ中 */}
      {gameState.isPlaying && gameState.currentKanji && (
        <div className="flex-1 flex flex-col relative overflow-hidden items-center">
          {/* コンテンツ全体を80%幅に */}
          <div className="w-full max-w-[80%] flex-1 flex flex-col">
            {/* HUD */}
            <div className="flex justify-center items-center py-3">
              <div className="flex justify-center items-center gap-5 w-full">
                {/* ライフ */}
                <div className="flex items-center gap-2 bg-white/90 rounded-full px-8 py-3 border-4 border-orange-200">
                  <span className="text-2xl">💖</span>
                  <span className="text-xl font-black text-orange-900">{gameState.lives}</span>
                </div>

                {/* タイマー */}
                <div className="flex items-center gap-2 bg-white/90 rounded-full px-8 py-3 border-4 border-orange-200">
                  <span className="text-2xl">⏱️</span>
                  <span className="text-xl font-black text-orange-900">{gameState.timeRemaining}</span>
                </div>

                {/* スコア */}
                <div className="flex items-center gap-2 bg-white/90 rounded-full px-8 py-3 border-4 border-orange-200">
                  <span className="text-xl font-black text-orange-900">{gameState.score}点</span>
                </div>
              </div>
            </div>

            {/* 落下エリア */}
            <div className="flex-1 relative bg-white/50 border-4 border-orange-200 rounded-3xl mb-4 overflow-hidden">
              <AnimatePresence mode="wait">
                <FallingKanji
                  key={kanjiKey}
                  character={gameState.currentKanji.character}
                  isActive={true}
                  onFallComplete={handleFallComplete}
                  fallDuration={gameState.fallSpeed}
                  feedbackType={feedbackType}
                />
              </AnimatePresence>

              {/* みかんキャラクター（左下） */}
              <div className="absolute bottom-4 left-4 z-20">
                <div className="relative">
                  <MikanCharacter size={80} />
                  {characterMessage && (
                    <motion.div
                      className="absolute -top-20 left-12 bg-white border-4 border-orange-400 rounded-2xl px-5 py-2.5 shadow-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="text-xl font-black text-orange-600 whitespace-nowrap">
                        {characterMessage}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* 回答ボタン */}
            <div className="pb-4">
              <AnswerButtons
                choices={gameState.choices}
                onAnswer={handleAnswer}
                disabled={feedbackType !== null}
                feedbackType={feedbackType}
                selectedIndex={selectedButtonIndex}
              />
            </div>

            {/* やめるボタン */}
            <div className="text-center pb-4">
              <Link
                href="/play/reading"
                className="inline-block text-orange-800 text-lg font-bold hover:text-orange-600 transition-colors border-b-2 border-orange-800 hover:border-orange-600"
              >
                やめる
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 集計画面 */}
      <AnimatePresence>
        {showScoreCalculation && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center space-y-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 12 }}
            >
              {/* みかんキャラクター */}
              <div className="flex justify-center">
                <MikanCharacter size={200} />
              </div>

              {/* メッセージ */}
              <p className="text-4xl font-black text-white drop-shadow-lg animate-pulse">
                しゅうけいちゅう...
              </p>

              {/* ローディングドット */}
              <div className="flex justify-center gap-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="inline-block w-5 h-5 bg-orange-400 rounded-full loading-dot"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* リザルト */}
      {showResult && gameState && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative bg-white/95 rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl border-4 border-orange-200 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* みかんキャラクター */}
            <div className="flex justify-center">
              <MikanCharacter size={120} />
            </div>

            {/* タイトル */}
            <h2 className="text-4xl font-black text-orange-600">
              {getResultMessage(gameState.score).title}
            </h2>

            {/* スコア表示 */}
            <div className="space-y-2">
              <p className="text-xl font-bold text-orange-800">スコア:</p>
              <p className="text-7xl font-black text-orange-900">
                {gameState.score}
                <span className="text-4xl">点</span>
              </p>
            </div>

            {/* 報酬表示 */}
            {rewards.length > 0 && (
              <RewardDisplay rewards={rewards} isVisible={showResult} />
            )}

            {/* ボタン */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleRetry}
                className="w-full py-5 px-8 rounded-full text-2xl font-black text-white bg-gradient-to-b from-orange-400 to-orange-600 border-4 border-orange-700 shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                もういちど
              </button>
              <Link href="/play/reading">
                <button className="w-full py-5 px-8 rounded-full text-2xl font-black text-orange-700 bg-white border-4 border-orange-400 shadow-md hover:bg-orange-50 active:scale-95 transition-all">
                  トップへもどる
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .bg-pattern {
          background-color: #fff7ed;
          background-image: radial-gradient(#fed7aa 2px, transparent 2px);
          background-size: 30px 30px;
        }
        @keyframes loading-dot-bounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        .loading-dot {
          animation: loading-dot-bounce 1.2s infinite ease-in-out;
        }
      `}</style>
    </main>
  )
}
