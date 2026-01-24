'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getStageById, getKanjisByStage } from '@/lib/data/kanji-data'
import {
  createInitialState,
  checkAnswer,
  updateTimer,
  startGame,
  retryGame,
  calculateMaxScore,
  GameState,
} from '@/lib/game/reading-game-logic'
import { FallingKanji } from '@/components/game/FallingKanji'
import { AnswerButtons } from '@/components/game/AnswerButtons'
import { GameHUD } from '@/components/game/GameHUD'
import { EmotiveDialog } from '@/components/game/EmotiveDialog'
import { NarrativeProgress } from '@/components/game/NarrativeProgress'
import { GameButton } from '@/components/game/GameButton'

export default function ReadingGamePage({
  params,
}: {
  params: Promise<{ stage: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()

  const stage = getStageById(resolvedParams.stage)
  const allKanjis = stage ? getKanjisByStage(stage.id) : []

  // ランダムに10問選択したkanjisを保持
  const [kanjis, setKanjis] = useState<typeof allKanjis>([])
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [showScoreCalculation, setShowScoreCalculation] = useState(false)
  const [animatedScore, setAnimatedScore] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)

  // ステージが存在しない場合はリダイレクト
  useEffect(() => {
    if (!stage) {
      router.push('/play/reading')
    }
  }, [stage, router])

  // 初期化：ランダムに10問選択
  useEffect(() => {
    if (allKanjis.length > 0 && kanjis.length === 0) {
      const shuffled = [...allKanjis]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      const selected = shuffled.slice(0, 10)
      setKanjis(selected)
      setGameState(createInitialState(selected))
    }
  }, [allKanjis, kanjis.length])

  // タイマー更新
  useEffect(() => {
    if (!gameState || !gameState.isPlaying) return

    const interval = setInterval(() => {
      setGameState((prev) => (prev ? updateTimer(prev) : prev))
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState?.isPlaying])

  // カウントダウン開始
  const handleStartCountdown = () => {
    setCountdown(3)
  }

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
      }
      setCountdown(null)
    }
  }, [countdown, gameState])

  // 回答処理（タイムアウト含む）
  const handleAnswer = (answer: string) => {
    if (!gameState) return

    const { isCorrect, newState, earnedScore } = checkAnswer(
      gameState,
      answer,
      kanjis
    )

    setGameState(newState)

    if (isCorrect) {
      setFeedbackMessage(`せいかい！`)
    } else {
      setFeedbackMessage('ざんねん…')
    }

    // 最終問題の場合
    const isLastQuestion = newState.isCleared || newState.isGameOver
    const feedbackDuration = isCorrect ? 1000 : 500 // 正解は1秒、誤答は0.5秒

    setTimeout(() => {
      setFeedbackMessage('')

      if (isLastQuestion) {
        // スコア集計アニメーション開始
        setShowScoreCalculation(true)
        setAnimatedScore(0)

        // スコアをカウントアップ
        const finalScore = newState.score
        const duration = 2000 // 2秒かけてカウントアップ
        const steps = finalScore
        const stepDuration = duration / Math.max(steps, 1)

        let currentStep = 0
        const countUpInterval = setInterval(() => {
          currentStep++
          setAnimatedScore(currentStep)

          if (currentStep >= finalScore) {
            clearInterval(countUpInterval)
            // カウントアップ完了後、少し待ってからリザルト表示
            setTimeout(() => {
              setShowScoreCalculation(false)
              setShowResult(true)
            }, 500)
          }
        }, stepDuration)
      }
    }, feedbackDuration)
  }

  // 落下タイムアウト処理
  const handleFallComplete = () => {
    handleAnswer('__TIMEOUT__')
  }

  // リトライ
  const handleRetry = () => {
    // 新しくランダムに10問選択
    const shuffled = [...allKanjis]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    const selected = shuffled.slice(0, 10)
    setKanjis(selected)
    setGameState(retryGame(selected))
    setShowResult(false)
    setShowScoreCalculation(false)
    setAnimatedScore(0)
  }

  if (!stage || !gameState) {
    return null
  }

  const maxScore = calculateMaxScore(kanjis)

  return (
    <main className="h-screen bg-gradient-to-b from-sky-100 to-background p-4 flex flex-col overflow-hidden">
      <div className="max-w-7xl mx-auto flex-1 flex flex-col space-y-4 w-full">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link
            href="/play/reading"
            className="p-2 bg-white rounded-full shadow-md hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{stage.name}</h1>
            <p className="text-sm text-muted-foreground">{stage.description}</p>
          </div>
        </div>

        {/* ゲーム未開始 */}
        {!gameState.isPlaying && !gameState.isGameOver && !gameState.isCleared && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6">
              {countdown === null ? (
                <>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold">じゅんびは いいかな？</h2>
                    <p className="text-xl text-muted-foreground">
                      {kanjis.length}この かんじを よんでね！
                    </p>
                  </div>
                  <GameButton size="lg" onClick={handleStartCountdown}>
                    はじめる
                  </GameButton>
                </>
              ) : countdown > 0 ? (
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
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            {/* HUD */}
            <GameHUD
              score={gameState.score}
              lives={gameState.lives}
              maxLives={3}
              timeRemaining={gameState.timeRemaining}
            />

            {/* 進捗 */}
            <NarrativeProgress
              current={gameState.currentKanjiIndex}
              total={kanjis.length}
              characterIcon="🦊"
              goalIcon="treasure"
            />

            {/* 落ちてくる漢字 */}
            <FallingKanji
              character={gameState.currentKanji.character}
              isActive={true}
              onFallComplete={handleFallComplete}
              fallDuration={5}
            />

            {/* 回答ボタン */}
            <div className="flex justify-center pb-2">
              <AnswerButtons
                choices={gameState.choices}
                onAnswer={handleAnswer}
                disabled={!!feedbackMessage}
              />
            </div>

            {/* フィードバック表示 */}
            {feedbackMessage && (
              <div className="fixed top-20 right-8 z-50 pointer-events-none">
                <div className="text-2xl font-bold text-primary bg-white/90 px-6 py-3 rounded-xl shadow-2xl">
                  {feedbackMessage}
                </div>
              </div>
            )}
          </div>
        )}

        {/* スコア集計アニメーション */}
        {showScoreCalculation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white/95 rounded-2xl p-12 text-center space-y-6 shadow-2xl">
              <p className="text-2xl font-bold text-muted-foreground">
                けっかを けいさんちゅう...
              </p>
              <div className="text-8xl font-bold text-primary">
                {animatedScore} / {maxScore}
              </div>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{
                    width: `${(animatedScore / maxScore) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* リザルト */}
        <EmotiveDialog
          open={showResult}
          variant={gameState.isCleared ? 'joy' : 'encourage'}
          title={gameState.isCleared ? 'がんばりました' : 'ゲームオーバー'}
          characterIcon={gameState.isCleared ? '🎉' : '💪'}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <span className="text-6xl">{gameState.isCleared ? '🎉' : '💪'}</span>
              <p className="text-4xl font-bold text-primary">
                せいかい: {gameState.score} / {maxScore}
              </p>
            </div>

            {/* ===== Phase 2以降の機能：コメントアウト開始 =====
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-muted-foreground">せいかいすう</p>
                <p className="text-2xl font-bold">
                  {gameState.currentKanjiIndex} / {kanjis.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">さいこうコンボ</p>
                <p className="text-2xl font-bold">×{gameState.combo}</p>
              </div>
            </div>
            ===== コメントアウト終了 ===== */}

            <div className="flex flex-col gap-4">
              {/* ===== Phase 2以降の機能：コメントアウト開始 =====
              <Link
                href={`/result?mode=reading&stage=${stage.id}&score=${gameState.score}&maxScore=${maxScore}&rank=C&cleared=${gameState.isCleared}`}
                className="w-full"
              >
                <GameButton size="lg" className="w-full">
                  ほうびを もらう！
                </GameButton>
              </Link>
              ===== コメントアウト終了 ===== */}
              <div className="grid grid-cols-2 gap-4">
                <GameButton onClick={handleRetry} size="lg" variant="secondary">
                  ちょうせんする
                </GameButton>
                <Link href="/play/reading">
                  <GameButton size="lg" variant="secondary" className="w-full">
                    ステージせんたく
                  </GameButton>
                </Link>
              </div>
            </div>
          </div>
        </EmotiveDialog>
      </div>
    </main>
  )
}
