import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Header } from './components/layout/Header'
import { AdFooter } from './components/layout/AdFooter'
import { SprintDonePopup } from './components/sprint/SprintDonePopup'
import { useTimerStore } from './store/timerStore'
import { useSprintStore } from './store/sprintStore'

export function RootLayout() {
  const navigate = useNavigate()
  const isRunning = useTimerStore((s) => s.isRunning)
  const tick = useTimerStore((s) => s.tick)
  const elapsed = useTimerStore((s) => s.elapsed)
  const reset = useTimerStore((s) => s.reset)
  const pause = useTimerStore((s) => s.pause)
  const sprints = useSprintStore((s) => s.sprints)
  const activeSprint = useSprintStore((s) => s.activeSprint)
  const completeSprint = useSprintStore((s) => s.completeSprint)
  const [showDone, setShowDone] = useState(false)

  // タイマー tick
  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => tick(), 1000)
    return () => clearInterval(id)
  }, [isRunning, tick])

  // タイムアップ検知
  useEffect(() => {
    if (!activeSprint) return
    const sprint = sprints.find((s) => s.sprintId === activeSprint)
    if (!sprint || sprint.status === 'DONE') return
    if (elapsed >= sprint.duration * 60) {
      pause()
      completeSprint(activeSprint)
      setShowDone(true)
    }
  }, [elapsed, activeSprint, sprints, pause, completeSprint])

  const currentSprint = sprints.find((s) => s.sprintId === activeSprint)

  const handleSprintDone = () => {
    if (activeSprint && currentSprint?.status !== 'DONE') {
      completeSprint(activeSprint)
    }
    pause()
    setShowDone(true)
  }

  const handleNext = () => {
    setShowDone(false)
    reset()
    navigate('/')
  }

  return (
    <AppShell>
      <Header onMenuClick={() => navigate('/settings')} />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet context={{ onSprintDone: handleSprintDone }} />
      </main>
      <AdFooter />

      {showDone && currentSprint && (
        <SprintDonePopup
          sprint={currentSprint}
          elapsedSeconds={elapsed}
          onNext={handleNext}
          onClose={() => setShowDone(false)}
        />
      )}
    </AppShell>
  )
}
