import { useEffect, useRef } from 'react'
import type { Task } from '../../types/sprint'
import { StepperItem } from './StepperItem'

interface Props {
  tasks: Task[]
  onCheck: (taskId: string, stepId: string) => void
  onCompleteTask: (taskId: string) => void
  onAllDone?: () => void
}

export function StepperList({ tasks, onCheck, onCompleteTask, onAllDone }: Props) {
  const activeIndex = tasks.findIndex((t) => t.status !== 'DONE')
  const allDone = tasks.every((t) => t.status === 'DONE')
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const prevActiveRef = useRef(activeIndex)

  useEffect(() => {
    if (allDone) {
      onAllDone?.()
      return
    }
    if (activeIndex !== prevActiveRef.current && activeIndex >= 0) {
      const el = itemRefs.current[activeIndex]
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 220)
      }
    }
    prevActiveRef.current = activeIndex
  }, [activeIndex, allDone, onAllDone])

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
      {/* 縦線（接続ライン） */}
      <div
        style={{
          position: 'absolute',
          left: '17px',
          top: '46px',
          bottom: '46px',
          width: '1px',
          backgroundColor: 'var(--color-border)',
          zIndex: 0,
        }}
      />

      {tasks.map((task, i) => (
        <div
          key={task.id}
          ref={(el) => { itemRefs.current[i] = el }}
        >
          <StepperItem
            task={task}
            index={i}
            isActive={i === activeIndex}
            onCheck={onCheck}
            onCompleteTask={onCompleteTask}
          />
        </div>
      ))}
    </section>
  )
}
