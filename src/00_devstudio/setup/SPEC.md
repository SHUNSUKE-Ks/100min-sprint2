# 100min Sprint — 仕様書

# Version 0.1.0 MVP

# 作成日：2026-04-25

---

## 1. アプリ概要

| 項目       | 内容                                                                |
| ---------- | ------------------------------------------------------------------- |
| アプリ名   | 100min Sprint                                                       |
| 形態       | PWA（Progressive Web App）                                          |
| ターゲット | Android縦型 / PCは同幅（375px固定）                                 |
| 目的       | 100分スプリントを一周回す。タスクの見やすさ重視・迷わない製作手順書 |
| MVP画面数  | 3画面（SprintBoard / Summary / Settings）                           |
| 広告       | consoleログテキスト表示のみ / トグルON-OFF / スペース確保済み       |

---

## 2. 技術スタック

```
フレームワーク  : React 19 + TypeScript
ビルドツール    : Vite 8
スタイリング    : Tailwind CSS 4
状態管理        : Zustand 5 + Immer
ルーティング    : React Router DOM 7
アイコン        : Lucide React
ユニークID      : uuid
日付処理        : date-fns
テスト          : Vitest + @testing-library/react
PWA             : vite-plugin-pwa（別途追加）
```

### package.json（確定版）

```json
{
  "name": "100min-sprint",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "immer": "^11.1.4",
    "lucide-react": "^1.11.0",
    "react": "^19.2.5",
    "react-dom": "^19.2.5",
    "react-router-dom": "^7.14.2",
    "tailwind-merge": "^3.5.0",
    "uuid": "^14.0.0",
    "zustand": "^5.0.12"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@tailwindcss/vite": "^4.2.4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^24.12.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@types/uuid": "^10.0.0",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.5.0",
    "eslint": "^10.2.1",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.5.0",
    "jsdom": "^29.0.2",
    "postcss": "^8.5.10",
    "tailwindcss": "^4.2.4",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.58.2",
    "vite": "^8.0.10",
    "vitest": "^4.1.5"
  }
}
```

> ⚠️ 元のpackage.jsonから除外したもの：`@dnd-kit/*`（Stepper型UIにD&D不要）、`@lexical/react + lexical`（リッチテキスト不要）必要になった時点で追加する。

---

## 3. フォルダ構造

```
src/
├── main.tsx
├── App.tsx
├── router.tsx                    # React Router設定
│
├── styles/
│   ├── globals.css               # CSS変数・テーマ定義
│   └── tokens.ts                 # カラー・サイズトークン（TS）
│
├── types/
│   ├── sprint.ts                 # Sprint / Task / Step型定義
│   └── settings.ts               # Settings型定義
│
├── store/
│   ├── sprintStore.ts            # Zustand: Sprint・Task状態
│   ├── timerStore.ts             # Zustand: タイマー状態
│   └── settingsStore.ts          # Zustand: 設定状態
│
├── hooks/
│   ├── useTimer.ts               # タイマーロジック
│   ├── useSprint.ts              # Sprintセレクタ
│   └── useClipboard.ts           # CodeBlock copyIcon用
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx          # 全体ラッパー（幅375px固定）
│   │   ├── Header.tsx            # ロゴ + TimerBar + ハンバーガー
│   │   └── AdFooter.tsx          # 広告フッター（consoleログ）
│   │
│   ├── timer/
│   │   ├── TimerBar.tsx          # Headerに常時表示するbarタイマー
│   │   └── TimerDisplay.tsx      # 残り分:秒テキスト
│   │
│   ├── stepper/
│   │   ├── StepperList.tsx       # Step一覧（自動スライド管理）
│   │   ├── StepperItem.tsx       # 1Step（done/active/pending）
│   │   ├── StepContent.tsx       # 展開時の詳細（サブチェック）
│   │   └── CodeBlock.tsx         # コマンド表示 + CopyIcon + Toast
│   │
│   ├── sprint/
│   │   ├── SprintSwitcher.tsx    # Sprintタイトルタップ → ボトムシート
│   │   ├── SprintSlot.tsx        # ボトムシート内のSprintスロット1行
│   │   └── SprintDonePopup.tsx   # Sprint完了時の円グラフポップアップ
│   │
│   ├── summary/
│   │   └── PieChart.tsx          # 作業割合円グラフ（SVG）
│   │
│   └── ui/
│       ├── Toast.tsx             # コピー完了通知
│       ├── BottomSheet.tsx       # 汎用ボトムシート
│       └── Toggle.tsx            # 広告ON-OFFなど汎用トグル
│
├── screens/
│   ├── SprintBoard.tsx           # メイン画面（Stepper）
│   ├── SummaryView.tsx           # 作業割合確認（Sprint DONE後）
│   └── SettingsScreen.tsx        # ハンバーガーメニュー内フルページ
│
├── features/
│   └── importExport/
│       ├── JsonImporter.tsx      # テキスト貼り付け + スキーマ検証
│       ├── SchemaViewer.tsx      # スキーマcodeblock + CopyIcon
│       └── validator.ts          # Jsonスキーマバリデーションロジック
│
├── utils/
│   ├── formatTime.ts             # 秒 → mm:ss変換
│   └── calcProgress.ts           # Sprint進捗率計算
│
└── assets/
    ├── icons/
    │   ├── icon-192x192.svg
    │   └── icon-512x512.svg
    └── fonts/                    # モノスペースフォント（必要に応じて）
```

