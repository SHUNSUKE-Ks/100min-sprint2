# 100min Sprint — 実装プラン

> 作成日：2026-04-28 | 対象バージョン：0.1.0 MVP

---

## プロジェクト概要

| 項目 | 内容 |
|------|------|
| アプリ名 | 100min Sprint |
| 形態 | PWA（Android縦型 / 375px固定） |
| 技術スタック | React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + Zustand 5 |
| MVP画面数 | 3画面（SprintBoard / Summary / Settings） |

---

## 実装フェーズ

### PHASE 1 — MVP コア機能

**目標：** SprintBoardでStepperが動作し、タイマーが動き、STEP完了でDonePopupが表示される状態

**実装順序：**

1. **プロジェクト初期化・フォルダ構造**
   - Vite + React + TypeScript テンプレート作成
   - 依存パッケージインストール（zustand, immer, lucide-react, uuid, date-fns, etc.）
   - フォルダ構造生成（styles / types / store / hooks / components / screens / utils）
   - Vitest セットアップ

2. **デザイン基盤**
   - `src/styles/globals.css` — CSS変数・Tailwind 4 インポート
   - `src/styles/tokens.ts` — TypeScript型付きトークン
   - Tailwind 4 + `@tailwindcss/vite` プラグイン設定

3. **型定義**
   - `src/types/sprint.ts` — Sprint / Task / Step 型
   - `src/types/settings.ts` — Settings 型

4. **状態管理（Zustand）**
   - `src/store/sprintStore.ts` — Sprint・Task状態
   - `src/store/timerStore.ts` — タイマー状態
   - `src/store/settingsStore.ts` — 設定状態

5. **レイアウト**
   - `src/components/layout/AppShell.tsx` — 375px固定ラッパー
   - `src/components/layout/Header.tsx` — ロゴ + TimerBar + ハンバーガー
   - `src/components/layout/AdFooter.tsx` — 広告フッター

6. **タイマー**
   - `src/hooks/useTimer.ts` — タイマーロジック
   - `src/components/timer/TimerBar.tsx` — Headerに常時表示するbarタイマー
   - `src/components/timer/TimerDisplay.tsx` — 残り分:秒テキスト
   - `src/utils/formatTime.ts` — 秒 → mm:ss変換

7. **Stepperコンポーネント**
   - `src/components/stepper/StepperList.tsx` — Step一覧（自動スライド管理）
   - `src/components/stepper/StepperItem.tsx` — 1Step（done/active/pending）
   - `src/components/stepper/StepContent.tsx` — 展開時の詳細（サブチェック）
   - `src/components/stepper/CodeBlock.tsx` — コマンド表示 + CopyIcon + Toast

8. **UIコンポーネント**
   - `src/components/ui/Toast.tsx` — コピー完了通知
   - `src/components/ui/BottomSheet.tsx` — 汎用ボトムシート
   - `src/components/ui/Toggle.tsx` — 汎用トグル
   - `src/hooks/useClipboard.ts` — コピー処理

9. **Sprint完了系**
   - `src/components/summary/PieChart.tsx` — 作業割合円グラフ（SVG）
   - `src/components/sprint/SprintDonePopup.tsx` — 完了時ポップアップ
   - `src/utils/calcProgress.ts` — Sprint進捗率計算

10. **画面・ルーティング**
    - `src/router.tsx` — React Router設定
    - `src/screens/SprintBoard.tsx` — メイン画面
    - `src/App.tsx` + `src/main.tsx` — エントリーポイント

---

### PHASE 2 — Sprint管理・設定・Import/Export

**目標：** Sprint切り替えができ、JsonをImportしてSprintを追加できる状態

1. **SprintSwitcher（ボトムシート）**
   - `src/components/sprint/SprintSwitcher.tsx` — Sprint一覧ボトムシート
   - `src/components/sprint/SprintSlot.tsx` — Sprint一覧1行
   - `src/hooks/useSprint.ts` — Sprintセレクタ

2. **Settings画面**
   - `src/screens/SettingsScreen.tsx` — タブ2構成（設定 / Import・Export）
   - タブ1: 広告ON/OFF + バイブON/OFF + ショートカット表示
   - タブ2: JsonImport + スキーマ表示 + Export

3. **Import/Export機能**
   - `src/features/importExport/JsonImporter.tsx` — テキスト貼り付け + バリデーション
   - `src/features/importExport/SchemaViewer.tsx` — スキーマcodeblock + CopyIcon
   - `src/features/importExport/validator.ts` — Jsonスキーマバリデーション

4. **Summary画面**
   - `src/screens/SummaryView.tsx` — 作業割合確認（Sprint DONE後）

---

### PHASE 3 — PWA対応

**目標：** PWAとしてインストール・オフライン動作できる状態

1. `vite-plugin-pwa` インストール
2. `public/manifest.json` 配置
3. `src/assets/icons/` SVGアイコン配置
4. ServiceWorker設定

---

## 設計上の重要ルール

- **デザイントークン必須：** ハードコードされた色は禁止。必ず `globals.css` のCSS変数を使用する
- **幅固定：** `--app-width: 375px` を厳守
- **状態管理：** Zustand + Immer でイミュータブル更新
- **アニメーション：** STEP完了時 200ms ease-out でスライド
- **広告：** MVP はconsoleログ + UIテキスト表示のみ

---

## アーキテクチャ概要

```
App.tsx
  └── RouterProvider (React Router DOM 7)
        └── AppShell (375px固定)
              ├── Header
              │     ├── TimerBar (常時表示)
              │     └── ハンバーガーボタン → SettingsScreen
              ├── [Route] SprintBoard
              │     ├── SprintSwitcher (ボトムシート)
              │     ├── StepperList
              │     │     └── StepperItem × n
              │     │           └── StepContent (サブチェック + CodeBlock)
              │     └── SprintDonePopup (完了時オーバーレイ)
              ├── [Route] SummaryView
              │     └── PieChart (SVG)
              └── AdFooter (固定フッター)

Store (Zustand):
  sprintStore   ← sprints[], activeSprint
  timerStore    ← elapsed, isRunning
  settingsStore ← adEnabled, vibrateOnStart
```
