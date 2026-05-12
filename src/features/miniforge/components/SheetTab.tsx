import { useEffect, useRef, useState } from 'react'
import { Plus, FolderOpen } from 'lucide-react'
import { SaveSlotPanel } from './SaveSlotPanel'
import type { HtmlEntry } from '../types'
import type { DraftEntry } from '../hooks/useDrafts'

interface Props {
  entries: HtmlEntry[]
  onRegister: () => void
  onExport: (filename: string, data: unknown) => void
  onSave: (data: unknown) => void
  drafts: DraftEntry[]
  onFavorite: (id: string) => void
}

export function SheetTab({ entries, onRegister, onExport, onSave, drafts, onFavorite }: Props) {
  const [selectedId, setSelectedId] = useState<string>(entries[0]?.id ?? '')
  const [showSlots, setShowSlots] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const selected = entries.find((e) => e.id === selectedId) ?? entries[0]

  // postMessage でエクスポート・保存データを受け取る
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'mf-export') {
        onExport(e.data.filename as string, e.data.data)
      } else if (e.data?.type === 'mf-save') {
        onSave(e.data.data)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onExport, onSave])

  // セーブスロットからロード
  const handleLoad = (draft: DraftEntry) => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: 'mf-load', data: draft.data },
      '*'
    )
    setShowSlots(false)
  }

  const iframeKey = selected?.id ?? 'empty'

  if (entries.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '60px 24px',
          color: 'var(--color-text-lo)',
        }}
      >
        <div style={{ fontSize: '13px' }}>シートが登録されていません</div>
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
            padding: '8px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={13} /> シートを登録
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minHeight: 0 }}>

      {/* セクションヘッダー: TEMPLATE ラベル + ロードアイコン */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-lo)',
            letterSpacing: '0.12em',
          }}
        >
          TEMPLATE
        </span>
        <button
          onClick={() => setShowSlots(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: drafts.length > 0 ? 'var(--color-accent)' : 'var(--color-text-lo)',
            cursor: 'pointer',
            padding: '4px 10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.06em',
          }}
          aria-label="セーブスロットを開く"
        >
          <FolderOpen size={13} />
          LOAD
          {drafts.length > 0 && (
            <span
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#000',
                borderRadius: '9999px',
                fontSize: '9px',
                fontWeight: 700,
                padding: '0 5px',
                lineHeight: '14px',
                minWidth: '16px',
                textAlign: 'center',
              }}
            >
              {drafts.length}
            </span>
          )}
        </button>
      </div>

      {/* ギャラリー */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
        }}
      >
        {entries.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedId(e.id)}
            style={{
              flexShrink: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${selectedId === e.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
              background: selectedId === e.id ? 'var(--color-accent-dim)' : 'none',
              color: selectedId === e.id ? 'var(--color-accent)' : 'var(--color-text-mid)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {e.filename.match(/v[\d.]+/)?.[0] ?? e.filename.replace('.html', '')}
          </button>
        ))}
        <button
          onClick={onRegister}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'none',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-lo)',
            cursor: 'pointer',
            padding: '5px 10px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Plus size={11} /> 追加
        </button>
      </div>

      {/* iframe */}
      {selected && (
        <iframe
          key={iframeKey}
          ref={iframeRef}
          srcDoc={selected.html}
          title={selected.filename}
          sandbox="allow-scripts allow-downloads"
          style={{
            flex: 1,
            width: '100%',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#111',
            minHeight: '520px',
          }}
        />
      )}

      {/* セーブスロットパネル */}
      <SaveSlotPanel
        open={showSlots}
        onClose={() => setShowSlots(false)}
        drafts={drafts}
        onFavorite={onFavorite}
        onLoad={handleLoad}
      />
    </div>
  )
}
