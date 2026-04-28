import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type { Sprint, TaskStatus } from '../types/sprint'

const SAMPLE_SPRINT: Sprint = {
  sprintId: uuidv4(),
  title: 'SPRINT_001 · サンプルスプリント',
  duration: 100,
  startedAt: null,
  completedAt: null,
  status: 'READY',
  tasks: [
    {
      id: uuidv4(),
      title: 'AppShell 実装',
      status: 'TODO',
      estimate: 20,
      result: 0,
      steps: [
        { id: uuidv4(), label: 'レイアウト設計', checked: false, type: 'text' },
        { id: uuidv4(), label: 'globals.css 作成', checked: false, type: 'text' },
        { id: uuidv4(), label: 'npm run dev で確認', checked: false, type: 'code', command: 'npm run dev' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Header + TimerBar 実装',
      status: 'TODO',
      estimate: 30,
      result: 0,
      steps: [
        { id: uuidv4(), label: 'Header コンポーネント作成', checked: false, type: 'text' },
        { id: uuidv4(), label: 'TimerBar 表示確認', checked: false, type: 'text' },
      ],
    },
  ],
}

interface SprintStore {
  sprints: Sprint[]
  activeSprint: string | null

  addSprint: (sprint: Sprint) => void
  setActiveSprint: (id: string) => void
  checkStep: (taskId: string, stepId: string) => void
  completeTask: (taskId: string) => void
  completeSprint: (sprintId: string) => void
  importSprints: (data: Sprint[]) => void
  exportSprints: () => string
}

export const useSprintStore = create<SprintStore>()(
  immer((set, get) => ({
    sprints: [SAMPLE_SPRINT],
    activeSprint: SAMPLE_SPRINT.sprintId,

    addSprint: (sprint) =>
      set((state) => {
        state.sprints.push(sprint)
      }),

    setActiveSprint: (id) =>
      set((state) => {
        state.activeSprint = id
      }),

    checkStep: (taskId, stepId) =>
      set((state) => {
        const sprint = state.sprints.find((s) => s.sprintId === state.activeSprint)
        if (!sprint) return
        const task = sprint.tasks.find((t) => t.id === taskId)
        if (!task) return
        const step = task.steps.find((s) => s.id === stepId)
        if (!step) return
        step.checked = !step.checked

        const allChecked = task.steps.every((s) => s.checked)
        task.status = (allChecked ? 'DONE' : task.status === 'TODO' ? 'DOING' : task.status) as TaskStatus

        const allDone = sprint.tasks.every((t) => t.status === 'DONE')
        if (allDone) {
          sprint.status = 'DONE'
          sprint.completedAt = new Date().toISOString()
        }
      }),

    completeTask: (taskId) =>
      set((state) => {
        const sprint = state.sprints.find((s) => s.sprintId === state.activeSprint)
        if (!sprint) return
        const task = sprint.tasks.find((t) => t.id === taskId)
        if (!task) return
        task.steps.forEach((s) => { s.checked = true })
        task.status = 'DONE'
        const allDone = sprint.tasks.every((t) => t.status === 'DONE')
        if (allDone) {
          sprint.status = 'DONE'
          sprint.completedAt = new Date().toISOString()
        }
      }),

    completeSprint: (sprintId) =>
      set((state) => {
        const sprint = state.sprints.find((s) => s.sprintId === sprintId)
        if (!sprint) return
        sprint.status = 'DONE'
        sprint.completedAt = new Date().toISOString()
      }),

    importSprints: (data) =>
      set((state) => {
        state.sprints = data
        state.activeSprint = data[0]?.sprintId ?? null
      }),

    exportSprints: () => JSON.stringify(get().sprints, null, 2),
  }))
)
