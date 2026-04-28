import { useTimerStore } from '../../store/timerStore'
import { useSprintStore } from '../../store/sprintStore'
import { formatTime } from '../../utils/formatTime'

const SEGMENTS = 10

export function TimerBar() {
  const elapsed = useTimerStore((s) => s.elapsed)
  const sprints = useSprintStore((s) => s.sprints)
  const activeSprint = useSprintStore((s) => s.activeSprint)

  const sprint = sprints.find((s) => s.sprintId === activeSprint)
  const totalSeconds = (sprint?.duration ?? 100) * 60
  const remaining = Math.max(0, totalSeconds - elapsed)
  const remainingRatio = remaining / totalSeconds
  const filledSegments = Math.round(remainingRatio * SEGMENTS)
  const pct = Math.round(remainingRatio * 100)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
      }}
    >
      <div style={{ flex: 1, display: 'flex', gap: '3px', height: '10px' }}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              borderRadius: '2px',
              backgroundColor:
                i < filledSegments
                  ? 'var(--color-accent)'
                  : 'var(--color-bg-elevated)',
              boxShadow:
                i < filledSegments
                  ? '0 0 4px rgba(0,212,204,0.5)'
                  : 'none',
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--color-accent)',
          minWidth: '32px',
          textAlign: 'right',
        }}
      >
        {pct}%
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--color-accent)',
          minWidth: '52px',
          textAlign: 'right',
          textShadow: '0 0 8px rgba(0,212,204,0.5)',
          letterSpacing: '-0.03em',
        }}
      >
        {formatTime(remaining)}
      </span>
    </div>
  )
}
