# MiniForge 実装レポート

**作成日:** 2026-05-12  
**対象アプリ:** `100min-sprint2`  
**ステータス:** Phase 1 完了（スタンドアロン動作確認済み）

---

## 1. 概要

`100min-sprint2` アプリ内に **MiniForge** 機能を実装。  
TRPG風ノベルゲーム生成シートの記入・JSON出力・ドラフト管理を行うツールとして、既存の100minスプリント機能と**アプリ切り替え（ステート駆動）**で共存する形で構築した。

---

## 2. アーキテクチャ

### アプリ切り替え

```
Header タイトル [100min Sprint ▾] / [MiniForge ▾]
        ↓ タップ
  ドロップダウン選択
        ↓
  useAppStore.activeApp: 'sprint' | 'miniforge'
        ↓
  RootLayout が条件分岐
    sprint   → <Outlet /> （既存ルーター）
    miniforge → <MiniForgeView />
```

**管理ストア:** `src/store/appStore.ts`（Zustand + persist）

---

### MiniForge 内部構造

```
MiniForgeView
  ├── [Sheet]    タブ
  │     TEMPLATE ラベル + [📂 LOAD] ボタン
  │     ギャラリー: [v1.1] [v2.1] [+]
  │     iframe (srcdoc)
  │     SaveSlotPanel (BottomSheet)
  │
  ├── [Archive]  タブ
  │     エクスポート済みJSON一覧
  │     ファイル名 / 日時 / 削除ボタン
  │
  └── [Config]   タブ
        [DRAFTS] [SCHEMAS] [HTML FILES] セクション切り替え
        DraftPanel / SchemaPanel / HtmlPanel
```

---

## 3. 実装ファイル一覧

### ストア

| ファイル | 役割 |
|---|---|
| `src/store/appStore.ts` | activeApp ステート管理（sprint / miniforge） |

### フック（localStorage管理）

| ファイル | キー | 最大件数 | 内容 |
|---|---|---|---|
| `useSchemaRegistry.ts` | `mf_schemas` | 無制限 | スキーマ定義一覧 |
| `useHtmlRegistry.ts` | `mf_html` | 無制限 | 登録HTMLファイル |
| `useArchive.ts` | `mf_archive` | 無制限 | エクスポート済みJSON |
| `useDrafts.ts` | `mf_drafts` | **10件** | 作業中ドラフト（お気に入り順） |

### コンポーネント

| ファイル | 説明 |
|---|---|
| `SheetTab.tsx` | テンプレートギャラリー + iframe + LOADボタン |
| `SaveSlotPanel.tsx` | セーブスロット10枠 / 星お気に入り / Load |
| `ArchiveTab.tsx` | エクスポート履歴リスト |
| `ConfigTab.tsx` | DRAFTS / SCHEMAS / HTML FILES セクション |
| `DraftPanel.tsx` | ドラフト一覧（Config内） |
| `SchemaPanel.tsx` | スキーマ表示・コピー |
| `SchemaAddModal.tsx` | スキーマ追加BottomSheet |
| `HtmlPanel.tsx` | HTMLファイル一覧 |
| `HtmlRegisterModal.tsx` | HTML登録BottomSheet |
| `HtmlPreview.tsx` | iframe プレビュー（MiniForgeScreen用） |

### ビュー / スクリーン

| ファイル | 説明 |
|---|---|
| `src/views/MiniForgeView.tsx` | MiniForge メインビュー（ステート駆動） |
| `src/screens/MiniForgeScreen.tsx` | ルーター経由アクセス用（/miniforge） |

### データ

| ファイル | 内容 |
|---|---|
| `data/defaultSchemas.ts` | NovelSheet v1.0 スキーマ初期値 |
| `data/defaultHtml.ts` | scenario_sheet_v1.1 / novel_sheet_v2.1 HTML |

---

## 4. HTMLテンプレート仕様

### scenario_sheet_v1.1（シンプル版）

| 項目 | 内容 |
|---|---|
| セクション | 世界観 / キャラクター / 必要システム |
| 出力 | JSON ダウンロード |
| postMessage | `mf-export` のみ |

### novel_sheet_v2.1（フル版）

