import { useState } from 'react'
import { Star, Upload, Pencil } from 'lucide-react'
import { BottomSheet } from '../../../components/ui/BottomSheet'
import type { DraftEntry } from '../hooks/useDrafts'

const MAX_SLOTS = 10

function formatUpdated(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface Props {
  open: boolean
  onClose: () => void
  drafts: DraftEntry[]
  onFavorite: (id: string) => void
  onLoad: (draft: DraftEntry) => void
  onRename: (id: string, newLabel: string) => void
}

function ProgressBar({ value }: { value: number }) {
  const color =
    value >= 80 ? 'var(--color-done)' : value >= 40 ? 'var(--color-accent)' : 'var(--color-warning)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
      <div
        style={{
          flex: 1,
          height: '3px',
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
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color,
          fontWeight: 700,
          width: '28px',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {value}%
      </span>
    </div>
  )
}

export function SaveSlotPanel({ open, onClose, drafts, onFavorite, onLoad, onRename }: Props) {
  const emptyCount = MAX_SLOTS - drafts.length
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const startEdit = (draft: DraftEntry) => {
    setEditingId(draft.id)
    setEditValue(draft.label)
  }

  const commitEdit = (id: string) => {
    const trimmed = editValue.trim()
    if (trimmed) onRename(id, trimmed)
    setEditingId(null)
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Save Slots">
      <div style={{ padding: '8px 0' }}>
        {/* 使用中スロット */}
        {drafts.map((draft, i) => (
          <div
            key={draft.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {/* スロット番号 */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--color-text-lo)',
                width: '16px',
                flexShrink: 0,
                textAlign: 'center',
              }}
            >
              {i + 1}
            </span>

            {/* 星ボタン */}
            <button
              onClick={() => onFavorite(draft.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: draft.isFavorite ? '#f59e0b' : 'var(--color-text-lo)',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                flexShrink: 0,
              }}
              aria-label={draft.isFavorite ? 'お気に入り解除' : 'お気に入りに追加'}
            >
              <Star size={16} fill={draft.isFavorite ? '#f59e0b' : 'none'} />
            </button>

            {/* ラベル・進捗 */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* ラベル行 */}
              {editingId === draft.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => commitEdit(draft.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitEdit(draft.id)
                    if (e.key === 'Escape') setEditingId(null)
                  }}
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--color-text-hi)',
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-accent)',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    outline: 'none',
                    width: '100%',
                    fontFamily: 'inherit',
                  }}
                />
              ) : (
                <button
                  onClick={() => startEdit(draft)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'text',
                    textAlign: 'left',
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--color-text-hi)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {draft.isFavorite && (
                      <span style={{ color: '#f59e0b', marginRight: '4px' }}>★</span>
                    )}
                    {draft.label}
                  </span>
                  <Pencil size={10} style={{ color: 'var(--color-text-lo)', flexShrink: 0 }} />
                </button>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--color-accent)',
                    border: '1px solid var(--color-accent)',
                    borderRadius: '3px',
                    padding: '0 4px',
                    flexShrink: 0,
                  }}
                >
                  {draft.schemaVersion}
                </span>
                <ProgressBar value={draft.progress} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: 'var(--color-text-lo)',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatUpdated(draft.updatedAt)}
                </span>
              </div>
            </div>

            {/* ロードボタン */}
            <button
              onClick={() => onLoad(draft)}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'var(--color-accent-dim)',
                color: 'var(--color-accent)',
                border: '1px solid var(--color-accent)',
                borderRadius: 'var(--radius-sm)',
                padding: '5px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Upload size={12} /> Load
            </button>
          </div>
        ))}

        {/* 空きスロット */}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <div
            key={`empty-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderBottom: '1px solid var(--color-border)',
              opacity: 0.35,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--color-text-lo)',
                width: '16px',
                textAlign: 'center',
                flexShrink: 0,
              }}
            >
              {drafts.length + i + 1}
            </span>
            <Star size={16} style={{ color: 'var(--color-text-lo)', flexShrink: 0 }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-text-lo)',
                letterSpacing: '0.06em',
              }}
            >
              ─── 空きスロット ───
            </span>
          </div>
        ))}

        {/* フッター件数 */}
        <div
          style={{
            padding: '10px 16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-lo)',
            letterSpacing: '0.08em',
            textAlign: 'right',
          }}
        >
          {drafts.length} / {MAX_SLOTS} SLOTS USED
        </div>
      </div>
    </BottomSheet>
  )
}
