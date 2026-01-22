# 開発ログ (Development Log)

## 2026-01-19

1.  **初期計画書の作成**
    *   内容: プロジェクト「あつまれ！漢字の森」の初期構想策定。落ち物パズル×育成ゲームの基本方針を決定。
    *   対象: `Documents/planning_document.md` (New)

2.  **ペルソナとコンセプトの修正**
    *   内容: ターゲット（よりちゃん）を「要領が良く干渉を嫌う」性格に再定義。「勉強」の要素を隠す「ステルス学習」へコンセプトをシフト。
    *   対象: `Documents/planning_document.md` (Update)

3.  **UXシナリオの作成**
    *   内容: ユーザーが学校から帰宅後、自発的にアプリを使い始める理想のストーリーを物語形式で作成。
    *   対象: `Documents/user_scenario.md` (New)

4.  **シナリオ構成のブラッシュアップ**
    *   内容: シナリオを「きっかけ」「利用」「価値」「変化」の4構成に整理し、体験の流れを明確化。
    *   対象: `Documents/user_scenario.md` (Update)

5.  **機能のエピック切り出し**
    *   内容: 主要機能を個別のマークダウンファイルに分割し、詳細を定義。
    *   対象:
        *   `Documents/epic_reading_practice.md` (New)
        *   `Documents/epic_character_collection.md` (New)
        *   `Documents/epic_feeding_breeding.md` (New)
        *   `Documents/epic_writing_practice.md` (New)

6.  **保護者機能とオンボーディングの追加**
    *   内容: ゲーム開始時のフローと、保護者によるご褒美設定機能を追加定義。
    *   対象:
        *   `Documents/epic_game_start.md` (New)
        *   `Documents/parent_scenario.md` (New)
        *   `Documents/epic_parent_settings.md` (New)

7.  **コア価値の再定義**
    *   内容: 計画書内の「開発の軸」を「コア価値（干渉しない・ステルス学習・肯定のみ）」とし、ユーザーへの価値提供にフォーカスした表現に変更。
    *   対象: `Documents/planning_document.md` (Update)

8.  **運用ルールの策定**
    *   内容: Documentsフォルダ内での作業時にログ記録を義務付けるルールを定義。
    *   対象:
        *   `Documents/00_rules.mcd` (New / User Renamed from `rules.mcd`)
        *   `Documents/00_log.md` (New)

9.  **ログフォーマットの変更**
    *   内容: ログの記述方式をトピック別から時系列順に変更。
    *   対象: `Documents/00_log.md` (Update)

10. **ターゲット・コア価値の再定義（親視点の追加）**
    *   内容:
        *   コア価値をよりちゃん目線の言葉（「秘密基地」「冒険」等）にリライト。
        *   ターゲットに「保護者（お父さん・お母さん）」を追加し、親向けのValue Proposition Canvasを作成。
        *   要件定義フェーズに集中するため、仕様・機能要件のセクションを削除。
    *   対象: `Documents/planning_document.md` (Update)

11. **ドキュメントフォルダ構成の整理**
    *   内容: エピックとシナリオのファイルを専用フォルダに移動し、整理。
    *   対象:
        *   `Documents/epics/` (New Folder) -> 関連するepic_*.mdファイルを移動
        *   `Documents/scenarios/` (New Folder) -> 関連する*_scenario.mdファイルを移動

12. **コンセプト刷新による計画書改訂**
    *   内容: コンセプトを「勉強を『攻略』に上書きする」に変更し、コア価値・ターゲット分析・バリュープロポジションを「攻略」「インストール」というキーワードに合わせて整合性を取る形に刷新。
    *   対象: `Documents/planning_document.md` (Update)

13. **全体ドキュメントの整合性修正**
    *   内容: 計画書のコンセプト変更（勉強→攻略・インストール）に伴い、全てのエピックファイルとシナリオファイルの用語や表現を一括で修正。「勉強」という言葉を排除し、「攻略」「ミッション」「クエスト」などのゲーム用語に統一。
    *   対象: `Documents/epics/*.md`, `Documents/scenarios/*.md` (Update)

