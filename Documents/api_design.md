# API設計書 (API Design Document)

## 1. 概要
本システムは **Next.js App Router** を採用し、クライアントとサーバー間の通信には主に **Server Actions** を使用します。
バックエンド（データベース・認証）には **Supabase** を利用し、重要なゲームロジック（ドロップ抽選、経験値付与など）はデータの整合性を保つため **Supabase Database Functions (PostgreSQL RPC)** として実装し、Server Actionsから呼び出します。

## 2. 共通仕様

*   **認証:** すべてのServer Actionsにおいて、`Supabase Auth` のセッション検証を行い、`user_id` を特定します。
*   **型定義:** TypeScriptを使用し、DBの型定義は `supabase gen types` 等で生成されたものを利用します。
*   **エラーハンドリング:** 処理失敗時は例外をスローせず、`{ success: boolean, error?: string, data?: T }` 形式のオブジェクトを返し、クライアント側で適切にUIを表示します。

---

## 3. Server Actions

`app/actions/` 配下に配置し、Client Componentsから直接呼び出します。

### 3.1. ユーザー・認証 (`userActions.ts`)

#### `getProfile`
*   **概要:** 現在のユーザーのプロフィールと設定を取得する。
*   **引数:** なし
*   **戻り値:** `Promise<Profile>`
    *   初回ログイン時（データがない場合）は、自動的に初期レコードを作成して返す処理を含める（または `handle_new_user` トリガーに任せる）。

#### `updateSettings`
*   **概要:** ゲーム設定（難易度、BGM音量など）を更新する。
*   **引数:**
    *   `settings`: `Json` (更新したい設定オブジェクト)
*   **戻り値:** `Promise<Profile>`

#### `checkLoginBonus`
*   **概要:** 今日のログインボーナスが受け取り可能かチェックし、可能なら付与する。
*   **引数:** なし
*   **戻り値:** `Promise<{ received: boolean, item?: Item, bonusMessage?: string }>`
*   **内部処理:** RPC `rpc_process_login_bonus` を呼び出す。

### 3.2. ゲームプレイ (`gameActions.ts`)

#### `fetchGameData`
*   **概要:** ゲーム開始に必要なマスタデータ（漢字リスト、設定）を取得する。
*   **引数:**
    *   `grade`: `number` (学習学年、オプション)
    *   `mode`: `'reading' | 'writing'` (**追加:** モード指定)
*   **戻り値:** `Promise<{ kanjis: Kanji[], config: GameConfig }>`

#### `submitGameResult`
*   **概要:** ゲーム終了時にプレイ結果（スコア、正解数）を送信し、報酬を受け取る。
*   **引数:**
    *   `mode`: `'reading' | 'writing'` (**追加:** モード指定)
    *   `result`: `{ score: number, clearedCount: number, playTimeSec: number, correctKanjiIds: string[] }`
*   **戻り値:** `Promise<{ gainedExp: number, drops: Item[], newCharacters: Character[] }>`
*   **内部処理:** RPC `rpc_finish_game` を呼び出し、サーバーサイドでドロップ抽選を行う。

### 3.3. キャラクター・育成 (`characterActions.ts`)

#### `getMyCharacters`
*   **概要:** ユーザーが所持しているキャラクター一覧を取得する。
*   **引数:** なし
*   **戻り値:** `Promise<UserCharacter[]>`

#### `feedCharacter`
*   **概要:** キャラクターにエサを与える。
*   **引数:**
    *   `userCharacterId`: `string`
    *   `itemId`: `string` (エサのアイテムID)
    *   `quantity`: `number`
*   **戻り値:** `Promise<{ success: boolean, leveledUp: boolean, currentExp: number, friendshipLevel: number }>`
*   **内部処理:** RPC `rpc_feed_character` を呼び出す。

#### `evolveCharacter`
*   **概要:** キャラクターを進化させる。
*   **引数:**
    *   `userCharacterId`: `string`
*   **戻り値:** `Promise<{ success: boolean, newCharacter: UserCharacter }>`
*   **内部処理:** RPC `rpc_evolve_character` を呼び出す。

#### `getRoomConfig` (New!)
*   **概要:** マイルームの配置情報を取得する。
*   **引数:** なし
*   **戻り値:** `Promise<UserRoomConfig>`

