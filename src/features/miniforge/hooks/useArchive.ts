import { useState } from 'react'

export interface ArchiveEntry {
  id: string
  filename: string
  createdAt: string
  data: unknown
}

const KEY = 'mf_archive'

function initStorage(): ArchiveEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function persist(entries: ArchiveEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function useArchive() {
  const [entries, setEntries] = useState<ArchiveEntry[]>(initStorage)

  const add = (filename: string, data: unknown) => {
    const next: ArchiveEntry = {
      id: crypto.randomUUID(),
      filename,
      createdAt: new Date().toISOString(),
      data,
    }
    setEntries((prev) => {
      const updated = [next, ...prev]
      persist(updated)
      return updated
    })
  }

  const remove = (id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      persist(updated)
      return updated
    })
  }

  return { entries, add, remove }
}
