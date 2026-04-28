import { CodeBlock } from '../../components/stepper/CodeBlock'

const SCHEMA_EXAMPLE = JSON.stringify(
  {
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
  },
  null,
  2
)

export function SchemaViewer() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--color-text-lo)',
          letterSpacing: '0.1em',
        }}
      >
        SPRINT JSON SCHEMA
      </div>
      <div
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px',
          position: 'relative',
        }}
      >
        <pre
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-text-mid)',
            margin: 0,
            overflowX: 'auto',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {SCHEMA_EXAMPLE}
        </pre>
      </div>
      <CodeBlock command={SCHEMA_EXAMPLE.replace(/\n/g, ' ')} />
    </div>
  )
}
