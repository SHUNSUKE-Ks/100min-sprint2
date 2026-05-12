import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { TimerBar } from '../timer/TimerBar'
import { useTimerStore } from '../../store/timerStore'
import { useAppStore, type ActiveApp } from '../../store/appStore'

const APP_LABELS: Record<ActiveApp, string> = {
  sprint: '100min Sprint',
  miniforge: 'MiniForge',
}

interface Props {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: Props) {
  const isRunning = useTimerStore((s) => s.isRunning)
  const start = useTimerStore((s) => s.start)
  const pause = useTimerStore((s) => s.pause)
  const { activeApp, setActiveApp } = useAppStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSelectApp = (app: ActiveApp) => {
    setActiveApp(app)
    setDropdownOpen(false)
  }

  return (
    <>
      {/* ドロップダウン背景 */}
      {dropdownOpen && (
        <div
          onClick={() => setDropdownOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
          }}
        />
      )}

      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'var(--color-bg-primary)',
          borderBottom: '1px solid var(--color-border)',
          padding: '10px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* アプリ切り替えボタン */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
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
                  fontSize: '9px',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  flexShrink: 0,
                }}
              >
                {activeApp === 'sprint' ? '100' : 'MF'}
              </div>
              <h1
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                }}
              >
                {APP_LABELS[activeApp]}
              </h1>
              <ChevronDown
                size={14}
                style={{
                  color: 'var(--color-accent)',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>

            {/* ドロップダウン */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  zIndex: 51,
                  minWidth: '180px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                {(Object.keys(APP_LABELS) as ActiveApp[]).map((app) => (
                  <button
                    key={app}
                    onClick={() => handleSelectApp(app)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--color-border)',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor:
                          activeApp === app ? 'var(--color-accent)' : 'transparent',
                        border: '1px solid var(--color-accent)',
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        fontWeight: activeApp === app ? 700 : 400,
                        color:
                          activeApp === app
                            ? 'var(--color-accent)'
                            : 'var(--color-text-mid)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {APP_LABELS[app]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 右側ボタン群（Sprintのみ） */}
          {activeApp === 'sprint' && (
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
                  fontSize: '18px',
                }}
                aria-label="メニューを開く"
              >
                ≡
              </button>
            </div>
          )}
        </div>

        {/* タイマーバーはSprintのみ */}
        {activeApp === 'sprint' && <TimerBar />}
      </header>
    </>
  )
}
