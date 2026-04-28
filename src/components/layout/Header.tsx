import { Menu } from 'lucide-react'
import { TimerBar } from '../timer/TimerBar'
import { useTimerStore } from '../../store/timerStore'

interface Props {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: Props) {
  const isRunning = useTimerStore((s) => s.isRunning)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 16px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              border: '1px solid var(--color-accent)',
              borderRadius: '4px',
              backgroundColor: 'var(--color-accent-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--color-accent)',
            }}
          >
            100
          </div>
          <h1
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
            }}
          >
            100min Sprint
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={isRunning ? pause : start}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              color: isRunning ? 'var(--color-warning)' : 'var(--color-done)',
              background: 'none',
              border: `1px solid ${isRunning ? 'var(--color-warning)' : 'var(--color-done)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '3px 8px',
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            {isRunning ? 'PAUSE' : 'START'}
          </button>
          <button
            onClick={onMenuClick}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
            }}
            aria-label="メニューを開く"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <TimerBar />
    </header>
  )
}