14. **シナリオ詳細の再調整**
    *   内容: シナリオ内の心理描写を、「インストール」「攻略」というコア価値に即した表現にさらにブラッシュアップ。親のシナリオも「勉強の監視」から「攻略の応援」へのシフトを明確化。
    *   対象: `Documents/scenarios/user_scenario.md`, `Documents/scenarios/parent_scenario.md` (Update)

15. **ユーザーストーリーの刷新と新規エピック追加**
    *   内容:
        *   全てのエピックファイルのユーザーストーリーを、INVEST原則に基づいた「As a <User>, I want to <Action>, So that <Value>」フォーマットに書き換え。
        *   シナリオの要素（ログインボーナス、デイリーミッション）をカバーする新規エピック `epic_daily_engagement.md` を作成。
    *   対象: `Documents/epics/*.md` (Update/New)

16. **ユーザーストーリーの記述統一**
    *   内容: エピックファイル内の `As a (誰)` の記述を、「冒険する7歳のプレイヤー」などの修飾語を削除し、「子供」または「親」に統一。
    *   対象: `Documents/epics/*.md` (Update)

17. **オブジェクトモデリングの作成**
    *   内容: 全エピックからドメインオブジェクトとその関係性を抽出し、Mermaid記法による概念モデル図と詳細定義を作成。
    *   対象: `Documents/object_modeling.md` (New)

18. **設計書の作成 (DB/API/UI/Screen)**
    *   内容: `database_design.md` (Supabase前提のDB設計), `api_design.md` (Server Actions/RPC設計), `ui_ux_design.md` (Shadcn UIベースのUI/UX設計), `screen_design.md` (画面遷移と詳細) を作成。
    *   対象: `Documents/*_design.md` (New)

19. **書き取りモードのメインコンテンツ化**
    *   内容: 「読み」と「書き」を並列のコンテンツとして再定義。関連する全設計書（Epic, DB, API, Screen, UI/UX）を整合性を取って修正。
    *   対象: `Documents/epics/epic_writing_practice.md`, `Documents/*_design.md` (Update)

20. **UIコンポーネントの改善**
    *   内容: `GameButton`, `NarrativeProgress`, `EmotiveDialog` の3つのカスタムコンポーネントをUI/UX設計書に追加。
    *   対象: `Documents/ui_ux_design.md` (Update)

21. **マイルーム機能の追加**
    *   内容: 「継続性」「収集」を強化するため、マイルーム機能を仕様に追加。関連するEpic, DB, API, UI/UX, Screen設計書をすべて更新。
    *   対象: `Documents/epics/epic_character_collection.md`, `Documents/*_design.md` (Update)

22. **ドキュメントの記述詳細化**
    *   内容: 「変更なし」「省略」といった記述をすべて展開し、各ファイルが単体で仕様を網羅するように修正。
    *   対象: `Documents/api_design.md`, `Documents/database_design.md` (Update)

23. **ドキュメント管理ルールの更新**
    *   内容: 「変更なし」等の記述禁止ルールを明文化。
    *   対象: `Documents/00_rules.mcd` (Update)

24. **コンパニオンUIとゲーム演出の強化**
    *   内容:
        *   UI/UX設計書に `CompanionGuide` コンポーネント、インタラクティブな背景、ゲーム状態の環境反映（夕方、フィーバー）を追加。
        *   画面設計書にガイドキャラのアクション定義を追加。
        *   Epicにガイドキャラのストーリーを追加。
        *   API/DB設計書は既存の定義で対応可能なため更新なし。
    *   対象: `Documents/ui_ux_design.md`, `Documents/screen_design.md`, `Documents/epics/epic_character_collection.md` (Update)

25. **レスポンシブ対応方針の定義**
    *   内容: `Documents/ui_ux_design.md` に「7. レスポンシブ & デバイス対応方針」を追加。タブレットメイン、アスペクト比維持、タッチ/マウス両対応を明文化。
    *   対象: `Documents/ui_ux_design.md` (Update)

## 2026-01-21

