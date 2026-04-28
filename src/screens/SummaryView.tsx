import { useNavigate } from 'react-router-dom'
import { useSprintStore } from '../store/sprintStore'
import { useTimerStore } from '../store/timerStore'
import { PieChart } from '../components/summary/PieChart'
import { calcTaskTimeShare } from '../utils/calcProgress'
import { formatTime } from '../utils/formatTime'

export function SummaryView() {
  const navigate = useNavigate()
  const sprints = useSprintStore((s) => s.sprints)
  const activeSprint = useSprintStore((s) => s.activeSprint)
  const elapsed = useTimerStore((s) => s.elapsed)

  const sprint = sprints.find((s) => s.sprintId === activeSprint)
  const slices = sprint ? calcTaskTimeShare(sprint.tasks) : []
  const doneTasks = sprint ? sprint.tasks.filter((t) => t.status === 'DONE').length : 0

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px 16px',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--color-accent)',
          letterSpacing: '0.15em',
        }}
      >
        SPRINT SUMMARY
      </div>

      {sprint && (
        <>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-hi)' }}>
            {sprint.title}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <StatBox label="総作業時間" value={formatTime(elapsed)} />
            <StatBox label="完了タスク" value={`${doneTasks}/${sprint.tasks.length}`} />
          </div>

          {slices.length > 0 && <PieChart slices={slices} size={160} />}
        </>
      )}

      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: 'auto',
          padding: '12px',
          backgroundColor: 'var(--color-bg-elevated)',
          color: 'var(--color-accent)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.08em',
          cursor: 'pointer',
        }}
      >
        ← SprintBoardへ
      </button>
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
        }}
      >
        {value}
      </div>
    </div>
  )
}
