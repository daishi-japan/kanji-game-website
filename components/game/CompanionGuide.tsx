'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface CompanionGuideProps {
  state?: 'idle' | 'loading' | 'hover'
  message?: string
  characterIcon?: string
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

export function CompanionGuide({
  state = 'idle',
  message = '',
  characterIcon = '🦊',
  position = 'bottom-right',
}: CompanionGuideProps) {
  const [showMessage, setShowMessage] = useState(false)
  const [idleAnimation, setIdleAnimation] = useState<
    'normal' | 'yawn' | 'knock'
  >('normal')

  // メッセージ表示の制御
  useEffect(() => {
    if (message && state === 'hover') {
      setShowMessage(true)
    } else {
      setShowMessage(false)
    }
  }, [message, state])

  // アイドル状態の定期的なアニメーション変化
  useEffect(() => {
    if (state === 'idle') {
      const interval = setInterval(() => {
        const random = Math.random()
        if (random < 0.1) {
          setIdleAnimation('yawn')
          setTimeout(() => setIdleAnimation('normal'), 2000)
        } else if (random < 0.2) {
          setIdleAnimation('knock')
          setTimeout(() => setIdleAnimation('normal'), 1000)
        }
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [state])

  // ポジションに応じたスタイル
  const positionStyles = {
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
  }

  // 吹き出しの位置
  const bubblePositions = {
    'bottom-left': 'bottom-full left-0 mb-2',
    'bottom-right': 'bottom-full right-0 mb-2',
    'top-left': 'top-full left-0 mt-2',
    'top-right': 'top-full right-0 mt-2',
  }

  // アイドルアニメーション variants
  const idleVariants = {
    normal: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const,
      },
    },
    yawn: {
      scale: [1, 1.2, 1],
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 1.5,
      },
    },
    knock: {
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className={`fixed ${positionStyles[position]} z-40`}>
      {/* 吹き出し */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className={`absolute ${bubblePositions[position]} w-48`}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-3 border-2 border-primary">
              <p className="text-sm font-medium text-center">{message}</p>
              {/* 吹き出しの三角形 */}
              <div
                className={`absolute w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-primary ${
                  position.includes('bottom')
                    ? 'top-full left-4'
                    : 'bottom-full left-4 rotate-180'
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* キャラクター本体 */}
      <motion.div
        className="relative"
        animate={state === 'idle' ? idleVariants[idleAnimation] : undefined}
      >
        {/* ローディング状態 */}
        {state === 'loading' ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-4xl">{characterIcon}</div>
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          /* 通常・ホバー状態 */
          <motion.div
            className="text-5xl cursor-pointer"
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            {characterIcon}
          </motion.div>
        )}

        {/* 背景の円（装飾） */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="w-full h-full rounded-full bg-primary/10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        </div>
      </motion.div>
    </div>
  )
}
