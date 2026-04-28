import type { Sprint } from '../../types/sprint'
import { PieChart } from '../summary/PieChart'
import { calcTaskTimeShare } from '../../utils/calcProgress'
import { formatTime } from '../../utils/formatTime'

interface Props {
  sprint: Sprint
  elapsedSeconds: number
  onNext: () => void
  onClose: () => void
}

export function SprintDonePopup({ sprint, elapsedSeconds, onNext, onClose }: Props) {
  const slices = calcTaskTimeShare(sprint.tasks)
  const doneTasks = sprint.tasks.filter((t) => t.status === 'DONE').length

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: 'calc(var(--app-width) - 40px)',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-accent)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          boxShadow: '0 0 32px rgba(0,212,204,0.15)',
        }}
      >
        {/* タイトル */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-accent)',
              letterSpacing: '0.15em',
              marginBottom: '4px',
            }}
          >
            SPRINT COMPLETE
          </div>
          <div
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--color-text-hi)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {sprint.title}
          </div>
        </div>

        {/* 円グラフ */}
        {slices.length > 0 && <PieChart slices={slices} size={130} />}

        {/* 統計 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}
        >
          <StatBox label="総作業時間" value={formatTime(elapsedSeconds)} />
          <StatBox label="完了タスク" value={`${doneTasks}/${sprint.tasks.length}`} />
        </div>

        {/* ボタン */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onNext}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-bg-primary)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            次のSprintへ
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: 'transparent',
              color: 'var(--color-text-mid)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '10px 12px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--color-text-lo)',
          letterSpacing: '0.1em',
          marginBottom: '4px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--color-accent)',
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </div>
    </div>
  )
}