26. **開発計画書の作成とSSOTファイルの整備**
    *   内容: Claude Code Harness を活用した開発フローを定義。Phase 1（プロジェクト基盤構築）の詳細タスクとPhase 2-8の概要を記載した `development_plan.md` を作成。同時に、プロジェクトルートにSSOT（Single Source of Truth）ファイル3つ（`Plans.md`, `decisions.md`, `patterns.md`）を作成し、タスク管理・技術決定・実装パターンの一元管理体制を確立。デグレード対策として、ハーネスレビュー、自動テスト、CI/CDパイプラインを開発フローに組み込む方針を明文化。
    *   対象:
        *   `Documents/development_plan.md` (New)
        *   `Plans.md` (New)
        *   `decisions.md` (New)
        *   `patterns.md` (New)
        *   `Documents/00_log.md` (Update)

27. **Next.js プロジェクト基盤の実装（Phase 1.1完了）**
    *   内容: Next.js 15 App Router プロジェクトの初期化を完了。TypeScript, Tailwind CSS v4, Framer Motion をインストール・設定。基本的なディレクトリ構造（app/, components/, lib/, public/）を構築し、ルートレイアウトとホーム画面を実装。Tailwind CSS v4 の新しい `@theme` ディレクティブとPostCSS設定を使用。開発サーバー起動、ビルド成功、ページ表示を確認し、Phase 1.1 の全タスクを完了。
    *   対象:
        *   `package.json` (New)
        *   `tsconfig.json` (New)
        *   `postcss.config.mjs` (New)
        *   `.prettierrc` (New)
        *   `.gitignore` (New)
        *   `next.config.js` (New)
        *   `app/layout.tsx` (New)
        *   `app/page.tsx` (New)
        *   `app/globals.css` (New)
        *   `Plans.md` (Update)
        *   `Documents/00_log.md` (Update)

28. **Supabase データベース基盤の実装（Phase 1.2完了）**
    *   内容: Supabase統合を完了。ブラウザ/サーバー用クライアントライブラリ設定、環境変数テンプレート作成、包括的なデータベーススキーマ（11テーブル）実装。RLSポリシーでセキュリティを確保し、トリガー関数で新規ユーザー自動作成・updated_at自動更新を実装。4つのRPC関数（rpc_finish_game, rpc_feed_character, rpc_evolve_character, rpc_process_login_bonus）でゲームロジックをDB側で処理。セットアップガイド（supabase/README.md）を作成し、Phase 1.2 の全タスクを完了。
    *   対象:
        *   `lib/supabase/client.ts` (New)
        *   `lib/supabase/server.ts` (New)
        *   `.env.example` (New)
        *   `supabase/migrations/20260121_initial_schema.sql` (New)
        *   `supabase/README.md` (New)
        *   `Plans.md` (Update)
        *   `Documents/00_log.md` (Update)


29. **認証システムの実装（Phase 1.3完了）**
    *   内容: Supabase匿名認証を使った完全な認証フローを実装。初回登録画面でひらがな名前入力、匿名認証でユーザー作成、セッションCookieによるオートログイン機能を実現。ミドルウェアで未認証ユーザーを登録ページへリダイレクト。保護者機能として計算問題（7+5=12）による認証ゲートを実装し、保護者ダッシュボード（学習サマリー、カスタムご褒美、設定のプレースホルダー）を作成。ホーム画面をユーザー名表示・保護者メニューリンク・モード選択ボタン付きに更新し、Phase 1.3 の全タスクを完了。
    *   対象:
        *   `app/register/page.tsx` (New)
        *   `app/actions/auth.ts` (New)
        *   `middleware.ts` (New)
        *   `app/parent/auth/page.tsx` (New)
        *   `components/auth/ParentGate.tsx` (New)
        *   `app/parent/dashboard/page.tsx` (New)
        *   `app/page.tsx` (Update)
        *   `Plans.md` (Update)
        *   `Documents/00_log.md` (Update)

