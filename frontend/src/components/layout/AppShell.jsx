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
    return `${baseClass} border border-[#4b2474] bg-[#5b2d8e] text-white shadow-[0_2px_0_0_#4b2474]`
  }

  return `${baseClass} text-[#70538f] hover:bg-[#f3ebfb] hover:text-[#5b2d8e]`
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
    <div className="flex min-h-screen bg-[#f7f2fc] text-[#2f2141]">
      <aside className="hidden w-64 shrink-0 border-r-2 border-[#e6d9f3] bg-white p-5 md:flex md:flex-col">
        <div className="mb-6">
          <p className="text-lg font-semibold text-[#2f2141]">Lotus</p>
          <p className="text-xs text-[#70538f]">Task management</p>
        </div>

        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-xl border-2 border-[#e6d9f3] bg-[#faf7fe] p-3 text-sm shadow-[0_3px_0_0_#efe6f8]">
          <p className="font-medium text-[#2f2141]">{user?.name || 'Usuario'}</p>
          <p className="truncate text-[#70538f]">{user?.email || '-'}</p>
          <Button variant="outline" className="mt-3 w-full" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-[#e6d9f3] bg-white px-4 py-3 md:hidden">
          <button
            type="button"
            aria-label="Abrir menu"
            className="rounded-xl border-2 border-[#d8c8ea] bg-white px-3 py-2 text-sm font-medium text-[#5b2d8e] shadow-[0_2px_0_0_#efe6f8]"
            onClick={() => setIsMobileSidebarOpen(true)}
          >
            Menu
          </button>
          <p className="text-sm font-semibold text-[#2f2141]">Lotus</p>
          <Button variant="outline" className="h-9 w-auto px-3" onClick={handleLogout}>
            Sair
          </Button>
        </header>

        {isMobileSidebarOpen ? (
          <div
            className="fixed inset-0 z-40 bg-[#2f2141]/45 md:hidden"
            role="presentation"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegacao"
              className="h-full w-72 max-w-[85vw] border-r-2 border-[#e6d9f3] bg-white p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-lg font-semibold text-[#2f2141]">Navegacao</p>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  className="rounded-xl border-2 border-[#d8c8ea] px-2 py-1 text-sm text-[#5b2d8e]"
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

              <div className="mt-6 rounded-xl border-2 border-[#e6d9f3] bg-[#faf7fe] p-3 text-sm shadow-[0_3px_0_0_#efe6f8]">
                <p className="font-medium text-[#2f2141]">{user?.name || 'Usuario'}</p>
                <p className="truncate text-[#70538f]">{user?.email || '-'}</p>
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
