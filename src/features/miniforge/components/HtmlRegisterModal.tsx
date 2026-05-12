import { useState } from 'react'
import { BottomSheet } from '../../../components/ui/BottomSheet'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (entry: { filename: string; html: string }) => void
}

export function HtmlRegisterModal({ open, onClose, onSave }: Props) {
  const [filename, setFilename] = useState('')
  const [html, setHtml] = useState('')

  const canSave = filename.trim() && html.trim()

  const handleSave = () => {
    if (!canSave) return
    const name = filename.trim().endsWith('.html')
      ? filename.trim()
      : `${filename.trim()}.html`
    onSave({ filename: name, html: html.trim() })
    setFilename('')
    setHtml('')
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="HTML 登録">
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={labelStyle}>ファイル名</div>
          <input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="例: my_sheet.html"
            style={inputStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>HTML コード</div>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="<!DOCTYPE html>..."
            style={{ ...inputStyle, minHeight: '200px', resize: 'vertical' }}
          />
        </div>

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

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--color-text-lo)',
  marginBottom: '6px',
  fontFamily: 'var(--font-mono)',
  letterSpacing: '0.08em',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--color-bg-primary)',
  color: 'var(--color-text-mid)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '10px 12px',
  fontSize: '13px',
  fontFamily: 'var(--font-mono)',
}
