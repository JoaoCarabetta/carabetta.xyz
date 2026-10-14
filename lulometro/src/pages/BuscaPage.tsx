import { useState } from 'react'
import { Funnel, Search, Sparkles } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const spectrum = [
  { label: 'Declarado Lula', color: '#10b981' },
  { label: 'Possível apoiador', color: '#34d399' },
  { label: 'Neutro', color: '#b45309' },
  { label: 'Provável Bolsonaro', color: '#f97316' },
  { label: 'Declarado Bolsonaro', color: '#ef4444' },
]

export function BuscaPage() {
  const [aiQuery, setAiQuery] = useState('')
  const [searched, setSearched] = useState(false)

  return (
    <AppShell breadcrumb={['Lulômetro', 'Análise', 'Busca']}>
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8 lg:px-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pro-lula">
              <span className="inline-block h-2 w-2 rounded-full bg-pro-lula" />
              Descoberta
            </p>
            <h1 className="text-4xl font-bold tracking-tight">Busca</h1>
            <p className="mt-2 text-muted">
              Encontre influenciadores na base pelos dados do Lulômetro.
            </p>
          </div>
          <p className="text-sm font-medium text-muted">1694 na base</p>
        </div>

        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-pro-lula">
              <Sparkles className="h-3.5 w-3.5" />
              Buscar com IA
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                className="flex-1"
                placeholder="Ex.: influ de moda com +500 mil seguidores, no RJ, pró-Lula"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
              />
              <Button type="button" onClick={() => setSearched(true)}>
                <Search className="h-4 w-4" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              <Funnel className="h-3.5 w-3.5" />
              Filtros
            </p>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2 xl:col-span-2">
                <Label>Nome ou @</Label>
                <Input placeholder="buscar..." />
              </div>
              <div className="space-y-2">
                <Label>Seguidores (mín - máx)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="min" />
                  <Input placeholder="máx" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Score Lulômetro (0-100)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="min" />
                  <Input placeholder="máx" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Score da audiência (0-100)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="min" />
                  <Input placeholder="máx" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input placeholder="ex.: Rio de Janeiro" />
              </div>
              <div className="space-y-2">
                <Label>Estado (UF)</Label>
                <Input placeholder="ex.: RJ" />
              </div>
              <div className="space-y-2">
                <Label>Nicho</Label>
                <Select defaultValue="todos">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="moda">Moda</SelectItem>
                    <SelectItem value="politica">Política</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Campanha</Label>
                <Select defaultValue="todas">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="senado">SENADO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-100 pt-4">
              {['Indicador do influenciador', 'Indicador da audiência'].map((title) => (
                <div key={title}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {title}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {spectrum.map((item) => (
                      <div key={`${title}-${item.label}`} className="flex items-center gap-1.5 text-xs text-muted">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex min-h-[220px] flex-col items-center justify-center gap-2 p-10 text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 text-muted">
              <Search className="h-6 w-6" />
            </div>
            <p className="font-medium">
              {searched ? 'Nenhum resultado nesta demo' : 'Busque para começar'}
            </p>
            <p className="max-w-md text-sm text-muted">
              Use a busca por IA, os filtros ou o campo de nome/@ para listar influenciadores.
            </p>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}
