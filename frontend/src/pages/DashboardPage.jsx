import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Area protegida: visivel apenas com autenticacao.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-zinc-200 bg-zinc-100 p-4 text-sm text-zinc-700">
              <p>
                Usuario atual: <strong>{user?.name || '-'}</strong>
              </p>
              <p>Email: {user?.email || '-'}</p>
            </div>
            <Button variant="outline" onClick={clearAuth}>
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
