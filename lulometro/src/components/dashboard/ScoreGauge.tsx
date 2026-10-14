import { cn } from '@/lib/utils'

export function ScoreGauge({
  score,
  className,
}: {
  score: number
  className?: string
}) {
  const clamped = Math.max(0, Math.min(100, score))

  return (
    <div className={cn('relative pt-2', className)}>
      <div
        className="h-3 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, #ef4444 0%, #f59e0b 35%, #eab308 55%, #10b981 100%)',
        }}
      />
      <div
        className="absolute top-0 h-5 w-1 -translate-x-1/2 rounded-full bg-slate-950 shadow"
        style={{ left: `${clamped}%` }}
        aria-hidden
      />
      <div
        className="absolute -top-1 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent border-t-slate-950"
        style={{ left: `${clamped}%` }}
        aria-hidden
      />
    </div>
  )
}
