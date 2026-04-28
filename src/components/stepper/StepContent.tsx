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
                width: '18px',
                height: '18px',
                flexShrink: 0,
                border: `1px solid ${step.checked ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: '3px',
                backgroundColor: step.checked ? 'var(--color-accent-dim)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '1px',
                transition: 'border-color 0.15s, background-color 0.15s',
                cursor: 'pointer',
              }}
            >
              {step.checked && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
