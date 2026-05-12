import { ArrowLeft } from 'lucide-react'
import type { HtmlEntry } from '../types'

interface Props {
  entry: HtmlEntry
  onBack: () => void
}

export function HtmlPreview({ entry, onBack }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '10px',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '12px',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-mid)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
          }}
          aria-label="戻る"
        >
          <ArrowLeft size={18} />
        </button>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-text-mid)',
            letterSpacing: '0.08em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {entry.filename}
        </span>
      </div>

      <iframe
        srcDoc={entry.html}
        title={entry.filename}
        sandbox="allow-scripts allow-downloads"
        style={{
          flex: 1,
          width: '100%',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          minHeight: '520px',
          backgroundColor: '#111',
        }}
      />
    </div>
  )
}
