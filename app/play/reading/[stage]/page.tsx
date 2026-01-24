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
  const kanjis = stage ? getKanjisByStage(stage.id) : []

  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(kanjis)
  )
  const [showResult, setShowResult] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')

  // ステージが存在しない場合はリダイレクト
  useEffect(() => {
    if (!stage) {
      router.push('/play/reading')
    }
  }, [stage, router])

  // タイマー更新
  useEffect(() => {
    if (!gameState.isPlaying) return

    const interval = setInterval(() => {
      setGameState((prev) => updateTimer(prev))
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState.isPlaying])

  // ゲーム開始
  const handleStart = () => {
    setGameState(startGame(gameState))
  }

  // 回答処理
  const handleAnswer = (answer: string) => {
    const { isCorrect, newState, earnedScore } = checkAnswer(
      gameState,
      answer,
      kanjis
    )

    setGameState(newState)

    if (isCorrect) {
      setFeedbackMessage(`せいかい！`)
    } else {
      setFeedbackMessage('ざんねん…もう いちど がんばろう！')
    }

    // フィードバックを1.5秒表示
    setTimeout(() => {
      setFeedbackMessage('')

      // ゲームクリアまたはゲームオーバーの場合はリザルト表示
      if (newState.isCleared || newState.isGameOver) {
        setShowResult(true)
      }
    }, 1500)
  }

  // リトライ
  const handleRetry = () => {
    setGameState(retryGame(kanjis))
    setShowResult(false)
  }

  if (!stage) {
    return null
  }

  const maxScore = calculateMaxScore(kanjis)

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
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
          <div className="text-center space-y-6 py-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">じゅんびは いいかな？</h2>
              <p className="text-lg text-muted-foreground">
                {kanjis.length}この かんじを よんでね！
              </p>
            </div>
            <GameButton size="lg" onClick={handleStart}>
              スタート！
            </GameButton>
          </div>
        )}

        {/* ゲームプレイ中 */}
        {gameState.isPlaying && gameState.currentKanji && (
          <>
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
            />

            {/* 回答ボタン */}
            <div className="flex justify-center">
              <AnswerButtons
                choices={gameState.choices}
                onAnswer={handleAnswer}
                disabled={!!feedbackMessage}
              />
            </div>

            {/* フィードバック表示 */}
            {feedbackMessage && (
              <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="text-4xl font-bold text-primary bg-white/90 px-8 py-4 rounded-2xl shadow-2xl">
                  {feedbackMessage}
                </div>
              </div>
            )}
          </>
        )}

        {/* リザルト */}
        <EmotiveDialog
          open={showResult}
          variant={gameState.isCleared ? 'joy' : 'encourage'}
          title={gameState.isCleared ? 'クリア！' : 'ゲームオーバー'}
          characterIcon={gameState.isCleared ? '🎉' : '💪'}
        >
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-5xl font-bold text-primary">
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
                  もう いちど
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
