import { useRef } from 'react'
import { Check } from 'lucide-react'
import type { Task } from '../../types/sprint'
import { StepContent } from './StepContent'

interface Props {
  task: Task
  index: number
  isActive: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  onCheck: (taskId: string, stepId: string) => void
  onCompleteTask: (taskId: string) => void
}

export function StepperItem({ task, index, isActive, isExpanded, onToggleExpand, onCheck, onCompleteTask }: Props) {
  const isDone = task.status === 'DONE'

  const iconBg = isDone
    ? 'var(--color-done)'
    : isActive
      ? 'var(--color-bg-elevated)'
      : 'var(--color-bg-surface)'

  const iconBorder = isDone
    ? 'var(--color-done)'
    : isActive
      ? 'var(--color-accent)'
      : 'var(--color-border)'

  const cardBg = isActive ? 'var(--color-bg-elevated)' : 'var(--color-bg-surface)'
  const cardBorder = isActive ? 'var(--color-accent)' : 'var(--color-border)'

  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <article style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '12px' }}>
      {/* ステップアイコン */}
      <div
        style={{
          width: '36px',
          height: '36px',
          flexShrink: 0,
          borderRadius: '50%',
          backgroundColor: iconBg,
          border: `1px solid ${iconBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '10px',
          boxShadow: isActive ? '0 0 8px rgba(0,212,204,0.25)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {isDone ? (
          <Check size={16} color="var(--color-bg-primary)" strokeWidth={2.5} />
        ) : isActive ? (
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
            }}
          />
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-text-lo)',
            }}
          >
            {index + 1}
          </span>
        )}
      </div>

      {/* カード */}
      <div
        style={{
          flex: 1,
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          opacity: isDone ? 0.55 : 1,
          boxShadow: isActive ? '0 0 4px rgba(0,212,204,0.1)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {/* ヘッダー行 - クリック可能 */}
        <div
          onClick={onToggleExpand}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: isDone ? 'default' : 'pointer',
            transition: 'opacity 0.15s ease',
            opacity: isDone ? 0.6 : 1,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: isDone
                  ? 'var(--color-text-mid)'
                  : isActive
                    ? 'var(--color-accent)'
                    : 'var(--color-text-mid)',
                textDecoration: isDone ? 'line-through' : 'none',
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {task.title}
            </span>
            {/* Expand indicator */}
            <span
              style={{
                fontSize: '12px',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-lo)',
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease, color 0.2s ease',
                flexShrink: 0,
              }}
            >
              ›
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '2px 7px',
              borderRadius: '3px',
              border: `1px solid ${
                isDone
                  ? 'rgba(34,197,94,0.3)'
                  : isActive
                    ? 'rgba(0,212,204,0.3)'
                    : 'var(--color-border)'
              }`,
              backgroundColor: isDone
                ? 'rgba(34,197,94,0.08)'
                : isActive
                  ? 'rgba(0,212,204,0.08)'
                  : 'transparent',
              color: isDone
                ? 'var(--color-done)'
                : isActive
                  ? 'var(--color-accent)'
                  : 'var(--color-text-lo)',
              flexShrink: 0,
            }}
          >
            {task.status}
          </span>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-text-lo)',
            marginTop: '2px',
          }}
        >
          {task.id.slice(0, 8).toUpperCase()} · 推定 {task.estimate}min
        </div>

        {/* サブステップ（展開時に表示） */}
        {isExpanded && (
          <div ref={contentRef} style={{ animation: 'slideDown 0.2s ease' }}>
            <style>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  max-height: 0;
                }
                to {
                  opacity: 1;
                  max-height: 500px;
                }
              }
            `}</style>
            <StepContent
              steps={task.steps}
              taskId={task.id}
              onCheck={onCheck}
            />
            {/* 完了ボタン：ステップなし or 全チェック済みの時に表示 */}
            {(task.steps.length === 0 || task.steps.every((s) => s.checked)) && (
              <button
                onClick={() => onCompleteTask(task.id)}
                style={{
                  marginTop: '14px',
                  width: '100%',
                  padding: '9px',
                  backgroundColor: 'var(--color-done)',
                  color: 'var(--color-bg-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                ✓ このタスクを完了
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
