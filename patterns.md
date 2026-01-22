# patterns.md - 実装パターン

**プロジェクト**: あつまれ！漢字の森
**最終更新**: 2026-01-21

---

## 概要

このファイルは **Single Source of Truth (SSOT)** として、プロジェクト全体で統一する実装パターンを定義します。
すべての実装者はこのパターンに従い、コードの一貫性を維持します。

---

## Server Actions

### 戻り値の型定義

**すべての Server Action は以下の戻り値型を使用します**:

```typescript
type ActionResult<T> = {
  success: boolean;
  error?: string;
  data?: T;
}
```

### 実装パターン

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

export async function exampleAction(
  param: string
): Promise<ActionResult<ReturnType>> {
  try {
    const supabase = createClient()

    // セッション検証
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: '認証エラー' }
    }

    // ビジネスロジック
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: 'データ取得エラー' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('exampleAction error:', error)
    return { success: false, error: '予期しないエラーが発生しました' }
  }
}
```

### エラーハンドリング

**正常系**:
```typescript
return { success: true, data: result }
```

**異常系（ユーザーエラー）**:
```typescript
return { success: false, error: 'わかりやすいエラーメッセージ' }
```

**異常系（システムエラー）**:
```typescript
console.error('Function name error:', error)
return { success: false, error: '予期しないエラーが発生しました' }
```

---

## コンポーネント

### ファイル配置ルール

```
components/
├── ui/              # Shadcn UI コンポーネント（自動生成）
├── game/            # ゲーム関連のカスタムコンポーネント
├── collection/      # 図鑑・キャラクター関連
├── auth/            # 認証関連
├── parent/          # 保護者機能関連
└── layout/          # レイアウト関連（ヘッダー、フッターなど）
```

### コンポーネント命名規則

- **PascalCase** を使用
- 機能を表す名詞
- 例: `GameButton.tsx`, `CharacterCard.tsx`, `FeedingInterface.tsx`

### Props の型定義

```typescript
interface ComponentNameProps {
  // 必須プロパティ
  requiredProp: string
  // オプションプロパティ
  optionalProp?: number
  // イベントハンドラ
  onAction?: () => void
}

export function ComponentName({
  requiredProp,
  optionalProp = 0,
  onAction
}: ComponentNameProps) {
  // ...
}
```

---

## データフェッチ

### Server Components でのデータフェッチ

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Page() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/register')
  }

  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    // エラーハンドリング
  }

  return <div>{/* データを使用 */}</div>
}
```

### Client Components でのデータフェッチ

**Server Actions を使用**:

```typescript
'use client'

import { useEffect, useState } from 'react'
import { fetchData } from '@/app/actions/data'

export function ClientComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const result = await fetchData()
      if (result.success) {
        setData(result.data)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) return <div>Loading...</div>

  return <div>{/* データを使用 */}</div>
}
```

---

## エラー表示

### ユーザーフレンドリーなエラーメッセージ

**子供向け（ゲーム内）**:
- 「あれれ？うまくいかなかったみたい。もう一度ためしてね！」
- 「ちょっとまってね...」
- 「おっと！なにかがおかしいみたい。」

**保護者向け（保護者メニュー）**:
- 「データの読み込みに失敗しました。ページを再読み込みしてください。」
- 「設定の保存に失敗しました。もう一度お試しください。」

### エラー表示コンポーネント

```typescript
import { EmotiveDialog } from '@/components/ui/EmotiveDialog'

// 子供向け
<EmotiveDialog
  mode="Encourage"
  message="あれれ？うまくいかなかったみたい。もう一度ためしてね！"
/>

// 保護者向け
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>エラー</AlertTitle>
  <AlertDescription>
    データの読み込みに失敗しました。ページを再読み込みしてください。
  </AlertDescription>
</Alert>
```

---

## スタイリング

### Tailwind CSS クラスの順序

