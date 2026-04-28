import type { Sprint } from '../../types/sprint'

export interface ValidationResult {
  ok: boolean
  error?: string
  data?: Sprint[]
}

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

function validateStep(s: unknown, path: string): string | null {
  if (!s || typeof s !== 'object') return `${path}: オブジェクトではありません`
  const step = s as Record<string, unknown>
  if (!isString(step.id)) return `${path}.id: 文字列が必要です`
  if (!isString(step.label)) return `${path}.label: 文字列が必要です`
  if (typeof step.checked !== 'boolean') return `${path}.checked: boolean が必要です`
  if (step.type !== 'text' && step.type !== 'code') return `${path}.type: "text" または "code" が必要です`
  if (step.type === 'code' && step.command !== undefined && !isString(step.command))
    return `${path}.command: 文字列が必要です`
  return null
}

function validateTask(t: unknown, path: string): string | null {
  if (!t || typeof t !== 'object') return `${path}: オブジェクトではありません`
  const task = t as Record<string, unknown>
  if (!isString(task.id)) return `${path}.id: 文字列が必要です`
  if (!isString(task.title)) return `${path}.title: 文字列が必要です`
  if (!['TODO', 'DOING', 'DONE'].includes(task.status as string))
    return `${path}.status: "TODO" / "DOING" / "DONE" のいずれかが必要です`
  if (typeof task.estimate !== 'number') return `${path}.estimate: 数値が必要です`
  if (typeof task.result !== 'number') return `${path}.result: 数値が必要です`
  if (!Array.isArray(task.steps)) return `${path}.steps: 配列が必要です`
  for (let i = 0; i < (task.steps as unknown[]).length; i++) {
    const err = validateStep((task.steps as unknown[])[i], `${path}.steps[${i}]`)
    if (err) return err
  }
  return null
}

function validateSprint(s: unknown, index: number): string | null {
  if (!s || typeof s !== 'object') return `sprints[${index}]: オブジェクトではありません`
  const sprint = s as Record<string, unknown>
  if (!isString(sprint.sprintId)) return `sprints[${index}].sprintId: 文字列が必要です`
  if (!isString(sprint.title)) return `sprints[${index}].title: 文字列が必要です`
  if (typeof sprint.duration !== 'number') return `sprints[${index}].duration: 数値が必要です`
  if (!['READY', 'ACTIVE', 'DONE'].includes(sprint.status as string))
    return `sprints[${index}].status: "READY" / "ACTIVE" / "DONE" のいずれかが必要です`
  if (!Array.isArray(sprint.tasks)) return `sprints[${index}].tasks: 配列が必要です`
  for (let i = 0; i < (sprint.tasks as unknown[]).length; i++) {
    const err = validateTask((sprint.tasks as unknown[])[i], `sprints[${index}].tasks[${i}]`)
    if (err) return err
  }
  return null
}

export function validateSprintJson(raw: string): ValidationResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: 'JSON のパースに失敗しました。形式を確認してください。' }
  }

  // 配列でも単一オブジェクトでも受け付ける
  const list = Array.isArray(parsed) ? parsed : [parsed]

  for (let i = 0; i < list.length; i++) {
    const err = validateSprint(list[i], i)
    if (err) return { ok: false, error: err }
  }

  return { ok: true, data: list as Sprint[] }
}
