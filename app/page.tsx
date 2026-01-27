'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MikanCharacter } from '@/components/game/MikanCharacter'

export default function Home() {
  const [userName, setUserName] = useState('プレイヤー')

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/register'
        return
      }

      // プロフィール取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()

      setUserName(profile?.name || 'プレイヤー')
    }

    fetchUserData()
  }, [])

  // 背景に落ちる漢字エフェクト（五月雨効果）
  useEffect(() => {
    const kanjis = [
      '山', '川', '空', '夢', '花', '海', '星', '光',
      '木', '林', '森', '日', '月', '火', '水', '土',
      '金', '雨', '雪', '風', '虹', '雲', '石', '岩',
      '竹', '草', '葉', '鳥', '魚', '犬', '猫', '虫'
    ]
    const container = document.getElementById('bg-effects')
    if (!container) return

    const MAX_KANJI = 15

    const interval = setInterval(() => {
      if (container.children.length >= MAX_KANJI) return

      const el = document.createElement('div')
      el.className = 'falling-bg-kanji'
      el.innerText = kanjis[Math.floor(Math.random() * kanjis.length)]

      // 横幅80%以内（10vw - 90vw）
      el.style.left = (10 + Math.random() * 80) + 'vw'

      el.style.fontSize = (Math.random() * 2 + 1) + 'rem'

      // 落下速度（5-15秒）
      const duration = Math.random() * 10 + 5
      el.style.animationDuration = duration + 's'

      el.style.opacity = String(Math.random() * 0.3)

      container.appendChild(el)

      setTimeout(() => el.remove(), duration * 1000)
    }, 400) // 400msごとに生成（五月雨効果）

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-pattern">
      {/* 背景アニメーション */}
      <div
        id="bg-effects"
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      />

      {/* メインコンテナ */}
      <div className="relative z-10 w-full h-full max-w-md mx-auto flex flex-col items-center justify-center p-6 space-y-16">
        {/* タイトルロゴ */}
        <div className="text-center">
          <h1 className="text-4xl font-black text-orange-600 drop-shadow-sm tracking-tighter transform -rotate-2">
            <span className="inline-block text-orange-500">み</span>
            <span className="inline-block text-orange-600 transform rotate-3">
              か
            </span>
            <span className="inline-block text-orange-500">ん</span>
            <span className="text-2xl text-amber-900 ml-1">の</span>
            <br />
            <span className="text-5xl text-orange-500 mt-2 inline-block">
              漢字キャッチ
            </span>
          </h1>
          <p className="text-orange-800 font-bold mt-4 bg-white/70 inline-block px-4 py-1 rounded-full text-sm">
            おちてくる かんじを よもう！
          </p>
        </div>

        {/* メインキャラクター */}
        <div className="transform scale-150 mt-8">
          <MikanCharacter size={100} />
        </div>

        {/* スタートボタン */}
        <div className="w-full max-w-xs">
          <Link href="/play/reading">
            <button className="w-full bg-gradient-to-b from-orange-400 to-orange-600 text-white text-2xl font-black py-6 rounded-full shadow-xl border-b-8 border-orange-800 active:border-b-0 active:translate-y-2 transition-all animate-float hover:scale-105">
              よむれんしゅうをする
            </button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .bg-pattern {
          background-color: #fff7ed;
          background-image: radial-gradient(#fed7aa 2px, transparent 2px);
          background-size: 30px 30px;
        }

        .falling-bg-kanji {
          position: absolute;
          color: rgba(251, 146, 60, 0.2);
          font-weight: bold;
          user-select: none;
          pointer-events: none;
          animation: fall linear infinite;
        }

        @keyframes fall {
          to {
            transform: translateY(110vh);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}
