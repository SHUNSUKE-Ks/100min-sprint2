import { Copy, Check } from 'lucide-react'
import { useClipboard } from '../../hooks/useClipboard'
import { Toast } from '../ui/Toast'

interface Props {
  command: string
}

export function CodeBlock({ command }: Props) {
  const { copy, copied } = useClipboard()

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: '#ffb868',
            letterSpacing: '0.03em',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          $ {command}
        </span>
        <button
          onClick={() => copy(command)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: copied ? 'var(--color-done)' : 'var(--color-text-mid)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            flexShrink: 0,
            transition: 'color 0.15s ease',
          }}
          aria-label="コマンドをコピー"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <Toast message="コピーしました ✓" visible={copied} onHide={() => {}} />
    </>
  )
}
