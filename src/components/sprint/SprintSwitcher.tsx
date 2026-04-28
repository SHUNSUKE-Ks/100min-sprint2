import { v4 as uuidv4 } from 'uuid'
import { BottomSheet } from '../ui/BottomSheet'
import { SprintSlot } from './SprintSlot'
import { useSprintStore } from '../../store/sprintStore'
import type { Sprint } from '../../types/sprint'

interface Props {
  open: boolean
  onClose: () => void
}

function makeNewSprint(): Sprint {
  return {
    sprintId: uuidv4(),
    title: `SPRINT_NEW · 新しいスプリント`,
    duration: 100,
    startedAt: null,
    completedAt: null,
    status: 'READY',
    tasks: [],
  }
}

export function SprintSwitcher({ open, onClose }: Props) {
  const sprints = useSprintStore((s) => s.sprints)
  const activeSprint = useSprintStore((s) => s.activeSprint)
  const setActiveSprint = useSprintStore((s) => s.setActiveSprint)
  const addSprint = useSprintStore((s) => s.addSprint)

  const handleSelect = (id: string) => {
    setActiveSprint(id)
    onClose()
  }

  const handleAdd = () => {
    const sprint = makeNewSprint()
    addSprint(sprint)
    setActiveSprint(sprint.sprintId)
    onClose()
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Sprint 一覧">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sprints.map((sprint) => (
          <SprintSlot
            key={sprint.sprintId}
            sprint={sprint}
            isActive={sprint.sprintId === activeSprint}
            onClick={() => handleSelect(sprint.sprintId)}
          />
        ))}

        <button
          onClick={handleAdd}
          style={{
            margin: '12px 16px',
            padding: '12px',
            backgroundColor: 'transparent',
            border: '1px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-mid)',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            cursor: 'pointer',
            letterSpacing: '0.05em',
          }}
        >
          + 新しい Sprint を追加
        </button>
      </div>
    </BottomSheet>
  )
}
