import type { Step } from '../../types/sprint'
import { CodeBlock } from './CodeBlock'

interface Props {
  steps: Step[]
  taskId: string
  onCheck: (taskId: string, stepId: string) => void
}

export function StepContent({ steps, taskId, onCheck }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        paddingTop: '12px',
      }}
    >
      {steps.map((step) => (
        <div key={step.id}>
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <div
              onClick={() => onCheck(taskId, step.id)}
              style={{
                width: '22px',
                height: '22px',
                flexShrink: 0,
                border: `2px solid ${step.checked ? 'var(--color-accent)' : 'var(--color-text-mid)'}`,
                borderRadius: '5px',
                backgroundColor: step.checked ? 'var(--color-accent)' : 'var(--color-bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1px',
                transition: 'border-color 0.15s, background-color 0.15s',
                cursor: 'pointer',
                boxShadow: step.checked
                  ? '0 0 6px rgba(0,212,204,0.4)'
                  : 'inset 0 1px 3px rgba(0,0,0,0.4)',
              }}
            >
              {step.checked && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4.5L4.5 8L11 1" stroke="var(--color-bg-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              style={{
                fontSize: '13px',
                color: step.checked ? 'var(--color-text-lo)' : 'var(--color-text-hi)',
                textDecoration: step.checked ? 'line-through' : 'none',
                lineHeight: '1.4',
                transition: 'color 0.15s',
              }}
            >
              {step.label}
            </span>
          </label>
          {step.type === 'code' && step.command && (
            <div style={{ marginLeft: '28px', marginTop: '6px' }}>
              <CodeBlock command={step.command} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
