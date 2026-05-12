# API 導入資料: Hono MiniForge — ノベルゲームシート連携

**送付元:** Hono MiniForge 開発チーム  
**日付:** 2026-04-13  
**対象アプリ:** `100min-sprint2`（タスク管理ツール）  
**目的:** TRPG風ノベルゲーム初期生成シートをアプリ内から記入・JSON出力できるページを追加する

---

## 概要

Hono MiniForge Server が提供するシートAPIを使って、
このアプリ内にシート記入ページを追加します。

```
100min-sprint2（React）
    ↓  fetch
Hono MiniForge Server（Vercel）GET /api/novel/sheet/:id
    ↓  JSON
シートデータ表示・記入・出力
```

---

## 接続先

| 環境 | Base URL |
|------|----------|
| 本番（Vercel） | `https://hono-miniforge-server.vercel.app` |
| ローカル開発 | `http://localhost:3000` |

```ts
// .env.local に追加
VITE_HONO_BASE_URL=https://hono-miniforge-server.vercel.app
```

---

## 使用エンドポイント（シートのみ）

| Method | Path | 用途 | 状態 |
|--------|------|------|------|
| GET | `/api/novel/sheet/:id` | シートテンプレート取得 | 実装予定 |
| POST | `/api/novel/sheet` | 記入済みシート保存 | Vercel KV 実装待ち |

> **現段階（Phase 1）:** API 通信なし。フロントエンドだけで完結し、JSON をローカルにダウンロードする。

---

## シートの JSON 構造（出力形式）

```ts
// src/types/novelSheet.ts として追加
export interface NovelSheet {
  meta: {
    schema_version: string   // '1.0'
    label: string            // 表示名（日本語OK）
    id: string               // ファイルID（英数字_-）
    memo: string
    thumbnail: string | null // base64 or null
    created_at: string       // ISO8601
  }
  world: {
    name: string         // 世界名
    civilization: string // 文明レベル
    power: string        // 支配構造
    taboo: string        // 禁忌
    problem: string      // 世界の問題
  }
  characters: [
    {
      characterID: 'CHAR_001'
      role: 'protagonist'
      name: string
      purpose: string      // 目的
      fear: string         // 恐怖
      flaw: string         // 欠点
      fight_reason: string // 戦う理由
    },
    {
      characterID: 'CHAR_002'
      role: 'heroine'
      name: string
      relationship: string // 主人公との関係
      secret: string       // 隠し事
    }
  ]
  systems: Array<
    'branch' | 'affection' | 'explore' | 'item' |
    'battle' | 'glossary' | 'cg' | 'multiend'
  >
  scenario: {
    first_incident: string    // 最初の事件
    player_objective: string  // プレイヤー目的
    chapter1_event: string    // 第一章開始イベント
  }
  custom_code: string | null
}
```

### systems の値一覧

| 値 | 表示名 |
|----|--------|
| `branch` | 分岐 |
| `affection` | 好感度 |
| `explore` | 探索 |
| `item` | アイテム |
| `battle` | 戦闘 |
| `glossary` | 用語辞典 |
| `cg` | CG収集 |
| `multiend` | マルチエンド |

---

## 実装手順

### Step 1: 型ファイルを追加

```
src/types/novelSheet.ts   ← 上記の型定義を貼る
```

### Step 2: JSON 出力ユーティリティを追加

```ts
// src/utils/exportSheet.ts
import type { NovelSheet } from '../types/novelSheet'

export function downloadSheet(sheet: NovelSheet): void {
  const json = JSON.stringify(sheet, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: `${sheet.meta.id}_sheet.json`,
  })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 将来: POST /api/novel/sheet が実装されたらこちらを使う
// export async function saveSheetToServer(sheet: NovelSheet) {
//   const base = import.meta.env.VITE_HONO_BASE_URL
//   const res = await fetch(`${base}/api/novel/sheet`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(sheet),
//   })
//   return res.json()
// }
```

### Step 3: シートページコンポーネントを作成

```
src/screens/NovelSheetScreen.tsx  （新規作成）
```

UI 構成（動作リファレンス: `https://hono-miniforge-server.vercel.app/sheet.html`）：

```
┌─ NovelSheetScreen ──────────────────────────────┐
│  [← 戻る]  🎭 ノベルゲーム生成シート  [進捗バー]│
├─────────────────────────────────────────────────┤
│  📋 Project Info                                │
│     ラベル（日本語） / ファイルID（英数字）      │
│  🌍 World                                       │
│     世界名 / 文明 / 支配構造 / 禁忌 / 問題      │
│  👤 Characters                                  │
│     ── 主人公: 名前・目的・恐怖・欠点・理由     │
│     ── ヒロイン: 名前・関係・隠し事             │
│  ⚙️ Game Systems（チェックボックス複数選択）    │
│  📖 Scenario Intro                              │
│     最初の事件 / プレイヤー目的 / 第一章イベント│
├─────────────────────────────────────────────────┤
│              [クリア]  [⬇ JSON Export]          │
└─────────────────────────────────────────────────┘
```

### Step 4: ルーターに追加

```ts
// src/router.tsx
import { NovelSheetScreen } from './screens/NovelSheetScreen'

{ path: '/novel-sheet', element: <NovelSheetScreen /> }
```

### Step 5: ナビゲーションにリンク追加

```tsx
<NavLink to="/novel-sheet">🎭 ゲームシート</NavLink>
```

---

## フェーズ計画

### Phase 1（今すぐ実装可能）
- フロント完結。API 通信なし
- フォームに入力 → JSON をブラウザからダウンロード
- 動作リファレンス: `sheet.html` と同じロジックを React に移植するだけ

### Phase 2（Vercel KV 実装後）
- `POST /api/novel/sheet` でサーバーに保存
- `GET /api/novel/sheet/:id` で保存済みシートを取得・編集
- アプリ内のシート一覧ページと連携

---

## 動作リファレンス

実装のお手本として以下をブラウザで確認できます：

| URL | 内容 |
|-----|------|
| `https://hono-miniforge-server.vercel.app/sheet.html` | シート記入UI（Vanilla JS版） |
| `https://hono-miniforge-server.vercel.app/manual.html` | マニュアル（Android/開発者向け） |

フォームの入力項目・JSON構造・進捗バーのロジックはすべて `sheet.html` 内に実装済みです。  
React への移植時はこの HTML を読みながら進めてください。

---

## CORS

このアプリ（`localhost:5173`）はサーバー側の許可リストに追加済みです。  
追加設定なしで fetch が使えます。

---

## 返送先・連絡先

サーバー側の追加実装が必要な場合：

- **リポジトリ:** `https://github.com/SHUNSUKE-Ks/hono-miniforge-server`
- **MailBox 返送先:** `3000_App/100min-sprint2/src/00_devstudio/MailBox/`
