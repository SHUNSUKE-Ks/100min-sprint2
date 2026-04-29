import { useState } from 'react'
import type { JsonImportExportProps } from './types'

export function JsonImportExport({
  config,
  validator,
  onImport,
  onExport,
  isLoading = false,
}: JsonImportExportProps) {
  const [raw, setRaw] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [exported, setExported] = useState('')

  const handleImport = () => {
    setError(null)
    setSuccess(false)
    const result = validator(raw)
    if (!result.ok) {
      setError(result.error ?? '不明なエラー')
      return
    }
    onImport?.(result.data)
    setSuccess(true)
    setRaw('')
  }

  const handleExport = async () => {
    try {
      const json = onExport ? await onExport() : ''
      setExported(json)
      navigator.clipboard.writeText(json).catch(() => {})
    } catch (err) {
      setError('エクスポートに失敗しました')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Import */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-lo)',
            letterSpacing: '0.1em',
          }}
        >
          IMPORT — {config.schemaLabel} を貼り付け
        </div>
        <textarea
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value)
            setError(null)
            setSuccess(false)
          }}
          placeholder={config.importPlaceholder ?? '[\n  { ... }\n]'}
          rows={8}
          disabled={isLoading}
          style={{
            width: '100%',
            backgroundColor: 'var(--color-bg-primary)',
            border: `1px solid ${error ? 'var(--color-warning)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-hi)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            padding: '10px',
            resize: 'vertical',
            outline: 'none',
            boxSizing: 'border-box',
            lineHeight: 1.5,
            opacity: isLoading ? 0.5 : 1,
            cursor: isLoading ? 'not-allowed' : 'auto',
          }}
        />
        {error && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-warning)',
              backgroundColor: 'rgba(255,107,53,0.08)',
              border: '1px solid rgba(255,107,53,0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 10px',
            }}
          >
            ✕ {error}
          </div>
        )}
        {success && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-done)',
              backgroundColor: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 10px',
            }}
          >
            ✓ インポート成功しました
          </div>
        )}
        <button
          onClick={handleImport}
          disabled={!raw.trim() || isLoading}
          style={{
            padding: '10px',
            backgroundColor:
              raw.trim() && !isLoading ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
            color: raw.trim() && !isLoading ? 'var(--color-bg-primary)' : 'var(--color-text-lo)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: raw.trim() && !isLoading ? 'pointer' : 'default',
            opacity: isLoading ? 0.5 : 1,
          }}
        >
          {config.importButtonLabel ?? 'バリデーション → インポート'}
        </button>
      </section>

      {/* Export */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-lo)',
            letterSpacing: '0.1em',
          }}
        >
          EXPORT — 現在のデータを出力
        </div>
        <button
          onClick={handleExport}
          disabled={isLoading || !onExport}
          style={{
            padding: '10px',
            backgroundColor: 'transparent',
            color: onExport ? 'var(--color-accent)' : 'var(--color-text-lo)',
            border: `1px solid ${onExport ? 'var(--color-border)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            cursor: onExport && !isLoading ? 'pointer' : 'not-allowed',
            opacity: onExport ? 1 : 0.5,
          }}
        >
          {config.exportButtonLabel ?? 'JSON Export'}
        </button>
        {exported && (
          <pre
            style={{
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-text-mid)',
              margin: 0,
              maxHeight: '160px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {exported}
          </pre>
        )}
      </section>
    </div>
  )
}
