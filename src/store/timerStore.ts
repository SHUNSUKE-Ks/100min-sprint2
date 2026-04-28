import { create } from 'zustand'

interface TimerStore {
  elapsed: number
  isRunning: boolean

  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
}

export const useTimerStore = create<TimerStore>((set) => ({
  elapsed: 0,
  isRunning: false,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () => set({ elapsed: 0, isRunning: false }),
  tick: () => set((state) => ({ elapsed: state.elapsed + 1 })),
}))
