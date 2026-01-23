# Supabase データベースセットアップ手順

## 問題
「ユーザーの作成に失敗しました」というエラーが表示される場合、Supabaseのデータベーステーブルがまだ作成されていない可能性があります。

## 解決方法

### 1. Supabaseダッシュボードにアクセス

1. https://supabase.com にアクセス
2. プロジェクトを開く
3. 左メニューから「SQL Editor」を選択

### 2. 必須テーブルを作成

以下のSQLを「SQL Editor」で実行してください：

```sql
-- ============================================================================
-- 1. profiles テーブル (ユーザープロフィール)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    login_streak INTEGER DEFAULT 0 NOT NULL,
    last_login_at TIMESTAMPTZ,
    coins INTEGER DEFAULT 0 NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS (Row Level Security) を有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ポリシー: ユーザーは自分のプロフィールを読み書きできる
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 2. user_characters テーブル (所持キャラクター)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    character_id TEXT NOT NULL,
    level INTEGER DEFAULT 1 NOT NULL,
    experience INTEGER DEFAULT 0 NOT NULL,
    friendship INTEGER DEFAULT 0 NOT NULL,
    obtained_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, character_id)
);

ALTER TABLE public.user_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own characters"
    ON public.user_characters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
    ON public.user_characters FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
    ON public.user_characters FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 3. user_items テーブル (所持アイテム)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL,
    item_id TEXT NOT NULL,
    amount INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE public.user_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own items"
    ON public.user_items FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own items"
    ON public.user_items FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items"
    ON public.user_items FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================================================
-- 4. game_history テーブル (ゲーム履歴)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.game_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mode TEXT NOT NULL,
    stage_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    rank TEXT NOT NULL,
    cleared BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.game_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own history"
    ON public.game_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history"
    ON public.game_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_game_history_user_created ON public.game_history(user_id, created_at DESC);

-- ============================================================================
-- 5. parent_rewards テーブル (保護者が設定するご褒美)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.parent_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    condition_type TEXT NOT NULL,
    condition_value INTEGER NOT NULL,
    claimed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.parent_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own rewards"
    ON public.parent_rewards FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================================
-- 6. daily_missions テーブル (デイリーミッション)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.daily_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mission_type TEXT NOT NULL,
    target_count INTEGER NOT NULL,
    current_count INTEGER DEFAULT 0 NOT NULL,
    reward_coins INTEGER DEFAULT 0 NOT NULL,
    reward_food_id TEXT,
    claimed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, date, mission_type)
);

ALTER TABLE public.daily_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own missions"
    ON public.daily_missions FOR ALL
    USING (auth.uid() = user_id);

CREATE INDEX idx_daily_missions_user_date ON public.daily_missions(user_id, date);
```

### 3. RPC関数を作成

次に、以下のRPC関数も作成してください：