---

## 4. 画面仕様

### 4-1. SprintBoard（メイン・主役）

```
┌─────────────────────────────┐  ← 375px固定
│ [100] 100min Sprint  ██░ ≡  │  ← Header（常時固定）
│        ████████░░ 50% 42:30 │  ← TimerBar + 残り時間
├─────────────────────────────┤
│                             │
│  SPRINT_001 · シナリオ実装  │  ← タップでSprintSwitcher
│                             │
│  ✅ STEP1 設計完了          │  ← done（折りたたみ）
│  ▼ STEP2 実装中  ←─── 今ここ │  ← active（展開）
│    □ コンポーネント作成     │
│    □ Jsonスキーマ確認       │
│    ┌──────────────────────┐ │
│    │ $ /prototype      ⧉ │ │  ← CodeBlock + CopyIcon
│    └──────────────────────┘ │
│  › STEP3 テスト             │  ← pending（折りたたみ）
│  › STEP4 リリース確認       │
│                             │
├─────────────────────────────┤
│ [ AD SPACE · toggle:OFF ]   │  ← AdFooter（固定）
└─────────────────────────────┘
```

**スクロール・アニメーション仕様：**

- チェックボックスをチェック → 全sub-stepチェック済みでSTEP完了
- STEP完了 → 次STEPの見出しがAndroid画面上部にスライド（scroll into view）
- 次STEPのトグルが自動で開く（アニメーション：200ms ease-out）
- 全STEP完了 → SprintDonePopupを表示

---

### 4-2. SprintSwitcher（ボトムシート）

SprintBoardのSprintタイトル行をタップで出現。

```
┌─────────────────────────────┐
│ Sprint一覧                  │
├─────────────────────────────┤
│ ● SPRINT_001 シナリオ実装   │  ← 現在ACTIVE（cyan強調）
│   2026-04-25 | 完了40%      │
├─────────────────────────────┤
│   SPRINT_002 戦闘実装       │
│   未開始                    │
├─────────────────────────────┤
│   SPRINT_003 BGM実装        │
│   未開始                    │
├─────────────────────────────┤
│  [ + 新しいSprintを追加 ]   │
└─────────────────────────────┘
```

---

### 4-3. SprintDonePopup（完了時自動表示）

Sprint完了時にオーバーレイで表示。

```
┌─────────────────────────────┐
│   SPRINT_001 完了！         │
│                             │
│        [円グラフ]           │
│   シナリオ 40%              │
│   実装 35%                  │
│   テスト 25%                │
│                             │
│   総作業時間: 98:42         │
│   完了タスク: 5/5           │
│                             │
│  [ 次のSprintへ ] [ 閉じる ]│
└─────────────────────────────┘
```

---

### 4-4. SettingsScreen（ハンバーガーメニュー → フルページ）

タブ2構成。

**タブ1：設定**

```
- 広告表示 ON/OFF トグル
- タイマー開始時バイブON/OFF
- ショートカット一覧（将来: custom可）
  → キー一覧をcodeblock表示
```

**タブ2：Import / Export**

```
[スキーマ確認]
  Sprintスキーマをcodeblockで表示 + CopyIcon

[テキストImport]
  テキストエリアにJSON貼り付け
  → バリデーション実行
  → OK: アプリに読み込む / NG: エラー表示

[Export]
  現在のSprintデータをJSON出力 + コピーボタン
```

