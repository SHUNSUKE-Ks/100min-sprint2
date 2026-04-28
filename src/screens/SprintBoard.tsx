import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useSprintStore } from '../store/sprintStore'
import { StepperList } from '../components/stepper/StepperList'
import { SprintSwitcher } from '../components/sprint/SprintSwitcher'

interface OutletCtx {
  onSprintDone: () => void
}

export function SprintBoard() {
  const { onSprintDone } = useOutletContext<OutletCtx>()
  const sprints = useSprintStore((s) => s.sprints)
  const activeSprint = useSprintStore((s) => s.activeSprint)
  const checkStep = useSprintStore((s) => s.checkStep)
  const completeTask = useSprintStore((s) => s.completeTask)
  const [doneTriggered, setDoneTriggered] = useState(false)
  const [switcherOpen, setSwitcherOpen] = useState(false)

  const sprint = sprints.find((s) => s.sprintId === activeSprint)

  if (!sprint) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          color: 'var(--color-text-lo)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
        }}
      >
        <div>スプリントがありません</div>
        <button
          onClick={() => setSwitcherOpen(true)}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'none',
            color: 'var(--color-accent)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          + Sprint を追加
        </button>
        <SprintSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
      </div>
    )
  }

  const handleAllDone = () => {
    if (!doneTriggered) {
      setDoneTriggered(true)
      onSprintDone()
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Sprint タイトル（タップでSwitcher） */}
        <button
          onClick={() => setSwitcherOpen(true)}
          style={{
            width: '100%',
            textAlign: 'left',
            background: 'none',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-bg-surface)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '18px', color: 'var(--color-accent)' }}>⬡</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-hi)',
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
                marginTop: '2px',
              }}
            >
              {sprint.duration}min · {sprint.tasks.length} tasks
            </div>
          </div>
          <ChevronRight size={16} color="var(--color-text-lo)" />
        </button>

        {/* Stepper */}
        <StepperList
          tasks={sprint.tasks}
          onCheck={checkStep}
          onCompleteTask={completeTask}
          onAllDone={handleAllDone}
        />
      </div>

      <SprintSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </>
  )
}
