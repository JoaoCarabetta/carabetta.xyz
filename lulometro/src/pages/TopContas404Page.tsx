import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

/** Standalone 404 matching the live `/top-contas` capture (no app shell). */
export function TopContas404Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6 text-center">
      <p className="text-7xl font-bold tracking-tight text-ink md:text-8xl">404</p>
      <h1 className="mt-3 text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild className="mt-6 bg-[#e65127] hover:bg-[#d4471f]">
        <Link to="/lulometro">Go home</Link>
      </Button>
    </div>
  )
}