---

## 5. Jsonスキーマ（MVP確定版）

```typescript
// types/sprint.ts

export type StepType = "text" | "code";
export type TaskStatus = "TODO" | "DOING" | "DONE";
export type SprintStatus = "READY" | "ACTIVE" | "DONE";

export interface Step {
  id: string; // uuid
  label: string; // 表示テキスト
  checked: boolean;
  type: StepType;
  command?: string; // type === 'code' の時のみ
}

export interface Task {
  id: string; // uuid
  title: string;
  status: TaskStatus;
  steps: Step[];
  estimate: number; // 分
  result: number; // 実績分（Sprint完了時に確定）
}

export interface Sprint {
  sprintId: string; // uuid
  title: string;
  duration: number; // デフォルト100（分）
  startedAt: string | null; // ISO8601
  completedAt: string | null;
  status: SprintStatus;
  tasks: Task[];
}

// Done条件
// Task: 全Step.checked === true
// Sprint: 全Task.status === 'DONE' || 経過時間 >= duration
```

---

## 6. 状態管理設計（Zustand）

```typescript
// store/sprintStore.ts
interface SprintStore {
  sprints: Sprint[];
  activeSprint: string | null; // sprintId

  // actions
  addSprint: (sprint: Sprint) => void;
  setActiveSprint: (id: string) => void;
  checkStep: (taskId: string, stepId: string) => void;
  completeSprint: (sprintId: string) => void;
  importSprints: (data: Sprint[]) => void;
  exportSprints: () => string; // JSON文字列
}

// store/timerStore.ts
interface TimerStore {
  elapsed: number; // 秒
  isRunning: boolean;

  start: () => void;
  pause: () => void;
  reset: () => void;
}

// store/settingsStore.ts
interface SettingsStore {
  adEnabled: boolean;
  vibrateOnStart: boolean;

  toggleAd: () => void;
  toggleVibrate: () => void;
}
```

---

## 7. デザイントークン

```css
/* styles/globals.css */
:root {
  --color-bg-primary: #0d0f14;
  --color-bg-surface: #131620;
  --color-bg-elevated: #1a1d24;
  --color-border: #1e2128;
  --color-accent: #00d4cc;
  --color-accent-dim: #00d4cc22;
  --color-done: #22c55e;
  --color-warning: #ff6b35;
  --color-text-hi: #ffffff;
  --color-text-mid: #888888;
  --color-text-lo: #444444;
  --font-mono: "JetBrains Mono", "Courier New", monospace;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --app-width: 375px;
}
```

---

## 8. PWA設定

```json
// public/manifest.json
{
  "name": "100min Sprint",
  "short_name": "100min",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D0F14",
  "theme_color": "#00D4CC",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192x192.svg", "sizes": "192x192", "type": "image/svg+xml" },
    { "src": "/icons/icon-512x512.svg", "sizes": "512x512", "type": "image/svg+xml" }
  ]
}
```

---

## 9. 広告仕様

```typescript
// MVP: consoleログのみ
const AD_MESSAGES = ["[AD] ここに広告が入ります", "[AD] 100min Sprint powered by your focus"];

// AdFooter.tsx での動作
if (settings.adEnabled) {
  console.log(AD_MESSAGES[Math.floor(Math.random() * AD_MESSAGES.length)]);
  // UIにも1行テキスト表示
}

// 将来のbanner差込口はAdFooter内にdivスペースのみ確保
// [MOVE_TO:1000min] バナー広告実装
```

---

## 10. 実装フェーズ（スプリント分割）

```
PHASE 1（MVP）:
  ✅ プロジェクト初期化・フォルダ構造
  ✅ デザイントークン・globals.css
  ✅ AppShell（375px固定幅）
  ✅ Header + TimerBar
  ✅ StepperList + StepperItem（アニメーション）
  ✅ CodeBlock + CopyIcon + Toast
  ✅ Zustand store（sprint / timer / settings）
  ✅ SprintDonePopup + PieChart

PHASE 2:
  - SprintSwitcher（ボトムシート）
  - SettingsScreen（タブ2）
  - JsonImport/Export + Validator

PHASE 3:
  - PWA manifest + ServiceWorker
  - vite-plugin-pwa導入
  - アイコン配置
```

