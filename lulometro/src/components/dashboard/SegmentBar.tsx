import { cn } from '@/lib/utils'

type Segment = {
  value: number
  color: string
  label: string
  count: number
  pct: number
}

export function SegmentBar({
  segments,
  className,
}: {
  segments: Segment[]
  className?: string
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex h-3.5 overflow-hidden rounded-full bg-slate-100">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className="h-full"
            style={{
              width: `${(segment.value / total) * 100}%`,
              backgroundColor: segment.color,
            }}
            title={`${segment.label}: ${segment.count}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: segment.color }}
            />
            <span className="font-semibold tabular-nums">{segment.count}</span>
            <span className="text-muted">|</span>
            <span className="tabular-nums text-muted">{segment.pct}%</span>
            <span className="text-muted">{segment.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
