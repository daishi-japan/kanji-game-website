'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'
import { GameButton } from '@/components/game/GameButton'
import { getCharacterById } from '@/lib/data/character-data'

interface EvolutionDialogProps {
  fromCharacterId: string
  toCharacterId: string
  onClose: () => void
  isOpen: boolean
}

export function EvolutionDialog({
  fromCharacterId,
  toCharacterId,
  onClose,
  isOpen,
}: EvolutionDialogProps) {
  const [stage, setStage] = useState<'intro' | 'evolution' | 'result'>('intro')

  const fromCharacter = getCharacterById(fromCharacterId)
  const toCharacter = getCharacterById(toCharacterId)

  if (!fromCharacter || !toCharacter) return null

  const handleStartEvolution = () => {
    setStage('evolution')
    // 3秒後に結果画面へ
    setTimeout(() => {
      setStage('result')
    }, 3000)
  }

  const handleClose = () => {
    setStage('intro')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* イントロ画面 */}
            {stage === 'intro' && (
              <div className="p-8 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Sparkles className="w-16 h-16 text-yellow-500 mx-auto" />
                </motion.div>

                <div>
                  <h2 className="text-3xl font-bold mb-2">しんか できるよ！</h2>
                  <p className="text-lg text-muted-foreground">
                    {fromCharacter.name} が しんか しようと しているよ！
                  </p>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-8xl mb-2">{fromCharacter.emoji}</div>
                    <p className="font-bold">{fromCharacter.name}</p>
                  </div>

                  <TrendingUp className="w-12 h-12 text-primary" />

                  <div className="text-center opacity-50">
                    <div className="text-8xl mb-2">？</div>
                    <p className="font-bold">？？？</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <GameButton variant="secondary" className="flex-1" onClick={handleClose}>
                    やめる
                  </GameButton>
                  <GameButton className="flex-1" onClick={handleStartEvolution}>
                    しんか する！
                  </GameButton>
                </div>
              </div>
            )}

            {/* 進化アニメーション画面 */}
            {stage === 'evolution' && (
              <div className="p-8 text-center space-y-6 bg-gradient-to-br from-purple-100 to-pink-100 min-h-[400px] flex flex-col items-center justify-center">
                <motion.div
                  className="relative"
                  animate={{
                    scale: [1, 1.2, 1, 1.2, 1],
                    rotate: [0, 180, 360, 540, 720],
                  }}
                  transition={{
                    duration: 3,
                    ease: 'easeInOut',
                  }}
                >
                  <motion.div
                    className="text-9xl"
                    animate={{
                      opacity: [1, 0.5, 1, 0.5, 1],
                    }}
                    transition={{
                      duration: 3,
                      ease: 'easeInOut',
                    }}
                  >
                    {fromCharacter.emoji}
                  </motion.div>

                  {/* キラキラエフェクト */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute top-1/2 left-1/2"
                      initial={{ scale: 0, x: '-50%', y: '-50%' }}
                      animate={{
                        scale: [0, 1, 0],
                        x: ['-50%', `${Math.cos((i * Math.PI) / 4) * 100}px`],
                        y: ['-50%', `${Math.sin((i * Math.PI) / 4) * 100}px`],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-500" />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.p
                  className="text-2xl font-bold"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  しんか ちゅう...
                </motion.p>
              </div>
            )}

            {/* 結果画面 */}
            {stage === 'result' && (
              <div className="p-8 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Sparkles className="w-16 h-16 text-yellow-500 mx-auto" />
                </motion.div>

                <div>
                  <motion.h2
                    className="text-3xl font-bold mb-2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    🎉 おめでとう！
                  </motion.h2>
                  <motion.p
                    className="text-lg text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {fromCharacter.name} が しんか したよ！
                  </motion.p>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <motion.div
                    className="text-center opacity-50"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.5 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="text-6xl mb-2">{fromCharacter.emoji}</div>
                    <p className="font-bold">{fromCharacter.name}</p>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
                  >
                    <TrendingUp className="w-12 h-12 text-primary" />
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
                  >
                    <motion.div
                      className="text-9xl mb-2"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      {toCharacter.emoji}
                    </motion.div>
                    <p className="font-bold text-xl">{toCharacter.name}</p>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <GameButton className="w-full" onClick={handleClose}>
                    すごい！
                  </GameButton>
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
