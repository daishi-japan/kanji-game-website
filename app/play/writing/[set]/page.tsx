'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, Pencil, CheckCircle } from 'lucide-react'
import { getStrokeSetById, getKanjisBySet } from '@/lib/data/stroke-data'
import {
  createInitialWritingState,
  startWritingGame,
  switchMode,
  checkTracing,
  reportSuccess,
  nextKanji,
  retryWritingGame,
  getWritingScoreRank,
  calculateMaxWritingScore,
  WritingGameState,
} from '@/lib/game/writing-game-logic'
import { StrokeAnimation } from '@/components/game/StrokeAnimation'
import { DrawingCanvas } from '@/components/game/DrawingCanvas'
import { GameButton } from '@/components/game/GameButton'
import { EmotiveDialog } from '@/components/game/EmotiveDialog'
import { NarrativeProgress } from '@/components/game/NarrativeProgress'

export default function WritingGamePage({
  params,
}: {
  params: Promise<{ set: string }>
}) {
  const resolvedParams = use(params)
  const router = useRouter()

  const set = getStrokeSetById(resolvedParams.set)
  const kanjis = set ? getKanjisBySet(set.id) : []

  const [gameState, setGameState] = useState<WritingGameState>(() =>
    createInitialWritingState(kanjis)
  )
  const [showResult, setShowResult] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [drawnPaths, setDrawnPaths] = useState<string[]>([])

  // セットが存在しない場合はリダイレクト
  useEffect(() => {
    if (!set) {
      router.push('/play/writing')
    }
  }, [set, router])

  // ゲーム開始
  const handleStart = () => {
    setGameState(startWritingGame(gameState))
  }

  // デモアニメーション開始
  const handlePlayDemo = () => {
    setGameState(switchMode(gameState, 'demo'))
    setIsAnimating(true)
  }

  // デモアニメーション完了
  const handleDemoComplete = () => {
    setIsAnimating(false)
  }

  // なぞり書きモード
  const handleStartTrace = () => {
    setGameState(switchMode(gameState, 'trace'))
    setDrawnPaths([])
  }

  // 自己申告モード
  const handleStartSelfReport = () => {
    setGameState(switchMode(gameState, 'self-report'))
  }

  // なぞり書き完了
  const handleTraceComplete = () => {
    const { isCorrect, isPerfect, newState, earnedScore } = checkTracing(
      gameState,
      drawnPaths
    )

    setGameState(newState)

    if (isCorrect) {
      setFeedbackMessage(
        `よくできました！+${earnedScore}てん ${isPerfect ? '💯パーフェクト！' : ''}`
      )
    } else {
      setFeedbackMessage(
        `もういちど やってみよう！（${drawnPaths.length}画 / ${gameState.currentKanji?.strokes.length}画）`
      )
    }

    // フィードバック表示後、次の漢字へ
    setTimeout(() => {
      setFeedbackMessage('')
      if (isCorrect) {
        handleNext()
      }
    }, 2000)
  }

  // 自己申告「できた」
  const handleReportDone = () => {
    const newState = reportSuccess(gameState)
    setGameState(newState)

    setFeedbackMessage('よくできました！+100てん')

    setTimeout(() => {
      setFeedbackMessage('')
      handleNext()
    }, 1500)
  }

  // 次の漢字へ
  const handleNext = () => {
    const newState = nextKanji(gameState, kanjis)
    setGameState(newState)
    setDrawnPaths([])

    if (newState.isCleared) {
      setShowResult(true)
    }
  }

  // リトライ
  const handleRetry = () => {
    setGameState(retryWritingGame(kanjis))
    setShowResult(false)
    setDrawnPaths([])
  }

  if (!set) {
    return null
  }

  const maxScore = calculateMaxWritingScore(kanjis)
  const rank = getWritingScoreRank(gameState.score, maxScore)

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-100 to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-4">
          <Link
            href="/play/writing"
            className="p-2 bg-white rounded-full shadow-md hover:opacity-90 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{set.name}</h1>
            <p className="text-sm text-muted-foreground">{set.description}</p>
          </div>
        </div>

        {/* ゲーム未開始 */}
        {!gameState.isPlaying && !gameState.isCleared && (
          <div className="text-center space-y-6 py-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">じゅんびは いいかな？</h2>
              <p className="text-lg text-muted-foreground">
                {kanjis.length}この かんじの かきじゅんを れんしゅうしよう！
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
            {/* 進捗 */}
            <NarrativeProgress
              current={gameState.currentKanjiIndex}
              total={kanjis.length}
              characterIcon="✏️"
              goalIcon="certificate"
            />

            {/* スコア表示 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">スコア</p>
                  <p className="text-3xl font-bold text-secondary">
                    {gameState.score}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">パーフェクト</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {gameState.perfectStrokes}
                  </p>
                </div>
              </div>
            </div>

            {/* デモモード */}
            {gameState.mode === 'demo' && (
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    かきじゅんを みてね！
                  </h2>
                  <StrokeAnimation
                    kanji={gameState.currentKanji}
                    isPlaying={isAnimating}
                    onComplete={handleDemoComplete}
                    showCharacter={false}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <GameButton
                    size="lg"
                    onClick={handlePlayDemo}
                    disabled={isAnimating}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    アニメーションを みる
                  </GameButton>

                  <GameButton
                    size="lg"
                    variant="adventure"
                    onClick={handleStartTrace}
                  >
                    <Pencil className="w-5 h-5 mr-2" />
                    なぞって かく
                  </GameButton>

                  <GameButton
                    size="lg"
                    variant="secondary"
                    onClick={handleStartSelfReport}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ノートに かく
                  </GameButton>
                </div>
              </div>
            )}

            {/* なぞり書きモード */}
            {gameState.mode === 'trace' && (
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4 text-center">
                    ゆびで なぞって かいてね！
                  </h2>
                  <DrawingCanvas
                    width={300}
                    height={300}
                    showGuide={true}
                    guideCharacter={gameState.currentKanji.character}
                    onDrawingComplete={setDrawnPaths}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <GameButton
                    variant="secondary"
                    onClick={() => setGameState(switchMode(gameState, 'demo'))}
                  >
                    もどる
                  </GameButton>
                  <GameButton
                    onClick={handleTraceComplete}
                    disabled={drawnPaths.length === 0}
                  >
                    かんせい！
                  </GameButton>
                </div>
              </div>
            )}

            {/* 自己申告モード */}
            {gameState.mode === 'self-report' && (
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-center space-y-6">
                  <h2 className="text-xl font-bold">
                    ノートに かいてね！
                  </h2>

                  <div className="space-y-4">
                    <p className="text-6xl font-bold">
                      {gameState.currentKanji.character}
                    </p>
                    <p className="text-2xl text-secondary font-bold">
                      {gameState.currentKanji.reading}
                    </p>
                    <p className="text-lg text-muted-foreground">
                      {gameState.currentKanji.meaning}
                    </p>
                  </div>

                  <div className="text-muted-foreground">
                    <p>📓 ノートに かきじゅんを まもって</p>
                    <p>かいたら ボタンを おしてね！</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <GameButton
                    variant="secondary"
                    onClick={() => setGameState(switchMode(gameState, 'demo'))}
                  >
                    もどる
                  </GameButton>
                  <GameButton onClick={handleReportDone}>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    できた！
                  </GameButton>
                </div>
              </div>
            )}

            {/* フィードバック表示 */}
            {feedbackMessage && (
              <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
                <div className="text-4xl font-bold text-secondary bg-white/90 px-8 py-4 rounded-2xl shadow-2xl">
                  {feedbackMessage}
                </div>
              </div>
            )}
          </>
        )}

        {/* リザルト */}
        <EmotiveDialog
          open={showResult}
          variant="joy"
          title="クリア！"
          characterIcon="🎉"
        >
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-6xl font-bold text-secondary">
                ランク: {rank}
              </p>
              <p className="text-3xl font-bold">
                スコア: {gameState.score} / {maxScore}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-muted-foreground">れんしゅうした かんじ</p>
                <p className="text-2xl font-bold">
                  {gameState.currentKanjiIndex + 1} / {kanjis.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">パーフェクト</p>
                <p className="text-2xl font-bold">×{gameState.perfectStrokes}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href={`/result?mode=writing&stage=${set.id}&score=${gameState.score}&maxScore=${maxScore}&rank=${rank}&cleared=${gameState.isCleared}`}
                className="w-full"
              >
                <GameButton size="lg" className="w-full">
                  ほうびを もらう！
                </GameButton>
              </Link>
              <div className="grid grid-cols-2 gap-4">
                <GameButton onClick={handleRetry} size="lg" variant="secondary">
                  もう いちど
                </GameButton>
                <Link href="/play/writing">
                  <GameButton size="lg" variant="secondary" className="w-full">
                    セットせんたく
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
