import { CalendarDays, Plus, Users } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { campanhas } from '@/data/pages-mock'

export function CampanhasPage() {
  return (
    <AppShell breadcrumb={['Lulômetro', 'Gestão', 'Campanhas']}>
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pro-lula">
              <span className="inline-block h-2 w-2 rounded-full bg-pro-lula" />
              Campanhas
            </p>
            <h1 className="text-4xl font-bold tracking-tight">Campanhas</h1>
            <p className="mt-2 max-w-2xl text-muted">
              Grupos de influenciadores pra ativação em lote. Status de contato + posts da campanha.
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            Nova campanha
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {campanhas.map((campanha) => (
            <Card key={campanha.title} className="overflow-hidden">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                      Campanha
                    </p>
                    <h2 className="text-xl font-semibold">{campanha.title}</h2>
                  </div>
                  <Badge variant="success">Ativa</Badge>
                </div>

                <p className="text-sm text-muted">{campanha.description}</p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Metric label="Influs" value={String(campanha.influs)} />
                  <Metric label="Próximos" value={campanha.proximos} />
                  <Metric label="Postaram" value={campanha.postaram} />
                  <Metric label="Posts" value={String(campanha.posts)} highlight />
                </div>

                {campanha.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {campanha.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {campanha.influs} influenciadores
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    desde {campanha.since}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </AppShell>
  )
}

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={
        highlight
          ? 'rounded-lg bg-pro-lula px-3 py-2 text-white'
          : 'rounded-lg border border-slate-200 bg-slate-50 px-3 py-2'
      }
    >
      <p className={`text-[10px] font-semibold uppercase tracking-wide ${highlight ? 'text-white/80' : 'text-muted'}`}>
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  )
}
