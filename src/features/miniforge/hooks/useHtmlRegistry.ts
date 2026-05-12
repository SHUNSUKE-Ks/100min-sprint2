import { useState } from 'react'
import type { HtmlEntry } from '../types'
import { DEFAULT_HTML } from '../data/defaultHtml'

const KEY = 'mf_html'

function initStorage(): HtmlEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(DEFAULT_HTML))
      return DEFAULT_HTML
    }
    const stored: HtmlEntry[] = JSON.parse(raw)
    // デフォルトに追加されたエントリを自動補完
    const storedIds = new Set(stored.map((e) => e.id))
    const missing = DEFAULT_HTML.filter((d) => !storedIds.has(d.id))
    if (missing.length > 0) {
      const updated = [...stored, ...missing]
      localStorage.setItem(KEY, JSON.stringify(updated))
      return updated
    }
    return stored
  } catch {
    return DEFAULT_HTML
  }
}

function persist(entries: HtmlEntry[]): void {
  localStorage.setItem(KEY, JSON.stringify(entries))
}

export function useHtmlRegistry() {
  const [entries, setEntries] = useState<HtmlEntry[]>(initStorage)

  const add = (entry: { filename: string; html: string }) => {
    const next: HtmlEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setEntries((prev) => {
      const updated = [...prev, next]
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
