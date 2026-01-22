# decisions.md - 技術的意思決定記録

**プロジェクト**: あつまれ！漢字の森
**最終更新**: 2026-01-21

---

## 概要

このファイルは **Single Source of Truth (SSOT)** として、プロジェクトの技術的意思決定とその理由を記録します。
後続の実装で矛盾を防ぎ、一貫性を維持するために使用します。

---

## 2026-01-21: プロジェクト基盤の技術選定

### フレームワーク: Next.js App Router

**決定**: Next.js 15 (App Router) を採用

**理由**:
- Server Actions により、API Routes不要でバックエンドロジックを実装可能
- Server Components でサーバーサイドでのデータフェッチが容易
- Vercel への簡単なデプロイ
- TypeScript フルサポート
- Image Optimization, Font Optimization などの最適化機能

**代替案**:
- Remix: Server Actions がないため却下
- Vite + React: SSR設定が複雑なため却下

---

### バックエンド: Supabase

**決定**: Supabase (PostgreSQL + Auth + Realtime) を採用

**理由**:
- PostgreSQL の強力なRLS (Row Level Security) でデータセキュリティを確保
- Supabase Auth で認証・認可を簡単に実装
- Database Functions (RPC) でトランザクション処理を実現
- Next.js との相性が良い（Server Actions から直接呼び出し可能）
- 無料枠で開発・小規模運用が可能

**代替案**:
- Firebase: NoSQL のためリレーショナルデータの扱いが複雑
- Prisma + Vercel Postgres: RLS が使えないためセキュリティ面で劣る

---

### スタイリング: Tailwind CSS + Shadcn UI

**決定**: Tailwind CSS をベースに、Shadcn UI のコンポーネントを活用

**理由**:
- Tailwind CSS はユーティリティファーストで開発速度が高い
- Shadcn UI は Radix UI ベースでアクセシビリティが高い
- コンポーネントをプロジェクトにコピーして自由にカスタマイズ可能
- Framer Motion との統合が容易

**代替案**:
- MUI (Material-UI): デザイン自由度が低い
- Chakra UI: バンドルサイズが大きい

---

### アニメーション: Framer Motion

**決定**: Framer Motion を採用

**理由**:
- React コンポーネントとして宣言的にアニメーション定義可能
- 複雑なアニメーション（進化演出、ドロップ演出など）を簡単に実装
- パフォーマンスが良い（GPU アクセラレーション）
- TypeScript サポートが充実

**代替案**:
- React Spring: API が複雑
- CSS Animations: 複雑なアニメーションの管理が困難

---

### 状態管理: React Context API + Server State

**決定**: クライアント状態は React Context API、サーバー状態は Supabase で管理

**理由**:
- クライアント状態は最小限（UI状態のみ）
- サーバー状態（ユーザーデータ、キャラデータなど）は Supabase リアルタイム購読で管理
- 追加ライブラリ不要でバンドルサイズを削減
- Server Actions で状態更新が容易

**代替案**:
- Redux: オーバーキル、ボイラープレートが多い
- Zustand: サーバー状態の管理には不適

---

### 認証方式: 匿名認証 (Anonymous Auth)

**決定**: Supabase の匿名認証を使用

**理由**:
- 7歳児がメールアドレスやパスワードを管理するのは困難
- 初回起動時に自動でユーザー作成、以降はセッションCookieで自動ログイン
- 将来的にメールアドレス紐付けでアップグレード可能

**代替案**:
- メールアドレス認証: ターゲットユーザー（7歳児）には不適
- OAuth (Google, Appleなど): 親のアカウントと混同する可能性

---

### 保護者認証: 計算問題ゲート

**決定**: 簡単な計算問題（例: 7 + 5 = ?）で保護者メニューを保護

**理由**:
- 7歳児が解けないレベルの問題で誤操作を防止
- パスワード管理不要
- UX を損なわない

