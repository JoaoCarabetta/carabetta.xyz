import { useState, type FormEvent } from 'react'
import { ScanLine, Sparkles } from 'lucide-react'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

/** Matches observed live "Nova análise" / Consulta destination (UI clone, no API). */
export function ConsultaPage() {
  const [handle, setHandle] = useState('')
  const [note, setNote] = useState('')

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!handle.trim()) {
      setNote('Informe um handle do Instagram.')
      return
    }
    setNote('Clone demo: análise não é enviada a um backend.')
  }

  return (
    <div className="min-h-screen bg-page">
      <AppSidebar />
      <div className="pl-20">
        <AppHeader breadcrumb={['Lulômetro', 'Análise', 'Analisar perfil']} />
        <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10 lg:px-10">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-pro-lula">
              <span className="inline-block h-2 w-2 rounded-full bg-pro-lula" />
              Análise
            </p>
            <h1 className="text-4xl font-bold tracking-tight">Consulta</h1>
            <p className="mt-2 max-w-2xl text-muted">
              Análise completa de qualquer perfil — coleta + pesquisa + Lulômetro (influenciador &amp;
              audiência). Se o perfil já foi analisado, a consulta atualiza os dados.
            </p>
          </div>

          <Card>
            <CardContent className="space-y-6 p-8">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-pro-lula">
                  <Sparkles className="h-3.5 w-3.5" />
                  Nova análise
                </p>
                <h2 className="text-2xl font-semibold">Analisar um perfil</h2>
                <p className="mt-2 text-sm text-muted">
                  Coleta perfil, 20 posts recentes, comentários, cruza watchlist, faz pesquisa profunda e
                  calcula os 2 Lulômetros. O perfil entra na base assim que a análise conclui. Se já
                  foi analisado, os dados são atualizados.
                </p>
              </div>

              <form className="space-y-4" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="handle">Handle do Instagram</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                      @
                    </span>
                    <Input
                      id="handle"
                      className="pl-8"
                      placeholder="nathfinancas"
                      value={handle.replace(/^@/, '')}
                      onChange={(e) => setHandle(e.target.value.replace(/^@/, ''))}
                    />
                  </div>
                </div>
                {note ? <p className="text-sm text-muted">{note}</p> : null}
                <Button type="submit" className="w-full">
                  <ScanLine className="h-4 w-4" />
                  Iniciar análise
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
