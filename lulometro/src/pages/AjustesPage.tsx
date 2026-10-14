import { Pencil, Trash2 } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
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
import { nichos, variaveis } from '@/data/pages-mock'

export function AjustesPage() {
  return (
    <AppShell breadcrumb={['Lulômetro', 'Geral', 'Ajustes']}>
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8 lg:px-10">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pro-lula">
            <span className="inline-block h-2 w-2 rounded-full bg-pro-lula" />
            Configuração
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Ajustes</h1>
          <p className="mt-2 max-w-2xl text-muted">
            Métricas, temáticas e variáveis — as configurações valem a perfil de preferência pessoal.
          </p>
        </div>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold">Nichos &amp; Temáticas</h2>
              <p className="text-sm text-muted">
                {nichos.length} nichos criados para classificar e monitorar os temas em destaque.
              </p>
            </div>
            <p className="text-sm text-muted">{nichos.length} nichos</p>
          </div>

          <Card>
            <CardContent className="grid gap-3 p-4 md:grid-cols-[8rem_1fr_1.4fr_auto] md:items-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Adicionar nicho
              </p>
              <Input placeholder="Nome do nicho" />
              <Input placeholder="Busca rápida — selecione as palavras-chave vinculadas…" />
              <Button variant="secondary" disabled>
                + Adicionar
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="divide-y divide-slate-100 p-0">
              {nichos.map((nicho) => (
                <div
                  key={nicho.name}
                  className="flex items-start gap-3 px-4 py-3 sm:items-center"
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {nicho.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{nicho.name}</p>
                    <p className="text-sm text-muted">{nicho.description}</p>
                  </div>
                  <Badge variant="secondary">Ativo</Badge>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" aria-label={`Editar ${nicho.name}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" aria-label={`Excluir ${nicho.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold">Variáveis</h2>
              <p className="text-sm text-muted">
                Perfis etiquetados para análise. A classificação determina o impacto das mensagens por
                grupo.
              </p>
            </div>
            <p className="text-sm text-muted">{variaveis.length} perfis selecionados</p>
          </div>

          <Card>
            <CardContent className="grid gap-3 p-4 lg:grid-cols-[8rem_1fr_10rem_1.2fr_auto] lg:items-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Adicionar variáveis
              </p>
              <Input placeholder="@usuario" />
              <Select defaultValue="lula">
                <SelectTrigger>
                  <SelectValue placeholder="Lado político" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lula">Lula</SelectItem>
                  <SelectItem value="bolsonaro">Bolsonaro</SelectItem>
                  <SelectItem value="neutro">Neutro</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="moda">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nicho" />
                </SelectTrigger>
                <SelectContent>
                  {nichos.slice(0, 6).map((n) => (
                    <SelectItem key={n.name} value={n.name.toLowerCase()}>
                      {n.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="secondary">+ Adicionar</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Perfis etiquetados</CardTitle>
              <CardDescription>Demo data only — clone visual</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 p-0">
              {variaveis.map((item) => (
                <div key={item.handle} className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{item.handle.slice(1, 3).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{item.handle}</p>
                      <span
                        className={
                          item.side === 'LULA'
                            ? 'text-xs font-semibold text-pro-lula'
                            : item.side === 'BOLSONARO'
                              ? 'text-xs font-semibold text-pro-bolso'
                              : 'text-xs font-semibold text-neutro'
                        }
                      >
                        {item.side}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{item.detail}</p>
                  </div>
                  <Button size="icon" variant="ghost" aria-label={`Remover ${item.handle}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </AppShell>
  )
}
