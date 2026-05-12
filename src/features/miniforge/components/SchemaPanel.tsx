import { useState } from 'react'
import { Copy, Check, Plus } from 'lucide-react'
import { useClipboard } from '../../../hooks/useClipboard'
import { Toast } from '../../../components/ui/Toast'
import type { SchemaEntry } from '../types'

interface Props {
  schemas: SchemaEntry[]
  onAdd: () => void
}

export function SchemaPanel({ schemas, onAdd }: Props) {
  const latestId = schemas.find((s) => s.isLatest)?.id ?? schemas[0]?.id
  const [selectedId, setSelectedId] = useState<string>(latestId ?? '')
  const { copy, copied } = useClipboard()

  const selected = schemas.find((s) => s.id === selectedId) ?? schemas[0]

  if (schemas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--color-text-lo)' }}>
        <div style={{ marginBottom: '16px', fontSize: '13px' }}>スキーマがありません</div>
        <button
          onClick={onAdd}
          style={{
            backgroundColor: 'var(--color-accent-dim)',
            color: 'var(--color-accent)',
            border: '1px solid var(--color-accent)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          + 追加
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* セレクター */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {schemas.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedId(s.id)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${selectedId === s.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
              background: selectedId === s.id ? 'var(--color-accent-dim)' : 'none',
              color: selectedId === s.id ? 'var(--color-accent)' : 'var(--color-text-mid)',
              cursor: 'pointer',
            }}
          >
            {s.name} v{s.version}
            {s.isLatest && (
              <span style={{ marginLeft: '4px', color: 'var(--color-done)' }}>★</span>
            )}
          </button>
        ))}
        <button
          onClick={onAdd}
          style={{
            background: 'none',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-lo)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Plus size={12} /> 追加
        </button>
      </div>

      {/* コードブロック */}
      {selected && (
        <div
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-primary)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--color-text-lo)',
                letterSpacing: '0.1em',
              }}
            >
              {selected.name} v{selected.version}
              {selected.isLatest ? ' · ★ LATEST' : ''}
            </span>
            <button
              onClick={() => copy(selected.code)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: copied ? 'var(--color-done)' : 'var(--color-text-mid)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                padding: '2px 4px',
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-text-mid)',
              overflowX: 'auto',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              maxHeight: '420px',
              overflowY: 'auto',
            }}
          >
            {selected.code}
          </pre>
        </div>
      )}

      <Toast message="コピーしました ✓" visible={copied} onHide={() => {}} />
    </div>
  )
}
