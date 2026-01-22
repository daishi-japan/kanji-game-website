'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { KanjiStrokeData } from '@/lib/data/stroke-data'

interface StrokeAnimationProps {
  kanji: KanjiStrokeData
  isPlaying: boolean
  onComplete?: () => void
  showCharacter?: boolean
  speed?: number // アニメーション速度倍率（1.0が標準）
}

/**
 * 書き順アニメーションコンポーネント
 * SVGパスを順番にアニメーション表示
 */
export function StrokeAnimation({
  kanji,
  isPlaying,
  onComplete,
  showCharacter = false,
  speed = 1.0,
}: StrokeAnimationProps) {
  const [currentStroke, setCurrentStroke] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // アニメーション制御
  useEffect(() => {
    if (!isPlaying) {
      setCurrentStroke(0)
      setIsAnimating(false)
      return
    }

    setIsAnimating(true)
  }, [isPlaying])

  // 次の画に進む
  const handleStrokeComplete = () => {
    if (currentStroke < kanji.strokes.length - 1) {
      setCurrentStroke((prev) => prev + 1)
    } else {
      setIsAnimating(false)
      onComplete?.()
    }
  }

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* 背景グリッド */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          viewBox="0 0 200 100"
          className="w-full h-full opacity-20"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 縦線 */}
          <line x1="100" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
          {/* 横線 */}
          <line x1="0" y1="50" x2="200" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>
      </div>

      {/* SVGキャンバス */}
      <svg
        viewBox="0 0 200 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ aspectRatio: '2/1' }}
      >
        {/* 薄い漢字の見本（オプション） */}
        {showCharacter && (
          <text
            x="100"
            y="80"
            fontSize="70"
            fontWeight="bold"
            fill="currentColor"
            opacity="0.1"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {kanji.character}
          </text>
        )}

        {/* 描画済みの画 */}
        {kanji.strokes.slice(0, currentStroke).map((stroke, index) => (
          <motion.path
            key={`completed-${index}`}
            d={stroke.path}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        ))}

        {/* 現在アニメーション中の画 */}
        {isAnimating && currentStroke < kanji.strokes.length && (
          <motion.path
            key={`animating-${currentStroke}`}
            d={kanji.strokes[currentStroke].path}
            stroke="var(--color-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: (kanji.strokes[currentStroke].duration / 1000) / speed,
              ease: 'easeInOut',
            }}
            onAnimationComplete={handleStrokeComplete}
            style={{
              filter: 'drop-shadow(0 0 4px var(--color-primary))',
            }}
          />
        )}

        {/* アニメーション完了後の完成形 */}
        {!isAnimating && currentStroke === kanji.strokes.length - 1 && (
          <>
            {kanji.strokes.map((stroke, index) => (
              <motion.path
                key={`final-${index}`}
                d={stroke.path}
                stroke="var(--color-primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
            ))}
          </>
        )}
      </svg>

      {/* 画数表示 */}
      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
        <p className="text-sm font-bold text-muted-foreground">
          {isAnimating ? `${currentStroke + 1}/${kanji.strokes.length}画` : `${kanji.strokes.length}画`}
        </p>
      </div>

      {/* 漢字情報 */}
      <div className="mt-4 text-center space-y-1">
        <p className="text-4xl font-bold">{kanji.character}</p>
        <p className="text-lg text-primary font-bold">{kanji.reading}</p>
        <p className="text-sm text-muted-foreground">{kanji.meaning}</p>
      </div>
    </div>
  )
}
