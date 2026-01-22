'use client'

import { useState } from 'react'
import { GameButton } from '@/components/game/GameButton'
import { NarrativeProgress } from '@/components/game/NarrativeProgress'
import { EmotiveDialog } from '@/components/game/EmotiveDialog'
import { CompanionGuide } from '@/components/game/CompanionGuide'

export default function DemoPage() {
  const [buttonState, setButtonState] = useState<'idle' | 'correct' | 'wrong'>(
    'idle'
  )
  const [progress, setProgress] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogVariant, setDialogVariant] = useState<
    'joy' | 'encourage' | 'zen'
  >('joy')
  const [guideState, setGuideState] = useState<'idle' | 'loading' | 'hover'>(
    'idle'
  )
  const [guideMessage, setGuideMessage] = useState('')

  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            カスタムコンポーネント デモ
          </h1>
          <p className="text-muted-foreground">
            Phase 2.1 で実装した4つのカスタムコンポーネントの動作確認
          </p>
        </div>

        {/* GameButton デモ */}
        <section className="space-y-6 p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">1. GameButton</h2>
          <p className="text-muted-foreground">
            押下時の沈み込み、正解・不正解フィードバック機能付きボタン
          </p>

          <div className="space-y-4">
            {/* バリアント */}
            <div className="space-y-2">
              <h3 className="font-bold">バリアント</h3>
              <div className="flex gap-4 flex-wrap">
                <GameButton variant="primary">プライマリ</GameButton>
                <GameButton variant="adventure">ぼうけん</GameButton>
                <GameButton variant="writing">かく</GameButton>
                <GameButton variant="secondary">セカンダリ</GameButton>
              </div>
            </div>

            {/* サイズ */}
            <div className="space-y-2">
              <h3 className="font-bold">サイズ</h3>
              <div className="flex gap-4 items-end flex-wrap">
                <GameButton size="sm">ちいさい</GameButton>
                <GameButton size="md">ふつう</GameButton>
                <GameButton size="lg">おおきい</GameButton>
              </div>
            </div>

            {/* ステート */}
            <div className="space-y-2">
              <h3 className="font-bold">ステート (フィードバック)</h3>
              <div className="flex gap-4 flex-wrap">
                <GameButton
                  state={buttonState}
                  onClick={() => {
                    setButtonState('correct')
                    setTimeout(() => setButtonState('idle'), 1000)
                  }}
                >
                  せいかい！
                </GameButton>
                <GameButton
                  state={buttonState}
                  onClick={() => {
                    setButtonState('wrong')
                    setTimeout(() => setButtonState('idle'), 1000)
                  }}
                >
                  まちがい！
                </GameButton>
                <GameButton confetti>
                  かみふぶき
                </GameButton>
              </div>
              <p className="text-sm text-muted-foreground">
                ※ボタンをクリックすると、緑色（正解）または赤色（不正解）にアニメーションします
              </p>
            </div>
          </div>
        </section>

        {/* NarrativeProgress デモ */}
        <section className="space-y-6 p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">2. NarrativeProgress</h2>
          <p className="text-muted-foreground">
            キャラクターが歩くプログレスバー
          </p>

          <div className="space-y-4">
            <NarrativeProgress current={progress} total={100} />

            <div className="flex gap-4 flex-wrap">
              <GameButton onClick={() => setProgress(Math.max(0, progress - 10))}>
                -10
              </GameButton>
              <GameButton onClick={() => setProgress(Math.min(100, progress + 10))}>
                +10
              </GameButton>
              <GameButton onClick={() => setProgress(0)}>リセット</GameButton>
              <GameButton onClick={() => setProgress(100)}>100%</GameButton>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold">ゴールアイコンバリエーション</h3>
              <div className="space-y-2">
                <NarrativeProgress
                  current={50}
                  total={100}
                  goalIcon="treasure"
                  characterIcon="🦊"
                />
                <NarrativeProgress
                  current={75}
                  total={100}
                  goalIcon="flag"
                  characterIcon="🐶"
                />
              </div>
            </div>
          </div>
        </section>

        {/* EmotiveDialog デモ */}
        <section className="space-y-6 p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">3. EmotiveDialog</h2>
          <p className="text-muted-foreground">
            感情バリアント（Joy/Encourage/Zen）対応ダイアログ
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <GameButton
                variant="adventure"
                onClick={() => {
                  setDialogVariant('joy')
                  setDialogOpen(true)
                }}
              >
                Joy（よろこび）
              </GameButton>
              <GameButton
                variant="adventure"
                onClick={() => {
                  setDialogVariant('encourage')
                  setDialogOpen(true)
                }}
              >
                Encourage（はげまし）
              </GameButton>
              <GameButton
                variant="writing"
                onClick={() => {
                  setDialogVariant('zen')
                  setDialogOpen(true)
                }}
              >
                Zen（しゅうちゅう）
              </GameButton>
            </div>

            <EmotiveDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              variant={dialogVariant}
              title={
                dialogVariant === 'joy'
                  ? 'おめでとう！'
                  : dialogVariant === 'encourage'
                    ? 'もうすこし！'
                    : 'しゅうちゅう'
              }
              characterIcon={
                dialogVariant === 'joy'
                  ? '🎉'
                  : dialogVariant === 'encourage'
                    ? '💪'
                    : '🧘'
              }
            >
              <p>
                {dialogVariant === 'joy' && 'よくできました！つぎも がんばろう！'}
                {dialogVariant === 'encourage' &&
                  'おしい！もう いちど ちょうせんしてね'}
                {dialogVariant === 'zen' && 'しずかに こころを おちつけて…'}
              </p>
            </EmotiveDialog>
          </div>
        </section>

        {/* CompanionGuide デモ */}
        <section className="space-y-6 p-6 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">4. CompanionGuide</h2>
          <p className="text-muted-foreground">
            ローディング・ホバーガイド機能付きコンパニオン
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold">ステート</h3>
              <div className="flex gap-4 flex-wrap">
                <GameButton
                  onClick={() => {
                    setGuideState('idle')
                    setGuideMessage('')
                  }}
                >
                  Idle（アイドル）
                </GameButton>
                <GameButton
                  onClick={() => {
                    setGuideState('loading')
                    setGuideMessage('')
                  }}
                >
                  Loading（よみこみちゅう）
                </GameButton>
                <GameButton
                  onClick={() => {
                    setGuideState('hover')
                    setGuideMessage('これは おと の おおきさ だよ')
                  }}
                >
                  Hover（メッセージひょうじ）
                </GameButton>
              </div>
            </div>

            <div className="h-64 relative bg-slate-50 rounded-lg">
              <p className="absolute top-4 left-4 text-sm text-muted-foreground">
                ※右下にコンパニオンが表示されます
              </p>
              <CompanionGuide
                state={guideState}
                message={guideMessage}
                characterIcon="🦊"
                position="bottom-right"
              />
            </div>
          </div>
        </section>

        {/* フッター */}
        <div className="text-center space-y-4 pt-8">
          <p className="text-muted-foreground">
            全コンポーネントの動作確認が完了しました
          </p>
          <GameButton onClick={() => window.location.href = '/'}>
            ホームにもどる
          </GameButton>
        </div>
      </div>
    </div>
  )
}