```sql
-- ============================================================================
-- RPC関数: ゲーム結果処理
-- ============================================================================
CREATE OR REPLACE FUNCTION rpc_finish_game(
    p_user_id UUID,
    p_mode TEXT,
    p_stage_id TEXT,
    p_score INTEGER,
    p_max_score INTEGER,
    p_rank TEXT,
    p_cleared BOOLEAN,
    p_rewards JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_reward JSONB;
BEGIN
    -- ゲーム履歴を保存
    INSERT INTO public.game_history (user_id, mode, stage_id, score, max_score, rank, cleared)
    VALUES (p_user_id, p_mode, p_stage_id, p_score, p_max_score, p_rank, p_cleared);

    -- 報酬を付与
    FOR v_reward IN SELECT * FROM jsonb_array_elements(p_rewards)
    LOOP
        CASE v_reward->>'type'
            WHEN 'coin' THEN
                UPDATE public.profiles
                SET coins = coins + (v_reward->>'amount')::INTEGER
                WHERE id = p_user_id;

            WHEN 'character' THEN
                INSERT INTO public.user_characters (user_id, character_id)
                VALUES (p_user_id, v_reward->>'item_id')
                ON CONFLICT (user_id, character_id) DO NOTHING;

            WHEN 'food' THEN
                INSERT INTO public.user_items (user_id, item_type, item_id, amount)
                VALUES (p_user_id, 'food', v_reward->>'item_id', (v_reward->>'amount')::INTEGER)
                ON CONFLICT (user_id, item_type, item_id)
                DO UPDATE SET amount = user_items.amount + (v_reward->>'amount')::INTEGER;
        END CASE;
    END LOOP;

    RETURN jsonb_build_object('success', true);
END;
$$;

-- ============================================================================
-- RPC関数: ログインボーナス処理
-- ============================================================================
CREATE OR REPLACE FUNCTION rpc_process_login_bonus(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_last_login TIMESTAMPTZ;
    v_login_streak INTEGER;
    v_is_new_day BOOLEAN;
    v_today DATE;
    v_last_login_date DATE;
BEGIN
    SELECT last_login_at, login_streak
    INTO v_last_login, v_login_streak
    FROM public.profiles
    WHERE id = p_user_id;

    v_today := CURRENT_DATE;
    v_last_login_date := DATE(v_last_login);

    -- 新しい日かチェック
    v_is_new_day := (v_last_login_date IS NULL OR v_last_login_date < v_today);

    IF v_is_new_day THEN
        -- 連続ログイン判定
        IF v_last_login_date = v_today - INTERVAL '1 day' THEN
            v_login_streak := v_login_streak + 1;
        ELSIF v_last_login_date < v_today - INTERVAL '1 day' OR v_last_login_date IS NULL THEN
            v_login_streak := 1;
        END IF;

        -- プロフィール更新
        UPDATE public.profiles
        SET last_login_at = now(),
            login_streak = v_login_streak
        WHERE id = p_user_id;
    END IF;

    RETURN jsonb_build_object(
        'is_new_day', v_is_new_day,
        'login_streak', v_login_streak
    );
END;
$$;

-- ============================================================================
-- RPC関数: エサやり処理
-- ============================================================================
CREATE OR REPLACE FUNCTION rpc_feed_character(
    p_user_id UUID,
    p_character_id TEXT,
    p_food_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_food_exp INTEGER := 10;
    v_food_friendship INTEGER := 5;
    v_new_exp INTEGER;
    v_new_friendship INTEGER;
    v_new_level INTEGER;
    v_leveled_up BOOLEAN := false;
BEGIN
    -- エサの効果値を設定（簡易版）
    CASE p_food_id
        WHEN 'food_001' THEN v_food_exp := 10; v_food_friendship := 5;
        WHEN 'food_002' THEN v_food_exp := 15; v_food_friendship := 5;
        WHEN 'food_006' THEN v_food_exp := 25; v_food_friendship := 10;
        WHEN 'food_010' THEN v_food_exp := 50; v_food_friendship := 20;
        ELSE v_food_exp := 10; v_food_friendship := 5;
    END CASE;

    -- エサを消費
    UPDATE public.user_items
    SET amount = amount - 1
    WHERE user_id = p_user_id AND item_id = p_food_id AND item_type = 'food' AND amount > 0;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'エサが不足しています';
    END IF;

    -- 経験値となつき度を加算
    UPDATE public.user_characters
    SET experience = experience + v_food_exp,
        friendship = friendship + v_food_friendship
    WHERE user_id = p_user_id AND character_id = p_character_id
    RETURNING experience, friendship, level INTO v_new_exp, v_new_friendship, v_new_level;

    -- レベルアップ判定（100経験値で1レベルアップ）
    IF v_new_exp >= v_new_level * 100 THEN
        v_leveled_up := true;
        UPDATE public.user_characters
        SET level = level + 1
        WHERE user_id = p_user_id AND character_id = p_character_id
        RETURNING level INTO v_new_level;
    END IF;

    RETURN jsonb_build_object(
        'newLevel', v_new_level,
        'newExperience', v_new_exp,
        'newFriendship', v_new_friendship,
        'leveledUp', v_leveled_up
    );
END;
$$;

-- ============================================================================
-- RPC関数: 進化処理
-- ============================================================================
CREATE OR REPLACE FUNCTION rpc_evolve_character(
    p_user_id UUID,
    p_character_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_character_id TEXT;
BEGIN
    -- 簡易版：キャラIDの末尾を変更
    -- 例: char_001 -> char_002, char_010 -> char_011
    v_new_character_id := regexp_replace(p_character_id, '\d+$',
        lpad((regexp_replace(p_character_id, '.*_(\d+)$', '\1')::INTEGER + 1)::TEXT, 3, '0'));

    -- 古いキャラを削除
    DELETE FROM public.user_characters
    WHERE user_id = p_user_id AND character_id = p_character_id;

    -- 新しいキャラを追加
    INSERT INTO public.user_characters (user_id, character_id, level, experience, friendship)
    VALUES (p_user_id, v_new_character_id, 1, 0, 0);

    RETURN jsonb_build_object('new_character_id', v_new_character_id);
END;
$$;
```

### 4. 確認

SQL実行後、アプリを再起動してください：

```bash
# 開発サーバーを停止（Ctrl+C）
# 再起動
npm run dev
```

### 5. トラブルシューティング

それでもエラーが出る場合：

1. Supabaseダッシュボード → Authentication → Settings
2. "Enable email confirmations" を **OFF** にする
3. "Enable email signups" が **ON** になっているか確認

これでユーザー登録ができるようになります！
