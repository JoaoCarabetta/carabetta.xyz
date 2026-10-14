import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type SimpleShellPageProps = {
  title: string
  breadcrumb: string[]
  description: string
  status?: 'ok' | 'missing' | 'restricted'
  detail?: string
}

export function SimpleShellPage({
  title,
  breadcrumb,
  description,
  status = 'ok',
  detail,
}: SimpleShellPageProps) {
  return (
    <div className="min-h-screen bg-page">
      <AppSidebar />
      <div className="pl-20">
        <AppHeader breadcrumb={breadcrumb} />
        <main className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted">
              {status === 'missing' ? (
                <p>Destino observado como página inexistente (404) no ambiente live.</p>
              ) : null}
              {status === 'restricted' ? (
                <p>Destino observado como ambiente restrito no live.</p>
              ) : null}
              {detail ? <p>{detail}</p> : null}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
