'use client'

import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Heart, Pen } from 'lucide-react'

interface EmotiveDialogProps {
  open: boolean
  onClose?: () => void
  variant?: 'joy' | 'encourage' | 'zen'
  title?: string
  children: ReactNode
  characterIcon?: string
  autoClose?: number // ミリ秒（0 = 自動で閉じない）
  showCloseButton?: boolean
}

export function EmotiveDialog({
  open,
  onClose,
  variant = 'joy',
  title,
  children,
  characterIcon = '🦊',
  autoClose = 0,
  showCloseButton = true,
}: EmotiveDialogProps) {
  // 自動閉じる機能
  useEffect(() => {
    if (open && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, autoClose)
      return () => clearTimeout(timer)
    }
  }, [open, autoClose, onClose])

  // バリアントに応じたスタイル
  const variantStyles = {
    joy: {
      container: 'bg-gradient-to-br from-yellow-50 via-white to-pink-50',
      border: 'border-4 border-yellow-400',
      header: 'bg-gradient-to-r from-yellow-400 to-orange-400',
      icon: <Sparkles className="w-6 h-6 text-white" />,
    },
    encourage: {
      container: 'bg-gradient-to-br from-orange-50 via-white to-red-50',
      border: 'border-4 border-orange-400',
      header: 'bg-gradient-to-r from-orange-400 to-red-400',
      icon: <Heart className="w-6 h-6 text-white" />,
    },
    zen: {
      container: 'bg-gradient-to-br from-slate-50 via-white to-indigo-50',
      border: 'border-4 border-secondary',
      header: 'bg-gradient-to-r from-secondary to-indigo-600',
      icon: <Pen className="w-6 h-6 text-white" />,
    },
  }

  const styles = variantStyles[variant]

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* オーバーレイ（背景ブラー） */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* ダイアログ本体 */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              className={`${styles.container} ${styles.border} rounded-2xl shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden`}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              {/* ヘッダー */}
              {title && (
                <div
                  className={`${styles.header} p-4 flex items-center justify-between relative overflow-hidden`}
                >
                  {/* 紙吹雪エフェクト（joyモードのみ） */}
                  {variant === 'joy' && (
                    <div className="absolute inset-0 opacity-20">
                      {[...Array(10)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full"
                          initial={{
                            x: `${Math.random() * 100}%`,
                            y: -10,
                          }}
                          animate={{
                            y: '120%',
                            rotate: 360,
                          }}
                          transition={{
                            duration: 2 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 relative z-10">
                    {styles.icon}
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                  </div>

                  {showCloseButton && onClose && (
                    <button
                      onClick={onClose}
                      className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>
              )}

              {/* コンテンツ */}
              <div className="p-6 space-y-4">
                {/* キャラクターアイコン */}
                <div className="flex justify-center">
                  <motion.div
                    className="text-6xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, -5, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'loop',
                    }}
                  >
                    {characterIcon}
                  </motion.div>
                </div>

                {/* メッセージ */}
                <div className="text-center text-lg font-medium">
                  {children}
                </div>
              </div>

              {/* フッター（閉じるボタン） */}
              {showCloseButton && onClose && !title && (
                <div className="p-4 flex justify-center">
                  <button
                    onClick={onClose}
                    className="game-button px-8 py-3 text-lg font-bold bg-primary text-white rounded-full hover:opacity-90 transition-all"
                  >
                    とじる
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
