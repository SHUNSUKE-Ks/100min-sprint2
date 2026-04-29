import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { useTimerStore } from '../store/timerStore'
import { useSprintStore } from '../store/sprintStore'
import type { Task, TaskStatus } from '../types/sprint'

const SPLASH_KEY = 'splash_shown'
const RADIUS = 96
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getDisplayTasks(tasks: Task[]): Task[] {
  const doingIdx = tasks.findIndex((t) => t.status === 'DOING')
  if (doingIdx === -1) return tasks.slice(0, 3)
  const start = Math.max(0, doingIdx - 1)
  return tasks.slice(start, start + 3)
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function StatusIcon({ status }: { status: TaskStatus }) {
  if (status === 'DONE')
    return <div style={{ color: '#22C55E', fontSize: '11px', fontWeight: 700 }}>✓</div>
  if (status === 'DOING')
    return <div style={{ color: '#00D4CC', fontSize: '11px', fontWeight: 700 }}>▶</div>
  return <div style={{ color: '#444444', fontSize: '10px', fontWeight: 700 }}>3</div>
}

function StatusBadge({ status }: { status: TaskStatus }) {
  const badges = {
    DONE: { bg: '#22C55E18', text: '#22C55E', label: 'DONE' },
    DOING: { bg: '#00D4CC22', text: '#00D4CC', label: 'DOING' },
    TODO: { bg: '#1E2128', text: '#444444', label: 'TODO' },
  }
  const badge = badges[status]
  return (
    <div
      style={{
        fontSize: '9px',
        padding: '2px 7px',
        borderRadius: '4px',
        backgroundColor: badge.bg,
        color: badge.text,
        letterSpacing: '0.05em',
        flexShrink: 0,
      }}
    >
      {badge.label}
    </div>
  )
}

export function SplashScreen() {
  const navigate = useNavigate()
  const elapsed = useTimerStore((s) => s.elapsed)
  const sprints = useSprintStore((s) => s.sprints)
  const activeSprint = useSprintStore((s) => s.activeSprint)

  const sprint = sprints.find((s) => s.sprintId === activeSprint)
  const duration = sprint?.duration ?? 100

  const [animProgress, setAnimProgress] = useState(0)
  const [dotActive, setDotActive] = useState(0)
  const [cardsVisible, setCardsVisible] = useState([false, false, false])
  const [nextButtonVisible, setNextButtonVisible] = useState(false)
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const rafRef = useRef<number | null>(null)
  const dotIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const targetProgress = elapsed / (duration * 60)
  const displayElapsed = Math.round(animProgress * elapsed)
  const displayMm = String(Math.floor(displayElapsed / 60)).padStart(2, '0')
  const displaySs = String(displayElapsed % 60).padStart(2, '0')
  const displayPct = Math.round(animProgress * targetProgress * 100)
  const offset = CIRCUMFERENCE * (1 - animProgress * targetProgress)

  const displayTasks = sprint ? getDisplayTasks(sprint.tasks) : []

  const handleCardTap = (task: Task) => {
    if (task.status === 'DONE') return
    setExpandedTaskId(expandedTaskId === task.id ? null : task.id)
  }

  const handleEnterApp = (task: Task) => {
    if (task.status === 'DOING') {
      navigate(`/task/${task.id}`)
    } else if (task.status === 'TODO') {
      navigate('/sprint')
    }
  }

  useEffect(() => {
    const startTime = performance.now()

    let dotIdx = 0
    dotIntervalRef.current = setInterval(() => {
      setDotActive(dotIdx % 3)
      dotIdx++
    }, 260)

    const dur = 2000
    const t0 = performance.now()

    function frame(now: number) {
      const t = Math.min((now - t0) / dur, 1)
      const ease = easeInOut(t)
      setAnimProgress(ease)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        if (dotIntervalRef.current) clearInterval(dotIntervalRef.current)

        setTimeout(() => setCardsVisible((p) => [true, p[1], p[2]]), 200)
        setTimeout(() => setCardsVisible((p) => [p[0], true, p[2]]), 300)
        setTimeout(() => setCardsVisible((p) => [p[0], p[1], true]), 400)

        setTimeout(() => setNextButtonVisible(true), 800)

        // Mark splash as shown after 1 second minimum
        setTimeout(() => {
          sessionStorage.setItem(SPLASH_KEY, '1')
        }, 1000)
      }
    }

    rafRef.current = requestAnimationFrame(frame)

    // If already shown, wait at least 1 second before redirecting
    const checkShown = setTimeout(() => {
      if (sessionStorage.getItem(SPLASH_KEY)) {
        // Wait minimum 1 second from start
        const elapsed = performance.now() - startTime
        const waitTime = Math.max(0, 1000 - elapsed)
        setTimeout(() => navigate('/sprint', { replace: true }), waitTime)
      }
    }, 0)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (dotIntervalRef.current) clearInterval(dotIntervalRef.current)
      clearTimeout(checkShown)
    }
  }, [navigate])

  return (
    <AppShell>
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          gap: '20px',
        }}
      >
        {/* Decorative rings */}
        <div
          style={{
            position: 'absolute',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            border: '1px solid #00D4CC0A',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '390px',
            height: '390px',
            borderRadius: '50%',
            border: '1px solid #00D4CC04',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Timer section */}
        <div style={{ position: 'relative', width: '220px', height: '220px' }}>
          <svg
            width="220"
            height="220"
            viewBox="0 0 220 220"
            style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
          >
            {/* Track */}
            <circle cx="110" cy="110" r={RADIUS} fill="none" stroke="#1A1D24" strokeWidth="5" />

            {/* Glow */}
            <circle
              cx="110"
              cy="110"
              r={RADIUS}
              fill="none"
              stroke="#00D4CC"
              strokeWidth="13"
              strokeLinecap="round"
              opacity="0.06"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.04s linear' }}
            />

            {/* Progress arc */}
            <circle
              cx="110"
              cy="110"
              r={RADIUS}
              fill="none"
              stroke="#00D4CC"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 0.04s linear' }}
            />
          </svg>

          {/* Timer digits */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '42px',
                fontWeight: 500,
                color: '#00D4CC',
                letterSpacing: '2px',
                lineHeight: 1,
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span>{displayMm}</span>
              <span style={{ animation: 'blink 1s step-end infinite' }}>:</span>
              <span>{displaySs}</span>
              <style>{`
                @keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.25; }
                }
              `}</style>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#444444',
                marginTop: '7px',
                letterSpacing: '1px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {displayPct}%
            </div>
          </div>
        </div>

        {/* Dots */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            marginBottom: '28px',
            opacity: cardsVisible[0] ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: i === dotActive ? '#00D4CC' : '#1E2128',
                transition: 'background-color 0.04s linear',
              }}
            />
          ))}
        </div>

        {/* Task cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '311px',
          }}
        >
          {displayTasks.map((task, idx) => {
            const isExpanded = expandedTaskId === task.id
            return (
              <div
                key={task.id}
                style={{
                  backgroundColor: '#0F1117',
                  border: '1px solid #1E2128',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  opacity: cardsVisible[idx]
                    ? task.status === 'DONE'
                      ? 0.45
                      : 1
                    : task.status === 'DONE'
                      ? 0.45
                      : 0,
                  transform: cardsVisible[idx] ? 'translateY(0)' : 'translateY(14px)',
                  transition: 'opacity 0.38s ease, transform 0.38s ease',
                  pointerEvents: task.status === 'DONE' ? 'none' : 'auto',
                }}
              >
                {/* Card header */}
                <div
                  onClick={() => handleCardTap(task)}
                  style={{
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '11px',
                    cursor: task.status === 'DONE' ? 'default' : 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {/* Status icon */}
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      backgroundColor:
                        task.status === 'DONE'
                          ? '#22C55E18'
                          : task.status === 'DOING'
                            ? '#00D4CC22'
                            : '#1E2128',
                    }}
                  >
                    {task.status !== 'TODO' ? (
                      <StatusIcon status={task.status} />
                    ) : (
                      <div style={{ color: '#444444', fontSize: '10px', fontWeight: 700 }}>
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  {/* Title and meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#cccccc',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        letterSpacing: '0.02em',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {task.title}
                    </div>
                    <div
                      style={{
                        fontSize: '10px',
                        color: '#3A3D48',
                        marginTop: '3px',
                        letterSpacing: '0.04em',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {task.id} · 推定 {task.estimate}min
                    </div>
                  </div>

                  {/* Badge */}
                  <StatusBadge status={task.status} />

                  {/* Expand indicator */}
                  <div
                    style={{
                      fontSize: '11px',
                      color: isExpanded ? '#00D4CC' : task.status === 'DOING' ? '#00D4CC' : '#2A2D38',
                      flexShrink: 0,
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease, color 0.2s ease',
                    }}
                  >
                    ›
                  </div>
                </div>

                {/* Steps panel */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: '1px solid #1E2128',
                      padding: '8px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      backgroundColor: 'rgba(0, 212, 204, 0.03)',
                      animation: 'slideDown 0.2s ease',
                    }}
                  >
                    <style>{`
                      @keyframes slideDown {
                        from {
                          opacity: 0;
                          max-height: 0;
                        }
                        to {
                          opacity: 1;
                          max-height: 200px;
                        }
                      }
                    `}</style>
                    {task.steps.map((step) => (
                      <div
                        key={step.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          fontSize: '11px',
                          color: step.checked ? '#22C55E' : '#999999',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            minWidth: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${step.checked ? '#22C55E' : '#444444'}`,
                            borderRadius: '3px',
                            marginTop: '2px',
                            backgroundColor: step.checked ? '#22C55E18' : 'transparent',
                          }}
                        >
                          {step.checked && (
                            <span style={{ color: '#22C55E', fontSize: '10px' }}>✓</span>
                          )}
                        </div>
                        <span
                          style={{
                            textDecoration: step.checked ? 'line-through' : 'none',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {step.label}
                        </span>
                      </div>
                    ))}
                    {/* Enter button */}
                    <button
                      onClick={() => handleEnterApp(task)}
                      style={{
                        marginTop: '6px',
                        padding: '6px 10px',
                        fontSize: '10px',
                        background: 'transparent',
                        border: '1px solid #00D4CC44',
                        borderRadius: '4px',
                        color: '#00D4CC',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Enter →
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => navigate('/sprint')}
          style={{
            position: 'absolute',
            bottom: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: nextButtonVisible ? '#00D4CC' : 'transparent',
            fontSize: '14px',
            fontFamily: 'var(--font-mono)',
            cursor: nextButtonVisible ? 'pointer' : 'default',
            opacity: nextButtonVisible ? 1 : 0,
            transform: nextButtonVisible ? 'translateX(0)' : 'translateX(40px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease, color 0.2s ease',
            letterSpacing: '0.1em',
            padding: '8px 12px',
          }}
        >
          Next →
        </button>
      </div>
    </AppShell>
  )
}
