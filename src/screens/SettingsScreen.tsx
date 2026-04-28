import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useSettingsStore } from '../store/settingsStore'
import { Toggle } from '../components/ui/Toggle'
import { SchemaViewer } from '../features/importExport/SchemaViewer'
import { JsonImporter } from '../features/importExport/JsonImporter'

type Tab = 'settings' | 'import'

export function SettingsScreen() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('settings')
  const adEnabled = useSettingsStore((s) => s.adEnabled)
  const vibrateOnStart = useSettingsStore((s) => s.vibrateOnStart)
  const toggleAd = useSettingsStore((s) => s.toggleAd)
  const toggleVibrate = useSettingsStore((s) => s.toggleVibrate)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', minHeight: '100%' }}>
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-mid)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-accent)',
            letterSpacing: '0.15em',
          }}
        >
          SETTINGS
        </span>
      </div>

      {/* タブ切り替え */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border)',
          marginBottom: '20px',
        }}
      >
        {(['settings', 'import'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '10px',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${tab === t ? 'var(--color-accent)' : 'transparent'}`,
              color: tab === t ? 'var(--color-accent)' : 'var(--color-text-lo)',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {t === 'settings' ? '設定' : 'IMPORT / EXPORT'}
          </button>
        ))}
      </div>

      {/* タブ1：設定 */}
      {tab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <SettingRow label="広告表示">
            <Toggle checked={adEnabled} onChange={toggleAd} />
          </SettingRow>
          <SettingRow label="タイマー開始時バイブ">
            <Toggle checked={vibrateOnStart} onChange={toggleVibrate} />
          </SettingRow>

          <div
            style={{
              marginTop: '24px',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                color: 'var(--color-text-lo)',
                letterSpacing: '0.1em',
                marginBottom: '10px',
              }}
            >
              SHORTCUTS
            </div>
            <pre
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-text-mid)',
                margin: 0,
                lineHeight: 1.8,
              }}
            >
              {`S  — START / PAUSE timer\nR  — RESET timer\nH  — Home (SprintBoard)\n,  — Settings`}
            </pre>
          </div>

          <div
            style={{
              marginTop: '24px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-text-lo)',
              textAlign: 'center',
            }}
          >
            100min Sprint v0.1.0
          </div>
        </div>
      )}

      {/* タブ2：Import / Export */}
      {tab === 'import' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <SchemaViewer />
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 0 }} />
          <JsonImporter />
        </div>
      )}
    </div>
  )
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <span style={{ fontSize: '13px', color: 'var(--color-text-hi)' }}>{label}</span>
      {children}
    </div>
  )
}
