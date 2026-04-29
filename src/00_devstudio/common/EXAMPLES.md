# JSON Schema Common Components - 実装例

## Sprint アプリケーションでの統合例

### 既存コードから共通コンポーネントへの移行

#### Before: 既存の実装

**SchemaViewer.tsx**
```tsx
import { CodeBlock } from '../../components/stepper/CodeBlock'

const SCHEMA_EXAMPLE = JSON.stringify({...}, null, 2)

export function SchemaViewer() {
  return (
    <div style={{...}}>
      <div>SPRINT JSON SCHEMA</div>
      <div>
        <pre>{SCHEMA_EXAMPLE}</pre>
      </div>
      <CodeBlock command={SCHEMA_EXAMPLE.replace(/\n/g, ' ')} />
    </div>
  )
}
```

**JsonImporter.tsx**
```tsx
import { useState } from 'react'
import { validateSprintJson } from './validator'
import { useSprintStore } from '../../store/sprintStore'

export function JsonImporter() {
  const importSprints = useSprintStore((s) => s.importSprints)
  const exportSprints = useSprintStore((s) => s.exportSprints)
  const [raw, setRaw] = useState('')
  const [error, setError] = useState<string | null>(null)
  // ... バリデーション、インポート、エクスポート処理
}
```

#### After: 共通コンポーネントを使用

**SprintSchemaValidator.ts** (新規)
```tsx
import { createValidator } from '../common'
import type { Sprint } from '../../types/sprint'

// Sprint 固有のバリデーションロジック
function isString(v: unknown): v is string {
  return typeof v === 'string'
}

function validateStep(s: unknown, path: string): string | null {
  if (!s || typeof s !== 'object') return `${path}: オブジェクトではありません`
  const step = s as Record<string, unknown>
  if (!isString(step.id)) return `${path}.id: 文字列が必要です`
  if (!isString(step.label)) return `${path}.label: 文字列が必要です`
  if (typeof step.checked !== 'boolean') return `${path}.checked: boolean が必要です`
  if (step.type !== 'text' && step.type !== 'code') return `${path}.type: "text" または "code" が必要です`
  if (step.type === 'code' && step.command !== undefined && !isString(step.command))
    return `${path}.command: 文字列が必要です`
  return null
}

function validateTask(t: unknown, path: string): string | null {
  if (!t || typeof t !== 'object') return `${path}: オブジェクトではありません`
  const task = t as Record<string, unknown>
  if (!isString(task.id)) return `${path}.id: 文字列が必要です`
  if (!isString(task.title)) return `${path}.title: 文字列が必要です`
  if (!['TODO', 'DOING', 'DONE'].includes(task.status as string))
    return `${path}.status: "TODO" / "DOING" / "DONE" のいずれかが必要です`
  if (typeof task.estimate !== 'number') return `${path}.estimate: 数値が必要です`
  if (typeof task.result !== 'number') return `${path}.result: 数値が必要です`
  if (!Array.isArray(task.steps)) return `${path}.steps: 配列が必要です`
  for (let i = 0; i < (task.steps as unknown[]).length; i++) {
    const err = validateStep((task.steps as unknown[])[i], `${path}.steps[${i}]`)
    if (err) return err
  }
  return null
}

function validateSprint(s: unknown, index: number): string | null {
  if (!s || typeof s !== 'object') return `sprints[${index}]: オブジェクトではありません`
  const sprint = s as Record<string, unknown>
  if (!isString(sprint.sprintId)) return `sprints[${index}].sprintId: 文字列が必要です`
  if (!isString(sprint.title)) return `sprints[${index}].title: 文字列が必要です`
  if (typeof sprint.duration !== 'number') return `sprints[${index}].duration: 数値が必要です`
  if (!['READY', 'ACTIVE', 'DONE'].includes(sprint.status as string))
    return `sprints[${index}].status: "READY" / "ACTIVE" / "DONE" のいずれかが必要です`
  if (!Array.isArray(sprint.tasks)) return `sprints[${index}].tasks: 配列が必要です`
  for (let i = 0; i < (sprint.tasks as unknown[]).length; i++) {
    const err = validateTask((sprint.tasks as unknown[])[i], `sprints[${index}].tasks[${i}]`)
    if (err) return err
  }
  return null
}

export const sprintValidator = createValidator<Sprint>({
  validate: validateSprint,
  parseAsArray: true
})
```

