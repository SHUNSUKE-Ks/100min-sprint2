# JSON Schema Common Components

JSON スキーマの表示、バリデーション、インポート/エクスポート機能を提供する汎用コンポーネント集です。様々なアプリケーションで再利用できます。

## 📦 コンポーネント

### `JsonSchemaDisplay`
JSON スキーマの例を表示するコンポーネント。

```tsx
import { JsonSchemaDisplay } from '@/00_devstudio/common'

export function MyComponent() {
  const example = {
    id: '123',
    name: 'Example',
    items: []
  }

  return (
    <JsonSchemaDisplay
      label="MY JSON SCHEMA"
      example={example}
      showCodeBlock={true}
    />
  )
}
```

**Props:**
- `label: string` - スキーマの表示ラベル
- `example: unknown` - JSON スキーマの例
- `showCodeBlock?: boolean` - コードブロック表示の有無 (デフォルト: true)

### `JsonImportExport`
JSON のインポート/エクスポート機能を提供するコンポーネント。

```tsx
import { JsonImportExport, createValidator } from '@/00_devstudio/common'

const validator = createValidator<MyData>({
  validate: (data, index) => {
    if (!data || typeof data !== 'object') {
      return `items[${index}]: オブジェクトではありません`
    }
    // カスタムバリデーション
    return null
  }
})

export function MyComponent() {
  const handleImport = (data: unknown) => {
    console.log('インポートされたデータ:', data)
    // データを処理
  }

  const handleExport = async () => {
    const data = await fetchCurrentData()
    return JSON.stringify(data, null, 2)
  }

  return (
    <JsonImportExport
      config={{
        schemaLabel: 'MY DATA',
        schemaExample: {},
        importPlaceholder: '[\n  { ... }\n]',
        importButtonLabel: 'インポート',
        exportButtonLabel: 'エクスポート'
      }}
      validator={validator}
      onImport={handleImport}
      onExport={handleExport}
      isLoading={false}
    />
  )
}
```

**Props:**
- `config: JsonSchemaConfig` - 設定オブジェクト
  - `schemaLabel: string` - スキーマラベル
  - `schemaExample: unknown` - JSON スキーマの例
  - `importPlaceholder?: string` - インポート入力のプレースホルダー
  - `importButtonLabel?: string` - インポートボタンのラベル
  - `exportButtonLabel?: string` - エクスポートボタンのラベル
- `validator: (raw: string) => ValidationResult` - バリデーション関数
- `onImport?: (data: unknown) => void | Promise<void>` - インポート完了時のコールバック
- `onExport?: () => string | Promise<string>` - エクスポートデータを取得する関数
- `isLoading?: boolean` - ローディング状態 (デフォルト: false)

## 🔧 ユーティリティ

### `createValidator`
汎用バリデーター作成ヘルパー。

```tsx
import { createValidator } from '@/00_devstudio/common'

interface MyData {
  id: string
  name: string
  age: number
}

const validator = createValidator<MyData>({
  validate: (data, index) => {
    if (!data || typeof data !== 'object') {
      return `items[${index}]: オブジェクトではありません`
    }

    const obj = data as Record<string, unknown>

    if (typeof obj.id !== 'string') {
      return `items[${index}].id: 文字列が必要です`
    }

    if (typeof obj.name !== 'string') {
      return `items[${index}].name: 文字列が必要です`
    }

    if (typeof obj.age !== 'number') {
      return `items[${index}].age: 数値が必要です`
    }

    return null
  },
  parseAsArray: true // 配列として解析（デフォルト: true）
})

const result = validator('[{ "id": "1", "name": "John", "age": 30 }]')
if (result.ok) {
  console.log('検証成功:', result.data)
} else {
  console.error('検証失敗:', result.error)
}
```

**引数:**
- `config: ValidatorConfig<T>`
  - `validate: (data: unknown, index?: number) => string | null` - バリデーション関数（エラーメッセージまたは null を返す）
  - `parseAsArray?: boolean` - JSON を配列として解析するか（デフォルト: true）

**戻り値:**
```tsx
interface ValidationResult<T> {
  ok: boolean
  error?: string
  data?: T[]
}
```

## 📋 型定義

