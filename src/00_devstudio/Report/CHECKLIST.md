# 100min Sprint — 実装チェック表

> 作成日：2026-04-28 | 更新のたびに [ ] → [x] に変更

凡例：`[ ]` 未着手 / `[x]` 完了 / `[-]` スキップ・対象外

---

## PHASE 1 — MVP コア機能

### セットアップ

| # | タスク | ファイル/コマンド | 状態 |
|---|--------|------------------|------|
| 1 | Viteプロジェクト作成 | `npm create vite@latest` | [ ] |
| 2 | 依存パッケージ（dependencies）インストール | clsx / date-fns / immer / lucide-react / react-router-dom / tailwind-merge / uuid / zustand | [ ] |
| 3 | 開発依存パッケージ（devDependencies）インストール | @tailwindcss/vite / testing-library / vitest など | [ ] |
| 4 | フォルダ構造生成 | `mkdir -p src/{styles,types,store,...}` | [ ] |
| 5 | Vitest セットアップ | `vite.config.ts` + `src/test/setup.ts` | [ ] |
| 6 | `npm run dev` で起動確認 | http://localhost:5173 | [ ] |
| 7 | `npm run build` でビルド確認 | エラーなし | [ ] |

### デザイン基盤

| # | タスク | ファイル | 状態 |
|---|--------|---------|------|
| 8 | Tailwind 4 viteプラグイン設定 | `vite.config.ts` | [ ] |
| 9 | globals.css 作成（@import tailwindcss + CSS変数） | `src/styles/globals.css` | [ ] |
| 10 | tokens.ts 作成（TS型付きトークン） | `src/styles/tokens.ts` | [ ] |
| 11 | ハードコードされた色が使われていないことを確認 | — | [ ] |

### 型定義

| # | タスク | ファイル | 状態 |
|---|--------|---------|------|
| 12 | Sprint / Task / Step / StepType / TaskStatus / SprintStatus 型定義 | `src/types/sprint.ts` | [ ] |
| 13 | Settings 型定義 | `src/types/settings.ts` | [ ] |

### 状態管理（Zustand）

| # | タスク | ファイル | 状態 |
|---|--------|---------|------|
| 14 | SprintStore実装（sprints / activeSprint / actions） | `src/store/sprintStore.ts` | [ ] |
| 15 | TimerStore実装（elapsed / isRunning / start / pause / reset） | `src/store/timerStore.ts` | [ ] |
| 16 | SettingsStore実装（adEnabled / vibrateOnStart / toggles） | `src/store/settingsStore.ts` | [ ] |
| 17 | Immerによるイミュータブル更新が実装されていること | — | [ ] |

### ユーティリティ・フック

| # | タスク | ファイル | 状態 |
|---|--------|---------|------|
| 18 | formatTime.ts（秒 → mm:ss） | `src/utils/formatTime.ts` | [ ] |
| 19 | calcProgress.ts（Sprint進捗率計算） | `src/utils/calcProgress.ts` | [ ] |
| 20 | useTimer.ts（setIntervalによるタイマーロジック） | `src/hooks/useTimer.ts` | [ ] |
| 21 | useClipboard.ts（クリップボードコピー） | `src/hooks/useClipboard.ts` | [ ] |

### レイアウト

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 22 | AppShell.tsx 作成 | `src/components/layout/AppShell.tsx` | 幅375px固定・中央配置 | [ ] |
| 23 | Header.tsx 作成 | `src/components/layout/Header.tsx` | ロゴ・TimerBar・ハンバーガーボタン表示 | [ ] |
| 24 | AdFooter.tsx 作成 | `src/components/layout/AdFooter.tsx` | consoleログ + UIテキスト表示 + ON/OFFトグル | [ ] |

### タイマーコンポーネント

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 25 | TimerBar.tsx 作成 | `src/components/timer/TimerBar.tsx` | 進捗バー（セグメント表示） | [ ] |
| 26 | TimerDisplay.tsx 作成 | `src/components/timer/TimerDisplay.tsx` | 残り mm:ss 表示 | [ ] |
| 27 | タイマー start / pause / reset が動作すること | — | — | [ ] |
| 28 | 100分（6000秒）カウントダウンが正しく動作すること | — | — | [ ] |

### UIコンポーネント

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 29 | Toast.tsx 作成 | `src/components/ui/Toast.tsx` | コピー完了時に表示・自動消去 | [ ] |
| 30 | BottomSheet.tsx 作成 | `src/components/ui/BottomSheet.tsx` | スライドアップ表示・オーバーレイタップで閉じる | [ ] |
| 31 | Toggle.tsx 作成 | `src/components/ui/Toggle.tsx` | ON/OFFトグル動作 | [ ] |

