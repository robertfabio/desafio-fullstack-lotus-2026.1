import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui'

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [requestError, setRequestError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true)
      setRequestError('')

      try {
        const response = await api.get('/projects')
        setProjects(Array.isArray(response.data) ? response.data : [])
      } catch (error) {
        setRequestError(error.message || 'Nao foi possivel carregar os projetos')
      } finally {
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">Projetos</h1>
            <p className="text-sm text-zinc-600">Lista de projetos acessiveis para o usuario autenticado.</p>
          </div>
          <Button variant="outline" className="w-auto" onClick={() => navigate('/dashboard')}>
            Voltar para dashboard
          </Button>
        </div>

        {isLoading ? <p className="text-sm text-zinc-600">Carregando projetos...</p> : null}
        {requestError ? <p className="text-sm text-red-600">{requestError}</p> : null}

        {!isLoading && !requestError && projects.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-zinc-600">
              Nenhum projeto encontrado.
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !requestError && projects.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant={project.shared ? 'success' : 'outline'}>
                      {project.shared ? 'Compartilhado' : 'Privado'}
                    </Badge>
                  </div>
                  <CardDescription>{project.description || 'Sem descricao cadastrada.'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1 text-sm text-zinc-600">
                  <p>
                    <span className="font-medium text-zinc-800">Prazo:</span> {formatDate(project.deadline)}
                  </p>
                  <p>
                    <span className="font-medium text-zinc-800">Criado em:</span> {formatDate(project.created_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        ) : null}
      </div>
    </main>
  )
}