**SprintImportExport.tsx** (リファクタ後)
```tsx
import { JsonSchemaDisplay, JsonImportExport } from '../common'
import { sprintValidator } from './SprintSchemaValidator'
import { useSprintStore } from '../../store/sprintStore'
import type { Sprint } from '../../types/sprint'

const SPRINT_SCHEMA_EXAMPLE = {
  sprintId: 'uuid-v4',
  title: 'SPRINT_001 · タイトル',
  duration: 100,
  startedAt: null,
  completedAt: null,
  status: 'READY',
  tasks: [
    {
      id: 'uuid-v4',
      title: 'タスク名',
      status: 'TODO',
      estimate: 30,
      result: 0,
      steps: [
        { id: 'uuid-v4', label: 'ステップ名', checked: false, type: 'text' },
        { id: 'uuid-v4', label: 'コマンド', checked: false, type: 'code', command: 'npm run dev' },
      ],
    },
  ],
}

export function SprintImportExport() {
  const importSprints = useSprintStore((s) => s.importSprints)
  const exportSprints = useSprintStore((s) => s.exportSprints)

  const handleImport = (data: unknown) => {
    if (Array.isArray(data)) {
      importSprints(data as Sprint[])
    }
  }

  const handleExport = () => {
    return exportSprints()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <JsonSchemaDisplay label="SPRINT JSON SCHEMA" example={SPRINT_SCHEMA_EXAMPLE} />
      <JsonImportExport
        config={{
          schemaLabel: 'SPRINT JSON',
          schemaExample: SPRINT_SCHEMA_EXAMPLE,
          importButtonLabel: 'バリデーション → インポート',
          exportButtonLabel: 'JSON Export',
        }}
        validator={sprintValidator}
        onImport={handleImport}
        onExport={handleExport}
      />
    </div>
  )
}
```

## 別のアプリケーション例

### Task Manager アプリケーション

```tsx
// TaskSchemaValidator.ts
import { createValidator } from '@/00_devstudio/common'

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
}

export const taskValidator = createValidator<Task>({
  validate: (data, index) => {
    if (!data || typeof data !== 'object') {
      return `tasks[${index}]: オブジェクトではありません`
    }

    const task = data as Record<string, unknown>

    if (typeof task.id !== 'string') {
      return `tasks[${index}].id: 文字列が必要です`
    }

    if (typeof task.title !== 'string') {
      return `tasks[${index}].title: 文字列が必要です`
    }

    if (typeof task.description !== 'string') {
      return `tasks[${index}].description: 文字列が必要です`
    }

    if (typeof task.dueDate !== 'string') {
      return `tasks[${index}].dueDate: 文字列が必要です`
    }

    if (typeof task.completed !== 'boolean') {
      return `tasks[${index}].completed: boolean が必要です`
    }

    return null
  }
})
```

