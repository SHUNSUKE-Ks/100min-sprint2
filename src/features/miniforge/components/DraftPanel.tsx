import { Trash2 } from 'lucide-react'
import type { DraftEntry } from '../hooks/useDrafts'

interface Props {
  drafts: DraftEntry[]
  onRemove: (id: string) => void
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function ProgressBar({ value }: { value: number }) {
  const color =
    value >= 80 ? 'var(--color-done)' : value >= 40 ? 'var(--color-accent)' : 'var(--color-warning)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          flex: 1,
          height: '4px',
          backgroundColor: 'var(--color-border)',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${value}%`,
            backgroundColor: color,
            borderRadius: '9999px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: color,
          fontWeight: 700,
          width: '32px',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {value}%
      </span>
    </div>
  )
}

export function DraftPanel({ drafts, onRemove }: Props) {
  if (drafts.length === 0) {
    return (
      <div
        style={{
          padding: '32px 0',
          textAlign: 'center',
          color: 'var(--color-text-lo)',
          fontSize: '13px',
        }}
      >
        保存済みドラフトがありません
        <div
          style={{ fontSize: '11px', marginTop: '6px', color: 'var(--color-text-lo)' }}
        >
          シートの [保存] ボタンで保存できます
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      {/* カウンター */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--color-text-lo)',
          letterSpacing: '0.1em',
          padding: '0 2px 8px',
        }}
      >
        DRAFTS · {drafts.length} / 10
      </div>

      {drafts.map((draft) => (
        <div
          key={draft.id}
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* ヘッダー行 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'var(--color-text-hi)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '3px',
                }}
              >
                📜 {draft.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--color-accent)',
                    backgroundColor: 'var(--color-accent-dim)',
                    border: '1px solid var(--color-accent)',
                    borderRadius: '4px',
                    padding: '1px 5px',
                    letterSpacing: '0.06em',
                  }}
                >
                  v{draft.schemaVersion}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--color-text-lo)',
                  }}
                >
                  {formatDate(draft.updatedAt)}
                </span>
              </div>
            </div>
            <button
              onClick={() => onRemove(draft.id)}
              style={{
                flexShrink: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-lo)',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
              }}
              aria-label="削除"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* プログレスバー */}
          <ProgressBar value={draft.progress} />
        </div>
      ))}
    </div>
  )
}
