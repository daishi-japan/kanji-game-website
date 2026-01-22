-- ============================================================================
-- あつまれ！漢字の森 - 初期スキーマ
-- ============================================================================

-- ============================================================================
-- 1. プロフィールテーブル (ユーザー管理)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    login_streak INTEGER DEFAULT 0 NOT NULL,
    last_login_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.profiles IS 'ユーザープロフィール情報';
COMMENT ON COLUMN public.profiles.name IS 'ユーザー名（ひらがな推奨）';
COMMENT ON COLUMN public.profiles.login_streak IS '連続ログイン日数';
COMMENT ON COLUMN public.profiles.last_login_at IS '最終ログイン日時';
COMMENT ON COLUMN public.profiles.settings IS 'アプリ設定（難易度、BGM音量など）';

-- ============================================================================
-- 2. マスタデータテーブル
-- ============================================================================

-- 2.1 キャラクターマスタ
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    rarity TEXT NOT NULL CHECK (rarity IN ('N', 'R', 'SR', 'SSR')),
    element TEXT,
    evolution_stage INTEGER DEFAULT 1 NOT NULL,
    next_evolution_id UUID REFERENCES public.characters(id),
    required_exp_to_evolve INTEGER,
    image_url TEXT NOT NULL,
    silhouette_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.characters IS 'キャラクターマスタデータ';
COMMENT ON COLUMN public.characters.next_evolution_id IS '進化先のキャラクターID（NULL=進化しない）';

CREATE INDEX idx_characters_rarity ON public.characters(rarity);
CREATE INDEX idx_characters_evolution_stage ON public.characters(evolution_stage);

-- 2.2 アイテムマスタ
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('food', 'ticket', 'evolution', 'other')),
    effect_value INTEGER DEFAULT 0 NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.items IS 'アイテムマスタデータ（エサ、進化素材など）';
COMMENT ON COLUMN public.items.effect_value IS '効果量（エサの場合は経験値上昇量）';

CREATE INDEX idx_items_type ON public.items(type);

-- 2.3 漢字マスタ
CREATE TABLE IF NOT EXISTS public.kanjis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    char VARCHAR(1) NOT NULL UNIQUE,
    reading TEXT NOT NULL,
    onyomi TEXT[],
    kunyomi TEXT[],
    grade INTEGER,
    stroke_count INTEGER,
    stroke_order_data JSONB,
    wrong_readings TEXT[],
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.kanjis IS '漢字マスタデータ';
COMMENT ON COLUMN public.kanjis.char IS '漢字本体（例: 山）';
COMMENT ON COLUMN public.kanjis.reading IS '正しい読み（ひらがな）';
COMMENT ON COLUMN public.kanjis.stroke_order_data IS '書き順アニメーション用データ（SVGパス等）';
COMMENT ON COLUMN public.kanjis.wrong_readings IS '誤答の選択肢候補';

CREATE INDEX idx_kanjis_grade ON public.kanjis(grade);
CREATE INDEX idx_kanjis_char ON public.kanjis(char);

-- 2.4 ミッションマスタ
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('daily', 'achievement', 'special')),
    condition_type TEXT NOT NULL,
    condition_value INTEGER NOT NULL,
    reward_item_id UUID REFERENCES public.items(id),
    reward_quantity INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.missions IS 'ミッション・実績マスタデータ';
COMMENT ON COLUMN public.missions.condition_type IS '達成条件種別（play_count, clear_count, login等）';
COMMENT ON COLUMN public.missions.condition_value IS '達成に必要な回数や数値';

CREATE INDEX idx_missions_category ON public.missions(category);

-- ============================================================================
-- 3. ユーザーデータテーブル
-- ============================================================================

-- 3.1 ユーザー所持キャラクター
CREATE TABLE IF NOT EXISTS public.user_characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES public.characters(id),
    current_exp INTEGER DEFAULT 0 NOT NULL,
    friendship_level INTEGER DEFAULT 0 NOT NULL,
    is_new BOOLEAN DEFAULT true NOT NULL,
    is_favorite BOOLEAN DEFAULT false NOT NULL,
    obtained_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(user_id, character_id)
);

