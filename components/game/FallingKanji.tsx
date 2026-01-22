'use client'

import { motion } from 'framer-motion'

interface FallingKanjiProps {
  character: string
  isActive: boolean
}

export function FallingKanji({ character, isActive }: FallingKanjiProps) {
  return (
    <div className="relative w-full h-64 overflow-hidden bg-gradient-to-b from-sky-100 to-transparent rounded-2xl">
      {/* 背景装飾（雲） */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-10 bg-white/50 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 10, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        ))}
      </div>

      {/* 落ちてくる漢字 */}
      {isActive && (
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 200, opacity: 1 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
        >
          <div className="relative">
            {/* 光のエフェクト */}
            <motion.div
              className="absolute inset-0 bg-primary/30 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />

            {/* 漢字本体 */}
            <div className="relative text-8xl font-bold text-primary drop-shadow-2xl">
              {character}
            </div>
          </div>
        </motion.div>
      )}

      {/* 地面（底部） */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-green-500/20 to-transparent" />
    </div>
  )
}
