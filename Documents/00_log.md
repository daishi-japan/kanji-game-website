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
