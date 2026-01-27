'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  BookOpen,
  GraduationCap,
  Pencil,
  Lightbulb,
  Award,
  Star,
  Sparkles,
  Heart,
  TreePine,
  Sun,
  Rocket,
  Palette,
  Brain,
  Trophy,
  Flower2,
} from 'lucide-react'

// アイコン配置データ
const decorations = [
  // 左上エリア - 学習アイテム
  {
    Icon: Rocket,
    x: '5%',
    y: '10%',
    size: 48,
    duration: 4,
    rotate: true,
    color: 'text-orange-400',
  },
  { Icon: Star, x: '15%', y: '5%', size: 32, duration: 3, color: 'text-yellow-400' },
  { Icon: BookOpen, x: '8%', y: '20%', size: 40, duration: 5, color: 'text-blue-400' },

  // 右上エリア - 成長・評価
  {
    Icon: GraduationCap,
    x: '85%',
    y: '8%',
    size: 56,
    duration: 6,
    color: 'text-purple-400',
  },
  { Icon: Pencil, x: '92%', y: '18%', size: 32, duration: 4, color: 'text-green-400' },
  {
    Icon: Trophy,
    x: '88%',
    y: '25%',
    size: 40,
    duration: 5,
    rotate: true,
    color: 'text-yellow-500',
  },

  // 左下エリア - 自然・創造
  { Icon: TreePine, x: '10%', y: '75%', size: 64, duration: 7, color: 'text-green-500' },
  { Icon: Palette, x: '5%', y: '85%', size: 40, duration: 4, color: 'text-pink-400' },
  { Icon: Flower2, x: '18%', y: '80%', size: 32, duration: 3, color: 'text-pink-300' },

  // 右下エリア - 知識・達成
  { Icon: Brain, x: '85%', y: '70%', size: 56, duration: 8, color: 'text-purple-500' },
  { Icon: Sun, x: '90%', y: '82%', size: 48, duration: 5, color: 'text-yellow-400' },
  { Icon: Award, x: '78%', y: '88%', size: 40, duration: 4, color: 'text-orange-400' },

  // 中央周辺（控えめ）
  { Icon: Sparkles, x: '30%', y: '40%', size: 24, duration: 3, color: 'text-yellow-300' },
  { Icon: Lightbulb, x: '70%', y: '45%', size: 32, duration: 4, color: 'text-yellow-500' },
  { Icon: Heart, x: '25%', y: '60%', size: 36, duration: 5, color: 'text-red-400' },
]

export function BackgroundDecorations() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const displayDecorations = isMobile
    ? decorations.filter((_, i) => i % 2 === 0) // 半分のみ表示
    : decorations

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {displayDecorations.map((deco, index) => {
        const IconComponent = deco.Icon
        return (
          <motion.div
            key={index}
            className={`absolute ${deco.color} opacity-20`}
            style={{ left: deco.x, top: deco.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.15, 0.3, 0.15],
              y: [0, -20, 0],
              scale: [0.9, 1, 0.9],
              ...(deco.rotate && { rotate: [0, 360] }),
            }}
            transition={{
              duration: deco.duration,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          >
            <IconComponent size={deco.size} />
          </motion.div>
        )
      })}
    </div>
  )
}
