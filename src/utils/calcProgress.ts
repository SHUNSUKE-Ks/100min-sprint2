import type { Sprint, Task } from '../types/sprint'

export function calcSprintProgress(sprint: Sprint): number {
  const total = sprint.tasks.length
  if (total === 0) return 0
  const done = sprint.tasks.filter((t) => t.status === 'DONE').length
  return Math.round((done / total) * 100)
}

export function calcTaskTimeShare(tasks: Task[]): { title: string; minutes: number; pct: number }[] {
  const total = tasks.reduce((sum, t) => sum + (t.estimate || 0), 0)
  if (total === 0) return []
  return tasks.map((t) => ({
    title: t.title,
    minutes: t.estimate,
    pct: Math.round((t.estimate / total) * 100),
  }))
}
