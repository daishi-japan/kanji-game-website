'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Grade = 1 | 2 | 3 | 4 | 5 | 6
type Speed = 'slow' | 'normal' | 'fast'

export default function ReadingStageSelectPage() {
  const router = useRouter()
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null)
  const [selectedSpeed, setSelectedSpeed] = useState<Speed | null>(null)

  const grades: Grade[] = [1, 2, 3, 4, 5, 6]
  const speeds: { id: Speed; label: string }[] = [
    { id: 'slow', label: 'ゆっくり' },
    { id: 'normal', label: 'ふつう' },
    { id: 'fast', label: 'はやい' },
  ]

  const handleStart = () => {
    if (selectedGrade && selectedSpeed) {
      const stageId = `grade_${selectedGrade}_${selectedSpeed}`
      router.push(`/play/reading/${stageId}`)
    }
  }

  const canStart = selectedGrade !== null && selectedSpeed !== null

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-pattern flex flex-col items-center justify-start p-6 py-8">
      {/* 上部コンテンツ */}
      <div className="w-full max-w-2xl space-y-6">
        {/* タイトル */}
        <h1 className="text-5xl font-black text-orange-600 text-center mb-6">じゅんび</h1>
        {/* 学年選択 */}
        <div className="bg-white/90 rounded-[2.5rem] p-6 shadow-lg border-4 border-orange-200">
          <div className="text-center mb-4">
            <span className="inline-block bg-orange-100 text-orange-800 text-xl font-bold px-6 py-2 rounded-full">
              がくねん
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`py-3 px-6 rounded-full text-2xl font-black transition-all border-4 ${
                  selectedGrade === grade
                    ? 'bg-orange-500 text-white border-orange-600 shadow-lg'
                    : 'bg-white text-orange-800 border-orange-300 hover:border-orange-400'
                }`}
              >
                {grade}ねん
              </button>
            ))}
          </div>
        </div>

        {/* 速さ選択 */}
        <div className="bg-white/90 rounded-[2.5rem] p-6 shadow-lg border-4 border-orange-200">
          <div className="text-center mb-4">
            <span className="inline-block bg-orange-100 text-orange-800 text-xl font-bold px-6 py-2 rounded-full">
              はやさ
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {speeds.map((speed) => (
              <button
                key={speed.id}
                onClick={() => setSelectedSpeed(speed.id)}
                className={`py-3 px-6 rounded-full text-2xl font-black transition-all border-4 ${
                  selectedSpeed === speed.id
                    ? 'bg-orange-500 text-white border-orange-600 shadow-lg'
                    : 'bg-white text-orange-800 border-orange-300 hover:border-orange-400'
                }`}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 固定フッター */}
      <div className="w-full max-w-2xl mx-auto px-6 space-y-3" style={{ marginTop: '40px' }}>
        {/* スタートボタン */}
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`w-full max-w-md py-5 px-12 rounded-full text-3xl font-black text-white shadow-xl border-b-8 transition-all ${
              canStart
                ? 'bg-gradient-to-b from-green-500 to-green-600 border-green-800 hover:scale-105 active:border-b-0 active:translate-y-2'
                : 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            スタート！
          </button>
        </div>

        {/* もどるリンク */}
        <div className="text-center pb-4">
          <Link
            href="/"
            className="inline-block text-orange-800 text-xl font-bold hover:text-orange-600 transition-colors border-b-2 border-orange-800 hover:border-orange-600"
          >
            もどる
          </Link>
        </div>
      </div>

      <style jsx>{`
        .bg-pattern {
          background-color: #fff7ed;
          background-image: radial-gradient(#fed7aa 2px, transparent 2px);
          background-size: 30px 30px;
        }
      `}</style>
    </main>
  )
}