COMMENT ON TABLE public.user_characters IS 'ユーザー所持キャラクター（図鑑・育成状況）';
COMMENT ON COLUMN public.user_characters.is_new IS '図鑑未確認フラグ（NEWマーク用）';
COMMENT ON COLUMN public.user_characters.is_favorite IS 'ホーム画面表示用のお気に入りフラグ';

CREATE INDEX idx_user_characters_user_id ON public.user_characters(user_id);
CREATE INDEX idx_user_characters_character_id ON public.user_characters(character_id);

-- 3.2 ユーザー所持アイテム
CREATE TABLE IF NOT EXISTS public.user_items (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.items(id),
    quantity INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, item_id)
);

COMMENT ON TABLE public.user_items IS 'ユーザー所持アイテム（インベントリ）';

CREATE INDEX idx_user_items_user_id ON public.user_items(user_id);

-- 3.3 学習ログ
CREATE TABLE IF NOT EXISTS public.learning_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    kanji_id UUID NOT NULL REFERENCES public.kanjis(id),
    mode TEXT NOT NULL CHECK (mode IN ('reading', 'writing')),
    is_correct BOOLEAN NOT NULL,
    selected_reading TEXT,
    stroke_accuracy INTEGER,
    response_time_ms INTEGER,
    played_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.learning_logs IS '学習（ゲームプレイ）履歴';
COMMENT ON COLUMN public.learning_logs.mode IS '学習モード（reading=読み, writing=書き）';
COMMENT ON COLUMN public.learning_logs.stroke_accuracy IS '書き取り時の正確性スコア（オプション）';

CREATE INDEX idx_learning_logs_user_id ON public.learning_logs(user_id);
CREATE INDEX idx_learning_logs_kanji_id ON public.learning_logs(kanji_id);
CREATE INDEX idx_learning_logs_played_at ON public.learning_logs(played_at DESC);

-- 3.4 ユーザーミッション進捗
CREATE TABLE IF NOT EXISTS public.user_missions (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES public.missions(id),
    target_date DATE NOT NULL,
    progress INTEGER DEFAULT 0 NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    is_claimed BOOLEAN DEFAULT false NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, mission_id, target_date)
);

COMMENT ON TABLE public.user_missions IS 'ユーザーミッション進捗状況';
COMMENT ON COLUMN public.user_missions.target_date IS 'ミッション対象日（デイリーの場合）';

CREATE INDEX idx_user_missions_user_id ON public.user_missions(user_id);
CREATE INDEX idx_user_missions_target_date ON public.user_missions(target_date);

