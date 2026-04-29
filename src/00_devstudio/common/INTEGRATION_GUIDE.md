# JSON Schema Common Components - 統合ガイド

このドキュメントは、JSON Schema Common Components を既存アプリケーションに統合するためのステップバイステップガイドです。

## 📋 統合チェックリスト

- [ ] 1. コンポーネントをインポート
- [ ] 2. バリデーターを実装
- [ ] 3. スキーマ例を定義
- [ ] 4. UI に統合
- [ ] 5. テスト
- [ ] 6. デプロイ

## ステップ 1: コンポーネントをインポート

### 基本的なインポート

```tsx
import {
  JsonSchemaDisplay,
  JsonImportExport,
  createValidator,
  type ValidationResult,
  type JsonSchemaConfig,
} from '@/00_devstudio/common'
```

### TypeScript での型定義

```tsx
import type { ValidationResult, JsonImportExportProps } from '@/00_devstudio/common'
```

## ステップ 2: バリデーターを実装

### 2-1. 型定義

```tsx
// types.ts
export interface MyData {
  id: string
  name: string
  // その他のプロパティ
}
```

### 2-2. バリデーター関数の作成

```tsx
// validators.ts
import { createValidator } from '@/00_devstudio/common'
import type { MyData } from './types'

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

export const myDataValidator = createValidator<MyData>({
  validate: (data, index) => {
    if (!data || typeof data !== 'object') {
      return `items[${index}]: オブジェクトではありません`
    }

    const item = data as Record<string, unknown>

    // id の検証
    if (!isString(item.id)) {
      return `items[${index}].id: 文字列が必要です`
    }

    // name の検証
    if (!isString(item.name)) {
      return `items[${index}].name: 文字列が必要です`
    }

    // すべての検証を通過
    return null
  },
  parseAsArray: true // 配列として解析
})
```

### 2-3. バリデーターのテスト

```tsx
// validators.test.ts
import { myDataValidator } from './validators'

describe('myDataValidator', () => {
  it('有効なデータを検証できる', () => {
    const result = myDataValidator('[{"id":"1","name":"Test"}]')
    expect(result.ok).toBe(true)
    expect(result.data).toEqual([{ id: '1', name: 'Test' }])
  })

  it('無効なデータのエラーメッセージを返す', () => {
    const result = myDataValidator('[{"id":123,"name":"Test"}]')
    expect(result.ok).toBe(false)
    expect(result.error).toContain('文字列が必要です')
  })

  it('JSON パースエラーを検出できる', () => {
    const result = myDataValidator('invalid json')
    expect(result.ok).toBe(false)
    expect(result.error).toContain('JSON のパースに失敗')
  })
})
```

## ステップ 3: スキーマ例を定義

```tsx
// schemaExamples.ts
export const MY_DATA_SCHEMA_EXAMPLE = {
  id: 'uuid-v4',
  name: 'Example Name',
  // その他のプロパティのサンプル値
}
```

## ステップ 4: UI に統合

### 4-1. 単純な統合

```tsx
// MyDataImportExport.tsx
import { JsonSchemaDisplay, JsonImportExport } from '@/00_devstudio/common'
import { myDataValidator } from './validators'
import { MY_DATA_SCHEMA_EXAMPLE } from './schemaExamples'
import { useMyDataStore } from '@/store/myDataStore'

export function MyDataImportExport() {
  const importData = useMyDataStore((s) => s.importData)
  const exportData = useMyDataStore((s) => s.exportData)

  const handleImport = (data: unknown) => {
    if (Array.isArray(data)) {
      importData(data as MyData[])
    }
  }

  const handleExport = () => {
    return JSON.stringify(exportData(), null, 2)
  }

  return (
    <>
      <JsonSchemaDisplay
        label="MY DATA JSON SCHEMA"
        example={MY_DATA_SCHEMA_EXAMPLE}
      />
      <JsonImportExport
        config={{
          schemaLabel: 'MY DATA JSON',
          schemaExample: MY_DATA_SCHEMA_EXAMPLE,
          importButtonLabel: 'データをインポート',
          exportButtonLabel: 'データをエクスポート',
        }}
        validator={myDataValidator}
        onImport={handleImport}
        onExport={handleExport}
      />
    </>
  )
}
```

