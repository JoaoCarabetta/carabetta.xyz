import type { ReactNode } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'

export function AppShell({
  breadcrumb,
  children,
}: {
  breadcrumb: string[]
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-page">
      <AppSidebar />
      <div className="pl-20">
        <AppHeader breadcrumb={breadcrumb} />
        {children}
      </div>
    </div>
  )
}