1. レイアウト: `flex`, `grid`, `block`, etc.
2. 位置: `absolute`, `relative`, `top`, `left`, etc.
3. サイズ: `w-*`, `h-*`, `min-w-*`, etc.
4. 余白: `p-*`, `m-*`, etc.
5. テキスト: `text-*`, `font-*`, etc.
6. 背景・ボーダー: `bg-*`, `border-*`, etc.
7. その他: `rounded-*`, `shadow-*`, etc.
8. 状態: `hover:*`, `focus:*`, `active:*`, etc.

**例**:
```tsx
<div className="flex items-center justify-center w-full h-screen p-4 text-lg font-bold bg-primary rounded-lg shadow-md hover:bg-primary/90">
  ...
</div>
```

### カスタムクラスの定義

`app/globals.css` に定義:

```css
@layer components {
  .game-button {
    @apply px-6 py-3 text-xl font-bold bg-primary text-primary-foreground rounded-full shadow-lg transition-transform active:scale-95;
  }
}
```

---

## アニメーション (Framer Motion)

### 基本パターン

```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  コンテンツ
</motion.div>
```

### 再利用可能なアニメーションバリアント

```typescript
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

<motion.div {...fadeInUp}>
  コンテンツ
</motion.div>
```

### ボタンのタップアニメーション

```typescript
<motion.button
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  クリック
</motion.button>
```

---

## テスト

### 単体テスト (Jest + React Testing Library)

```typescript
import { render, screen } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName prop="value" />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle click event', async () => {
    const handleClick = jest.fn()
    render(<ComponentName onClick={handleClick} />)

    const button = screen.getByRole('button')
    await userEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### E2E テスト (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('user can register and login', async ({ page }) => {
  await page.goto('/')

  // 初回登録
  await page.fill('input[name="name"]', 'よりちゃん')
  await page.click('button[type="submit"]')

  // ホーム画面に遷移
  await expect(page).toHaveURL('/home')
  await expect(page.locator('h1')).toContainText('ホーム')
})
```

---

## ディレクトリ構造

```
kanji-game-website/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 認証関連のルートグループ
│   │   └── register/
│   ├── (game)/              # ゲーム関連のルートグループ
│   │   ├── play/
│   │   └── result/
│   ├── actions/             # Server Actions
│   │   ├── auth.ts
│   │   ├── game.ts
│   │   └── character.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/              # React コンポーネント
│   ├── ui/                  # Shadcn UI コンポーネント
│   ├── game/
│   ├── collection/
│   ├── auth/
│   └── parent/
├── lib/                     # ユーティリティ・ヘルパー
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── game/                # ゲームロジック
│   └── utils.ts
├── supabase/                # Supabase関連
│   └── migrations/          # マイグレーションSQL
├── __tests__/               # 単体テスト
├── e2e/                     # E2Eテスト
├── public/                  # 静的ファイル
├── Documents/               # 設計ドキュメント
├── Plans.md                 # タスク計画（SSOT）
├── decisions.md             # 技術決定（SSOT）
└── patterns.md              # 実装パターン（SSOT）
```

---

## Git コミットメッセージ

### 形式

```
<type>: <subject>

<body>
```

### Type の種類

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `style`: コードフォーマット（機能変更なし）
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルド、設定変更

### 例

```
feat: 初回登録画面の実装

- ひらがな入力フォームを追加
- 匿名認証でユーザー作成
- プロフィールテーブルへの登録処理
```

---

## 環境変数

### `.env.local` の形式

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# その他（将来追加予定）
# NEXT_PUBLIC_ANALYTICS_ID=
```

### アクセス方法

```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

---

## 今後追加予定のパターン

実装進捗に応じて以下のパターンを追加します：

- **画像・音声アセットの読み込みパターン**
- **アニメーション演出の共通パターン**
- **ゲームロジックの実装パターン**
- **デプロイ前のチェックリスト**

---

## 変更履歴

| 日付 | 変更内容 | 変更者 |
|------|---------|-------|
| 2026-01-21 | 初版作成（Server Actions、コンポーネント、データフェッチ、エラー表示、スタイリング、アニメーション、テスト、ディレクトリ構造、Git、環境変数のパターンを定義） | Development Team |
