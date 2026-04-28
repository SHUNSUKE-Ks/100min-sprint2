import { useEffect, useState } from 'react'

interface Props {
  message: string
  visible: boolean
  onHide: () => void
}

export function Toast({ message, visible, onHide }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      const id = setTimeout(() => {
        setShow(false)
        setTimeout(onHide, 200)
      }, 1800)
      return () => clearTimeout(id)
    }
  }, [visible, onHide])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '48px',
        left: '50%',
        transform: `translateX(-50%) translateY(${show ? 0 : '12px'})`,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        pointerEvents: 'none',
        zIndex: 100,
        backgroundColor: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 16px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        color: 'var(--color-accent)',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      {message}
    </div>
  )
}