| 項目 | 内容 |
|---|---|
| セクション | Project Info / World / Characters（主人公+ヒロイン）/ Game Systems / Scenario Intro |
| 進捗バー | 17フィールド対象、リアルタイム更新 |
| ボタン | クリア（確認ダイアログ）/ 保存 / ⬇ Export |
| postMessage送信 | `mf-export`（Export時）/ `mf-save`（保存時） |
| postMessage受信 | `mf-load`（セーブスロットからロード） |
| 対応 | TABキー移動時のスクロール補正（footer被り防止） |
| モバイル | Android Pixel 6a 縦画面最適化・sticky header・fixed footer |

---

## 5. データフロー

```
[v2.1 iframe]
  ├── [保存] → postMessage mf-save → useDrafts.save() → localStorage mf_drafts
  ├── [Export] → download JSON
  │            → postMessage mf-export → useArchive.add() → localStorage mf_archive
  └── ← postMessage mf-load ← SaveSlotPanel [Load] ← useDrafts
```

---

## 6. セーブスロット仕様

- **最大10件**
- 同ラベルは上書き
- **お気に入り（★）** をトグルで先頭固定
- 各スロット表示: 番号 / 星 / ラベル / バージョン / 進捗バー / 更新日時（MM/DD HH:mm）/ Loadボタン
- 空きスロットはグレー表示
- Load実行 → v2.1 HTML の全フィールドに postMessage で自動入力 → 先頭スクロール

---

## 7. スキーマ一覧

### NovelSheet v1.0（初期登録済み）

```json
{
  "meta": { "schema_version", "label", "id", "memo", "thumbnail", "created_at" },
  "world": { "name", "civilization", "power", "taboo", "problem" },
  "characters": [
    { "characterID": "CHAR_001", "role": "protagonist",
      "name", "purpose", "fear", "flaw", "fight_reason" },
    { "characterID": "CHAR_002", "role": "heroine",
      "name", "relationship", "secret" }
  ],
  "systems": ["branch", "affection", "explore", "item", "battle", "glossary", "cg", "multiend"],
  "scenario": { "first_incident", "player_objective", "chapter1_event" },
  "custom_code": null
}
```

---

## 8. localStorage キー一覧

| キー | 型 | 説明 |
|---|---|---|
| `active-app` | `'sprint' \| 'miniforge'` | 最後に選択したアプリ |
| `mf_schemas` | `SchemaEntry[]` | スキーマ登録データ |
| `mf_html` | `HtmlEntry[]` | HTMLテンプレート登録データ |
| `mf_drafts` | `DraftEntry[]` | 作業中ドラフト（最大10件） |
| `mf_archive` | `ArchiveEntry[]` | エクスポート済みJSONアーカイブ |

**PWA 再起動後も全データ保持。** ブラウザの「サイトデータを削除」操作のみで消去される。

---

## 9. 実装フェーズ

| フェーズ | 内容 | 状態 |
|---|---|---|
| Phase 1 | スタンドアロン（API通信なし） | ✅ 完了 |
| Phase 2 | Hono MiniForge POST/GET 連携 | ⬜ 未着手 |
| Phase 3 | 100MIN タスクとの連携表示 | ⬜ 保留（MiniForge安定後） |

---

## 10. 今後の検討事項

- ドラフトの100MIN側での表示パネル（MiniForge専用ViewをSprintBoard内に設置）
- Quest受注型の進捗管理（draft → ready → exported のステータス遷移）
- Dropbox納品フロー（Phase 2でAPI実装が難航した場合のフォールバック）
- HTMLテンプレートの複数ページ対応（ヘッダーナビゲーション追加）
- Hono Server側の `POST /api/novel/sheet` 実装（Vercel KV）

---

## 11. 関連ファイル

| パス | 内容 |
|---|---|
| `src/00_devstudio/MailBox/2026-04-13_hono-miniforge-api-integration.md` | Hono MiniForge API仕様書 |
| `src/features/miniforge/` | MiniForge 機能モジュール本体 |
| `src/views/MiniForgeView.tsx` | MiniForge メインビュー |
| `src/store/appStore.ts` | アプリ切り替えストア |
