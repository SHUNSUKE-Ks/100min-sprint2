interface Slice {
  title: string
  pct: number
}

interface Props {
  slices: Slice[]
  size?: number
}

const PALETTE = [
  'var(--color-accent)',
  'var(--color-done)',
  'var(--color-warning)',
  '#a78bfa',
  '#f472b6',
  '#38bdf8',
]

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function makeArcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToXY(cx, cy, r, startDeg)
  const end = polarToXY(cx, cy, r, endDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y} Z`
}

export function PieChart({ slices, size = 140 }: Props) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 6

  let cursor = 0
  const paths = slices.map((slice, i) => {
    const deg = (slice.pct / 100) * 360
    const path = makeArcPath(cx, cy, r, cursor, cursor + deg)
    cursor += deg
    return { path, color: PALETTE[i % PALETTE.length], title: slice.title, pct: slice.pct }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 背景サークル */}
        <circle cx={cx} cy={cy} r={r} fill="var(--color-bg-elevated)" />
        {paths.map((p, i) => (
          <path key={i} d={p.path} fill={p.color} opacity={0.9} />
        ))}
        {/* 中心の穴（ドーナツ風） */}
        <circle cx={cx} cy={cy} r={r * 0.45} fill="var(--color-bg-surface)" />
      </svg>

      {/* 凡例 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
        {paths.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '2px',
                backgroundColor: p.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: '12px',
                color: 'var(--color-text-mid)',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {p.title}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: p.color,
                fontWeight: 700,
              }}
            >
              {p.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
