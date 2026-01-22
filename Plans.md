# Plans.md - マスタープラン

**プロジェクト**: あつまれ！漢字の森
**最終更新**: 2026-01-21
**現在のフェーズ**: Phase 1 (プロジェクト基盤構築)

---

## 概要

このファイルは **Single Source of Truth (SSOT)** として、プロジェクト全体の実装タスクを管理します。
Claude Code Harness の `/plan-with-agent` および `/work` コマンドがこのファイルを参照します。

---

## 現在の優先タスク

### Phase 0: 準備 ✅ 完了

**目標**: プロジェクト基盤とハーネス環境のセットアップ

- [x] `Plans.md` の作成
- [x] `decisions.md` の作成
- [x] `patterns.md` の作成
- [x] `Documents/development_plan.md` の作成
- [x] 開発ログ更新 (`Documents/00_log.md`)

---

## Phase 1: プロジェクト基盤構築

### 1.1 Next.js プロジェクト初期化

**ステータス**: ✅ 完了

**タスク**:
- [x] Next.js App Router プロジェクト作成
- [x] TypeScript 設定
- [x] Prettier 設定
- [x] Tailwind CSS v4 インストール・設定
- [x] Framer Motion インストール
- [x] ディレクトリ構造の整備
- [x] 基本レイアウトとホーム画面作成

