import { useState } from 'react'
import { Copy } from 'lucide-react'
import { BottomSheet } from '../../../components/ui/BottomSheet'
import tagsData from '../../../00_devstudio/MailBox/tags.json'

type Category = 'all' | 'theme' | 'beat' | 'trope' | 'emotion' | 'relation'

const CATEGORIES: Category[] = ['all', 'theme', 'beat', 'trope', 'emotion', 'relation']

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'ALL',
  theme: 'テーマ',
  beat: 'ビート',
  trope: 'トロープ',
  emotion: '感情',
  relation: '関係',
}

interface Props {
  open: boolean
  onClose: () => void
}

export function DictModal({ open, onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filtered =
    activeCategory === 'all'
      ? tagsData.tags
      : tagsData.tags.filter((t) => t.category === activeCategory)

  return (
    <BottomSheet open={open} onClose={onClose} title="DICT">
      {/* カテゴリフィルター */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          padding: '10px 14px',
          scrollbarWidth: 'none',
          flexShrink: 0,
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                padding: '4px 12px',
                borderRadius: '9999px',
                border: `1px solid ${active ? 'var(--color-accent)' : 'var(--color-border)'}`,
                background: active ? 'var(--color-accent-dim)' : 'none',
                color: active ? 'var(--color-accent)' : 'var(--color-text-mid)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          )
        })}
      </div>

      {/* エントリー一覧 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          padding: '12px 14px 20px',
        }}
      >
        {filtered.map((tag) => (
          <button
            key={tag.tag_key}
            onClick={() => {
              navigator.clipboard.writeText(tag.description)
              onClose()
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '12px',
              color: 'var(--color-text-mid)',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '9999px',
              padding: '4px 10px 4px 14px',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {tag.description}
            <Copy size={11} style={{ color: 'var(--color-text-lo)', flexShrink: 0 }} />
          </button>
        ))}
        <div
          style={{
            width: '100%',
            textAlign: 'right',
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: 'var(--color-text-lo)',
            letterSpacing: '0.08em',
            marginTop: '6px',
          }}
        >
          {filtered.length} ENTRIES
        </div>
      </div>
    </BottomSheet>
  )
}
