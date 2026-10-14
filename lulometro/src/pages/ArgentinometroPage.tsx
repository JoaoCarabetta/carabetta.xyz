import { ShieldAlert } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Card, CardContent } from '@/components/ui/card'

export function ArgentinometroPage() {
  return (
    <AppShell breadcrumb={['Lulômetro', 'Argentinômetro', 'Perfis']}>
      <main className="mx-auto flex max-w-xl justify-center px-6 py-16 lg:px-10">
        <Card className="w-full">
          <CardContent className="flex flex-col items-center gap-3 px-8 py-12 text-center">
            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <ShieldAlert className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-semibold">Ambiente restrito</h1>
            <p className="text-sm text-muted">
              O Argentinômetro é exclusivo para usuários autorizados.
            </p>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}
