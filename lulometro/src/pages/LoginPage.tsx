import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.')
      return
    }
    setError('')
    // Demo auth — no secrets stored; any filled credentials enter the clone
    sessionStorage.setItem('lulometro-auth', '1')
    navigate('/lulometro')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="grid-bg relative hidden flex-col justify-between p-10 text-white lg:flex">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.18em]">
          <span className="text-lg leading-none">+</span>
          <span>LULÔMETRO</span>
        </div>

        <div className="max-w-md space-y-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-pro-lula">
            <span className="inline-block h-2 w-2 rounded-full bg-pro-lula" />
            Inteligência de discurso público
          </p>
          <h1 className="font-display text-4xl leading-tight xl:text-5xl">
            Onde cada perfil se posiciona.
          </h1>
        </div>

        <p className="text-sm text-white/45">Central de Influência - uso interno</p>
      </section>

      <section className="flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold tracking-[0.18em]">
              <span className="text-lg leading-none">+</span>
              <span>LULÔMETRO</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold tracking-tight">Entrar</h2>
          <p className="mt-2 text-muted">Acesse sua conta para continuar.</p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-11"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted hover:text-ink"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-pro-bolso">{error}</p> : null}

            <Button type="submit" className="h-11 w-full text-base">
              <ArrowRight className="h-4 w-4" />
              Entrar
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
