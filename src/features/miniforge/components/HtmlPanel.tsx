import { FileCode, Eye, Plus } from 'lucide-react'
import type { HtmlEntry } from '../types'

interface Props {
  entries: HtmlEntry[]
  onPreview: (id: string) => void
  onRegister: () => void
}

export function HtmlPanel({ entries, onPreview, onRegister }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onRegister}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-accent-dim)',
            color: 'var(--color-accent)',
            border: '1px solid var(--color-accent)',
            borderRadius: 'var(--radius-sm)',
            padding: '6px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.08em',
          }}
        >
          <Plus size={13} /> 登録
        </button>
      </div>

      {entries.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 16px',
            color: 'var(--color-text-lo)',
            fontSize: '13px',
          }}
        >
          HTMLファイルがありません
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <FileCode
                  size={16}
                  style={{ color: 'var(--color-text-lo)', flexShrink: 0 }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--color-text-hi)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {entry.filename}
                </span>
              </div>
              <button
                onClick={() => onPreview(entry.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                  marginLeft: '8px',
                  background: 'none',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-mid)',
                  cursor: 'pointer',
                  padding: '4px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                }}
              >
                <Eye size={12} /> Preview
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
