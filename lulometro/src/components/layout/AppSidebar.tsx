import {
  ClipboardList,
  Focus,
  GitBranch,
  History,
  Megaphone,
  Plus,
  Search,
  Settings,
  Thermometer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Plus, label: 'Novo', active: false },
  { icon: Thermometer, label: 'Lulômetro', active: true },
  { icon: Focus, label: 'Análise', active: false },
  { icon: History, label: 'Histórico', active: false },
  { icon: GitBranch, label: 'Rede', active: false },
  { icon: Search, label: 'Busca', active: false },
  { icon: Megaphone, label: 'Campanhas', active: false },
  { icon: ClipboardList, label: 'Listas', active: false },
]

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-20 flex-col items-center bg-sidebar py-4 text-white">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-lg font-bold">
        +
      </div>
      <nav className="flex flex-1 flex-col items-center gap-2">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            type="button"
            title={label}
            aria-label={label}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
              active
                ? 'bg-pro-lula text-white shadow-lg shadow-emerald-900/30'
                : 'text-white/70 hover:bg-white/10 hover:text-white',
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        ))}
      </nav>
      <button
        type="button"
        title="Configurações"
        aria-label="Configurações"
        className="mt-auto flex h-11 w-11 items-center justify-center rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
      >
        <Settings className="h-5 w-5" strokeWidth={1.75} />
      </button>
    </aside>
  )
}
