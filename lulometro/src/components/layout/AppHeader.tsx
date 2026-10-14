import { ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const langs = ['PT', 'EN', 'ES'] as const

export function AppHeader() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-4 lg:px-8">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>Lulômetro</li>
          <li className="text-faint">›</li>
          <li>Análise</li>
          <li className="text-faint">›</li>
          <li className="font-medium text-ink">Lulômetro</li>
        </ol>
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-full bg-white/70 p-1 text-xs font-semibold shadow-sm">
          {langs.map((lang) => (
            <button
              key={lang}
              type="button"
              className={cn(
                'rounded-full px-2.5 py-1 transition-colors',
                lang === 'PT' ? 'bg-slate-900 text-white' : 'text-muted hover:text-ink',
              )}
            >
              {lang}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="flex items-center gap-3 rounded-full py-1 pl-1 pr-2 text-left hover:bg-black/5"
        >
          <div className="hidden text-right sm:block">
            <div className="text-sm font-semibold leading-tight">Barbara</div>
            <div className="text-xs text-muted">barbara@percepta.lat</div>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback>BA</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-muted" />
        </button>
      </div>
    </header>
  )
}