**代替案**:
- パスワード認証: 親がパスワードを忘れる可能性
- 指紋認証: デバイス依存

---

## 2026-01-21: 開発フロー・品質保証

### 開発ツール: Claude Code Harness

**決定**: Claude Code Harness を開発フローに組み込む

**理由**:
- `/plan-with-agent` で計画策定の効率化
- `/work` で並列実装 + 自己レビューの自動化
- `/harness-review` で8名の専門家による多角的レビュー
- デグレード対策が自動化される

**代替案**:
- 手動レビュー: 時間がかかり、見落としが発生しやすい
- 従来のLinterのみ: セキュリティやアクセシビリティの検証が不十分

---

### テスト戦略: 単体テスト + E2E テスト

**決定**: Jest + React Testing Library (単体) + Playwright (E2E) を併用

**理由**:
- 単体テスト: コンポーネント、ゲームロジック、Server Actions の動作確認
- E2E テスト: ユーザーフロー全体の動作確認、デグレード検出
- CI/CD パイプラインで自動実行可能

**目標カバレッジ**: 80%以上

**代替案**:
- E2E のみ: テスト実行時間が長い、デバッグが困難
- 単体テストのみ: 統合時の問題を検出できない

---

### CI/CD: GitHub Actions

**決定**: GitHub Actions で自動テスト・ビルド・デプロイを実行

**理由**:
- GitHub リポジトリとの統合が容易
- 無料枠で十分
- Vercel デプロイとの連携が簡単

**ワークフロー**:
1. Pull Request 作成時: Lint + 単体テスト + E2E テスト
2. main ブランチマージ時: ビルド + Vercel デプロイ

**代替案**:
- CircleCI: 設定が複雑
- GitLab CI: GitHub を使用しているため不要

---

## 2026-01-21: データ設計

### データベース: PostgreSQL (Supabase)

**決定**: リレーショナルデータベース（PostgreSQL）を採用

**理由**:
- ユーザー、キャラクター、アイテム、ミッションなどのリレーションが複雑
- トランザクション処理（ゲーム結果処理、ドロップ抽選など）が必要
- RLS でユーザーごとのデータ分離が容易

**主要テーブル**: 11テーブル
- `profiles`, `characters`, `user_characters`, `items`, `user_items`, `kanjis`, `learning_logs`, `missions`, `user_missions`, `parent_rewards`, `user_room_config`

**代替案**:
- NoSQL (Firebase Firestore): リレーションの管理が複雑、トランザクション制約

---

### RPC 関数によるトランザクション処理

**決定**: ゲーム結果処理、エサやり、進化、ログインボーナスは PostgreSQL RPC 関数で実装

**理由**:
- 複数テーブルへの更新をトランザクションで保証
- ドロップ抽選などの複雑なロジックをデータベース側で実行
- Next.js Server Actions から RPC を呼び出すことで、クライアントとの往復を削減

**RPC 関数**:
1. `rpc_finish_game`
2. `rpc_feed_character`
3. `rpc_evolve_character`
4. `rpc_process_login_bonus`

**代替案**:
- Server Actions のみ: 複数クエリの実行でトランザクション保証が困難

---

## 今後の決定事項（予定）

以下の項目は実装進捗に応じて決定・記録します：

- **画像・音声アセットの管理方法** (CDN, Supabase Storage, etc.)
- **エラートラッキング** (Sentry, LogRocket, etc.)
- **アナリティクス** (Vercel Analytics, Google Analytics, etc.)
- **デプロイ戦略** (環境分離、プレビューデプロイ、etc.)
- **キャラクター画像の生成方法** (AI生成, 手描き, etc.)
- **音声・効果音の調達方法** (フリー素材, オリジナル作成, etc.)

---

## 変更履歴

| 日付 | 変更内容 | 変更者 |
|------|---------|-------|
| 2026-01-21 | 初版作成（プロジェクト基盤、開発フロー、データ設計の決定を記録） | Development Team |
