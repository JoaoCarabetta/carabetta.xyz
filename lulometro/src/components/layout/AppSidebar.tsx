import { NavLink } from 'react-router-dom'
import {
  ClipboardList,
  Focus,
  GitBranch,
  History,
  Megaphone,
  Plus,
  Search,
  SlidersHorizontal,
  Thermometer,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navItems = [
  { to: '/consulta', icon: Plus, label: 'Nova', markActive: false },
  { to: '/lulometro', icon: Thermometer, label: 'Lulômetro', markActive: true },
  { to: '/consulta', icon: Focus, label: 'Consulta', markActive: true },
  { to: '/influenciadores', icon: History, label: 'Influenciadores', markActive: true },
  { to: '/top-contas', icon: GitBranch, label: 'Top contas', markActive: true },
  { to: '/busca', icon: Search, label: 'Busca', markActive: true },
  { to: '/campanhas', icon: Megaphone, label: 'Campanhas', markActive: true },
  { to: '/argentinometro', icon: ClipboardList, label: 'Argentinômetro', markActive: true },
  { to: '/ajustes', icon: SlidersHorizontal, label: 'Ajustes', markActive: true },
]

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-20 flex-col items-center bg-sidebar py-4 text-white">
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map(({ to, icon: Icon, label, markActive }) => (
          <NavLink
            key={`${label}-${to}-${Icon.displayName ?? label}`}
            to={to}
            end
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                markActive && isActive
                  ? 'bg-pro-lula text-white shadow-lg shadow-emerald-900/30'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
              )
            }
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-3">
        <Avatar className="h-10 w-10 border border-white/20">
          <AvatarFallback className="bg-pro-lula text-xs">BA</AvatarFallback>
        </Avatar>
      </div>
    </aside>
  )
}
