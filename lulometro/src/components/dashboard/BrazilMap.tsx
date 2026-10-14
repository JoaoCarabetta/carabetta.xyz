import { states } from '@/data/mock'

/** Brazil outline + state intensity list (no circular placeholder). */
export function BrazilMap() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
      <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-[#efe8d8] p-4">
        <svg
          viewBox="0 0 260 280"
          className="mx-auto h-auto w-full max-w-md"
          role="img"
          aria-label="Mapa do Brasil por estado"
        >
          <path
            d="M132 18c22 3 42 14 58 30 14 14 26 34 30 54 5 22 2 44-6 64-7 18-20 34-36 46-14 10-30 18-48 22-20 4-40 2-58-6-18-8-34-22-44-40-10-16-16-36-16-56 0-22 8-44 22-62C50 38 72 24 98 20c10-2 22-2 34-2z"
            fill="#cfe8d8"
            stroke="#2f6b52"
            strokeWidth="2"
          />
          {/* Approximate regional blobs by intensity */}
          <path
            d="M150 70c18 4 30 18 34 34 2 12-2 24-12 34-12 10-28 14-42 10-14-4-24-16-26-30-2-14 6-28 18-36 8-6 18-10 28-12z"
            fill="#10b981"
            opacity="0.9"
          />
          <path
            d="M88 120c14 0 26 8 32 20 4 10 2 22-6 30-10 10-26 12-38 6-12-6-18-20-14-32 4-12 14-22 26-24z"
            fill="#86c9a8"
            opacity="0.95"
          />
          <path
            d="M120 160c16 2 28 12 34 26 4 10 2 22-8 30-12 10-30 12-44 4-12-6-18-20-14-34 4-12 16-24 32-26z"
            fill="#b45309"
            opacity="0.55"
          />
          <path
            d="M170 150c12 4 20 14 22 26 2 10-2 20-12 26-10 6-24 6-34-2-8-8-10-20-4-30 6-10 16-18 28-20z"
            fill="#f59e0b"
            opacity="0.65"
          />
          <text x="168" y="98" fontSize="9" fill="#0f172a" fontFamily="Inter, sans-serif" fontWeight="600">
            SP
          </text>
          <text x="148" y="128" fontSize="9" fill="#0f172a" fontFamily="Inter, sans-serif" fontWeight="600">
            RJ
          </text>
          <text x="118" y="118" fontSize="9" fill="#0f172a" fontFamily="Inter, sans-serif" fontWeight="600">
            MG
          </text>
          <text x="78" y="148" fontSize="9" fill="#0f172a" fontFamily="Inter, sans-serif" fontWeight="600">
            BA
          </text>
        </svg>
        <p className="mt-2 text-center text-xs text-muted">
          Intensidade por estado · menções na base
        </p>
      </div>

      <div className="space-y-3">
        {states.map((state) => (
          <div
            key={state.uf}
            className="grid grid-cols-[2.75rem_1fr_3.25rem] items-center gap-3 text-sm"
          >
            <div>
              <div className="font-semibold tabular-nums text-slate-800">{state.uf}</div>
              <div className="truncate text-[10px] text-muted">{state.name}</div>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-pro-lula"
                style={{ width: `${state.pct}%` }}
              />
            </div>
            <span className="text-right tabular-nums text-muted">{state.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
