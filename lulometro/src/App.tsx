import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ConsultaPage } from '@/pages/ConsultaPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoginPage } from '@/pages/LoginPage'
import { SimpleShellPage } from '@/pages/SimpleShellPage'

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
            <SimpleShellPage
              title="Influenciadores"
              breadcrumb={['Lulômetro', 'Influenciadores']}
              description="Lista de influs observada no live (clone stub)."
              detail="No live, esta rota carrega uma lista longa de perfis."
            />
          </RequireAuth>
        }
      />
      <Route
        path="/top-contas"
        element={
          <RequireAuth>
            <SimpleShellPage
              title="Top contas"
              breadcrumb={['Lulômetro', 'Top contas']}
              description="Contas mais seguidas"
              status="missing"
            />
          </RequireAuth>
        }
      />
      <Route
        path="/busca"
        element={
          <RequireAuth>
            <SimpleShellPage
              title="Busca"
              breadcrumb={['Lulômetro', 'Busca']}
              description="Interface de busca observada no live (clone stub)."
            />
          </RequireAuth>
        }
      />
      <Route
        path="/campanhas"
        element={
          <RequireAuth>
            <SimpleShellPage
              title="Campanhas"
              breadcrumb={['Lulômetro', 'Campanhas']}
              description="Gestão de campanhas observada no live (clone stub)."
              detail="Live mostrou cards com status ATIVA e CTA + NOVA CAMPANHA."
            />
          </RequireAuth>
        }
      />
      <Route
        path="/ajustes"
        element={
          <RequireAuth>
            <SimpleShellPage
              title="Ajustes"
              breadcrumb={['Lulômetro', 'Ajustes']}
              description="Nichos & Territórios"
            />
          </RequireAuth>
        }
      />
      <Route
        path="/argentinometro"
        element={
          <RequireAuth>
            <SimpleShellPage
              title="Argentinômetro"
              breadcrumb={['Lulômetro', 'Argentinômetro']}
              description="Ambiente restrito"
              status="restricted"
            />
          </RequireAuth>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
