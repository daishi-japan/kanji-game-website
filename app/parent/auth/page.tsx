'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ParentGate } from '@/components/auth/ParentGate'

export default function ParentAuthPage() {
  const router = useRouter()
  const [showGate, setShowGate] = useState(true)

  const handleVerified = () => {
    // 認証成功 → 保護者ダッシュボードへ
    router.push('/parent/dashboard')
  }

  const handleCancel = () => {
    // キャンセル → ホームへ戻る
    router.push('/')
  }

  if (!showGate) {
    return null
  }

  return <ParentGate onVerified={handleVerified} onCancel={handleCancel} />
}
