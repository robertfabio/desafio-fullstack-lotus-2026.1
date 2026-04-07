import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Modal,
} from '../components/ui'

export function DashboardPage() {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const navigate = useNavigate()

  function handleLogout() {
    clearAuth()
    setIsLogoutModalOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Area protegida: visivel apenas com autenticacao.</CardDescription>
            <div className="pt-2">
              <Badge variant="success">Autenticado</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-zinc-200 bg-zinc-100 p-4 text-sm text-zinc-700">
              <p>
                Usuario atual: <strong>{user?.name || '-'}</strong>
              </p>
              <p>Email: {user?.email || '-'}</p>
            </div>
            <Button variant="default" onClick={() => navigate('/projects')}>
              Ver projetos
            </Button>
            <Button variant="default" onClick={() => navigate('/tasks')}>
              Ver tarefas
            </Button>
            <Button variant="outline" onClick={() => setIsLogoutModalOpen(true)}>
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>

      <Modal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Sair da conta"
        description="Deseja realmente encerrar sua sessao?"
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsLogoutModalOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleLogout}>Confirmar</Button>
        </div>
      </Modal>
    </main>
  )
}
