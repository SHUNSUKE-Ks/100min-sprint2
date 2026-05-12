import { useState } from 'react'
import { SchemaPanel } from './SchemaPanel'
import { SchemaAddModal } from './SchemaAddModal'
import { HtmlPanel } from './HtmlPanel'
import { HtmlRegisterModal } from './HtmlRegisterModal'
import { DraftPanel } from './DraftPanel'
import { useSchemaRegistry } from '../hooks/useSchemaRegistry'
import { useHtmlRegistry } from '../hooks/useHtmlRegistry'
import { useDrafts } from '../hooks/useDrafts'

type ConfigSection = 'drafts' | 'schemas' | 'html'

const SECTION_LABELS: Record<ConfigSection, string> = {
  drafts: 'DRAFTS',
  schemas: 'SCHEMAS',
  html: 'HTML FILES',
}

export function ConfigTab() {
  const [section, setSection] = useState<ConfigSection>('drafts')
  const [showSchemaAdd, setShowSchemaAdd] = useState(false)
  const [showHtmlRegister, setShowHtmlRegister] = useState(false)

  const { schemas, add: addSchema } = useSchemaRegistry()
  const { entries, add: addHtml } = useHtmlRegistry()
  const { drafts, remove: removeDraft } = useDrafts()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* セクション切り替え */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none',
        }}
      >
        {(Object.keys(SECTION_LABELS) as ConfigSection[]).map((s) => (
          <button
            key={s}
            onClick={() => setSection(s)}
            style={{
              flexShrink: 0,
              padding: '5px 12px',
              background: 'none',
              border: `1px solid ${section === s ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-sm)',
              color: section === s ? 'var(--color-accent)' : 'var(--color-text-lo)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              backgroundColor: section === s ? 'var(--color-accent-dim)' : 'none',
              position: 'relative',
            }}
          >
            {SECTION_LABELS[s]}
            {s === 'drafts' && drafts.length > 0 && (
              <span
                style={{
                  marginLeft: '5px',
                  backgroundColor: 'var(--color-accent)',
                  color: '#000',
                  borderRadius: '9999px',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '0 4px',
                  lineHeight: '14px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              >
                {drafts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {section === 'drafts' && (
        <DraftPanel drafts={drafts} onRemove={removeDraft} />
      )}

      {section === 'schemas' && (
        <SchemaPanel schemas={schemas} onAdd={() => setShowSchemaAdd(true)} />
      )}

      {section === 'html' && (
        <HtmlPanel
          entries={entries}
          onPreview={() => {}}
          onRegister={() => setShowHtmlRegister(true)}
        />
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
