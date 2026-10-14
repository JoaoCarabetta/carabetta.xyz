import { states } from '@/data/mock'

/** Simplified Brazil choropleth stand-in using proportional state bars + map silhouette */
export function BrazilMap() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#efe6d4] to-[#d9ecdf] p-6">
        <svg viewBox="0 0 200 220" className="h-64 w-auto drop-shadow-sm" aria-label="Mapa do Brasil">
          <path
            d="M98 12c18 2 34 10 48 24 12 12 22 28 26 46 4 18 2 36-4 52-6 14-16 28-30 38-10 8-22 14-34 18-14 4-28 4-40 0-16-6-30-18-40-32-8-12-14-26-16-40-2-16 0-32 6-46 8-16 20-30 36-38C66 18 82 12 98 12z"
            fill="#86c9a8"
            stroke="#2f6b52"
            strokeWidth="2"
          />
          <path
            d="M72 58c10-6 24-8 36-4 10 4 18 12 22 22 4 12 2 24-4 34-8 12-20 18-34 18-12 0-24-8-30-18-6-10-6-24 0-34 2-6 6-12 10-18z"
            fill="#b45309"
            opacity="0.55"
          />
          <path
            d="M110 110c12 2 22 10 28 20 4 8 4 18-2 26-8 10-20 14-32 12-10-2-18-10-22-18-4-10-2-22 6-30 6-6 14-10 22-10z"
            fill="#10b981"
            opacity="0.85"
          />
          <circle cx="118" cy="78" r="4" fill="#0f172a" />
          <text x="124" y="82" fontSize="8" fill="#0f172a" fontFamily="Inter, sans-serif">
            SP
          </text>
        </svg>
        <div className="absolute bottom-4 left-4 rounded-lg bg-white/80 px-3 py-2 text-xs text-muted shadow-sm">
          Intensidade por estado · menções na base
        </div>
      </div>

      <div className="space-y-3">
        {states.map((state) => (
          <div key={state.uf} className="grid grid-cols-[2.5rem_1fr_3rem] items-center gap-3 text-sm">
            <span className="font-semibold tabular-nums text-slate-700">{state.uf}</span>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
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