30. **テスト基盤の整備（Phase 1.4完了）**
    *   内容: 包括的なテスト環境を構築し、Phase 1 の全実装に対する品質保証体制を確立。Jest + React Testing Library で単体テスト環境を構築し、ParentGateコンポーネントに6つのテストケース（計算問題表示、正解・不正解処理、キャンセル、バリデーション）を実装、カバレッジ80.76%を達成。Playwright で E2E テスト環境を構築し、5ブラウザ対応で5つのテストシナリオ（初回登録フロー、オートログイン、リダイレクト、保護者認証、入力バリデーション）を実装。GitHub Actions による CI/CD パイプライン（lint, unit-test, e2e-test, build の4ジョブ）を設定し、自動テスト実行体制を整備。テストガイド（`__tests__/README.md`）を作成し、ベストプラクティスとトラブルシューティングを文書化。全テストパス確認により Phase 1.4 を完了し、**Phase 1（プロジェクト基盤構築）全体を完了**。
    *   対象:
        *   `jest.config.js` (New)
        *   `jest.setup.js` (New)
        *   `playwright.config.ts` (New)
        *   `__tests__/components/auth/ParentGate.test.tsx` (New)
        *   `e2e/auth.spec.ts` (New)
        *   `__tests__/README.md` (New)
        *   `.github/workflows/test.yml` (New)
        *   `package.json` (Update - テストスクリプト追加)
        *   `Plans.md` (Update)
        *   `Documents/00_log.md` (Update)

31. **カスタムゲームコンポーネントの実装（Phase 2.1完了）**
    *   内容: ゲーム体験に特化した4つのカスタムコンポーネントを実装し、Phase 2（コアゲームロジック）を開始。GameButton（押下時沈み込み、正解・不正解フィードバック）、NarrativeProgress（キャラクター歩行アニメーション付きプログレスバー）、EmotiveDialog（Joy/Encourage/Zen バリアント対応ダイアログ）、CompanionGuide（ローディング・ホバーガイド機能付きコンパニオン）を Framer Motion を使用して実装。各コンポーネントに包括的な単体テスト（合計38テストケース）を作成し、全テストパス、カバレッジ 86.66%（components/game）を達成。lucide-react アイコンライブラリを導入し、視覚的に分かりやすいUIを実現。7歳児向けに大きなタッチターゲット、即時フィードバック、直感的な操作を重視した設計。Phase 2.1 を完了。
    *   対象:
        *   `components/game/GameButton.tsx` (New)
        *   `components/game/NarrativeProgress.tsx` (New)
        *   `components/game/EmotiveDialog.tsx` (New)
        *   `components/game/CompanionGuide.tsx` (New)
        *   `__tests__/components/game/GameButton.test.tsx` (New - 9テスト)
        *   `__tests__/components/game/NarrativeProgress.test.tsx` (New - 10テスト)
        *   `__tests__/components/game/EmotiveDialog.test.tsx` (New - 11テスト)
        *   `__tests__/components/game/CompanionGuide.test.tsx` (New - 8テスト)
        *   `package.json` (Update - lucide-react追加)
        *   `Plans.md` (Update)
        *   `Documents/00_log.md` (Update)

32. **読み攻略モード（落ち物パズル）の実装（Phase 2.2完了）**
    *   内容: 落ち物パズル形式の漢字読みゲームを実装。30個の小学1年生漢字と3つのステージを定義し、ゲームロジック（スコア計算、コンボシステム、タイムボーナス、ランク判定S/A/B/C/D）を実装。FallingKanji（落下アニメーション）、AnswerButtons（3択ボタン）、GameHUD（スコア・ライフ・タイマー・コンボ表示）の専用コンポーネントを作成。ステージ選択画面とゲームプレイ画面を実装し、タイマー更新、回答判定、リザルト表示の完全なゲームループを実現。ホーム画面に「よむ（おちもの）」ボタンのリンクを追加し、Phase 2.2 を完了。
    *   対象:
        *   `lib/data/kanji-data.ts` (New - 30漢字、3ステージ)
        *   `lib/game/reading-game-logic.ts` (New - ゲーム状態管理)
        *   `components/game/FallingKanji.tsx` (New)
        *   `components/game/AnswerButtons.tsx` (New)
        *   `components/game/GameHUD.tsx` (New)
        *   `app/play/reading/page.tsx` (New - ステージ選択)
        *   `app/play/reading/[stage]/page.tsx` (New - ゲームプレイ)
        *   `app/page.tsx` (Update - リンク追加)
        *   `middleware.ts` (Update - /play除外)

