import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const langs = ['PT', 'EN', 'ES'] as const

type AppHeaderProps = {
  breadcrumb?: string[]
  lang?: (typeof langs)[number]
  onLangChange?: (lang: (typeof langs)[number]) => void
}

export function AppHeader({
  breadcrumb = ['Lulômetro', 'Análise', 'Lulômetro'],
  lang = 'PT',
  onLangChange,
}: AppHeaderProps) {
  const navigate = useNavigate()

  function logout() {
    sessionStorage.removeItem('lulometro-auth')
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-4 lg:px-8">
      <nav className="text-sm text-muted" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumb.map((crumb, index) => (
            <li key={`${crumb}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span className="text-faint">›</span> : null}
              <span className={index === breadcrumb.length - 1 ? 'font-medium text-ink' : undefined}>
                {crumb}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 rounded-full bg-white/70 p-1 text-xs font-semibold shadow-sm">
          {langs.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onLangChange?.(code)}
              className={cn(
                'rounded-full px-2.5 py-1 transition-colors',
                lang === code ? 'bg-slate-900 text-white' : 'text-muted hover:text-ink',
              )}
            >
              {code}
            </button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold">Barbara</div>
                  <div className="text-xs text-muted">barbara@percepta.lat</div>
                </div>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
                  Usuário
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4" />
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50 focus:text-red-700"
              onSelect={logout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