#### `updateRoomConfig` (New!)
*   **概要:** マイルームの配置情報を保存する。
*   **引数:**
    *   `layoutData`: `Json` (配置データの配列)
*   **戻り値:** `Promise<UserRoomConfig>`

### 3.4. 保護者・ご褒美 (`parentActions.ts`)

#### `verifyParentGate`
*   **概要:** 保護者メニューに入るための認証（計算問題の答え合わせ等）を行う。
*   **引数:**
    *   `answer`: `string`
*   **戻り値:** `Promise<{ verified: boolean }>`
    *   ※簡易的な実装として、サーバー側で正解を判定する。

#### `getParentRewards`
*   **概要:** 設定されたご褒美一覧を取得する。
*   **引数:** なし
*   **戻り値:** `Promise<ParentReward[]>`

#### `createReward`
*   **概要:** 新しいご褒美を作成する。
*   **引数:**
    *   `title`: `string`
    *   `conditionType`: `string`
    *   `conditionValue`: `number`
*   **戻り値:** `Promise<ParentReward>`

#### `updateRewardStatus`
*   **概要:** ご褒美の状態を更新する（例：使用済みにする）。
*   **引数:**
    *   `rewardId`: `string`
    *   `status`: `'unlocked' | 'claimed' | 'fulfilled'`
*   **戻り値:** `Promise<ParentReward>`

---

## 4. Database Functions (RPC)

SupabaseのSQLエディタ等で定義するPostgreSQL関数です。
Server Actionsから `supabase.rpc('function_name', params)` の形で呼び出します。
**SECURITY DEFINER** を設定し、テーブルへの直接アクセス権限がない場合でも関数経由での安全な操作を許可します。

### 4.1. `rpc_finish_game`
ゲーム結果を受け取り、一連の更新処理をアトミックに行います。

*   **引数:**
    *   `p_user_id`: uuid
    *   `p_mode`: text (**追加:** 'reading' or 'writing')
    *   `p_cleared_count`: integer
    *   `p_correct_kanji_ids`: uuid[]
*   **処理:**
    1.  `learning_logs` にプレイ履歴を保存（モードを含める）。
    2.  `user_items` (エサ) のドロップ抽選と付与。
    3.  （確率で）`user_characters` の新規ドロップ判定と付与。
        *   **変更点:** 書き取りモードの場合、ドロップ率や報酬内容を調整してもよい（例: エサが出やすいなど）。
    4.  `user_missions` (デイリーミッション) の進捗更新。
*   **戻り値:** `json` (獲得したアイテム、キャラのリスト)

### 4.2. `rpc_feed_character`
エサ消費と経験値加算をトランザクション処理します。

*   **引数:**
    *   `p_user_id`: uuid
    *   `p_character_id`: uuid
    *   `p_item_id`: uuid
    *   `p_quantity`: integer
*   **処理:**
    1.  `user_items` から指定アイテムを減算（不足時はエラー）。
    2.  `items` テーブルから効果値を取得。
    3.  `user_characters` の `current_exp` / `friendship_level` を加算。
*   **戻り値:** `json` (更新後のステータス)

### 4.3. `rpc_evolve_character`
進化条件チェックとキャラクター更新を行います。

*   **引数:**
    *   `p_user_id`: uuid
    *   `p_user_character_id`: uuid
*   **処理:**
    1.  対象キャラの現在レベルと `characters` マスタの進化条件 (`required_exp_to_evolve`) を比較。
    2.  条件を満たしていれば、`user_characters` の参照する `character_id` を `next_evolution_id` に更新。
    3.  ステータスの一部引き継ぎやリセット処理。
*   **戻り値:** `json` (新しいキャラクター情報)

### 4.4. `rpc_process_login_bonus`
ログインボーナス処理を行います。

*   **引数:**
    *   `p_user_id`: uuid
*   **処理:**
    1.  `profiles` の `last_login_at` を確認。
    2.  前回ログインが昨日なら `login_streak` + 1、それ以前なら 1 にリセット。
    3.  `last_login_at` を現在時刻に更新。
    4.  ボーナスアイテムを `user_items` に付与。
*   **戻り値:** `json` (付与されたアイテム情報、連続日数)