33. **書き攻略モード（書き順練習）の実装（Phase 2.3完了）**
    *   内容: SVGパスによる書き順アニメーションと3つの練習モード（デモ・なぞり・自己申告）を実装。12個の漢字の書き順データ（SVGパス定義）と3つのセットを作成。StrokeAnimation（書き順アニメーション）、DrawingCanvas（タッチ・マウス両対応のなぞり書きキャンバス、高DPI対応）の専用コンポーネントを実装。ゲームロジック（画数チェック、スコア計算、ランク判定）を実装し、セット選択画面とゲームプレイ画面（3モード切替）を作成。NarrativeProgressにcertificateアイコンを追加し、ホーム画面に「かく（おうぎ）」ボタンのリンクを追加。Phase 2.3 を完了し、**Phase 2（コアゲームロジック実装）全体を完了**。
    *   対象:
        *   `lib/data/stroke-data.ts` (New - 12漢字の書き順)
        *   `lib/game/writing-game-logic.ts` (New)
        *   `components/game/StrokeAnimation.tsx` (New)
        *   `components/game/DrawingCanvas.tsx` (New)
        *   `app/play/writing/page.tsx` (New - セット選択)
        *   `app/play/writing/[set]/page.tsx` (New - ゲームプレイ)
        *   `app/page.tsx` (Update - リンク追加)
        *   `components/game/NarrativeProgress.tsx` (Update - certificateアイコン)

34. **キャラクター図鑑システムの実装（Phase 3.1完了）**
    *   内容: 20種類のキャラクターと5段階のレアリティ、進化チェーン機能を持つ図鑑システムを実装。動物系（きつね、ねこ、いぬ等）、精霊系（火、水、風、土、星、月）、伝説系（りゅう、ゆにこーん等）のキャラクターを定義し、最大3段階の進化チェーン（例：こぎつね→きつね→きゅうびのきつね）を実装。CharacterCard（所持・未所持切替、レアリティバッジ、キラキラエフェクト）、CharacterGrid（フィルタ・ソート機能）のコンポーネントを作成。図鑑一覧画面（収集率サマリー、プログレスバー）とキャラクター詳細画面（ステータス、レベル・なつき度、進化チェーン表示）を実装し、ホーム画面の「ずかん」ボタンにリンクを追加。Phase 3.1 を完了。
    *   対象:
        *   `lib/data/character-data.ts` (New - 20キャラクター)
        *   `components/collection/CharacterCard.tsx` (New)
        *   `components/collection/CharacterGrid.tsx` (New)
        *   `app/collection/page.tsx` (New - 図鑑一覧)
        *   `app/collection/[characterId]/page.tsx` (New - キャラ詳細)
        *   `app/page.tsx` (Update - ずかんリンク)

35. **リザルト・報酬システムの実装（Phase 4完了）**
    *   内容: ゲームクリア時の報酬抽選とリザルト画面を実装。12種類のエサ（3段階のレアリティ）とランク別のドロップテーブル（S:キャラ80%/エサ100%、A:60%/90%、B:40%/80%、C:20%/60%、D:10%/40%）を定義。報酬計算ロジック（コイン、経験値、キャラ、エサ）とランク別の抽選ロジック（高ランクほどレアキャラ・レアエサ出現率UP）を実装。RewardDisplay（順次アニメーション、NEWバッジ、キラキラエフェクト）コンポーネントとリザルト画面（ランク表示、スコアサマリー、報酬表示）を作成。読み・書き攻略モードのリザルトダイアログに「ほうびをもらう」ボタンを追加し、URLパラメータでゲーム結果を渡す仕組みを実装。Suspense境界でuseSearchParamsに対応。Phase 4 を完了し、**基本的なゲームループ（プレイ→リザルト→報酬獲得→図鑑確認）を完成**。
    *   対象:
        *   `lib/data/reward-data.ts` (New - エサ、ドロップテーブル、報酬計算)
        *   `components/result/RewardDisplay.tsx` (New)
        *   `app/result/page.tsx` (New - リザルト画面)
        *   `app/play/reading/[stage]/page.tsx` (Update - リザルトリンク)
        *   `app/play/writing/[set]/page.tsx` (Update - リザルトリンク)

