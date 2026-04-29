import type { ValidationResult } from './types'

export type ValidatorFn<T> = (data: unknown, index?: number) => string | null

export interface ValidatorConfig<T> {
  validate: ValidatorFn<T>
  parseAsArray?: boolean
}

export function createValidator<T>(config: ValidatorConfig<T>) {
  return (raw: string): ValidationResult<T[]> => {
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      return { ok: false, error: 'JSON のパースに失敗しました。形式を確認してください。' }
    }

    const list = config.parseAsArray ?? true ? (Array.isArray(parsed) ? parsed : [parsed]) : [parsed]

    for (let i = 0; i < list.length; i++) {
      const err = config.validate(list[i], i)
      if (err) return { ok: false, error: err }
    }

    return { ok: true, data: list as T[] }
  }
}