### 4-2. ローディング状態付きの統合

```tsx
// MyDataImportExportWithLoading.tsx
import { useState } from 'react'
import { JsonImportExport } from '@/00_devstudio/common'
import { myDataValidator } from './validators'

export function MyDataImportExportWithLoading() {
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async (data: unknown) => {
    setIsLoading(true)
    try {
      // 非同期処理
      await saveData(data)
    } catch (error) {
      console.error('Import failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <JsonImportExport
      config={{...}}
      validator={myDataValidator}
      onImport={handleImport}
      isLoading={isLoading}
    />
  )
}
```

### 4-3. エラーハンドリング付きの統合

```tsx
// MyDataImportExportWithErrorHandling.tsx
import { useState } from 'react'
import { JsonImportExport } from '@/00_devstudio/common'

export function MyDataImportExportWithErrorHandling() {
  const [customError, setCustomError] = useState<string | null>(null)

  const handleImport = async (data: unknown) => {
    try {
      setCustomError(null)

      // 追加のバリデーション
      if (!Array.isArray(data)) {
        setCustomError('データは配列である必要があります')
        return
      }

      // ビジネスロジックの検証
      for (const item of data) {
        if (item.name.length > 100) {
          setCustomError('名前は100文字以内である必要があります')
          return
        }
      }

      // インポート実行
      await importData(data)
    } catch (error) {
      setCustomError(error instanceof Error ? error.message : '不明なエラー')
    }
  }

  return (
    <div>
      <JsonImportExport {...props} onImport={handleImport} />
      {customError && (
        <div style={{ color: 'red', marginTop: '10px' }}>⚠️ {customError}</div>
      )}
    </div>
  )
}
```

## ステップ 5: テスト

### 5-1. コンポーネントのテスト

```tsx
// MyDataImportExport.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyDataImportExport } from './MyDataImportExport'

describe('MyDataImportExport', () => {
  it('スキーマ表示をレンダリングする', () => {
    render(<MyDataImportExport />)
    expect(screen.getByText('MY DATA JSON SCHEMA')).toBeInTheDocument()
  })

  it('インポートフォームをレンダリングする', () => {
    render(<MyDataImportExport />)
    expect(screen.getByPlaceholderText(/[\n  { .* }\n]/)).toBeInTheDocument()
  })

  it('エクスポートボタンをレンダリングする', () => {
    render(<MyDataImportExport />)
    expect(screen.getByText('データをエクスポート')).toBeInTheDocument()
  })

  it('有効な JSON をインポートできる', async () => {
    const user = userEvent.setup()
    const { getByText, getByPlaceholderText } = render(<MyDataImportExport />)

    const textarea = getByPlaceholderText(/[\n  { .* }\n]/)
    const validJson = '[{"id":"1","name":"Test"}]'

    await user.type(textarea, validJson)
    await user.click(getByText('データをインポート'))

    expect(await screen.findByText('✓ インポート成功しました')).toBeInTheDocument()
  })

  it('無効な JSON はエラーを表示する', async () => {
    const user = userEvent.setup()
    const { getByText, getByPlaceholderText } = render(<MyDataImportExport />)

    const textarea = getByPlaceholderText(/[\n  { .* }\n]/)
    const invalidJson = 'invalid json'

    await user.type(textarea, invalidJson)
    await user.click(getByText('データをインポート'))

    expect(
      await screen.findByText(/JSON のパースに失敗しました/),
    ).toBeInTheDocument()
  })
})
```

### 5-2. バリデーターのテスト

