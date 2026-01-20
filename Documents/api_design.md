# API設計書 (API Design Document)

## 1. 概要
（変更なし）

## 2. 共通仕様
（変更なし）

## 3. Server Actions

### 3.1. ユーザー・認証 (`userActions.ts`)
（変更なし）

### 3.2. ゲームプレイ (`gameActions.ts`)

#### `fetchGameData`
*   **概要:** ゲーム開始に必要なマスタデータ（漢字リスト、設定）を取得する。
*   **引数:**
    *   `grade`: `number` (学習学年)
    *   `mode`: `'reading' | 'writing'` (**追加:** モード指定)
*   **戻り値:** `Promise<{ kanjis: Kanji[], config: GameConfig }>`

#### `submitGameResult`
*   **概要:** ゲーム終了時にプレイ結果を送信し、報酬を受け取る。
*   **引数:**
    *   `mode`: `'reading' | 'writing'` (**追加:** モード指定)
    *   `result`: `{ score: number, clearedCount: number, playTimeSec: number, correctKanjiIds: string[] }`
*   **戻り値:** `Promise<{ gainedExp: number, drops: Item[], newCharacters: Character[] }>`
*   **内部処理:** RPC `rpc_finish_game` を呼び出し、サーバーサイドでドロップ抽選を行う。

### 3.3. キャラクター・育成 (`characterActions.ts`)
（変更なし）

### 3.4. 保護者・ご褒美 (`parentActions.ts`)
（変更なし）

---

## 4. Database Functions (RPC)

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

（その他のRPCは変更なし）
