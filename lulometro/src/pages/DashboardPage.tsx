import { useMemo, useState } from 'react'
import { ArrowUpRight, ScanLine } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { BrazilMap } from '@/components/dashboard/BrazilMap'
import { ScoreGauge } from '@/components/dashboard/ScoreGauge'
import { SegmentBar } from '@/components/dashboard/SegmentBar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  baseStats,
  distribution,
  filterOptions,
  perfilA,
  perfilB,
  profiles,
  topOpposition,
  topSupporters,
  type ProfileFilter,
} from '@/data/mock'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function DashboardPage() {
  const [filter, setFilter] = useState<ProfileFilter>('geral')
  const [query, setQuery] = useState('')

  const filteredProfiles = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return profiles
    return profiles.filter(
      (p) => p.name.toLowerCase().includes(q) || p.meta.toLowerCase().includes(q),
    )
  }, [query])

  const subtitle =
    filter === 'perfil-a'
      ? perfilA.subtitle
      : filter === 'perfil-b'
        ? perfilB.subtitle
        : 'Tendência política dos perfis cadastrados, calculada a partir das análises automáticas.'

  return (
    <div className="min-h-screen bg-page">
      <AppSidebar />
      <div className="pl-20">
        <AppHeader />

        <main className="mx-auto max-w-7xl space-y-6 px-6 py-8 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pro-lula">
                <span className="inline-block h-2 w-2 rounded-full bg-pro-lula" />
                Análise política
              </p>
              <h1 className="text-4xl font-bold tracking-tight">Lulômetro</h1>
              <p className="mt-2 max-w-2xl text-muted">{subtitle}</p>
            </div>
            <Button className="shrink-0">
              <ScanLine className="h-4 w-4" />
              Nova análise
            </Button>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="space-y-5 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Base ativa
                  </p>
                  <div className="mt-1 flex items-end gap-3">
                    <span className="text-5xl font-bold tabular-nums tracking-tight md:text-6xl">
                      {baseStats.total}
                    </span>
                    <span className="mb-2 text-sm text-muted">perfis classificados</span>
                  </div>
                </div>
                <Badge variant="success" className="gap-1">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  +{baseStats.weekDelta} em 7 dias
                </Badge>
              </div>

              <SegmentBar
                segments={[
                  {
                    value: baseStats.proLula,
                    count: baseStats.proLula,
                    label: 'Pró-Lula',
                    color: '#10b981',
                  },
                  {
                    value: baseStats.neutro,
                    count: baseStats.neutro,
                    label: 'Neutro',
                    color: '#b45309',
                  },
                  {
                    value: baseStats.proBolsonaro,
                    count: baseStats.proBolsonaro,
                    label: 'Pró-Bolsonaro',
                    color: '#ef4444',
                  },
                ]}
              />
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Total na base',
                value: baseStats.total,
                hint: `+${baseStats.weekDelta} analisados em 7 dias`,
                accent: 'bg-slate-900',
              },
              {
                label: 'Pró-Lula',
                value: baseStats.proLula,
                hint: '48% da base',
                accent: 'bg-pro-lula',
              },
              {
                label: 'Neutro',
                value: baseStats.neutro,
                hint: '45% da base',
                accent: 'bg-neutro',
              },
              {
                label: 'Pró-Bolsonaro',
                value: baseStats.proBolsonaro,
                hint: '8% da base',
                accent: 'bg-pro-bolso',
              },
            ].map((card) => (
              <Card key={card.label} className="overflow-hidden">
                <CardContent className="p-5 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold tabular-nums">{card.value}</p>
                  <p className="mt-1 text-sm text-muted">{card.hint}</p>
                </CardContent>
                <div className={`h-1 ${card.accent}`} />
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Filtrar</p>
            <Select value={filter} onValueChange={(v) => setFilter(v as ProfileFilter)}>
              <SelectTrigger className="max-w-xl bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filter === 'geral' ? <GeralView /> : null}
          {filter === 'perfil-a' ? <PerfilAView /> : null}
          {filter === 'perfil-b' ? <PerfilBView /> : null}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição política</CardTitle>
                <CardDescription>Composição da base classificada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mx-auto h-56 w-full max-w-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={84}
                        paddingAngle={2}
                      >
                        {distribution.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm">
                  {distribution.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="font-semibold tabular-nums">{entry.value}</span>
                      <span className="text-muted">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top declarados Lula</CardTitle>
                <CardDescription>Maiores scores pró-governo na base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSupporters.map((person) => (
                  <div
                    key={person.handle}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-emerald-700">{initials(person.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{person.name}</p>
                      <p className="truncate text-xs text-muted">
                        {person.handle} · {person.party}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-pro-lula">
                      {person.score}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <CardTitle>Perfis da base</CardTitle>
                <CardDescription>Inclinação estimada por perfil</CardDescription>
              </div>
              <div className="flex w-full max-w-md gap-2">
                <Input
                  placeholder="Pesquisar perfil…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.name}
                  className="grid items-center gap-3 rounded-lg border border-slate-100 px-3 py-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_minmax(8rem,14rem)]"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{initials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{profile.name}</p>
                    <p className="truncate text-xs text-muted">{profile.meta}</p>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="bg-pro-lula" style={{ width: `${profile.lula}%` }} />
                    <div className="bg-neutro" style={{ width: `${profile.neutro}%` }} />
                    <div className="bg-pro-bolso" style={{ width: `${profile.bolso}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inclinação pró-Bolsonaro</CardTitle>
                <CardDescription>Destaques da oposição na base</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topOpposition.map((person) => (
                  <div
                    key={person.handle}
                    className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <Avatar>
                      <AvatarFallback className="bg-red-600">{initials(person.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{person.name}</p>
                      <p className="truncate text-xs text-muted">
                        {person.handle} · {person.party}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-pro-bolso">
                      {person.score}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparar dois perfis</CardTitle>
                <CardDescription>Selecione perfis para comparar scores</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <Select defaultValue={profiles[0].name}>
                  <SelectTrigger>
                    <SelectValue placeholder="Perfil A" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.slice(0, 6).map((p) => (
                      <SelectItem key={p.name} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue={profiles[1].name}>
                  <SelectTrigger>
                    <SelectValue placeholder="Perfil B" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.slice(0, 6).map((p) => (
                      <SelectItem key={`b-${p.name}`} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="sm:col-span-2" variant="secondary">
                  Comparar
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mapa da base · por estado</CardTitle>
              <CardDescription>Distribuição geográfica dos perfis classificados</CardDescription>
            </CardHeader>
            <CardContent>
              <BrazilMap />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function GeralView() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Termômetro político · influenciador
          </p>
          <CardTitle>Base completa</CardTitle>
          <CardDescription>{baseStats.total} perfis · média do score</CardDescription>
        </CardHeader>
        <CardContent className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <ScoreGauge score={baseStats.influencerScore} />
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold tabular-nums">{baseStats.influencerScore}</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              Score 0-100
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Termômetro político · audiência
          </p>
          <CardTitle>Audiência da base</CardTitle>
          <CardDescription>
            {baseStats.audienceProfiles} perfis com audiência analisada · média
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <ScoreGauge score={baseStats.audienceScore} />
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold tabular-nums">{baseStats.audienceScore}</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              Score 0-100
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PerfilAView() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Menções positivas
          </p>
          <CardTitle>Score de favorabilidade</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between gap-4">
          <div className="flex-1 space-y-4">
            <ScoreGauge score={perfilA.positives} />
            <div className="space-y-2">
              {perfilA.topics.map((topic) => (
                <div key={topic.label} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-2 text-sm">
                  <span className="text-muted">{topic.label}</span>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-pro-lula"
                      style={{ width: `${topic.value}%` }}
                    />
                  </div>
                  <span className="tabular-nums">{topic.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold tabular-nums text-pro-lula">{perfilA.positives}</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              Score 0-100
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Menções negativas
          </p>
          <CardTitle>Score de rejeição</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <ScoreGauge score={perfilA.negatives} />
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold tabular-nums text-pro-bolso">{perfilA.negatives}</div>
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">
              Score 0-100
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PerfilBView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Favorável</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-pro-lula">{perfilB.favorable}</p>
          </CardContent>
          <div className="h-1 bg-pro-lula" />
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Desfavorável</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-pro-bolso">
              {perfilB.unfavorable}
            </p>
          </CardContent>
          <div className="h-1 bg-pro-bolso" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Grande conquista
            </p>
            <CardTitle>Engajamento positivo</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <ScoreGauge score={perfilB.conquista} className="flex-1" />
            <div className="text-right">
              <div className="text-5xl font-bold tabular-nums">{perfilB.conquista}</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                Score 0-100
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Palavras em destaque
            </p>
            <CardTitle>Polarização lexical</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <ScoreGauge score={perfilB.palavras} className="flex-1" />
            <div className="text-right">
              <div className="text-5xl font-bold tabular-nums">{perfilB.palavras}</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">
                Score 0-100
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
