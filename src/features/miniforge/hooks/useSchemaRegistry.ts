import { useState } from 'react'
import type { SchemaEntry } from '../types'
import { DEFAULT_SCHEMAS } from '../data/defaultSchemas'

const KEY = 'mf_schemas'

function initStorage(): SchemaEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
    localStorage.setItem(KEY, JSON.stringify(DEFAULT_SCHEMAS))
    return DEFAULT_SCHEMAS
  } catch {
    return DEFAULT_SCHEMAS
  }
}

function persist(schemas: SchemaEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(schemas))
}

export function useSchemaRegistry() {
  const [schemas, setSchemas] = useState<SchemaEntry[]>(initStorage)

  const add = (entry: { name: string; version: string; code: string; isLatest: boolean }) => {
    const next: SchemaEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setSchemas((prev) => {
      const updated = [...prev, next]
      persist(updated)
      return updated
    })
  }

  const remove = (id: string) => {
    setSchemas((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      persist(updated)
      return updated
    })
  }

  return { schemas, add, remove }
}