```tsx
// validators.test.ts
import { myDataValidator } from './validators'

describe('myDataValidator', () => {
  it('有効なデータ配列を検証できる', () => {
    const result = myDataValidator('[{"id":"1","name":"Name"}]')
    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(1)
  })

  it('複数アイテムの配列を検証できる', () => {
    const json = JSON.stringify([
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ])
    const result = myDataValidator(json)
    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(2)
  })

  it('単一オブジェクトを配列として処理する', () => {
    const result = myDataValidator('{"id":"1","name":"Item"}')
    expect(result.ok).toBe(true)
    expect(result.data).toHaveLength(1)
  })

  it('必須フィールドの欠落を検出できる', () => {
    const result = myDataValidator('[{"id":"1"}]')
    expect(result.ok).toBe(false)
    expect(result.error).toContain('name')
  })

  it('不正な型を検出できる', () => {
    const result = myDataValidator('[{"id":123,"name":"Item"}]')
    expect(result.ok).toBe(false)
    expect(result.error).toContain('文字列が必要です')
  })

  it('JSON パースエラーを処理できる', () => {
    const result = myDataValidator('{ broken json')
    expect(result.ok).toBe(false)
    expect(result.error).toContain('JSON のパースに失敗しました')
  })
})
```

## ステップ 6: デプロイ

### 6-1. 互換性確認

- [ ] TypeScript 型定義が正しいか
- [ ] インポートパスが正しいか
- [ ] バリデーターが期待通りに動作するか
- [ ] UI が期待通りに表示されるか

### 6-2. パフォーマンス確認

```tsx
// 大量データの処理テスト
const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
  id: `item-${i}`,
  name: `Item ${i}`,
}))

const result = myDataValidator(JSON.stringify(largeDataset))
console.time('validation')
console.timeEnd('validation')
```

### 6-3. ブラウザ互換性

- Chrome/Edge 最新版 ✓
- Firefox 最新版 ✓
- Safari 最新版 ✓

## よくある質問

### Q1: バリデーターを複数のコンポーネントで共有したい

**A:** バリデーターを別ファイルで定義して共有します。

```tsx
// validators.ts
export const myDataValidator = createValidator({...})

// Component1.tsx
import { myDataValidator } from './validators'

// Component2.tsx
import { myDataValidator } from './validators'
```

### Q2: 既存の `validator.ts` と共存させたい

**A:** 両方を使用できます。移行は段階的に行えます。

```tsx
// 既存コード
import { validateSprintJson } from './features/importExport/validator'

// 新しいコード
import { sprintValidator } from '@/00_devstudio/common'
```

### Q3: カスタムスタイリングをしたい

**A:** コンポーネントをラップして、カスタムスタイルを適用します。

```tsx
export function StyledImportExport() {
  return (
    <div className="custom-wrapper">
      <JsonImportExport {...props} />
    </div>
  )
}
```

### Q4: エクスポートデータをカスタマイズしたい

**A:** `onExport` コールバックでカスタマイズできます。

```tsx
const handleExport = async () => {
  const data = await fetchCurrentData()
  const customData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    data: data,
  }
  return JSON.stringify(customData, null, 2)
}
```

### Q5: バリデーションエラーメッセージをカスタマイズしたい

**A:** バリデーター内でカスタムメッセージを定義します。

```tsx
export const myDataValidator = createValidator<MyData>({
  validate: (data, index) => {
    // ...
    if (!isString(item.name)) {
      return `${index}行目: 名前は必須項目です。テキストを入力してください。`
    }
    // ...
  }
})
```

## トラブルシューティング

### 問題: インポートボタンが無効

**原因:** textarea が空の場合、ボタンが無効になります。

**解決策:** JSON を textarea に入力してください。

### 問題: バリデーションエラー

**原因:** JSON の形式が不正、または必須フィールドが不足しています。

**解決策:** エラーメッセージを確認し、JSON 形式を修正してください。

### 問題: エクスポートが動作しない

**原因:** `onExport` が指定されていない、または実装にエラーがある。

**解決策:** `onExport` コールバックを確認してください。

```tsx
<JsonImportExport
  {...props}
  onExport={() => {
    console.log('Export called')
    return JSON.stringify(data, null, 2)
  }}
/>
```

## 参考リンク

- [README.md](./README.md) - API ドキュメント
- [EXAMPLES.md](./EXAMPLES.md) - 実装例
- [types.ts](./types.ts) - 型定義

---

**最終更新:** 2026-04-29