### Stepperコンポーネント

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 32 | StepperList.tsx 作成 | `src/components/stepper/StepperList.tsx` | Step一覧表示・activeStep管理 | [ ] |
| 33 | StepperItem.tsx 作成 | `src/components/stepper/StepperItem.tsx` | done/active/pending の3状態表示 | [ ] |
| 34 | StepContent.tsx 作成 | `src/components/stepper/StepContent.tsx` | サブチェックボックス表示 | [ ] |
| 35 | CodeBlock.tsx 作成 | `src/components/stepper/CodeBlock.tsx` | コマンド表示 + CopyIconボタン | [ ] |
| 36 | チェックボックスON → 全サブステップ完了でSTEP完了 | — | — | [ ] |
| 37 | STEP完了 → 次STEPの見出しが画面上部にスクロール（scroll into view） | — | — | [ ] |
| 38 | 次STEPのアコーディオンが自動で開く（200ms ease-out） | — | — | [ ] |
| 39 | 全STEP完了 → SprintDonePopup が表示される | — | — | [ ] |

### Sprint完了系

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 40 | PieChart.tsx 作成（SVG円グラフ） | `src/components/summary/PieChart.tsx` | Task別作業割合を色分け表示 | [ ] |
| 41 | SprintDonePopup.tsx 作成 | `src/components/sprint/SprintDonePopup.tsx` | 円グラフ + 総作業時間 + 完了タスク数表示 | [ ] |
| 42 | 「次のSprintへ」ボタンが動作すること | — | — | [ ] |
| 43 | 「閉じる」ボタンが動作すること | — | — | [ ] |

### 画面・ルーティング

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 44 | router.tsx 作成（React Router DOM 7） | `src/router.tsx` | SprintBoard / SummaryView / Settings ルート定義 | [ ] |
| 45 | SprintBoard.tsx 作成 | `src/screens/SprintBoard.tsx` | SprintTitle + StepperList + DonePopup 統合 | [ ] |
| 46 | App.tsx 更新 | `src/App.tsx` | RouterProvider + AppShell 接続 | [ ] |
| 47 | main.tsx 更新 | `src/main.tsx` | globals.css インポート確認 | [ ] |

### PHASE 1 動作確認

| # | 確認項目 | 状態 |
|---|---------|------|
| 48 | `npm run dev` で起動し、SprintBoardが表示される | [ ] |
| 49 | タイマーがstart/pause/resetできる | [ ] |
| 50 | TimerBarがカウントダウンに連動して更新される | [ ] |
| 51 | Stepperのチェックボックスをクリックするとステップが進む | [ ] |
| 52 | CodeBlockのコピーボタンでToastが表示される | [ ] |
| 53 | 全STEP完了でSprintDonePopupが表示される | [ ] |
| 54 | `npm run test` でテストがパスする | [ ] |
| 55 | `npm run build` でエラーなくビルドできる | [ ] |
| 56 | TypeScript型エラーが0件 | [ ] |

---

## PHASE 2 — Sprint管理・設定・Import/Export

### SprintSwitcher

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 57 | useSprint.ts 作成（Sprintセレクタ） | `src/hooks/useSprint.ts` | activeSprintのデータが取得できる | [ ] |
| 58 | SprintSwitcher.tsx 作成 | `src/components/sprint/SprintSwitcher.tsx` | Sprint一覧をBottomSheetで表示 | [ ] |
| 59 | SprintSlot.tsx 作成 | `src/components/sprint/SprintSlot.tsx` | Sprint1行（タイトル・日付・進捗率） | [ ] |
| 60 | Sprintタイトルタップ → BottomSheet表示 | — | — | [ ] |
| 61 | SprintSlotタップ → activeSprint切り替え | — | — | [ ] |
| 62 | active Sprintがcyan強調で表示される | — | — | [ ] |
| 63 | 「新しいSprintを追加」ボタンが動作する | — | — | [ ] |

### Settings画面

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 64 | SettingsScreen.tsx 作成（タブ2構成） | `src/screens/SettingsScreen.tsx` | 設定タブ / Import・Exportタブ | [ ] |
| 65 | 広告ON/OFFトグルが動作する | — | — | [ ] |
| 66 | タイマー開始時バイブON/OFFトグルが動作する | — | — | [ ] |
| 67 | ショートカット一覧がCodeBlock表示される | — | — | [ ] |

