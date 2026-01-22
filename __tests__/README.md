# テストガイド

## 概要

このプロジェクトでは、以下の3種類のテストを実装しています：

1. **単体テスト (Unit Tests)** - Jest + React Testing Library
2. **E2Eテスト (End-to-End Tests)** - Playwright
3. **型チェック** - TypeScript

## テストの実行

### 単体テスト

```bash
# ウォッチモードで実行（開発中）
npm test

# 1回だけ実行
npm run test:ci

# カバレッジ付きで実行
npm run test:ci
```

### E2Eテスト

```bash
# ヘッドレスモードで実行
npm run test:e2e

# UIモードで実行（対話的）
npm run test:e2e:ui

# ブラウザを表示して実行
npm run test:e2e:headed
```

### 型チェック

```bash
npm run type-check
```

### すべてのテストを実行

```bash
npm run type-check && npm run test:ci && npm run test:e2e
```

## テスト構造

```
__tests__/
├── components/       # コンポーネントの単体テスト
│   └── auth/
│       └── ParentGate.test.tsx
├── actions/          # Server Actionsの単体テスト（未実装）
└── README.md         # このファイル

e2e/
└── auth.spec.ts      # 認証フローのE2Eテスト
```

## 単体テストの書き方

### 基本パターン

```typescript
import { render, screen } from '@testing-library/react'
import { ComponentName } from '@/components/ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

### Server Actionsのモック

```typescript
import { actionName } from '@/app/actions/auth'

jest.mock('@/app/actions/auth', () => ({
  actionName: jest.fn(),
}))

// テスト内で使用
;(actionName as jest.Mock).mockResolvedValue({
  success: true,
  data: {},
})
```

### ユーザーインタラクション

```typescript
import { fireEvent, waitFor } from '@testing-library/react'

// ボタンクリック
fireEvent.click(screen.getByRole('button'))

// 入力
fireEvent.change(screen.getByPlaceholderText('Input'), {
  target: { value: 'test value' },
})

// 非同期待機
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

## E2Eテストの書き方

### 基本パターン

```typescript
import { test, expect } from '@playwright/test'

test('test description', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading')).toBeVisible()
})
```

### セッション管理

```typescript
// セッションをクリア
await context.clearCookies()

// 新しいページでセッションを共有
const newPage = await page.context().newPage()
```

## CI/CD

GitHub Actionsで自動実行されます：

- **Push時**: main, develop ブランチ
- **Pull Request時**: すべてのPR

### ワークフロー

1. **lint**: TypeScript型チェックとLint
2. **unit-test**: 単体テスト + カバレッジ
3. **e2e-test**: E2Eテスト
4. **build**: ビルドテスト

## カバレッジ

単体テストのカバレッジ目標：

- **全体**: 80%以上
- **重要な機能**: 90%以上

カバレッジレポートは `coverage/` ディレクトリに生成されます。

## トラブルシューティング

### Jest テストが失敗する

```bash
# キャッシュをクリア
npx jest --clearCache

# 再インストール
rm -rf node_modules
npm install
```

### Playwright テストが失敗する

```bash
# ブラウザを再インストール
npx playwright install

# デバッグモードで実行
npx playwright test --debug
```

### 型エラー

```bash
# TypeScript 型定義を再生成
rm -rf .next
npm run dev
```

## ベストプラクティス

### 単体テスト

- ✅ 1つのテストで1つのことだけをテスト
- ✅ テスト名は「何をテストするか」を明確に
- ✅ Arrange-Act-Assert パターンを使用
- ❌ 実装の詳細をテストしない
- ❌ 他のテストに依存しない

### E2Eテスト

- ✅ ユーザーの視点でテスト
- ✅ クリティカルなフローを優先
- ✅ テストデータは独立して準備
- ❌ UIの細かい部分をテストしない
- ❌ 単体テストの代わりにしない

## 参考資料

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
