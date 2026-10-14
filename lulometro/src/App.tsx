import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AjustesPage } from '@/pages/AjustesPage'
import { ArgentinometroPage } from '@/pages/ArgentinometroPage'
import { BuscaPage } from '@/pages/BuscaPage'
import { CampanhasPage } from '@/pages/CampanhasPage'
import { ConsultaPage } from '@/pages/ConsultaPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { InfluenciadoresPage } from '@/pages/InfluenciadoresPage'
import { LoginPage } from '@/pages/LoginPage'
import { TopContas404Page } from '@/pages/TopContas404Page'

function RequireAuth({ children }: { children: ReactNode }) {
  const authed = sessionStorage.getItem('lulometro-auth') === '1'
  if (!authed) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/lulometro"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/consulta"
        element={
          <RequireAuth>
            <ConsultaPage />
          </RequireAuth>
        }
      />
      <Route
        path="/influenciadores"
        element={
          <RequireAuth>
            <InfluenciadoresPage />
          </RequireAuth>
        }
      />
      <Route
        path="/top-contas"
        element={
          <RequireAuth>
            <TopContas404Page />
          </RequireAuth>
        }
      />
      <Route
        path="/busca"
        element={
          <RequireAuth>
            <BuscaPage />
          </RequireAuth>
        }
      />
      <Route
        path="/campanhas"
        element={
          <RequireAuth>
            <CampanhasPage />
          </RequireAuth>
        }
      />
      <Route
        path="/ajustes"
        element={
          <RequireAuth>
            <AjustesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/argentinometro"
        element={
          <RequireAuth>
            <ArgentinometroPage />
          </RequireAuth>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
