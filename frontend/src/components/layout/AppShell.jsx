import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '../ui'
import { useAuthStore } from '../../stores/authStore'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projetos' },
  { to: '/tasks', label: 'Tarefas' },
]

function navLinkClass({ isActive }) {
  const baseClass = 'block rounded-md px-3 py-2 text-sm font-medium transition-colors'

  if (isActive) {
    return `${baseClass} bg-zinc-900 text-white`
  }

  return `${baseClass} text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900`
}

export function AppShell() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900">
      <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white p-5 md:flex md:flex-col">
        <div className="mb-6">
          <p className="text-lg font-semibold">Lotus</p>
          <p className="text-xs text-zinc-500">Task management</p>
        </div>

        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm">
          <p className="font-medium text-zinc-800">{user?.name || 'Usuario'}</p>
          <p className="truncate text-zinc-500">{user?.email || '-'}</p>
          <Button variant="outline" className="mt-3 w-full" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            aria-label="Abrir menu"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            Menu
          </button>
          <p className="text-sm font-semibold text-zinc-900">Lotus</p>
          <Button variant="outline" className="h-9 w-auto px-3" onClick={handleLogout}>
            Sair
          </Button>
        </header>

        {isMobileSidebarOpen ? (
          <div
            className="fixed inset-0 z-40 bg-zinc-950/40 md:hidden"
            role="presentation"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegacao"
              className="h-full w-72 max-w-[85vw] bg-white p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-lg font-semibold">Navegacao</p>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  className="rounded-md border border-zinc-300 px-2 py-1 text-sm text-zinc-700"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  Fechar
                </button>
              </div>

              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={navLinkClass}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-6 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm">
                <p className="font-medium text-zinc-800">{user?.name || 'Usuario'}</p>
                <p className="truncate text-zinc-500">{user?.email || '-'}</p>
              </div>
            </aside>
          </div>
        ) : null}

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