```tsx
// TaskImportExport.tsx
import { JsonSchemaDisplay, JsonImportExport } from '@/00_devstudio/common'
import { taskValidator } from './TaskSchemaValidator'
import { useTaskStore } from '@/store/taskStore'

const TASK_SCHEMA_EXAMPLE = {
  id: 'uuid-v4',
  title: 'サンプルタスク',
  description: 'これはサンプルタスクです',
  dueDate: '2026-12-31',
  completed: false,
}

export function TaskImportExport() {
  const importTasks = useTaskStore((s) => s.importTasks)
  const exportTasks = useTaskStore((s) => s.exportTasks)

  return (
    <>
      <JsonSchemaDisplay
        label="TASK JSON SCHEMA"
        example={TASK_SCHEMA_EXAMPLE}
      />
      <JsonImportExport
        config={{
          schemaLabel: 'TASK JSON',
          schemaExample: TASK_SCHEMA_EXAMPLE,
          importPlaceholder: '[\n  { "id": "...", "title": "...", ... }\n]',
          importButtonLabel: 'タスクをインポート',
          exportButtonLabel: 'タスクをエクスポート',
        }}
        validator={taskValidator}
        onImport={(data) => {
          if (Array.isArray(data)) {
            importTasks(data as Task[])
          }
        }}
        onExport={() => {
          return JSON.stringify(exportTasks(), null, 2)
        }}
      />
    </>
  )
}
```

### Settings Manager アプリケーション

```tsx
// SettingsSchemaValidator.ts
import { createValidator } from '@/00_devstudio/common'

interface Settings {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
  autoSave: boolean
}

export const settingsValidator = createValidator<Settings>({
  validate: (data) => {
    if (!data || typeof data !== 'object') {
      return 'Settings: オブジェクトではありません'
    }

    const settings = data as Record<string, unknown>

    if (settings.theme !== 'light' && settings.theme !== 'dark') {
      return 'Settings.theme: "light" または "dark" が必要です'
    }

    if (typeof settings.language !== 'string') {
      return 'Settings.language: 文字列が必要です'
    }

    if (typeof settings.notifications !== 'boolean') {
      return 'Settings.notifications: boolean が必要です'
    }

    if (typeof settings.autoSave !== 'boolean') {
      return 'Settings.autoSave: boolean が必要です'
    }

    return null
  },
  parseAsArray: false // 単一オブジェクトとして解析
})
```

```tsx
// SettingsImportExport.tsx
import { JsonSchemaDisplay, JsonImportExport } from '@/00_devstudio/common'
import { settingsValidator } from './SettingsSchemaValidator'
import { useSettingsStore } from '@/store/settingsStore'

const SETTINGS_SCHEMA_EXAMPLE = {
  theme: 'dark',
  language: 'ja',
  notifications: true,
  autoSave: true,
}

export function SettingsImportExport() {
  const importSettings = useSettingsStore((s) => s.importSettings)
  const exportSettings = useSettingsStore((s) => s.exportSettings)

  return (
    <>
      <JsonSchemaDisplay
        label="SETTINGS JSON SCHEMA"
        example={SETTINGS_SCHEMA_EXAMPLE}
        showCodeBlock={false}
      />
      <JsonImportExport
        config={{
          schemaLabel: 'SETTINGS JSON',
          schemaExample: SETTINGS_SCHEMA_EXAMPLE,
          importButtonLabel: '設定をインポート',
          exportButtonLabel: '設定をエクスポート',
        }}
        validator={settingsValidator}
        onImport={(data) => {
          importSettings(data as Settings)
        }}
        onExport={() => {
          return JSON.stringify(exportSettings(), null, 2)
        }}
      />
    </>
  )
}
```

## パターン: 非同期バリデーション

外部 API でのバリデーションが必要な場合：

```tsx
export function MyAsyncComponent() {
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async (data: unknown) => {
    setIsLoading(true)
    try {
      // サーバーで追加バリデーション
      const response = await fetch('/api/validate', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('サーバーバリデーションに失敗しました')
      }

      // データをインポート
      await importData(data)
    } catch (error) {
      console.error(error)
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

## パターン: カスタムスタイル

スタイルカスタマイズが必要な場合は、コンポーネントをラップ：

```tsx
export function CustomStyledImportExport() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <JsonImportExport
        config={...}
        validator={...}
        onImport={...}
        onExport={...}
      />
    </div>
  )
}
```

---

**最終更新:** 2026-04-29
