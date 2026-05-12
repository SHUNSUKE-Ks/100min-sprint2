import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ActiveApp = 'sprint' | 'miniforge'

interface AppStore {
  activeApp: ActiveApp
  setActiveApp: (app: ActiveApp) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activeApp: 'sprint',
      setActiveApp: (app) => set({ activeApp: app }),
    }),
    { name: 'active-app' }
  )
)
