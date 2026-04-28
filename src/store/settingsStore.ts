import { create } from 'zustand'

interface SettingsStore {
  adEnabled: boolean
  vibrateOnStart: boolean

  toggleAd: () => void
  toggleVibrate: () => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  adEnabled: false,
  vibrateOnStart: false,

  toggleAd: () => set((state) => ({ adEnabled: !state.adEnabled })),
  toggleVibrate: () => set((state) => ({ vibrateOnStart: !state.vibrateOnStart })),
}))
