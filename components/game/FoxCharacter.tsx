'use client'

import { motion } from 'framer-motion'

interface FoxCharacterProps {
  size?: number
  className?: string
}

export function FoxCharacter({ size = 120, className = '' }: FoxCharacterProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={{
        y: [0, -15, 0],
        rotate: [-5, 5, -5],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* 尻尾 */}
      <motion.path
        d="M85 75 Q95 85, 105 70 Q110 60, 100 55 Q90 50, 85 60 Z"
        fill="#FF8C42"
        animate={{
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ originX: '85px', originY: '75px' }}
      />
      <path
        d="M90 75 Q98 80, 102 68 Q105 62, 98 60 Q92 58, 90 65 Z"
        fill="#FFF"
        opacity="0.8"
      />

      {/* 体 */}
      <ellipse cx="60" cy="75" rx="28" ry="30" fill="#FF8C42" />

      {/* 頭 */}
      <circle cx="60" cy="45" r="25" fill="#FF8C42" />

      {/* 左耳 */}
      <motion.path
        d="M45 25 L40 10 L50 20 Z"
        fill="#FF8C42"
        animate={{
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ originX: '45px', originY: '25px' }}
      />
      <path d="M45 25 L42 15 L48 22 Z" fill="#FFC5A3" />

      {/* 右耳 */}
      <motion.path
        d="M75 25 L80 10 L70 20 Z"
        fill="#FF8C42"
        animate={{
          rotate: [2, -2, 2],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
        style={{ originX: '75px', originY: '25px' }}
      />
      <path d="M75 25 L78 15 L72 22 Z" fill="#FFC5A3" />

      {/* 顔の白い部分 */}
      <ellipse cx="60" cy="50" rx="18" ry="20" fill="#FFF" />

      {/* 左目 */}
      <motion.g
        animate={{
          scaleY: [1, 0.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        <ellipse cx="52" cy="45" rx="3" ry="5" fill="#2C1810" />
      </motion.g>

      {/* 右目 */}
      <motion.g
        animate={{
          scaleY: [1, 0.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        <ellipse cx="68" cy="45" rx="3" ry="5" fill="#2C1810" />
      </motion.g>

      {/* 目のハイライト */}
      <ellipse cx="53" cy="43" rx="1.5" ry="2" fill="#FFF" opacity="0.8" />
      <ellipse cx="69" cy="43" rx="1.5" ry="2" fill="#FFF" opacity="0.8" />

      {/* 鼻 */}
      <ellipse cx="60" cy="52" rx="2.5" ry="2" fill="#2C1810" />

      {/* 口 */}
      <path
        d="M60 52 Q55 56, 52 54 M60 52 Q65 56, 68 54"
        stroke="#2C1810"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 頬の赤み */}
      <ellipse cx="45" cy="50" rx="4" ry="3" fill="#FFB4B4" opacity="0.5" />
      <ellipse cx="75" cy="50" rx="4" ry="3" fill="#FFB4B4" opacity="0.5" />

      {/* 足 */}
      <rect x="48" y="95" width="8" height="15" rx="4" fill="#FF8C42" />
      <rect x="64" y="95" width="8" height="15" rx="4" fill="#FF8C42" />
      <ellipse cx="52" cy="110" rx="5" ry="3" fill="#2C1810" />
      <ellipse cx="68" cy="110" rx="5" ry="3" fill="#2C1810" />

      {/* キラキラエフェクト */}
      <motion.g
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5,
        }}
      >
        <path
          d="M25 35 L27 37 L25 39 L23 37 Z"
          fill="#FFD700"
          opacity="0.8"
        />
      </motion.g>
      <motion.g
        animate={{
          opacity: [0, 1, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 1,
        }}
      >
        <path
          d="M95 40 L97 42 L95 44 L93 42 Z"
          fill="#FFD700"
          opacity="0.8"
        />
      </motion.g>
    </motion.svg>
  )
}
