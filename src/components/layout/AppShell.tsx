import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function AppShell({ children }: Props) {
  return (
    <div
      style={{
        width: 'var(--app-width)',
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg-primary)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  )
}
