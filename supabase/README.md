# Supabase セットアップガイド

## 1. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com/) にアクセスし、ログイン
2. 「New Project」をクリック
3. プロジェクト情報を入力：
   - **Name**: `kanji-game-website`（任意）
   - **Database Password**: 強力なパスワードを生成・保存
   - **Region**: `Northeast Asia (Tokyo)` （日本のユーザー向け）
4. 「Create new project」をクリックして作成完了を待つ（1-2分）

## 2. 環境変数の設定

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の値をコピー：
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
   - **service_role key**: `eyJhbGc...` (※秘密情報)

3. プロジェクトルートに `.env.local` ファイルを作成：

```bash
cp .env.example .env.local
```

4. `.env.local` に値を貼り付け：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## 3. データベーススキーマの適用

### 方法1: Supabase SQL Editorを使用（推奨）

1. Supabaseダッシュボードで「SQL Editor」を開く
2. 「New query」をクリック
3. `supabase/migrations/20260121_initial_schema.sql` の内容をコピー&ペースト
4. 「Run」をクリックして実行
5. エラーがないことを確認

### 方法2: Supabase CLI を使用

```bash
# Supabase CLI のインストール（未インストールの場合）
npm install -g supabase

# プロジェクトとリンク
supabase link --project-ref xxxxx

# マイグレーション実行
supabase db push
```

## 4. 動作確認

### 4.1 テーブル作成確認

Supabaseダッシュボードで「Table Editor」を開き、以下のテーブルが作成されていることを確認：

**マスタデータ:**
- ✅ characters
- ✅ items
- ✅ kanjis
- ✅ missions

**ユーザーデータ:**
- ✅ profiles
- ✅ user_characters
- ✅ user_items
- ✅ learning_logs
- ✅ user_missions
- ✅ user_room_config

**保護者機能:**
- ✅ parent_rewards

**合計: 11テーブル**

### 4.2 RLS ポリシー確認

各テーブルで「Policies」タブを開き、RLSポリシーが設定されていることを確認。

### 4.3 Database Functions 確認

「Database」→「Functions」を開き、以下のRPC関数が作成されていることを確認：

- ✅ rpc_finish_game
- ✅ rpc_feed_character
- ✅ rpc_evolve_character
- ✅ rpc_process_login_bonus

## 5. 初期データの投入（オプション）

### 5.1 サンプル漢字データ

```sql
-- 1年生の漢字サンプル
INSERT INTO public.kanjis (char, reading, grade, stroke_count, wrong_readings) VALUES
('山', 'やま', 1, 3, ARRAY['かわ', 'もり', 'いし']),
('川', 'かわ', 1, 3, ARRAY['やま', 'うみ', 'みず']),
('木', 'き', 1, 4, ARRAY['はな', 'もり', 'くさ']);
```

### 5.2 サンプルキャラクター

```sql
INSERT INTO public.characters (name, description, rarity, evolution_stage, required_exp_to_evolve, image_url) VALUES
('もりのせい', '森の精霊。初心者向けのパートナー', 'N', 1, 100, '/characters/mori_sei_1.png'),
('やまのせい', '山の精霊。力強い存在', 'N', 1, 100, '/characters/yama_sei_1.png');
```

### 5.3 サンプルアイテム

```sql
INSERT INTO public.items (name, description, type, effect_value, image_url) VALUES
('きのみ', '普通の木の実。経験値+10', 'food', 10, '/items/kinomi.png'),
('おおきなきのみ', '大きな木の実。経験値+50', 'food', 50, '/items/ookina_kinomi.png');
```

### 5.4 サンプルミッション

```sql
INSERT INTO public.missions (title, description, category, condition_type, condition_value) VALUES
('はじめてのぼうけん', '漢字を1回クリアしよう', 'daily', 'clear_count', 1),
('3もんチャレンジ', '漢字を3回クリアしよう', 'daily', 'clear_count', 3);
```

## 6. 認証設定

### 6.1 匿名認証の有効化

1. Supabaseダッシュボードで「Authentication」→「Providers」を開く
2. 「Anonymous Sign-ins」を**有効化**
3. 保存

### 6.2 Email確認の無効化（開発用）

開発環境では Email 確認を無効化しておくと便利です。

1. 「Authentication」→「Settings」を開く
2. 「Enable email confirmations」を**無効化**

## 7. トラブルシューティング

### エラー: "relation does not exist"

- スキーマが正しく適用されていない可能性があります
- SQL Editorで再度マイグレーションファイルを実行してください

### エラー: "permission denied"

- RLSポリシーが正しく設定されていない可能性があります
- 各テーブルのポリシーを確認してください

### 接続エラー

- `.env.local` の環境変数が正しく設定されているか確認
- Supabaseプロジェクトが正常に起動しているか確認

## 8. 次のステップ

Phase 1.3: 認証システムの実装
- 初回登録画面の実装
- オートログイン機能
- 保護者認証ゲート

詳細は `Documents/development_plan.md` を参照してください。
