import { CodeBlock } from '../../components/stepper/CodeBlock'
import type { JsonSchemaDisplayProps } from './types'

export function JsonSchemaDisplay({ label, example, showCodeBlock = true }: JsonSchemaDisplayProps) {
  const jsonString = JSON.stringify(example, null, 2)

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
        {label}
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
          {jsonString}
        </pre>
      </div>
      {showCodeBlock && <CodeBlock command={jsonString.replace(/\n/g, ' ')} />}
    </div>
  )
}