### `ValidationResult<T>`
バリデーション結果の型。

```tsx
interface ValidationResult<T = unknown> {
  ok: boolean        // バリデーション成功フラグ
  error?: string     // エラーメッセージ
  data?: T           // 検証済みデータ
}
```

### `JsonSchemaConfig`
JSON スキーマ設定の型。

```tsx
interface JsonSchemaConfig {
  schemaLabel: string            // スキーマラベル
  schemaExample: unknown         // スキーマ例
  importPlaceholder?: string     // インポート入力プレースホルダー
  importButtonLabel?: string     // インポートボタンラベル
  exportButtonLabel?: string     // エクスポートボタンラベル
}
```

## 🎯 使用例

### Sprint アプリケーションでの実装

[SprintImportExport.tsx](../examples/SprintImportExport.tsx)

```tsx
import { JsonSchemaDisplay, JsonImportExport, createValidator } from '@/00_devstudio/common'
import type { Sprint } from '@/types/sprint'

const SPRINT_SCHEMA_EXAMPLE = {
  sprintId: 'uuid-v4',
  title: 'SPRINT_001',
  duration: 100,
  // ... その他のプロパティ
}

const sprintValidator = createValidator<Sprint>({
  validate: (data, index) => {
    // Sprint 固有のバリデーション
  }
})

export function SprintImportExport() {
  return (
    <>
      <JsonSchemaDisplay
        label="SPRINT JSON SCHEMA"
        example={SPRINT_SCHEMA_EXAMPLE}
      />
      <JsonImportExport
        config={{
          schemaLabel: 'SPRINT JSON',
          schemaExample: SPRINT_SCHEMA_EXAMPLE
        }}
        validator={sprintValidator}
        onImport={(data) => {
          // Sprint をインポート
        }}
        onExport={() => {
          // Sprint をエクスポート
        }}
      />
    </>
  )
}
```

## 🚀 ベストプラクティス

### 1. バリデーターの共有
複数のコンポーネントで同じバリデーターを使用する場合は、共通ファイルで定義します。

```tsx
// validators.ts
export const myDataValidator = createValidator<MyData>({...})

// Component1.tsx
import { myDataValidator } from './validators'
export function Component1() {
  return <JsonImportExport validator={myDataValidator} />
}

// Component2.tsx
import { myDataValidator } from './validators'
export function Component2() {
  return <JsonImportExport validator={myDataValidator} />
}
```

### 2. エラーハンドリング
エクスポート関数でのエラーハンドリング。

```tsx
const handleExport = async () => {
  try {
    const data = await fetchCurrentData()
    return JSON.stringify(data, null, 2)
  } catch (error) {
    console.error('エクスポート失敗:', error)
    throw error // エラーメッセージは自動的に表示されます
  }
}
```

### 3. ローディング状態の管理
非同期操作中のローディング状態。

```tsx
export function MyComponent() {
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async (data: unknown) => {
    setIsLoading(true)
    try {
      await saveData(data)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <JsonImportExport
      validator={validator}
      onImport={handleImport}
      isLoading={isLoading}
    />
  )
}
```

## 📁 ファイル構成

```
src/00_devstudio/common/
├── index.ts                    # エクスポート定義
├── types.ts                    # 型定義
├── JsonSchemaDisplay.tsx       # スキーマ表示コンポーネント
├── JsonImportExport.tsx        # インポート/エクスポートコンポーネント
├── createValidator.ts          # バリデーター作成ヘルパー
└── README.md                   # このファイル
```

## 🔄 他のアプリケーでの使用

このコンポーネント集は他のプロジェクトで再利用できます。

1. **ファイルをコピー** - `src/00_devstudio/common/` フォルダ全体をプロジェクトにコピー
2. **インポートパスを調整** - プロジェクト構造に合わせてインポートパスを修正
3. **型定義を拡張** - プロジェクト固有のバリデーション型を定義

```tsx
// プロジェクト固有の型を定義
interface MyProjectData {
  // ...
}

// バリデーターを作成
const myValidator = createValidator<MyProjectData>({...})

// コンポーネントで使用
<JsonImportExport validator={myValidator} />
```

---

**最終更新:** 2026-04-29
