import { useState, useCallback } from 'react'
import { SheetTab } from '../features/miniforge/components/SheetTab'
import { ArchiveTab } from '../features/miniforge/components/ArchiveTab'
import { ConfigTab } from '../features/miniforge/components/ConfigTab'
import { HtmlRegisterModal } from '../features/miniforge/components/HtmlRegisterModal'
import { useHtmlRegistry } from '../features/miniforge/hooks/useHtmlRegistry'
import { useArchive } from '../features/miniforge/hooks/useArchive'
import { useDrafts } from '../features/miniforge/hooks/useDrafts'

type Tab = 'sheet' | 'archive' | 'config'

const TAB_LABELS: Record<Tab, string> = {
  sheet: 'Sheet',
  archive: 'Archive',
  config: 'Config',
}

export function MiniForgeView() {
  const [tab, setTab] = useState<Tab>('sheet')
  const [showHtmlRegister, setShowHtmlRegister] = useState(false)

  const { entries: htmlEntries, add: addHtml } = useHtmlRegistry()
  const { entries: archiveEntries, add: addToArchive, remove: removeArchive } = useArchive()
  const { drafts, save: saveDraft, toggleFavorite } = useDrafts()

  const handleExport = useCallback(
    (filename: string, data: unknown) => {
      addToArchive(filename, data)
    },
    [addToArchive]
  )

  const handleSave = useCallback(
    (data: unknown) => {
      saveDraft(data)
    },
    [saveDraft]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        /* モバイル縦画面対応 */
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {/* タブバー */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '16px',
          flexShrink: 0,
        }}
      >
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '12px 4px',
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
              position: 'relative',
            }}
          >
            {TAB_LABELS[t]}
            {/* アーカイブ件数バッジ */}
            {t === 'archive' && archiveEntries.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '50%',
                  transform: 'translateX(calc(50% + 18px))',
                  backgroundColor: 'var(--color-accent)',
                  color: '#000',
                  borderRadius: '9999px',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  lineHeight: 1.4,
                  minWidth: '16px',
                  textAlign: 'center',
                }}
              >
                {archiveEntries.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {tab === 'sheet' && (
          <SheetTab
            entries={htmlEntries}
            onRegister={() => setShowHtmlRegister(true)}
            onExport={handleExport}
            onSave={handleSave}
            drafts={drafts}
            onFavorite={toggleFavorite}
          />
        )}
        {tab === 'archive' && (
          <ArchiveTab entries={archiveEntries} onRemove={removeArchive} />
        )}
        {tab === 'config' && <ConfigTab />}
      </div>

      <HtmlRegisterModal
        open={showHtmlRegister}
        onClose={() => setShowHtmlRegister(false)}
        onSave={addHtml}
      />
    </div>
  )
}