**成果物**:
- `package.json`
- `tsconfig.json`
- `postcss.config.mjs`
- `.prettierrc`
- `.gitignore`
- `next.config.js`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`

**検証**:
- [x] `npm run dev` で開発サーバー起動
- [x] `npm run build` でビルド成功
- [x] http://localhost:3000 でページ表示確認

---

### 1.2 Supabase セットアップ

**ステータス**: ✅ 完了

**タスク**:
- [x] Supabase クライアントライブラリインストール
- [x] Supabase クライアント設定 (`lib/supabase/client.ts`, `lib/supabase/server.ts`)
- [x] 環境変数テンプレート作成 (`.env.example`)
- [x] データベーススキーマ実装（11テーブル）
- [x] RLS ポリシー設定（全テーブル）
- [x] トリガー関数実装 (`handle_new_user`, `update_updated_at_column`)
- [x] RPC 関数実装（4関数）
- [x] セットアップガイド作成 (`supabase/README.md`)

**成果物**:
- `lib/supabase/client.ts` - ブラウザ用Supabaseクライアント
- `lib/supabase/server.ts` - サーバー用Supabaseクライアント
- `.env.example` - 環境変数テンプレート
- `supabase/migrations/20260121_initial_schema.sql` - 包括的なスキーマ定義
- `supabase/README.md` - セットアップ手順書

**実装内容**:
- 11テーブル（profiles, characters, items, kanjis, missions, user_characters, user_items, learning_logs, user_missions, user_room_config, parent_rewards）
- RLSポリシー（マスタデータ読み取り、ユーザーデータ自分のみ操作）
- トリガー（新規ユーザー自動作成、updated_at自動更新）
- RPC関数（rpc_finish_game, rpc_feed_character, rpc_evolve_character, rpc_process_login_bonus）

**参照**: `Documents/database_design.md`, `supabase/README.md`

---

### 1.3 認証システム

**ステータス**: ✅ 完了

**タスク**:
- [x] 初回登録画面実装 (`app/register/page.tsx`)
- [x] 認証 Server Actions 実装 (`app/actions/auth.ts`)
- [x] セッション管理ミドルウェア (`middleware.ts`)
- [x] 保護者認証ゲート実装 (`app/parent/auth/page.tsx`)
- [x] ParentGate コンポーネント実装 (`components/auth/ParentGate.tsx`)
- [x] ホーム画面更新（ユーザー名表示、保護者メニューリンク）
- [x] 保護者ダッシュボード（プレースホルダー）実装

**成果物**:
- `app/register/page.tsx` - 初回登録画面（ひらがな名前入力）
- `app/actions/auth.ts` - 認証Server Actions（registerUser, getCurrentUser, verifyParentGate, signOut）
- `middleware.ts` - セッション管理・リダイレクト処理
- `app/parent/auth/page.tsx` - 保護者認証ページ
- `components/auth/ParentGate.tsx` - 計算問題ゲートコンポーネント
- `app/parent/dashboard/page.tsx` - 保護者ダッシュボード
- `app/page.tsx` - ホーム画面（更新）

**実装内容**:
- Supabase匿名認証による初回登録
- セッションCookieによるオートログイン
- ミドルウェアでの未認証リダイレクト
- 計算問題（7+5=12）による保護者認証
- プロフィール情報の表示（名前、連続ログイン日数）

**参照**: `Documents/screen_design.md` (S01, S07)

---
### 1.4 テストの整備

**ステータス**: ✅ 完了

**タスク**:
- [x] Jest + React Testing Library セットアップ
- [x] Playwright セットアップ
- [x] 認証フローの単体テスト作成（ParentGateコンポーネント）
- [x] 認証フローのE2Eテスト作成（5つのシナリオ）
- [x] GitHub Actions CI設定
- [x] テストスクリプトの追加
- [x] テストドキュメント作成

**成果物**:
- `jest.config.js` - Jest設定
- `jest.setup.js` - Jest セットアップファイル
- `playwright.config.ts` - Playwright設定
- `__tests__/components/auth/ParentGate.test.tsx` - ParentGateの単体テスト（6テストケース）
- `e2e/auth.spec.ts` - 認証フローのE2Eテスト（5シナリオ）
- `__tests__/README.md` - テストガイド
- `.github/workflows/test.yml` - CI/CD設定
- `package.json` - テストスクリプト追加

**実装内容**:
- Jest + React Testing Library による単体テスト環境
- Playwright による E2E テスト環境（5ブラウザ対応）
- GitHub Actions による自動テスト（lint, unit-test, e2e-test, build）
- カバレッジレポート（ParentGateコンポーネント: 80.76%）
- テストドキュメント・ベストプラクティス

**テストケース**:
- **単体テスト**: 計算問題表示、正解・不正解処理、キャンセル、バリデーション
- **E2Eテスト**: 初回登録フロー、オートログイン、リダイレクト、保護者認証、入力バリデーション

**検証**:
- [x] 単体テスト全6件パス
- [x] カバレッジレポート生成
- [x] テストスクリプト動作確認
- [x] `npm run test:ci` で全テストパス
- [x] E2Eテスト環境構築完了
- [x] GitHub Actions CI/CD設定完了

---

## Phase 2: コアゲームロジック

### 2.1 カスタムコンポーネント（4種）

**ステータス**: ✅ 完了

**タスク**:
- [x] GameButton コンポーネント実装
- [x] NarrativeProgress コンポーネント実装
- [x] EmotiveDialog コンポーネント実装
- [x] CompanionGuide コンポーネント実装
- [x] 各コンポーネントの単体テスト作成（44テスト）
- [x] lucide-react アイコンライブラリ導入

**成果物**:
- `components/game/GameButton.tsx` - 押下時沈み込み、正解・不正解フィードバック機能付きボタン
- `components/game/NarrativeProgress.tsx` - キャラクター歩行アニメーション付きプログレスバー
- `components/game/EmotiveDialog.tsx` - 感情バリアント（Joy/Encourage/Zen）対応ダイアログ
- `components/game/CompanionGuide.tsx` - ローディング・ホバーガイド機能付きコンパニオン
- `__tests__/components/game/GameButton.test.tsx` - 9テストケース
- `__tests__/components/game/NarrativeProgress.test.tsx` - 10テストケース
- `__tests__/components/game/EmotiveDialog.test.tsx` - 11テストケース
- `__tests__/components/game/CompanionGuide.test.tsx` - 8テストケース

**実装内容**:
- Framer Motion による滑らかなアニメーション
- state 管理によるフィードバック演出（correct/wrong）
- 視覚・聴覚フィードバック機構（将来的に音声追加予定）
- レスポンシブ対応（variant, size プロパティ）
- アクセシビリティ配慮（大きなタッチターゲット、ARIA対応）

**テスト結果**:
- ✅ 全44テストパス
- カバレッジ: GameButton 95.45%, NarrativeProgress 100%, EmotiveDialog 100%, CompanionGuide 70.83%
- 総合カバレッジ（components/game）: 86.66%

**検証**:
- [x] 全テストパス確認
- [x] カバレッジレポート生成
- [x] アニメーション動作確認（ビルド成功）

---

## Phase 2-8 (概要)

### Phase 2: コアゲームロジック (Week 2-3)
- [x] 2.1 カスタムコンポーネント（4種）
- [ ] 2.2 読み攻略モード
- [ ] 2.3 書き攻略モード

### Phase 3: キャラクター・コレクション (Week 4)
- 図鑑システム
- キャラ育成
- マイルーム

### Phase 4: リザルト・報酬システム (Week 5)
- リザルト画面
- ログインボーナス
- デイリーミッション

### Phase 5: 保護者機能 (Week 6)
- 保護者ダッシュボード
- カスタムご褒美

### Phase 6: 画面実装・統合 (Week 7-8)
- 12画面の実装
- Server Actions（12個）

### Phase 7: テスト・品質保証 (Week 9)
- 自動テスト整備
- ハーネスレビュー
- デバイス対応テスト

### Phase 8: デプロイ・運用準備 (Week 10)
- Vercel デプロイ
- 監視設定
- ドキュメント整備

**詳細タスクは各フェーズ開始時に追記します。**

---

## 完了したタスク

### Phase 0
- [x] `Plans.md` 作成
- [x] `decisions.md` 作成
- [x] `patterns.md` 作成

### Phase 1
- [x] 1.1 Next.js プロジェクト初期化
- [x] 1.2 Supabase セットアップ
- [x] 1.3 認証システム
- [x] 1.4 テストの整備

### Phase 2
- [x] 2.1 カスタムコンポーネント（4種）

---

## ブロッカー・課題

現在のブロッカーはありません。

---

## 参考資料

- **設計ドキュメント**: `Documents/*.md`
- **開発計画**: `Documents/development_plan.md`
- **技術決定**: `decisions.md`
- **実装パターン**: `patterns.md`
