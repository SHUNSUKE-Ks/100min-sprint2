import { useState } from 'react'

export interface DraftEntry {
  id: string
  label: string
  schemaVersion: string
  progress: number
  isFavorite: boolean
  updatedAt: string
  data: unknown
}

const KEY = 'mf_drafts'
const MAX = 10

function calcProgress(data: unknown): number {
  if (!data || typeof data !== 'object') return 0
  const d = data as Record<string, unknown>
  const meta = d.meta as Record<string, unknown> | undefined
  const world = d.world as Record<string, unknown> | undefined
  const chars = d.characters as Array<Record<string, unknown>> | undefined
  const scenario = d.scenario as Record<string, unknown> | undefined

  const checks = [
    meta?.label, meta?.id,
    world?.name, world?.civilization, world?.power, world?.taboo, world?.problem,
    chars?.[0]?.name, chars?.[0]?.purpose, chars?.[0]?.fear, chars?.[0]?.flaw, chars?.[0]?.fight_reason,
    chars?.[1]?.name, chars?.[1]?.relationship,
    scenario?.first_incident, scenario?.player_objective, scenario?.chapter1_event,
  ]
  const filled = checks.filter((v) => typeof v === 'string' && v.trim().length > 0).length
  return Math.round((filled / checks.length) * 100)
}

function sortDrafts(drafts: DraftEntry[]): DraftEntry[] {
  return [...drafts].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

function initStorage(): DraftEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? sortDrafts(JSON.parse(raw)) : []
  } catch {
    return []
  }
}

function persist(drafts: DraftEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(drafts))
}

export function useDrafts() {
  const [drafts, setDrafts] = useState<DraftEntry[]>(initStorage)

  const save = (data: unknown) => {
    const d = data as Record<string, unknown>
    const meta = d.meta as Record<string, unknown> | undefined
    const label = (meta?.label as string) || '(無題)'
    const schemaVersion = (meta?.schema_version as string) || '?'
    const progress = calcProgress(data)

    setDrafts((prev) => {
      const existingIdx = prev.findIndex((e) => e.label === label)
      let updated: DraftEntry[]
      if (existingIdx >= 0) {
        updated = prev.map((e, i) =>
          i === existingIdx
            ? { ...e, schemaVersion, progress, updatedAt: new Date().toISOString(), data }
            : e
        )
      } else {
        const next: DraftEntry = {
          id: crypto.randomUUID(),
          label,
          schemaVersion,
          progress,
          isFavorite: false,
          updatedAt: new Date().toISOString(),
          data,
        }
        updated = [next, ...prev].slice(0, MAX)
      }
      const sorted = sortDrafts(updated)
      persist(sorted)
      return sorted
    })
  }

  const remove = (id: string) => {
    setDrafts((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      persist(updated)
      return updated
    })
  }

  const toggleFavorite = (id: string) => {
    setDrafts((prev) => {
      const updated = prev.map((e) =>
        e.id === id ? { ...e, isFavorite: !e.isFavorite } : e
      )
      const sorted = sortDrafts(updated)
      persist(sorted)
      return sorted
    })
  }

  const rename = (id: string, newLabel: string) => {
    setDrafts((prev) => {
      const updated = prev.map((e) =>
        e.id === id ? { ...e, label: newLabel } : e
      )
      persist(updated)
      return updated
    })
  }

  return { drafts, save, remove, toggleFavorite, rename }
}
