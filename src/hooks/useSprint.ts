import { useSprintStore } from '../store/sprintStore'

export function useActiveSprint() {
  const sprints = useSprintStore((s) => s.sprints)
  const activeSprint = useSprintStore((s) => s.activeSprint)
  return sprints.find((s) => s.sprintId === activeSprint) ?? null
}

export function useSprintProgress() {
  const sprint = useActiveSprint()
  if (!sprint) return { done: 0, total: 0, pct: 0 }
  const total = sprint.tasks.length
  const done = sprint.tasks.filter((t) => t.status === 'DONE').length
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) }
}
