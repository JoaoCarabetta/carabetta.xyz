import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { influenciadores } from '@/data/pages-mock'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function InfluenciadoresPage() {
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return influenciadores
    return influenciadores.filter(
      (row) =>
        row.name.toLowerCase().includes(needle) ||
        row.handle.toLowerCase().includes(needle) ||
        row.meta.toLowerCase().includes(needle),
    )
  }, [q])

  return (
    <AppShell breadcrumb={['Lulômetro', 'Análise', 'Influenciadores']}>
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pro-lula">
              <span className="inline-block h-2 w-2 rounded-full bg-pro-lula" />
              Base
            </p>
            <h1 className="text-4xl font-bold tracking-tight">Influenciadores</h1>
            <p className="mt-2 text-muted">
              Todos os influs da base com inclinação estimada pelo Lulômetro.
            </p>
          </div>
          <p className="text-sm font-medium text-muted">{rows.length} na lista</p>
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9"
            placeholder="Buscar nome ou @"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Todos os influs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.handle}
                className="grid items-center gap-3 rounded-lg border border-slate-100 px-3 py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_5rem_minmax(8rem,14rem)]"
              >
                <Avatar>
                  <AvatarFallback>{initials(row.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{row.name}</p>
                  <p className="truncate text-xs text-muted">
                    {row.handle} · {row.meta}
                  </p>
                </div>
                <p className="text-sm tabular-nums text-muted">{row.followers}</p>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="bg-pro-lula" style={{ width: `${row.lula}%` }} />
                  <div className="bg-neutro" style={{ width: `${row.neutro}%` }} />
                  <div className="bg-pro-bolso" style={{ width: `${row.bolso}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}
