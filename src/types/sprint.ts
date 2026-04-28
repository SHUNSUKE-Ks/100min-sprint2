export type StepType = 'text' | 'code'
export type TaskStatus = 'TODO' | 'DOING' | 'DONE'
export type SprintStatus = 'READY' | 'ACTIVE' | 'DONE'

export interface Step {
  id: string
  label: string
  checked: boolean
  type: StepType
  command?: string
}

export interface Task {
  id: string
  title: string
  status: TaskStatus
  steps: Step[]
  estimate: number
  result: number
}

export interface Sprint {
  sprintId: string
  title: string
  duration: number
  startedAt: string | null
  completedAt: string | null
  status: SprintStatus
  tasks: Task[]
}
