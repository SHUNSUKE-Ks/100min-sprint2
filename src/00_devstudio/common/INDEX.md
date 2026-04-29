# JSON Schema Common Components 📦

> JSON スキーマの表示、バリデーション、インポート/エクスポート機能を提供する汎用コンポーネント集

## 🎯 概要

このモジュールは、複数のアプリケーションで JSON スキーマの処理を統一し、再利用可能にするために設計されました。

- ✅ 汎用的で型安全
- ✅ ゼロ依存（React 以外）
- ✅ カスタマイズ可能
- ✅ 完全なドキュメント付き

## 📚 ドキュメント

| ドキュメント | 対象者 | 内容 |
|------------|------|------|
| **[README.md](./README.md)** | 開発者 | API ドキュメント、使用方法、型定義 |
| **[EXAMPLES.md](./EXAMPLES.md)** | 実装者 | Sprint、TaskManager、Settings などの実装例 |
| **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** | 統合者 | ステップバイステップの統合ガイド、テスト方法 |
| **[INDEX.md](./INDEX.md)** | このファイル | 全体の概要、クイックスタート |

## 🚀 クイックスタート

### 1. インポート

```tsx
import { JsonSchemaDisplay, JsonImportExport, createValidator } from '@/00_devstudio/common'
```

### 2. バリデーター作成

```tsx
const validator = createValidator<MyType>({
  validate: (data, index) => {
    // バリデーション処理
    return null // エラーがない場合
  }
})
```

### 3. コンポーネント使用

```tsx
<JsonImportExport
  config={{
    schemaLabel: 'MY DATA',
    schemaExample: {...}
  }}
  validator={validator}
  onImport={(data) => { /* 処理 */ }}
  onExport={() => { /* データ取得 */ }}
/>
```

## 📂 ファイル構成

```
src/00_devstudio/common/
├── index.ts                   # メインエクスポート
├── types.ts                   # TypeScript 型定義
├── JsonSchemaDisplay.tsx      # スキーマ表示コンポーネント
├── JsonImportExport.tsx       # インポート/エクスポートコンポーネント
├── createValidator.ts         # バリデーター作成ヘルパー
├── README.md                  # API ドキュメント
├── EXAMPLES.md                # 実装例集
├── INTEGRATION_GUIDE.md       # 統合ガイド
└── INDEX.md                   # このファイル
```

## 🔧 主要機能

### `JsonSchemaDisplay`
JSON スキーマの例を見やすく表示

```tsx
<JsonSchemaDisplay
  label="MY SCHEMA"
  example={{ id: '1', name: 'Test' }}
  showCodeBlock={true}
/>
```

### `JsonImportExport`
JSON のインポート/エクスポートUI を提供

```tsx
<JsonImportExport
  config={{ schemaLabel: 'DATA', schemaExample: {} }}
  validator={myValidator}
  onImport={(data) => { /* 処理 */ }}
  onExport={() => { /* データ */ }}
/>
```

### `createValidator`
型安全なバリデーター関数を作成

```tsx
const validator = createValidator<MyData>({
  validate: (data, index) => {
    // バリデーション
    if (!data.id) return `[${index}]: id が必須です`
    return null
  }
})
```

## 💡 使用シーン

### Sprint アプリケーション
```tsx
import { JsonImportExport } from '@/00_devstudio/common'
import { sprintValidator } from '@/features/importExport/SprintSchemaValidator'

<JsonImportExport
  validator={sprintValidator}
  onImport={(data) => importSprints(data)}
  onExport={() => exportSprints()}
/>
```

### Task Manager
```tsx
import { JsonImportExport } from '@/00_devstudio/common'
import { taskValidator } from './TaskSchemaValidator'

<JsonImportExport
  config={{ schemaLabel: 'TASKS' }}
  validator={taskValidator}
  onImport={(data) => importTasks(data)}
/>
```

### Settings Manager
```tsx
import { JsonImportExport } from '@/00_devstudio/common'
import { settingsValidator } from './SettingsSchemaValidator'

<JsonImportExport
  config={{ schemaLabel: 'SETTINGS' }}
  validator={settingsValidator}
  onExport={() => JSON.stringify(settings)}
/>
```

## 🎓 学習パス

1. **基本を学ぶ** → [README.md](./README.md) を読む
2. **例を確認** → [EXAMPLES.md](./EXAMPLES.md) で実装例を確認
3. **統合する** → [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) に従って実装
4. **実装する** → 自分のアプリケーションに組み込む

## ✨ 特徴

### 💪 強力
- エラー箇所を正確に指摘
- 階層的なバリデーション対応
- JSON パースエラー検出

### 🎯 使いやすい
- シンプルな API
- TypeScript 完全対応
- ドキュメント完備

### 🔄 再利用可能
- 複数アプリで共有可能
- カスタマイズ容易
- テスト済み

### 📱 アクセシブル
- キーボード操作対応
- エラーメッセージ明確
- 国際化対応（日本語）

## 🔗 関連ファイル

### 既存の実装
- `src/features/importExport/SchemaViewer.tsx` - スキーマ表示（移行予定）
- `src/features/importExport/JsonImporter.tsx` - インポート/エクスポート（移行予定）
- `src/features/importExport/validator.ts` - バリデーター（再利用可能）

### 統合予定
- Sprint Import/Export → 共通コンポーネント化
- その他アプリケーション → 同じコンポーネント使用

## 📊 比較表

| 項目 | Before | After |
|-----|--------|-------|
| 再利用性 | ✗ | ✓ |
| コード量 | 多い | 少ない |
| 保守性 | 低い | 高い |
| テスト | 困難 | 容易 |
| 型安全 | 部分的 | 完全 |

## 🎯 次のステップ

### 今すぐできること
- [ ] [README.md](./README.md) を読む
- [ ] [EXAMPLES.md](./EXAMPLES.md) で例を確認
- [ ] 自分のアプリケーションで試す

### 統合時
- [ ] バリデーター実装
- [ ] UI 統合
- [ ] テスト作成
- [ ] デプロイ

### 今後
- [ ] 他のアプリで再利用
- [ ] バージョン管理
- [ ] パフォーマンス最適化

## 📞 サポート

問題が発生した場合：

1. **[README.md](./README.md)** を確認
2. **[EXAMPLES.md](./EXAMPLES.md)** で類似例を検索
3. **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** のトラブルシューティング確認
4. ソースコードを確認

## 📝 ライセンス

このコンポーネント集は、プロジェクト内で自由に使用できます。

## 🙏 謝辞

このコンポーネント集は、以下の目的で設計されました：

- コード の 再利用性向上
- 複数アプリケーション間での機能統一
- 保守性と拡張性の向上

---

**最終更新:** 2026-04-29

**バージョン:** 1.0.0

**ステータス:** ✅ リリース準備完了