-- 3.5 マイルーム配置情報
CREATE TABLE IF NOT EXISTS public.user_room_config (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    layout_data JSONB DEFAULT '[]'::jsonb NOT NULL,
    background_id TEXT DEFAULT 'default' NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.user_room_config IS 'ユーザーごとのマイルーム配置情報';
COMMENT ON COLUMN public.user_room_config.layout_data IS '配置されたキャラクターの情報（ID, 座標など）の配列';

-- ============================================================================
-- 4. 保護者機能テーブル
-- ============================================================================

-- 4.1 保護者設定ご褒美
CREATE TABLE IF NOT EXISTS public.parent_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    condition_description TEXT,
    status TEXT DEFAULT 'locked' NOT NULL CHECK (status IN ('locked', 'unlocked', 'claimed', 'fulfilled')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    unlocked_at TIMESTAMPTZ,
    fulfilled_at TIMESTAMPTZ
);

COMMENT ON TABLE public.parent_rewards IS '保護者が設定したカスタムご褒美';
COMMENT ON COLUMN public.parent_rewards.status IS 'locked=条件未達成, unlocked=達成, claimed=受け取り済み, fulfilled=履行完了';

CREATE INDEX idx_parent_rewards_user_id ON public.parent_rewards(user_id);
CREATE INDEX idx_parent_rewards_status ON public.parent_rewards(status);

-- ============================================================================
-- 5. Row Level Security (RLS) ポリシー
-- ============================================================================

-- 5.1 プロフィール
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 5.2 マスタデータ（全ユーザー読み取り可）
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Characters are viewable by all authenticated users"
    ON public.characters FOR SELECT
    TO authenticated
    USING (true);

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Items are viewable by all authenticated users"
    ON public.items FOR SELECT
    TO authenticated
    USING (true);

ALTER TABLE public.kanjis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Kanjis are viewable by all authenticated users"
    ON public.kanjis FOR SELECT
    TO authenticated
    USING (true);

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Missions are viewable by all authenticated users"
    ON public.missions FOR SELECT
    TO authenticated
    USING (true);

-- 5.3 ユーザーデータ（自分のデータのみ操作可）
ALTER TABLE public.user_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own characters"
    ON public.user_characters FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.user_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own items"
    ON public.user_items FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.learning_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own learning logs"
    ON public.learning_logs FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own missions"
    ON public.user_missions FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.user_room_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own room config"
    ON public.user_room_config FOR ALL
    USING (auth.uid() = user_id);

ALTER TABLE public.parent_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own rewards"
    ON public.parent_rewards FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================================
-- 6. トリガー関数
-- ============================================================================

-- 6.1 新規ユーザー作成時にプロフィールを自動作成
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'プレイヤー'));

    INSERT INTO public.user_room_config (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6.2 updated_atの自動更新
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_items_updated_at BEFORE UPDATE ON public.user_items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_missions_updated_at BEFORE UPDATE ON public.user_missions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_room_config_updated_at BEFORE UPDATE ON public.user_room_config
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 7. RPC関数（Database Functions）
-- ============================================================================

-- 7.1 ゲーム結果処理（ドロップ抽選・ミッション更新）
CREATE OR REPLACE FUNCTION public.rpc_finish_game(
    p_user_id UUID,
    p_kanji_id UUID,
    p_mode TEXT,
    p_is_correct BOOLEAN,
    p_score INTEGER,
    p_dropped_items JSONB,
    p_dropped_character_id UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    -- 学習ログ記録
    INSERT INTO public.learning_logs (user_id, kanji_id, mode, is_correct)
    VALUES (p_user_id, p_kanji_id, p_mode, p_is_correct);

    -- アイテムドロップ処理
    IF p_dropped_items IS NOT NULL THEN
        FOR i IN 0..jsonb_array_length(p_dropped_items) - 1 LOOP
            INSERT INTO public.user_items (user_id, item_id, quantity)
            VALUES (
                p_user_id,
                (p_dropped_items->i->>'item_id')::UUID,
                (p_dropped_items->i->>'quantity')::INTEGER
            )
            ON CONFLICT (user_id, item_id)
            DO UPDATE SET quantity = public.user_items.quantity + EXCLUDED.quantity;
        END LOOP;
    END IF;

    -- キャラクタードロップ処理
    IF p_dropped_character_id IS NOT NULL THEN
        INSERT INTO public.user_characters (user_id, character_id)
        VALUES (p_user_id, p_dropped_character_id)
        ON CONFLICT (user_id, character_id) DO NOTHING;
    END IF;

    -- デイリーミッション進捗更新（簡易実装）
    UPDATE public.user_missions
    SET progress = progress + 1,
        is_completed = (progress + 1 >= (SELECT condition_value FROM public.missions WHERE id = mission_id))
    WHERE user_id = p_user_id
      AND target_date = CURRENT_DATE
      AND is_completed = false;

    v_result := jsonb_build_object(
        'success', true,
        'message', 'ゲーム結果を処理しました'
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.2 エサやり処理
CREATE OR REPLACE FUNCTION public.rpc_feed_character(
    p_user_id UUID,
    p_user_character_id UUID,
    p_item_id UUID,
    p_quantity INTEGER DEFAULT 1
)
RETURNS JSONB AS $$
DECLARE
    v_effect_value INTEGER;
    v_current_quantity INTEGER;
    v_result JSONB;
BEGIN
    -- アイテム効果値取得
    SELECT effect_value INTO v_effect_value
    FROM public.items
    WHERE id = p_item_id AND type = 'food';

    IF v_effect_value IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'エサが見つかりません');
    END IF;

    -- ユーザーの所持数確認
    SELECT quantity INTO v_current_quantity
    FROM public.user_items
    WHERE user_id = p_user_id AND item_id = p_item_id;

    IF v_current_quantity IS NULL OR v_current_quantity < p_quantity THEN
        RETURN jsonb_build_object('success', false, 'error', 'エサが足りません');
    END IF;

    -- アイテム消費
    UPDATE public.user_items
    SET quantity = quantity - p_quantity
    WHERE user_id = p_user_id AND item_id = p_item_id;

    -- 経験値加算
    UPDATE public.user_characters
    SET current_exp = current_exp + (v_effect_value * p_quantity),
        friendship_level = friendship_level + p_quantity
    WHERE id = p_user_character_id AND user_id = p_user_id;

    v_result := jsonb_build_object(
        'success', true,
        'exp_gained', v_effect_value * p_quantity,
        'friendship_gained', p_quantity
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.3 進化処理
CREATE OR REPLACE FUNCTION public.rpc_evolve_character(
    p_user_id UUID,
    p_user_character_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_current_exp INTEGER;
    v_character_id UUID;
    v_next_evolution_id UUID;
    v_required_exp INTEGER;
    v_result JSONB;
BEGIN
    -- 現在の状態取得
    SELECT uc.current_exp, uc.character_id
    INTO v_current_exp, v_character_id
    FROM public.user_characters uc
    WHERE uc.id = p_user_character_id AND uc.user_id = p_user_id;

    -- 進化先情報取得
    SELECT c.next_evolution_id, c.required_exp_to_evolve
    INTO v_next_evolution_id, v_required_exp
    FROM public.characters c
    WHERE c.id = v_character_id;

    -- 進化可能かチェック
    IF v_next_evolution_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'これ以上進化できません');
    END IF;

    IF v_current_exp < v_required_exp THEN
        RETURN jsonb_build_object('success', false, 'error', '経験値が足りません');
    END IF;

    -- 進化実行
    UPDATE public.user_characters
    SET character_id = v_next_evolution_id,
        current_exp = v_current_exp - v_required_exp,
        is_new = true
    WHERE id = p_user_character_id AND user_id = p_user_id;

    v_result := jsonb_build_object(
        'success', true,
        'new_character_id', v_next_evolution_id
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7.4 ログインボーナス処理
CREATE OR REPLACE FUNCTION public.rpc_process_login_bonus(
    p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_last_login_at TIMESTAMPTZ;
    v_login_streak INTEGER;
    v_bonus_item_id UUID;
    v_result JSONB;
BEGIN
    -- 最終ログイン情報取得
    SELECT last_login_at, login_streak
    INTO v_last_login_at, v_login_streak
    FROM public.profiles
    WHERE id = p_user_id;

    -- 今日すでにログイン済みかチェック
    IF v_last_login_at IS NOT NULL AND DATE(v_last_login_at) = CURRENT_DATE THEN
        RETURN jsonb_build_object(
            'success', true,
            'already_claimed', true,
            'login_streak', v_login_streak
        );
    END IF;

    -- 連続日数計算
    IF v_last_login_at IS NULL OR DATE(v_last_login_at) < CURRENT_DATE - INTERVAL '1 day' THEN
        -- 連続記録が途切れた
        v_login_streak := 1;
    ELSE
        -- 連続記録継続
        v_login_streak := v_login_streak + 1;
    END IF;

    -- プロフィール更新
    UPDATE public.profiles
    SET last_login_at = now(),
        login_streak = v_login_streak
    WHERE id = p_user_id;

    -- ボーナスアイテム付与（簡易実装：デフォルトのエサを1個）
    -- 実際は連続日数に応じて報酬を変える
    SELECT id INTO v_bonus_item_id
    FROM public.items
    WHERE type = 'food'
    LIMIT 1;

    IF v_bonus_item_id IS NOT NULL THEN
        INSERT INTO public.user_items (user_id, item_id, quantity)
        VALUES (p_user_id, v_bonus_item_id, 1)
        ON CONFLICT (user_id, item_id)
        DO UPDATE SET quantity = public.user_items.quantity + 1;
    END IF;

    v_result := jsonb_build_object(
        'success', true,
        'already_claimed', false,
        'login_streak', v_login_streak,
        'bonus_item_id', v_bonus_item_id
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 完了
-- ============================================================================
