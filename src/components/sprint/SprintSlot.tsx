import type { Sprint } from '../../types/sprint'

interface Props {
  sprint: Sprint
  isActive: boolean
  onClick: () => void
}

const STATUS_LABEL: Record<Sprint['status'], string> = {
  READY: '未開始',
  ACTIVE: 'ACTIVE',
  DONE: '完了',
}

export function SprintSlot({ sprint, isActive, onClick }: Props) {
  const done = sprint.tasks.filter((t) => t.status === 'DONE').length
  const total = sprint.tasks.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        borderBottom: '1px solid var(--color-border)',
        padding: '14px 16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: isActive ? 'var(--color-accent-dim)' : 'transparent',
      }}
    >
      {/* アクティブインジケーター */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-text-lo)',
          flexShrink: 0,
          boxShadow: isActive ? '0 0 6px rgba(0,212,204,0.6)' : 'none',
        }}
      />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: isActive ? 'var(--color-accent)' : 'var(--color-text-hi)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sprint.title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-text-lo)',
            marginTop: '3px',
          }}
        >
          {sprint.status === 'DONE'
            ? `完了 · 達成率 ${pct}%`
            : sprint.status === 'ACTIVE'
              ? `進行中 · ${pct}%`
              : STATUS_LABEL[sprint.status]}
        </div>
      </div>

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          padding: '2px 7px',
          borderRadius: '3px',
          border: `1px solid ${isActive ? 'rgba(0,212,204,0.4)' : 'var(--color-border)'}`,
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-lo)',
          flexShrink: 0,
        }}
      >
        {STATUS_LABEL[sprint.status]}
      </span>
    </button>
  )
}
