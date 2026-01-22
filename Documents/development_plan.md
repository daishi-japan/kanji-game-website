# 開発計画：あつまれ！漢字の森

**最終更新**: 2026-01-21
**ステータス**: Phase 0 (準備中)

---

## プロジェクト概要

**プロジェクト名**: あつまれ!漢字の森
**コンセプト**: 「勉強を『攻略』に上書きする」
**ターゲット**: 7歳の小学1年生とその保護者
**技術スタック**: Next.js App Router, Supabase, Tailwind CSS, Shadcn UI, Framer Motion

**設計進捗**: 100% 完了
**実装進捗**: 0% (これから開始)

---

## 開発方針

### ハーネスベースの開発サイクル

本プロジェクトでは **[Claude Code Harness](https://github.com/Chachamaru127/claude-code-harness)** を採用します。

**3つのコマンド**:
- `/plan-with-agent`: 機能ごとの実装計画策定
- `/work`: 並列ワーカーによる実装（自己レビュー付き）
- `/harness-review`: 8名の専門家による多角的コードレビュー

**デグレード対策**:
- 実装 → 自己レビュー → 修正 → コミット の自動サイクル
- セキュリティ・パフォーマンス・アクセシビリティ・保守性を並列検証
- CI/CD パイプラインでの自動テスト必須化

### SSOT (Single Source of Truth)

プロジェクトルートに以下の3ファイルを配置し、開発全体の一貫性を維持：

- **`Plans.md`**: 実装タスクのマスタープラン
- **`decisions.md`**: 技術的意思決定とその理由
- **`patterns.md`**: プロジェクト統一の実装パターン

---

## 実装フェーズ構成

### Phase 0: 準備 (1日)

**目標**: プロジェクト基盤とハーネス環境のセットアップ

#### タスク

**0.1 SSOT ファイル作成**
- [ ] `Plans.md` の初期化
- [ ] `decisions.md` の初期化
- [ ] `patterns.md` の初期化

**0.2 ハーネス設定**
- [ ] Claude Code Harness のインストール確認
- [ ] `.claude-code-harness.config.yaml` の作成（任意）

**0.3 プロジェクト構造確認**
- [ ] 既存ドキュメントの整合性確認
- [ ] Git リポジトリの状態確認

**成果物**:
- SSOT ファイル3つ
- ハーネス実行環境

---

### Phase 1: プロジェクト基盤構築 (Week 1)

**目標**: Next.js + Supabase の基盤を構築し、認証システムを実装する

#### 1.1 Next.js プロジェクト初期化

**タスク**:
- [ ] Next.js App Router プロジェクトの作成
- [ ] TypeScript 設定 (`tsconfig.json`)
- [ ] ESLint + Prettier の設定
- [ ] Tailwind CSS のインストールと設定
- [ ] Shadcn UI のインストールと初期設定
- [ ] Framer Motion のインストール

**実装ファイル**:
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `.eslintrc.json`
- `.prettierrc`
- `components.json` (Shadcn UI設定)

**検証方法**:
- `npm run dev` で開発サーバーが起動
- `npm run lint` でエラーなし
- `npm run build` でビルド成功

**ハーネス活用**:
```bash
/plan-with-agent "Next.js App Router プロジェクトのセットアップ。TypeScript, Tailwind CSS, Shadcn UI, Framer Motion を含む。"
/work
/harness-review
```

---

#### 1.2 Supabase セットアップ

**タスク**:
- [ ] Supabase プロジェクト作成（Web UI）
- [ ] 環境変数の設定 (`.env.local`)
- [ ] Supabase クライアントの設定 (`lib/supabase/client.ts`)
- [ ] データベーススキーマの実装（SQL実行）
- [ ] RLS (Row Level Security) ポリシーの設定
- [ ] トリガー関数の実装 (`handle_new_user` など)
- [ ] Database Functions (RPC) の実装（4関数）

**データベーステーブル（11テーブル）**:
1. `profiles` - ユーザー情報
2. `characters` - キャラクターマスタ
3. `user_characters` - ユーザーが所持しているキャラクター
4. `items` - アイテムマスタ
5. `user_items` - ユーザーのアイテムインベントリ
6. `kanjis` - 漢字マスタ
7. `learning_logs` - プレイ履歴
8. `missions` - デイリーミッションマスタ
9. `user_missions` - ユーザーのミッション進捗
10. `parent_rewards` - 保護者が設定したご褒美
11. `user_room_config` - マイルーム配置情報

**Database Functions (RPC)**:
1. `rpc_finish_game` - ゲーム結果処理・ドロップ抽選・ミッション更新
2. `rpc_feed_character` - エサ消費・経験値加算
3. `rpc_evolve_character` - 進化条件チェック・進化実行
4. `rpc_process_login_bonus` - ログインボーナス処理

**実装ファイル**:
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `supabase/migrations/*.sql` (SQLファイル)

**検証方法**:
- Supabase ダッシュボードで全テーブル作成確認
- RLS ポリシーが正しく設定されているか確認
- SQL Editor で RPC 関数のテスト実行

**ハーネス活用**:
```bash
/plan-with-agent "Supabaseのデータベーススキーマ実装。11テーブル、RLSポリシー、4つのRPC関数を含む。詳細は Documents/database_design.md を参照。"
/work
/harness-review
```

**関連ドキュメント**: `Documents/database_design.md`

---

#### 1.3 認証システム

**タスク**:
- [ ] Supabase Auth の統合
- [ ] 初回登録画面の実装 (`app/register/page.tsx`)
- [ ] オートログイン機能の実装
- [ ] セッション管理ミドルウェア (`middleware.ts`)
- [ ] 保護者認証ゲートの実装 (`app/parent/auth/page.tsx`)

**実装ファイル**:
- `app/register/page.tsx` - 初回登録画面
- `app/actions/auth.ts` - 認証関連 Server Actions
- `middleware.ts` - セッション検証
- `app/parent/auth/page.tsx` - 保護者認証画面
- `components/auth/ParentGate.tsx` - 計算問題コンポーネント

**機能詳細**:

**初回登録**:
- ひらがなで名前入力（最大10文字）
- 匿名認証でSupabase Authにユーザー作成
- `profiles` テーブルにレコード作成

**オートログイン**:
- セッションCookieの永続化
- 2回目以降は自動ログイン

**保護者認証ゲート**:
- 簡単な計算問題（例: 7 + 5 = ?）
- 正解で保護者メニューへ遷移
- 不正解は3回までリトライ可能

**検証方法**:
- 初回登録フローの完了確認
- ブラウザ再起動後の自動ログイン確認
- 保護者認証の正常・異常系テスト

**ハーネス活用**:
```bash
/plan-with-agent "認証システムの実装。Supabase Auth統合、初回登録画面、オートログイン、保護者認証ゲートを含む。"
/work
/harness-review
```

**関連ドキュメント**:
- `Documents/screen_design.md` (S01: 初回登録, S07: 保護者認証)
- `Documents/api_design.md` (認証関連Server Actions)

---

#### 1.4 テストの整備

**タスク**:
- [ ] Jest + React Testing Library のセットアップ
- [ ] Playwright のセットアップ
- [ ] 認証フローのE2Eテスト作成
- [ ] CI/CD パイプライン設定 (GitHub Actions)

**実装ファイル**:
- `jest.config.js`
- `playwright.config.ts`
- `__tests__/auth/*.test.tsx` - 認証の単体テスト
- `e2e/auth.spec.ts` - 認証のE2Eテスト
- `.github/workflows/test.yml` - CI設定

**テストケース**:
1. 初回登録の正常系
2. オートログインの動作確認
3. 保護者認証の正解・不正解パターン
4. セッション期限切れ時の挙動

**検証方法**:
- `npm test` で全テストがパス
- `npm run test:e2e` でE2Eテストがパス
- GitHub Actions で自動実行確認

**ハーネス活用**:
```bash
/plan-with-agent "テスト環境のセットアップ。Jest, React Testing Library, Playwright, GitHub Actionsを含む。"
/work
/harness-review
```

---

#### Phase 1 成果物

**完成物**:
- Next.js プロジェクト基盤
- Supabase データベース（11テーブル + RPC関数）
- 認証システム（初回登録 + オートログイン + 保護者認証）
- テスト環境（単体テスト + E2E）
- CI/CD パイプライン

**検証チェックリスト**:
- [ ] 開発サーバーが起動する
- [ ] ビルドが成功する
- [ ] Lint エラーなし
- [ ] 全テストがパス
- [ ] Supabase接続確認
- [ ] 初回登録 → オートログインの動作確認
- [ ] 保護者認証が正しく機能

---

### Phase 2-8: 概要

#### Phase 2: コアゲームロジック (Week 2-3)
- カスタムコンポーネント開発（GameButton, NarrativeProgress, EmotiveDialog, CompanionGuide）
- 読み攻略モード（落ち物パズル）実装
- 書き攻略モード（書き順練習）実装
- ゲームロジックの単体テスト

#### Phase 3: キャラクター・コレクション (Week 4)
- 図鑑システム実装
- キャラ詳細・育成機能
- マイルーム機能
- エサやり・進化システム

#### Phase 4: リザルト・報酬システム (Week 5)
- ゲームリザルト画面
- ドロップ抽選ロジック
- ログインボーナス
- デイリーミッション

#### Phase 5: 保護者機能 (Week 6)
- 保護者ダッシュボード
- 学習サマリー表示
- カスタムご褒美機能
- ご褒美サプライズ演出

#### Phase 6: 画面実装・統合 (Week 7-8)
- 12画面の実装と統合
- Server Actions 実装（12個）
- 画面遷移の動作確認
- レスポンシブ対応

#### Phase 7: テスト・品質保証 (Week 9)
- 全機能の自動テスト整備
- ハーネスによる包括的レビュー
- デバイス対応テスト
- パフォーマンス最適化

#### Phase 8: デプロイ・運用準備 (Week 10)
- Vercel デプロイ設定
- 本番環境セットアップ
- 監視・ログ設定
- ドキュメント整備

**詳細は実装進捗に応じて本ドキュメントに追記します。**

---

## デグレード対策

### 1. 開発フローでの対策

**標準フロー**:
```
機能実装 → 単体テスト作成 → 自己レビュー → 統合テスト → コミット
```

**ハーネスによる自動化**:
- `/work` コマンドで並列ワーカーが自動的に上記フローを実行
- 各ワーカーはグリーン状態（テストパス）を確認してからコミット

### 2. コードレビューでの対策

**`/harness-review` の活用**:
- 新機能追加時（必須）
- 大規模リファクタリング時（必須）
- 週次での全体レビュー（推奨）

**8名の専門家によるチェック項目**:
1. **セキュリティ**: XSS, SQL Injection, 認証・認可の脆弱性
2. **パフォーマンス**: バンドルサイズ, レンダリング速度, DBクエリ最適化
3. **アクセシビリティ**: WCAG 2.1 AA準拠, キーボード操作, スクリーンリーダー
4. **保守性**: コード可読性, 命名規則, TypeScript型定義
5. **UI/UX**: ユーザビリティ, 一貫性
6. **データ整合性**: トランザクション処理, 例外ハンドリング
7. **エラーハンドリング**: ユーザーフレンドリーなエラー表示
8. **テスト網羅性**: カバレッジ, エッジケース

### 3. CI/CD での対策

**GitHub Actions 自動チェック**:
- Lint チェック
- 単体テスト実行
- 統合テスト実行
- カバレッジレポート生成（目標80%以上）
- ビルド成功確認

**マージ前の必須条件**:
- すべてのテストがパス
- カバレッジが閾値以上
- Lint エラーなし

### 4. SSOT による一貫性維持

**`decisions.md`**: 技術的意思決定を記録し、後続実装の矛盾を防ぐ

**`patterns.md`**: プロジェクト統一の実装パターンを定義

例:
```markdown
## Server Action のエラーハンドリング

すべての Server Action は以下の戻り値型を使用：

type ActionResult<T> = {
  success: boolean;
  error?: string;
  data?: T;
}
```

### 5. 継続的な品質改善

**定期レビューサイクル**:
- 毎週金曜: 週次レビュー会議
- 各フェーズ終了時: ハーネスによる全体レビュー
- リリース前: 包括的なQAテスト

**フィードバックループ**:
1. 本番環境での問題検出（Sentry, Vercel Analytics）
2. 問題の分析・根本原因の特定
3. テストケースの追加
4. 修正実装
5. ハーネスレビューでの再検証

---

## 重要ファイルパス

### 設計ドキュメント
- **全体計画**: `Documents/planning_document.md`
- **Epic定義**: `Documents/epics/*.md`
- **DB設計**: `Documents/database_design.md`
- **API設計**: `Documents/api_design.md`
- **UI/UX設計**: `Documents/ui_ux_design.md`
- **画面設計**: `Documents/screen_design.md`
- **開発ルール**: `Documents/00_rules.mcd`
- **開発ログ**: `Documents/00_log.md`

### SSOT (プロジェクトルート)
- **タスク計画**: `Plans.md`
- **技術決定**: `decisions.md`
- **実装パターン**: `patterns.md`

### 実装（予定）
- **カスタムコンポーネント**: `components/ui/*.tsx`
- **ゲームロジック**: `lib/game/*.ts`
- **Server Actions**: `app/actions/*.ts`
- **画面**: `app/**/page.tsx`

---

## 次のアクション

1. **Phase 0 の完了**
   - SSOT ファイル3つの作成
   - ハーネス環境の確認

2. **Phase 1 の開始**
   - `/plan-with-agent` でタスク1.1（Next.jsセットアップ）の詳細計画
   - `/work` で実装開始
   - `/harness-review` で品質確認

3. **このドキュメントの更新**
   - Phase 1 完了後、Phase 2の詳細を追記
   - 進捗に応じてステータスを更新