---

## 11. Done定義（Sprint単位）

```
PHASE 1 Done:
  → SprintBoardでStepperが動作し、タイマーが動き、
    STEP完了でDonePopupが表示される状態

PHASE 2 Done:
  → Sprint切り替えができ、JsonをImportしてSprintを追加できる状態

PHASE 3 Done:
  → PWAとしてインストール・オフライン動作できる状態
  → 常にリリースできる形をキープ
```

---

---

## 12. セットアップコマンド（Claude Code用）

### Step 1：プロジェクト作成

```bash
# Vite + React + TypeScript テンプレートで作成
npm create vite@latest 100min-sprint -- --template react-ts
cd 100min-sprint
```

### Step 2：依存パッケージインストール

```bash
# dependencies
npm install \
  clsx \
  date-fns \
  immer \
  lucide-react \
  react-router-dom \
  tailwind-merge \
  uuid \
  zustand

# devDependencies
npm install -D \
  @tailwindcss/vite \
  @testing-library/jest-dom \
  @testing-library/react \
  @testing-library/user-event \
  @types/node \
  @types/uuid \
  autoprefixer \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  jsdom \
  postcss \
  tailwindcss \
  vitest \
  @vitest/coverage-v8
```

### Step 3：Tailwind CSS 4 セットアップ

```bash
# vite.config.ts に @tailwindcss/vite プラグインを追加（後述）
# Tailwind 4はpostcss設定不要・globals.cssに @import だけでOK
```

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()]
});
```

```css
/* src/styles/globals.css */
@import "tailwindcss";

:root {
  --color-bg-primary: #0d0f14;
  --color-bg-surface: #131620;
  --color-bg-elevated: #1a1d24;
  --color-border: #1e2128;
  --color-accent: #00d4cc;
  --color-accent-dim: #00d4cc22;
  --color-done: #22c55e;
  --color-warning: #ff6b35;
  --color-text-hi: #ffffff;
  --color-text-mid: #888888;
  --color-text-lo: #444444;
  --font-mono: "JetBrains Mono", "Courier New", monospace;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --app-width: 375px;
}
```

### Step 4：フォルダ構造生成

```bash
mkdir -p src/{styles,types,store,hooks,components/{layout,timer,stepper,sprint,summary,ui},screens,features/importExport,utils,assets/{icons,fonts}}

# アイコンファイルをコピー
cp icon-192x192.svg src/assets/icons/
cp icon-512x512.svg src/assets/icons/
```

### Step 5：Vitest 設定

```typescript
// vite.config.ts に追記
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    coverage: { provider: "v8" }
  }
});
```

```typescript
// src/test/setup.ts
import "@testing-library/jest-dom";
```

### Step 6：動作確認

```bash
npm run dev      # http://localhost:5173
npm run test     # Vitest実行
npm run build    # 本番ビルド
npm run preview  # ビルド確認
```

### Step 7：PWA対応（PHASE 3で実施）

```bash
npm install -D vite-plugin-pwa
# vite.config.tsにVitePWA()プラグイン追加
# public/manifest.json配置
# public/icons/配置
```

---

## Claude Code 引き継ぎメモ

```
このSPEC.mdとSCOPE_NOTES.mdを最初に読ませること。

最初に依頼するタスク：
「SPEC.mdのフォルダ構造とセットアップコマンドに従って
 プロジェクトを初期化し、PHASE 1の実装を開始してください。
 最初はAppShell → Header → TimerBar の順で進めてください。」

