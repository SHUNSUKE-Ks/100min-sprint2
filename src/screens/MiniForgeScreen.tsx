import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { SchemaPanel } from '../features/miniforge/components/SchemaPanel'
import { SchemaAddModal } from '../features/miniforge/components/SchemaAddModal'
import { HtmlPanel } from '../features/miniforge/components/HtmlPanel'
import { HtmlRegisterModal } from '../features/miniforge/components/HtmlRegisterModal'
import { HtmlPreview } from '../features/miniforge/components/HtmlPreview'
import { useSchemaRegistry } from '../features/miniforge/hooks/useSchemaRegistry'
import { useHtmlRegistry } from '../features/miniforge/hooks/useHtmlRegistry'

type Tab = 'schemas' | 'html'

export function MiniForgeScreen() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('schemas')
  const [showSchemaAdd, setShowSchemaAdd] = useState(false)
  const [showHtmlRegister, setShowHtmlRegister] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)

  const { schemas, add: addSchema } = useSchemaRegistry()
  const { entries, add: addHtml } = useHtmlRegistry()

  const previewEntry = previewId ? entries.find((e) => e.id === previewId) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={previewEntry ? () => setPreviewId(null) : () => navigate(-1)}
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
            color: 'var(--color-accent)',
            letterSpacing: '0.15em',
          }}
        >
          MINIFORGE
        </span>
      </div>

      {/* プレビューモード */}
      {previewEntry ? (
        <HtmlPreview entry={previewEntry} onBack={() => setPreviewId(null)} />
      ) : (
        <>
          {/* タブ */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '20px',
            }}
          >
            {(['schemas', 'html'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${tab === t ? 'var(--color-accent)' : 'transparent'}`,
                  color: tab === t ? 'var(--color-accent)' : 'var(--color-text-lo)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                {t === 'schemas' ? 'SCHEMAS' : 'HTML FILES'}
              </button>
            ))}
          </div>

          {/* タブコンテンツ */}
          {tab === 'schemas' && (
            <SchemaPanel schemas={schemas} onAdd={() => setShowSchemaAdd(true)} />
          )}
          {tab === 'html' && (
            <HtmlPanel
              entries={entries}
              onPreview={setPreviewId}
              onRegister={() => setShowHtmlRegister(true)}
            />
          )}
        </>
      )}

      <SchemaAddModal
        open={showSchemaAdd}
        onClose={() => setShowSchemaAdd(false)}
        onSave={addSchema}
      />
      <HtmlRegisterModal
        open={showHtmlRegister}
        onClose={() => setShowHtmlRegister(false)}
        onSave={addHtml}
      />
    </div>
  )
}
