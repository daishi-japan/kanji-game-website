# 次回セッション引き継ぎ情報

## 現在のブランチ
`0201_02_branch` — **mainへのマージは必ずユーザーに確認を取ること**

## 未コミットの変更（3ファイル）

### 1. `lib/data/reward-data.ts`
- `calculateRewards()`をフル版に置き換え済み（コインのみ → コイン+経験値+キャラドロップ+エサドロップ）
- ランクに応じたボーナス倍率・ドロップ確率が有効
- コメントアウトされていた`calculateRewards_FULL`の内容を`calculateRewards`に統合

### 2. `app/actions/game.ts`（submitGameResult）
- 報酬計算をDB保存の成否から独立させた
- 認証なし/RPCエラーでも`{ success: true, data: { rewards } }`を必ず返すように修正
- DB保存はtry-catchで囲み、失敗してもcatchして報酬は返す

### 3. `app/play/reading/[stage]/page.tsx`
- `RewardDisplay`コンポーネントをimport追加
- `rewards`ステート追加（`useState<RewardItem[]>([])`）
- `submitGameResult`の戻り値からrewardsを取得してステートにセット
- リザルトモーダル内にRewardDisplay表示を追加（スコアの下、ボタンの上）
- リトライ時に`setRewards([])`でリセット
- モーダルに`max-h-[90vh] overflow-y-auto`追加

---

## 未解決の問題（優先度順）

### 問題1: Middleware Supabase fetchエラー（最重要・ブロッカー）
**症状:** ステージ選択画面（`/play/reading`）からゲームページ（`/play/reading/grade_X_speed`）への遷移が失敗する場合がある
**エラーログ:**
```
Error: fetch failed
  at context.fetch (.../next/dist/server/web/sandbox/context.js:321:60)
  at ... @supabase/auth-js ... GoTrueClient.js ... _getUser
```
**ファイル:** `middleware.ts`（32行目 `supabase.auth.getUser()`）
**原因の可能性:**
- Supabaseの無料プランの接続制限やタイムアウト
- ネットワーク環境の問題
- Supabaseプロジェクトが一時停止している可能性（無料プランは非アクティブで停止する）
**対処案:**
1. Supabaseダッシュボード（https://supabase.com/dashboard）でプロジェクトのステータスを確認
2. middleware.ts内のgetUser()にtry-catchを追加し、Supabase接続失敗時でもページ遷移をブロックしないようにする
3. `/play`パスはそもそも認証不要なので、matcherから除外するのも有効

### 問題2: RPCスキーマ不一致
**症状:** `column "score" of relation "learning_logs" does not exist`
**原因:** Supabase側の`rpc_finish_game`関数が参照する`learning_logs`テーブルに`score`カラムがない
**対処案:**
- Supabaseダッシュボードでテーブルスキーマを確認・修正
- またはRPC関数を書き直す
- 現状のコードでは報酬計算に影響なし（RPCエラーをcatchして報酬は返す）

### 問題3: Phase B動作未確認
- コード変更は完了しているが、問題1のため実際にゲームを完了して報酬表示を確認できていない
- 問題1を修正後にゲームを通しでプレイして動作確認が必要

---

## 完了済みフェーズ

### Phase A: ゲーム結果のDB保存 ✅
- `submitGameResult`をゲームページのgameOver useEffectから呼び出し
- React Strict Mode二重送信防止（`useRef`フラグ）
- 依存配列修正（`resolvedParams.stage`追加）
- コミット済み: `63bb60e`, `1744f5b`

### Phase B: キャラクタードロップの有効化（コード完了、動作未確認）
- `calculateRewards`フル版有効化
- `RewardDisplay`コンポーネントをリザルトモーダルに組み込み
- **未コミット・動作確認未完了**

---

## 今後のロードマップ

| Phase | 内容 | 状態 |
|-------|------|------|
| A | ゲーム結果のDB保存 | ✅ 完了 |
| B | キャラクタードロップの有効化 | コード完了、動作未確認 |
| C | グローバルナビゲーション（🍊 みかんキャッチ ヘッダー） | 未着手 |
| D | 認証強化（匿名→email/Google） | 未着手 |
| E | 追加機能（デイリーミッション等） | 未着手 |

---

## 技術スタック
- Next.js 15.5.9 / React 19 / App Router
- Supabase (PostgreSQL + 匿名認証)
- Framer Motion（アニメーション）
- Tailwind CSS / styled-jsx
- TypeScript

## リポジトリ・デプロイ
- GitHub: https://github.com/daishi-japan/kanji-game-website.git
- Vercel: 自動デプロイ（mainへのpushで発動）
- 開発サーバー: `npm run dev`（通常ポート3000）

## 重要ファイル一覧
| ファイル | 役割 |
|---------|------|
| `middleware.ts` | 認証ミドルウェア（/parentを保護、/playは除外判定あり） |
| `app/play/reading/[stage]/page.tsx` | よみゲーム本体 |
| `app/play/reading/page.tsx` | ステージ選択画面 |
| `app/actions/game.ts` | ゲーム結果送信サーバーアクション |
| `lib/data/reward-data.ts` | 報酬計算ロジック・ドロップテーブル |
| `lib/data/character-data.ts` | キャラクターマスタデータ（20体） |
| `components/result/RewardDisplay.tsx` | 報酬表示UIコンポーネント |
| `lib/game/reading-game-logic.ts` | ゲームステート管理 |
| `.env.local` | Supabase接続情報 |
