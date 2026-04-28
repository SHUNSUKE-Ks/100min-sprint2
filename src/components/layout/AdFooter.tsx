import { useEffect } from 'react'
import { useSettingsStore } from '../../store/settingsStore'

const AD_MESSAGES = [
  '[AD] ここに広告が入ります',
  '[AD] 100min Sprint powered by your focus',
]

export function AdFooter() {
  const adEnabled = useSettingsStore((s) => s.adEnabled)
  const toggleAd = useSettingsStore((s) => s.toggleAd)

  useEffect(() => {
    if (!adEnabled) return
    const msg = AD_MESSAGES[Math.floor(Math.random() * AD_MESSAGES.length)]
    console.log(msg)
    const id = setInterval(() => {
      console.log(AD_MESSAGES[Math.floor(Math.random() * AD_MESSAGES.length)])
    }, 30000)
    return () => clearInterval(id)
  }, [adEnabled])

  return (
    <div
      style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 40,
        height: '28px',
        backgroundColor: 'rgba(13,15,20,0.9)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--color-text-lo)',
          letterSpacing: '0.05em',
        }}
      >
        {adEnabled
          ? AD_MESSAGES[0]
          : 'CONSOLE v0.1.0 · IDLE'}
      </span>
      <button
        onClick={toggleAd}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: adEnabled ? 'var(--color-accent)' : 'var(--color-text-lo)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.05em',
          padding: '2px 4px',
        }}
      >
        {adEnabled ? 'AD:ON' : '[ AD SPACE · toggle:OFF ]'}
      </button>
    </div>
  )
}