デザイントークンはglobals.cssのCSS変数を必ず使うこと。
ハードコードされた色は禁止。
```

---

_SCOPE_NOTES.mdと併用して管理すること_ _最終更新：2026-04-25_

追加：（レイアウトSample）｛<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>100min Sprint - Sprint Board</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=JetBrains+Mono:wght@500;700&amp;family=Space+Grotesk:wght@500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-container": "#00d4cc",
                        "tertiary-fixed-dim": "#ffb868",
                        "on-tertiary": "#482900",
                        "on-error-container": "#ffdad6",
                        "on-secondary": "#003915",
                        "on-secondary-fixed-variant": "#005321",
                        "tertiary-container": "#ffad4a",
                        "surface-container-lowest": "#080f0f",
                        "outline": "#849492",
                        "secondary-container": "#00b954",
                        "on-primary": "#003735",
                        "on-primary-fixed": "#00201e",
                        "primary-fixed": "#54faf1",
                        "surface-dim": "#0d1514",
                        "surface-container-highest": "#2f3635",
                        "on-tertiary-fixed-variant": "#673d00",
                        "inverse-surface": "#dce4e2",
                        "error-container": "#93000a",
                        "surface-tint": "#23ddd5",
                        "secondary": "#4ae176",
                        "on-primary-container": "#005753",
                        "secondary-fixed": "#6bff8f",
                        "primary-fixed-dim": "#23ddd5",
                        "surface-container-high": "#242b2b",
                        "on-secondary-fixed": "#002109",
                        "inverse-on-surface": "#2a3231",
                        "outline-variant": "#3b4a48",
                        "on-surface-variant": "#bacac8",
                        "surface-bright": "#333b3a",
                        "primary": "#48f1e8",
                        "on-error": "#690005",
                        "on-surface": "#dce4e2",
                        "surface": "#0d1514",
                        "secondary-fixed-dim": "#4ae176",
                        "inverse-primary": "#006a66",
                        "on-tertiary-container": "#704300",
                        "tertiary-fixed": "#ffddbb",
                        "background": "#0d1514",
                        "error": "#ffb4ab",
                        "on-background": "#dce4e2",
                        "surface-variant": "#2f3635",
                        "surface-container-low": "#161d1c",
                        "tertiary": "#ffd2a5",
                        "on-secondary-container": "#004119",
                        "surface-container": "#1a2120",
                        "on-primary-fixed-variant": "#00504c",
                        "on-tertiary-fixed": "#2b1700"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "0.75rem"
                    },
                    "spacing": {
                        "unit": "4px",
                        "gutter": "12px",
                        "xl": "48px",
                        "md": "16px",
                        "container-max": "600px",
                        "lg": "24px",
                        "sm": "8px",
                        "xs": "4px"
                    },
                    "fontFamily": {
                        "button-text": ["Inter"],
                        "body-md": ["Inter"],
                        "headline-lg": ["Space Grotesk"],
                        "headline-md": ["Space Grotesk"],
                        "display-timer": ["JetBrains Mono"],
                        "data-label": ["JetBrains Mono"]
                    },
                    "fontSize": {
                        "button-text": ["13px", {"lineHeight": "1", "fontWeight": "600"}],
                        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "headline-lg": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "headline-md": ["18px", {"lineHeight": "24px", "fontWeight": "500"}],
                        "display-timer": ["48px", {"lineHeight": "1", "letterSpacing": "-0.05em", "fontWeight": "700"}],
                        "data-label": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>
<body class="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col pt-24 pb-20 md:pb-0">
<!-- TopAppBar -->
<header class="fixed top-0 w-full z-50 bg-[#0d0f14] border-b border-[#1e2128]">
<div class="flex flex-col w-full px-4 py-3 gap-3">
<div class="flex justify-between items-center w-full">
<div class="flex items-center gap-3">
<div class="w-7 h-7 bg-cyan-400/10 border border-cyan-400 rounded flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold">100</div>
<h1 class="font-['Space_Grotesk'] text-cyan-400 font-bold uppercase tracking-widest text-sm">
                100min Sprint
            </h1>
</div>
<div class="flex items-center gap-3">
<div class="flex gap-[2px]">
<div class="w-1.5 h-3 bg-cyan-400 rounded-sm"></div>
<div class="w-1.5 h-3 bg-cyan-400 rounded-sm"></div>
<div class="w-1.5 h-3 bg-slate-700 rounded-sm"></div>
</div>
<button class="text-cyan-400 hover:text-cyan-300 transition-colors duration-150 flex items-center justify-center w-8 h-8 rounded hover:bg-[#1a1d24]">
<span class="material-symbols-outlined">menu</span>
</button>
</div>
</div>
<div class="flex items-center gap-4 w-full">
<div class="flex-1 flex gap-1 h-3">
<div class="flex-1 bg-cyan-400 rounded-sm drop-shadow-[0_0_4px_rgba(0,212,204,0.5)]"></div>
<div class="flex-1 bg-cyan-400 rounded-sm drop-shadow-[0_0_4px_rgba(0,212,204,0.5)]"></div>
<div class="flex-1 bg-cyan-400 rounded-sm drop-shadow-[0_0_4px_rgba(0,212,204,0.5)]"></div>
<div class="flex-1 bg-cyan-400 rounded-sm drop-shadow-[0_0_4px_rgba(0,212,204,0.5)]"></div>
<div class="flex-1 bg-cyan-400 rounded-sm drop-shadow-[0_0_4px_rgba(0,212,204,0.5)]"></div>
<div class="flex-1 bg-slate-800 rounded-sm"></div>
<div class="flex-1 bg-slate-800 rounded-sm"></div>
<div class="flex-1 bg-slate-800 rounded-sm"></div>
<div class="flex-1 bg-slate-800 rounded-sm"></div>
<div class="flex-1 bg-slate-800 rounded-sm"></div>
</div>
<div class="font-mono text-cyan-400 text-xs font-bold">50%</div>
<div class="font-mono text-cyan-400 text-lg font-bold drop-shadow-[0_0_8px_rgba(0,212,204,0.5)] tracking-tight">42:30</div>
</div>
</div>
</header>
<!-- NavigationDrawer (Hidden by default, standard pattern) -->
<aside class="hidden fixed inset-y-0 left-0 w-64 z-[60] flex flex-col bg-[#0d0f14] border-r border-[#1e2128] shadow-2xl shadow-black/50">
<div class="h-16 flex items-center px-6 border-b border-[#1e2128]">
<span class="text-cyan-400 font-bold font-mono uppercase text-sm">SYSTEM MENU</span>
</div>
<nav class="flex-1 py-4 flex flex-col gap-1">
<a class="flex items-center gap-4 px-6 py-3 bg-[#1a1d24] text-cyan-400 border-l-2 border-cyan-400 font-mono uppercase text-sm" href="#">
<span class="material-symbols-outlined">timer</span>
                Sprint Board
            </a>
<a class="flex items-center gap-4 px-6 py-3 text-slate-400 hover:bg-[#131620] hover:text-cyan-200 transition-colors font-mono uppercase text-sm" href="#">
<span class="material-symbols-outlined">list_alt</span>
                Active Sprints
            </a>
<a class="flex items-center gap-4 px-6 py-3 text-slate-400 hover:bg-[#131620] hover:text-cyan-200 transition-colors font-mono uppercase text-sm" href="#">
<span class="material-symbols-outlined">terminal</span>
                Import/Export
            </a>
<a class="flex items-center gap-4 px-6 py-3 text-slate-400 hover:bg-[#131620] hover:text-cyan-200 transition-colors font-mono uppercase text-sm" href="#">
<span class="material-symbols-outlined">tune</span>
                General Settings
            </a>
</nav>
</aside>
<!-- Main Content Canvas -->
<main class="flex-1 w-full max-w-container-max mx-auto px-4 py-6 flex flex-col gap-6">
<!-- Sprint Title Area -->
<section class="bg-surface-container border border-outline-variant rounded-lg p-4 cursor-pointer hover:bg-surface-container-high transition-colors group mt-4">
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary group-hover:drop-shadow-[0_0_8px_rgba(72,241,232,0.3)] transition-all">layers</span>
<h2 class="font-headline-md text-headline-md text-on-surface">SPRINT_001 <span class="text-outline">·</span> シナリオ実装</h2>
</div>
<span class="material-symbols-outlined text-outline">chevron_right</span>
</div>
</section>
<!-- Stepper List -->
<section class="flex flex-col gap-3 relative">
<!-- Connecting Line -->
<div class="absolute left-6 top-6 bottom-6 w-[1px] bg-outline-variant z-0"></div>
<!-- Step 1: Done -->
<article class="relative z-10 flex gap-4">
<div class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-surface border border-secondary rounded-full mt-1">
<span class="material-symbols-outlined text-secondary">check</span>
</div>
<div class="flex-1 bg-surface-container border border-outline-variant rounded-lg p-4 flex items-center justify-between opacity-60">
<span class="font-headline-md text-headline-md text-on-surface line-through">設計完了</span>
<div class="px-2 py-1 bg-secondary/10 border border-secondary/30 rounded font-data-label text-data-label text-secondary uppercase">Done</div>
</div>
</article>
<!-- Step 2: Active -->
<article class="relative z-10 flex gap-4">
<div class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-surface border border-primary rounded-full mt-1 drop-shadow-[0_0_8px_rgba(72,241,232,0.3)]">
<div class="w-3 h-3 bg-primary rounded-full"></div>
</div>
<div class="flex-1 bg-[#1a1d24] border border-primary rounded-lg p-4 flex flex-col gap-4 shadow-lg drop-shadow-[0_0_4px_rgba(72,241,232,0.1)]">
<div class="flex items-center justify-between">
<span class="font-headline-md text-headline-md text-primary">実装中</span>
<div class="px-2 py-1 bg-primary/10 border border-primary/30 rounded font-data-label text-data-label text-primary uppercase animate-pulse">Active</div>
</div>
<div class="flex flex-col gap-2 mt-2">
<label class="flex items-center gap-3 group cursor-pointer">
<div class="w-5 h-5 flex items-center justify-center border border-primary bg-primary/20 rounded-sm">
<span class="material-symbols-outlined text-[16px] text-primary">check</span>
</div>
<span class="text-outline line-through text-sm">コンポーネント作成</span>
</label>
<label class="flex items-center gap-3 group cursor-pointer">
<div class="w-5 h-5 border border-outline-variant rounded-sm group-hover:border-primary transition-colors"></div>
<span class="text-on-surface text-sm">Jsonスキーマ確認</span>
</label>
</div>
<div class="mt-4 bg-surface-container-lowest border border-outline-variant rounded p-3 flex items-center justify-between font-data-label text-data-label">
<span class="text-tertiary-fixed-dim">$ /prototype</span>
<button class="text-outline hover:text-primary transition-colors flex items-center justify-center">
<span class="material-symbols-outlined text-[18px]">content_copy</span>
</button>
</div>
</div>
</article>
<!-- Step 3: Pending -->
<article class="relative z-10 flex gap-4">
<div class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-surface border border-outline-variant rounded-full mt-1">
<span class="font-data-label text-data-label text-outline">3</span>
</div>
<div class="flex-1 bg-surface border border-outline-variant rounded-lg p-4 flex items-center justify-between">
<span class="font-headline-md text-headline-md text-outline">テスト</span>
<span class="material-symbols-outlined text-outline">expand_more</span>
</div>
</article>
<!-- Step 4: Pending -->
<article class="relative z-10 flex gap-4">
<div class="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-surface border border-outline-variant rounded-full mt-1">
<span class="font-data-label text-data-label text-outline">4</span>
</div>
<div class="flex-1 bg-surface border border-outline-variant rounded-lg p-4 flex items-center justify-between">
<span class="font-headline-md text-headline-md text-outline">リリース確認</span>
<span class="material-symbols-outlined text-outline">expand_more</span>
</div>
</article>
</section>
</main>
<!-- BottomNavBar (Mobile Only) -->
<nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-14 px-2 pb-safe bg-[#131620] border-t border-[#1e2128] rounded-t-none shadow-none">
<a class="flex flex-col items-center justify-center text-cyan-400 drop-shadow-[0_0_8px_rgba(0,212,204,0.3)] hover:bg-[#1a1d24] flex-1 h-full font-mono text-[10px] tracking-tighter" href="#">
<span class="material-symbols-outlined mb-1">dashboard</span>
            BOARD
        </a>
<a class="flex flex-col items-center justify-center text-slate-500 hover:bg-[#1a1d24] flex-1 h-full font-mono text-[10px] tracking-tighter" href="#">
<span class="material-symbols-outlined mb-1">layers</span>
            SWITCHER
        </a>
<a class="flex flex-col items-center justify-center text-slate-500 hover:bg-[#1a1d24] flex-1 h-full font-mono text-[10px] tracking-tighter" href="#">
<span class="material-symbols-outlined mb-1">settings</span>
            SETTINGS
        </a>
</nav>
<!-- AdFooter -->
<div class="fixed bottom-14 left-0 w-full h-6 px-4 flex items-center justify-between pointer-events-none bg-black/80 backdrop-blur-md border-t border-[#1e2128]">
<span class="font-mono text-[9px] text-slate-500">CONSOLE v1.0.4 - IDLE</span>
<div class="flex gap-4 pointer-events-auto">
<button class="font-mono text-[9px] text-slate-600 hover:text-slate-300">TOGGLE_LOGS</button>
<span class="font-mono text-[9px] text-slate-600">[ AD SPACE · toggle:OFF ]</span>
</div>
</div>
</body></html>｝
