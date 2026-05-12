import { useState } from 'react'
import { BottomSheet } from '../../../components/ui/BottomSheet'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (entry: { name: string; version: string; code: string; isLatest: boolean }) => void
}

export function SchemaAddModal({ open, onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [version, setVersion] = useState('')
  const [code, setCode] = useState('')
  const [isLatest, setIsLatest] = useState(false)

  const canSave = name.trim() && version.trim() && code.trim()

  const handleSave = () => {
    if (!canSave) return
    onSave({ name: name.trim(), version: version.trim(), code: code.trim(), isLatest })
    setName('')
    setVersion('')
    setCode('')
    setIsLatest(false)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="スキーマ追加">
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Field label="名前">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: NovelSheet"
            style={inputStyle}
          />
        </Field>

        <Field label="バージョン">
          <input
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="例: 1.0"
            style={inputStyle}
          />
        </Field>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--color-text-mid)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={isLatest}
            onChange={(e) => setIsLatest(e.target.checked)}
          />
          Latest（最新）としてマーク
        </label>

        <Field label="スキーマコード">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='{"key": "value"}'
            style={{ ...inputStyle, minHeight: '180px', resize: 'vertical' }}
          />
        </Field>

        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            backgroundColor: 'var(--color-accent)',
            color: '#000',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: canSave ? 'pointer' : 'default',
            opacity: canSave ? 1 : 0.4,
          }}
        >
          保存
        </button>
      </div>
    </BottomSheet>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--color-bg-primary)',
  color: 'var(--color-text-hi)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  fontSize: '13px',
  fontFamily: 'var(--font-mono)',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: '11px',
          color: 'var(--color-text-lo)',
          marginBottom: '6px',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}