### Import/Export機能

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 68 | validator.ts 作成（Jsonスキーマバリデーション） | `src/features/importExport/validator.ts` | Sprint型の必須フィールドを検証 | [ ] |
| 69 | JsonImporter.tsx 作成 | `src/features/importExport/JsonImporter.tsx` | テキストエリア貼り付け → バリデーション → 読み込み | [ ] |
| 70 | SchemaViewer.tsx 作成 | `src/features/importExport/SchemaViewer.tsx` | スキーマをCodeBlock表示 + CopyIcon | [ ] |
| 71 | Import成功時にsprintStoreに追加される | — | — | [ ] |
| 72 | Import失敗時にエラーメッセージが表示される | — | — | [ ] |
| 73 | Export: 現在のSprintデータをJSON出力 + コピーボタン | — | — | [ ] |

### Summary画面

| # | タスク | ファイル | 確認項目 | 状態 |
|---|--------|---------|---------|------|
| 74 | SummaryView.tsx 作成 | `src/screens/SummaryView.tsx` | PieChart + 作業時間サマリー表示 | [ ] |

### PHASE 2 動作確認

| # | 確認項目 | 状態 |
|---|---------|------|
| 75 | SprintSwitcherでSprint切り替えができる | [ ] |
| 76 | JSONをテキストエリアに貼り付けてImportできる | [ ] |
| 77 | 不正なJSONで適切なエラーが表示される | [ ] |
| 78 | Exportで現在データをJSONコピーできる | [ ] |
| 79 | Settings画面のトグルがsettingsStoreに反映される | [ ] |

---

## PHASE 3 — PWA対応

| # | タスク | ファイル/コマンド | 状態 |
|---|--------|-----------------|------|
| 80 | vite-plugin-pwa インストール | `npm install -D vite-plugin-pwa` | [ ] |
| 81 | VitePWA プラグイン設定 | `vite.config.ts` | [ ] |
| 82 | manifest.json 配置 | `public/manifest.json` | [ ] |
| 83 | icon-192x192.svg 配置 | `public/icons/icon-192x192.svg` | [ ] |
| 84 | icon-512x512.svg 配置 | `public/icons/icon-512x512.svg` | [ ] |
| 85 | ServiceWorkerが登録される | — | [ ] |
| 86 | Android Chromeで「ホーム画面に追加」が表示される | — | [ ] |
| 87 | オフラインでアプリが起動する | — | [ ] |
| 88 | `npm run build && npm run preview` でPWA確認 | — | [ ] |

---

## 横断的チェック

| # | 確認項目 | 状態 |
|---|---------|------|
| 89 | ハードコードされた色（#xxxxxx等）がsrc/以下に存在しない | [ ] |
| 90 | CSS変数（`--color-*`）が全コンポーネントで使われている | [ ] |
| 91 | 幅375pxを超えるコンテンツがない | [ ] |
| 92 | TypeScript strict modeでエラー0件 | [ ] |
| 93 | ESLintエラー0件 | [ ] |
| 94 | 全Zustand storeがImmerを通じてイミュータブルに更新している | [ ] |
| 95 | AdFooterのconsoleログが adEnabled フラグで制御されている | [ ] |

---

## 進捗サマリー

| フェーズ | 完了 / 合計 | 進捗 |
|---------|------------|------|
| PHASE 1 セットアップ | 0 / 7 | 0% |
| PHASE 1 デザイン基盤 | 0 / 4 | 0% |
| PHASE 1 型定義 | 0 / 2 | 0% |
| PHASE 1 状態管理 | 0 / 4 | 0% |
| PHASE 1 ユーティリティ | 0 / 4 | 0% |
| PHASE 1 レイアウト | 0 / 3 | 0% |
| PHASE 1 タイマー | 0 / 4 | 0% |
| PHASE 1 UIコンポーネント | 0 / 3 | 0% |
| PHASE 1 Stepper | 0 / 8 | 0% |
| PHASE 1 Sprint完了系 | 0 / 4 | 0% |
| PHASE 1 画面・ルーティング | 0 / 4 | 0% |
| PHASE 1 動作確認 | 0 / 9 | 0% |
| **PHASE 1 合計** | **0 / 56** | **0%** |
| PHASE 2 SprintSwitcher | 0 / 7 | 0% |
| PHASE 2 Settings | 0 / 4 | 0% |
| PHASE 2 Import/Export | 0 / 6 | 0% |
| PHASE 2 Summary | 0 / 1 | 0% |
| PHASE 2 動作確認 | 0 / 5 | 0% |
| **PHASE 2 合計** | **0 / 23** | **0%** |
| **PHASE 3 合計** | **0 / 9** | **0%** |
| **横断チェック** | **0 / 7** | **0%** |
| **総合計** | **0 / 95** | **0%** |
