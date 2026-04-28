interface Props {
  checked: boolean
  onChange: () => void
  label?: string
}

export function Toggle({ checked, onChange, label }: Props) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <div
        onClick={onChange}
        style={{
          width: '36px',
          height: '20px',
          borderRadius: '10px',
          backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
          border: `1px solid ${checked ? 'var(--color-accent)' : 'var(--color-border)'}`,
          position: 'relative',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '18px' : '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: checked ? 'var(--color-bg-primary)' : 'var(--color-text-lo)',
            transition: 'left 0.2s ease, background-color 0.2s ease',
          }}
        />
      </div>
      {label && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--color-text-mid)',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
      )}
    </label>
  )
}
